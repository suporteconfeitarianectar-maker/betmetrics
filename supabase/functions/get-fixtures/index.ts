import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Allowed league IDs - only show these leagues
const ALLOWED_LEAGUES: Record<number, { country: string; priority: number }> = {
  // Brasil
  71: { country: 'Brasil', priority: 1 },    // Brasileirão Série A
  73: { country: 'Brasil', priority: 2 },    // Copa do Brasil
  // Inglaterra
  39: { country: 'Inglaterra', priority: 3 },  // Premier League
  40: { country: 'Inglaterra', priority: 4 },  // Championship
  // Espanha
  140: { country: 'Espanha', priority: 5 },   // La Liga
  143: { country: 'Espanha', priority: 6 },   // Copa del Rey
  // Alemanha
  78: { country: 'Alemanha', priority: 7 },   // Bundesliga
  81: { country: 'Alemanha', priority: 8 },   // DFB Pokal
  // Itália
  135: { country: 'Itália', priority: 9 },    // Serie A
  137: { country: 'Itália', priority: 10 },   // Coppa Italia
  // França
  61: { country: 'França', priority: 11 },    // Ligue 1
  66: { country: 'França', priority: 12 },    // Coupe de France
  // Arábia Saudita
  307: { country: 'Arábia Saudita', priority: 13 }, // Saudi Pro League
  308: { country: 'Arábia Saudita', priority: 14 }, // King's Cup
  // Turquia
  203: { country: 'Turquia', priority: 15 },  // Süper Lig
  206: { country: 'Turquia', priority: 16 },  // Turkish Cup
}

const ALLOWED_LEAGUE_IDS = Object.keys(ALLOWED_LEAGUES).map(Number)

// API-Football v3 response structure
interface APIv3Fixture {
  fixture: {
    id: number
    date: string
    timestamp: number
    status: {
      short: string
      long: string
    }
  }
  league: {
    id: number
    name: string
    country: string
    logo: string
    round: string
  }
  teams: {
    home: {
      id: number
      name: string
      logo: string
    }
    away: {
      id: number
      name: string
      logo: string
    }
  }
}

interface APIv3Response {
  response: APIv3Fixture[]
  errors: Record<string, string> | string[]
  results: number
}

interface TransformedFixture {
  id: number
  date: string
  timestamp: number
  status: string
  league: {
    id: number
    name: string
    country: string
    logo: string
    round: string
    priority: number
  }
  homeTeam: {
    id: number
    name: string
    logo: string
  }
  awayTeam: {
    id: number
    name: string
    logo: string
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Validate auth
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const token = authHeader.replace('Bearer ', '')
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token)
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const apiKey = Deno.env.get('API_FOOTBALL_KEY')
    if (!apiKey) {
      console.error('API_FOOTBALL_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0]
    
    console.log(`Fetching fixtures for date: ${today}`)
    console.log(`Filtering for ${ALLOWED_LEAGUE_IDS.length} allowed leagues`)

    // API-Football v3 with header authentication
    const apiUrl = `https://v3.football.api-sports.io/fixtures?date=${today}`
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-apisports-key': apiKey,
      },
    })

    const responseText = await response.text()
    console.log(`API-Football v3 response status: ${response.status}`)

    if (!response.ok) {
      console.error(`API-Football v3 error: ${response.status} ${response.statusText}`)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch fixtures', 
          status: response.status,
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let data: APIv3Response
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error('Failed to parse API response:', e)
      return new Response(
        JSON.stringify({ error: 'Failed to parse API response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error('API-Football v3 errors:', data.errors)
      return new Response(
        JSON.stringify({ fixtures: [], fixturesByLeague: {}, date: today, message: 'API returned errors', errors: data.errors }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Filter and transform fixtures
    const fixtures: TransformedFixture[] = data.response
      .filter((item) => ALLOWED_LEAGUE_IDS.includes(item.league.id))
      .map((item) => ({
        id: item.fixture.id,
        date: item.fixture.date,
        timestamp: item.fixture.timestamp,
        status: item.fixture.status.short,
        league: {
          id: item.league.id,
          name: item.league.name,
          country: ALLOWED_LEAGUES[item.league.id]?.country || item.league.country,
          logo: item.league.logo || '',
          round: item.league.round,
          priority: ALLOWED_LEAGUES[item.league.id]?.priority || 99,
        },
        homeTeam: {
          id: item.teams.home.id,
          name: item.teams.home.name,
          logo: item.teams.home.logo || '',
        },
        awayTeam: {
          id: item.teams.away.id,
          name: item.teams.away.name,
          logo: item.teams.away.logo || '',
        },
      }))
      .sort((a, b) => {
        // Sort by league priority first, then by time
        if (a.league.priority !== b.league.priority) {
          return a.league.priority - b.league.priority
        }
        return a.timestamp - b.timestamp
      })

    // Group fixtures by league
    const fixturesByLeague: Record<string, TransformedFixture[]> = {}
    fixtures.forEach((fixture) => {
      const leagueKey = `${fixture.league.id}-${fixture.league.name}`
      if (!fixturesByLeague[leagueKey]) {
        fixturesByLeague[leagueKey] = []
      }
      fixturesByLeague[leagueKey].push(fixture)
    })

    console.log(`Total fixtures from API: ${data.response.length}`)
    console.log(`Filtered fixtures (allowed leagues only): ${fixtures.length}`)
    console.log(`Number of leagues with fixtures: ${Object.keys(fixturesByLeague).length}`)

    return new Response(
      JSON.stringify({ fixtures, fixturesByLeague, date: today }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
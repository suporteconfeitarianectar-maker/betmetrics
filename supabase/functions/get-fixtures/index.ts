import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Allowed league IDs - only show these leagues
const ALLOWED_LEAGUES: Record<number, { country: string; name: string; priority: number }> = {
  // Brasil
  71: { country: 'Brasil', name: 'Série A', priority: 1 },
  72: { country: 'Brasil', name: 'Série B', priority: 2 },
  // Inglaterra
  39: { country: 'Inglaterra', name: 'Premier League', priority: 3 },
  40: { country: 'Inglaterra', name: 'Championship', priority: 4 },
  // Espanha
  140: { country: 'Espanha', name: 'La Liga', priority: 5 },
  141: { country: 'Espanha', name: 'La Liga 2', priority: 6 },
  // Alemanha
  78: { country: 'Alemanha', name: 'Bundesliga', priority: 7 },
  79: { country: 'Alemanha', name: '2. Bundesliga', priority: 8 },
  // Itália
  135: { country: 'Itália', name: 'Serie A', priority: 9 },
  136: { country: 'Itália', name: 'Serie B', priority: 10 },
  // França
  61: { country: 'França', name: 'Ligue 1', priority: 11 },
  62: { country: 'França', name: 'Ligue 2', priority: 12 },
  // Turquia
  203: { country: 'Turquia', name: 'Süper Lig', priority: 13 },
  // Arábia Saudita
  307: { country: 'Arábia Saudita', name: 'Saudi Pro League', priority: 14 },
}

const ALLOWED_LEAGUE_IDS = Object.keys(ALLOWED_LEAGUES).map(Number)

// API-Football v3 response structure
interface APIv3Fixture {
  fixture: {
    id: number
    date: string
    timestamp: number
    status: { short: string; long: string }
  }
  league: {
    id: number
    name: string
    country: string
    logo: string
    round: string
  }
  teams: {
    home: { id: number; name: string; logo: string }
    away: { id: number; name: string; logo: string }
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
  homeTeam: { id: number; name: string; logo: string }
  awayTeam: { id: number; name: string; logo: string }
}

// Helper to save cache entry
async function saveCache(
  supabaseAdmin: any,
  today: string,
  fixtures: TransformedFixture[],
  fixturesByLeague: Record<string, TransformedFixture[]>,
  apiCallsCount: number
) {
  const { error } = await supabaseAdmin
    .from('fixtures_cache')
    .upsert({
      cache_date: today,
      fixtures,
      fixtures_by_league: fixturesByLeague,
      api_calls_count: apiCallsCount,
    }, { onConflict: 'cache_date' })
  
  if (error) {
    console.error('Failed to save cache:', error)
  } else {
    console.log(`Cache saved for ${today} with ${fixtures.length} fixtures`)
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

    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const token = authHeader.replace('Bearer ', '')
    const { data: claimsData, error: claimsError } = await supabaseUser.auth.getClaims(token)
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Service role client for cache operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const today = new Date().toISOString().split('T')[0]
    console.log(`[${today}] Checking cache...`)

    // Check existing cache
    const { data: cacheData, error: cacheError } = await supabaseAdmin
      .from('fixtures_cache')
      .select('*')
      .eq('cache_date', today)
      .single()

    // CACHE HIT - return cached data (blocks multiple API calls)
    if (cacheData && !cacheError) {
      console.log(`[${today}] CACHE HIT - API calls today: ${cacheData.api_calls_count}`)
      return new Response(
        JSON.stringify({
          fixtures: cacheData.fixtures || [],
          fixturesByLeague: cacheData.fixtures_by_league || {},
          date: today,
          fromCache: true,
          apiCallsToday: cacheData.api_calls_count,
          message: 'Dados carregados do cache'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // CACHE MISS - Need to call API (only once per day)
    console.log(`[${today}] CACHE MISS - Calling API...`)

    const apiKey = Deno.env.get('API_FOOTBALL_KEY')
    if (!apiKey) {
      console.error('API_FOOTBALL_KEY not configured')
      // Save empty cache to prevent retry loops
      await saveCache(supabaseAdmin, today, [], {}, 0)
      return new Response(
        JSON.stringify({ 
          error: 'API key not configured',
          fixtures: [],
          fixturesByLeague: {},
          date: today,
          fromCache: false,
          message: 'Configuração pendente'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Call API-Football v3
    const apiUrl = `https://v3.football.api-sports.io/fixtures?date=${today}`
    console.log(`[${today}] API URL: ${apiUrl}`)

    let fixtures: TransformedFixture[] = []
    let fixturesByLeague: Record<string, TransformedFixture[]> = {}
    let apiError: string | null = null

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'x-apisports-key': apiKey },
      })

      const responseText = await response.text()
      console.log(`[${today}] API status: ${response.status}`)

      if (!response.ok) {
        apiError = `API error: ${response.status}`
        console.error(apiError)
      } else {
        const data: APIv3Response = JSON.parse(responseText)
        
        // Check for API errors
        if (data.errors && Object.keys(data.errors).length > 0) {
          apiError = JSON.stringify(data.errors)
          console.error(`[${today}] API errors:`, data.errors)
        } else {
          // Transform fixtures
          fixtures = data.response
            .filter((item) => ALLOWED_LEAGUE_IDS.includes(item.league.id))
            .map((item) => ({
              id: item.fixture.id,
              date: item.fixture.date,
              timestamp: item.fixture.timestamp,
              status: item.fixture.status.short,
              league: {
                id: item.league.id,
                name: ALLOWED_LEAGUES[item.league.id]?.name || item.league.name,
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
              if (a.league.priority !== b.league.priority) {
                return a.league.priority - b.league.priority
              }
              return a.timestamp - b.timestamp
            })

          // Group by league
          fixtures.forEach((fixture) => {
            const key = `${fixture.league.id}-${fixture.league.name}`
            if (!fixturesByLeague[key]) fixturesByLeague[key] = []
            fixturesByLeague[key].push(fixture)
          })

          console.log(`[${today}] Filtered: ${fixtures.length} of ${data.response.length}`)
        }
      }
    } catch (e) {
      apiError = `Fetch error: ${e}`
      console.error(apiError)
    }

    // ALWAYS save cache after API attempt (prevents multiple calls)
    await saveCache(supabaseAdmin, today, fixtures, fixturesByLeague, 1)

    return new Response(
      JSON.stringify({ 
        fixtures, 
        fixturesByLeague, 
        date: today,
        fromCache: false,
        apiCallsToday: 1,
        message: apiError 
          ? 'Dados do dia já carregados. Atualização disponível no próximo ciclo.'
          : 'Dados atualizados da API',
        error: apiError || undefined
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        fixtures: [],
        fixturesByLeague: {},
        message: 'Erro interno. Tente novamente mais tarde.'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

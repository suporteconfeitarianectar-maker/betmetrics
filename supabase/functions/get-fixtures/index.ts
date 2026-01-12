import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Fixture {
  fixture: {
    id: number
    date: string
    timestamp: number
  }
  league: {
    id: number
    name: string
    country: string
    logo: string
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

interface APIFootballResponse {
  response: Fixture[]
  errors: Record<string, string>
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
    console.log(`API Key present: ${!!apiKey}, length: ${apiKey.length}`)

    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${today}`,
      {
        method: 'GET',
        headers: {
          'x-apisports-key': apiKey,
        },
      }
    )

    // Log response details for debugging
    const responseText = await response.text()
    console.log(`API-Football response status: ${response.status}`)
    console.log(`API-Football response body: ${responseText.substring(0, 500)}`)

    if (!response.ok) {
      console.error(`API-Football error: ${response.status} ${response.statusText}`)
      console.error(`Response body: ${responseText}`)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch fixtures', 
          status: response.status,
          details: responseText.substring(0, 200)
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse the already-read response text
    const data: APIFootballResponse = JSON.parse(responseText)

    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error('API-Football errors:', data.errors)
      return new Response(
        JSON.stringify({ error: 'API returned errors', details: data.errors }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Transform to a simpler format for the frontend
    const fixtures = data.response.map((fixture) => ({
      id: fixture.fixture.id,
      date: fixture.fixture.date,
      timestamp: fixture.fixture.timestamp,
      league: {
        id: fixture.league.id,
        name: fixture.league.name,
        country: fixture.league.country,
        logo: fixture.league.logo,
      },
      homeTeam: {
        id: fixture.teams.home.id,
        name: fixture.teams.home.name,
        logo: fixture.teams.home.logo,
      },
      awayTeam: {
        id: fixture.teams.away.id,
        name: fixture.teams.away.name,
        logo: fixture.teams.away.logo,
      },
    }))

    console.log(`Returning ${fixtures.length} fixtures`)

    return new Response(
      JSON.stringify({ fixtures, date: today }),
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

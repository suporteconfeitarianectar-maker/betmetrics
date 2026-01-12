import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// API-Football v3 response structure
interface APIv3Fixture {
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

interface APIv3Response {
  response: APIv3Fixture[]
  errors: Record<string, string> | string[]
  results: number
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

    // API-Football v3 with header authentication
    const apiUrl = `https://v3.football.api-sports.io/fixtures?date=${today}`
    
    console.log(`Calling API URL: ${apiUrl}`)

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-apisports-key': apiKey,
      },
    })

    // Log response details for debugging
    const responseText = await response.text()
    console.log(`API-Football v3 response status: ${response.status}`)
    console.log(`API-Football v3 response body (first 500 chars): ${responseText.substring(0, 500)}`)

    if (!response.ok) {
      console.error(`API-Football v3 error: ${response.status} ${response.statusText}`)
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

    // Parse the response
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

    // Check for API errors
    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error('API-Football v3 errors:', data.errors)
      return new Response(
        JSON.stringify({ fixtures: [], date: today, message: 'API returned errors', errors: data.errors }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Transform to our format
    const fixtures = data.response.map((item) => ({
      id: item.fixture.id,
      date: item.fixture.date,
      timestamp: item.fixture.timestamp,
      league: {
        id: item.league.id,
        name: item.league.name,
        country: item.league.country,
        logo: item.league.logo || '',
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

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// API-Football v2 response structure
interface APIv2Match {
  match_id: string
  match_date: string
  match_time: string
  match_hometeam_id: string
  match_hometeam_name: string
  match_awayteam_id: string
  match_awayteam_name: string
  league_id: string
  league_name: string
  country_name: string
  league_logo: string
  team_home_badge: string
  team_away_badge: string
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

    // API-Football v2 uses query parameter for API key and different endpoint
    const apiUrl = `https://apiv2.apifootball.com/?action=get_events&from=${today}&to=${today}&APIkey=${apiKey}`
    
    console.log(`Calling API URL: ${apiUrl.replace(apiKey, 'HIDDEN')}`)

    const response = await fetch(apiUrl, {
      method: 'GET',
    })

    // Log response details for debugging
    const responseText = await response.text()
    console.log(`API-Football response status: ${response.status}`)
    console.log(`API-Football response body (first 500 chars): ${responseText.substring(0, 500)}`)

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

    // Parse the response
    let data: APIv2Match[]
    try {
      const parsed = JSON.parse(responseText)
      // API v2 returns array directly or error object
      if (Array.isArray(parsed)) {
        data = parsed
      } else if (parsed.error) {
        console.error('API-Football v2 error:', parsed.error)
        return new Response(
          JSON.stringify({ fixtures: [], date: today, message: parsed.error }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else {
        data = []
      }
    } catch (e) {
      console.error('Failed to parse API response:', e)
      return new Response(
        JSON.stringify({ error: 'Failed to parse API response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Transform to our format
    const fixtures = data.map((match) => ({
      id: parseInt(match.match_id),
      date: `${match.match_date}T${match.match_time}:00`,
      timestamp: new Date(`${match.match_date}T${match.match_time}:00`).getTime() / 1000,
      league: {
        id: parseInt(match.league_id),
        name: match.league_name,
        country: match.country_name,
        logo: match.league_logo || '',
      },
      homeTeam: {
        id: parseInt(match.match_hometeam_id),
        name: match.match_hometeam_name,
        logo: match.team_home_badge || '',
      },
      awayTeam: {
        id: parseInt(match.match_awayteam_id),
        name: match.match_awayteam_name,
        logo: match.team_away_badge || '',
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

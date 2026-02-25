import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: corsHeaders }
    )
  }

  try {
    let body = {}
    try {
      body = await req.json()
    } catch {
      body = {}
    }

    const code = body?.code

    if (!code) {
      return new Response(
        JSON.stringify({ error: "Missing reservation code" }),
        { status: 400, headers: corsHeaders }
      )
    }

    const clientId = Deno.env.get("GUESTY_CLIENT_ID")
    const clientSecret = Deno.env.get("GUESTY_CLIENT_SECRET")

    if (!clientId || !clientSecret) {
      return new Response(
        JSON.stringify({ error: "Missing Guesty credentials" }),
        { status: 500, headers: corsHeaders }
      )
    }

    // Get OAuth token
    const tokenResponse = await fetch(
      "https://open-api.guesty.com/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: clientId,
          client_secret: clientSecret,
        }),
      }
    )

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      return new Response(JSON.stringify(tokenData), {
        status: tokenResponse.status,
        headers: corsHeaders,
      })
    }

    const accessToken = tokenData.access_token

    // Fetch reservation
    const reservationResponse = await fetch(
      `https://open-api.guesty.com/v1/reservations?confirmationCode=${encodeURIComponent(code)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    const reservationData = await reservationResponse.json()

    return new Response(JSON.stringify(reservationData), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    })

  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: corsHeaders }
    )
  }
})
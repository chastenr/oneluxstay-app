const TOKEN_URL =
  process.env.GUESTY_TOKEN_URL || 'https://open-api.guesty.com/oauth2/token'
const BASE_URL =
  process.env.GUESTY_BASE_URL || 'https://open-api.guesty.com/v1'

let tokenCache = {
  accessToken: null,
  expiresAt: 0,
}

async function getAccessToken() {
  const clientId = process.env.GUESTY_CLIENT_ID
  const clientSecret = process.env.GUESTY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Missing Guesty credentials')
  }

  const now = Date.now()
  if (tokenCache.accessToken && now < tokenCache.expiresAt - 60000) {
    return tokenCache.accessToken
  }

  const tokenResponse = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })

  if (!tokenResponse.ok) {
    const text = await tokenResponse.text()
    throw new Error(`Token request failed (${tokenResponse.status}): ${text}`)
  }

  const tokenData = await tokenResponse.json()
  const expiresIn = Number(tokenData.expires_in || 0)

  tokenCache = {
    accessToken: tokenData.access_token,
    expiresAt: Date.now() + expiresIn * 1000,
  }

  return tokenCache.accessToken
}

async function guestyRequest(path, options = {}) {
  const token = await getAccessToken()
  const method = options.method || 'GET'
  const url = new URL(path, BASE_URL)

  if (options.query && typeof options.query === 'object') {
    Object.entries(options.query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value))
      }
    })
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  let body
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(options.body)
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    body,
  })

  const text = await response.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch (error) {
      data = { raw: text }
    }
  }

  if (!response.ok) {
    const error = new Error(
      `Guesty request failed (${response.status}): ${text}`
    )
    error.statusCode = response.status
    error.data = data
    throw error
  }

  return data
}

module.exports = {
  getAccessToken,
  guestyRequest,
}

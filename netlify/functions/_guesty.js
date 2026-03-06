const OPEN_API_HOST =
  process.env.GUESTY_OPEN_API_HOST || 'https://open-api.guesty.com'
const OPEN_API_V1 =
  process.env.GUESTY_BASE_URL || `${OPEN_API_HOST}/v1`
const TOKEN_STORE_NAME = process.env.GUESTY_TOKEN_BLOB_STORE || 'guesty-oauth'
const TOKEN_KEY = process.env.GUESTY_TOKEN_BLOB_KEY || 'access-token'
const TOKEN_REFRESH_BUFFER_MS = Number(
  process.env.GUESTY_TOKEN_REFRESH_BUFFER_MS || 60000
)

let blobStorePromise

const fetchWithTimeout = async (url, options = {}, timeout = 20000) => {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(id)
  }
}

const getBlobStore = async () => {
  if (!blobStorePromise) {
    blobStorePromise = (async () => {
      try {
        const { getStore } = await import('@netlify/blobs')
        const siteID = process.env.NETLIFY_SITE_ID
        const apiToken = process.env.NETLIFY_API_TOKEN
        return siteID && apiToken
          ? getStore(TOKEN_STORE_NAME, { siteID, token: apiToken })
          : getStore(TOKEN_STORE_NAME)
      } catch {
        return null
      }
    })()
  }
  return blobStorePromise
}

const requestGuestyToken = async () => {
  const clientId = process.env.GUESTY_OPEN_API_CLIENT_ID
  const clientSecret = process.env.GUESTY_OPEN_API_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Missing Guesty API credentials')
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: 'open-api',
    client_id: clientId,
    client_secret: clientSecret,
  })

  const response = await fetchWithTimeout(`${OPEN_API_HOST}/oauth2/token`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })

  const text = await response.text()
  let data = {}
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { raw: text }
  }

  if (!response.ok) {
    throw new Error(`Token request failed (${response.status}): ${text}`)
  }

  return data
}

const writeTokenToBlob = async (tokenData) => {
  const store = await getBlobStore()
  if (!store) return false
  await store.setJSON(TOKEN_KEY, tokenData)
  return true
}

const refreshAccessToken = async () => {
  const data = await requestGuestyToken()
  const tokenData = {
    token: data.access_token,
    expiresAt: Date.now() + Number(data.expires_in || 0) * 1000,
  }

  if (!tokenData.token) {
    throw new Error('Token response missing access_token')
  }

  await writeTokenToBlob(tokenData)
  globalThis.GUESTY_TOKEN = tokenData.token
  globalThis.GUESTY_TOKEN_EXPIRES = tokenData.expiresAt
  return tokenData
}

const getGuestyToken = async () => {
  const now = Date.now()

  if (
    globalThis.GUESTY_TOKEN &&
    Number(globalThis.GUESTY_TOKEN_EXPIRES || 0) > now + TOKEN_REFRESH_BUFFER_MS
  ) {
    return { token: globalThis.GUESTY_TOKEN, source: 'memory' }
  }

  const store = await getBlobStore()
  if (store) {
    let cached = await store.get(TOKEN_KEY, { type: 'json' })
    if (!cached) {
      const raw = await store.get(TOKEN_KEY, { type: 'text' })
      if (raw) {
        try {
          cached = JSON.parse(raw)
        } catch {
          cached = null
        }
      }
    }

    const cachedToken = cached?.token || cached?.access_token || cached?.accessToken
    const cachedExpiry = Number(cached?.expiresAt ?? cached?.expires_at ?? 0)
    if (cachedToken && cachedExpiry > now + TOKEN_REFRESH_BUFFER_MS) {
      globalThis.GUESTY_TOKEN = cachedToken
      globalThis.GUESTY_TOKEN_EXPIRES = cachedExpiry
      return { token: cachedToken, source: 'blob' }
    }
  }

  const tokenData = await refreshAccessToken()
  return { token: tokenData.token, source: 'fresh' }
}

async function getAccessToken() {
  const { token } = await getGuestyToken()
  return token
}

async function guestyRequest(path, options = {}) {
  const { token } = await getGuestyToken()
  const method = options.method || 'GET'
  const url = new URL(path, OPEN_API_V1)

  if (options.query && typeof options.query === 'object') {
    Object.entries(options.query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (typeof value === 'object') {
          url.searchParams.set(key, JSON.stringify(value))
        } else {
          url.searchParams.set(key, String(value))
        }
      }
    })
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  }

  let body
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(options.body)
  }

  const response = await fetchWithTimeout(url.toString(), {
    method,
    headers,
    body,
  })

  const text = await response.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { raw: text }
    }
  }

  if (!response.ok) {
    const error = new Error(`Guesty request failed (${response.status}): ${text}`)
    error.statusCode = response.status
    error.data = data
    throw error
  }

  return data
}

module.exports = {
  getAccessToken,
  getGuestyToken,
  refreshAccessToken,
  guestyRequest,
}


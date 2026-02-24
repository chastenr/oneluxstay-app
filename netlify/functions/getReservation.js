const { guestyRequest } = require('./_guesty')

const headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'content-type',
  'access-control-allow-methods': 'POST, OPTIONS',
}

function normalizeResults(data) {
  if (!data) return []
  if (Array.isArray(data.results)) return data.results
  if (Array.isArray(data.data)) return data.data
  if (Array.isArray(data)) return data
  if (data.reservation) return [data.reservation]
  return []
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  let payload
  try {
    payload = JSON.parse(event.body ?? '{}')
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    }
  }

  const code = String(payload.code ?? '').trim()
  if (!code) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Reservation code is required' }),
    }
  }

  try {
    const query = payload.query && typeof payload.query === 'object'
      ? payload.query
      : { confirmationCode: code }

    const guestyData = await guestyRequest('/reservations', { query })
    const results = normalizeResults(guestyData)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ results, raw: guestyData }),
    }
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers,
      body: JSON.stringify({
        error: error.message || 'Guesty request failed',
        details: error.data || null,
      }),
    }
  }
}

const { guestyRequest } = require('./_guesty')

const headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'content-type',
  'access-control-allow-methods': 'POST, OPTIONS',
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

  if (!payload || Object.keys(payload).length === 0) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Reservation payload is required' }),
    }
  }

  try {
    const guestyData = await guestyRequest('/reservations', {
      method: 'POST',
      body: payload,
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ data: guestyData }),
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

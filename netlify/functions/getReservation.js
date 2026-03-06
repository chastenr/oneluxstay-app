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

function buildIdVariants(value) {
  const trimmed = String(value ?? '').trim()
  if (!trimmed) return []
  const withoutResPrefix = trimmed.replace(/^res[.\-:\s]*/i, '').trim()
  const values = [trimmed, trimmed.toUpperCase(), withoutResPrefix, withoutResPrefix.toUpperCase()]
  return [...new Set(values.filter(Boolean))]
}

const RESERVATION_FIELDS = [
  '_id',
  'confirmationCode',
  'status',
  'listingId',
  'listing._id',
  'listing.title',
  'guest._id',
  'guest.fullName',
  'checkIn',
  'checkOut',
  'checkInDateLocalized',
  'checkOutDateLocalized',
].join(' ')

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

  const reservationId = String(payload.reservationId ?? payload.code ?? '').trim()
  if (!reservationId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Reservation ID is required' }),
    }
  }

  try {
    const ids = buildIdVariants(reservationId)

    const queryStrategies =
      payload.query && typeof payload.query === 'object'
        ? [payload.query]
        : [
            {
              fields: RESERVATION_FIELDS,
              filters: [
                {
                  operator: '$in',
                  field: 'confirmationCode',
                  value: ids,
                },
              ],
              sort: '_id',
              skip: 0,
              limit: 100,
            },
            {
              fields: RESERVATION_FIELDS,
              filters: [
                {
                  operator: '$in',
                  field: '_id',
                  value: ids,
                },
              ],
              sort: '_id',
              skip: 0,
              limit: 100,
            },
          ]

    let guestyData = null
    let results = []

    for (const query of queryStrategies) {
      try {
        const response = await guestyRequest('/reservations', { query })
        const normalized = normalizeResults(response)
        guestyData = response
        results = normalized
        if (normalized.length > 0) break
      } catch (error) {
        if (error.statusCode === 401 || error.statusCode === 403) {
          throw error
        }
      }
    }

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

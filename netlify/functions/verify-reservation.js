const headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'content-type',
  'access-control-allow-methods': 'POST, OPTIONS',
};

const mockReservation = {
  reservationId: 'RES-1001',
  guestName: 'Alex Morgan',
  propertyName: 'One Lux Stay - Oceanfront Suite',
  propertyAddress: '123 Seaside Blvd, Miami, FL',
  checkIn: '2026-03-12T15:00:00Z',
  checkOut: '2026-03-15T11:00:00Z',
  access: {
    doorCode: '4281#',
    wifiName: 'OneLuxStay',
    wifiPassword: 'Stay2026',
    parking: 'Garage Level 2 - Spot 18',
    mapUrl: 'https://maps.google.com/?q=123+Seaside+Blvd+Miami+FL',
    houseManualUrl: 'https://example.com/house-manual',
  },
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body ?? '{}');
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const code = String(payload.code ?? '').trim().toUpperCase();

  if (!code) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Reservation code is required' }),
    };
  }

  if (code !== 'TEST123') {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Reservation not found' }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'verified',
      reservation: mockReservation,
    }),
  };
};

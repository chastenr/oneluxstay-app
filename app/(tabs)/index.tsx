import { useState } from 'react'
import { View, TextInput, Button, Text } from 'react-native'
import { supabase } from '../../lib/supabase'

const RESERVATION_ENDPOINT =
  process.env.EXPO_PUBLIC_GUESTY_ENDPOINT ||
  'https://YOUR_NETLIFY_SITE.netlify.app/.netlify/functions/getReservation'

type Reservation = {
  id?: string
  created_at?: string
  app_code?: string
  reservation_id?: string
  listing_id?: string
  checkin?: string
  checkout?: string
}

type Listing = {
  id?: string
  created_at?: string
  listing_id?: string
  wifi_name?: string
  wifi_password?: string
  door_code?: string
  checkin_instructions?: string
}

export default function Home() {
  const [code, setCode] = useState('')
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [listing, setListing] = useState<Listing | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

const checkCode = async () => {
  if (!code.trim()) {
    setErrorMessage('Please enter your reservation code')
    return
  }

  setLoading(true)
  setErrorMessage('')
  setReservation(null)
  setListing(null)

  try {
    if (RESERVATION_ENDPOINT.includes('YOUR_NETLIFY_SITE')) {
      setErrorMessage('Set EXPO_PUBLIC_GUESTY_ENDPOINT to your Netlify URL')
      setLoading(false)
      return
    }

    const response = await fetch(
      RESERVATION_ENDPOINT,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      }
    )

    const data = await response.json()
    console.log("Guesty response:", data)

    if (!response.ok || !data.results || data.results.length === 0) {
      setErrorMessage('Invalid reservation code')
      setLoading(false)
      return
    }

    const reservationData = data.results[0]

    setReservation({
      reservation_id: reservationData.confirmationCode,
      listing_id: reservationData.listingId,
      checkin: reservationData.checkInDate,
      checkout: reservationData.checkOutDate,
    })

    // Fetch listing info from Supabase
    if (reservationData.listingId) {
      const { data: listingData } = await supabase
        .from('Listings')
        .select('*')
        .eq('listing_id', reservationData.listingId)
        .single()

      if (listingData) {
        setListing(listingData)
      }
    }

  } catch (error) {
    console.log(error)
    setErrorMessage('Something went wrong')
  }

  setLoading(false)
}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Your Reservation</Text>
      <Text style={styles.subtitle}>
        Enter your code to view your stay details.
      </Text>

      <TextInput
        placeholder="Enter Reservation Code"
        value={code}
        onChangeText={setCode}
        autoCapitalize="characters"
        style={styles.input}
        placeholderTextColor="#8B8F97"
      />

      <View style={styles.buttonWrap}>
        <Button
          title={loading ? 'Checking...' : 'Check Reservation'}
          onPress={checkCode}
          disabled={loading}
        />
      </View>

      {errorMessage !== '' && (
        <Text style={styles.error}>{errorMessage}</Text>
      )}

      {reservation && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Reservation Found</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reservation Details</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Reservation ID</Text>
              <Text style={styles.value}>
                {reservation.reservation_id || '—'}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Listing ID</Text>
              <Text style={styles.value}>
                {reservation.listing_id || '—'}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Check-in</Text>
              <Text style={styles.value}>
                {reservation.checkin || '—'}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Check-out</Text>
              <Text style={styles.value}>
                {reservation.checkout || '—'}
              </Text>
            </View>
          </View>

          {listing && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Access</Text>

                <View style={styles.row}>
                  <Text style={styles.label}>Door Code</Text>
                  <Text style={styles.value}>
                    {listing.door_code || '—'}
                  </Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>WiFi</Text>

                <View style={styles.row}>
                  <Text style={styles.label}>Network</Text>
                  <Text style={styles.value}>
                    {listing.wifi_name || '—'}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Password</Text>
                  <Text style={styles.value}>
                    {listing.wifi_password || '—'}
                  </Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Check-in Instructions
                </Text>
                <Text style={styles.instructions}>
                  {listing.checkin_instructions || '—'}
                </Text>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  )
}

const styles = {
  container: {
    padding: 32,
    paddingTop: 56,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0D1B2A',
  },
  subtitle: {
    fontSize: 14,
    color: '#5C677D',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D9DDE6',
    backgroundColor: '#F7F9FC',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    color: '#0D1B2A',
  },
  buttonWrap: {
    marginTop: 6,
  },
  error: {
    marginTop: 12,
    color: '#B00020',
    fontWeight: '600',
  },
  card: {
    marginTop: 18,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E9F0',
    shadowColor: '#0D1B2A',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D1B2A',
    marginBottom: 12,
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: '#5C677D',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F7',
  },
  label: {
    fontSize: 13,
    color: '#5C677D',
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0D1B2A',
  },
  instructions: {
    fontSize: 13,
    color: '#0D1B2A',
    lineHeight: 18,
  },
}

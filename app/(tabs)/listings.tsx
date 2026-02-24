import { useEffect, useState } from 'react'
import { ScrollView, Text, View, ActivityIndicator } from 'react-native'
import { supabase } from '../../lib/supabase'

type Listing = {
  id?: number
  created_at?: string
  listing_id?: string
  wifi_name?: string
  wifi_password?: string
  door_code?: string
  checkin_instructions?: string
}

export default function ListingsScreen() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setErrorMessage('')
      const { data, error } = await supabase
        .from('Listings')
        .select('*')
        .order('created_at', { ascending: false })

      if (!mounted) return
      if (error) {
        setErrorMessage('Unable to load listings')
        setListings([])
      } else {
        setListings(data || [])
      }
      setLoading(false)
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Listings</Text>
      <Text style={styles.subtitle}>Property access details and WiFi info.</Text>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.helper}>Loading listings...</Text>
        </View>
      )}

      {!loading && errorMessage !== '' && (
        <Text style={styles.error}>{errorMessage}</Text>
      )}

      {!loading && errorMessage === '' && listings.length === 0 && (
        <Text style={styles.helper}>No listings found.</Text>
      )}

      {!loading &&
        errorMessage === '' &&
        listings.map((listing) => (
          <View key={listing.id ?? listing.listing_id} style={styles.card}>
            <Text style={styles.cardTitle}>
              {listing.listing_id || 'Listing'}
            </Text>

            <View style={styles.row}>
              <Text style={styles.label}>Door Code</Text>
              <Text style={styles.value}>{listing.door_code || '—'}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>WiFi Name</Text>
              <Text style={styles.value}>{listing.wifi_name || '—'}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>WiFi Password</Text>
              <Text style={styles.value}>{listing.wifi_password || '—'}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Check-in Instructions</Text>
              <Text style={styles.instructions}>
                {listing.checkin_instructions || '—'}
              </Text>
            </View>
          </View>
        ))}
    </ScrollView>
  )
}

const styles = {
  container: {
    padding: 32,
    paddingTop: 56,
    gap: 12,
  },
  center: {
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
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
  helper: {
    fontSize: 13,
    color: '#5C677D',
  },
  error: {
    marginTop: 12,
    color: '#B00020',
    fontWeight: '600',
  },
  card: {
    marginTop: 10,
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
    marginBottom: 10,
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
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: '#5C677D',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  instructions: {
    fontSize: 13,
    color: '#0D1B2A',
    lineHeight: 18,
  },
}

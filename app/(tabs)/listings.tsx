import { useEffect, useState } from 'react'
import { ScrollView, Text, View, ActivityIndicator, StyleSheet } from 'react-native'
import { supabase } from '../../lib/supabase'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { Fonts } from '@/constants/theme'

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
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>FUTURES</Text>
        <Text style={styles.title}>Access details at a glance.</Text>
        <Text style={styles.subtitle}>Property access details and Wi-Fi information.</Text>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator color={palette.gold} />
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
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{listing.listing_id || 'Listing'}</Text>
              <IconSymbol name="key.fill" size={18} color={palette.gold} />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Door Code</Text>
              <Text style={styles.value}>{listing.door_code || '—'}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Wi-Fi Name</Text>
              <Text style={styles.value}>{listing.wifi_name || '—'}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Wi-Fi Password</Text>
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

const palette = {
  night: '#14252A',
  gold: '#C7A36A',
  sand: '#F6F1E8',
  cream: '#FFFBF5',
  haze: '#E6D9C9',
  muted: '#8F8072',
  error: '#B54A3A',
}

const styles = StyleSheet.create({
  container: {
    padding: 26,
    paddingTop: 40,
    backgroundColor: palette.sand,
    gap: 14,
  },
  header: {
    gap: 6,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    color: palette.muted,
    fontFamily: Fonts.sans,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    color: palette.night,
    fontFamily: Fonts.serif,
  },
  subtitle: {
    fontSize: 13,
    color: palette.muted,
    fontFamily: Fonts.sans,
  },
  center: {
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  helper: {
    fontSize: 13,
    color: palette.muted,
    fontFamily: Fonts.sans,
  },
  error: {
    marginTop: 12,
    color: palette.error,
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },
  card: {
    marginTop: 4,
    padding: 16,
    borderRadius: 18,
    backgroundColor: palette.cream,
    borderWidth: 1,
    borderColor: palette.haze,
    shadowColor: '#1C1914',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    color: palette.night,
    fontFamily: Fonts.rounded,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#EFE5D8',
  },
  label: {
    fontSize: 13,
    color: palette.muted,
    fontFamily: Fonts.sans,
  },
  value: {
    fontSize: 13,
    fontFamily: Fonts.sans,
    color: palette.night,
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: Fonts.sans,
    letterSpacing: 0.6,
    color: palette.muted,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  instructions: {
    fontSize: 13,
    color: palette.night,
    lineHeight: 18,
    fontFamily: Fonts.sans,
  },
})

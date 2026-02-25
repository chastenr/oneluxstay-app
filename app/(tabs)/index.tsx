import { useState } from 'react'
import {
  View,
  TextInput,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native'
import { supabase } from '../../lib/supabase'

const RESERVATION_ENDPOINT =
  "https://xjyjupxhvprbwiravysf.supabase.co/functions/v1/guesty-fetch"

export default function Home() {
  const [code, setCode] = useState('')
  const [reservation, setReservation] = useState<any>(null)
  const [listing, setListing] = useState<any>(null)
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
      const response = await fetch(RESERVATION_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      })

      const text = await response.text()

      if (!response.ok) {
        console.log("Server error:", text)
        setErrorMessage("Server error")
        setLoading(false)
        return
      }

      const data = JSON.parse(text)

      if (!data.results || data.results.length === 0) {
        setErrorMessage('Invalid reservation code')
        setLoading(false)
        return
      }

      const reservationData = data.results[0]

      setReservation(reservationData)

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

  const isDisabled = loading || !code.trim()

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background} pointerEvents="none">
        <View style={styles.orbOne} />
        <View style={styles.orbTwo} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Find Your Reservation</Text>
        <Text style={styles.subtitle}>
          Enter your code to unlock check-in details for your stay.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Reservation Code</Text>
          <TextInput
            placeholder="Enter Reservation Code"
            placeholderTextColor="#8B867C"
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            style={styles.input}
          />

          <Pressable
            onPress={checkCode}
            disabled={isDisabled}
            style={({ pressed }) => [
              styles.button,
              isDisabled && styles.buttonDisabled,
              pressed && !isDisabled && styles.buttonPressed,
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#F6F1EA" />
            ) : (
              <Text style={styles.buttonText}>Check Reservation</Text>
            )}
          </Pressable>

          {errorMessage !== '' && (
            <Text style={styles.error}>{errorMessage}</Text>
          )}
        </View>

        {reservation && (
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Reservation Summary</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Confirmation</Text>
              <Text style={styles.detailValue}>
                {reservation.confirmationCode}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Listing</Text>
              <Text style={styles.detailValue}>{reservation.listingId}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Check-in</Text>
              <Text style={styles.detailValue}>{reservation.checkInDate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Check-out</Text>
              <Text style={styles.detailValue}>{reservation.checkOutDate}</Text>
            </View>

            {listing && (
              <View style={styles.listingBlock}>
                <Text style={styles.detailsSubtitle}>Access Details</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Door code</Text>
                  <Text style={styles.detailValue}>{listing.door_code}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>WiFi</Text>
                  <Text style={styles.detailValue}>{listing.wifi_name}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Password</Text>
                  <Text style={styles.detailValue}>{listing.wifi_password}</Text>
                </View>
                {listing.checkin_instructions ? (
                  <Text style={styles.instructions}>
                    {listing.checkin_instructions}
                  </Text>
                ) : null}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F1EA',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  orbOne: {
    position: 'absolute',
    top: -120,
    left: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#E8D6B9',
    opacity: 0.7,
  },
  orbTwo: {
    position: 'absolute',
    bottom: -140,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#D7E0DB',
    opacity: 0.8,
  },
  container: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 32,
    alignItems: 'center',
  },
  logo: {
    width: 72,
    height: 72,
    marginBottom: 16,
    borderRadius: 18,
    backgroundColor: '#FDFBF7',
    shadowColor: '#1F1A12',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    color: '#1F1A12',
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: '#4B463E',
    textAlign: 'center',
    maxWidth: 320,
  },
  card: {
    width: '100%',
    marginTop: 24,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#FDFBF7',
    borderWidth: 1,
    borderColor: '#E5DDD1',
    shadowColor: '#1F1A12',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  label: {
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: '#7A7368',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D8CFC2',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F1A12',
  },
  button: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0F3D3E',
    alignItems: 'center',
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#F6F1EA',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  error: {
    marginTop: 12,
    color: '#B8442F',
    fontSize: 14,
  },
  detailsCard: {
    width: '100%',
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5DDD1',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F1A12',
    marginBottom: 12,
  },
  detailsSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F1A12',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 13,
    color: '#6C655B',
  },
  detailValue: {
    fontSize: 13,
    color: '#1F1A12',
    fontWeight: '600',
    marginLeft: 12,
    flexShrink: 1,
    textAlign: 'right',
  },
  listingBlock: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EFE6DA',
  },
  instructions: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 20,
    color: '#4B463E',
  },
})

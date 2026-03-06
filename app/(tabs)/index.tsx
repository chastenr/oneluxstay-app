import { useEffect, useRef, useState } from 'react'
import {
  View,
  TextInput,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
  Easing,
  Linking,
} from 'react-native'
import { supabase } from '../../lib/supabase'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { Fonts } from '@/constants/theme'

const RESERVATION_ENDPOINT =
  process.env.EXPO_PUBLIC_RESERVATION_ENDPOINT ||
  'https://oneluxstayprop.netlify.app/.netlify/functions/getReservation'

type FlowState = 'prompt' | 'lookup' | 'no-reservation' | 'dashboard'

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }
  return ''
}

function formatDateTime(value: unknown) {
  if (!value) return '-'
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function Home() {
  const [flow, setFlow] = useState<FlowState>('prompt')
  const [reservationId, setReservationId] = useState('')
  const [reservation, setReservation] = useState<any>(null)
  const [listing, setListing] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const floatAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 5200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 5200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    )

    loop.start()
    return () => {
      loop.stop()
    }
  }, [floatAnim])

  const resetSearch = () => {
    setReservationId('')
    setReservation(null)
    setListing(null)
    setErrorMessage('')
    setLoading(false)
    setFlow('prompt')
  }

  const fetchListing = async (listingId: string) => {
    const { data } = await supabase
      .from('Listings')
      .select('*')
      .eq('listing_id', listingId)
      .maybeSingle()
    setListing(data || null)
  }

  const checkReservation = async () => {
    if (!reservationId.trim()) {
      setErrorMessage('Please enter your reservation ID')
      return
    }

    if (!RESERVATION_ENDPOINT) {
      setErrorMessage(
        'Set EXPO_PUBLIC_RESERVATION_ENDPOINT to your Netlify function URL'
      )
      return
    }

    setLoading(true)
    setErrorMessage('')
    setReservation(null)
    setListing(null)

    try {
      const id = reservationId.trim()
      const response = await fetch(RESERVATION_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId: id, code: id }),
      })

      const text = await response.text()
      let data: any = {}
      try {
        data = text ? JSON.parse(text) : {}
      } catch {
        data = {}
      }

      if (!response.ok) {
        if (
          response.status === 404 &&
          RESERVATION_ENDPOINT.startsWith('/.netlify/functions/')
        ) {
          setErrorMessage(
            'Netlify function not reachable. Set EXPO_PUBLIC_RESERVATION_ENDPOINT to your deployed Netlify URL.'
          )
        } else {
          setErrorMessage(data?.error || data?.message || 'Server error')
        }
        return
      }

      if (!Array.isArray(data.results) || data.results.length === 0) {
        setErrorMessage('No reservation found for that ID')
        return
      }

      const reservationData = data.results[0]
      setReservation(reservationData)
      setFlow('dashboard')

      const listingId = firstString(
        reservationData?.listingId,
        reservationData?.listing?._id,
        reservationData?.listing?.id
      )

      if (listingId) {
        await fetchListing(listingId)
      }
    } catch (error) {
      if (error instanceof Error && error.message) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  const openWebsite = async () => {
    await Linking.openURL('https://oneluxstay.com')
  }

  const isDisabled = loading || !reservationId.trim()
  const logoTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  })
  const logoRotate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '2deg'],
  })
  const glowOpacity = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.85],
  })

  const reservationCode = firstString(
    reservation?.confirmationCode,
    reservation?.reservationId,
    reservation?._id,
    reservation?.id
  )
  const guestName = firstString(
    reservation?.guestName,
    reservation?.guest?.fullName,
    `${reservation?.guest?.firstName || ''} ${reservation?.guest?.lastName || ''}`
  )
  const listingName = firstString(
    listing?.listing_name,
    listing?.name,
    reservation?.listing?.title,
    reservation?.listingName,
    reservation?.listingId
  )
  const checkIn = firstString(
    reservation?.checkInDateLocalized,
    reservation?.checkInDate,
    reservation?.checkIn
  )
  const checkOut = firstString(
    reservation?.checkOutDateLocalized,
    reservation?.checkOutDate,
    reservation?.checkOut
  )
  const doorCode = firstString(
    listing?.door_code,
    listing?.doorCode,
    listing?.lock_code,
    reservation?.doorCode
  )
  const wifiName = firstString(listing?.wifi_name, listing?.wifiName)
  const wifiPassword = firstString(
    listing?.wifi_password,
    listing?.wifiPassword,
    listing?.wifi_pass
  )
  const checkInInstructions = firstString(
    listing?.checkin_instructions,
    listing?.check_in_instructions
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background} pointerEvents="none">
        <View style={styles.orbOne} />
        <View style={styles.orbTwo} />
        <View style={styles.orbThree} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Animated.View
            style={[
              styles.logoWrap,
              { transform: [{ translateY: logoTranslate }, { rotate: logoRotate }] },
            ]}
          >
            <Animated.View style={[styles.logoGlow, { opacity: glowOpacity }]} />
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          <Text style={styles.brand}>ONE LUX STAY</Text>
          <Text style={styles.title}>Guest Access</Text>
          <Text style={styles.subtitle}>
            Reservation lookup and stay details in one secure dashboard.
          </Text>
        </View>

        {flow === 'prompt' && (
          <View style={styles.card}>
            <Text style={styles.promptTitle}>Do you have a reservation?</Text>
            <Text style={styles.promptSubtitle}>
              Select an option below to continue.
            </Text>

            <Pressable style={styles.choiceButton} onPress={() => setFlow('lookup')}>
              <IconSymbol name="checkmark.seal.fill" size={16} color={palette.night} />
              <Text style={styles.choiceText}>Yes, I have a reservation</Text>
            </Pressable>

            <Pressable
              style={[styles.choiceButton, styles.choiceButtonAlt]}
              onPress={() => setFlow('no-reservation')}
            >
              <IconSymbol name="sparkles" size={16} color={palette.night} />
              <Text style={styles.choiceText}>No, I need to book a stay</Text>
            </Pressable>
          </View>
        )}

        {flow === 'lookup' && (
          <View style={styles.card}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Reservation ID</Text>
              <View style={styles.securePill}>
                <IconSymbol name="lock.fill" size={14} color={palette.night} />
                <Text style={styles.secureText}>Secure</Text>
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputIcon}>
                <IconSymbol name="key.fill" size={18} color={palette.night} />
              </View>
              <TextInput
                placeholder="Enter Reservation ID (ex: Res.HMHF2K9D4S)"
                placeholderTextColor={palette.muted}
                value={reservationId}
                onChangeText={setReservationId}
                autoCapitalize="characters"
                style={styles.input}
              />
            </View>

            <Pressable
              onPress={checkReservation}
              disabled={isDisabled}
              style={({ pressed }) => [
                styles.button,
                isDisabled && styles.buttonDisabled,
                pressed && !isDisabled && styles.buttonPressed,
              ]}
            >
              {loading ? (
                <ActivityIndicator color={palette.cream} />
              ) : (
                <Text style={styles.buttonText}>Find My Reservation</Text>
              )}
            </Pressable>

            <Pressable style={styles.linkButton} onPress={resetSearch}>
              <Text style={styles.linkButtonText}>Back</Text>
            </Pressable>

            {errorMessage !== '' && <Text style={styles.error}>{errorMessage}</Text>}
          </View>
        )}

        {flow === 'no-reservation' && (
          <View style={styles.card}>
            <Text style={styles.promptTitle}>No reservation yet</Text>
            <Text style={styles.promptSubtitle}>
              Visit OneLuxStay to browse available properties and book your stay.
            </Text>

            <Pressable style={styles.button} onPress={openWebsite}>
              <Text style={styles.buttonText}>Go to oneluxstay.com</Text>
            </Pressable>

            <Pressable style={styles.linkButton} onPress={resetSearch}>
              <Text style={styles.linkButtonText}>Back</Text>
            </Pressable>
          </View>
        )}

        {flow === 'dashboard' && reservation && (
          <View style={styles.detailsCard}>
            <View style={styles.detailsHeader}>
              <Text style={styles.detailsTitle}>Guest Dashboard</Text>
              <View style={styles.detailsBadge}>
                <IconSymbol name="checkmark.seal.fill" size={14} color={palette.gold} />
                <Text style={styles.detailsBadgeText}>Verified</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Guest</Text>
              <Text style={styles.detailValue}>{guestName || '-'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reservation ID</Text>
              <Text style={styles.detailValue}>{reservationCode || '-'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Listing</Text>
              <Text style={styles.detailValue}>{listingName || '-'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Check-in</Text>
              <Text style={styles.detailValue}>{formatDateTime(checkIn)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Check-out</Text>
              <Text style={styles.detailValue}>{formatDateTime(checkOut)}</Text>
            </View>

            <View style={styles.listingBlock}>
              <Text style={styles.detailsSubtitle}>Stay Access</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Door lock PIN</Text>
                <Text style={styles.detailValue}>{doorCode || '-'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Wi-Fi Name</Text>
                <Text style={styles.detailValue}>{wifiName || '-'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Wi-Fi Password</Text>
                <Text style={styles.detailValue}>{wifiPassword || '-'}</Text>
              </View>
              {checkInInstructions ? (
                <Text style={styles.instructions}>{checkInInstructions}</Text>
              ) : (
                <Text style={styles.instructionsMuted}>
                  Access details are shown once available for your listing.
                </Text>
              )}
            </View>

            <Pressable style={styles.buttonSecondary} onPress={resetSearch}>
              <Text style={styles.buttonSecondaryText}>Lookup Another Reservation</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const palette = {
  ink: '#1C1914',
  night: '#14252A',
  moss: '#0E3B3A',
  gold: '#C7A36A',
  sand: '#F6F1E8',
  cream: '#FFFBF5',
  haze: '#E6D9C9',
  mist: '#E7DDD0',
  muted: '#8F8072',
  error: '#B54A3A',
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.sand,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  orbOne: {
    position: 'absolute',
    top: -140,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#E7D7C4',
    opacity: 0.7,
  },
  orbTwo: {
    position: 'absolute',
    bottom: -160,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#D5E0D7',
    opacity: 0.75,
  },
  orbThree: {
    position: 'absolute',
    top: 220,
    right: -120,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#EADFD1',
    opacity: 0.6,
  },
  container: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    paddingTop: 24,
    alignItems: 'center',
  },
  hero: {
    alignItems: 'center',
    marginBottom: 18,
  },
  logoWrap: {
    width: 108,
    height: 108,
    borderRadius: 32,
    backgroundColor: palette.cream,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1C1914',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
    overflow: 'hidden',
  },
  logoGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: palette.gold,
    opacity: 0.4,
  },
  logo: {
    width: 70,
    height: 70,
  },
  brand: {
    marginTop: 16,
    fontSize: 12,
    letterSpacing: 3,
    color: palette.muted,
    fontFamily: Fonts.sans,
  },
  title: {
    marginTop: 8,
    fontSize: 30,
    lineHeight: 36,
    fontFamily: Fonts.serif,
    color: palette.night,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 22,
    color: palette.muted,
    textAlign: 'center',
    maxWidth: 330,
    fontFamily: Fonts.sans,
  },
  card: {
    width: '100%',
    marginTop: 20,
    padding: 20,
    borderRadius: 22,
    backgroundColor: palette.cream,
    borderWidth: 1,
    borderColor: palette.haze,
    shadowColor: '#1C1914',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  promptTitle: {
    fontSize: 22,
    color: palette.night,
    fontFamily: Fonts.serif,
    textAlign: 'center',
  },
  promptSubtitle: {
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21,
    fontFamily: Fonts.sans,
  },
  choiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#F4EBDD',
    borderWidth: 1,
    borderColor: palette.haze,
    marginBottom: 10,
  },
  choiceButtonAlt: {
    backgroundColor: '#EFE6D9',
  },
  choiceText: {
    fontFamily: Fonts.sans,
    color: palette.night,
    fontSize: 14,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: palette.muted,
    fontFamily: Fonts.sans,
  },
  securePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#EFE6D9',
  },
  secureText: {
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: palette.night,
    fontFamily: Fonts.sans,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.haze,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 10,
  },
  inputIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.sand,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: palette.night,
    paddingVertical: 12,
    fontFamily: Fonts.sans,
  },
  button: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: palette.night,
    alignItems: 'center',
    shadowColor: '#0D0F0F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: palette.cream,
    fontSize: 13,
    fontFamily: Fonts.sans,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  linkButton: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkButtonText: {
    color: palette.night,
    fontFamily: Fonts.sans,
    fontSize: 13,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  error: {
    marginTop: 12,
    color: palette.error,
    fontSize: 13,
    fontFamily: Fonts.sans,
  },
  detailsCard: {
    width: '100%',
    marginTop: 22,
    padding: 20,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: palette.haze,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailsTitle: {
    fontSize: 20,
    color: palette.night,
    fontFamily: Fonts.serif,
  },
  detailsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.haze,
    backgroundColor: palette.cream,
  },
  detailsBadgeText: {
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: palette.muted,
    fontFamily: Fonts.sans,
  },
  detailsSubtitle: {
    fontSize: 14,
    color: palette.night,
    marginBottom: 10,
    fontFamily: Fonts.rounded,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 12,
  },
  detailLabel: {
    fontSize: 13,
    color: palette.muted,
    fontFamily: Fonts.sans,
  },
  detailValue: {
    fontSize: 13,
    color: palette.night,
    fontFamily: Fonts.sans,
    textAlign: 'right',
    flexShrink: 1,
  },
  listingBlock: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: palette.mist,
  },
  instructions: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 20,
    color: palette.muted,
    fontFamily: Fonts.sans,
  },
  instructionsMuted: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 18,
    color: palette.muted,
    fontFamily: Fonts.sans,
    fontStyle: 'italic',
  },
  buttonSecondary: {
    marginTop: 18,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.haze,
    backgroundColor: palette.cream,
  },
  buttonSecondaryText: {
    color: palette.night,
    fontSize: 12,
    fontFamily: Fonts.sans,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
})

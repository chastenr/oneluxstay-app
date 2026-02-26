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
} from 'react-native'
import { supabase } from '../../lib/supabase'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { Fonts } from '@/constants/theme'

const RESERVATION_ENDPOINT =
  "https://xjyjupxhvprbwiravysf.supabase.co/functions/v1/guesty-fetch"

export default function Home() {
  const [code, setCode] = useState('')
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      })

      const text = await response.text()

      if (!response.ok) {
        console.log('Server error:', text)
        setErrorMessage('Server error')
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
          <Text style={styles.title}>Find Your Reservation</Text>
          <Text style={styles.subtitle}>
            Enter your code to unlock check-in details for your stay.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Reservation Code</Text>
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
              placeholder="Enter Reservation Code"
              placeholderTextColor={palette.muted}
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
              style={styles.input}
            />
          </View>

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
              <ActivityIndicator color={palette.cream} />
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
            <View style={styles.detailsHeader}>
              <Text style={styles.detailsTitle}>Reservation Summary</Text>
              <View style={styles.detailsBadge}>
                <IconSymbol name="checkmark.seal.fill" size={14} color={palette.gold} />
                <Text style={styles.detailsBadgeText}>Verified</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Confirmation</Text>
              <Text style={styles.detailValue}>{reservation.confirmationCode}</Text>
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
                  <Text style={styles.instructions}>{listing.checkin_instructions}</Text>
                ) : null}
              </View>
            )}
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
    maxWidth: 320,
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
    fontSize: 18,
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
})

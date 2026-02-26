import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'

import { Fonts } from '@/constants/theme'
import { IconSymbol } from '@/components/ui/icon-symbol'

type Reservation = {
  reservationId: string
  guestName: string
  propertyName: string
  propertyAddress: string
  checkIn: string
  checkOut: string
  access: {
    doorCode: string
    wifiName: string
    wifiPassword: string
    parking: string
    mapUrl: string
    houseManualUrl: string
  }
}

function parseReservation(param?: string | string[]) {
  if (!param || Array.isArray(param)) return null
  try {
    return JSON.parse(decodeURIComponent(param)) as Reservation
  } catch (error) {
    return null
  }
}

export default function Stay() {
  const params = useLocalSearchParams<{ reservation?: string }>()
  const reservation = parseReservation(params.reservation)

  if (!reservation) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>My Stay</Text>
          <Text style={styles.subtitle}>No reservation details found.</Text>
          <Text style={styles.link} onPress={() => router.back()}>
            Go back
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.brand}>ONE LUX STAY</Text>
          <Text style={styles.title}>My Stay</Text>
          <Text style={styles.subtitle}>Welcome, {reservation.guestName}.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{reservation.propertyName}</Text>
            <IconSymbol name="star.fill" size={16} color={palette.gold} />
          </View>
          <Text style={styles.cardLine}>{reservation.propertyAddress}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Check-in</Text>
            <Text style={styles.value}>{reservation.checkIn}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Check-out</Text>
            <Text style={styles.value}>{reservation.checkOut}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Reservation ID</Text>
            <Text style={styles.value}>{reservation.reservationId}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Access Details</Text>
            <IconSymbol name="key.fill" size={16} color={palette.gold} />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Door Code</Text>
            <Text style={styles.value}>{reservation.access.doorCode}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Wi-Fi Name</Text>
            <Text style={styles.value}>{reservation.access.wifiName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Wi-Fi Password</Text>
            <Text style={styles.value}>{reservation.access.wifiPassword}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Parking</Text>
            <Text style={styles.value}>{reservation.access.parking}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Map</Text>
            <Text style={styles.value}>{reservation.access.mapUrl}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>House Manual</Text>
            <Text style={styles.value}>{reservation.access.houseManualUrl}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const palette = {
  night: '#14252A',
  gold: '#C7A36A',
  sand: '#F6F1E8',
  cream: '#FFFBF5',
  haze: '#E6D9C9',
  muted: '#8F8072',
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.sand,
  },
  container: {
    padding: 24,
    gap: 14,
  },
  header: {
    gap: 6,
  },
  brand: {
    fontSize: 12,
    letterSpacing: 3,
    color: palette.muted,
    fontFamily: Fonts.sans,
  },
  title: {
    fontSize: 24,
    color: palette.night,
    fontFamily: Fonts.serif,
  },
  subtitle: {
    fontSize: 14,
    color: palette.muted,
    fontFamily: Fonts.sans,
  },
  card: {
    backgroundColor: palette.cream,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.haze,
    gap: 8,
    shadowColor: '#1C1914',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    color: palette.night,
    fontFamily: Fonts.rounded,
  },
  cardLine: {
    fontSize: 13,
    color: palette.muted,
    fontFamily: Fonts.sans,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EFE5D8',
    paddingTop: 8,
  },
  label: {
    fontSize: 12,
    color: palette.muted,
    fontFamily: Fonts.sans,
  },
  value: {
    fontSize: 12,
    color: palette.night,
    fontFamily: Fonts.sans,
    textAlign: 'right',
    flexShrink: 1,
    marginLeft: 12,
  },
  link: {
    color: palette.gold,
    fontSize: 14,
    fontFamily: Fonts.sans,
    marginTop: 8,
  },
})

import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import { Fonts } from '@/constants/theme';

type Reservation = {
  reservationId: string;
  guestName: string;
  propertyName: string;
  propertyAddress: string;
  checkIn: string;
  checkOut: string;
  access: {
    doorCode: string;
    wifiName: string;
    wifiPassword: string;
    parking: string;
    mapUrl: string;
    houseManualUrl: string;
  };
};

function parseReservation(param?: string | string[]) {
  if (!param || Array.isArray(param)) return null;
  try {
    return JSON.parse(decodeURIComponent(param)) as Reservation;
  } catch (error) {
    return null;
  }
}

export default function Stay() {
  const params = useLocalSearchParams<{ reservation?: string }>();
  const reservation = parseReservation(params.reservation);

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
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.brand}>ONE LUX STAY</Text>
        <Text style={styles.title}>My Stay</Text>
        <Text style={styles.subtitle}>Welcome, {reservation.guestName}.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{reservation.propertyName}</Text>
          <Text style={styles.cardLine}>{reservation.propertyAddress}</Text>
          <Text style={styles.cardLine}>Check-in: {reservation.checkIn}</Text>
          <Text style={styles.cardLine}>Check-out: {reservation.checkOut}</Text>
          <Text style={styles.cardLine}>Reservation ID: {reservation.reservationId}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Access Details</Text>
          <Text style={styles.cardLine}>Door Code: {reservation.access.doorCode}</Text>
          <Text style={styles.cardLine}>WiFi Name: {reservation.access.wifiName}</Text>
          <Text style={styles.cardLine}>WiFi Password: {reservation.access.wifiPassword}</Text>
          <Text style={styles.cardLine}>Parking: {reservation.access.parking}</Text>
          <Text style={styles.cardLine}>Map: {reservation.access.mapUrl}</Text>
          <Text style={styles.cardLine}>House Manual: {reservation.access.houseManualUrl}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f2ec',
  },
  container: {
    padding: 24,
    gap: 12,
  },
  brand: {
    fontSize: 14,
    letterSpacing: 3,
    color: '#a08972',
    fontFamily: Fonts.sans,
  },
  title: {
    fontSize: 24,
    color: '#4a3d33',
    fontFamily: Fonts.serif,
  },
  subtitle: {
    fontSize: 14,
    color: '#6f5f52',
    fontFamily: Fonts.sans,
  },
  card: {
    backgroundColor: '#fffaf5',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#decbb8',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    color: '#4a3d33',
    fontFamily: Fonts.sans,
  },
  cardLine: {
    fontSize: 13,
    color: '#5c4c3f',
    fontFamily: Fonts.sans,
  },
  link: {
    color: '#7b6656',
    fontSize: 14,
    fontFamily: Fonts.sans,
    marginTop: 8,
  },
});

import { StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';

export default function ExploreScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#efe7dd', dark: '#efe7dd' }}
      headerImage={
        <View style={styles.headerImage}>
          <ThemedText style={styles.headerBrand}>ONE LUX STAY</ThemedText>
          <ThemedText style={styles.headerTagline}>Guest Companion App</ThemedText>
        </View>
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>
          About One Lux Stay
        </ThemedText>
      </ThemedView>

      <ThemedText style={styles.body}>
        One Lux Stay delivers a seamless, secure guest experience powered by Guesty. Our companion
        app makes check-ins smoother, reduces support calls, and keeps every detail in one place.
      </ThemedText>

      <ThemedView style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          What Guests Can Do
        </ThemedText>
        <ThemedText style={styles.listItem}>- Access door lock codes and entry steps</ThemedText>
        <ThemedText style={styles.listItem}>- View WiFi network and password</ThemedText>
        <ThemedText style={styles.listItem}>- Get check-in and check-out instructions</ThemedText>
        <ThemedText style={styles.listItem}>- Contact support quickly</ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          How It Works
        </ThemedText>
        <ThemedText style={styles.listItem}>
          1. Guest books a stay and receives a reservation code.
        </ThemedText>
        <ThemedText style={styles.listItem}>
          2. Guest enters the code in the app.
        </ThemedText>
        <ThemedText style={styles.listItem}>
          3. The app verifies the reservation securely via our backend.
        </ThemedText>
        <ThemedText style={styles.listItem}>
          4. Access details unlock closer to check-in time.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Security & Privacy
        </ThemedText>
        <ThemedText style={styles.listItem}>
          - The app never connects directly to Guesty.
        </ThemedText>
        <ThemedText style={styles.listItem}>
          - Access is time-limited and disabled after checkout.
        </ThemedText>
        <ThemedText style={styles.listItem}>
          - We only display the data required for the stay.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Support
        </ThemedText>
        <ThemedText style={styles.listItem}>- Call or message support from the app</ThemedText>
        <ThemedText style={styles.listItem}>
          - Request early check-in or late checkout
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBrand: {
    fontSize: 18,
    letterSpacing: 4,
    color: '#7b6656',
    fontFamily: Fonts.sans,
  },
  headerTagline: {
    fontSize: 12,
    letterSpacing: 1.5,
    color: '#9b8875',
    fontFamily: Fonts.sans,
    marginTop: 6,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    fontFamily: Fonts.serif,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    color: '#5c4c3f',
  },
  section: {
    gap: 6,
    paddingTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#4a3d33',
    fontFamily: Fonts.sans,
  },
  listItem: {
    fontSize: 13,
    color: '#5c4c3f',
  },
});

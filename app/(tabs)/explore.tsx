import { Image, StyleSheet, Text, View } from 'react-native'

import ParallaxScrollView from '@/components/parallax-scroll-view'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { Fonts } from '@/constants/theme'

const features = [
  {
    title: 'Keyless Access',
    body: 'Door codes and arrival steps delivered securely before check-in.',
    icon: 'key.fill',
  },
  {
    title: 'Wi-Fi Details',
    body: 'Network name and password stored in one place for easy setup.',
    icon: 'wifi',
  },
  {
    title: 'Fast Support',
    body: 'Call or message support without hunting through emails.',
    icon: 'phone.fill',
  },
  {
    title: 'Property Essentials',
    body: 'Parking, access notes, and tips for a smooth stay.',
    icon: 'map.fill',
  },
] as const

const steps = [
  'Book your stay and receive a reservation code.',
  'Enter the code to verify your reservation securely.',
  'Access details unlock closer to check-in time.',
  'Use the app for check-in, Wi-Fi, and support.',
]

export default function ExploreScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#EADFD1', dark: '#1A1A1A' }}
      headerImage={
        <View style={styles.header}>
          <View style={styles.headerGlow} />
          <Image source={require('../../assets/logo.png')} style={styles.headerLogo} />
          <Text style={styles.headerBrand}>ONE LUX STAY</Text>
          <Text style={styles.headerTagline}>Guest Companion App</Text>
        </View>
      }
    >
      <View style={styles.section}>
        <Text style={styles.eyebrow}>About</Text>
        <Text style={styles.title}>Designed for a seamless stay.</Text>
        <Text style={styles.body}>
          One Lux Stay delivers a secure guest experience powered by Guesty. The app keeps
          access details, support, and instructions all in one elegant place.
        </Text>
      </View>

      <View style={styles.featureGrid}>
        {features.map((feature) => (
          <View key={feature.title} style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <IconSymbol name={feature.icon} size={20} color="#14252A" />
            </View>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureBody}>{feature.body}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <IconSymbol name="shield.fill" size={18} color="#C7A36A" />
          <Text style={styles.sectionTitle}>Security and Privacy</Text>
        </View>
        <Text style={styles.listItem}>Access is time-limited and disabled after checkout.</Text>
        <Text style={styles.listItem}>We only display data required for your stay.</Text>
        <Text style={styles.listItem}>The app never connects directly to Guesty.</Text>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <IconSymbol name="calendar" size={18} color="#C7A36A" />
          <Text style={styles.sectionTitle}>How It Works</Text>
        </View>
        {steps.map((step) => (
          <Text key={step} style={styles.listItem}>
            {step}
          </Text>
        ))}
      </View>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerGlow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#C7A36A',
    opacity: 0.2,
  },
  headerLogo: {
    width: 72,
    height: 72,
  },
  headerBrand: {
    marginTop: 14,
    fontSize: 14,
    letterSpacing: 4,
    color: '#6E5E4E',
    fontFamily: Fonts.sans,
  },
  headerTagline: {
    marginTop: 6,
    fontSize: 12,
    letterSpacing: 1.4,
    color: '#8E7B69',
    fontFamily: Fonts.sans,
  },
  section: {
    gap: 10,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: '#9A8673',
    fontFamily: Fonts.sans,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    color: '#1C1914',
    fontFamily: Fonts.serif,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    color: '#5E5348',
    fontFamily: Fonts.sans,
  },
  featureGrid: {
    marginTop: 8,
    gap: 12,
  },
  featureCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E6D9C9',
    backgroundColor: '#FFFBF5',
    shadowColor: '#1C1914',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F6F1E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 15,
    color: '#1C1914',
    fontFamily: Fonts.rounded,
    marginBottom: 6,
  },
  featureBody: {
    fontSize: 13,
    lineHeight: 19,
    color: '#5E5348',
    fontFamily: Fonts.sans,
  },
  sectionCard: {
    marginTop: 8,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E6D9C9',
    backgroundColor: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    color: '#1C1914',
    fontFamily: Fonts.rounded,
  },
  listItem: {
    fontSize: 13,
    lineHeight: 20,
    color: '#5E5348',
    fontFamily: Fonts.sans,
    marginBottom: 6,
  },
})

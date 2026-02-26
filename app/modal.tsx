import { Link } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'

import { IconSymbol } from '@/components/ui/icon-symbol'
import { Fonts } from '@/constants/theme'

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <IconSymbol name="sparkles" size={22} color={palette.night} />
      </View>
      <Text style={styles.title}>Welcome to One Lux Stay</Text>
      <Text style={styles.subtitle}>Everything you need for a seamless check-in.</Text>
      <Link href="/" dismissTo style={styles.link}>
        <Text style={styles.linkText}>Back to home</Text>
      </Link>
    </View>
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: palette.sand,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: palette.cream,
    borderWidth: 1,
    borderColor: palette.haze,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#1C1914',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  title: {
    fontSize: 22,
    color: palette.night,
    fontFamily: Fonts.serif,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: palette.muted,
    fontFamily: Fonts.sans,
    textAlign: 'center',
  },
  link: {
    marginTop: 18,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.haze,
    backgroundColor: palette.cream,
  },
  linkText: {
    fontSize: 13,
    color: palette.gold,
    fontFamily: Fonts.sans,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
})

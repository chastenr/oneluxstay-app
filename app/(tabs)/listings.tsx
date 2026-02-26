import { ScrollView, StyleSheet, Text, View, Pressable, Linking } from 'react-native'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { Fonts } from '@/constants/theme'

const links = [
  {
    title: 'Book Your Stay',
    subtitle: 'Oneluxstay.com',
    url: 'https://oneluxstay.com',
    icon: 'globe',
  },
  {
    title: 'Instagram',
    subtitle: '@oneluxstay',
    url: 'https://instagram.com/oneluxstay',
    icon: 'star.fill',
  },
  {
    title: 'Call Us',
    subtitle: '+1 213 866 3589',
    url: 'tel:+12138663589',
    icon: 'phone.fill',
  },
]

export default function ListingsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>FUTURES</Text>
        <Text style={styles.title}>Booking links and guest support.</Text>
        <Text style={styles.subtitle}>Tap to open a link or contact us.</Text>
      </View>

      <View style={styles.cardStack}>
        {links.map((link) => (
          <Pressable
            key={link.title}
            onPress={() => Linking.openURL(link.url)}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
          >
            <View style={styles.cardIcon}>
              <IconSymbol name={link.icon} size={18} color={palette.night} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{link.title}</Text>
              <Text style={styles.cardSubtitle}>{link.subtitle}</Text>
            </View>
            <IconSymbol name="bolt.fill" size={16} color={palette.gold} />
          </Pressable>
        ))}
      </View>

      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>Future Bookings</Text>
        <Text style={styles.noteBody}>
          We are curating premium stays and exclusive upgrades. Keep an eye on our website and
          Instagram for upcoming releases.
        </Text>
      </View>
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
}

const styles = StyleSheet.create({
  container: {
    padding: 26,
    paddingTop: 40,
    backgroundColor: palette.sand,
    gap: 16,
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
  cardStack: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1E7DA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    color: palette.night,
    fontFamily: Fonts.rounded,
  },
  cardSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: palette.muted,
    fontFamily: Fonts.sans,
  },
  noteCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.haze,
    backgroundColor: '#FFFFFF',
  },
  noteTitle: {
    fontSize: 14,
    color: palette.night,
    fontFamily: Fonts.rounded,
    marginBottom: 6,
  },
  noteBody: {
    fontSize: 13,
    lineHeight: 20,
    color: palette.muted,
    fontFamily: Fonts.sans,
  },
})

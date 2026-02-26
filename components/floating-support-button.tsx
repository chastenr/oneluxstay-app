import { Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { IconSymbol } from '@/components/ui/icon-symbol'
import { Colors, Fonts } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

const WHATSAPP_NUMBER = '971588858935'
const DEFAULT_MESSAGE = 'Hi One Lux Stay, I need help.'

function buildWhatsAppUrl() {
  const message = encodeURIComponent(DEFAULT_MESSAGE)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
}

export function FloatingSupportButton() {
  const colorScheme = useColorScheme() ?? 'light'
  const insets = useSafeAreaInsets()
  const background = colorScheme === 'dark' ? '#1C1C1C' : '#FFFFFF'
  const shadow = colorScheme === 'dark' ? '#000000' : '#1C1914'

  const handlePress = () => {
    Linking.openURL(buildWhatsAppUrl())
  }

  return (
    <View
      pointerEvents="box-none"
      style={[styles.root, { bottom: insets.bottom + 86 }]}
    >
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: background, shadowColor: shadow },
          pressed && styles.pressed,
        ]}
      >
        <IconSymbol name="phone.fill" size={18} color={Colors[colorScheme].tint} />
        <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Chat</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    right: 18,
    bottom: 22,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E6D9C9',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  label: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontFamily: Fonts.sans,
  },
})

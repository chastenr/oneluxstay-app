/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#C7A36A';
const tintColorDark = '#F5E6C8';

export const Colors = {
  light: {
    text: '#1C1914',
    background: '#F6F1E8',
    tint: tintColorLight,
    icon: '#6F6256',
    tabIconDefault: '#8A7C6E',
    tabIconSelected: '#1A2E2F',
  },
  dark: {
    text: '#F4EFE6',
    background: '#121616',
    tint: tintColorDark,
    icon: '#B9B1A6',
    tabIconDefault: '#B9B1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'AvenirNext-Regular',
    serif: 'Didot',
    rounded: 'AvenirNext-DemiBold',
    mono: 'Courier',
  },
  default: {
    sans: 'sans-serif-medium',
    serif: 'serif',
    rounded: 'sans-serif-condensed',
    mono: 'monospace',
  },
  web: {
    sans: "'Avenir Next', 'Avenir', 'Trebuchet MS', sans-serif",
    serif: "'Didot', 'Georgia', serif",
    rounded: "'Avenir Next Rounded', 'Avenir', sans-serif",
    mono: "'SFMono-Regular', 'Courier New', monospace",
  },
});

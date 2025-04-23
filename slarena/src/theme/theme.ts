import { DefaultTheme } from 'react-native-paper';

// Define the app's color palette
export const colors = {
  primary: '#1E88E5', // Blue
  secondary: '#FFC107', // Amber
  accent: '#FF5722', // Deep Orange
  background: '#FFFFFF',
  surface: '#F5F5F5',
  error: '#D32F2F',
  text: '#212121',
  disabled: '#9E9E9E',
  placeholder: '#BDBDBD',
  backdrop: 'rgba(0, 0, 0, 0.5)',
  notification: '#FF9800',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
  // Cricket-specific colors
  cricketGreen: '#2E7D32',
  cricketBrown: '#795548',
  cricketGold: '#FFD700',
  cricketRed: '#D32F2F',
  cricketBlue: '#1976D2',
  // Role-specific colors
  playerColor: '#4CAF50',
  organizerColor: '#FF9800',
  adminColor: '#F44336',
  // UI element colors
  cardBackground: '#FFFFFF',
  cardBorder: '#E0E0E0',
  divider: '#BDBDBD',
  shadow: 'rgba(0, 0, 0, 0.1)',
  // Status colors
  pending: '#FFC107',
  approved: '#4CAF50',
  rejected: '#F44336',
  inProgress: '#2196F3',
  completed: '#4CAF50',
  cancelled: '#9E9E9E',
};

// Define typography
export const typography = {
  fontFamily: {
    regular: 'Roboto-Regular',
    medium: 'Roboto-Medium',
    bold: 'Roboto-Bold',
    light: 'Roboto-Light',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 40,
  },
};

// Define spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Define border radius
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  round: 9999,
};

// Define shadows
export const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Create the theme object
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...colors,
  },
  fonts: typography.fontFamily,
  fontSizes: typography.fontSize,
  lineHeights: typography.lineHeight,
  spacing,
  borderRadius,
  shadows,
};

export default theme; 
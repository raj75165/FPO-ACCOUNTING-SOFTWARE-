import { DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1B5E20',
    accent: '#4CAF50',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#212121',
    placeholder: '#757575',
    error: '#B00020',
    success: '#2E7D32',
    warning: '#F57F17',
    info: '#1565C0',
    income: '#2E7D32',
    expense: '#C62828',
  },
  roundness: 8,
};

export default theme;

export const COLORS = {
  primary: '#1B5E20',
  primaryLight: '#4CAF50',
  primaryDark: '#003300',
  secondary: '#FF8F00',
  secondaryLight: '#FFC046',
  secondaryDark: '#C56000',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  error: '#B00020',
  success: '#2E7D32',
  warning: '#F57F17',
  info: '#1565C0',
  income: '#2E7D32',
  expense: '#C62828',
  white: '#FFFFFF',
  black: '#000000',
  border: '#E0E0E0',
  card: '#FFFFFF',
  shadow: 'rgba(0,0,0,0.1)',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

export const SIZES = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

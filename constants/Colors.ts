export const COLORS = {
  primary: '#BF587C', // Dark pink (Fuschia Rose)
  secondary: '#3D8399', // Blue (Munsell)
  accent: '#F9D3E0', // Light pink (Mimi Pink)
  background: '#FFFDF2', // Beige (Floral White)
  text: '#004D65', // Dark blue (Midnight green)
  textSecondary: '#3D8399', // Blue (Munsell)
  white: '#fff',
  black: '#000',
  error: '#BF587C', // Use dark pink for errors
  success: '#3D8399', // Use blue for success
  warning: '#F9D3E0', // Use light pink for warning
  aboutUs: '#B2A291', // New color for About Us frames

  // Gradients
  gradient: ['#F9D3E0', '#BF587C', '#3D8399', '#FFFDF2'],
  welcomeGradient: ["rgba(191, 88, 124, 0.7)", "rgba(249, 211, 224, 0.5)", "rgba(255, 253, 242, 0.2)"],
};

export const DARK_COLORS = {
  primary: '#E91E63', // Lighter pink for dark mode
  secondary: '#64B5F6', // Lighter blue for dark mode
  accent: '#FF4081', // Brighter pink for dark mode
  background: '#121212', // Dark background
  surface: '#1E1E1E', // Slightly lighter dark surface
  card: '#2D2D2D', // Card background
  text: '#FFFFFF', // White text
  textSecondary: '#B0B0B0', // Light gray text
  textPrimary: '#FFFFFF', // Primary text
  white: '#FFFFFF',
  black: '#000000',
  error: '#FF5252', // Red error for dark mode
  success: '#4CAF50', // Green success for dark mode
  warning: '#FF9800', // Orange warning for dark mode
  aboutUs: '#424242', // Dark about us

  // Gradients
  gradient: ['#FF4081', '#E91E63', '#64B5F6', '#121212'],
  welcomeGradient: ["rgba(233, 30, 99, 0.7)", "rgba(255, 64, 129, 0.5)", "rgba(18, 18, 18, 0.2)"],
};

// Theme context type
export type Theme = 'light' | 'dark';

// Function to get colors based on theme
export const getColors = (theme: Theme) => {
  return theme === 'dark' ? DARK_COLORS : COLORS;
};

// Font settings
export const FONTS = {
  title: 'Fresca',
  body: 'System',
  heading: 'Fresca',
}; 
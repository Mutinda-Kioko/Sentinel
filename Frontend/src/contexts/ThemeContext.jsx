import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: isDarkMode
      ? {
          // Dark theme colors
          background: '#000000',
          surface: '#050709',
          card: '#111827',
          cardHighlight: '#1F2933',
          text: '#F9FAFB',
          textSecondary: '#9CA3AF',
          textMuted: '#6B7280',
          border: '#374151',
          accent: '#00E0FF',
          accentSecondary: '#256BFF',
          accentTertiary: '#7B2BFF',
          dotCyan: '#2DF0FF',
          dotPurple: '#8A4DFF',
          dotBlue: '#256BFF',
          ringBackground: '#121726',
          ringTrack: '#020814',
          button: '#FF9F1C',
          buttonBorder: '#FFD28A',
          switchTrack: '#4B5563',
          switchThumb: '#FFFFFF',
          switchActive: '#2563EB',
        }
      : {
          // Light theme colors
          background: '#FFFFFF',
          surface: '#F9FAFB',
          card: '#FFFFFF',
          cardHighlight: '#F3F4F6',
          text: '#111827',
          textSecondary: '#6B7280',
          textMuted: '#9CA3AF',
          border: '#E5E7EB',
          accent: '#00E0FF',
          accentSecondary: '#256BFF',
          accentTertiary: '#7B2BFF',
          dotCyan: '#2DF0FF',
          dotPurple: '#8A4DFF',
          dotBlue: '#256BFF',
          ringBackground: '#E5E7EB',
          ringTrack: '#F3F4F6',
          button: '#FF9F1C',
          buttonBorder: '#FFD28A',
          switchTrack: '#D1D5DB',
          switchThumb: '#FFFFFF',
          switchActive: '#2563EB',
        },
  };

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};


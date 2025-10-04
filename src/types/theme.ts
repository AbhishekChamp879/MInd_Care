export interface ThemeSchedule {
  enabled: boolean;
  darkModeStart: string; // HH:MM format
  darkModeEnd: string; // HH:MM format
  location?: {
    latitude: number;
    longitude: number;
  };
  useSunrise?: boolean; // Auto-calculate based on sunrise/sunset
}

export interface ReadingModeSettings {
  enabled: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  lineHeight: 'normal' | 'relaxed' | 'loose';
  fontFamily: 'default' | 'serif' | 'mono' | 'dyslexic';
  contrast: 'normal' | 'high';
  reducedMotion: boolean;
  warmColors: boolean;
  backgroundColor: 'default' | 'sepia' | 'dark' | 'custom';
  customBackground?: string;
}

export interface EnhancedThemeSettings {
  theme: 'light' | 'dark' | 'system' | 'auto';
  schedule: ThemeSchedule;
  readingMode: ReadingModeSettings;
  preferences: {
    smoothTransitions: boolean;
    highContrast: boolean;
    reduceBlueLight: boolean;
    customAccentColor?: string;
  };
}

export const DEFAULT_THEME_SETTINGS: EnhancedThemeSettings = {
  theme: 'system',
  schedule: {
    enabled: false,
    darkModeStart: '20:00',
    darkModeEnd: '06:00',
    useSunrise: false,
  },
  readingMode: {
    enabled: false,
    fontSize: 'medium',
    lineHeight: 'normal',
    fontFamily: 'default',
    contrast: 'normal',
    reducedMotion: false,
    warmColors: false,
    backgroundColor: 'default',
  },
  preferences: {
    smoothTransitions: true,
    highContrast: false,
    reduceBlueLight: false,
  },
};

// CSS variables for reading mode
export const READING_MODE_STYLES = {
  fontSize: {
    small: '14px',
    medium: '16px',
    large: '18px',
    'extra-large': '20px',
  },
  lineHeight: {
    normal: '1.5',
    relaxed: '1.7',
    loose: '2.0',
  },
  fontFamily: {
    default: 'system-ui, -apple-system, sans-serif',
    serif: 'Georgia, Times, serif',
    mono: 'Monaco, Consolas, monospace',
    dyslexic: 'OpenDyslexic, Arial, sans-serif',
  },
  backgroundColor: {
    default: 'hsl(var(--background))',
    sepia: '#f4f1e8',
    dark: '#1a1a1a',
    custom: 'var(--reading-custom-bg)',
  },
};

// Utility functions for sunrise/sunset calculation
export function calculateSunriseSunset(latitude: number, longitude: number, date: Date) {
  // Simplified sunrise/sunset calculation
  // In a real implementation, you'd use a proper astronomy library
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const latRad = (latitude * Math.PI) / 180;

  const declinationAngle =
    (23.45 * Math.sin((2 * Math.PI * (284 + dayOfYear)) / 365) * Math.PI) / 180;
  const hourAngle = Math.acos(-Math.tan(latRad) * Math.tan(declinationAngle));

  const sunrise = 12 - (hourAngle * 12) / Math.PI;
  const sunset = 12 + (hourAngle * 12) / Math.PI;

  return {
    sunrise: formatTime(sunrise),
    sunset: formatTime(sunset),
  };
}

function formatTime(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

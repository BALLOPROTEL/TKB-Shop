// TKB'Shop - Nouvelle Charte Graphique Inspirée Michael Kors
// Système de couleurs élégant et professionnel

export const colors = {
  // Noir et Gris Principal (inspiration Michael Kors)
  primary: {
    50: '#F8F9FA',    // Blanc cassé très doux
    100: '#F1F3F4',   // Gris très clair
    200: '#E8EAED',   // Gris clair
    300: '#DADCE0',   // Gris moyen clair
    400: '#BDC1C6',   // Gris moyen
    500: '#9AA0A6',   // Gris
    600: '#80868B',   // Gris foncé
    700: '#5F6368',   // Gris très foncé
    800: '#3C4043',   // Presque noir
    900: '#202124',   // Noir principal
  },

  // Couleurs d'accent (inspiration luxe Michael Kors)
  accent: {
    50: '#FFFBEB',    // Champagne très clair
    100: '#FEF3C7',   // Champagne clair
    200: '#FDE68A',   // Doré clair
    300: '#FCD34D',   // Doré
    400: '#FBBF24',   // Doré moyen
    500: '#F59E0B',   // Doré principal
    600: '#D97706',   // Doré foncé
    700: '#B45309',   // Bronze
    800: '#92400E',   // Bronze foncé
    900: '#78350F',   // Bronze sombre
  },

  // Couleurs neutres raffinées
  neutral: {
    50: '#FEFEFE',    // Blanc pur
    100: '#FDFDFD',   // Blanc cassé
    200: '#F8F8F8',   // Gris très clair
    300: '#F0F0F0',   // Gris clair
    400: '#E0E0E0',   // Gris moyen clair
    500: '#C0C0C0',   // Gris moyen
    600: '#A0A0A0',   // Gris foncé
    700: '#808080',   // Gris très foncé
    800: '#404040',   // Presque noir
    900: '#1A1A1A',   // Noir profond
  },

  // Couleurs de statut harmonisées
  success: {
    50: '#F0FDF4',
    500: '#22C55E',
    600: '#16A34A',
  },
  
  error: {
    50: '#FEF2F2',
    500: '#EF4444',
    600: '#DC2626',
  },
  
  warning: {
    50: '#FFFBEB',
    500: '#F59E0B',
    600: '#D97706',
  }
};

// Utilitaires pour l'usage dans les composants
export const getColorClass = (color, shade = 500, type = 'bg') => {
  return `${type}-${color}-${shade}`;
};

export const primaryOrange = colors.primary[600]; // #FF6B35
export const accentOrange = colors.primary[400];  // Orange doux
export const lightOrange = colors.primary[100];   // Orange très clair
export const darkOrange = colors.primary[700];    // Orange foncé
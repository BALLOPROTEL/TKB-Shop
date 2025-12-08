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

  // Couleurs neutres (équilibrage)
  neutral: {
    50: '#FAFAFA',    // Blanc cassé
    100: '#F5F5F5',   // Gris très clair
    200: '#E5E5E5',   // Gris clair
    300: '#D4D4D4',   // Gris moyen clair
    400: '#A3A3A3',   // Gris moyen
    500: '#737373',   // Gris
    600: '#525252',   // Gris foncé
    700: '#404040',   // Gris très foncé
    800: '#262626',   // Presque noir
    900: '#171717',   // Noir
  },

  // Couleurs de statut (conservées mais harmonisées avec l'orange)
  success: {
    50: '#ECFDF5',
    500: '#10B981',
    600: '#059669',
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
  },

  // Couleurs d'accent complémentaires (pour diversité visuelle)
  accent: {
    blue: '#3B82F6',
    green: '#10B981',
    purple: '#8B5CF6',
    pink: '#EC4899',
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
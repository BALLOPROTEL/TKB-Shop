/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nouvelle charte graphique TKB'Shop - Inspiration Michael Kors
        primary: {
          50: '#F8F9FA',
          100: '#F1F3F4',
          200: '#E8EAED', 
          300: '#DADCE0',
          400: '#BDC1C6',
          500: '#9AA0A6',
          600: '#80868B',
          700: '#5F6368',
          800: '#3C4043',
          900: '#202124', // Noir principal
        },
        // Couleurs d'accent dorées/champagne
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B', // Doré principal
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        // Neutres raffinés
        gray: {
          50: '#FEFEFE',
          100: '#FDFDFD',
          200: '#F8F8F8',
          300: '#F0F0F0',
          400: '#E0E0E0',
          500: '#C0C0C0',
          600: '#A0A0A0',
          700: '#808080',
          800: '#404040',
          900: '#1A1A1A',
        },
        // Noir et blanc purs
        black: '#202124',
        white: '#FEFEFE',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'bounce-in': 'bounceIn 0.5s ease-out',
        'progress-bar': 'progressBar 3s linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        progressBar: {
          '0%': { width: '100%' },
          '100%': { width: '0%' },
        },
      },
      boxShadow: {
        'orange': '0 4px 14px 0 rgba(255, 107, 53, 0.25)',
        'orange-lg': '0 10px 25px -3px rgba(255, 107, 53, 0.3)',
        'card': '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 25px -3px rgba(0, 0, 0, 0.15)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
}
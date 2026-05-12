/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FBF6EE',
          100: '#F7EFE0',
          200: '#F0E2C7',
          300: '#E5D0A6',
          400: '#D4B782',
        },
        burgundy: {
          50: '#FAEEEE',
          100: '#F1D4D4',
          200: '#DFA0A0',
          300: '#B86060',
          400: '#8E3A3A',
          500: '#5C1F22',
          600: '#3F1517',
          700: '#2C0F11',
          800: '#1F0A0B',
          900: '#150708',
        },
        accent: {
          50: '#FFF4EB',
          100: '#FFE3CC',
          200: '#FFC499',
          300: '#FFA266',
          400: '#FF8533',
          500: '#F26B1F',
          600: '#D8531A',
          700: '#A33D14',
          800: '#7A2D0F',
          900: '#511E0A',
        },
        ink: {
          50: '#F6F4F1',
          100: '#E7E2DA',
          200: '#C9C2B6',
          300: '#A39B8E',
          400: '#7A7264',
          500: '#544E44',
          600: '#3C372F',
          700: '#2A2620',
          800: '#1B1814',
          900: '#100E0B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 6px 24px -8px rgba(63, 21, 23, 0.10), 0 2px 6px -2px rgba(63, 21, 23, 0.06)',
        lift: '0 18px 42px -16px rgba(63, 21, 23, 0.22), 0 6px 12px -6px rgba(63, 21, 23, 0.10)',
        ring: '0 0 0 6px rgba(242, 107, 31, 0.16)',
      },
      backgroundImage: {
        'grain-cream':
          'radial-gradient(circle at 1px 1px, rgba(92, 31, 34, 0.06) 1px, transparent 0)',
        'hero-glow':
          'radial-gradient(60% 60% at 30% 30%, rgba(255,162,102,0.20), transparent 70%), radial-gradient(50% 50% at 80% 60%, rgba(184,96,96,0.18), transparent 70%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        shimmer: 'shimmer 1.6s linear infinite',
        float: 'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

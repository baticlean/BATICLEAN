/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        baticleanBg: '#FEFEFE',
        baticleanBlue: {
          DEFAULT: '#195D9B',
          50: '#EBF4FC',
          100: '#D6E8F9',
          200: '#ADD1F3',
          300: '#84B9ED',
          400: '#5BA2E7',
          500: '#195D9B',
          600: '#154E83',
          700: '#113F6A',
          800: '#0C2F51',
          900: '#082039',
        },
        baticleanOrange: {
          DEFAULT: '#EF9437',
          50: '#FEF7EE',
          100: '#FDEEDC',
          200: '#FCDDBA',
          300: '#FACC97',
          400: '#F7BB75',
          500: '#EF9437',
          600: '#D67E25',
          700: '#A7611B',
          800: '#774512',
          900: '#482909',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 2px 15px -3px rgba(25, 93, 155, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        card: '0 10px 30px -5px rgba(25, 93, 155, 0.08)',
        glow: '0 0 20px rgba(239, 148, 55, 0.35)',
      },
    },
  },
  plugins: [],
};

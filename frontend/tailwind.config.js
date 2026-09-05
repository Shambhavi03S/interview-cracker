export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FAFAF8',
        ink: {
          DEFAULT: '#16233F',
          soft: '#4B5468',
          faint: '#8A8F9C',
        },
        line: '#E4E1D8',
        brass: {
          50: '#FBF3E6',
          100: '#F3E7D2',
          400: '#C79A4B',
          500: '#A6741B',
          600: '#8C5F16',
        },
        moss: {
          50: '#E9F3EC',
          600: '#1F7A54',
          700: '#175C3F',
        },
        clay: {
          50: '#FBEAE3',
          600: '#9C4221',
          700: '#7C3419',
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
}

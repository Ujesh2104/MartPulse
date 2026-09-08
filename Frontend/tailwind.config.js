/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          DEFAULT: '#CCFF00',
          lime: '#CCFF00',
          hover: '#B5E600',
          glow: 'rgba(204, 255, 0, 0.25)',
        },
        cyber: {
          950: '#07080A',
          900: '#0C0D11',
          850: '#121318',
          800: '#17181F',
          750: '#1E1F28',
          700: '#262734',
          600: '#343646',
        },
        amber: {
          400: '#FBBF24',
          500: '#F59E0B',
        },
      },
      fontFamily: {
        tech: ['"Space Grotesk"', '"Syne"', 'sans-serif'],
        heading: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-glow': '0 0 25px -4px rgba(204, 255, 0, 0.35)',
        'neon-glow-lg': '0 0 45px -5px rgba(204, 255, 0, 0.5)',
        'dark-card': '0 10px 30px -10px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}


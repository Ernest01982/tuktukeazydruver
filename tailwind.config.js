/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2EC4B6',
        accent: '#F2C94C',
        secondary: '#FF6B6B',
        text: '#0E172A',
        surface: '#F8FAFC',
      },
    },
  },
  plugins: [],
};
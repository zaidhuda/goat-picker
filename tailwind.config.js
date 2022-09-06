module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
    container: {
      padding: '1rem',
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};

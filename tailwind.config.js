module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    container: {
      padding: '1rem',
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};

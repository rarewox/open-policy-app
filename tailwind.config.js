/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        custom: {
          white: '#007AFF',
          black: '#222222',
          grey: '#F3F3F3',
          subtext: '#4D4D4D',
          blue: '#B1C9EF',
          text: {
            label: '#929292',
          },
          button: {
            disabled: '#E7E7E7',
            enabled: '#222222',
          },
          border: {
            DEFAULT: '#F3F3F3',
            active: '#F3F3F3',
          },
        },
      },
    },
  },
  plugins: [],
};

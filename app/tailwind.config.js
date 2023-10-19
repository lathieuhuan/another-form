/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          1: '#010E13',
          2: '#04364A',
          3: '#176B87'
        },
        light: {
          1: '#DAFFFB',
          2: '#64CCC5'
        }
      },
    },
  },
  plugins: [],
};

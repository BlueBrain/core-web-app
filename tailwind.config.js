const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          1: '#BAE7FF',
          2: '#91D5FF',
          3: '#69C0FF',
          4: '#40A9FF',
          5: '#1890FF',
          6: '#096DD9',
          7: '#0050B3',
          8: '#003A8C',
          9: '#002766',
        },
        green: {
          1: '#95DE64',
          2: '#389E0D',
          4: '#95DE64',
        },
      },
      fontFamily: {
        sans: ['var(--font-titillium-web)', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};

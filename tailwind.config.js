const { fontFamily } = require('tailwindcss/defaultTheme');
const blue = {
  0: '#E8F7FF',
  1: '#BAE7FF',
  2: '#91D5FF',
  3: '#69C0FF',
  4: '#40A9FF',
  5: '#1890FF',
  6: '#096DD9',
  7: '#0050B3',
  8: '#003A8C',
  9: '#002766',
};
const gray = {
  1: '#F5F5F5',
  2: '#D9D9D9',
  3: '#BFBFBF',
  4: '#8C8C8C',
  5: '#434343',
  6: '#141414',
  7: '#262626',
};
const green = {
  1: '#95DE64',
  2: '#389E0D',
  3: '#00B212',
  4: '#95DE64',
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'accent-dark': '#389E0D',
        'accent-light': '#95DE64',
        dark: '#002766',
        error: '#FF4D4F',
        light: '#FFF',
        neutral: gray,
        primary: blue,
        secondary: green,
        warning: '#FA8C16',
        highlightPost: '#FF4D4F',
        highlightPre: '#40A9FF',
      },
      fontFamily: {
        sans: ['var(--font-titillium-web)', ...fontFamily.sans],
      },
      transitionProperty: {
        padding: 'padding',
        transform: 'transform',
        height: 'height',
        spacing: 'margin, padding',
        slideDown: 'height, opacity',
        sideOut: 'slide-out',
      },
      transitionTimingFunction: {
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      animation: {
        'slide-out': 'slide-out 1s ease-in-out',
      },
      keyframes: {
        'slide-out': {
          '0%': {
            left: 0,
            'backgroud-color': 'bg-gray-300',
          },
          '75%': {
            left: '2000px',
            'max-height': '10rem',
            'padding-top': '1rem',
            'padding-bottom': '1rem',
            'border-width': '1px',
            overflow: 'hidden',
            'backgroud-color': 'bg-gray-300',
          },
          '100%': {
            left: '2000px',
            'max-height': 0,
            'padding-top': 0,
            'padding-bottom': 0,
            'border-width': 0,
            overflow: 'hidden',
            'backgroud-color': 'bg-gray-300',
          },
        },
      },
    },
  },
  plugins: [],
};

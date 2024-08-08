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
  0: '#DAFFD7',
  1: '#95DE64',
  2: '#389E0D',
  3: '#00B212',
  4: '#95DE64',
  5: '#5AF56A',
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
    './src/constants/**/*.{js,ts,jsx,tsx}',
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
        warning: '#CB5C00',
        highlightPost: '#FF4D4F',
        highlightPre: '#40A9FF',
        transparentWhite: 'rgba(255, 255, 255, 0.3)',
        transparentBlack: 'rgba(0, 0, 0, 0.3)',
      },
      fontFamily: {
        sans: ['var(--font-titillium-web)', ...fontFamily.sans],
      },
      transitionProperty: {
        padding: 'padding',
        transform: 'transform',
        rounded: 'border-radius',
        top: 'top',
        bottom: 'bottom',
        left: 'left',
        right: 'right',
        height: 'height',
        background: 'background',
        height: 'height',
        spacing: 'margin, padding',
        slideDown: 'height, opacity',
        filter: 'filter',
      },
      spacing: {
        '10percent': '10%',
        '90percent': '90%',
      },
      width: {
        '10vw': '10vw',
        '15vw': '15vw',
        '20vw': '20vw',
        '20vh': '20vh',
        '25vw': '25vw',
        '25vh': '25vh',
      },
      height: {
        '10vh': '10vh',
        '15vh': '15vh',
        '20vh': '20vh',
        '25vh': '25vh',
      },
      minHeight: {
        '10vh': '10vh',
        '15vh': '15vh',
        '20vh': '20vh',
        '25vh': '25vh',
      },
      listStyleType: {
        square: 'square',
      },
      boxShadow: {
        strongImage: '0px 22px 22px -16px rgba(0,0,0,0.36)',
      },
      transitionTimingFunction: {
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      animation: {
        'slide-out': 'slide-out 2s ease-in-out',
        'slide-up': 'slide-up 0.5s ease-in-out',
        'scale-down': 'scale-down .6s cubic-bezier(.55,-0.04,.91,.94) forwards',
        'fade-in': 'fade-in 1.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both',
        'fade-out': 'fade-out 1.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both',
      },
      keyframes: {
        'slide-out': {
          '0%': {
            left: 0,
          },
          '50%': {
            left: '300vw',
            maxHeight: '10rem',
          },
          '75%': {
            left: '300vw',
            maxHeight: '5rem',
          },
          '100%': {
            left: '300vw',
            maxHeight: 0,
            paddingTop: 0,
            paddingBottom: 0,
          },
        },
        'slide-up': {
          from: {
            opacity: 0,
            transform: 'translateY(100%)',
            transitionTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)',
            transitionTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        'scale-down': {
          from: {
            opacity: 1,
            transform: 'scale(1)',
          },
          to: {
            opacity: 0,
            transform: 'scale(0)',
          },
        },
        'fade-in': {
          '0%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          },
        },
        'fade-out': {
          '0%': {
            opacity: 1,
          },
          '100%': {
            opacity: 0,
          },
        },
      },
    },
  },
  plugins: [],
};

// const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./components/**/*.js', './pages/**/*.js'],
  // darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    // colors: {
    //   transparent: 'transparent',
    //   current: 'currentColor',
    //   black: colors.black,
    //   white: colors.white,
    //   gray: colors.trueGray,
    //   green: colors.green,
    //   red: colors.red,
    //   blue: colors.cyan,
    // },
  },
  variants: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        black: {
          primary: '#FFB3D9',
          'primary-focus': '#FF80C0',
          'primary-content': '#000000',
          secondary: '#ffffff',
          'secondary-focus': '#ffffff',
          'secondary-content': '#000000',
          accent: '#ffffff',
          'accent-focus': '#ffffff',
          'accent-content': '#000000',
          neutral: '#333333',
          'neutral-focus': '#4D4D4D',
          'neutral-content': '#ffffff',
          'base-100': '#000000',
          'base-200': '#15181C',
          'base-300': '#4D4D4D',
          'base-content': '#ffffff',
          info: '#2094f3',
          success: '#88BF45',
          warning: '#E2D562',
          error: '#E15241',
        },
      },
    ],
  },
};

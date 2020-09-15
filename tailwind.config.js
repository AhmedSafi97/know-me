const {
  colors: { white, black, red },
} = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./src/**/*.html', './src/**/*.js'],
  theme: {
    inset: {
      0: 0,
      auto: 'auto',
      icon: '21px',
    },
    colors: {
      black,
      white,
      red,
      blue: '#1877F2',
      gray: {
        light: '#E5E5E5',
        medium: '#828282',
        dark: '#4F4F4F',
      },
    },
  },
};

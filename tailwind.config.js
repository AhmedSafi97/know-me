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
      green: '#2eb82e',
      gray: {
        light: '#E5E5E5',
        medium: '#828282',
        dark: '#4F4F4F',
      },
    },
    extend: {
      boxShadow: {
        navbar:
          '0 2px 10px 0 rgba(0, 0, 0, 0.16), 0 -1px 5px 0 rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
};

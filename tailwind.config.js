const {
  colors: { white, black, red },
} = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./src/**/*.html', './src/**/*.js'],
  theme: {
    flexGrow: {
      0: 0,
      default: 1,
      2: 2,
    },
    inset: {
      0: 0,
      auto: 'auto',
      icon: '21px',
      'half-screen': 'calc((100vh - 12rem) / 2)',
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
      spacing: {
        fit: 'calc(100vh - 141px)',
        'half-screen': 'calc((100vh - 12rem) / 2)',
      },
    },
  },
};

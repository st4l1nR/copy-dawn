const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: [
    './config/*.json',
    './layout/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
    './templates/*.liquid',
    './templates/customers/*.liquid',
    './templates/*.json'
  ],
  theme: {
    extend: {
      fontFamily:{
        sans:["Assistant", ...defaultTheme.fontFamily.sans]
      },
      colors:{
        metal:'#121212BF',
        sky:"#F6F6F6",
      }
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('@tailwindcss/aspect-ratio')],
}

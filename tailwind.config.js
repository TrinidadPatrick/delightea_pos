/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  // content: ["./App.{js,jsx,ts,tsx}", "./Components/**/*.{js,jsx,ts,tsx}"],
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./Components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'theme-dark' : '#6F4E37',
        'theme-medium' : '#A67B5B',
        'theme-semiLight' : '#ECB176',
        'theme-light' : '#FED8B1',
        'theme-extraLight' : '#efdbcdb4'
      },
    },
  },
  plugins: [],
}
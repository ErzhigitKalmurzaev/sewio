module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#2F4F4F',
        'gray': '#E2E8F0',
        'fprimary': "#4E5564",
        'sprimary': '#40444D',
        'borderGray': 'rgba(208, 213, 221, 1)',
        'redd': '#E53E3E',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Добавляем шрифт Inter
        mont: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
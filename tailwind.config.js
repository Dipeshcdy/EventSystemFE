import { BiBorderRadius } from 'react-icons/bi'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
    "./node_modules/react-tailwindcss-select/dist/index.esm.js"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1366D9', // The main primary color (navy blue)
          light: '#4d71f5',   // A lighter shade of primary
          dark: '#0537ec',    // A darker shade of primary
        },
        secondary: {
          DEFAULT: '#f97316', // Bright orange
          light: '#fbbf24',   // Lighter shade of orange
          dark: '#c2410c',    // Darker shade of orange
        },
      },
    },
  },
  plugins: [
    function ({addUtilities}){
      const newUtilities={
        ".scrollbar-thin":{
          scrollbarWidth:"thin",
          scrollbarColor:"rgb(31 29 29) white"
        },
        ".scrollbar-webkit":{
          "&::-webkit-scrollbar":{
            width:"8px"
          },
          "&::-webkit-scrollbar-track":{
            background:"white"
          },
          "&::-webkit-scrollbar-thumb":{
            backgroundColor:"rgb(31 41 55)",
            BiBorderRadius:"20px",
            border:"1px solid white"
          },
        }
      }
      addUtilities(newUtilities,["responsive","hover"])
    }
  ],
}
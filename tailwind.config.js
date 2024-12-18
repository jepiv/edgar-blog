/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Color palette for the charts
        chart: {
          bg: '#111827',        // gray-900
          border: '#1F2937',    // gray-800
          text: {
            primary: '#F3F4F6', // gray-100
            secondary: '#9CA3AF' // gray-400
          },
          button: {
            active: '#3B82F6',  // blue-500
            hover: '#1F2937',   // gray-800
            text: '#D1D5DB'     // gray-300
          }
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(function({ addUtilities, theme }) {
      const textIndent = {
        '.indent-none': {
          textIndent: '0',
        },
        '.indent-xs': {
          textIndent: '0.5em',
        },
        '.indent-sm': {
          textIndent: '1em',
        },
        '.indent-md': {
          textIndent: '1.5em',
        },
        '.indent-lg': {
          textIndent: '2em',
        },
        '.indent-xl': {
          textIndent: '2.5em',
        },
        '.indent-2xl': {
          textIndent: '3em',
        },
      };

      addUtilities(textIndent, ['responsive']);
    }),
  ],
}

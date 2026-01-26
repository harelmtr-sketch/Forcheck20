/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: '#1a1d23',
        card: '#252932',
        primary: '#3b82f6',
        destructive: '#ef4444',
        foreground: '#f8fafc',
        border: 'rgba(255, 255, 255, 0.1)'
      }
    }
  },
  plugins: []
};

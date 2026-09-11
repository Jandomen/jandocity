/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts}"],
  theme: {
    extend: {
      colors: {
        jando: {
          bg: '#0f172a',
          panel: '#1e293b',
          accent: '#38bdf8'
        }
      }
    }
  },
  plugins: []
}

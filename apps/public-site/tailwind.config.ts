// tailwind.config.ts
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#003366',
        secondary: '#FFD700',
        accent: '#228B22',
        neutral: '#F5F5F5',
      },
      fontFamily: {
        khmer: ['var(--font-battambang)', 'Battambang', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
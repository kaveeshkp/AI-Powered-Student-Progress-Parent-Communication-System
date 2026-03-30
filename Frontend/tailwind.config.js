/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c3d66',
        },
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-auth': 'radial-gradient(circle at top, #e7f0fb, #f7f9fc 60%)',
      },
      boxShadow: {
        'sm-soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'md-soft': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'lg-soft': '0 12px 28px rgba(16, 36, 62, 0.12)',
      },
    },
  },
  plugins: [],
}

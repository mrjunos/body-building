/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  // El tema real vive en variables CSS (src/index.css), conmutadas por
  // [data-theme] y prefers-color-scheme. Tailwind aquí solo aporta utilidades
  // de layout responsive, igual que en mis-finanzas.
  theme: { extend: {} },
  plugins: [],
}

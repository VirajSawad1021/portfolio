/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        surface: "var(--color-surface)",
        'on-surface': "var(--color-on-surface)",
        'on-surface-variant': "var(--color-on-surface-variant)",
        primary: "var(--color-primary)",
        'primary-container': "var(--color-primary-container)",
        'secondary-container': "var(--color-secondary-container)",
        'on-secondary-container': "var(--color-on-secondary-container)",
        'outline-variant': "var(--color-outline-variant)",
        outline: "var(--color-outline)",
        'surface-container-low': "var(--color-surface-container-low)",
        'surface-container-lowest': "var(--color-surface-container-lowest)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    }
  },
  plugins: [],
}

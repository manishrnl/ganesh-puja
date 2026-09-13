/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Cormorant Garamond', 'serif'],
      },
      boxShadow: {
        premium: '0 24px 70px rgba(77, 32, 12, 0.18)',
      },
      backgroundImage: {
        rangoli:
          'radial-gradient(circle at 18% 12%, rgba(251, 191, 36, 0.34), transparent 24%), radial-gradient(circle at 88% 8%, rgba(16, 185, 129, 0.14), transparent 22%), radial-gradient(circle at 78% 72%, rgba(236, 72, 153, 0.13), transparent 25%), linear-gradient(135deg, #fff7ed 0%, #fff 45%, #fef3c7 100%)',
        festival:
          'linear-gradient(135deg, rgba(69, 10, 10, 0.96), rgba(154, 52, 18, 0.86), rgba(217, 119, 6, 0.72))',
      },
    },
  },
  plugins: [],
};

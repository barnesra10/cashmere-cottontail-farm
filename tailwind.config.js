/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream:    { 50: '#fdfcfa', 100: '#faf8f5', 200: '#f3efe8', 300: '#e8e0d4' },
        charcoal: { 50: '#f5f5f5', 100: '#e0e0e0', 200: '#b0b0b0', 300: '#808080', 400: '#606060', 500: '#404040', 600: '#2c2c2c', 700: '#1a1a1a', 800: '#111111' },
        sage:     { 50: '#f4f7f4', 100: '#e4ebe4', 200: '#c8d6c8', 300: '#9bb59b', 400: '#6e946e', 500: '#4a7a4a', 600: '#3a6139' },
        wheat:    { 50: '#fefdfb', 100: '#fdf9f0', 200: '#f9efd8', 300: '#f2e0b5', 400: '#e8cc8a', 500: '#d4b060' },
        plaid:    { light: '#d4cfc7', mid: '#b8b0a4', dark: '#9a9085' }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        script:  ['"Dancing Script"', 'cursive'],
        body:    ['"Source Sans 3"', 'sans-serif'],
        accent:  ['"Lora"', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'plaid-pattern': `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 40px,
            rgba(180,170,158,0.15) 40px,
            rgba(180,170,158,0.15) 42px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 40px,
            rgba(180,170,158,0.15) 40px,
            rgba(180,170,158,0.15) 42px
          ),
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 28px,
            rgba(160,150,138,0.08) 28px,
            rgba(160,150,138,0.08) 30px
          )
        `
      }
    }
  },
  plugins: []
};

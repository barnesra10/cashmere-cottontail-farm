/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Logo palette with extended warm neutral variants
        cream:    { 50: '#fdfcfa', 100: '#f5f3ee', 200: '#ece8e0', 300: '#ddd6ca', 400: '#cec4b4' },
        charcoal: { 50: '#f5f4f3', 100: '#e0dedc', 200: '#b0aca6', 300: '#807a72', 400: '#605a52', 500: '#3d3832', 600: '#2c2826', 700: '#1a1816', 800: '#111010' },
        // Primary action — warm charcoal with taupe undertone
        sage:     { 50: '#f5f4f2', 100: '#e8e4de', 200: '#cec4b4', 300: '#a89e90', 400: '#7a7064', 500: '#5c534a', 600: '#443d37' },
        // Accent — warm taupe from plaid band
        wheat:    { 50: '#faf8f5', 100: '#f0ece5', 200: '#e0d8cc', 300: '#d4cfc7', 400: '#c0b8aa', 500: '#b0a99d' },
        plaid:    { light: '#d4cfc7', mid: '#b8b0a4', dark: '#9a9085' },
        // Individual breed card colors — all warm neutrals from the plaid tones
        breed: {
          sheep:    '#3d3832',  // darkest charcoal (black sheep silhouette)
          goat:     '#6b6259',  // warm medium brown
          rabbit:   '#b0a99d',  // warm taupe (plaid mid)
          dachshund:'#4a4440',  // dark warm charcoal
          chicken:  '#8a8078',  // medium warm gray
        }
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

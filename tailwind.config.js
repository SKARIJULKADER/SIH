/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic palette — driven by CSS variables so light mode & dark mode
        // both work everywhere. Values live in index.css (:root = light, .dark = dark).
        background: 'rgb(var(--color-background) / <alpha-value>)',
        'background-2': 'rgb(var(--color-background-2) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--color-surface-2) / <alpha-value>)',
        'surface-3': 'rgb(var(--color-surface-3) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        'border-light': 'rgb(var(--color-border-light) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        'text-heading': 'rgb(var(--color-text-heading) / <alpha-value>)',
        'text-white': '#ffffff',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'primary-2': 'rgb(var(--color-primary-2) / <alpha-value>)',
        'primary-light': 'rgb(var(--color-primary-light) / <alpha-value>)',
        'primary-glow': 'rgba(139, 92, 246, 0.5)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        'secondary-light': 'rgb(var(--color-secondary-light) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'accent-light': 'rgb(var(--color-accent-light) / <alpha-value>)',
        // Green "growth" accent — used mainly on the light landing theme
        growth: '#10b981',
        'growth-2': '#059669',
        'growth-3': '#047857',
        'growth-light': '#34d399',
        'growth-soft': '#d1fae5',
        'growth-bg': '#ecfdf5',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'ui-monospace', 'Consolas', 'monospace'],
        // Certificate typography
        display: ['"Playfair Display"', 'Georgia', '"Times New Roman"', 'serif'],
        script: ['"Great Vibes"', '"Snell Roundhand"', '"Brush Script MT"', 'cursive'],
        cert: ['Jost', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, rgb(var(--color-primary)) 0%, rgb(var(--color-secondary)) 100%)',
        'gradient-primary-hover': 'linear-gradient(135deg, rgb(var(--color-primary-2)) 0%, rgba(8, 145, 178, 1) 100%)',
        'gradient-card': 'linear-gradient(145deg, rgb(var(--color-surface) / 1) 0%, rgb(var(--color-surface-2) / 1) 100%)',
        'gradient-text': 'linear-gradient(90deg, rgb(var(--color-primary)), rgb(var(--color-secondary)))',
      },
      boxShadow: {
        glow: '0 0 20px rgba(139, 92, 246, 0.4)',
        'glow-lg': '0 0 40px rgba(139, 92, 246, 0.5), 0 0 60px rgba(6, 182, 212, 0.3)',
        'glow-inner': 'inset 0 0 15px rgba(139, 92, 246, 0.3)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 0 20px rgba(139, 92, 246, 0.2)',
        // Soft light-theme shadows for the landing page
        soft: '0 4px 20px -2px rgba(15, 23, 42, 0.08), 0 2px 8px -2px rgba(15, 23, 42, 0.04)',
        lift: '0 20px 40px -12px rgba(15, 23, 42, 0.16)',
        'glow-growth': '0 8px 28px -6px rgba(16, 185, 129, 0.45)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
  // Full-width layout: disable the default `.container` max-width caps so every
  // `container mx-auto px-*` wrapper spans the entire viewport ("full screen").
  corePlugins: {
    container: false,
  },
}



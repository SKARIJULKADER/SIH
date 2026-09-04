/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark futuristic palette
        background: '#0b0c13',
        'background-2': '#10121a',
        surface: '#16171d',
        'surface-2': '#1c1f29',
        'surface-3': '#232732',
        border: '#2e303a',
        'border-light': '#3a3f4d',
        text: '#9ca3af',
        'text-secondary': '#7b8496',
        'text-heading': '#f3f4f6',
        'text-white': '#ffffff',
        primary: '#8b5cf6',
        'primary-2': '#7c3aed',
        'primary-light': '#a78afa',
        'primary-glow': 'rgba(139, 92, 246, 0.5)',
        secondary: '#06b6d4',
        'secondary-light': '#22d3ee',
        accent: '#ec4899',
        'accent-light': '#f472b6',
        // Green "growth" accent — used mainly on the light landing theme
        growth: '#10b981',
        'growth-2': '#059669',
        'growth-3': '#047857',
        'growth-light': '#34d399',
        'growth-soft': '#d1fae5',
        'growth-bg': '#ecfdf5',
        success: '#22c58e',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'ui-monospace', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
        'gradient-primary-hover': 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
        'gradient-card': 'linear-gradient(145deg, #16171d 0%, #1c1f29 100%)',
        'gradient-text': 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
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



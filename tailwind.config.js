/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Public website colors
        'soft-pink': '#F9A8D4',
        'soft-rose': '#FB7185',
        'soft-orange': '#FDBA74',
        'soft-red': '#FCA5A5',
        'soft-violet': '#C4B5FD',
        'soft-blue': '#93C5FD',
        'gold': '#F5C542',
        'light-bg': '#FAFAFF',
        // Dashboard colors
        'navy': '#1e293b',
        'soft-navy': '#334155',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'card-lift': 'cardLift 0.3s ease',
        'fade-in': 'fadeIn 0.5s ease',
        'fade-up': 'fadeUp 0.6s ease',
        'slide-left': 'slideLeft 0.5s ease',
        'slide-right': 'slideRight 0.5s ease',
        'scale-in': 'scaleIn 0.4s ease',
        'confetti': 'confetti 3s ease-out',
        'winner-reveal': 'winnerReveal 1.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        cardLift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-5px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(1000px) rotate(720deg)', opacity: '0' },
        },
        winnerReveal: {
          '0%': { transform: 'scale(0.5)', opacity: '0', filter: 'blur(10px)' },
          '100%': { transform: 'scale(1)', opacity: '1', filter: 'blur(0)' },
        },
      },
    },
  },
  plugins: [],
}

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
          DEFAULT: "#00003c", // Deep Ink
          container: "#000080",
          fixed: "#e0e0ff",
        },
        secondary: {
          DEFAULT: "#735c00", // Polished Brass
          container: "#fed65b",
          fixed: "#ffe088",
        },
        surface: {
          DEFAULT: "#fcf9f4", // Aged Parchment
          bright: "#fcf9f4",
          container: {
            lowest: "#ffffff",
            low: "#f6f3ee",
            neutral: "#f0ede8",
            high: "#ebe8e3",
            highest: "#e5e2dd",
          },
        },
        on: {
          surface: "#1c1c19",
          primary: "#ffffff",
        },
        outline: {
          DEFAULT: "#767684",
          variant: "rgba(118, 118, 132, 0.15)", // Ghost Border
        }
      },
      fontFamily: {
        serif: ["'Newsreader'", "serif"],
        sans: ["'Public Sans'", "sans-serif"],
      },
      borderRadius: {
        sm: "0.125rem",
        md: "0.375rem",
        lg: "0.625rem",
      },
      boxShadow: {
        'judicial-ambient': '0 24px 48px -4px rgba(28, 28, 25, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '100% ' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '100%' },
        }
      }
    },
  },
  plugins: [],
}

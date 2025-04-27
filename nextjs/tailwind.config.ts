import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        border: "var(--border)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
      },
      animation: {
        'bounce': 'bounce 1s infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-delay': 'fadeIn 0.6s ease-out 0.2s forwards',
        'fade-in-delay-2': 'fadeIn 0.6s ease-out 0.4s forwards',
      },
      keyframes: {
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        fadeIn: {
          'from': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      transitionDuration: {
        'slow': 'var(--transition-slow)',
        'medium': 'var(--transition-medium)',
        'fast': 'var(--transition-fast)',
      },
      boxShadow: {
        'gradient': '0 10px 20px -5px rgba(59, 130, 246, 0.3)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio')
  ],
} satisfies Config;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        'glitch-3d-1': {
          '0%': { transform: 'translateZ(20px) rotateX(0deg)' },
          '25%': { transform: 'translateZ(20px) rotateX(10deg)' },
          '50%': { transform: 'translateZ(20px) rotateX(0deg)' },
          '75%': { transform: 'translateZ(20px) rotateX(-10deg)' },
          '100%': { transform: 'translateZ(20px) rotateX(0deg)' },
        },
        'glitch-3d-2': {
          '0%': { transform: 'translateZ(40px) rotateY(0deg)' },
          '25%': { transform: 'translateZ(40px) rotateY(10deg)' },
          '50%': { transform: 'translateZ(40px) rotateY(0deg)' },
          '75%': { transform: 'translateZ(40px) rotateY(-10deg)' },
          '100%': { transform: 'translateZ(40px) rotateY(0deg)' },
        },
        'glitch-3d-3': {
          '0%': { transform: 'translateZ(60px) rotateZ(0deg)' },
          '25%': { transform: 'translateZ(60px) rotateZ(10deg)' },
          '50%': { transform: 'translateZ(60px) rotateZ(0deg)' },
          '75%': { transform: 'translateZ(60px) rotateZ(-10deg)' },
          '100%': { transform: 'translateZ(60px) rotateZ(0deg)' },
        },
        'rgb-split-r': {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(4px)' },
          '100%': { transform: 'translateX(0)' },
        },
        'rgb-split-g': {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-4px)' },
          '100%': { transform: 'translateX(0)' },
        },
        'rgb-split-b': {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(2px)' },
          '100%': { transform: 'translateX(0)' },
        },
        'scan-lines': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'glitch-overlay': {
          '0%': { opacity: 0, transform: 'translateX(-100%)' },
          '10%': { opacity: 0.5, transform: 'translateX(0)' },
          '20%': { opacity: 0, transform: 'translateX(100%)' },
          '30%': { opacity: 0, transform: 'translateX(-100%)' },
          '40%': { opacity: 0.5, transform: 'translateX(0)' },
          '50%': { opacity: 0, transform: 'translateX(100%)' },
          '100%': { opacity: 0, transform: 'translateX(0)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'glitch-3d-1': 'glitch-3d-1 4s infinite',
        'glitch-3d-2': 'glitch-3d-2 4s infinite',
        'glitch-3d-3': 'glitch-3d-3 4s infinite',
        'rgb-split-r': 'rgb-split-r 3s infinite',
        'rgb-split-g': 'rgb-split-g 3s infinite',
        'rgb-split-b': 'rgb-split-b 3s infinite',
        'scan-lines': 'scan-lines 2s linear infinite',
        'glitch-overlay': 'glitch-overlay 4s infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 
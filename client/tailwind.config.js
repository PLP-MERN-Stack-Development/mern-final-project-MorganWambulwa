/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(142.1 76.2% 36.3%)", foreground: "hsl(355.7 100% 97.3%)" },
        secondary: { DEFAULT: "hsl(32 95% 44%)", foreground: "hsl(240 5.9% 10%)" },
        destructive: { DEFAULT: "hsl(0 84.2% 60.2%)", foreground: "hsl(0 0% 98%)" },
        muted: { DEFAULT: "hsl(240 4.8% 95.9%)", foreground: "hsl(240 3.8% 46.1%)" },
        accent: { DEFAULT: "hsl(199 89% 48%)", foreground: "hsl(240 5.9% 10%)" },
        card: { DEFAULT: "hsl(0 0% 100%)", foreground: "hsl(222.2 84% 4.9%)" },
        popover: { DEFAULT: "hsl(0 0% 100%)", foreground: "hsl(222.2 84% 4.9%)" },
      },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
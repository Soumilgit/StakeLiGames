import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        foreground: "#f8f9fa",
        primary: "#7c3aed",
        secondary: "#ec4899",
        accent: "#10b981",
        border: "#1f1f2e",
        card: "#141420",
        cardHover: "#1a1a28",
        muted: "#64748b",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(124, 58, 237, 0.3)',
        'glow-sm': '0 0 10px rgba(124, 58, 237, 0.2)',
        'glow-lg': '0 0 40px rgba(124, 58, 237, 0.4)',
        'glow-accent': '0 0 20px rgba(236, 72, 153, 0.3)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
        'gradient-accent': 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
      },
    },
  },
  plugins: [],
};
export default config;

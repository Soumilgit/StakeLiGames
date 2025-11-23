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
        background: "#f4f0e8",
        foreground: "#1a1a1a",
        primary: "#00d4aa",
        secondary: "#6366f1",
        accent: "#f59e0b",
        border: "#1a1a1a",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        brutal: "4px 4px 0px 0px #1a1a1a",
        "brutal-lg": "8px 8px 0px 0px #1a1a1a",
        "brutal-sm": "2px 2px 0px 0px #1a1a1a",
      },
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // shadcn tokens (CSS-var driven so dark mode flips with the theme).
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",
        cream: {
          DEFAULT: "#F5EFE3",
          dim: "#EDE4CF",
          card: "#FFFDF6",
        },
        olive: {
          DEFAULT: "#4F5B2A",
          deep: "#3A431F",
          ink: "#15180E",
          surface: "#1E2414",
          muted: "#6B7648",
        },
        brass: {
          DEFAULT: "#B8892D",
          bright: "#D2A44A",
          soft: "#F0DFB8",
          deep: "#8A671F",
        },
        sand: {
          DEFAULT: "#D8C9A8",
          deep: "#C4B28C",
          soft: "#EAE0C8",
        },
      },
      borderColor: {
        DEFAULT: "#D8C9A8",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(21,24,14,.06), 0 8px 24px -12px rgba(79,91,42,.25)",
        pop: "0 12px 40px -12px rgba(21,24,14,.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        blink: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: ".25" },
        },
      },
      animation: {
        blink: "blink 1.1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;

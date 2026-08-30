import type { Config } from "tailwindcss";

const config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ["Poppins", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xs: "calc(var(--radius) * 0.5)",
        sm: "calc(var(--radius) * 0.75)",
        md: "var(--radius)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) * 1.25)",
      },
      boxShadow: {
        soft: "0 18px 48px -32px rgb(7 26 51 / 0.35)",
        focus: "0 0 0 4px rgb(24 191 231 / 0.18)",
      },
    },
  },
} satisfies Config;

export default config;


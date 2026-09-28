import type { Config } from "tailwindcss";

// Every colour, radius and font maps to a CSS variable in src/styles/tokens.css.
// Swap brand values there; nothing here or in components should change.
const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        stage: v("stage"),
        surface: v("surface"),
        sunken: v("sunken"),
        line: v("line"),
        ink: v("ink"),
        muted: v("muted"),
        faint: v("faint"),
        brand: { DEFAULT: v("brand"), ink: v("brand-ink"), soft: v("brand-soft") },
        live: { DEFAULT: v("live"), soft: v("live-soft") },
        limit: { DEFAULT: v("limit"), soft: v("limit-soft") },
        paid: { DEFAULT: v("paid"), soft: v("paid-soft") },
        bubble: { ai: v("bubble-ai"), me: v("bubble-me"), "me-ink": v("bubble-me-ink") },
        device: v("device"),
      },
      fontFamily: { sans: ["var(--font-sans)"] },
      borderRadius: { sm: "var(--radius-sm)", DEFAULT: "var(--radius)", lg: "var(--radius-lg)", xl: "var(--radius-xl)" },
      fontSize: {
        xs: ["var(--text-xs)", "1.4"],
        sm: ["var(--text-sm)", "1.45"],
        base: ["var(--text-base)", "1.5"],
        lg: ["var(--text-lg)", "1.4"],
        xl: ["var(--text-xl)", "1.3"],
        "2xl": ["var(--text-2xl)", "1.2"],
        "3xl": ["var(--text-3xl)", "1.1"],
      },
    },
  },
  plugins: [],
} satisfies Config;

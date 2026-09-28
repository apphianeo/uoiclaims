import type { Config } from "tailwindcss";

// Every colour, radius and font maps to a CSS variable in src/styles/tokens.css.
const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: v("primary"),
        regal: v("regal"),
        accent: v("accent"),
        "uob-red": v("uob-red"),
        page: v("page"),
        surface: v("surface"),
        info: v("info"),
        line: v("line"),
        ink: v("ink"),
        muted: v("muted"),
        faint: v("faint"),
        success: { DEFAULT: v("success"), bg: v("success-bg") },
        caution: { DEFAULT: v("caution"), bg: v("caution-bg") },
        error: v("error"),
        night: { DEFAULT: v("night"), 2: v("night-2"), line: v("night-line"), ink: v("night-ink"), muted: v("night-muted") },
        device: v("device"),
      },
      fontFamily: { sans: ["var(--font-sans)"] },
      borderRadius: { sm: "var(--radius-sm)", DEFAULT: "var(--radius)", lg: "var(--radius-lg)", xl: "var(--radius-xl)" },
      boxShadow: { card: "var(--shadow-card)", pop: "var(--shadow-pop)" },
      fontSize: {
        "2xs": ["var(--text-2xs)", "1.4"],
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

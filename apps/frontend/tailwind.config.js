/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── Color scales — CSS var references so :root vs .dark swaps
      //     automatically without rebuilding Tailwind output.
      //     Canonical values live in globals.css (Phase 1).
      colors: {
        // Color scales reference raw OKLCH channels in CSS vars
        // so Tailwind's alpha modifier (`bg-verdant-500/20`) composes via
        // `oklch(var(--verdant-500) / <alpha-value>)`.

        // Verdant — primary forest greens (50–950)
        verdant: {
          50:  "oklch(var(--verdant-50) / <alpha-value>)",
          100: "oklch(var(--verdant-100) / <alpha-value>)",
          200: "oklch(var(--verdant-200) / <alpha-value>)",
          300: "oklch(var(--verdant-300) / <alpha-value>)",
          400: "oklch(var(--verdant-400) / <alpha-value>)",
          500: "oklch(var(--verdant-500) / <alpha-value>)",
          600: "oklch(var(--verdant-600) / <alpha-value>)",
          700: "oklch(var(--verdant-700) / <alpha-value>)",
          800: "oklch(var(--verdant-800) / <alpha-value>)",
          900: "oklch(var(--verdant-900) / <alpha-value>)",
          950: "oklch(var(--verdant-950) / <alpha-value>)",
        },
        // Solar — electric gold (50–900)
        solar: {
          50:  "oklch(var(--solar-50) / <alpha-value>)",
          100: "oklch(var(--solar-100) / <alpha-value>)",
          200: "oklch(var(--solar-200) / <alpha-value>)",
          300: "oklch(var(--solar-300) / <alpha-value>)",
          400: "oklch(var(--solar-400) / <alpha-value>)",
          500: "oklch(var(--solar-500) / <alpha-value>)",
          600: "oklch(var(--solar-600) / <alpha-value>)",
          700: "oklch(var(--solar-700) / <alpha-value>)",
          800: "oklch(var(--solar-800) / <alpha-value>)",
          900: "oklch(var(--solar-900) / <alpha-value>)",
        },
        // Bio — bioluminescent teal/cyan (50–900)
        bio: {
          50:  "oklch(var(--bio-50) / <alpha-value>)",
          100: "oklch(var(--bio-100) / <alpha-value>)",
          200: "oklch(var(--bio-200) / <alpha-value>)",
          300: "oklch(var(--bio-300) / <alpha-value>)",
          400: "oklch(var(--bio-400) / <alpha-value>)",
          500: "oklch(var(--bio-500) / <alpha-value>)",
          600: "oklch(var(--bio-600) / <alpha-value>)",
          700: "oklch(var(--bio-700) / <alpha-value>)",
          800: "oklch(var(--bio-800) / <alpha-value>)",
          900: "oklch(var(--bio-900) / <alpha-value>)",
        },
        // Coral — terracotta accent (sparse: 300, 500, 700)
        coral: {
          300: "oklch(var(--coral-300) / <alpha-value>)",
          500: "oklch(var(--coral-500) / <alpha-value>)",
          700: "oklch(var(--coral-700) / <alpha-value>)",
        },
        // Bone — clean light backgrounds (50–400)
        bone: {
          50:  "oklch(var(--bone-50) / <alpha-value>)",
          100: "oklch(var(--bone-100) / <alpha-value>)",
          200: "oklch(var(--bone-200) / <alpha-value>)",
          300: "oklch(var(--bone-300) / <alpha-value>)",
          400: "oklch(var(--bone-400) / <alpha-value>)",
        },
        // Earth — text/ink scale
        earth: {
          400: "oklch(var(--earth-400) / <alpha-value>)",
          500: "oklch(var(--earth-500) / <alpha-value>)",
          600: "oklch(var(--earth-600) / <alpha-value>)",
          700: "oklch(var(--earth-700) / <alpha-value>)",
          800: "oklch(var(--earth-800) / <alpha-value>)",
          900: "oklch(var(--earth-900) / <alpha-value>)",
          950: "oklch(var(--earth-950) / <alpha-value>)",
        },
        // Phase 1 semantic aliases
        ink:           "var(--ink)",
        "ink-soft":    "var(--ink-soft)",
        bg:            "var(--bg)",
        "bg-elev":     "var(--bg-elev)",
        surface:       "var(--surface)",
        "primary-ink": "var(--primary-ink)",
        line:          "var(--line)",
        "line-strong": "var(--line-strong)",

        // shadcn-required color keys (bare var() — no hsl() wrappers; tokens are OKLCH)
        background: "var(--background)",
        foreground: "var(--foreground)",
        border:     "var(--border)",
        input:      "var(--input)",
        ring:       "var(--ring)",
        primary: {
          DEFAULT:    "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT:    "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT:    "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT:    "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT:    "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT:    "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT:    "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },

      // ─── Border radius — shadcn standard derivation from --radius (= --r-lg = 14px)
      borderRadius: {
        sm:    "calc(var(--radius) - 4px)",
        md:    "calc(var(--radius) - 2px)",
        lg:    "var(--radius)",
        xl:    "20px",
        "2xl": "28px",
      },

      // ─── Box shadows — CSS var references so dark mode swaps glows for free
      boxShadow: {
        leaf:           "var(--shadow-leaf)",
        bloom:          "var(--shadow-bloom)",
        "glow-bio":     "var(--shadow-glow-bio)",
        "glow-solar":   "var(--shadow-glow-solar)",
        "glow-verdant": "var(--shadow-glow-verdant)",
      },

      // ─── Keyframes — Solarpunk motion vocabulary
      keyframes: {
        "drift-y": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        "drift-x": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%":      { transform: "translateX(8px)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-1.5deg)" },
          "50%":      { transform: "rotate(1.5deg)" },
        },
        "leaf-float": {
          "0%":   { transform: "translate(0,0) rotate(0)", opacity: "0" },
          "10%":  { opacity: "1" },
          "100%": {
            transform: "translate(var(--lx, 200px), var(--ly, -300px)) rotate(var(--lr, 360deg))",
            opacity: "0",
          },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 oklch(0.70 0.16 195 / 0.5)" },
          "50%":      { boxShadow: "0 0 0 18px oklch(0.70 0.16 195 / 0)" },
        },
        "shimmer-line": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%":      { backgroundPosition: "100% 50%" },
        },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.4" },
        },
      },

      // ─── Animation utilities — usable as animate-drift-y, animate-sway, etc.
      animation: {
        "drift-y":      "drift-y 8s ease-in-out infinite",
        "drift-y-slow": "drift-y 14s ease-in-out infinite",
        "drift-x":      "drift-x 9s ease-in-out infinite",
        sway:           "sway 6s ease-in-out infinite",
        "leaf-float":   "leaf-float 12s linear infinite",
        "glow-pulse":   "glow-pulse 2s ease-in-out infinite",
        "shimmer-line": "shimmer-line 3s ease-in-out infinite",
        "spin-slow":    "spin-slow 20s linear infinite",
        "pulse-dot":    "pulse-dot 1.6s ease-in-out infinite",
      },

      // ─── Font families — route through CSS vars defined in globals.css (Plan 01-03)
      //     --font-display and --font-body chain to layout.tsx Next.js font vars
      fontFamily: {
        display: ["var(--font-display)"],
        sans:    ["var(--font-body)"],
        mono:    ["var(--font-mono)"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

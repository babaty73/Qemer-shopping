import type { Config } from "tailwindcss";

/**
 * Kemer Market design system.
 *
 * Raw ramps (emerald/amber/accent/neutral) are the palette; the semantic
 * tokens below (primary, secondary, accent, surface, background, border,
 * success, warning, error) are what components should reach for. Green
 * stays the brand primary, tuned down from the original neon defaults to a
 * deeper, less saturated tone; amber shifts toward a warmer terracotta so
 * it reads as "market" rather than "alert". Neutrals are warmed slightly
 * (a soft greige rather than cool blue-gray) so the page background can sit
 * off-white without looking flat.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "2rem",
        lg: "3rem",
        xl: "4rem",
      },
    },
    extend: {
      colors: {
        emerald: {
          50: "#EEF7F2",
          100: "#D6EEE1",
          200: "#AEDCC4",
          300: "#7FC5A3",
          400: "#4CAA80",
          500: "#12946B", // primary
          600: "#0D7A57", // primary hover / pressed
          700: "#0A6146",
          800: "#084A36",
          900: "#063527",
        },
        amber: {
          50: "#FBF3EA",
          100: "#F5E1CC",
          200: "#EAC79C",
          300: "#DEA96A",
          400: "#CE8C45",
          500: "#B8732E", // secondary
          600: "#97591F", // secondary hover / pressed
          700: "#764417",
        },
        clay: {
          50: "#FAF6EC",
          100: "#F0E6C8",
          200: "#E0CC93",
          300: "#CBAD63",
          400: "#B08D3F",
          500: "#8F7130", // accent
          600: "#705A26",
        },
        neutral: {
          0: "#FFFFFF",
          50: "#FAF9F6",
          100: "#F2F0EA",
          200: "#E7E5E0", // border
          300: "#D6D3CB",
          400: "#A8A39A",
          500: "#78746C",
          600: "#57534B",
          700: "#3F3B35",
          800: "#262420", // dark gray
          900: "#16140F",
        },

        // --- Semantic tokens ---
        primary: {
          DEFAULT: "#12946B",
          hover: "#0D7A57",
          light: "#EEF7F2",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#B8732E",
          hover: "#97591F",
          light: "#FBF3EA",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#8F7130",
          hover: "#705A26",
          light: "#FAF6EC",
          foreground: "#FFFFFF",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#FAF9F6",
        },
        background: {
          DEFAULT: "#FAF9F6",
        },
        border: {
          DEFAULT: "#E7E5E0",
          strong: "#D6D3CB",
        },
        success: {
          DEFAULT: "#1B8A4B",
          light: "#E7F6ED",
        },
        warning: {
          DEFAULT: "#B4750C",
          light: "#FCF1DD",
        },
        error: {
          DEFAULT: "#C0362C",
          light: "#FBEAE8",
        },
      },
      fontFamily: {
        // Display face: carries the premium/editorial personality, used with restraint
        display: ["'Fraunces'", "ui-serif", "Georgia", "serif"],
        // Body/UI face: neutral, highly legible workhorse
        sans: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
        // Data/price face: the signature — prices and stock/SKU-style data read like market tags
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        xs: "0 1px 2px rgb(22 20 15 / 0.04)",
        soft: "0 2px 10px -4px rgb(22 20 15 / 0.08), 0 1px 2px -1px rgb(22 20 15 / 0.04)",
        card: "0 10px 28px -10px rgb(22 20 15 / 0.12), 0 2px 8px -2px rgb(22 20 15 / 0.06)",
        lifted: "0 24px 48px -16px rgb(22 20 15 / 0.20)",
        focus: "0 0 0 3px rgb(18 148 107 / 0.18)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;

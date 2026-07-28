import type { Config } from "tailwindcss";

/**
 * Kemer Market design tokens.
 * Brand colors are fixed by the project brief — do not introduce new hues,
 * only tints/shades of these three families plus neutrals.
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
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981", // primary
          600: "#059669", // primary hover / pressed
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        amber: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B", // secondary
          600: "#D97706", // secondary hover / pressed
          700: "#B45309",
        },
        neutral: {
          0: "#FFFFFF",
          50: "#F9FAFB",
          100: "#F3F4F6", // light gray
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937", // dark gray
          900: "#111827",
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
        soft: "0 2px 8px -2px rgb(17 24 39 / 0.06), 0 1px 2px -1px rgb(17 24 39 / 0.04)",
        card: "0 8px 24px -8px rgb(17 24 39 / 0.10), 0 2px 6px -2px rgb(17 24 39 / 0.06)",
        lifted: "0 20px 40px -16px rgb(17 24 39 / 0.18)",
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

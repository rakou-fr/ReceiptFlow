/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Noir profond
        dark: {
          900: "#0B0B0D",
          800: "#111113",
          700: "#1A1A1D",
          600: "#232326",
        },

        // Argent premium
        silver: {
          100: "#F5F5F7",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
        },

        // Glass system
        glass: {
          bg: "rgba(255,255,255,0.06)",
          border: "rgba(255,255,255,0.12)",
          highlight: "rgba(255,255,255,0.25)",
        },

        accent: {
          DEFAULT: "#C0C0C0",
          glow: "#E8E8E8",
        },

        status: {
          danger: "#EF4444",
          success: "#22C55E",
          warning: "#F59E0B",
        },
      },

      keyframes: {
        scrollVertical: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
        slideUp: {
          "0%": { transform: "translateY(40px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },

      animation: {
        slideUp: "slideUp 0.3s ease-out",
        scrollSlow: "scrollVertical 40s linear infinite",
        scrollSlow2: "scrollVertical 28s linear infinite",
      },
    },
  },
  plugins: [],
};

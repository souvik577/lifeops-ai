/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neutral "console" surface scale
        surface: {
          DEFAULT: "#FAFAF9",
          card: "#FFFFFF",
          border: "#E6E7EA",
          muted: "#F1F2F4",
        },
        ink: {
          DEFAULT: "#10131A",
          secondary: "#5B6270",
          faint: "#9AA0AC",
        },
        // Primary brand: deep operations-blue
        ops: {
          50: "#EEEFF9",
          100: "#D6D8F0",
          300: "#7B80C4",
          500: "#3A3F8F",
          600: "#2A2F6D",
          700: "#20244F",
        },
        // Single reserved signal color for urgency/priority
        signal: {
          DEFAULT: "#D6572A",
          50: "#FCEEE7",
          200: "#F2B99C",
          600: "#D6572A",
          700: "#B0451F",
        },
        success: {
          DEFAULT: "#2F9E68",
          50: "#E8F6EF",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        control: "0.5rem",
        card: "0.875rem",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(16, 19, 26, 0.04)",
        popover: "0 8px 24px -4px rgba(16, 19, 26, 0.14)",
      },
      maxWidth: {
        prose: "38rem",
      },
    },
  },
  plugins: [],
};

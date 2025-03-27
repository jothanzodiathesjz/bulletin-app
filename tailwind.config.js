const animate = require("tailwindcss-animate");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  safelist: ["dark"],
  prefix: "",

  content: [
    "./pages/**/*.{ts,tsx,vue}",
    "./components/**/*.{ts,tsx,vue}",
    "./app/**/*.{ts,tsx,vue}",
    "./src/**/*.{ts,tsx,vue}",
  ],

  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          main: "#00329A",
          surface: "#AADCFF",
          border: "#5082EA",
          hover: "#1446AE",
          pressed: "#001E86",
          focus: "#5082EA",
          logo: "#0C4E97",
          light: "#F0F7FF",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          surface: "#FFF8F3", // Main background color
          border: "#F5EBE4", // Slightly darker cream for borders
          main: "#FFE6D1", // Main cream color
          hover: "#FFD6B8", // Darker cream for hover
          pressed: "#FFC69F", // Even darker for pressed state
          mainBg: "#f4f5f9",
        },
        black: "#1A1A1A", // Text color from design
        "off-white": "#FFF8F3", // Background color
        cyan: "#F5F9FC",
        neutral: {
          10: "#0A0A0A",
          20: "#141414",
          30: "#262626",
          40: "#4E4E4E",
          50: "#767676", // Secondary text color from design
          60: "#8A8A8A",
          70: "#9E9E9E",
          80: "#E0E0E0",
          90: "#F5F5F5",
          100: "#FFFFFF",
          120: "#6a737e",
        },
        success: {
          surface: "#40A99E", // Medical App teal color
          border: "#389088", // Darker teal
          main: "#307B74", // Main teal
          hover: "#286660", // Darker for hover
          pressed: "#20524D", // Even darker for pressed
        },
        danger: {
          surface: "#F1657C", // Making History Notes pink color
          border: "#EE4D67", // Darker pink
          main: "#EB3453", // Main pink
          hover: "#E81B3F", // Darker for hover
          pressed: "#D31435", // Even darker for pressed
        },
        info: {
          surface: "#5B7FFF", // Done task color
          border: "#4268FF", // Darker blue
          main: "#2952FF", // Main blue
          hover: "#103BFF", // Darker for hover
          pressed: "#002AF6", // Even darker for pressed
        },
        warning: {
          surface: "#FFB577", // In Progress task color (using orange)
          border: "#FF9A47", // Darker orange
          main: "#FF8929", // Main orange
          hover: "#FF7A1A", // Darker for hover
          pressed: "#FF6B00", // Even darker for pressed
        },
        dark: {
          surface: "#032647", // Using text dark color
          border: "#2D3748",
          main: "#4A5568",
          hover: "#2C5282",
          pressed: "#2A4365",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "collapsible-down": {
          from: { height: 0 },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-in-out",
        "collapsible-up": "collapsible-up 0.2s ease-in-out",
      },
      fontFamily: {
        blackhan: ["Rubik Mono One", "serif"],
        lilita: ["Lilita One", "serif"],
        bebas: ["Bebas Neue", "serif"],
      },
    },
  },
  plugins: [animate],
};

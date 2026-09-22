import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "signin-hero": "url('/single-bulb.jpeg')",
      },
      colors: {
        'primary': '#2563EB',
        'primary-hover': '#1D4ED8',
        'primary-active': '#1E40AF',
        'brand-navy': '#0A0F1F',
        'brand-cyan': '#06B6D4',
        'brand-lime': '#84CC16',
        'brand-surface': '#F8FAFC',
        'secondary': '#FFFFFF'
      }
      },
      screens: {
          '2lg': '1100px',
          ...defaultTheme.screens
      }
  },
  plugins: [],
};
export default config;

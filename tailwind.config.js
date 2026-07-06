/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{html,ts}",
];

export const theme = {
  extend: {
    colors: {
      brand: {
        50: "#eff9f5",
        100: "#d7f0e4",
        200: "#b0e1cb",
        300: "#7fcbac",
        400: "#4dae8a",
        500: "#2e9270",
        600: "#20755a",
        700: "#1c5e49",
        800: "#194b3c",
        900: "#163e33",
        950: "#0a231d",
      },
      accent: {
        50: "#fff7ed",
        100: "#ffedd4",
        200: "#ffd8a8",
        300: "#ffbb70",
        400: "#ff9636",
        500: "#fd7a10",
        600: "#ee5f06",
        700: "#c54808",
        800: "#9c390f",
        900: "#7e3110",
      },
    },
    fontFamily: {
      sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
    },
    keyframes: {
      "fade-in": {
        "0%": { opacity: "0" },
        "100%": { opacity: "1" },
      },
      "fade-in-up": {
        "0%": { opacity: "0", transform: "translateY(12px)" },
        "100%": { opacity: "1", transform: "translateY(0)" },
      },
      "scale-in": {
        "0%": { opacity: "0", transform: "scale(0.95)" },
        "100%": { opacity: "1", transform: "scale(1)" },
      },
      "slide-in-right": {
        "0%": { opacity: "0", transform: "translateX(24px)" },
        "100%": { opacity: "1", transform: "translateX(0)" },
      },
      "toast-in": {
        "0%": { opacity: "0", transform: "translateY(-12px) scale(0.95)" },
        "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
      },
    },
    animation: {
      "fade-in": "fade-in 0.4s ease-out both",
      "fade-in-up": "fade-in-up 0.5s ease-out both",
      "scale-in": "scale-in 0.25s ease-out both",
      "slide-in-right": "slide-in-right 0.3s ease-out both",
      "toast-in": "toast-in 0.25s cubic-bezier(0.16,1,0.3,1) both",
    },
  },
};
export const plugins = [];
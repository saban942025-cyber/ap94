import type { Config } from "tailwindcss";

const config: Config = {
  // בגרסה 4 הגדרת ה-content היא קריטית כדי שהוא ידע איפה לחפש
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ['var(--font-rubik)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;

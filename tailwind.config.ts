import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          50: "#ecf9ff",
          100: "#cef1ff",
          200: "#a3e6ff",
          300: "#66d9ff",
          400: "#22ccff",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
      },
      borderRadius: {
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;

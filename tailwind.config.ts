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
        paytm: {
          navy: "#002970",
          cyan: "#00baf2",
          lightCyan: "#e0f7fc",
          blueAccent: "#0052cc",
          darkSlate: "#0b132b",
          lightGray: "#f4f6f9",
          cardBg: "#ffffff",
          border: "#e2e8f0"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"]
      }
    },
  },
  plugins: [],
};
export default config;

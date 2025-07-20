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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        scroll: {
          to: {
            transform: "translateX(calc(-50% - 0.5rem))",
          },
        },
      },
      animation: {
        scroll: "scroll 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

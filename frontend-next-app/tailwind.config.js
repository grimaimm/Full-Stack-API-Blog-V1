/** @type {import('tailwindcss').Config} */

import {heroui} from "@heroui/react";

module.exports = {
  content: [
    // Path HeroUI
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",

    // Path Custom
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/**/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/**/**/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/**/**/**/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/**/**/**/**/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/**/**/**/**/**/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/**/**/**/**/**/**/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/**/**/**/**/**/**/**/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    heroui({
      prefix: "aimdev", // prefix for themes variables
      defaultTheme: "dark", // default theme from the themes object
      addCommonColors: true, // override common colors (e.g. "blue", "green", "pink").
      themes: {
        light: {
          colors: {
            secondary: "#7828C8",
          }, // light theme colors
        },
        dark: {
          colors: {
            secondary: "#7828C8",
          }, // dark theme colors
        },
        // ... custom themes
      },
    }),
  ]
}


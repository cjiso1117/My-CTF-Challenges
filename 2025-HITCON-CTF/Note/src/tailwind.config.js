/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#6366f1", // indigo-500
          secondary: "#8b5cf6", // violet-500
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#6366f1", // indigo-500
          secondary: "#8b5cf6", // violet-500
        },
      },
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
  },
}

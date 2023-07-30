/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ghostwhite: "#eeeef4",
        silver: "rgba(195, 195, 195, 0)",
        gray: {
          "100": "#12152a",
          "200": "rgba(0, 0, 0, 0.5)",
        },
        white: "#fff",
        limegreen: "#40ba21",
        darkgray: "#91a3b0",
        crimson: "#e02727",
      },
      fontFamily: {
        "ibm-plex-sans": "'IBM Plex Sans'",
        montserrat: "Montserrat",
      },
    },
    fontSize: {
      base: "16px",
      lg: "18px",
      "21xl": "40px",
      "13xl": "32px",
      "5xl": "24px",
      xl: "20px",
    },
  },
  corePlugins: {
    preflight: false,
  },
};

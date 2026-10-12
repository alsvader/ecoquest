/**
 * EcoQuest landing — Tailwind v3.
 * Parte del tema oficial (tailwind-theme.js, copia sin cambios de estilo-visual/tailwind-theme.js)
 * y solo añade lo que la landing necesita.
 */
const eq = require("./tailwind-theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...eq,
  content: ["./index.html", "./src/**/*.js"],
  theme: {
    ...eq.theme,
    extend: {
      ...eq.theme.extend,
      fontFamily: {
        ...eq.theme.extend.fontFamily,
        // "EQ Pixel" = Silkscreen Bold con subsets latin + latin-ext (fix de mayúsculas acentuadas de la guía)
        pixel: ['"EQ Pixel"', '"Silkscreen"', "monospace"],
      },
      boxShadow: {
        ...eq.theme.extend.boxShadow,
        "brutal-hover": "7px 7px 0 0 #000", // guía .btn:hover
      },
      maxWidth: { wrap: "1312px" },
      screens: { xs: "420px" },
    },
  },
};

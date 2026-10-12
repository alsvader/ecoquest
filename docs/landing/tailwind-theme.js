/**
 * EcoQuest — Tailwind theme (neo-brutalismo · videojuego)
 * Úsalo en tailwind.config.(js|ts):  const eq = require("./tailwind-theme");
 *   module.exports = { ...eq, content: ["./app/**\/*.{ts,tsx}", "./components/**\/*.{ts,tsx}"] }
 * Requiere tokens.css (variables shadcn/ui) importado en globals.css.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        // Paleta EcoQuest
        lima: "#B6FF3B",      // Lima Edén
        voltio: "#FFE600",    // Amarillo Voltio
        turbo: "#FF3EA5",     // Rosa Turbo
        glitch: "#00E5FF",    // Cian Glitch
        lava: "#FF7A00",      // Naranja Lava
        selva: "#0A5C2B",     // Selva Profunda
        tinta: "#000000",     // Tinta
        papel: "#FFFBEF",     // Papel
        // Estados de resultado IA
        status: {
          match: "#B6FF3B",   // Coincidencia
          unsure: "#FFE600",  // No confirmado
          retry: "#FF7A00",   // Reintentar
          manual: "#FF3EA5",  // Revisión manual · No verificada
        },
        // Puente shadcn/ui
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
      },
      fontFamily: {
        pixel: ['"Silkscreen"', "monospace"], // usar con font-bold uppercase
        display: ['"Archivo Black"', '"Arial Black"', "sans-serif"],
        sans: ['"Space Grotesk"', "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["14px", "1.4"],
        sm: ["16px", "1.45"],
        base: ["18px", "1.5"],
        lg: ["22px", "1.4"],
        xl: ["28px", "1.2"],
        "2xl": ["36px", "1.1"],
        "3xl": ["48px", "1.05"],
        "4xl": ["64px", "1"],
        "pixel-sm": ["13px", "1.5"],
        "pixel-md": ["16px", "1.5"],
        "pixel-lg": ["26px", "1.3"],
      },
      borderWidth: { 3: "3px", 4: "4px" },
      borderRadius: { none: "0", DEFAULT: "0", sm: "0", md: "0", lg: "0", xl: "0", full: "0" },
      boxShadow: {
        "brutal-sm": "3px 3px 0 0 #000",
        brutal: "5px 5px 0 0 #000",
        "brutal-lg": "8px 8px 0 0 #000",
        none: "none",
      },
      translate: { press: "5px" }, // active:translate-x-press active:translate-y-press active:shadow-none
      rotate: { sticker: "-2deg", "sticker-r": "2deg" },
      minHeight: { tap: "56px" },
      minWidth: { tap: "56px" },
      transitionDuration: { snap: "80ms" },
      backgroundImage: { none: "none" }, // sin degradados
    },
  },
  plugins: [require("tailwindcss-animate")],
};

/* Ejemplo de botón shadcn/ui con estilo EcoQuest:
   <Button className="h-14 border-4 border-tinta bg-lima text-tinta font-display text-lg shadow-brutal
                      transition-transform duration-snap hover:-translate-x-0.5 hover:-translate-y-0.5
                      active:translate-x-press active:translate-y-press active:shadow-none
                      focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-turbo">
     ¡Comenzar expedición!
   </Button>
*/

# EcoQuest — Sistema de diseño para implementar (Next.js + TypeScript + Tailwind CSS + shadcn/ui)

> **Versión:** v0.1 (borrador) · **Idioma de la UI:** español de México (`es-MX`), tuteo
> **Lema:** *The Real World Is Your Playground.*
> **Estilo:** neo-brutalismo con alma de videojuego / arcade: colores planos y saturados, bordes gruesos de Tinta, sombras duras sin desenfoque, esquinas a 90°, tipografía pixel para el HUD.

---

## 0. Brief para Claude (léelo primero)

**Rol:** Eres un/a ingeniero/a frontend senior especializado en Next.js (App Router), TypeScript, Tailwind CSS y shadcn/ui, con buen ojo para el diseño visual y la accesibilidad.

**Tarea:** Implementa este sistema de diseño de **EcoQuest** en la app Next.js + TypeScript + Tailwind CSS + shadcn/ui. Debes:

1. Instalar los tokens (`tokens.css`) y el tema de Tailwind (`tailwind-theme.js`) **exactamente** como aparecen en este documento (§6).
2. Cargar las tres fuentes (Silkscreen, Archivo Black, Space Grotesk).
3. Reestilizar/crear los componentes de §7 (Button, MissionCard, StatusBadge, XpBar, Insignia, Toast, SafetyNotice, Sticker, PixelIcon).
4. Maquetar las 4 pantallas clave de §8 (Bienvenida, Misiones, Resultado de IA, Resumen + Insignia) con el copy en español indicado.
5. Verificar todo con la checklist de accesibilidad (§9) y la checklist de aceptación (§10).

**Imágenes de referencia adjuntas (van junto a este archivo):**

- `mockups-moviles.png` — las 4 pantallas móviles clave. **Es la referencia visual principal para §8.**
- `guia-estilo-fullpage.png` — la guía de estilo completa (paleta, tipografía, reglas, componentes, pantallas).

**Reglas para ti, Claude:**

- **No inventes** colores, tamaños, sombras ni radios. Usa solo los valores de este documento. Si algo no está definido, usa el token más cercano y deja un comentario `// TODO(diseño): …`.
- Usa las clases de Tailwind del tema (`bg-lima`, `shadow-brutal`, `border-4`, `font-display`…). Evita valores arbitrarios (`bg-[#…]`) salvo los marcados explícitamente aquí como «valor auxiliar de la guía».
- Las medidas de los mockups están **reducidas** (teléfono de 280 px de ancho en la guía). En la app real manda la escala tipográfica de §4 (cuerpo ≥ 18 px) y los objetivos táctiles de §5.
- La IA **nunca** «sabe»: «cree», «parece», «no está segura». Nunca muestres nombres de especie ni porcentajes como si fueran probabilidades.

---

## 1. Concepto y tono

- **El parque es el nivel.** La app es solo el «menú de pausa»: eliges la expedición, guardas el teléfono y juegas en el mundo real. La interfaz parece un cartucho de juego impreso: plana, directa, «gritona» y legible bajo el sol de Tabasco.
- **Producto:** EcoQuest, reto *Touch Grass* (Hacktoberfest 2026). Expedición piloto **«Descubre el Edén»** en el Parque Tomás Garrido Canabal (Villahermosa, Tabasco): ~20 min, 3 misiones. SigLIP2 (pesos abiertos) estima si cada foto corresponde a la misión. Sin cuenta, sin ubicación precisa, fotos borrables.
- **Voz:** español mexicano, tuteo, frases cortas de acción. Entusiasta como un HUD de juego, pero **honesta**. Tono: *Juguetona · Directa · Honesta · Segura*.

**Microcopy — sí:**

- «Parece una flor. ¡Misión completada!»
- «No estamos seguros. ¿Otra foto?»
- «Guarda el teléfono. Mira a tu alrededor.»

**Microcopy — no:**

- «Especie identificada: *Ceiba pentandra*» (nunca taxonomía como verdad)
- «¡Caminaste 2 km fuera de pantalla!» (nunca métricas no medidas; se dice «Tiempo en sesión»)

---

## 2. Principios y reglas duras

### 2.1 Principios

1. **Screen-last.** Pocas pantallas, casi sin escritura. **Una sola acción principal gigante por pantalla**, alcanzable con el pulgar (abajo). Nada de feeds, animaciones en bucle ni notificaciones que llamen de vuelta.
2. **Legible al sol.** Texto negro sobre colores saturados (contraste ≥ 6.4:1), cuerpo de 18 px mínimo, objetivos táctiles grandes, sin texto gris claro ni texto sobre fotos.
3. **Seguro y privado.** El aviso de seguridad usa Naranja Lava y aparece antes de empezar. El estado nunca depende solo del color: **siempre icono + texto**. Sin cuenta ni ubicación.
4. **Curiosidad sobre exactitud.** La UI reconoce cuándo la IA no está segura.

### 2.2 Hacer ✓ / No hacer ✕

| ✓ HACER | ✕ NO HACER |
|---|---|
| Bordes sólidos de Tinta (`#000`): **3 px** en elementos pequeños (badges, chips, stickers), **4 px** en tarjetas, botones y marcos | Bordes finos de 1 px, bordes grises o de color |
| Sombras duras desplazadas abajo-derecha: **3 / 5 / 8 px**, negras, sólidas, **blur 0** (`shadow-brutal-sm` / `shadow-brutal` / `shadow-brutal-lg`) | `shadow-md`, `shadow-lg` de Tailwind, sombras difusas, glow, `drop-shadow` con blur |
| Rellenos planos de un solo color | Degradados, transparencias, desenfoques, glassmorphism |
| `border-radius: 0` en todo (el tema ya pone todos los `rounded-*` a 0) | Pastillas redondeadas, tarjetas con esquinas suaves |
| **Texto negro** sobre cualquier color brillante (Lima, Voltio, Turbo, Glitch, Lava) | Texto blanco sobre colores brillantes (falla WCAG; Blanco/Rosa 3.2:1) |
| Texto **blanco/Papel solo sobre Tinta o Selva Profunda** (los acentos brillantes como texto sobre negro también son válidos, p. ej. Voltio o Lima sobre Tinta, como en el lema y los números de sección de la guía) | Texto gris claro, texto sobre fotos |
| Cuerpo de texto **≥ 18 px** en móvil (`text-base`) | Párrafos de 14 px; `text-xs` (14 px) solo para metadatos no esenciales |
| Objetivos táctiles **≥ 56 px** para acciones principales (`min-h-tap`), **nunca < 48 px** para nada pulsable | Botones o enlaces pequeños, iconos sueltos pulsables |
| **Icono + texto** en cada estado (resultado de IA, misión, toast) | Estado comunicado solo con color |
| Stickers inclinados **±2°** solo en etiquetas decorativas | Inclinar botones, texto de lectura o formularios |
| Movimiento seco: **80 ms**, sin rebote; al pulsar, el botón **se hunde en su sombra** | Easing elástico, animaciones en bucle, confeti continuo |
| Respetar `prefers-reduced-motion` | Animar sin alternativa reducida |
| Silkscreen solo en etiquetas cortas en MAYÚSCULAS (HUD, contadores, insignias, stickers) | Silkscreen en párrafos, instrucciones o avisos de seguridad |

---

## 3. Paleta

Seis colores saturados con roles fijos, más Tinta y Papel. **Regla de oro:** sobre un color brillante, el texto es siempre negro. El blanco solo va sobre Tinta o Selva Profunda.

| Nombre | Hex | Clase Tailwind | Variable CSS | Rol |
|---|---|---|---|---|
| **Lima Edén** | `#B6FF3B` | `lima` / `primary` | `--eq-lima` | Primario: naturaleza, CTA principal, «Coincidencia», progreso logrado |
| **Amarillo Voltio** | `#FFE600` | `voltio` | `--eq-amarillo` | XP · atención: barra de progreso, insignias, «No confirmado», resaltados |
| **Rosa Turbo** | `#FF3EA5` | `turbo` / `accent` | `--eq-rosa` | Acento · logro: logros, stickers, **foco de teclado**, «Revisión manual» |
| **Cian Glitch** | `#00E5FF` | `glitch` / `secondary` | `--eq-cian` | IA · info: todo lo que hace la IA (análisis, resultados, ayuda, info), botón de cámara |
| **Naranja Lava** | `#FF7A00` | `lava` / `destructive` | `--eq-naranja` | Alerta: seguridad, «Reintentar», errores de red, acciones destructivas |
| **Selva Profunda** | `#0A5C2B` | `selva` | `--eq-selva` | Fondo oscuro: secciones oscuras y fondos de pantalla; texto blanco/Papel |
| **Tinta** | `#000000` | `tinta` | `--eq-tinta` | Estructura: bordes, sombras duras, texto. El «pegamento» del sistema |
| **Papel** | `#FFFBEF` | `papel` / `background` | `--eq-papel` | Base: fondo general; más cálido y menos deslumbrante que el blanco |
| Blanco | `#FFFFFF` | `white` / `card` | `--eq-blanco` | Fondo de tarjetas, paneles y botón secundario |

### 3.1 Mapeo de estados de resultado de IA

| Estado | Color | Clase | Variable | Icono | Texto |
|---|---|---|---|---|---|
| Coincidencia (tentativa) | Lima Edén | `bg-status-match` | `--eq-status-match` | ✓ | «Coincidencia» |
| No confirmado | Amarillo Voltio | `bg-status-unsure` | `--eq-status-unsure` | ? | «No confirmado» |
| Reintentar | Naranja Lava | `bg-status-retry` | `--eq-status-retry` | ↻ | «Reintentar» |
| Revisión manual · No verificada | Rosa Turbo | `bg-status-manual` | `--eq-status-manual` | ✋ | «Revisión manual» + subetiqueta «No verificada» |

### 3.2 Pares de contraste (WCAG 2.x, de la guía)

| Par (texto / fondo) | Ratio | Texto normal | Texto grande ≥ 24 px | Uso |
|---|---|---|---|---|
| Tinta / Papel | 20.3:1 | AAA | AAA | Cuerpo de texto |
| Tinta / Lima Edén | 17.4:1 | AAA | AAA | Botón primario, coincidencia |
| Tinta / Amarillo Voltio | 16.6:1 | AAA | AAA | XP, no confirmado |
| Tinta / Cian Glitch | 13.7:1 | AAA | AAA | Paneles de IA |
| Tinta / Naranja Lava | 8.0:1 | AAA | AAA | Seguridad, reintentar |
| Blanco / Selva Profunda | 8.1:1 | AAA | AAA | Secciones oscuras |
| Tinta / Rosa Turbo | 6.5:1 | AA | AAA | Logros, revisión manual |
| Blanco / Rosa Turbo | 3.2:1 | **Falla** | AA | **Evitar** |
| Blanco / Lima · Amarillo · Cian · Naranja | 1.2–2.6:1 | **Falla** | **Falla** | **Prohibido** |

Los colores entre sí (p. ej. rosa sobre lima) **no** se usan para texto: siempre van separados por un borde de Tinta.

### 3.3 Valores auxiliares que aparecen en la guía (no son tokens)

Estos hex aparecen en `index.html` para casos puntuales. Úsalos solo en esos casos, como valor arbitrario de Tailwind, y nunca como color nuevo de marca:

| Hex | Uso en la guía |
|---|---|
| `#F2FFE0` | Fondo de una tarjeta de misión **completada** (`.mission.done`) |
| `#E8E4D6` | Fondo de botón **deshabilitado** e insignia **bloqueada** |
| `#555555` | Texto de botón deshabilitado |
| `#222222` | Texto secundario (`.muted`) en la guía; en la app prefiere `text-muted-foreground` (L 15 %) |
| `#3A7D2C` | Relleno de marcador de posición de la foto (pantalla Resultado de IA) |
| `#7A4A1E` | Café del tronco en el icono pixel «árbol» |

---

## 4. Tipografía

| Rol | Fuente | Pesos | Clase | Uso |
|---|---|---|---|---|
| Pixel · HUD | **Silkscreen** | **700** (bold) | `font-pixel font-bold uppercase` | Solo etiquetas cortas en MAYÚSCULAS: contadores, «MISIÓN 1/3», insignias, stickers, HUD. Nunca párrafos ni instrucciones de seguridad. Se eligió sobre Press Start 2P porque esta no tiene mayúsculas acentuadas (Ó, É, Á). |
| Display | **Archivo Black** | 400 (es su único peso; ya es negrísima) | `font-display` | Titulares, nombres de misión y botones. Pesada y compacta: se lee a distancia y con reflejos de sol. |
| Lectura | **Space Grotesk** | 400 · 500 · 700 | `font-sans` (por defecto) | Texto de interfaz, instrucciones y resultados de IA. Cuerpo mínimo 18 px en móvil; 700 para lo esencial. |

> Nota: en la guía, Silkscreen lleva `letter-spacing: .5px` (`tracking-[0.5px]`). Archivo Black **no** debe llevar `font-bold` (no hay peso 700; el navegador lo falsearía).

### 4.1 Escala tipográfica (móvil)

| Token / clase | Tamaño · interlineado | Fuente recomendada | Ejemplo |
|---|---|---|---|
| `text-pixel-lg` | 26 px · 1.3 | Silkscreen Bold | MISIÓN 2/3 · ¡EXPEDICIÓN! |
| `text-pixel-md` | 16 px · 1.5 | Silkscreen Bold | HUD, contadores |
| `text-pixel-sm` | 13 px · 1.5 | Silkscreen Bold | Stickers, etiquetas «MISIÓN 1/3» |
| `text-4xl` | 64 px · 1 | Archivo Black | ¡Lo lograste! |
| `text-3xl` | 48 px · 1.05 | Archivo Black | Descubre el Edén |
| `text-2xl` | 36 px · 1.1 | Archivo Black | Encuentra una flor |
| `text-xl` | 28 px · 1.2 | Archivo Black | Resultado de la IA |
| `text-lg` | 22 px · 1.4 | Space Grotesk 700 | Parece una hoja. ¡Misión completada! |
| `text-base` | 18 px · 1.5 | Space Grotesk 500 | Camina por el sendero y busca una hoja más grande que tu mano. |
| `text-sm` | 16 px · 1.45 | Space Grotesk 400 | La IA compara tu foto con categorías visuales; no identifica especies. |
| `text-xs` | 14 px · 1.4 | Space Grotesk | **Solo metadatos**; nunca texto esencial en exterior |

### 4.2 Carga de fuentes

**Opción A (por defecto, idéntica a los archivos):** `tokens.css` ya incluye en su línea 6:

```css
@import url("https://fonts.googleapis.com/css2?family=Archivo+Black&family=Silkscreen:wght@400;700&family=Space+Grotesk:wght@400;500;700&display=swap");
```

y `tailwind-theme.js` referencia los nombres de familia literales (`"Silkscreen"`, `"Archivo Black"`, `"Space Grotesk"`). Con solo importar `tokens.css` **al principio** de `globals.css` (antes de las directivas `@tailwind`), funciona. Añade `preconnect` en el `<head>` si quieres:

```tsx
// app/layout.tsx (dentro de <head>, opcional)
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
```

**Opción B (recomendada para producción, `next/font`, autoalojada y sin saltos de layout):** `next/font` genera nombres de familia con hash, así que **no** coinciden con los nombres literales del tema. Usa variables CSS y sobrescribe `fontFamily` en `tailwind.config.ts` (no edites `tailwind-theme.js`):

```tsx
// app/fonts.ts
import { Archivo_Black, Silkscreen, Space_Grotesk } from "next/font/google";

export const fontPixel = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"], // necesario para Á É Í Ó Ú Ñ
  display: "swap",
  variable: "--font-pixel",
});

export const fontDisplay = Archivo_Black({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-display",
});

export const fontBody = Space_Grotesk({
  weight: ["400", "500", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-body",
});
```

```tsx
// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontBody, fontDisplay, fontPixel } from "./fonts";

export const metadata: Metadata = {
  title: "EcoQuest",
  description: "The Real World Is Your Playground.",
};

export const viewport: Viewport = { themeColor: "#FFFBEF" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={`${fontPixel.variable} ${fontDisplay.variable} ${fontBody.variable}`}>
      <body className="min-h-dvh bg-background font-sans text-base text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
```

```ts
// tailwind.config.ts — solo con la Opción B
fontFamily: {
  pixel: ["var(--font-pixel)", '"Silkscreen"', "monospace"],
  display: ["var(--font-display)", '"Archivo Black"', '"Arial Black"', "sans-serif"],
  sans: ["var(--font-body)", '"Space Grotesk"', "system-ui", "sans-serif"],
},
```

Con la Opción B, la línea `@import url(...)` de `tokens.css` duplica la descarga: puedes dejarla (funciona igual) o quitar **solo esa línea** de la copia en la app. No cambies ningún otro valor.

---

## 5. Tokens de forma, espacio y movimiento

| Categoría | Token CSS | Valor | Tailwind |
|---|---|---|---|
| Borde | `--eq-border` | 3 px | `border-3` |
| Borde grande | `--eq-border-lg` | 4 px | `border-4` |
| Radio | `--eq-radius` / `--radius` | 0 | `rounded-*` → todos 0 (incluido `rounded-full`) |
| Sombra pequeña | `--eq-shadow-sm` | `3px 3px 0 0 #000` | `shadow-brutal-sm` |
| Sombra | `--eq-shadow` | `5px 5px 0 0 #000` | `shadow-brutal` |
| Sombra grande | `--eq-shadow-lg` | `8px 8px 0 0 #000` | `shadow-brutal-lg` |
| Pulsado | `--eq-press` | `translate(5px, 5px)` | `active:translate-x-press active:translate-y-press active:shadow-none` |
| Inclinación sticker | `--eq-tilt` | −2° (y +2° para la variante derecha) | `rotate-sticker` (−2°) · `rotate-sticker-r` (+2°) — ver nota ↓ |
| Espacio 1–8 | `--eq-space-1…8` | 4 · 8 · 12 · 16 · 24 · 32 · 48 px | Escala nativa de Tailwind: `1`=4, `2`=8, `3`=12, `4`=16, `6`=24, `8`=32, `12`=48 |
| Objetivo táctil | `--eq-tap-min` | 56 px (recomendado en exterior; WCAG pide ≥ 44 px) | `min-h-tap`, `min-w-tap` |
| Duración | `--eq-dur` | 80 ms, sin easing elástico | `duration-snap` |

> **Nota sobre la inclinación:** en el tema, `rotate.sticker` ya vale `-2deg`, así que la clase es `rotate-sticker` (no `-rotate-sticker`). `rotate-sticker-r` = `+2deg`.

**Movimiento del botón (de la guía):**

- Reposo: `shadow-brutal` (5 px).
- Hover (solo puntero): sube `translate(-2px,-2px)` y la sombra crece a `7px 7px 0 0 #000` → `hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#000]`.
- Activo / presionado: **se hunde en su sombra** `translate(5px,5px)` + sombra `none` → `active:translate-x-press active:translate-y-press active:shadow-none`.
- Transición: `transition-[transform,box-shadow] duration-snap` (80 ms).
- `prefers-reduced-motion: reduce`: `tokens.css` desactiva todas las transiciones y animaciones (el hundimiento ocurre instantáneo; está bien).

**Objetivos táctiles en la app:** acción principal `min-h-tap` (56 px) a **ancho completo** en móvil; acciones secundarias/terciarias (`size="sm"`) **mínimo 48 px** (`min-h-12`). Nada pulsable por debajo de 48 px.

---

## 6. Archivos de tokens (copiar EXACTAMENTE)

### 6.1 Estructura sugerida

```
app/
  globals.css          ← importa tokens.css primero
  tokens.css           ← copia exacta de §6.3
  layout.tsx
  fonts.ts             ← solo si usas next/font (Opción B)
components/
  ui/button.tsx        ← reemplaza el de shadcn (§7.1)
  eq/…                 ← componentes EcoQuest (§7)
lib/utils.ts           ← cn() de shadcn
tailwind-theme.js      ← copia exacta de §6.4 (raíz del proyecto)
tailwind.config.ts
```

### 6.2 Instalación y notas importantes

1. **Tailwind v3.** `tailwind-theme.js` es un config de **Tailwind v3** (`module.exports`, `theme.extend`, `plugins: [require(...)]`). Usa `tailwindcss@3` (3.4.x). Para shadcn/ui con Tailwind v3, inicializa con la CLI compatible con v3 (`npx shadcn@2.3.0 init`). Si el proyecto ya está en Tailwind v4, carga este config con `@config "../tailwind.config.ts";` en `globals.css` y verifica que las variables HSL de shadcn sigan funcionando; **no** migres los valores a OKLCH ni los cambies.
2. **`tailwindcss-animate` es obligatorio** (el tema lo requiere en `plugins`): `npm i -D tailwindcss-animate`. Sin él, el build falla.
3. **La CLI de shadcn sobrescribe** `tailwind.config` y `globals.css` al hacer `init`. Haz `init` primero y **después** pega los archivos de este documento. Al añadir componentes (`npx shadcn add …`), revisa que no reintroduzcan `rounded-*` con valores, `shadow-sm/md`, `ring-offset` grises, etc.
4. **`borderRadius.full` vale 0.** Todos los `rounded-*` (incluido `rounded-full`) quedan en 0: los componentes de shadcn salen cuadrados, lo cual es intencional. **Excepción (avatares u otro círculo imprescindible):** usa un valor arbitrario `rounded-[9999px]` (o `rounded-[50%]`), ya que `rounded-full` ya no redondea. Revisa visualmente Switch, Radio, Slider y Avatar de shadcn.
5. **Sin degradados:** `backgroundImage.none` existe para `bg-none`. La **única** excepción documentada en la guía es el rayado duro de la barra de XP continua (`repeating-linear-gradient` con cortes duros, que no es un degradado visual). No uses ningún otro.
6. **Variables shadcn:** `tokens.css` define las variables de shadcn/ui en formato `H S% L%` dentro de `:root`. **Borra** el bloque `:root { … }` / `.dark { … }` que genera shadcn en `globals.css` para que no las pise. No hay modo oscuro definido en v0.1 (`darkMode: ["class"]` existe, pero no hay valores `.dark`).

### 6.3 `app/globals.css`

```css
@import "./tokens.css"; /* SIEMPRE primero: trae fuentes, paleta y variables shadcn */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * { @apply border-border; }
  html { -webkit-tap-highlight-color: transparent; }
  body { @apply bg-background text-foreground font-sans text-base; }
  :focus-visible { outline: 4px solid #FF3EA5; outline-offset: 3px; } /* foco Rosa Turbo (guía) */
}
```

### 6.4 `tokens.css` (copia exacta)

```css
/* ==========================================================
   EcoQuest — Design tokens v0.1 (Neo-brutalismo · videojuego)
   "The Real World Is Your Playground."
   Regla de oro: los colores brillantes SIEMPRE llevan texto negro.
   ========================================================== */
@import url("https://fonts.googleapis.com/css2?family=Archivo+Black&family=Silkscreen:wght@400;700&family=Space+Grotesk:wght@400;500;700&display=swap");

:root {
  /* --- Paleta base ---------------------------------------- */
  --eq-lima:      #B6FF3B; /* Lima Edén — naturaleza, éxito, CTA principal */
  --eq-amarillo:  #FFE600; /* Amarillo Voltio — XP, atención, "No confirmado" */
  --eq-rosa:      #FF3EA5; /* Rosa Turbo — logros, revisión manual */
  --eq-cian:      #00E5FF; /* Cian Glitch — IA, información, enlaces */
  --eq-naranja:   #FF7A00; /* Naranja Lava — reintentar, seguridad, alertas */
  --eq-selva:     #0A5C2B; /* Selva Profunda — fondo oscuro con texto claro */
  --eq-tinta:     #000000; /* Tinta — bordes, sombras, texto */
  --eq-papel:     #FFFBEF; /* Papel — fondo base */
  --eq-blanco:    #FFFFFF;

  /* --- Roles semánticos ----------------------------------- */
  --eq-bg:            var(--eq-papel);
  --eq-fg:            var(--eq-tinta);
  --eq-primary:       var(--eq-lima);
  --eq-on-primary:    var(--eq-tinta);
  --eq-accent:        var(--eq-rosa);
  --eq-info:          var(--eq-cian);
  --eq-warning:       var(--eq-amarillo);
  --eq-danger:        var(--eq-naranja);

  /* Estados de resultado de IA (color + icono + texto, nunca solo color) */
  --eq-status-match:   var(--eq-lima);     /* Coincidencia (tentativa) */
  --eq-status-unsure:  var(--eq-amarillo); /* No confirmado */
  --eq-status-retry:   var(--eq-naranja);  /* Reintentar */
  --eq-status-manual:  var(--eq-rosa);     /* Revisión manual · No verificada */

  /* --- Tipografía ----------------------------------------- */
  --eq-font-pixel:   "Silkscreen", monospace;  /* peso 700; solo etiquetas cortas / HUD. Press Start 2P descartada: sin mayúsculas acentuadas */
  --eq-font-display: "Archivo Black", "Arial Black", sans-serif; /* titulares */
  --eq-font-body:    "Space Grotesk", system-ui, sans-serif;     /* lectura */

  --eq-text-xs:   14px;  /* solo metadatos; nunca texto esencial en exterior */
  --eq-text-sm:   16px;
  --eq-text-base: 18px;  /* cuerpo mínimo en móvil */
  --eq-text-lg:   22px;
  --eq-text-xl:   28px;
  --eq-text-2xl:  36px;
  --eq-text-3xl:  48px;
  --eq-text-4xl:  64px;
  --eq-pixel-sm:  13px;  /* Silkscreen Bold, MAYÚSCULAS */
  --eq-pixel-md:  16px;
  --eq-pixel-lg:  26px;

  /* --- Bordes, sombras, forma ----------------------------- */
  --eq-border:      3px;
  --eq-border-lg:   4px;
  --eq-radius:      0px;   /* sin redondeo suave */
  --eq-shadow-sm:   3px 3px 0 0 var(--eq-tinta);
  --eq-shadow:      5px 5px 0 0 var(--eq-tinta);
  --eq-shadow-lg:   8px 8px 0 0 var(--eq-tinta);
  --eq-press:       translate(5px, 5px); /* botón "se hunde" en su sombra */
  --eq-tilt:        -2deg;               /* stickers */

  /* --- Espaciado y tacto ---------------------------------- */
  --eq-space-1: 4px;  --eq-space-2: 8px;  --eq-space-3: 12px;
  --eq-space-4: 16px; --eq-space-5: 24px; --eq-space-6: 32px; --eq-space-8: 48px;
  --eq-tap-min: 56px;  /* objetivo táctil recomendado en exterior (WCAG pide ≥ 44px) */
  --eq-dur: 80ms;      /* animaciones secas, sin easing elástico */

  /* --- Puente para shadcn/ui (formato "H S% L%") ---------- */
  --background: 45 100% 97%;
  --foreground: 0 0% 0%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 0%;
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 0%;
  --primary: 82 100% 62%;
  --primary-foreground: 0 0% 0%;
  --secondary: 186 100% 50%;
  --secondary-foreground: 0 0% 0%;
  --muted: 45 100% 92%;
  --muted-foreground: 0 0% 15%;
  --accent: 328 100% 62%;
  --accent-foreground: 0 0% 0%;
  --destructive: 29 100% 50%;
  --destructive-foreground: 0 0% 0%;
  --border: 0 0% 0%;
  --input: 0 0% 0%;
  --ring: 0 0% 0%;
  --radius: 0rem;
}

/* Utilidades base opcionales */
.eq-brutal { border: var(--eq-border) solid var(--eq-tinta); box-shadow: var(--eq-shadow); border-radius: 0; }
.eq-press:active { transform: var(--eq-press); box-shadow: none; }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
```

### 6.5 `tailwind-theme.js` (copia exacta)

```js
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
```

### 6.6 `tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const eq = require("./tailwind-theme");

const config: Config = {
  ...eq,
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
};

export default config;
```

### 6.7 Clases de Tailwind disponibles gracias al tema

- Colores: `lima`, `voltio`, `turbo`, `glitch`, `lava`, `selva`, `tinta`, `papel`, `status-match`, `status-unsure`, `status-retry`, `status-manual`, más los de shadcn (`background`, `foreground`, `primary`, `secondary`, `accent`, `destructive`, `muted`, `card`, `popover`, `border`, `input`, `ring`).
- Fuentes: `font-pixel`, `font-display`, `font-sans`.
- Tamaños: `text-xs…text-4xl`, `text-pixel-sm`, `text-pixel-md`, `text-pixel-lg`.
- Bordes: `border-3`, `border-4`. Sombras: `shadow-brutal-sm`, `shadow-brutal`, `shadow-brutal-lg`, `shadow-none`.
- Movimiento: `translate-x-press`, `translate-y-press`, `rotate-sticker`, `rotate-sticker-r`, `duration-snap`.
- Tacto: `min-h-tap`, `min-w-tap`.

---

## 7. Componentes (TSX + Tailwind listos para usar)

Todos asumen `cn()` de shadcn (`lib/utils.ts`) y `class-variance-authority` (lo instala shadcn).

### 7.1 Button (`components/ui/button.tsx`, reemplaza el de shadcn)

Variantes de la guía: **primario** (Lima), **secundario** (Blanco), **ia** (Cian, cámara/acciones de IA), **logro** (Rosa), **ghost / terciario** (transparente, borde punteado, sin sombra, sin hundimiento) y **deshabilitado** (`#E8E4D6`, texto `#555`, borde punteado, sin sombra). Altura mínima 56 px, ancho completo en móvil, **un solo primario por pantalla**, foco visible Rosa Turbo de 4 px.

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2.5 rounded-none border-4 border-tinta text-tinta",
    "font-display text-lg text-center select-none cursor-pointer",
    "shadow-brutal transition-[transform,box-shadow] duration-snap",
    "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#000]",
    "active:translate-x-press active:translate-y-press active:shadow-none",
    "data-[pressed=true]:translate-x-press data-[pressed=true]:translate-y-press data-[pressed=true]:shadow-none",
    "focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-turbo",
    "disabled:cursor-not-allowed disabled:border-dashed disabled:bg-[#E8E4D6] disabled:text-[#555555]",
    "disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-lima",
        secondary: "bg-white",
        ia: "bg-glitch",
        logro: "bg-turbo",
        ghost:
          "bg-transparent border-dashed shadow-none hover:translate-x-0 hover:translate-y-0 hover:shadow-none active:translate-x-0 active:translate-y-0",
      },
      size: {
        default: "min-h-tap px-6 py-3",          // 56 px
        sm: "min-h-12 px-4 py-2 text-sm",         // 48 px, 16 px
      },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "default", block: false },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Fuerza el estado "presionado" (p. ej. para demos o toggles). */
  pressed?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, asChild = false, pressed, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        data-pressed={pressed ? "true" : undefined}
        className={cn(buttonVariants({ variant, size, block }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export { buttonVariants };
```

Uso:

```tsx
<Button block>¡Comenzar expedición!</Button>                       {/* primario */}
<Button variant="secondary" block>Tomar otra foto</Button>          {/* secundario */}
<Button variant="ia" block><PixelIcon name="camera" scale={3} flat />Capturar hallazgo</Button>
<Button variant="ghost" size="sm" block>Marcar manualmente · no verificada</Button>
<Button disabled block>Analizando…</Button>
```

### 7.2 Card y MissionCard

**Card base** (guía `.card`): `bg-white border-4 border-tinta shadow-brutal p-[22px]` (puedes usar `p-6` = 24 px). Marco grande (guía `.box`): `shadow-brutal-lg`.

```tsx
// components/eq/card.tsx
import { cn } from "@/lib/utils";
export function EqCard({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-none border-4 border-tinta bg-white p-6 text-tinta shadow-brutal", className)} {...p} />;
}
```

**MissionCard** (guía `.mission`): rejilla `64px 1fr`, gap 14 px, padding 14 px; mosaico de icono 64×64 con borde 3 px y fondo de color (Hoja = Lima, Flor = Rosa, Árbol = Amarillo); etiqueta pixel «MISIÓN n/3»; título Archivo Black; descripción; pie separado por borde superior de 3 px con estado + acción. **Completada:** fondo `#F2FFE0`. Desde cada misión se llega a la cámara en **un toque** (PRD HU-2).

```tsx
// components/eq/mission-card.tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PixelIcon, type PixelIconName } from "./pixel-icon";
import { StatusBadge, type MissionResult } from "./status-badge";

const tile: Record<"leaf" | "flower" | "tree", string> = {
  leaf: "bg-lima",
  flower: "bg-turbo",
  tree: "bg-voltio",
};

export interface MissionCardProps {
  index: number;          // 1..3
  total: number;          // 3
  icon: "leaf" | "flower" | "tree";
  title: string;
  description?: string;
  result?: MissionResult;  // undefined = pendiente
  onCapture?: () => void;
  compact?: boolean;       // versión lista (pantalla Misiones)
}

export function MissionCard({ index, total, icon, title, description, result, onCapture, compact }: MissionCardProps) {
  const done = result === "match" || result === "manual";
  if (compact) {
    return (
      <article
        className={cn(
          "grid grid-cols-[56px_1fr] items-center gap-3 border-3 border-tinta p-3 shadow-brutal-sm",
          done ? "bg-[#F2FFE0]" : "bg-white"
        )}
      >
        <div className={cn("flex h-14 w-14 items-center justify-center border-2 border-tinta", tile[icon])}>
          <PixelIcon name={icon as PixelIconName} scale={4} flat />
        </div>
        <div>
          <h3 className="font-sans text-base font-bold leading-tight">{title}</h3>
          <div className="mt-1">
            {result ? <StatusBadge result={result} size="chip" /> : <PendingChip />}
          </div>
        </div>
      </article>
    );
  }
  return (
    <article
      className={cn(
        "grid grid-cols-[64px_1fr] gap-3.5 border-4 border-tinta p-3.5 shadow-brutal",
        done ? "bg-[#F2FFE0]" : "bg-white"
      )}
    >
      <div className={cn("flex h-16 w-16 items-center justify-center border-3 border-tinta", tile[icon])}>
        <PixelIcon name={icon as PixelIconName} scale={5} flat />
      </div>
      <div>
        <span className="font-pixel text-pixel-sm font-bold uppercase tracking-[0.5px]">
          Misión {index}/{total}
        </span>
        <h3 className="mb-1.5 mt-1 font-display text-lg leading-[1.1]">{title}</h3>
        {description && <p className="text-base">{description}</p>}
      </div>
      <div className="col-span-full flex items-center justify-between gap-2.5 border-t-3 border-tinta pt-3">
        {done ? (
          <>
            <StatusBadge result={result!} />
            <span className="font-pixel text-pixel-sm font-bold uppercase">Hecha</span>
          </>
        ) : (
          <>
            <span className="font-pixel text-pixel-sm font-bold uppercase">Pendiente</span>
            <Button variant="ia" size="sm" onClick={onCapture}>Capturar</Button>
          </>
        )}
      </div>
    </article>
  );
}

function PendingChip() {
  return (
    <span className="inline-block border-2 border-tinta bg-white px-1.5 py-px text-xs font-bold uppercase">
      Pendiente
    </span>
  );
}
```

Copy de las misiones (guía + PRD RF-04):

| # | Icono / color | Título (tarjeta completa) | Título corto (lista) | Descripción |
|---|---|---|---|---|
| 1 | Hoja · Lima | Encuentra una hoja de gran tamaño | Hoja de gran tamaño | Busca una hoja grande en el sendero. Fotografíala sin arrancarla. |
| 2 | Flor · Rosa | Descubre una flor y registra sus colores | Flor y sus colores | Encuentra una flor visible. Mírala bien antes de sacar la cámara. |
| 3 | Árbol · Amarillo | Encuentra un árbol con raíces visibles | Árbol con raíces visibles | Observa los troncos y raíces desde el sendero, sin trepar. |

### 7.3 StatusBadge — 4 estados de resultado de IA

Guía `.status`: `inline-flex`, gap 8 px, borde 3 px, `shadow-brutal-sm`, padding `6px 12px 6px 6px`, Space Grotesk 700, 16 px; cuadro de icono 28×28 con borde 2 px y fondo blanco. **Siempre icono + texto.** Versión `chip` (listas y resumen): borde 2 px, texto en mayúsculas, sin cuadro de icono (el icono va en línea: «✓ Coincidencia»).

```tsx
// components/eq/status-badge.tsx
import { cn } from "@/lib/utils";

export type MissionResult = "match" | "unsure" | "retry" | "manual";

export const STATUS: Record<MissionResult, { bg: string; icon: string; label: string; sub?: string; chip: string }> = {
  match:  { bg: "bg-status-match",  icon: "✓", label: "Coincidencia",    chip: "Coincidencia" },
  unsure: { bg: "bg-status-unsure", icon: "?", label: "No confirmado",   chip: "No confirmado" },
  retry:  { bg: "bg-status-retry",  icon: "↻", label: "Reintentar",      chip: "Reintentar" },
  manual: { bg: "bg-status-manual", icon: "✋", label: "Revisión manual", sub: "No verificada", chip: "No verificada" },
};

export function StatusBadge({
  result,
  size = "default",
  className,
}: { result: MissionResult; size?: "default" | "chip"; className?: string }) {
  const s = STATUS[result];
  if (size === "chip") {
    return (
      <span className={cn("inline-block whitespace-nowrap border-2 border-tinta px-1.5 py-0.5 text-xs font-bold uppercase text-tinta", s.bg, className)}>
        <span aria-hidden="true">{s.icon} </span>
        {s.chip}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border-3 border-tinta py-1.5 pl-1.5 pr-3 text-sm font-bold leading-[1.1] text-tinta shadow-brutal-sm",
        s.bg,
        className
      )}
    >
      <span aria-hidden="true" className="flex h-7 w-7 flex-none items-center justify-center border-2 border-tinta bg-white text-[17px] leading-none">
        {s.icon}
      </span>
      <span>
        {s.label}
        {s.sub && <small className="block text-xs font-bold uppercase tracking-[0.5px]">{s.sub}</small>}
      </span>
    </span>
  );
}
```

Semántica y copy de cada estado (guía + PRD RF-07):

| Estado | Cuándo | Copy | Acciones |
|---|---|---|---|
| **Coincidencia** (Lima, ✓) | Similitud de la categoría objetivo ≥ umbral | «Parece una hoja. ¡Misión completada!» — siempre **tentativo**, nunca «verificado» | Volver a misiones / siguiente |
| **No confirmado** (Voltio, ?) | Similitud < umbral; la IA no está segura | «La IA no está segura de que haya una flor visible.» / «No estamos seguros. ¿Otra foto?» | «Tomar otra foto» (primario) · «Marcar manualmente · no verificada» (ghost) |
| **Reintentar** (Lava, ↻) | Error de red, del servicio o foto inválida | «No pudimos analizar la foto. Inténtalo de nuevo.» | «Tomar otra foto» / reenviar |
| **Revisión manual · No verificada** (Turbo, ✋) | La persona marcó la misión | La etiqueta **«No verificada» es obligatoria** en progreso, resumen e insignia | — |

> El icono de la guía para revisión manual es ✋ (emoji). Si prefieres no depender de emojis del sistema, sustitúyelo por un `PixelIcon` equivalente, pero **conserva** icono + texto.

### 7.4 XpBar / ProgressBar

**Segmentada** (guía `.xp`): un bloque por misión. Contenedor `border-4 bg-white shadow-brutal-sm flex h-10 p-1 gap-1`. Segmento: **Lima** = coincidencia; **Rosa** = revisión manual (no verificada); **blanco con borde punteado** = pendiente. Encabezado HUD en pixel: «MISIONES» … «2/3».

```tsx
// components/eq/xp-bar.tsx
import { cn } from "@/lib/utils";
import type { MissionResult } from "./status-badge";

type Seg = MissionResult | "pending";

export function XpBar({ segments, label = "Misiones", className }: { segments: Seg[]; label?: string; className?: string }) {
  const done = segments.filter((s) => s === "match" || s === "manual").length;
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between font-pixel text-pixel-sm font-bold uppercase tracking-[0.5px]">
        <span>{label}</span>
        <span>{done}/{segments.length}</span>
      </div>
      <div
        role="progressbar"
        aria-label="Misiones completadas"
        aria-valuemin={0}
        aria-valuemax={segments.length}
        aria-valuenow={done}
        aria-valuetext={`${done} de ${segments.length} misiones`}
        className="flex h-10 gap-1 border-4 border-tinta bg-white p-1 shadow-brutal-sm"
      >
        {segments.map((s, i) => (
          <i
            key={i}
            className={cn(
              "flex-1 border-2 border-tinta",
              s === "match" && "bg-lima",
              s === "manual" && "bg-turbo",
              (s === "pending" || s === "unsure" || s === "retry") && "border-dashed bg-white"
            )}
          />
        ))}
      </div>
    </div>
  );
}
```

**Continua** (guía `.xp-cont`, avance general): altura 30 px, borde 4 px, fondo blanco, `shadow-brutal-sm`; relleno Amarillo Voltio con `border-right: 4px` y rayado duro de Tinta; etiqueta «EXP» en pixel a la derecha.

```tsx
export function XpContinuous({ value }: { value: number /* 0–100 */ }) {
  return (
    <div className="relative h-[30px] border-4 border-tinta bg-white shadow-brutal-sm"
         role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-label="Avance">
      <div
        className="absolute inset-y-0 left-0 border-r-4 border-tinta bg-voltio"
        style={{
          width: `${value}%`,
          // Patrón duro (cortes secos), NO degradado visual — única excepción permitida
          backgroundImage: "repeating-linear-gradient(90deg,transparent 0 18px,#000 18px 21px)",
        }}
      />
      <span className="absolute right-2 top-1/2 -translate-y-1/2 font-pixel text-pixel-sm font-bold uppercase">EXP</span>
    </div>
  );
}
```

> PRD: el tiempo se muestra como **«Tiempo en sesión»**, nunca como «tiempo fuera de pantalla».

### 7.5 Insignia (badge de logro)

Guía `.badge`: rombo de **doble marco** (cuadro exterior Amarillo Voltio rotado 45° con borde 4 px y `shadow-brutal-lg`; cuadro interior Lima rotado 45°, inset 34 px, borde 4 px), contenido centrado (icono pixel + nombre en pixel) y **listón** Rosa inclinado −3° abajo («¡COMPLETADA!» o «INSIGNIA»). Tamaños: 200 px (`default`, inset 34 px) y 140 px (`sm`, inset 24 px). **Bloqueada:** exterior `#E8E4D6`, interior blanco con borde punteado, contenido «?» + «PRÓXIMA».

```tsx
// components/eq/insignia.tsx
import { cn } from "@/lib/utils";
import { PixelIcon } from "./pixel-icon";

export function Insignia({
  name = "Descubre el Edén",
  ribbon = "¡COMPLETADA!",
  size = "default",
  locked = false,
  hasManual = false,
}: { name?: string; ribbon?: string; size?: "default" | "sm"; locked?: boolean; hasManual?: boolean }) {
  const dim = size === "sm" ? "h-[140px] w-[140px] m-[34px]" : "h-[200px] w-[200px] m-[46px]";
  const inset = size === "sm" ? "inset-6" : "inset-[34px]";
  return (
    <figure className="flex flex-col items-center">
      <div className={cn("relative", dim)} role="img"
           aria-label={locked ? "Insignia bloqueada" : `Insignia ${name}${hasManual ? ", con misiones no verificadas" : ""}`}>
        <div className={cn("absolute inset-0 rotate-45 border-4 border-tinta shadow-brutal-lg", locked ? "bg-[#E8E4D6]" : "bg-voltio")} />
        <div className={cn("absolute rotate-45 border-4 border-tinta", inset, locked ? "border-dashed bg-white" : "bg-lima")} />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-center">
          {locked ? (
            <>
              <span className="font-pixel text-pixel-md font-bold">?</span>
              <span className="font-pixel text-pixel-sm font-bold uppercase">Próxima</span>
            </>
          ) : (
            <>
              <PixelIcon name="tree" scale={size === "sm" ? 4 : 5} />
              <span className="font-pixel text-pixel-sm font-bold uppercase leading-[1.5]">{name}</span>
            </>
          )}
        </div>
        {!locked && (
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 -rotate-3 whitespace-nowrap border-3 border-tinta bg-turbo px-2.5 py-1.5 font-pixel text-pixel-sm font-bold uppercase shadow-brutal-sm">
            {ribbon}
          </div>
        )}
      </div>
      {hasManual && !locked && (
        <figcaption className="mt-2 text-sm font-bold">Incluye misiones marcadas a mano · No verificadas</figcaption>
      )}
    </figure>
  );
}
```

> La guía pide: «Si hubo misiones manuales, el resumen lo indica junto a la insignia» (PRD RF-10). El texto exacto del `figcaption` no está fijado en la guía; ajústalo si Aarón lo define.

### 7.6 Toast

Guía `.toast`: `flex gap-3 items-start border-4 shadow-brutal px-3.5 py-3 max-w-[420px]`; cuadro de icono 36×36 con borde 3 px y fondo blanco; título en Archivo Black 18 px; texto 15–16 px. Variantes de fondo: **ok** Lima, **xp** Voltio, **info** Cian, **warn** Naranja. `role="status"` para ok/xp/info, `role="alert"` para warn. Úsalo con `sonner` (`toast.custom(() => <EqToast … />)`) o con el Toast de shadcn reestilizado.

```tsx
// components/eq/toast.tsx
import { cn } from "@/lib/utils";
import { PixelIcon, type PixelIconName } from "./pixel-icon";

const V = {
  ok:   { bg: "bg-lima",   icon: "check" as PixelIconName, role: "status" },
  xp:   { bg: "bg-voltio", icon: "star"  as PixelIconName, role: "status" },
  info: { bg: "bg-glitch", icon: "eye"   as PixelIconName, role: "status" },
  warn: { bg: "bg-lava",   icon: "warn"  as PixelIconName, role: "alert"  },
};

export function EqToast({ variant, title, children }: { variant: keyof typeof V; title: string; children?: React.ReactNode }) {
  const v = V[variant];
  return (
    <div role={v.role} className={cn("flex max-w-[420px] items-start gap-3 border-4 border-tinta px-3.5 py-3 text-tinta shadow-brutal", v.bg)}>
      <span className="flex h-9 w-9 flex-none items-center justify-center border-3 border-tinta bg-white">
        <PixelIcon name={v.icon} scale={4} flat />
      </span>
      <div>
        <b className="block font-display text-[18px] font-normal">{title}</b>
        {children && <span className="text-sm leading-[1.35]">{children}</span>}
      </div>
    </div>
  );
}
```

Copy de la guía:

| Variante | Título | Texto |
|---|---|---|
| ok (Lima) | ¡Misión completada! | Parece una hoja. Llevas 1 de 3. |
| xp (Voltio) | +1 hallazgo | Guarda el teléfono y sigue explorando. |
| info (Cian) | Analizando con IA abierta… | SigLIP2 compara tu foto con la misión. |
| warn (Naranja) | Sin conexión | No pudimos analizar la foto. Inténtalo de nuevo. |

Los toasts **no** deben reproducir sonido, vibrar en bucle ni quedarse fijos; son confirmaciones breves (screen-last).

### 7.7 SafetyNotice (aviso de seguridad)

Guía `.safety`: borde 3 px, fondo **Naranja Lava**, texto Tinta en Space Grotesk 500; título corto en pixel («⚠ ANTES DE SALIR»). Aparece **antes de empezar** (PRD RF-02). El cuerpo **no** va en Silkscreen. En la app, cuerpo ≥ 18 px (en el mockup se ve más pequeño por la escala).

```tsx
// components/eq/safety-notice.tsx
import { PixelIcon } from "./pixel-icon";

export function SafetyNotice() {
  return (
    <aside aria-labelledby="aviso-seguridad" className="border-3 border-tinta bg-lava px-3 py-2.5 text-base font-medium leading-[1.3] text-tinta">
      <h2 id="aviso-seguridad" className="mb-1.5 flex items-center gap-2 font-pixel text-pixel-sm font-bold uppercase">
        <PixelIcon name="warn" scale={2} flat /> Antes de salir
      </h2>
      <p>No toques fauna ni arranques plantas. Quédate en senderos y lejos del borde del agua.</p>
    </aside>
  );
}
```

### 7.8 Sticker (etiqueta inclinada)

Guía `.sticker`: `inline-block`, borde 3 px, `shadow-brutal-sm`, padding `6px 12px`, Silkscreen en MAYÚSCULAS, `rotate(-2deg)`; variante `.r` a `+2deg`. **Solo decorativo** (nunca botones ni texto de lectura). Fondos de la guía: blanco, Voltio, Glitch, Turbo, Lima.

```tsx
// components/eq/sticker.tsx
import { cn } from "@/lib/utils";

export function Sticker({ children, color = "bg-voltio", right = false, className }:
  { children: React.ReactNode; color?: "bg-white" | "bg-lima" | "bg-voltio" | "bg-turbo" | "bg-glitch"; right?: boolean; className?: string }) {
  return (
    <span className={cn(
      "inline-block whitespace-nowrap border-3 border-tinta px-3 py-1.5 font-pixel text-pixel-sm font-bold uppercase leading-[1.5] text-tinta shadow-brutal-sm",
      right ? "rotate-sticker-r" : "rotate-sticker",
      color, className)}>
      {children}
    </span>
  );
}
// <Sticker color="bg-turbo">¡Nuevo logro!</Sticker>  <Sticker color="bg-lima" right>+1 hallazgo</Sticker>
// <Sticker color="bg-voltio">Screen-last</Sticker>  <Sticker color="bg-glitch" right>IA abierta · SigLIP2</Sticker>  <Sticker color="bg-turbo">Sin cuenta</Sticker>
```

### 7.9 PixelIcon (iconos pixel 8×8 / 10×10 de la guía)

Cuadrícula de 8×8 o 10×10 escalada en **múltiplos enteros**, `shape-rendering="crispEdges"`. Por defecto llevan una sombra dura `drop-shadow(3px 3px 0 #000)` (sin blur); la variante `flat` la quita (dentro de botones, mosaicos y toasts). **Siempre acompañados de texto** y con `aria-hidden`. Las matrices son exactamente las de `index.html`.

```tsx
// components/eq/pixel-icon.tsx
const C: Record<string, string> = {
  k: "#000000", g: "#B6FF3B", d: "#0A5C2B", p: "#FF3EA5", y: "#FFE600",
  c: "#00E5FF", o: "#FF7A00", w: "#FFFFFF", b: "#7A4A1E",
};

const I = {
  leaf:   ["....kkkk", "..kkgggk", ".kggggdk", ".kgggdgk", "kgggdggk", "kggdggk.", "kgdkkk..", "kd......"],
  flower: ["..kkkk..", ".kppppk.", "kppyyppk", "kpyyyypk", "kppyyppk", ".kppppk.", "..kkdk..", "...kdk.."],
  tree:   ["...kkkk...", "..kggggk..", ".kggdgggk.", "kgggggdggk", "kgdggggggk", ".kkgggkkk.", "...kbbk...", "...kbbk...", "..bbbbbb..", "bbb.bb.bbb"],
  heart:  [".kk..kk.", "kppkkppk", "kppppppk", "kppppppk", ".kppppk.", "..kppk..", "...kk...", "........"],
  star:   ["...kk...", "..kyyk..", "kkkyykkk", "kyyyyyyk", ".kyyyyk.", ".kyyyyk.", "kyykkyyk", "kk....kk"],
  camera: ["..kkk...", "kkkkkkkk", "kwwkkwck", "kwkcckwk", "kwkcckwk", "kwwkkwwk", "kkkkkkkk", "........"],
  eye:    ["........", "..kkkk..", ".kwwwwk.", "kwwcckwk", "kwckkcwk", ".kwccwk.", "..kkkk..", "........"],
  warn:   ["...kk...", "..kook..", "..kook..", ".kokkok.", ".kokkok.", "kooooooo", "kookkook", "kkkkkkkk"],
  check:  ["........", "......kk", ".....kgk", "k...kgk.", "kk.kgk..", "kgkgk...", ".kgk....", "..k....."],
} as const;

export type PixelIconName = keyof typeof I;

export function PixelIcon({ name, scale = 4, flat = false, className }:
  { name: PixelIconName; scale?: number; flat?: boolean; className?: string }) {
  const g = I[name];
  const w = g[0].length, h = g.length;
  return (
    <svg
      width={w * scale} height={h * scale} viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges" aria-hidden="true" focusable="false"
      className={className}
      style={{ display: "block", imageRendering: "pixelated", filter: flat ? "none" : "drop-shadow(3px 3px 0 #000)" }}
    >
      {g.flatMap((row, y) =>
        [...row].map((ch, x) => (C[ch] ? <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={C[ch]} /> : null))
      )}
    </svg>
  );
}
```

Iconos y su significado: Hoja · Flor · Árbol / raíces · Corazón (favorito) · Estrella (logro) · Cámara · Ojo (la IA analiza) · Aviso (seguridad) · Check.

### 7.10 HUD y PhotoFrame (piezas de pantalla)

```tsx
// HUD superior: título de expedición o misión + contador, en pixel
export function Hud({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 font-pixel text-pixel-sm font-bold uppercase tracking-[0.5px]">
      <span className="whitespace-nowrap">{left}</span>
      <span className="whitespace-nowrap">{right}</span>
    </div>
  );
}

// Chip "IA" (Cian) del HUD de resultado
export const IaChip = () => (
  <span className="border-2 border-tinta bg-glitch px-1.5 py-0.5 font-pixel text-pixel-sm font-bold uppercase">IA</span>
);

// Marco de foto con esquinas de visor blancas (borde 3 px; esquinas 22 px con trazo 4 px)
export function PhotoFrame({ src, alt }: { src?: string; alt: string }) {
  const c = "absolute h-[22px] w-[22px] border-white";
  return (
    <div className="relative h-[220px] flex-none overflow-hidden border-3 border-tinta bg-[#3A7D2C]">
      {src && <img src={src} alt={alt} className="h-full w-full object-cover" />}
      <span className={`${c} left-2 top-2 border-l-4 border-t-4`} />
      <span className={`${c} right-2 top-2 border-r-4 border-t-4`} />
      <span className={`${c} bottom-2 left-2 border-b-4 border-l-4`} />
      <span className={`${c} bottom-2 right-2 border-b-4 border-r-4`} />
    </div>
  );
}
```

> La altura del marco en el mockup es 150 px dentro de un teléfono de 280 px; `220px` es una adaptación proporcional sugerida para un móvil real. Ajusta si hace falta, sin poner texto encima de la foto.

---

## 8. Pantallas clave (ver `mockups-moviles.png`)

Reglas comunes a las 4 pantallas:

- Contenedor móvil: `min-h-dvh flex flex-col`, padding `p-4` (16 px) y `gap-3`, ancho máximo sugerido `max-w-md mx-auto`.
- **Una sola acción principal**, a ancho completo, anclada abajo (un `div` con `flex-1` antes de los botones, como en el mockup). Respeta el área segura: `pb-[max(1rem,env(safe-area-inset-bottom))]`.
- Fondo por pantalla: Bienvenida **Lima**, Misiones **Papel**, Resultado **Papel**, Resumen **Amarillo Voltio**.
- Datos de los mockups = **datos de ejemplo**.

### 8.1 Pantalla 1 · Bienvenida (fondo Lima)

De arriba abajo:

1. **Logo** «ECO / QUEST» en dos líneas, `font-pixel font-bold`, con sombra de texto dura doble (guía: `text-shadow: 5px 5px 0 #fff, 9px 9px 0 #000` en el hero; el mockup usa `3px 3px 0 #fff`). Ej.: `text-pixel-lg leading-[1.15] [text-shadow:3px_3px_0_#fff]`.
2. **Lema** «The Real World Is Your Playground.» en Archivo Black, **texto Amarillo Voltio sobre Tinta**, `self-start`, `-rotate-[1.5deg]`, padding `px-2 py-1.5` (en el hero de la guía lleva además sombra `6px 6px 0 #FF3EA5`).
3. **Tarjeta de expedición** blanca, borde 3 px, sombra dura 4 px (usa `shadow-brutal-sm` o `shadow-brutal`): etiqueta pixel «EXPEDICIÓN», título Archivo Black «Descubre el Edén» (`text-xl`/`text-2xl`), y en Space Grotesk 700: «Parque Tomás Garrido Canabal» / «~20 min · 3 misiones».
4. **SafetyNotice** (§7.7): «⚠ ANTES DE SALIR» — «No toques fauna ni arranques plantas. Quédate en senderos y lejos del borde del agua.»
5. Espaciador `flex-1`.
6. **Botón primario** a ancho completo: «¡Comenzar!» (en la guía de componentes: «¡Comenzar expedición!»; cualquiera de los dos).
7. Nota centrada (`text-sm font-medium`): «Sin cuenta · Sin ubicación precisa».

```tsx
<main className="mx-auto flex min-h-dvh max-w-md flex-col gap-3 bg-lima p-4">
  <h1 className="mt-1.5 font-pixel text-pixel-lg font-bold leading-[1.15] [text-shadow:3px_3px_0_#fff]">ECO<br />QUEST</h1>
  <p className="self-start -rotate-[1.5deg] bg-tinta px-2 py-1.5 font-display text-base text-voltio">The Real World Is Your Playground.</p>
  <section className="border-3 border-tinta bg-white p-3 shadow-brutal">
    <span className="font-pixel text-pixel-sm font-bold uppercase">Expedición</span>
    <h2 className="my-1 font-display text-2xl leading-[1.05]">Descubre el Edén</h2>
    <p className="text-base font-bold leading-[1.3]">Parque Tomás Garrido Canabal<br />~20 min · 3 misiones</p>
  </section>
  <SafetyNotice />
  <div className="flex-1" />
  <Button block>¡Comenzar!</Button>
  <p className="text-center text-sm font-medium">Sin cuenta · Sin ubicación precisa</p>
</main>
```

### 8.2 Pantalla 2 · Misiones (fondo Papel)

1. **HUD:** «DESCUBRE EL EDÉN» … «1/3» (pixel).
2. **XpBar segmentada** (3 segmentos; en el ejemplo: 1 Lima + 2 pendientes punteados). En el mockup el HUD sustituye al encabezado «MISIONES» de la barra; puedes ocultar ese encabezado.
3. **Tres MissionCard compactas** (§7.2): «Hoja de gran tamaño» ✓ Coincidencia (fondo `#F2FFE0`, mosaico Lima) · «Flor y sus colores» Pendiente (mosaico Rosa) · «Árbol con raíces visibles» Pendiente (mosaico Amarillo). Cada tarjeta debe llevar a la cámara en un toque (toda la tarjeta pulsable o botón «Capturar»).
4. **Panel informativo Cian** (borde 3 px, Space Grotesk 700): «📵 Guarda el teléfono. Sácalo solo cuando encuentres algo.»
5. Espaciador `flex-1`.
6. **Botón IA (Cian)** a ancho completo con icono de cámara: «Capturar hallazgo». Abre `<input type="file" accept="image/*" capture="environment">` (PRD RF-05).

```tsx
<main className="mx-auto flex min-h-dvh max-w-md flex-col gap-3 bg-papel p-4">
  <Hud left="Descubre el Edén" right="1/3" />
  <XpBar segments={["match", "pending", "pending"]} />
  <MissionCard compact index={1} total={3} icon="leaf" title="Hoja de gran tamaño" result="match" />
  <MissionCard compact index={2} total={3} icon="flower" title="Flor y sus colores" />
  <MissionCard compact index={3} total={3} icon="tree" title="Árbol con raíces visibles" />
  <p className="border-3 border-tinta bg-glitch px-3 py-2.5 text-base font-bold leading-[1.3]">
    <span aria-hidden="true">📵 </span>Guarda el teléfono. Sácalo solo cuando encuentres algo.
  </p>
  <div className="flex-1" />
  <Button variant="ia" block><PixelIcon name="camera" scale={3} flat />Capturar hallazgo</Button>
</main>
```

### 8.3 Pantalla 3 · Resultado de IA (fondo Papel; ejemplo: «No confirmado»)

1. **HUD:** «MISIÓN 2/3» … chip «IA» Cian.
2. **PhotoFrame** con la foto del hallazgo y esquinas de visor blancas (sin texto encima).
3. **StatusBadge** del estado (ejemplo: `unsure` → «? No confirmado»), `self-start`. Contenedor con `aria-live="polite"` para anunciar el resultado.
4. **Explicación** en Space Grotesk 700, `text-lg`: «La IA no está segura de que haya una flor visible.»
5. **Panel de similitud** (blanco, borde 3 px): «Parecido con «flor visible»»; barra (alto 16 px, borde 2 px) con relleno Amarillo Voltio (ejemplo 28 %) y **línea de umbral punteada** vertical de 3 px (ejemplo al 60 %); nota «— — umbral de la misión». **Sin números ni porcentajes** visibles (la similitud no es probabilidad; PRD RNF-07).
6. Espaciador `flex-1`.
7. **Primario:** «Tomar otra foto». **Ghost (≥ 48 px):** «Marcar manualmente · no verificada».

```tsx
<main className="mx-auto flex min-h-dvh max-w-md flex-col gap-3 bg-papel p-4">
  <Hud left="Misión 2/3" right={<IaChip />} />
  <PhotoFrame src={photoUrl} alt="Tu foto del hallazgo" />
  <div aria-live="polite" className="flex flex-col gap-3">
    <StatusBadge result="unsure" className="self-start" />
    <p className="text-lg font-bold leading-[1.3]">La IA no está segura de que haya una flor visible.</p>
  </div>
  <div className="border-3 border-tinta bg-white px-3 py-2.5 text-base">
    Parecido con «flor visible»
    <div className="relative mt-1.5 h-4 border-2 border-tinta bg-white" aria-hidden="true">
      <i className="absolute inset-y-0 left-0 border-r-2 border-tinta bg-voltio" style={{ width: "28%" }} />
      <span className="absolute -bottom-[5px] -top-[5px] border-l-[3px] border-dashed border-tinta" style={{ left: "60%" }} />
    </div>
    <p className="mt-1 text-sm font-medium">— — umbral de la misión</p>
  </div>
  <div className="flex-1" />
  <Button block>Tomar otra foto</Button>
  <Button variant="ghost" size="sm" block>Marcar manualmente · no verificada</Button>
</main>
```

Variantes por estado (misma estructura, cambia badge, color del relleno, copy y botones):

| Estado | Badge | Copy | Botones |
|---|---|---|---|
| match | ✓ Coincidencia (Lima; relleno Lima por encima del umbral) | «Parece una flor. ¡Misión completada!» + toast ok | Primario para volver a misiones (texto no fijado en la guía; p. ej. «Seguir explorando» — `TODO(diseño)`) |
| unsure | ? No confirmado (Voltio) | «La IA no está segura de que haya una flor visible.» | «Tomar otra foto» · ghost «Marcar manualmente · no verificada» |
| retry | ↻ Reintentar (Lava) | «No pudimos analizar la foto. Inténtalo de nuevo.» (sin panel de similitud) | «Tomar otra foto» (o reenviar) |
| manual | ✋ Revisión manual · No verificada (Turbo) | Confirmación de que quedó marcada a mano, **no verificada** | Volver a misiones |

Durante el análisis: botón deshabilitado «Analizando…» y toast info «Analizando con IA abierta…».

### 8.4 Pantalla 4 · Resumen + Insignia (fondo Amarillo Voltio)

1. **Título** centrado en Archivo Black: «¡Expedición completada!» (`text-2xl`).
2. **Insignia** `size="sm"` centrada, listón «INSIGNIA», nombre «DESCUBRE EL EDÉN». Si hubo misiones manuales, indícalo junto a la insignia (`hasManual`).
3. **Lista de resumen** en caja blanca (borde 3 px, sombra dura): filas separadas por borde inferior de 2 px; nombre a la izquierda (Space Grotesk 700) y chip de estado a la derecha:
   - «Hoja grande» → ✓ COINCIDENCIA (Lima)
   - «Flor» → ✋ NO VERIFICADA (Rosa)
   - «Árbol con raíces» → ✓ COINCIDENCIA (Lima)
   - (PRD RF-09: puedes añadir una miniatura cuadrada con borde 2 px a la izquierda de cada fila.)
4. **«Tiempo en sesión: 33 min»** centrado, Space Grotesk 700 (nunca «tiempo fuera de pantalla»).
5. Espaciador `flex-1`.
6. **Primario:** «Terminar». **Secundario (blanco, ≥ 48 px):** «Borrar mis fotos» (PRD RF-12).

```tsx
<main className="mx-auto flex min-h-dvh max-w-md flex-col gap-3 bg-voltio p-4">
  <h1 className="text-center font-display text-2xl leading-[1.05]">¡Expedición completada!</h1>
  <div className="flex justify-center"><Insignia size="sm" ribbon="INSIGNIA" hasManual /></div>
  <ul className="border-3 border-tinta bg-white px-3 py-1 shadow-brutal">
    {[
      { name: "Hoja grande", result: "match" },
      { name: "Flor", result: "manual" },
      { name: "Árbol con raíces", result: "match" },
    ].map((r) => (
      <li key={r.name} className="flex items-center justify-between gap-1.5 border-b-2 border-tinta py-2 text-base font-bold last:border-b-0">
        <span>{r.name}</span>
        <StatusBadge size="chip" result={r.result as MissionResult} />
      </li>
    ))}
  </ul>
  <p className="text-center text-base font-bold">Tiempo en sesión: 33 min</p>
  <div className="flex-1" />
  <Button block>Terminar</Button>
  <Button variant="secondary" size="sm" block>Borrar mis fotos</Button>
</main>
```

---

## 9. Checklist de accesibilidad

- [ ] `<html lang="es-MX">`.
- [ ] Todos los pares texto/fondo están en la tabla de §3.2 con resultado AA o AAA para su tamaño; **nunca** texto blanco sobre Lima/Voltio/Glitch/Lava/Turbo.
- [ ] Sin texto gris claro; texto secundario como mínimo `text-muted-foreground` (L 15 %).
- [ ] Sin texto encima de fotos.
- [ ] Cuerpo de texto ≥ 18 px (`text-base`); `text-xs` (14 px) solo en metadatos.
- [ ] Objetivos táctiles: acciones principales ≥ 56 px (`min-h-tap`), todo lo pulsable ≥ 48 px, con separación suficiente entre ellos.
- [ ] Cada estado (resultado de IA, misión, segmento de progreso, toast) tiene **icono + texto**; el color nunca es la única señal. Los segmentos de la XpBar tienen `aria-valuetext`.
- [ ] Iconos decorativos (`PixelIcon`, emojis ✓ ? ↻ ✋ ⚠ 📵) con `aria-hidden="true"`, y su significado está en el texto visible.
- [ ] Foco visible en todo elemento interactivo: contorno Rosa Turbo de 4 px (`focus-visible:outline-turbo`); nunca `outline-none` sin alternativa.
- [ ] Resultado de IA anunciado con `aria-live="polite"`; toasts con `role="status"` (ok/xp/info) o `role="alert"` (warn).
- [ ] `role="progressbar"` con `aria-valuemin/max/now` y `aria-label` en las barras.
- [ ] Insignia con `role="img"` y `aria-label` (incluye si hay misiones no verificadas).
- [ ] `prefers-reduced-motion` respetado (lo hace `tokens.css`); sin animaciones en bucle.
- [ ] Silkscreen nunca en párrafos ni en el cuerpo del aviso de seguridad.
- [ ] Orden de tabulación = orden visual; un solo `<h1>` por pantalla.
- [ ] Componentes interactivos sobre primitivas accesibles de shadcn/Radix (no `div` con `onClick`).
- [ ] Zoom del navegador permitido (no `maximum-scale=1` ni `user-scalable=no`).

---

## 10. Checklist de aceptación final (para Claude)

**Instalación**

- [ ] `tokens.css` y `tailwind-theme.js` copiados **byte por byte** de §6.4 y §6.5 (única excepción opcional: quitar la línea `@import url(...)` de fuentes si usas `next/font`).
- [ ] `tokens.css` importado al inicio de `globals.css`; el bloque de variables de shadcn generado por la CLI eliminado.
- [ ] `tailwind.config.ts` hace spread de `tailwind-theme.js`; `tailwindcss-animate` instalado; el build y `tsc --noEmit` pasan sin errores.
- [ ] Las tres fuentes cargan (Silkscreen 700 con acentos «MISIÓN», «EXPEDICIÓN»; Archivo Black; Space Grotesk 400/500/700).

**Reglas visuales**

- [ ] Cero `rounded-*` visibles (excepto avatares con `rounded-[9999px]`, si los hay).
- [ ] Cero sombras con blur; solo `shadow-brutal-sm/brutal/brutal-lg` (y `7px 7px` en hover de botón).
- [ ] Cero degradados (excepto el rayado duro de `XpContinuous`).
- [ ] Bordes de Tinta de 3 px (pequeños) / 4 px (tarjetas, botones, marcos).
- [ ] Ningún color fuera de §3 (y de los valores auxiliares de §3.3 en sus usos documentados).
- [ ] Texto negro sobre colores brillantes; blanco solo sobre Tinta/Selva.
- [ ] Botones se hunden en su sombra al pulsar (80 ms); ghost y deshabilitado no se hunden.

**Componentes**

- [ ] Button: primary, secondary, ia, logro, ghost, disabled, tamaños default (56 px) y sm (48 px), estado presionado.
- [ ] MissionCard (completa y compacta, estado completado `#F2FFE0`), StatusBadge (4 estados + chip), XpBar (segmentada y continua), Insignia (normal, sm, bloqueada, con misiones manuales), EqToast (4 variantes), SafetyNotice, Sticker (±2°), PixelIcon (9 iconos).

**Pantallas**

- [ ] Las 4 pantallas coinciden con `mockups-moviles.png` en orden, colores de fondo, jerarquía y copy (§8), con medidas de la app real (cuerpo ≥ 18 px).
- [ ] Una sola acción principal por pantalla, a ancho completo y anclada abajo.
- [ ] Aviso de seguridad visible antes de «¡Comenzar!».
- [ ] Resultado de IA: los 4 estados implementados; sin especies, sin porcentajes; «No verificada» visible en progreso, resumen e insignia cuando aplica.
- [ ] Resumen: «Tiempo en sesión», nunca «tiempo fuera de pantalla»; botón «Borrar mis fotos».
- [ ] Probado en un viewport de 360–390 px de ancho sin desbordes horizontales.

**Accesibilidad**

- [ ] Todos los puntos de §9 cumplidos.

---

*Fuentes de este documento: `estilo-visual/index.html` (guía de estilo v0.1), `estilo-visual/tokens.css`, `estilo-visual/tailwind-theme.js`, `mockups-moviles.png`, `guia-estilo-fullpage.png` y `PRD-EcoQuest.md` (v0.1). Datos de los mockups = datos de ejemplo.*

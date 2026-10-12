# EcoQuest — Landing page

> *The Real World Is Your Playground.*

Plain HTML + **Tailwind CSS v3** (CLI). No framework. Minimal vanilla JS (mobile menu only; the FAQ uses native `<details>`).

## Build & run

```bash
npm install          # tailwindcss@3.4.19 + tailwindcss-animate (required by the theme)
npm run build        # regenerates assets/icons/*.svg and compiles src/input.css → dist/output.css (minified)
npm run watch        # rebuild CSS on change while editing index.html
npm run serve        # static server at http://localhost:8080 (or just open index.html in a browser)
```

Optional screenshots (Python + Playwright, Chromium): `npm run screenshots` → `screenshots/`.

## Structure

| Path | What |
|---|---|
| `index.html` | The whole landing, sections 0 Navbar … 13 Footer from `LANDING-EcoQuest.md` (copy verbatim) |
| `src/input.css` | Tailwind entry: imports `tokens.css`, the “EQ Pixel” Silkscreen font fix, and `@layer components` (btn, sticker, eyebrow, xp bars, status badge, insignia, phone mockups, FAQ) |
| `src/tokens.css` | Unmodified copy of `estilo-visual/tokens.css` (CSS vars + Google Fonts import) |
| `tailwind-theme.js` | Unmodified copy of `estilo-visual/tailwind-theme.js` |
| `tailwind.config.js` | Spreads the official theme; only adds `"EQ Pixel"` first in `font-pixel`, `shadow-brutal-hover`, `max-w-wrap`, `xs` breakpoint |
| `src/main.js` | Mobile menu toggle (aria-expanded, Esc to close) |
| `scripts/gen-icons.js` | Generates the guide’s 8×8 PixelIcons as static SVGs (+ medal, lock, phone, arrow, plus, pin in the same grid/palette) |
| `dist/output.css` | Compiled CSS (committed so the page works without building) |

## Design-system notes

- Neo-brutalism: 3–4 px Tinta borders, hard offset shadows (no blur), `radius: 0`, flat fills. The **only** gradient is the hard-stripe continuous XP bar (allowed by the DS). The hero dot grid is an SVG pattern in a solid color (no transparency).
- Fonts: Silkscreen (pixel labels, uppercase only), Archivo Black (headings/buttons, never `font-bold`), Space Grotesk (body).
- **Silkscreen accent fix**: same as the style guide — `@font-face "EQ Pixel"` loads Silkscreen Bold latin + latin-ext subsets (`size-adjust: 128%`) so Ó/É/Á render.
- Silkscreen draws `·` as a dash, so middle dots inside pixel text are replaced by `<span class="sep">` (small solid square) plus an `sr-only` “·”.
- Buttons press into their shadow (`active:translate-x/y-press`, 80 ms); focus ring is 4 px Rosa Turbo; `prefers-reduced-motion` disables transitions/smooth scroll.
- Navbar + hero reproduce the approved mockup (`../mockup-hero/hero-desktop.html`) pixel-for-pixel at 1440 px.

## Pending (do not invent — see “Decisiones abiertas” in LANDING-EcoQuest.md)

All unknown URLs are `href="#"` with a `<!-- TODO … [Por definir] -->` comment: demo URL (D1), repo + issues URL (D2), README/docs URL. Visible `[Por definir]` text appears only where the landing doc puts it (FAQ price/language, licenses, model variant, inference provider, platform, footer links, cookies).

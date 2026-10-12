# EcoQuest — Web (PWA)

Cliente móvil de EcoQuest: Next.js (App Router) + TypeScript + Tailwind v4, con el sistema de diseño v2 (neo-brutalismo / arcade) de `docs/design/v2/`. Flujo: bienvenida y seguridad → expedición «Descubre el Edén» (3 misiones: hoja, flor, raíces) → sesión mínima → captura → resultado → resumen con insignia.

## Comandos

```bash
npm install
cp .env.example .env.local   # ajusta variables
npm run dev                  # http://localhost:3000
npm run lint && npm run typecheck && npm test && npm run build
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_MOCK_API=true` | Usa un clasificador simulado (sin backend). |
| `NEXT_PUBLIC_API_URL` | URL base de la API real (por defecto `http://localhost:8000`). Se usa si el mock no está activo. |

**Mock:** si el nombre del archivo contiene `confirmed`, `inconclusive` o `unconfirmed`, devuelve ese estado; con `error` simula una caída de red; en otro caso depende del tamaño del archivo. Sus umbrales (0.5 / 0.3) son solo del mock.

## Contrato de API

`POST {API_URL}/classify` (multipart: `image`, `mission_id` ∈ `leaf|flower|roots`). Respuesta validada en `src/lib/api.ts`. Imagen reducida en cliente (lado mayor 1024 px, JPEG) antes de enviar; límite 5 MB. Errores 400/429/5xx y fallos de red se muestran con mensaje claro; ante red/5xx/429 la foto se guarda como «evidencia sin analizar» y se puede reenviar.

## Estructura

- `src/data/expedition.ts` — misiones y expedición.
- `src/i18n/` — diccionario localizable (`es.ts`); `t(key, vars)`.
- `src/lib/api.ts` (cliente + mock), `session.ts` (lógica de progreso, resumen, insignia), `result.ts` (estados de UI), `image.ts`, `db.ts` (IndexedDB), `track.ts`/`log.ts` (registro local).
- `src/app/tokens.css` (copia de §6.4, sin el `@import` de Google Fonts) y `src/app/globals.css` (tema portado a `@theme`).
- `src/components/ui/button.tsx` y `src/components/eq/*` — componentes del sistema de diseño (Button, EqCard, MissionCard, StatusBadge, XpBar, Insignia, EqToast, SafetyNotice, Sticker, PixelIcon, Hud, IaChip, PhotoFrame, Screen).
- `src/app/` — pantallas (`/`, `/expedicion`, `/sesion`, `/mision/[id]`, `/resumen`, `/datos`), `manifest.ts`, `icon.svg`.

## Privacidad

Sin cuentas ni ubicación. Progreso, fotos y registro viven en IndexedDB del dispositivo. `/datos` permite exportar el registro (JSON) y **borrar todo**. El servidor solo recibe la foto reducida para inferir; no se guarda.

## Honestidad del modelo

Los `scores` son una similitud softmax, **no una probabilidad ni una identificación de especie**. La UI no muestra números ni porcentajes: el panel de similitud dibuja solo una barra y la línea de umbral de la misión (valor espejo de `inference/app/thresholds.json`, ver `TODO(diseño)` en `src/data/expedition.ts`), con aviso. Las misiones marcadas a mano se etiquetan «no verificada» y no cuentan para la insignia verificada. Modelo declarado en la app: `google/siglip2-base-patch16-256` (apache-2.0), reemplazado por lo que informe el servidor.

## Registro de la prueba

Cada toque relevante y cada análisis (estado, latencia del servidor y ida y vuelta) se guarda localmente; `/datos` muestra interacciones totales, latencia media y peor caso, y exporta el JSON.

## Limitaciones

PWA básica (manifest, sin service worker ni modo offline). Icono SVG único. Sin ejecución en dispositivo real todavía.

## Diseño visual v2

- **Tailwind v4, no v3.** El doc (§6) asume Tailwind v3 (`tailwind-theme.js` + `tailwindcss-animate`). Aquí el tema se portó a `@theme` en `src/app/globals.css` conservando los mismos valores y nombres de clase (`lima`, `voltio`, `turbo`, `glitch`, `lava`, `selva`, `tinta`, `papel`, `status-*`, `shadow-brutal*`, `border-3/4`, `min-h-tap`, `rotate-sticker`, `translate-*-press`, `duration-snap`, `text-pixel-*`, `font-pixel/display/sans`). Sin OKLCH. `font-pixel` y `font-display` son `@utility` (las variables de `next/font` se llaman igual que el namespace `--font-*` del tema). `rounded` y `rounded-full` se fuerzan a 0 con `!important` porque en v4 son utilidades estáticas. `tw-animate-css` reemplaza a `tailwindcss-animate`. `tailwind-merge` se extendió (`src/lib/utils.ts`) para conocer `text-pixel-*` y `shadow-brutal*`.
- **Fuentes** (`next/font/google`, autoalojadas, subsets `latin` y `latin-ext`; variables `--font-pixel`, `--font-display`, `--font-body`). Licencias, todas SIL Open Font License 1.1 (OFL): **Silkscreen** (Jason Kottke), **Archivo Black** (Omnibus-Type), **Space Grotesk** (Florian Karsten). Las OFL permiten uso, incrustación y redistribución con la fuente, sin venderla por separado.
- Estados visuales: `confirmed`→match; `inconclusive`/`unconfirmed`→unsure; `pending_upload` (y errores sin evidencia)→retry; `manual_unverified`→manual (`toResult` en `src/lib/result.ts`).
- Desviaciones: el `Button` no usa `@radix-ui/react-slot` (no instalado); para enlaces existe `LinkButton`. Las dependencias de shadcn sin uso (`shadcn`, `@base-ui/react`, `lucide-react`) siguen en `package.json`.

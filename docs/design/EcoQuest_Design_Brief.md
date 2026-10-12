# EcoQuest — Design Brief v1.0

**Proyecto:** EcoQuest  
**Contexto:** Hacktoberfest 2026 — Touch Grass  
**Dirección:** Neo-brutalism × Bright Arcade Videogame  
**Plataforma inicial:** aplicación web mobile-first / PWA progresiva  
**Estado:** propuesta de diseño, no implementación

## 1. Visión

**EcoQuest convierte los espacios naturales cercanos en expediciones breves:** el usuario elige una aventura, guarda el teléfono, sale a explorar, documenta hallazgos y recibe feedback impulsado por IA abierta.

**Concepto creativo:** *The real world is your playground.*  
**Promesa de experiencia:** una interfaz que se siente como videojuego; una aventura que sucede fuera de la pantalla.

No es una app para maximizar tiempo de pantalla ni un catálogo genérico de especies. Es una experiencia de descubrimiento local, comenzando por Villahermosa, Tabasco.

## 2. Objetivos

1. Hacer atractivo iniciar una expedición real en menos de un minuto.
2. Mantener la pantalla como parte breve de la experiencia (elegir → explorar → capturar → celebrar).
3. Explicar las misiones con lenguaje simple, iconos reconocibles y controles táctiles grandes.
4. Dar protagonismo a la IA abierta al interpretar fotografías de hallazgos, sin exagerar su precisión.
5. Crear una identidad memorable, usable en exteriores y suficientemente consistente para escalar.

### Indicadores de producto sugeridos
- Tiempo requerido para iniciar una misión.
- Porcentaje de expediciones iniciadas que alcanzan al menos un hallazgo.
- Tiempo activo fuera de la pantalla (estimado; no confundir con tiempo efectivamente caminado).
- Porcentaje de análisis con resultado incierto / reintentos.
- Comprensión de estado y siguiente acción en pruebas de usabilidad.

## 3. Público y contexto

**Audiencia primaria:** jóvenes y adultos con smartphone, interesados en naturaleza, exploración casual, retos cortos y experiencias gamificadas.  
**Primer escenario:** parques accesibles en Villahermosa, particularmente el entorno del Parque Tomás Garrido Canabal.  
**Condiciones reales:** calor, humedad, lluvia, luz solar intensa, señal móvil irregular y uso con una mano.

Diseñar para uso al aire libre implica texto legible, alto contraste, objetivos táctiles de al menos 44 × 44 px, estados explícitos y flujos cortos. No obligar al usuario a caminar mirando la pantalla.

## 4. Personalidad y lenguaje

**Atributos:** energético, curioso, atrevido, juguetón, directo y optimista.  
**No es:** corporativo, infantilizado, saturado de efectos, competitivo a cualquier costo o excesivamente tecnológico.

### Principios de voz
- Frases breves y verbos de acción.
- Invitar a observar, no imponer velocidad.
- Recompensar curiosidad, no afirmar certezas que la IA no tiene.
- Español como idioma principal del piloto; etiquetas arcade en inglés solo cuando aporten personalidad.

**Ejemplos:** “¡Comienza tu expedición!”, “Mira a tu alrededor”, “¡Buen hallazgo!”, “Coincidencia probable”, “No estamos seguros; prueba otra foto”, “¡Expedición completada!”.

## 5. Dirección artística

### Neo-brutalismo
- Siluetas y bloques sólidos.
- Contorno negro grueso, generalmente 3–4 px.
- Sombras desplazadas, duras y sin desenfoque.
- Bordes redondeados moderados (no apariencia SaaS suave).
- Tipografía display rotunda, composiciones directas y CTA muy visible.

### Arcade
- Metáforas visuales de misiones, XP, logros y barras de progreso.
- Colores brillantes como refuerzo funcional.
- Mini detalles pixelados y stickers ilustrados, sin convertir cada componente en un efecto especial.
- Microinteracciones con sensación de pulsación física.

### Restricciones
- Evitar glassmorphism, gradientes difuminados dominantes, sombras blandas, exceso de gris y dashboards densos.
- No utilizar color como único indicador de estado.
- Reservar la estética espectacular para momentos puntuales (inicio / recompensa); durante la exploración, priorizar calma y legibilidad.

## 6. Paleta de diseño

| Token propuesto | Hex | Uso |
|---|---|---|
| Quest Black | `#111111` | texto, iconos, bordes, sombras |
| Cloud Cream | `#FFF8E7` | fondo base |
| Paper White | `#FFFDF8` | superficies |
| Arcade Green | `#A3FF12` | CTA primario, progreso, éxito |
| Sky Blast Blue | `#32C8FF` | navegación, información |
| Hot Magenta | `#FF4FD8` | logros, recompensas |
| Sun Charge Yellow | `#FFD83D` | avisos suaves, recompensas |
| Lava Orange | `#FF7A1A` | atención y desafíos |
| Leaf Green | `#22B455` | exploración y flora |

**Distribución orientativa:** 60% superficies claras, 20% tinta/contorno y 20% acentos saturados; es una guía, no una norma de medición por píxel.

### Semántica
- Success: Arcade Green + Quest Black.
- Info: Sky Blast Blue + Quest Black.
- Warning: Sun Charge Yellow + Quest Black.
- Danger: Lava Orange + Quest Black, acompañado por etiqueta/icono explícito.
- Reward: Hot Magenta + Quest Black.

Verificar el contraste WCAG del **par texto/fondo exacto** antes de aprobar componentes. Colores saturados combinados con texto negro serán el patrón principal; no asumir que texto blanco sobre cada acento es legible.

## 7. Tipografía

**Display:** Bricolage Grotesque (preferida); alternativa Space Grotesk.  
**UI y lectura:** Inter; alternativa IBM Plex Sans.  
**Acentos de videojuego:** Press Start 2P solo para XP, pequeños rótulos o recompensas puntuales, nunca párrafos.

| Estilo | Tamaño / interlínea | Peso |
|---|---|---|
| Hero XL | 40 / 44 | 800 |
| Hero L | 32 / 38 | 800 |
| Section Title | 24 / 30 | 800 |
| H1 | 28 / 34 | 700 |
| H2 | 22 / 28 | 700 |
| H3 | 18 / 24 | 700 |
| Body L | 16 / 24 | 500 |
| Body M | 14 / 22 | 500 |
| Body S | 12 / 18 | 500 |
| Button | 16 / 20 | 700 |
| Badge | 12 / 16 | 700 |

En móvil compacto, escalar hero con `clamp()` y evitar que los titulares empujen el CTA fuera del primer contexto visible.

## 8. Geometría y tokens

- **Espaciado:** escala 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 px, basada principalmente en múltiplos de 4 y ritmo de 8.
- **Radio:** xs 8, sm 12, md 16, lg 20, pill 999 px.
- **Bordes:** 3 px estándar; 4 px para CTA y superficies destacadas.
- **Sombras:** sm `3px 3px 0 #111111`, md `4px 4px 0 #111111`, lg `6px 6px 0 #111111`.
- **Áreas táctiles:** mínimo 44 × 44 px; separaciones suficientes entre acciones.
- **Layout:** mobile-first; contenedor cómodo de lectura; 4 columnas lógicas móvil, hasta 12 desktop; tarjetas grandes y poco texto.

### Convención de tokens a implementar
`--color-bg`, `--color-surface`, `--color-ink`, `--color-primary`, `--color-secondary`, `--color-reward`, `--color-warning`, `--color-danger`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--shadow-brutal-sm`, `--shadow-brutal-md`, `--shadow-brutal-lg`, `--border-strong`.

Separar tokens primitivos (hex) de tokens semánticos (función), para evitar que el color de un botón dependa de un nombre de misión.

## 9. Librería de componentes

### 9.1 Botones
- **Primary:** verde eléctrico, texto negro, borde negro 4 px, sombra dura.
- **Secondary:** azul brillante, mismos bordes/sombra.
- **Reward:** magenta, para momentos de logro y no CTA cotidiano.
- **Ghost/Outline:** blanco cálido, negro, borde marcado.
- Estados obligatorios: default, hover (donde exista), focus-visible, active (se desplaza hacia sombra), loading, disabled.
- El hover no debe ser la única pista; soporte touch y teclado.

### 9.2 Mission Card
Contiene icono/ilustración, título, descripción de una línea, duración o XP, estado y acción. Variantes: pending, active, completed, uncertain. Colores por categoría sin depender exclusivamente de ellos. No construir tarjetas clicables con botones interactivos anidados.

### 9.3 Expedition Card
Nombre, duración, número de misiones, ubicación si existe, dificultad, CTA y una ilustración/sticker dominante. Debe destacar claramente cuál es la siguiente acción.

### 9.4 Progress Bar / HUD
Barra con borde oscuro, relleno brillante y texto accesible `2 de 3 misiones`. Permitir lectura no visual mediante roles/atributos adecuados. Evitar efectos que simulen más progreso que el real.

### 9.5 Chips y badges
Metadatos: `15 MIN`, `FLORA`, `FÁCIL`. Logros como stickers coleccionables: “Leaf Hunter”, “Trail Starter”. No usar distintivos diminutos para información esencial.

### 9.6 Cámara y evaluación
- Vista previa grande, instrucción de captura corta, botón principal claro.
- Estados: permiso requerido, captura, analizando, coincidencia probable, incierto, error, reintento.
- Mostrar confianza cuando sea útil y explicar que es una estimación; nunca afirmar identificación exacta sin un modelo validado para ello.

### 9.7 Reward Modal
Una recompensa focal: título, hallazgo, XP, botón “Continuar”. Apoyarse en `aria` correcto y control del foco. Animación opcional y breve.

### 9.8 Navegación
Inicio, Expediciones, Descubrimientos, Perfil. En el MVP, no introducir pantallas vacías: ocultar funciones futuras o presentar un estado planificado solo si está explícitamente aprobado.

## 10. Pantallas y jerarquía

### Home
1. Mensaje hero breve: “Tu próxima aventura está afuera”.
2. CTA principal: “Comenzar expedición”.
3. Expedición recomendada y duración.
4. Progreso reciente / descubrimientos, solo si hay datos.

### Expedition Detail
Título, contexto, zona permitida, duración estimada, tres misiones y CTA grande. Breve advertencia de seguridad por clima/senderos.

### Active Expedition
Pantalla deliberadamente simple: misión actual, progreso, acción “Tomar foto”, opción “Pausar / terminar”. Mensaje que fomenta guardar el teléfono.

### Mission Capture
Permiso de cámara → fotografía → análisis → resultado (probable / incierto / retry). Evitar formularios largos.

### Quest Complete
Hallazgos, misión completada, XP, tiempo registrado y CTA para terminar. No confundir el tiempo transcurrido con actividad física verificada.

## 11. Recorrido MVP

1. Abrir la app.
2. Seleccionar “Descubre el Edén” (expedición piloto).
3. Leer tres retos simples: hoja grande, flor, raíces visibles.
4. Iniciar y guardar el teléfono.
5. Tomar una foto al encontrar cada objeto; IA evalúa similitud o registra incertidumbre.
6. Continuar hasta finalizar.
7. Ver recompensa y resumen.

**Regla:** la IA aporta interpretación, pero el usuario siempre conserva control y entiende la incertidumbre. La cámara nunca debe ser un requisito silencioso: solicitar permiso justo antes del uso y ofrecer explicación si se deniega.

## 12. Motion y sonido

- Feedback táctil visual: 120–180 ms.
- Cards y paneles: 180–240 ms.
- Easing con carácter, sin rebotes exagerados.
- Recompensas: un único efecto protagonista; no confeti repetitivo en cada botón.
- `prefers-reduced-motion` obligatorio.
- Sonido opcional, apagado por defecto y nunca necesario para entender el estado.

## 13. Accesibilidad y uso exterior

- Contrastes WCAG AA para texto normal/grande y estados pertinentes.
- Foco visible de alto contraste; navegación por teclado.
- Labels textuales junto a iconos críticos.
- Funcionar en pantallas móviles pequeñas y bajo sol.
- Evitar geolocalización permanente y permisos innecesarios.
- No solicitar fotografías peligrosas, aproximaciones a fauna, contacto con plantas desconocidas ni caminar mirando la pantalla.
- Usar mensajes para clima adverso y respetar senderos y normas del parque.

## 14. Ilustración y assets

Estilo sticker vectorial: figuras simples, contorno grueso negro, rellenos planos, ocasionales estrellas o rayos, composición dinámica. Íconos naturales (hoja, ave, brújula, cámara, trofeo, mochila). Mantener consistencia de grosor y perspectiva.

**No producir imágenes como si fueran assets finales antes de validar el lenguaje de marca.** Crear primero un moodboard y una única pantalla piloto, y revisarlos antes de extender el sistema.

## 15. Alcance y entregables de diseño

**Etapa A — Fundaciones:** paleta, tipografía, tokens, bordes/sombras, iconografía.  
**Etapa B — Kit base:** Button, Card, Chip, Progress, BottomNav, Modal, estados.  
**Etapa C — Pantalla piloto:** Home + Expedition Detail, con revisión visual.  
**Etapa D — Flujo funcional:** expedición activa, cámara/análisis, resultados.  
**Etapa E — QA:** responsive, accesibilidad, permisos, fallback, pruebas en exterior.

### Criterios de aceptación
- Neo-brutalismo reconocible sin sacrificar lectura.
- El CTA principal se identifica de inmediato.
- Un usuario puede iniciar una expedición sin tutorial extenso.
- Los estados de IA incierta/error son legibles y honestos.
- La UI se adapta a móvil y no requiere interacción continua al caminar.
- Todos los componentes usan tokens; no se dispersan hexadecimales arbitrarios.

## 16. Decisiones abiertas

- Logotipo e isotipo definitivos.
- Idioma de UI (se recomienda español piloto).
- Grado exacto de pixel art vs ilustración vectorial.
- Modelo de inferencia y conectividad para primer MVP.
- Mecánica de XP y reglas de verificación.

**Nota:** Este documento es una especificación de diseño, no una garantía de rendimiento, precisión del modelo ni cumplimiento automático de accesibilidad; todo debe verificarse en implementación.

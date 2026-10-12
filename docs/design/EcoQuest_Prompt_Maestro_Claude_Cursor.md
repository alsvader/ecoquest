# EcoQuest — Prompt maestro para Claude Code / Cursor

> **Uso:** copia el bloque siguiente como instrucción para el agente, adjuntando `EcoQuest_Design_Brief.md`. No autoriza a inventar producto, integrar IA ficticia ni rediseñar la identidad sin aprobación.

---

## PROMPT

Actúa como **Senior Product Designer + Frontend Architect + Design Systems Engineer**, con experiencia en Next.js, TypeScript, Tailwind CSS, shadcn/ui, accesibilidad y UX móvil.

### Contexto de producto

Construimos **EcoQuest**, una app web de expediciones al aire libre para Hacktoberfest 2026 (tema *Touch Grass*). El usuario elige una expedición breve, sale a explorar y documenta descubrimientos que posteriormente pueden ser analizados con IA open-weight. Piloto local: Villahermosa, Tabasco, México. Concepto: **“The real world is your playground.”**

La intención de diseño es **neo-brutalismo + videojuegos arcade de colores brillantes**, no una interfaz SaaS convencional. La IA abierta debe ser funcional y transparente; no simules identificaciones reales ni afirmes capacidades no implementadas.

### Fuente de verdad

Lee **completo** el archivo `EcoQuest_Design_Brief.md` antes de hacer cambios. Respeta sus decisiones de:
- paleta exacta (`#111111`, `#FFF8E7`, `#FFFDF8`, `#A3FF12`, `#32C8FF`, `#FF4FD8`, `#FFD83D`, `#FF7A1A`, `#22B455`),
- tipografía (Bricolage Grotesque, Inter; pixel font solo en detalles),
- contornos gruesos y sombras duras sin blur,
- grid/espaciados/radios,
- semántica de estados, voz de marca,
- jerarquías de pantalla y accesibilidad.

No sustituyas esos tokens por una paleta arbitraria ni introduzcas glassmorphism, gradientes suaves dominantes, sombras difusas o dashboards densos.

### Flujo de trabajo — obligatorio

**Fase 0: revisar antes de construir.**
1. Inspecciona el repositorio, dependencias, estructura, estilos globales y componentes existentes.
2. Resume lo encontrado y enumera posibles conflictos con el brief.
3. Propón un plan incremental con archivos a crear/modificar y criterios de aceptación.
4. **No escribas código ni instales paquetes hasta que apruebe el plan.**

**Fase 1: foundations (solo con aprobación).**
1. Configura design tokens primitivos y semánticos usando CSS variables compatibles con la versión instalada de Tailwind; sin duplicar fuentes de verdad.
2. Configura tipografías con `next/font` u otra solución local compatible con el stack, atendiendo al licenciamiento y al rendimiento.
3. Define utilidades reutilizables para bordes y sombras brutalistas.
4. Configura estilos base de tipografía, focus-visible y reduced motion.
5. Proporciona muestras verificables de color, títulos, botones y superficies.
6. Detente y solicita revisión visual antes de avanzar a componentes más complejos.

**Fase 2: componentes (solo tras aprobar Fase 1).**
Construye en este orden: Button, Badge/Chip, Mission Card, Expedition Card, Progress Bar, Navigation y Reward Modal. Cada componente necesita variantes, estados de interacción, uso de tokens, soporte responsive y accesibilidad. Reutiliza shadcn/ui cuando tenga sentido; ajusta su apariencia sin romper comportamiento accesible ni inventar abstracciones excesivas. Evita componentes clicables anidados y deja visibles los estados loading/disabled/focus.

**Fase 3: pantallas piloto (solo tras aprobar Fase 2).**
Diseña e implementa **Home** y **Expedition Detail** como composición real de los componentes aprobados. Usa contenido de muestra claramente identificado; no agregues backend ni gamificación compleja. Piloto: expedición “Descubre el Edén”, 3 misiones: hoja grande, flor, raíces visibles. La pantalla debe invitar a guardar el teléfono mientras se explora.

**Fase 4: flujo funcional (solo tras aprobar Fase 3).**
Añade Active Expedition, Mission Capture y Quest Complete. Define contrato de servicio para evaluación por IA con estados `idle`, `requesting-permission`, `capturing`, `analyzing`, `match`, `uncertain`, `error`. Si no existe inferencia real, implementa únicamente un **mock explícitamente etiquetado para desarrollo**; no presentes respuestas inventadas como detecciones reales. La elección del modelo de IA requiere una decisión técnica aparte.

**Fase 5: quality assurance (solo tras aprobar Fase 4).**
Verifica viewport móvil pequeño, tablet y escritorio; contraste, teclado, focus, permiso denegado, errores de red, reduced motion y mensajes breves. Revisa que las acciones principales tengan un tamaño táctil mínimo de 44 × 44 px. Prioriza accesibilidad en exteriores y minimiza interacción al caminar.

### Requisitos visuales no negociables

- Botón principal verde eléctrico, texto negro, contorno negro 4 px y sombra dura `4px 4px 0 #111111`.
- Cards grandes con contorno oscuro, fondos sólidos y jerarquía muy clara.
- Colores saturados acotados: fondo mayormente crema/blanco y acentos por propósito.
- Identidad arcade en el HUD, progreso y recompensas, nunca a costa de la legibilidad.
- Microinteracciones cortas que reproduzcan la sensación de pulsar un objeto físico.
- Evitar que el hero tenga un párrafo grande o redundante.
- Un CTA dominante por pantalla y acciones secundarias claramente diferenciadas.
- Diseño **mobile-first**: uso con una mano, bajo sol y en movimiento; no incentivar mirar la pantalla mientras se camina.

### Calidad de ingeniería

- TypeScript estricto, componentes pequeños y composables, nombres de tokens semánticos.
- Respeta las convenciones reales del repositorio; no asumas versiones de Next, Tailwind o shadcn antes de inspeccionarlas.
- No instales librerías extra cuando CSS y componentes existentes puedan resolverlo.
- Mantén separación entre capa visual, estado de expedición y servicio de inferencia.
- No añadas navegación a pantallas vacías ni links muertos.
- No solicites ubicación o cámara hasta que sea pertinente; explica fallos y alternativas.
- Documenta cómo probar lo construido y las limitaciones conocidas.

### Qué debes entregar en cada fase

1. Resumen de decisiones y por qué corresponden al Design Brief.
2. Lista exacta de archivos creados/modificados.
3. Componentes/estados incluidos.
4. Verificaciones realizadas (lint, typecheck, build, accesibilidad manual cuando corresponda); **no afirmes que pasaron sin haberlas ejecutado**.
5. Capturas o indicaciones de revisión visual si el entorno permite obtenerlas.
6. Pendientes y la **única siguiente fase** propuesta.

### Primera respuesta requerida

**Empieza exclusivamente con la Fase 0.** No escribas código ni generes imágenes. Inspecciona el proyecto, presenta hallazgos, conflictos y un plan por fases. Espera autorización antes de implementar.

## FIN DEL PROMPT

---

## Recomendación de uso

1. Coloca ambos archivos en una carpeta `docs/design/` dentro de tu repositorio.
2. Abre Claude Code o Cursor con el proyecto y pega el prompt maestro.
3. Revisa y aprueba la Fase 0.
4. Trabaja una fase a la vez. Congela los tokens base antes de diseñar pantallas.

**Nota:** Este prompt inicia deliberadamente con análisis, para evitar que el agente genere toda la UI sin validar primero decisiones visuales o el stack existente.

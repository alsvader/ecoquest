# EcoQuest — Product Requirements Document (PRD)

| | |
|---|---|
| **Producto** | EcoQuest — *The Real World Is Your Playground.* |
| **Versión** | 0.1 (borrador) |
| **Fecha** | 2026-10-08 |
| **Contexto** | Reto semanal **Touch Grass**, Hacktoberfest 2026 |
| **Localización inicial** | Villahermosa, Tabasco, México |
| **Fuente** | `EcoQuest_Propuesta.md` |
| **Estado** | Borrador para validación. Las decisiones abiertas están en la sección 14. |

---

## 1. Resumen

EcoQuest convierte una caminata corta al aire libre en una expedición. La persona elige una misión, guarda el teléfono, explora su entorno y fotografía solo algunos hallazgos. Un modelo de IA de pesos abiertos (SigLIP2) estima si cada foto es compatible con el objetivo de la misión. Al final, la persona recibe un registro simple de sus descubrimientos.

El MVP es una **web móvil / PWA** con **una expedición («Descubre el Edén»), tres misiones visuales** y clasificación de imágenes con un modelo abierto. Se prueba y documenta en una salida real al Parque Tomás Garrido Canabal.

## 2. Problema y oportunidad

**Problema.** Las experiencias digitales recompensan el tiempo frente a la pantalla. Hay poca motivación sencilla para salir a observar la naturaleza cercana, sobre todo para quien no tiene experiencia previa.

**Oportunidad.** Usar el teléfono como disparador breve de exploración, no como destino. El reto Touch Grass pide justamente un proyecto con IA abierta que saque a la gente de la pantalla.

**Por qué EcoQuest** (matriz de decisión de la propuesta, heurística y no oficial): puntuó 4.80/5 frente a AFK Adventures (4.45), BirdTab (4.20), FloraTab (4.15), EcoAcción (4.05) y VerdeRuta (3.85). Estimación: 16–25 h para una persona con experiencia en React/Next.js.

## 3. Objetivos y no objetivos

### Objetivos

1. **O1.** Completar una expedición real de ~20 min en exterior con tres misiones intentadas.
2. **O2.** Que la IA abierta sea esencial: sin el modelo no hay validación de hallazgos.
3. **O3.** Mantener el tiempo en pantalla mínimo (pocas pantallas, poca escritura, pocos pasos).
4. **O4.** Comunicar con honestidad la incertidumbre del modelo, sin afirmar identificaciones que no puede sostener.
5. **O5.** Entregar un repositorio público reproducible, con documentación de uso de IA abierta, licencias y evidencia de la prueba.

### No objetivos (fuera del MVP)

- Cuentas y autenticación.
- Rankings, competencias o recompensas monetizables.
- Generación ilimitada de misiones con IA.
- Reconocimiento preciso de especies o nombres taxonómicos.
- Rutas peatonales automáticas, mapas complejos.
- Reconocimiento de audio de aves.
- Inferencia offline garantizada.
- Publicación en App Store / Play Store.
- Verificación automática de distancia caminada o de tiempo real fuera de pantalla.

## 3.1 Alineación con el reto

Criterios de diseño derivados del enunciado (no una rúbrica oficial):

| Criterio | Cómo lo cumple EcoQuest |
|---|---|
| Actividad física u observacional auténtica | Caminata y observación en un parque real |
| IA abierta central | SigLIP2 valida cada hallazgo |
| Poco tiempo en pantalla | Flujo *screen-last*: foto solo al encontrar algo |
| Prueba al aire libre documentada | Fase 3 + entregable de evidencia |
| Código y licencias | Repo público, README, créditos y licencias de modelo/dependencias |

## 4. Usuarios

**Usuario primario.** Persona con smartphone que quiere salir a caminar y descubrir su entorno, aunque no tenga experiencia en observación de naturaleza.

**Usuario secundario (evaluación).** Jueces/revisores del reto, que verán el repositorio, el video de demo y la documentación.

**Historias de usuario**

| ID | Historia | Prioridad |
|---|---|---|
| US1 | Como explorador, quiero elegir una expedición corta para saber qué buscar sin planear nada. | Must |
| US2 | Como explorador, quiero ver mis tres objetivos y una nota de seguridad antes de empezar, para salir con claridad. | Must |
| US3 | Como explorador, quiero fotografiar un hallazgo y saber rápido si coincide con la misión, para seguir caminando. | Must |
| US4 | Como explorador, quiero que la app me diga cuando no está segura y me deje reintentar, para no frustrarme. | Must |
| US5 | Como explorador, quiero poder marcar un hallazgo manualmente como «no verificado» si la IA falla. | Should |
| US6 | Como explorador, quiero un resumen final con mis hallazgos y una insignia. | Must |
| US7 | Como explorador, quiero borrar mis fotos y no crear cuenta, para proteger mi privacidad. | Must |
| US8 | Como revisor, quiero ver qué modelo se usa, su versión y licencia, y reproducir el proyecto. | Must |

## 5. Principios de producto / UX

1. **Screen-last:** pocas pantallas, poca escritura, pocos pasos.
2. **Explora antes de capturar:** la misión no debe volverse una sesión de fotos continua.
3. **Curiosidad sobre exactitud absoluta:** reconocer cuándo la IA no está segura.
4. **Seguridad y respeto ambiental:** no tocar fauna ni recolectar especímenes, no salir de zonas permitidas.
5. **Privacidad por defecto:** sin cuenta ni ubicación precisa en el MVP.

## 6. Alcance funcional (MVP)

### 6.1 Flujo principal

1. **Bienvenida** → explicación breve de la expedición.
2. **Elegir expedición** → en el MVP solo «Descubre el Edén» (~20 min).
3. **Objetivos + seguridad** → tres misiones y aviso de seguridad.
4. **Comenzar** → la app invita a guardar el teléfono.
5. **Documentar hallazgo** → el usuario abre la cámara solo al encontrar algo y toma la foto.
6. **Interpretar con IA** → el servicio devuelve compatibilidad con la misión.
7. **Resultado** → confirmado / no concluyente (reintentar) / no confirmado (revisión manual etiquetada).
8. **Terminar** → resumen de hallazgos, tiempo de sesión e insignia.

### 6.2 Expedición piloto: «Descubre el Edén»

**Lugar:** Parque Tomás Garrido Canabal · **Duración:** ~20 min · **Misiones:** 3.

| # | Misión | Evidencia | Validación |
|---|---|---|---|
| M1 | Encuentra una hoja de gran tamaño | Foto de la hoja | Categoría visual «hoja». No se infiere el tamaño físico. |
| M2 | Descubre una flor y registra sus colores | Foto de flor | Categoría «flor visible»; colores solo si son visibles. |
| M3 | Encuentra un árbol con raíces visibles | Foto de tronco/raíces | Categoría «tronco/raíces»; evaluación tentativa, con opción de confirmación manual. |

Las misiones que no se validen de forma fiable en la Fase 0 se reformulan o se reemplazan antes de congelar el alcance.

### 6.3 Requisitos funcionales

| ID | Requisito | Prioridad |
|---|---|---|
| FR-1 | Mostrar pantalla de bienvenida con la premisa y reglas de seguridad. | Must |
| FR-2 | Ofrecer la expedición «Descubre el Edén» con tres misiones predefinidas. | Must |
| FR-3 | Capturar o subir una foto desde móvil (input de cámara/imagen web). | Must |
| FR-4 | Reducir/comprimir la imagen en cliente antes de enviarla, para bajar latencia. | Should |
| FR-5 | Enviar la imagen a una API de clasificación que ejecute SigLIP2 y devuelva puntuaciones de similitud por categoría. | Must |
| FR-6 | Aplicar reglas de misión (umbrales por categoría) y asignar un estado: `confirmado`, `no concluyente` o `no confirmado`. | Must |
| FR-7 | Mostrar un resultado comprensible, sin presentar la similitud como probabilidad ni como identificación de especie. | Must |
| FR-8 | Permitir reintento de foto cuando el resultado sea no concluyente. | Must |
| FR-9 | Permitir marcar una misión como completada manualmente, claramente etiquetada «no verificada». | Should |
| FR-10 | Guardar progreso y resumen localmente (IndexedDB), sin cuenta. | Must |
| FR-11 | Mostrar resumen final: hallazgos por misión, estado de verificación, tiempo de sesión e insignia. | Must |
| FR-12 | Permitir borrar fotos y datos locales; el servidor no conserva imágenes más allá de la inferencia. | Must |
| FR-13 | Manejar errores de red/servicio con mensaje claro y opción de guardar la evidencia pendiente y reintentar. | Should |
| FR-14 | Registrar de forma local datos de prueba (acciones de UI, resultados, latencias) para la documentación de la prueba. | Should |
| FR-15 | Declarar visiblemente en la app y el README el modelo usado, su versión y licencia. | Must |

## 7. Requisitos no funcionales

| Área | Requisito |
|---|---|
| **Rendimiento** | Latencia de inferencia objetivo a definir en Fase 0 (meta preliminar: resultado en pocos segundos en conexión móvil). Se medirá y reportará, no se asumirá. |
| **Pantalla mínima** | Máximo de interacciones en pantalla durante la salida: por definir en Fase 0; se contarán y reportarán. |
| **Usabilidad exterior** | Legible bajo luz solar, controles grandes, uso con una mano. |
| **Accesibilidad** | Componentes accesibles (shadcn/ui), contraste adecuado, textos claros. |
| **Privacidad** | Sin cuenta, sin ubicación precisa, sin persistencia de imágenes en servidor, opción de borrado. Declarar claramente cualquier servicio externo de inferencia. |
| **Seguridad** | Validar tipo y tamaño de imagen en la API; limitar tasa de peticiones; sin secretos en el cliente. |
| **Disponibilidad de demo** | Plan de contingencia: servicio de inferencia verificado antes de la salida y video real de respaldo. |
| **Licencias** | Registrar nombre, versión y licencia exactos de los pesos, y las licencias de dependencias y de las fotos de prueba. |
| **Idioma** | Por definir (ver decisiones abiertas); diseñar los textos para poder localizarlos. |

## 8. Modelo de IA

**Principal: SigLIP2** (`google/siglip2-base-patch16-256`), comparación imagen-texto contra descripciones candidatas por categoría («flor visible», «hoja», «tronco/raíces», más categorías negativas como distractores).

- Las puntuaciones de similitud **no son probabilidades calibradas ni verificación absoluta**. Los umbrales se determinarán empíricamente.
- Se evaluará con fotos de prueba, incluidos casos negativos y ambiguos.
- Servicio de inferencia en Python + Transformers.
- Open-weight no implica offline: la inferencia en servidor cumple el objetivo, pero debe declararse.

**Opcional / post-MVP: SmolVLM2** para descripciones breves de hallazgos. Se incorpora solo si las pruebas muestran calidad suficiente y no empeora latencia ni complejidad.

**Restricción:** no usar un LLM propietario como núcleo decisivo de la validación.

## 9. Arquitectura propuesta

```text
Usuario en el parque
    │
    ▼
Web móvil / PWA (Next.js: expedición, misiones, cámara)
    │   imagen reducida
    ▼
API de clasificación visual (Python + Transformers)
    │
    ▼
SigLIP2 (pesos abiertos)
    │
    ▼
Categorías sugeridas + similitudes
    │
    ▼
Reglas de misión + estado de verificación
    │
    ▼
Progreso y resumen guardados localmente (IndexedDB)
```

| Área | Elección provisional |
|---|---|
| Frontend | Next.js + TypeScript, Tailwind CSS + shadcn/ui |
| Cámara | Input de captura web (`<input type="file" capture>`) |
| Inferencia | Python + Transformers + SigLIP2, en infraestructura separada del frontend |
| Estado local | IndexedDB |
| Despliegue | Vercel (frontend); servicio de modelo en infraestructura compatible con el runtime |
| Código | Repositorio público en GitHub |
| Futuro | MapLibre + OpenStreetMap (mapas), Valhalla (rutas) |

La inferencia pesada no debe asumirse viable en funciones serverless convencionales.

## 10. Métricas de éxito

Evidencia honesta de uso, no un estudio científico.

| Métrica | Meta del MVP |
|---|---|
| Expedición completada en exterior real | 1 (documentada con video/fotos) |
| Misiones intentadas con resultado registrado | 3 de 3 |
| Fotos clasificadas con el modelo abierto | ≥ 1 por misión |
| Casos de error e incertidumbre documentados | Todos los observados |
| Interacciones en pantalla durante la salida | Contadas y reportadas |
| Latencia de inferencia | Medida (media y peor caso) |
| Valoración cualitativa | ¿Motivó a observar más o distrajo? |
| Fase 0: calidad del modelo | Distingue de forma razonablemente útil las categorías de la demo en 15–30 imágenes |

No se afirmará haber medido «tiempo real fuera de pantalla» sin un método consistente para ello.

## 11. Plan de entrega

| Fase | Contenido | Criterio de salida |
|---|---|---|
| **0. Viabilidad IA** | Elegir 3 categorías; reunir 15–30 fotos con derechos claros (idealmente propias); probar SigLIP2 con negativos y ambiguos; medir latencia, memoria y errores; ajustar umbrales | El modelo distingue útilmente los hallazgos; si no, reducir alcance o cambiar misiones |
| **1. Flujo de expedición** | Selección, misiones, progreso y resumen, con resultados simulados | Flujo completo navegable |
| **2. Cámara + inferencia real** | Captura, API de clasificación, manejo de errores, comunicación de incertidumbre | Una foto real recorre el flujo de punta a punta |
| **3. Prueba en Villahermosa** | Expedición breve; registrar qué pasó, fallos, pasos de UI y duración | Evidencia documentada |
| **4. Empaquetado** | README, instrucciones, descripción del uso de IA abierta, demo, limitaciones, retroalimentación | Repo público listo para evaluar |

Estimación total: 16–25 h (supuestos: experiencia en React/Next.js, librerías y modelos existentes; sin entrenamiento propio, publicación en tiendas ni ensayos extensos en dispositivos).

## 12. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Falsos positivos | Categorías acotadas, umbrales probados, estado «no confirmado» |
| Falsos negativos | Reintento y revisión manual etiquetada |
| Latencia de inferencia | Reducir imagen, minimizar peticiones, medir |
| Sin conectividad | Guardar evidencia pendiente y sincronizar (si alcanza el tiempo) |
| Calor, lluvia, terreno inseguro | Actividades breves, flexibles, en áreas públicas accesibles |
| Dependencia de servicio externo | Inferencia verificada antes de la salida, plan B y video real |
| Confusión con identificación biológica | Mostrar categorías visuales, nunca taxonomía como verdad |
| Sobrecarga del MVP | Congelar alcance; sin cuentas, social ni rutas |
| Seguridad física/ambiental | Aviso en la app: no tocar fauna, no recolectar, no salir de senderos ni acercarse al borde del agua |
| Acceso y reglas del parque | Consultar horarios y restricciones de fotografía antes de la prueba |

## 13. Entregables

- Aplicación web móvil / PWA desplegada y demostrable.
- Servicio de inferencia con SigLIP2.
- Repositorio público con README reproducible, créditos y licencias (modelo, dependencias, fotos de prueba).
- Informe breve de la Fase 0 (resultados del modelo, umbrales).
- Evidencia de la prueba en exterior (video/fotos sin datos personales innecesarios) y reflexión: aciertos, errores, límites.
- Guion de demo: premisa Touch Grass → repo y modelo abierto → expedición en el móvil → guardar teléfono y caminar → fotografiar un hallazgo y mostrar el resultado de IA → repetir con 1–2 hallazgos → resumen final → observaciones reales.

## 14. Decisiones abiertas

| # | Pregunta | Propuesta por defecto | Bloquea |
|---|---|---|---|
| D1 | ¿Demo solo web móvil/PWA? | Sí | Fase 1 |
| D2 | Teléfono objetivo de pruebas | Por definir | Fase 3 |
| D3 | Servicio concreto de inferencia y capacidad | Por definir | Fase 2 |
| D4 | Categorías visuales que funcionan con fotos de Villahermosa | Se decide en Fase 0 | Congelar misiones |
| D5 | Similitud, clasificación calibrada o verificación manual | Similitud con umbrales + manual etiquetada | Fase 2 |
| D6 | Idioma(s) de la demo | Por definir (sugerido: español, textos localizables) | Fase 1 |
| D7 | Fecha límite del reto semanal | Por confirmar | Plan |

## 15. Roadmap posterior al MVP

1. Expediciones para otros parques y duraciones.
2. Más misiones visuales con validación probada.
3. Bitácora personal de naturaleza.
4. Descripciones breves con modelo multimodal abierto (SmolVLM2).
5. Reconocimiento acústico opcional con licencia compatible.
6. Modo offline tras evaluar viabilidad en móviles.
7. Mapas y rutas seguras con datos geográficos verificados.
8. Herramientas para comunidad y educación.

## 16. Referencias

- Hacktoberfest: https://hacktoberfest.com/
- SigLIP2: https://huggingface.co/google/siglip2-base-patch16-256
- SmolVLM2: https://huggingface.co/models?search=SmolVLM2
- Transformers: https://huggingface.co/docs/transformers/
- Next.js: https://nextjs.org/
- MapLibre GL JS: https://maplibre.org/ · OpenStreetMap: https://www.openstreetmap.org/ · Valhalla: https://github.com/valhalla/valhalla

Disponibilidad, licencias y condiciones deben revisarse antes de publicar.

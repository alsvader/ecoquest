# EcoQuest — Propuesta de proyecto para Hacktoberfest 2026

> **Concepto:** *The Real World Is Your Playground.*  
> **Contexto:** reto semanal **Touch Grass** de Hacktoberfest 2026.  
> **Ubicación inicial:** Villahermosa, Tabasco, México.  
> **Estado:** propuesta de producto y evaluación preliminar; no es una especificación cerrada ni se ha implementado.

## 1. Resumen ejecutivo

**EcoQuest** es una aplicación que transforma una caminata al aire libre en una pequeña expedición. La persona elige una misión, guarda el teléfono, explora su entorno y toma fotografías de algunos hallazgos. Un modelo de inteligencia artificial de pesos abiertos analiza las fotografías para estimar si cumplen los objetivos. Al terminar recibe un registro sencillo de sus descubrimientos.

La propuesta prioriza la **experiencia fuera de la pantalla**: la interfaz debería ocupar el menor tiempo posible y la mayor parte de la experiencia suceder caminando, observando y escuchando.

**Recomendación:** construir primero una experiencia limitada, demostrable y verificable en un parque de Villahermosa, con tres misiones y análisis visual mediante IA abierta. Evitar mapas complejos, reconocimiento exacto de especies, clasificaciones competitivas y funciones sociales durante el MVP.

## 2. Reglas y lectura del reto

Tema proporcionado por el organizador:

> **Touch Grass:** Build something with open-weight models or open-source AI that gets people off the screen and into the world.

El proyecto puede usar modelos open-weight, herramientas de IA open-source, inferencia local o una combinación. El componente abierto debe ser central para que la aplicación funcione. Entre las actividades admitidas se citan senderismo, jardinería, observación de aves y clubes de corredores. Se valora que el tiempo mirando la pantalla sea mínimo y que se pruebe el proyecto al aire libre y se documente la experiencia.

### Consecuencias para el producto

1. El usuario debe salir y realizar una actividad física u observacional auténtica.
2. La IA no puede ser un adorno: debe participar en la validación o interpretación de descubrimientos.
3. El flujo debe tener pocas interacciones con el teléfono.
4. La demostración debe incluir una salida real con evidencia de lo ocurrido.
5. Conviene publicar el código, documentar el componente abierto utilizado y revisar licencias y términos de cada modelo o dataset.

**Nota:** estos son criterios de diseño derivados del enunciado compartido, no una rúbrica oficial del organizador.

## 3. Oportunidad local: Villahermosa, Tabasco

Villahermosa cuenta con parques, vegetación tropical, lagunas y espacios de recreación que permiten validar actividades relacionadas con exploración, biodiversidad y caminatas.

| Lugar | Posible uso en el prototipo | Consideración |
|---|---|---|
| Parque Tomás Garrido Canabal / entorno de Laguna de las Ilusiones | Misiones de hojas, flores, árboles y observación | Permanecer en senderos y áreas permitidas; no acercarse indebidamente a fauna ni al borde de cuerpos de agua |
| Parque La Choca | Caminata, retos cortos y rutas | Adecuado para experiencias de movimiento |
| Yumka’ | Exploración y aprendizaje ambiental | Consultar acceso, horarios y reglas antes de planear pruebas |
| Parque Museo La Venta | Combinación de naturaleza y patrimonio cultural | Respetar reglamento y posibles restricciones de acceso/fotografía |

**Primera localización recomendada:** Parque Tomás Garrido Canabal, por permitir una demostración de expedición corta con elementos vegetales visibles. Esta selección no supone garantía de presencia de una especie específica.

**Factores contextuales:** clima caluroso y húmedo, posibles lluvias intensas, senderos mojados y condiciones variables de seguridad/acceso. Las expediciones no deben animar a entrar en zonas restringidas, tocar especies desconocidas o acercarse a fauna silvestre.

## 4. Alternativas consideradas

### 4.1 EcoQuest — Exploración gamificada

- **Actividad:** salir al parque y completar misiones visuales.
- **IA:** clasificación por similitud de imágenes y, opcionalmente, breves descripciones.
- **MVP:** seleccionar expedición, tres retos, fotografía, evaluación visual, progreso y recapitulación.
- **Fortalezas:** conexión directa con Touch Grass; demo atractiva; potencial de evolución.
- **Riesgos:** falsos positivos y validación imperfecta de las fotos.

### 4.2 BirdTab — Identificación de aves por sonido

- **Actividad:** caminar, escuchar y grabar aves.
- **IA:** modelo acústico especializado como BirdNET.
- **MVP:** grabación corta, inferencia, confianza y bitácora.
- **Fortalezas:** pantalla mínima; IA especializada; potencial offline.
- **Riesgos:** ruido ambiental, distribución/localización de especies, integración móvil y licencia de modelo.

### 4.3 VerdeRuta — Caminatas con rutas más verdes

- **Actividad:** descubrir recorridos con sombra, vegetación y puntos naturales.
- **IA:** comprensión de preferencias del usuario mediante modelo abierto; enrutamiento con datos geográficos abiertos.
- **MVP:** tres recorridos previamente verificados y recomendaciones.
- **Fortalezas:** utilidad urbana real.
- **Riesgos:** cobertura/calidad de datos sobre sombra y ambiente, complejidad de rutas y seguridad.

### 4.4 FloraTab — Reconocimiento de flora

- **Actividad:** fotografiar y registrar plantas.
- **IA:** clasificación visual con SigLIP2 u otro modelo adecuado.
- **MVP:** foto, categoría tentativa, álbum de hallazgos.
- **Fortalezas:** enfoque simple de implementar y mostrar.
- **Riesgos:** clasificación taxonómica específica no confiable con un modelo genérico.

### 4.5 AFK Adventures — Retos fuera de pantalla

- **Actividad:** completar actividades cortas sin usar el teléfono continuamente.
- **IA:** generación personalizada de retos con modelo lingüístico abierto.
- **MVP:** retos, temporizador, evidencia fotográfica.
- **Fortalezas:** excelente alineación temática y menor tiempo de implementación.
- **Riesgos:** la IA podría terminar siendo secundaria si los retos son plantillas estáticas.

### 4.6 EcoAcción — Microacciones ambientales

- **Actividad:** actividades ambientales seguras y documentación de observaciones.
- **IA:** categorización visual y ayuda para organizar evidencias.
- **MVP:** misiones, fotos y bitácora.
- **Fortalezas:** impacto ambiental potencial.
- **Riesgos:** no puede verificarse una limpieza completa mediante una simple comparación de dos fotos; cuestiones de seguridad al manipular residuos.

## 5. Matriz de decisión

Se usó una matriz **heurística**, basada en estimaciones de producto, no en una evaluación oficial. Escala de 1 (bajo) a 5 (alto):

- Alineación con Touch Grass: **25 %**.
- Participación esencial de IA abierta: **25 %**.
- Originalidad/diferenciación: **20 %**.
- Facilidad de lograr un MVP: **20 %**.
- Facilidad de demostración local: **10 %**.

| Proyecto | Touch Grass | IA abierta | Originalidad | MVP | Demo local | Puntuación ponderada | Horas tentativas |
|---|---:|---:|---:|---:|---:|---:|---:|
| EcoQuest | 5 | 5 | 5 | 4 | 5 | **4.80/5** | 16–25 h |
| AFK Adventures | 5 | 4 | 4 | 5 | 5 | **4.45/5** | 12–20 h |
| BirdTab | 5 | 5 | 3 | 3 | 5 | **4.20/5** | 22–35 h |
| FloraTab | 5 | 4 | 3 | 4 | 5 | **4.15/5** | 16–28 h |
| EcoAcción | 5 | 4 | 4 | 3 | 4 | **4.05/5** | 20–32 h |
| VerdeRuta | 5 | 4 | 4 | 2 | 4 | **3.85/5** | 28–45 h |

**Importante:** las horas suponen una persona con experiencia en React/Next.js que reutiliza librerías y modelos existentes; no comprenden entrenamiento de modelos propios, publicación en tiendas, ensayos extensos en dispositivos o generación de un producto de producción.

### Fundamento de la elección

**Por qué EcoQuest:**

- La IA visual es parte esencial para interpretar la evidencia de los retos.
- La experiencia resulta fácil de explicar en un video corto.
- Tiene variedad de posibles misiones sin exigir un mapa complejo desde el primer día.
- Puede probarse con una salida real en Villahermosa.
- Une los aspectos más atractivos de FloraTab (descubrimiento visual) y AFK Adventures (poco tiempo de pantalla).

**Compromisos:** EcoQuest no es necesariamente la propuesta más rápida (AFK Adventures lo es) ni la más específica en inferencia offline (BirdTab puede destacar allí). Es la opción más equilibrada para el alcance propuesto.

## 6. Visión de producto

### Nombre de trabajo

**EcoQuest**  
**Tagline:** *The Real World Is Your Playground.*

### Problema

Muchas experiencias digitales recompensan permanecer frente a una pantalla. EcoQuest busca convertir el uso del teléfono en un disparador de actividades breves de exploración de entornos naturales cercanos.

### Público objetivo inicial

Personas con smartphone que quieran salir a caminar, descubrir su entorno y hacer pequeñas actividades, incluso si no tienen experiencia en observación de naturaleza.

### Propuesta de valor

> Abre la app, elige una aventura, guarda el teléfono y descubre algo real. Usa IA abierta para interpretar tus hallazgos, no para mantenerte mirando la pantalla.

### Principios de UX

1. **Screen-last:** pocas pantallas, poca escritura y pocos pasos.
2. **Explora antes de capturar:** evitar que la misión se convierta en una sesión de fotos constante.
3. **Curiosidad sobre exactitud absoluta:** reconocer cuándo la IA no está segura.
4. **Seguridad y respeto ambiental:** no tocar fauna, no recolectar especímenes ni salir de zonas permitidas.
5. **Privacidad por defecto:** minimizar datos personales, no exigir cuenta ni ubicación precisa para el MVP.

## 7. Recorrido principal del usuario

1. **Elegir expedición:** abrir la app y seleccionar una aventura corta (por ejemplo 20 minutos).
2. **Recibir objetivos:** mostrar tres hallazgos visuales sencillos y una indicación de seguridad.
3. **Comenzar:** guardar el teléfono, caminar y observar.
4. **Documentar hallazgo:** tomar una fotografía únicamente al identificar algo potencialmente relevante.
5. **Interpretar con IA:** evaluar qué tan compatible es la foto con la categoría del reto.
6. **Registrar resultado:** si la confianza es baja, pedir otra foto o permitir revisión manual señalada como no verificada.
7. **Terminar:** mostrar hallazgos, tiempo declarado/en sesión e insignia de expedición.

La aplicación no necesita comprobar automáticamente que la persona caminó una distancia determinada. Evitar afirmaciones no sustentadas por sensores o evidencias.

## 8. Expedición piloto: «Descubre el Edén»

**Lugar sugerido:** Parque Tomás Garrido Canabal.  
**Duración objetivo:** aproximadamente 20 minutos.  
**Número de misiones:** tres.

| Misión | Evidencia | Validación inicial |
|---|---|---|
| Encuentra una hoja de gran tamaño | Foto de la hoja | Comparación con categorías visuales; no inferir tamaño físico exacto de una sola foto |
| Descubre una flor y registra sus colores | Foto de flor | Detectar correspondencia aproximada con categoría flor; describir colores solo cuando sean visibles |
| Encuentra un árbol con raíces visibles | Foto de raíces/árbol | Evaluación visual tentativa; se puede solicitar confirmación manual |

Se recomienda comenzar con categorías objetivamente distinguibles (por ejemplo «flor visible», «hojas», «tronco/raíces») y reformular cualquier misión que el modelo no valide de forma fiable en pruebas reales.

**No se pide recolectar, tocar, arrancar ni acercarse a elementos peligrosos.**

## 9. Modelo de IA y papel central del componente abierto

### Alternativa principal: SigLIP2

Modelo de representación imagen-texto que permite comparar una fotografía con descripciones candidatas. El MVP podría tener categorías previamente seleccionadas (flor, hoja, raíces, agua, etc.) y calcular puntuaciones de similitud.

- **Ventaja:** adecuado para clasificación visual de categorías amplias.
- **Límite:** una puntuación de similitud no equivale a probabilidad calibrada ni a verificación absoluta.
- **Decisión pendiente:** benchmark en fotografías reales del parque y elección de umbrales operativos.

Referencia: https://huggingface.co/google/siglip2-base-patch16-256

### Alternativa o extensión: SmolVLM2

Modelo multimodal pequeño para generar descripciones cortas de hallazgos, siempre que las pruebas demuestren calidad suficiente. No conviene sumarlo al MVP si aumenta innecesariamente complejidad y latencia.

Referencia general: https://huggingface.co/models?search=SmolVLM2

### Consideraciones de integración

- Para el MVP se puede servir inferencia en Python mediante Transformers.
- **Open-weight no significa automáticamente offline:** la inferencia en servidor sigue cumpliendo el objetivo de utilizar un modelo abierto, aunque necesite conexión.
- La inferencia completamente local sería una mejora opcional que requiere revisar formatos compatibles y capacidad de los teléfonos objetivo.
- Registrar el nombre exacto, versión y licencia de los pesos, así como las licencias de dependencias.
- No usar un modelo lingüístico propietario como núcleo decisivo del proyecto si la intención es cumplir inequívocamente las reglas de IA abierta.

## 10. Propuesta técnica inicial

| Área | Elección provisional | Motivo |
|---|---|---|
| Interfaz | Next.js + TypeScript | Velocidad de desarrollo y experiencia previa |
| UI | Tailwind CSS + shadcn/ui | Componentes accesibles y consistencia visual |
| Cámara | API de captura web / input de imagen | Flujo directo en móvil |
| Inferencia | Python + Transformers + SigLIP2 | Modelo abierto con backend controlado |
| Estado local | IndexedDB | Persistencia sin registro obligatorio |
| Mapas (futuro) | MapLibre + OpenStreetMap | Mapas y datos geográficos abiertos |
| Rutas (futuro) | Valhalla | Enrutamiento abierto, no necesario para MVP |
| Despliegue web | Vercel (frontend) | Compartir demo rápido |
| Servicio de modelos | Infraestructura separada compatible con el runtime | Evitar asumir que inferencia pesada cabe en funciones web convencionales |
| Código fuente | Repositorio público GitHub | Permitir evaluar implementación y aportes |

### Flujo simplificado

```text
Usuario en el parque
    |
    v
Web móvil / PWA (expedición, misiones, cámara)
    |
    v
API de clasificación visual
    |
    v
SigLIP2 (pesos abiertos)
    |
    v
Categorías sugeridas + similitudes
    |
    v
Reglas de misión + estado de verificación
    |
    v
Progreso y resumen guardados localmente
```

Para privacidad, permitir borrar fotos y no guardarlas en un servidor más tiempo del necesario. Si se utilizan servicios externos de inferencia durante el prototipo, declararlo claramente.

## 11. Alcance del MVP

### Imprescindible

- [ ] Pantalla de bienvenida y explicación de la expedición.
- [ ] Una expedición llamada «Descubre el Edén».
- [ ] Tres misiones predefinidas.
- [ ] Captura/subida de foto desde móvil.
- [ ] Inferencia con modelo de pesos abiertos.
- [ ] Resultado comprensible: coincidencia tentativa, incertidumbre o reintento.
- [ ] Progreso de misiones y finalización.
- [ ] Resumen simple de descubrimientos.
- [ ] Repositorio con README, instrucciones reproducibles y créditos/licencias.
- [ ] Una prueba documentada en exterior.

### Fuera del MVP

- Cuentas y autenticación.
- Competencias, rankings y recompensas monetizables.
- Generación ilimitada de misiones con IA.
- Reconocimiento preciso de especies.
- Rutas peatonales calculadas automáticamente.
- Reconocimiento de audio de aves.
- Inferencia offline garantizada.
- Publicación en App Store o Play Store.

## 12. Plan de implementación y validación

### Fase 0: viabilidad de la IA

1. Seleccionar tres categorías visuales.
2. Reunir fotografías de prueba con derechos de uso claros, idealmente tomadas por el equipo.
3. Probar SigLIP2 y comparar resultados frente a casos negativos y ambiguos.
4. Medir latencia, tamaño de imágenes, memoria y errores.
5. Ajustar categorías y condiciones de éxito.

**Criterio de salida:** el sistema distingue de forma razonablemente útil los hallazgos de la demo; si no, reducir alcance o cambiar el tipo de misiones.

### Fase 1: flujo de expedición

Construir selección, misiones, progreso y resumen, con resultados simulados durante desarrollo.

### Fase 2: cámara + inferencia real

Integrar captura, servicio de clasificación, manejo de errores y comunicación clara de incertidumbre.

### Fase 3: prueba en Villahermosa

Realizar una expedición breve al aire libre. Registrar qué ocurrió, dónde falló la app, cuántos pasos de interfaz se necesitaron y cuánto duró la actividad.

### Fase 4: empaquetar entrega

Publicar README, instrucciones de instalación, descripción del uso de IA abierta, imágenes o video de demo (sin datos personales innecesarios), limitaciones conocidas y retroalimentación real.

## 13. Riesgos y mitigaciones

| Riesgo | Consecuencia | Mitigación |
|---|---|---|
| Falsos positivos del modelo | Misiones se marcan incorrectamente | Evaluar categorías acotadas; umbrales probados; estado «no confirmado» |
| Falsos negativos | Frustración del usuario | Reintento y revisión manual claramente etiquetada |
| Latencia de inferencia | Se alarga el tiempo frente a pantalla | Reducir imagen, minimizar peticiones y medir rendimiento |
| Falta de conectividad | No se validan fotos | Permitir guardar evidencia pendiente y sincronizar después, si alcanza el tiempo |
| Calor, lluvia o terreno inseguro | Mala experiencia o exposición a riesgos | Actividades breves, flexibles y en áreas públicas accesibles |
| Dependencia de servicio externo | Demo inestable | Entorno de inferencia verificable, plan de contingencia y video real |
| Confusión con identificación biológica | Afirmaciones falsas sobre especies | Presentar categorías visuales, no nombres taxonómicos como verdad |
| Sobrecarga del MVP | Entrega incompleta | Congelar alcance y evitar cuentas, social y rutas complejas |

## 14. Métricas de éxito

El objetivo de una demo no es simular un estudio científico, sino obtener evidencia honesta de uso:

- Una expedición terminada en un entorno exterior real.
- Tres misiones intentadas, con registro del resultado de cada una.
- Captura e inferencia de fotografías con el modelo abierto.
- Registro de errores y casos de incertidumbre.
- Conteo de acciones necesarias en pantalla durante la salida.
- Valoración cualitativa: ¿la app motivó a observar más el entorno o distrajo?

No afirmar que se midió «tiempo real fuera de pantalla» si no se implementaron sensores o un método consistente para ello.

## 15. Guion de demo

1. Mostrar el reto Touch Grass y la premisa de EcoQuest.
2. Enseñar el repositorio y nombrar explícitamente el modelo abierto.
3. Abrir la expedición en el móvil.
4. Guardar el teléfono y caminar por el parque.
5. Encontrar un elemento natural, fotografiarlo y mostrar el resultado de IA.
6. Repetir con uno o dos hallazgos.
7. Mostrar el resumen final.
8. Compartir observaciones reales: aciertos, errores, límites y posibles mejoras.

La grabación debe centrarse en la actividad fuera de pantalla, no únicamente en una captura de la interfaz.

## 16. Ruta de evolución

1. Expediciones para distintos parques y duraciones.
2. Nuevas misiones visuales con validación probada.
3. Bitácora personal de naturaleza.
4. Descripciones visuales breves con un modelo multimodal abierto.
5. Reconocimiento acústico opcional con un modelo apropiado y licencia compatible.
6. Modo offline tras evaluar viabilidad en móviles.
7. Mapas/rutas seguras una vez verificados datos de geolocalización.
8. Herramientas para comunidad y actividades educativas.

## 17. Decisiones pendientes antes de diseñar o codificar

- ¿La primera demo será exclusivamente web móvil/PWA?
- ¿Cuál es el teléfono objetivo para las pruebas?
- ¿Cuál será el servicio concreto de inferencia y su capacidad?
- ¿Qué categorías visuales funcionan realmente con fotos de Villahermosa?
- ¿Se usarán puntuaciones de similitud, clasificación calibrada o verificación manual?
- ¿Qué idioma(s) tendrá la demo: español, inglés o ambos?
- ¿Cuál es la fecha límite específica de entrega del reto semanal?

**Siguiente paso recomendado:** validar el modelo con 15–30 imágenes variadas antes de definir el diseño visual. Después, congelar las tres misiones y pasar a un pequeño documento de requisitos funcionales.

## 18. Referencias técnicas y contextuales

Estos enlaces son puntos de partida para documentación y verificación; disponibilidad, licencias y condiciones deben revisarse antes de publicar:

- Hacktoberfest: https://hacktoberfest.com/
- SigLIP2: https://huggingface.co/google/siglip2-base-patch16-256
- Modelos SmolVLM2: https://huggingface.co/models?search=SmolVLM2
- BirdNET Analyzer: https://github.com/kahst/BirdNET-Analyzer
- OpenStreetMap: https://www.openstreetmap.org/
- MapLibre GL JS: https://maplibre.org/
- Valhalla: https://github.com/valhalla/valhalla
- Next.js: https://nextjs.org/
- Transformers: https://huggingface.co/docs/transformers/

---

**Conclusión:** EcoQuest tiene una relación sólida entre reto, entorno local y componente de IA abierta. La mejor forma de diferenciarlo no será añadir más funcionalidades, sino mostrar una expedición real, breve y agradable, con un modelo abierto que aporta valor medible y con límites reconocidos.

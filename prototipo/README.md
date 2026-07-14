# Prototipo jugable — «Guardianes del Control»

Demostración del concepto del juego de entrenamiento en Gestión de Controles Críticos
(guía ICMM 2026). Los 4 capítulos están **compilados en una sola aplicación** (`app.html`)
con un menú principal (hub) desde el cual se navega a cualquier capítulo. Cada uno usa una
técnica de comunicación distinta:

- **Capítulo A — Fundamentos y planificación** (Pasos 1–2).
  Simulación de **narrativa ramificada** (árbol de decisiones): cada elección abre un
  camino distinto, con consecuencias diferidas y tres desenlaces.
- **Capítulo B — La Sala de Controles Críticos** (Pasos 3–4).
  **Escape room**: para salir de una sala sellada hay que resolver candados con mecánicas
  de *manipulación* (no de alternativas): armar el bowtie clasificando controles, filtrar
  los controles críticos, completar la definición con fichas y abrir la puerta con un
  teclado numérico usando el código revelado.
- **Capítulo C — Centro de Operaciones** (Pasos 5–6).
  **Simulación de gestión (dashboard)**: emparejar cada control crítico con su dueño en el
  nivel correcto, fijar con deslizadores la frecuencia de verificación de cada uno, y luego
  un **turno en vivo** donde hay que responder a las alertas a tiempo para mantener los
  medidores en verde.
- **Capítulo D — Recorrida de Terreno** (Pasos 7–9).
  **Simulador de inspección en primera persona**: visitar estaciones y, en cada una,
  *observar* tocando puntos de la escena y preguntando al trabajador, emitir un *veredicto*
  (Efectivo/Degradado/Ausente) según la evidencia y elegir la *respuesta* correcta (jerarquía
  del Paso 9); al final se envía el *reporte* de verificación (Paso 8).

Cada capítulo usa una **técnica de comunicación distinta** a propósito (narrativa
ramificada · escape room · simulación dashboard · inspección en terreno) para mostrar
variedad de recursos de aprendizaje. Con los cuatro se cubre el proceso completo de 9 pasos.

## Cómo probarlo

**App unificada (recomendado):** abre `app.html` en cualquier navegador (doble clic;
funciona offline, sin servidor). Muestra el menú principal con el perfil del jugador
(nivel, XP total, insignias) y una tarjeta por capítulo con su estado (No iniciado / En
progreso / Completado). Al tocar una tarjeta se juega ese capítulo; el botón 🏠 del HUD
regresa al menú en cualquier momento, y el progreso de cada capítulo se conserva.

`app.standalone.html` / `app.artifact.html`: la misma app unificada empaquetada en un
único archivo autocontenido (sin scripts externos), para hosting público o publicar como
Artifact.

**Capítulos individuales** (para desarrollo o pruebas aisladas): `index.html` (A),
`capitulo-b.html` (B), `capitulo-c.html` (C), `capitulo-d.html` (D) — cada uno arranca
directo en su portada, sin pasar por el menú. Sus versiones `*.standalone.html` /
`*.artifact.html` son también autocontenidas.

Diseñado en formato vertical de teléfono; en escritorio se muestra dentro de un marco
tipo móvil.

## Qué demuestra

- **Un solo shell, cuatro motores:** `app.html` carga los 4 pares contenido+motor
  (`capitulo-X.contenido.js` / `motor-X.js`) más `hub.js`. Cada motor ya no se autoejecuta:
  expone `window.MotorX.iniciar(onHome)`, y el hub lo invoca al elegir un capítulo, pasándole
  una función de retorno para volver al menú. Así los 4 capítulos comparten el mismo `#app`
  y `#hud` sin pisarse.
- **Progreso y perfil agregados:** el hub lee el `localStorage` de cada capítulo (cada uno
  guarda su propio estado bajo su clave) para mostrar el nivel/XP total del jugador, cuántos
  capítulos están completados y la vitrina de insignias ganadas — sin unificar el esquema de
  guardado de cada capítulo, solo agregando su lectura.
- **Narrativa ramificada (Cap. A):** cada opción puede llevar a una escena o pregunta
  distinta; hay **consecuencias diferidas** (p. ej. descuidar el liderazgo en el Paso 1
  cambia el desenlace más adelante) y **tres finales distintos**. El campo `siguiente` de
  cada opción admite una función que decide el camino según banderas acumuladas.
- **Arquitectura de contenido desacoplado** (§7 del GDD): el contenido de cada capítulo vive
  en su propio archivo `capitulo-X.contenido.js` como grafo de nodos editable por el
  diseñador instruccional, separado del motor que lo interpreta.
- **Estética de juego móvil:** portada cinematográfica por capítulo, avatar ilustrado de la
  Ing. Rivas con rostro visible, HUD con nivel/XP y puntaje animados, ilustraciones SVG,
  confeti y medallas al completar. Toda la gráfica es **SVG incrustado** (sin recursos
  externos).

## Contenido cubierto (ICMM 2026)

| Paso | Capítulo | Mecánica |
|---|---|---|
| 1 · Planificar el proceso | A | Decisiones ramificadas: patrocinio, equipo, alcance |
| 2 · Identificar MUEs | A | Selección de eventos por consecuencia vs. frecuencia |
| 3 · Identificar controles | B | Clasificar controles en el bowtie (preventivo/mitigador) |
| 4 · Seleccionar controles críticos | B | Filtrar candidatos hasta aislar los 3 críticos |
| 5 · Definir desempeño y reporte | C | Fijar frecuencia de verificación con deslizadores |
| 6 · Asignar responsabilidades | C | Emparejar cada control con su dueño de línea |
| 7 · Verificación en terreno | D | Observar hotspots + emitir veredicto por estación |
| 8 · Reporte del desempeño | D | Consolidar y enviar el reporte de la recorrida |
| 9 · Respuesta ante desempeño inadecuado | D | Elegir la respuesta correcta según jerarquía |

## Nota

Es un prototipo de validación de concepto en web. El producto final se construiría en
**Flutter** (iOS primero, Android después) reutilizando este mismo formato JSON de
contenido y el patrón hub + motores intercambiables. Ver
`../docs/GDD-guardianes-de-controles-criticos.md` y `../docs/plan-de-trabajo-mvp.md`.

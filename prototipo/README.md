# Prototipo jugable — «Guardianes del Control»

Demostración del concepto del juego de entrenamiento en Gestión de Controles Críticos
(guía ICMM 2026). Dos capítulos jugables, cada uno con una técnica de comunicación
distinta:

- **Capítulo A — Fundamentos y planificación** (Pasos 1–2): `index.html`.
  Simulación de **narrativa ramificada** (árbol de decisiones): cada elección abre un
  camino distinto, con consecuencias diferidas y tres desenlaces.
- **Capítulo B — La Sala de Controles Críticos** (Pasos 3–4): `capitulo-b.html`.
  **Escape room**: para salir de una sala sellada hay que resolver candados con mecánicas
  de *manipulación* (no de alternativas): armar el bowtie clasificando controles, filtrar
  los controles críticos, completar la definición con fichas y abrir la puerta con un
  teclado numérico usando el código revelado.
- **Capítulo C — Centro de Operaciones** (Pasos 5–6): `capitulo-c.html`.
  **Simulación de gestión (dashboard)**: emparejar cada control crítico con su dueño en el
  nivel correcto, fijar con deslizadores la frecuencia de verificación de cada uno, y luego
  un **turno en vivo** donde hay que responder a las alertas a tiempo para mantener los
  medidores en verde.
- **Capítulo D — Recorrida de Terreno** (Pasos 7–9): `capitulo-d.html`.
  **Simulador de inspección en primera persona**: visitar estaciones y, en cada una,
  *observar* tocando puntos de la escena y preguntando al trabajador, emitir un *veredicto*
  (Efectivo/Degradado/Ausente) según la evidencia y elegir la *respuesta* correcta (jerarquía
  del Paso 9); al final se envía el *reporte* de verificación (Paso 8).

Cada capítulo usa una **técnica de comunicación distinta** a propósito (narrativa
ramificada · escape room · simulación dashboard · inspección en terreno) para mostrar
variedad de recursos de aprendizaje. Con los cuatro se cubre el proceso completo de 9 pasos.

## Cómo probarlo

Abre `index.html` (A), `capitulo-b.html` (B), `capitulo-c.html` (C) o `capitulo-d.html` (D)
en cualquier navegador (doble clic; funciona offline, sin servidor). Diseñado en formato
vertical de teléfono; en escritorio se muestra dentro de un marco tipo móvil.

Versiones `*.standalone.html`: un solo archivo autocontenido de cada capítulo, para
hosting público / abrir en incógnito.

## Qué demuestra

- **Narrativa ramificada (árbol de decisiones):** cada opción puede llevar a una escena o
  pregunta distinta. En el Paso 1, elegir «con patrocinio» o «sin patrocinio» abre caminos
  diferentes con preguntas propias, y hay **consecuencias diferidas**: descuidar el
  liderazgo temprano cambia el desenlace más adelante. El capítulo tiene **tres finales
  distintos** (éxito / correcto pero cuesta arriba / fallo). En el contenido, el campo
  `siguiente` de cada opción define su camino, y puede ser una función que decide según las
  banderas acumuladas (`estado.banderas`).
- **Arquitectura de contenido desacoplado** (§7 del GDD): el contenido narrativo vive en
  `capitulo-a.contenido.js` como un grafo de nodos editable por el diseñador instruccional;
  `motor.js` lo interpreta. Se puede cambiar el guion o el árbol sin tocar el motor.
- **Estética de juego móvil:** portada cinematográfica, avatar ilustrado de la Ing. Rivas
  con rostro visible, HUD con nivel/XP y puntaje animados, ilustraciones SVG por escena,
  iconos en el minijuego de MUEs, y pantallas de desenlace con confeti, escudo y medalla.
  Toda la gráfica es **SVG incrustado** (nítida, liviana, sin recursos externos).
- **Mecánicas del GDD**: decisiones con consecuencias, retroalimentación formativa de la
  mentora, minijuego de identificar MUEs (Paso 2), el «Indicador de Seguridad de la Mina»
  como puntuación, insignia por competencia y guardado automático (offline, `localStorage`).

## Contenido cubierto (ICMM 2026)

| Paso | En el juego |
|---|---|
| 1 · Planificar el proceso | Asegurar patrocinio del liderazgo, formar equipo con la primera línea, definir alcance |
| 2 · Identificar MUEs | Distinguir Eventos No Deseados Materiales (potencial catastrófico) de riesgos frecuentes de baja consecuencia; priorizar por consecuencia |

## Nota

Es un prototipo de validación de concepto en web. El producto final se construiría en
**Flutter** (iOS primero, Android después) reutilizando este mismo formato JSON de
contenido. Ver `../docs/GDD-guardianes-de-controles-criticos.md` y
`../docs/plan-de-trabajo-mvp.md`.

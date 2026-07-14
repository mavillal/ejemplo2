# Prototipo jugable — Capítulo A

Demostración del concepto de «Guardianes del Control», el juego de entrenamiento en
Gestión de Controles Críticos (guía ICMM 2026). Este prototipo implementa el
**Capítulo A — Fundamentos y planificación** (Pasos 1 y 2 del proceso CCM).

## Cómo probarlo

Abre `index.html` en cualquier navegador (doble clic; funciona offline, sin servidor).
Está diseñado en formato vertical de teléfono; en escritorio se muestra dentro de un
marco tipo móvil.

## Qué demuestra

- **Arquitectura de contenido desacoplado** (§7 del GDD): el contenido narrativo vive en
  `capitulo-a.contenido.js` como un grafo de nodos editable por el diseñador instruccional;
  `motor.js` lo interpreta. Se puede cambiar el guion sin tocar el código del motor.
- **Mecánicas del GDD**: decisiones con consecuencias, retroalimentación formativa de la
  mentora (Ing. Rivas), el minijuego de identificar MUEs (Paso 2), evaluación de cierre,
  el «Indicador de Seguridad de la Mina» como puntuación, insignia por competencia y
  guardado automático (offline-first, vía `localStorage`).

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

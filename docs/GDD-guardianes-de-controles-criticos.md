# Documento de Diseño de Juego (GDD)
# «Guardianes del Control» — Juego móvil de entrenamiento en Gestión de Controles Críticos (ICMM 2026)

**Versión:** 0.1 (borrador para aprobación)
**Fecha:** 14 de julio de 2026
**Base de contenido:** ICMM *Critical Control Management: Good Practice Guide*, edición 2026

---

## 1. Visión del producto

Un juego móvil **híbrido de narrativa + microlearning** que enseña a profesionales de
seguridad y salud en el trabajo (SST) y a supervisores de primera línea el proceso de
9 pasos de la Gestión de Controles Críticos (CCM) de la guía ICMM 2026, mediante:

- Una **campaña narrativa por capítulos**: el jugador asume el rol de responsable de
  CCM en una operación minera virtual («Mina Cerro Alto») y avanza por los 9 pasos
  tomando decisiones con consecuencias visibles.
- Un **modo de práctica diaria** tipo microlearning: sesiones de 3–5 minutos con
  repetición espaciada, rachas y desafíos, para consolidar la retención a largo plazo.

**Objetivo de aprendizaje central:** que al terminar la campaña el jugador sea capaz de
explicar y aplicar el proceso CCM completo — desde identificar Eventos No Deseados
Materiales (MUEs) hasta responder ante el desempeño inadecuado de un control crítico —
y distinga con claridad un *control crítico* de un control ordinario.

## 2. Audiencia e idioma

| Perfil | Rol en el juego | Ruta |
|---|---|---|
| Profesionales SST | Diseñan e implementan el proceso CCM | Ruta «Estratega» (9 capítulos completos) |
| Supervisores de línea | Verifican controles en terreno y responden a desviaciones | Ruta «Terreno» (énfasis en pasos 7, 8 y 9) |

- Idioma del MVP: **español latinoamericano neutro**. Arquitectura preparada para
  localización posterior (strings externalizados desde el día 1).
- Contexto de uso: turnos mineros, conectividad intermitente → el juego debe funcionar
  **offline** y sincronizar progreso cuando haya red.

## 3. Contenido: mapeo de la guía ICMM 2026 a capítulos

La campaña sigue las 3 fases y los 9 pasos de la guía. Cada capítulo = un paso, con
una mecánica principal propia para evitar monotonía.

### Fase I — Planificación (Capítulos 1–4)
1. **Planificar el proceso** — Mecánica: construcción de equipo y gobernanza. El jugador
   asigna roles, define alcance y consigue el compromiso del liderazgo (diálogos con la
   gerencia; si no asegura patrocinio, los capítulos posteriores se vuelven más difíciles —
   enseña la lección 2026 sobre liderazgo y gobernanza).
2. **Identificar MUEs** — Mecánica: análisis de la mina virtual. Entre decenas de riesgos,
   el jugador debe distinguir los eventos de alta consecuencia (caída de rocas, incendio de
   correa, interacción vehículo-persona…) de los riesgos frecuentes pero no materiales.
   Es el capítulo pivote: un MUE mal identificado genera consecuencias en capítulos futuros.
3. **Identificar controles** — Mecánica: armado del *bowtie* interactivo. Arrastrar controles
   preventivos y mitigadores a su lugar en el diagrama causa–evento–consecuencia.
4. **Seleccionar controles críticos** — Mecánica: filtro con presupuesto limitado. Aplicar los
   criterios de criticidad de la guía; elegir demasiados controles como «críticos» diluye el
   sistema (lección clave de la edición 2026).

### Fase II — Implementación (Capítulos 5–7)
5. **Definir desempeño y reporte** — Mecánica: redactar objetivos de desempeño verificables.
   Minijuego de «afinar el estándar»: distinguir criterios medibles de enunciados vagos.
6. **Asignar responsabilidades** — Mecánica: matriz de dueños. Asignar dueños de control en
   el nivel correcto de la organización; consecuencias si el dueño no tiene autoridad real.
7. **Implementación en el sitio** — Mecánica: gestión de despliegue con preparación
   operacional (herramienta nueva de la edición 2026): capacitar cuadrillas, adaptar
   estándares corporativos a la realidad del sitio, gestionar resistencia al cambio.

### Fase III — Retroalimentación continua (Capítulos 8–9)
8. **Verificación y reporte** — Mecánica: recorridas de terreno en primera persona
   (escenas ilustradas de la mina). El jugador ejecuta verificaciones de campo: observa,
   pregunta a los trabajadores (diálogos), revisa registros y decide si el control está
   efectivo, degradado o ausente. Corazón de la ruta «Terreno».
9. **Respuesta al desempeño inadecuado** — Mecánica: sala de crisis. Ante controles fallidos
   el jugador decide: ¿detener la tarea? ¿escalar? ¿investigar? Simulación con presión de
   producción para enseñar la jerarquía correcta de respuesta.

**Épilogo — Madurez:** autoevaluación con la herramienta de madurez CCM 2026; desbloquea
el modo «Nueva partida+» con una mina más compleja.

## 4. Mecánicas transversales y sistema de juego

### 4.1 Núcleo de decisiones narrativas
- Escenas con diálogo ramificado y decisiones de 2–4 opciones. Sin respuestas
  «obviamente correctas»: opciones plausibles con matices, como en la realidad.
- **Consecuencias diferidas:** malas decisiones tempranas (p. ej. MUE mal priorizado en el
  cap. 2) reaparecen como incidentes o cuasi-accidentes en capítulos posteriores. Esto
  materializa el mensaje de la guía: los errores de planificación se pagan en operación.
- **Retroalimentación formativa inmediata:** tras cada decisión, un mentor (personaje
  «Ing. Rivas», veterana de CCM) explica el porqué con referencia al paso de la guía.

### 4.2 Microlearning y retención (modo «Práctica diaria»)
- Sesiones de 3–5 min: tarjetas de repaso, casos exprés, «encuentra el control crítico
  en la foto», verdadero/falso con justificación.
- **Repetición espaciada** (algoritmo tipo SM-2 simplificado): los conceptos fallados
  vuelven antes; los dominados se espacian.
- Rachas diarias con «protector de racha» (buena práctica móvil: perdonar 1 día evita
  abandono por frustración).

### 4.3 Progresión y economía del juego
- **XP y niveles de carrera:** de «Analista de riesgos» a «Guardián de Controles Críticos».
- **Insignias por competencia** (no cosméticas al azar): una por cada paso dominado —
  sirven además como evidencia de aprendizaje para el empleador.
- **Indicador de Seguridad de la Mina:** métrica visible de la salud del sistema CCM de la
  mina virtual; sube o baja según las decisiones. Es la «puntuación» principal.
- Sin compras dentro de la app ni economía monetizada: producto de formación.

### 4.4 Evaluación del aprendizaje
- Evaluación diagnóstica opcional al inicio (calibra dificultad).
- Cada capítulo termina con un caso integrador puntuado (aprobación ≥ 80 %, reintentos
  ilimitados con variación de preguntas).
- Certificado de finalización descargable/compartible (PDF) al completar la campaña.

## 5. Mejores prácticas de diseño móvil aplicadas

1. **Sesiones cortas e interrumpibles:** todo nodo de juego se completa en < 5 min y se
   puede abandonar sin perder progreso (guardado automático continuo).
2. **Offline-first:** todo el contenido del MVP empaquetado en la app; sincronización de
   progreso en segundo plano. Crítico para faenas con mala señal.
3. **Ergonomía de una mano y modo vertical:** UI en orientación *portrait*, acciones
   principales en la zona del pulgar, tipografía mínima 16 pt (usuarios con guantes fuera,
   pero a menudo en descansos con poca luz).
4. **Onboarding jugando:** nada de tutoriales de texto; el capítulo 1 ES el tutorial.
5. **Accesibilidad:** contraste WCAG AA, textos escalables, sin dependencia exclusiva del
   color, subtítulos en toda escena con audio, apto para lectores de pantalla en menús.
6. **Notificaciones respetuosas:** un recordatorio diario configurable, ligado a la racha;
   jamás más de uno al día, con opción de silenciar por turnos.
7. **Rendimiento y peso:** objetivo < 150 MB de descarga inicial (importante en Latam con
   planes de datos limitados); arte 2D ilustrado, no 3D.
8. **Privacidad:** datos de progreso mínimos, cumplimiento de leyes de protección de datos
   de Latam (LGPD Brasil, Ley 1581 Colombia, etc.); sin publicidad ni trackers de terceros.

## 6. Dirección de arte y audio

- Estilo: **ilustración 2D plana con paleta industrial** (ocres, naranjas de alta
  visibilidad, azul corporativo) — legible, económica de producir y culturalmente neutra
  para Latam.
- Personajes recurrentes: la mentora Ing. Rivas, el superintendente escéptico, la operadora
  de camión, el gerente presionado por producción — arquetipos que encarnan las tensiones
  reales del CCM.
- Audio: efectos de UI sutiles + ambiente de mina en escenas de terreno. Todo el juego es
  100 % jugable en silencio (uso en salas de espera/campamentos).

## 7. Arquitectura técnica

**Decisión: Flutter** (una base de código → iOS y Android). Justificación: la instrucción
de negocio es «lo más fácil de distribuir a trabajadores en Latam», donde Android domina
(~85 % de cuota); iOS se publica primero según el pedido original, y Android sigue con el
mismo binario lógico sin re-desarrollo.

| Capa | Tecnología | Nota |
|---|---|---|
| App | Flutter 3.x / Dart | iOS 15+ y Android 8+ |
| Estado | Riverpod | Simple y testeable |
| Motor narrativo | Grafo de nodos en JSON + intérprete propio | El contenido se edita sin recompilar |
| Persistencia local | SQLite (drift) | Progreso offline |
| Backend (mínimo) | Firebase (Auth anónima + Firestore + Analytics) | Solo sincronización y métricas de aprendizaje |
| Distribución | App Store + TestFlight; Google Play (fase 2) | Descarga gratuita |
| CI/CD | GitHub Actions + Fastlane | Builds y despliegue a TestFlight automatizados |

**Formato de contenido desacoplado:** capítulos, diálogos y bancos de preguntas viven en
archivos JSON/YAML versionados en el repositorio, editables por el diseñador instruccional
sin tocar código. Esto permite actualizar el contenido si ICMM revisa la guía.

## 8. Métricas de éxito (MVP)

| Métrica | Objetivo |
|---|---|
| Finalización del capítulo 1 | ≥ 70 % de quienes instalan |
| Finalización de la campaña MVP | ≥ 40 % |
| Retención D7 | ≥ 25 % |
| Puntaje pre/post (evaluación de conocimiento) | Mejora ≥ 30 % |
| Calificación de utilidad percibida (encuesta in-app) | ≥ 4/5 |

## 9. Riesgos principales

| Riesgo | Mitigación |
|---|---|
| Derechos de contenido: la guía es de ICMM | El juego enseña el proceso con escenarios propios; no reproduce texto de la guía. Solicitar a ICMM autorización/aval formal en paralelo (buena oportunidad de partnership). |
| Contenido técnico impreciso | Revisión de cada capítulo por experto SST en minería antes de producción. |
| Baja adopción por trabajadores | Piloto con una faena aliada; diseño de rutas cortas para supervisores; distribución vía áreas de capacitación de las empresas. |
| Alcance se infla | MVP estricto (ver plan de trabajo); backlog congelado durante producción. |

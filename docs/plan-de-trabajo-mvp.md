# Plan de trabajo — MVP «Guardianes del Control» (16 semanas)

**Alcance del MVP:** campaña jugable que cubre el proceso completo de 9 pasos de la guía
ICMM 2026 condensado en **4 capítulos** + modo de práctica diaria básico + ruta corta
para supervisores. iOS primero (TestFlight → App Store), Android preparado.

- Capítulo A «Fundamentos y planificación» → pasos 1–2 (planificar, identificar MUEs)
- Capítulo B «Del bowtie al control crítico» → pasos 3–4
- Capítulo C «Hacerlo realidad» → pasos 5–7 (desempeño, dueños, implementación en sitio)
- Capítulo D «Verificar y responder» → pasos 8–9 (núcleo de la ruta supervisores)

## Equipo (mínimo viable)

| Rol | Dedicación |
|---|---|
| Desarrollador/a Flutter (líder técnico) | 100 % |
| Diseñador/a instruccional con dominio de la guía ICMM (guionista de contenido) | 100 % |
| Diseñador/a UX/UI e ilustración 2D | 50 % |
| Experto/a SST minería (revisor técnico) | ~4 h/semana |
| QA + coordinación (puede ser el product owner) | 25 % |

## Cronograma

### Fase 0 — Fundaciones (Semanas 1–2)
- Adquirir y estudiar la guía ICMM 2026 oficial (descarga en icmm.com); matriz de
  objetivos de aprendizaje por paso y por audiencia (SST vs. supervisor).
- Contactar a ICMM para autorización/aval del uso del marco.
- Definir identidad visual, wireframes de las 6 pantallas núcleo, y esquema JSON del
  motor narrativo.
- Setup técnico: repo, proyecto Flutter, CI con GitHub Actions, cuenta Apple Developer,
  Firebase.
- **Hito S2:** GDD aprobado + guía de estilo + esqueleto de app compilando en iPhone.

### Fase 1 — Núcleo jugable (Semanas 3–6)
- Motor narrativo: intérprete de nodos (diálogo, decisión, consecuencia diferida,
  minijuego, evaluación), guardado automático, sistema de XP/insignias.
- Guion completo del Capítulo A + banco inicial de 60 preguntas de práctica.
- Ilustraciones de personajes y 4 escenarios de la mina virtual.
- **Hito S6 (vertical slice):** Capítulo A jugable de punta a punta en TestFlight interno.
  *Criterio go/no-go: 5 usuarios de prueba lo completan sin ayuda y entienden qué es un MUE.*

### Fase 2 — Contenido y modo práctica (Semanas 7–11)
- Guiones y producción de Capítulos B, C y D (uno por ~1,5 semanas, en paralelo con
  revisión del experto SST).
- Minijuegos: bowtie interactivo (Cap. B), verificación de terreno (Cap. D).
- Modo práctica diaria con repetición espaciada + rachas + notificación diaria.
- Ruta «Terreno» para supervisores (selección de rol al inicio; atajo hacia Cap. D).
- **Hito S11:** contenido completo congelado (content freeze); banco de ≥ 150 preguntas.

### Fase 3 — Piloto y pulido (Semanas 12–14)
- Piloto cerrado vía TestFlight con 20–40 usuarios reales (profesionales SST y
  supervisores de al menos una operación aliada), evaluación pre/post de conocimiento.
- Corrección de errores, ajuste de dificultad, accesibilidad (WCAG AA), rendimiento y
  tamaño de descarga (< 150 MB).
- Textos legales: privacidad, términos, ficha de App Store en español.
- **Hito S14:** métricas del piloto revisadas contra objetivos del GDD (§8).

### Fase 4 — Lanzamiento iOS (Semanas 15–16)
- Candidate build, revisión de App Store (colchón de ~1 semana para rechazos),
  material de la ficha (capturas, video de 30 s).
- Certificado de finalización (PDF) y encuesta de utilidad in-app.
- **Hito S16: publicación en App Store.** Retrospectiva y decisión sobre fase Android.

## Post-MVP (backlog priorizado, no incluido en las 16 semanas)
1. Lanzamiento en Google Play (esfuerzo bajo: ~2–3 semanas de QA Android).
2. Expansión a 9 capítulos completos (uno por paso) + «Nueva partida+».
3. Panel para empleadores: progreso agregado de sus equipos (requiere backend mayor).
4. Versión en inglés y portugués (Brasil).
5. Integración LMS (xAPI/SCORM) para áreas de capacitación corporativa.

## Presupuesto estimado (orden de magnitud, 16 semanas)

| Concepto | Estimación (USD) |
|---|---|
| Equipo (según tabla de roles) | 55 000 – 85 000 |
| Ilustración/arte adicional por encargo | 4 000 – 8 000 |
| Cuentas y servicios (Apple Developer, Firebase, herramientas) | < 1 000 |
| Piloto (incentivos, viáticos si hay visita a faena) | 1 000 – 3 000 |
| **Total** | **~61 000 – 97 000** |

## Cadencia de gestión
- Sprints de 2 semanas alineados con los hitos; demo jugable al final de cada sprint.
- Revisión de contenido con el experto SST cada sprint (nada llega a producción sin su visto bueno).
- Tablero único de backlog; el alcance del MVP se congela al final de la Fase 0 —
  toda idea nueva va al backlog post-MVP.

/*
 * Contenido del Capítulo C — "Centro de Operaciones"
 * Pasos 5 y 6 del proceso CCM de la guía ICMM 2026:
 *   Paso 5 — Definir desempeño y reporte (estándar + verificación de cada control)
 *   Paso 6 — Asignar responsabilidades (dueños de control en el nivel correcto)
 *
 * Técnica de comunicación: SIMULACIÓN DE GESTIÓN (dashboard). Mecánicas:
 *   asignar  — emparejar cada control crítico con su dueño (nivel correcto)
 *   estandar — fijar con deslizadores la frecuencia de verificación de cada control
 *   turno    — simulación en vivo: responder alertas y mantener los controles en verde
 * Tipos de nodo: portada | escena | asignar | estandar | turno | final
 */
window.CAPITULO_C = {
  id: "cap-c",
  titulo: "Guardianes del Control",
  subtitulo: "Capítulo C · Centro de Operaciones",
  inicio: "portada",
  indicadorInicial: 65,

  personajes: { rivas: { nombre: "Ing. Rivas", rol: "Mentora en Controles Críticos" } },

  nodos: {
    portada: {
      tipo: "portada",
      titulo: "Centro de Operaciones",
      subtitulo: "Capítulo C · Estándares de desempeño y dueños",
      capitulo: "Pasos 5 y 6 · Guía ICMM 2026",
      persona: "rivas",
      dialogo:
        "Ya tienes los controles críticos. Ahora hay que hacerlos VIVIR en la operación: " +
        "cada uno necesita un dueño responsable y un estándar verificable. Después lo " +
        "pondremos a prueba en un turno real. Bienvenid@ al tablero.",
      boton: "Abrir el tablero",
      siguiente: "intro"
    },

    intro: {
      tipo: "escena",
      ilustracion: "centro",
      titulo: "El tablero de Cerro Alto",
      cuerpo:
        "Tus 3 controles críticos ya están en el panel: Segregación física, Sensores de " +
        "proximidad y Plan de respuesta. Un control sin dueño ni estándar es solo una " +
        "buena intención.\n\nPrimero: ¿quién responde por cada uno?",
      persona: "rivas",
      dialogo: "Paso 6: asignar dueños. La clave es el NIVEL correcto: alguien de la línea con autoridad.",
      siguiente: "paso6_intro"
    },

    // ================= PASO 6 · ASIGNAR DUEÑOS =================
    paso6_intro: {
      tipo: "escena",
      ilustracion: "org",
      titulo: "El dueño correcto",
      cuerpo:
        "El dueño de un control crítico debe estar en el nivel con AUTORIDAD para " +
        "garantizarlo y recursos para mantenerlo. No es quien ejecuta la tarea ni quien " +
        "solo asesora: es quien responde por su desempeño.",
      persona: "rivas",
      dialogo: "Toca un control, luego su dueño. Ojo con los distractores: ejecutar o asesorar no es ser dueño.",
      siguiente: "asignar_duenos"
    },

    asignar_duenos: {
      tipo: "asignar",
      titulo: "Asigna los dueños",
      controles: [
        { id: "seg", t: "Segregación física peatón–vehículo", dueno: "super",
          ok: "El Superintendente de Operaciones controla el layout y las reglas de tránsito: tiene la autoridad." },
        { id: "sen", t: "Sensores de proximidad con alerta", dueno: "mant",
          ok: "El Jefe de Mantenimiento responde por el sistema técnico y su calibración." },
        { id: "resp", t: "Plan de respuesta y rescate", dueno: "emerg",
          ok: "El Jefe de Respuesta a Emergencias es dueño del plan y de los simulacros." }
      ],
      duenos: [
        { id: "super", nombre: "Superint. de Operaciones", nivel: "Línea · con autoridad" },
        { id: "mant", nombre: "Jefe de Mantenimiento", nivel: "Línea · técnico" },
        { id: "emerg", nombre: "Jefe de Respuesta a Emergencias", nivel: "Línea · emergencias" },
        { id: "oper", nombre: "Operador de camión", nivel: "Ejecuta la tarea" },
        { id: "analista", nombre: "Analista de Seguridad", nivel: "Asesora · sin autoridad de línea" }
      ],
      motivoMal:
        "Ese no es el dueño adecuado. El operador ejecuta y el analista asesora, pero el " +
        "dueño debe estar en la línea, con autoridad y recursos para garantizar el control.",
      exito: "Cada control crítico tiene un dueño con autoridad real. Así se sostiene la rendición de cuentas.",
      siguiente: "paso5_intro"
    },

    // ================= PASO 5 · ESTÁNDARES DE VERIFICACIÓN =================
    paso5_intro: {
      tipo: "escena",
      ilustracion: "medidor",
      titulo: "El estándar de desempeño",
      cuerpo:
        "Cada control crítico necesita un estándar VERIFICABLE: qué se mide y CADA CUÁNTO " +
        "se comprueba. Demasiado espaciado, no detecta fallas a tiempo; demasiado " +
        "frecuente, se vuelve insostenible.\n\nFija la frecuencia de verificación de cada control.",
      persona: "rivas",
      dialogo: "Mueve cada deslizador a la frecuencia correcta según el tipo de control.",
      siguiente: "set_estandares"
    },

    set_estandares: {
      tipo: "estandar",
      titulo: "Fija los estándares de verificación",
      escala: ["Cada turno", "Semanal", "Mensual", "Trimestral", "Anual"],
      controles: [
        { id: "sen", t: "Sensores de proximidad", target: 0,
          nota: "Prueba funcional CADA TURNO: un sensor tecnológico puede fallar en cualquier momento." },
        { id: "seg", t: "Segregación física (barreras)", target: 2,
          nota: "Inspección MENSUAL: una barrera física se degrada lento; verificar su integridad periódicamente." },
        { id: "resp", t: "Plan de respuesta y rescate", target: 3,
          nota: "Simulacro TRIMESTRAL: probar la respuesta con la frecuencia suficiente para mantener la destreza." }
      ],
      exito: "Estándares definidos y verificables. Ahora cada control tiene un pulso medible.",
      siguiente: "turno_intro"
    },

    // ================= SIMULACIÓN DE TURNO =================
    turno_intro: {
      tipo: "escena",
      ilustracion: "centro",
      titulo: "Prueba de turno",
      cuerpo:
        "Todo configurado. Ahora la prueba real: un turno de operación. Los controles se " +
        "monitorean en vivo y aparecerán ALERTAS (verificación vencida o desviación). " +
        "Responde a tiempo para mantenerlos en verde.\n\n" +
        "Si una alerta se ignora, el control cae en rojo: un evento a punto de escapar.",
      persona: "rivas",
      dialogo: "Toca «Responder» en cada alerta antes de que se agote el tiempo. ¡Cuida tu turno!",
      siguiente: "turno"
    },

    turno: {
      tipo: "turno",
      titulo: "Turno en curso",
      duracionSeg: 26,
      controles: [
        { id: "seg", t: "Segregación física", dueno: "Superint. Operaciones" },
        { id: "sen", t: "Sensores de proximidad", dueno: "Jefe Mantenimiento" },
        { id: "resp", t: "Plan de respuesta", dueno: "Jefe Emergencias" }
      ],
      alertas: [
        "Verificación de turno vencida",
        "Desviación detectada",
        "Reporte de desempeño pendiente",
        "Prueba funcional fuera de rango"
      ],
      siguiente: "final"
    },

    // ------------------------------------------------------------ FINAL
    final: {
      tipo: "final",
      variante: "exito",
      ilustracion: "centro",
      titulo: "¡Turno superado!",
      cuerpo:
        "Cerraste el ciclo: cada control crítico tiene dueño, estándar verificable y " +
        "respondió en operación real. Cerro Alto ya no solo sabe cuáles controles importan: " +
        "los mantiene vivos.\n\nCon esto completas la implementación (Pasos 5–6). Lo que " +
        "sigue es el Paso 7–9: verificación en terreno, reporte y respuesta ante desempeño " +
        "inadecuado — el corazón de la ruta de supervisores.",
      persona: "rivas",
      dialogo:
        "Esto es gestión de controles críticos de verdad: no un documento, sino un sistema " +
        "vivo con dueños y pulso. Excelente turno, Guardián.",
      insignia: "Gestor del Tablero",
      umbralAprobacion: 0
    }
  }
};

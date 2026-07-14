/*
 * Contenido del Capítulo D — "Recorrida de Terreno"
 * Pasos 7, 8 y 9 del proceso CCM de la guía ICMM 2026:
 *   Paso 7 — Verificación en terreno de los controles críticos
 *   Paso 8 — Reporte del desempeño
 *   Paso 9 — Respuesta ante desempeño inadecuado de un control crítico
 *
 * Técnica de comunicación: SIMULADOR DE INSPECCIÓN EN PRIMERA PERSONA. En cada
 * estación: observar (tocar puntos de la escena + preguntar al trabajador) →
 * emitir veredicto (Efectivo/Degradado/Ausente) → elegir la respuesta correcta.
 * Tipos de nodo: portada | escena | inspeccion | reporte | final
 */
window.CAPITULO_D = {
  id: "cap-d",
  titulo: "Guardianes del Control",
  subtitulo: "Capítulo D · Recorrida de Terreno",
  inicio: "portada",
  indicadorInicial: 70,

  personajes: { rivas: { nombre: "Ing. Rivas", rol: "Mentora en Controles Críticos" } },

  nodos: {
    portada: {
      tipo: "portada",
      titulo: "Recorrida de Terreno",
      subtitulo: "Capítulo D · Verificación, reporte y respuesta",
      capitulo: "Pasos 7–9 · Guía ICMM 2026",
      persona: "rivas",
      dialogo:
        "Los controles críticos ya están definidos y con dueños. Ahora lo más importante: " +
        "¿funcionan en el terreno? Vas a hacer una recorrida de verificación. Observa con " +
        "ojo crítico, pregunta al trabajador y decide. Aquí se salvan vidas.",
      boton: "Salir a terreno",
      siguiente: "intro"
    },

    intro: {
      tipo: "escena",
      ilustracion: "terreno",
      titulo: "Turno de verificación",
      cuerpo:
        "Un control crítico «en el papel» no sirve si en terreno está degradado o ausente. " +
        "Vas a visitar 3 estaciones. En cada una: OBSERVA (toca los puntos y pregunta al " +
        "trabajador), emite tu VEREDICTO y, si algo falla, define la RESPUESTA.\n\n" +
        "Recuerda la jerarquía del Paso 9: ante un control crítico fallido sobre un riesgo " +
        "mortal activo, primero se controla la exposición (detener/aislar), luego se escala.",
      persona: "rivas",
      dialogo: "No te apures en el veredicto: primero reúne la evidencia. Toca todo lo que puedas observar.",
      siguiente: "est_barrera"
    },

    // =================== ESTACIÓN 1 · BARRERA PEATONAL ===================
    est_barrera: {
      tipo: "inspeccion",
      estacion: 1, total: 3,
      ilustracion: "barrera",
      titulo: "Estación 1 · Barrera peatonal",
      control: "Segregación física peatón–vehículo",
      hotspots: [
        { x: 20, y: 46, etq: "Tramo de barrera", hallazgo: "Falta un tramo de ~3 m de barrera: quedó una abertura hacia la vía de acarreo, sin reponer.", clave: true },
        { x: 72, y: 30, etq: "Tarjeta de inspección", hallazgo: "Última inspección hace 4 meses. El estándar es MENSUAL: la verificación está vencida.", clave: true },
        { x: 46, y: 72, etq: "Señalización", hallazgo: "La señal de pasillo peatonal está presente y visible." },
        { x: 86, y: 58, etq: "Preguntar al trabajador", hallazgo: "«Sacaron la barrera para pasar maquinaria la semana pasada… y no la devolvieron.»", clave: true }
      ],
      veredictoOk: "degradado",
      vExplic:
        "El control existe pero NO cumple su estándar: hay una abertura sin reponer y la " +
        "verificación está vencida. Es un control crítico DEGRADADO.",
      respuestas: [
        { id: "detener", label: "Aislar/detener el tránsito en la zona y escalar al dueño (Superint.)" },
        { id: "registrar", label: "Solo registrar la observación para la revisión mensual" },
        { id: "ignorar", label: "Continuar: hay señalización, es suficiente" }
      ],
      respuestaOk: "detener",
      rExplic:
        "Un control crítico degradado sobre una interacción camión–persona ACTIVA exige actuar " +
        "ya: controlar la exposición (aislar/detener) y escalar al dueño. Registrar sin controlar " +
        "deja el riesgo mortal vivo.",
      siguiente: "est_sensor"
    },

    // =================== ESTACIÓN 2 · SENSOR DE PROXIMIDAD ===============
    est_sensor: {
      tipo: "inspeccion",
      estacion: 2, total: 3,
      ilustracion: "sensor",
      titulo: "Estación 2 · Sensor de proximidad",
      control: "Sensores de proximidad con alerta al operador",
      hotspots: [
        { x: 68, y: 40, etq: "Panel del sensor", hallazgo: "Luz de falla ámbar encendida: «sensor trasero sin señal». La detección posterior no está operativa.", clave: true },
        { x: 24, y: 62, etq: "Registro de prueba", hallazgo: "Prueba funcional de este turno: NO realizada. El estándar es cada turno.", clave: true },
        { x: 50, y: 30, etq: "Preguntar al operador", hallazgo: "«El pito de alerta no sonó en toda la mañana; pensé que estaba en silencio.»", clave: true },
        { x: 82, y: 72, etq: "Cabina", hallazgo: "Cabina ordenada y con buena visibilidad frontal." }
      ],
      veredictoOk: "ausente",
      vExplic:
        "El sensor trasero no tiene señal y la alerta no funciona: el control crítico NO está " +
        "cumpliendo su función de detección. A efectos prácticos, está AUSENTE.",
      respuestas: [
        { id: "detener", label: "Sacar el camión de servicio hasta reparar y escalar a Mantenimiento" },
        { id: "registrar", label: "Anotar para el próximo mantenimiento programado y seguir operando" },
        { id: "manual", label: "Pedir al operador que 'tenga más cuidado' y continuar" }
      ],
      respuestaOk: "detener",
      rExplic:
        "Un camión de acarreo sin detección de proximidad operativa, cerca de personas, es un MUE " +
        "sin control: fuera de servicio hasta reparar y escalar al dueño (Jefe de Mantenimiento). " +
        "Confiar en el 'cuidado' del operador NO es un control crítico.",
      siguiente: "est_emergencia"
    },

    // =================== ESTACIÓN 3 · RESPUESTA A EMERGENCIAS ============
    est_emergencia: {
      tipo: "inspeccion",
      estacion: 3, total: 3,
      ilustracion: "emergencia",
      titulo: "Estación 3 · Punto de respuesta",
      control: "Plan de respuesta a emergencias y rescate",
      hotspots: [
        { x: 24, y: 44, etq: "Kit de rescate", hallazgo: "Camilla y kit de rescate presentes, completos y con vigencia al día." },
        { x: 72, y: 38, etq: "Registro de simulacro", hallazgo: "Último simulacro hace 2 meses. El estándar es trimestral: dentro de norma." },
        { x: 48, y: 70, etq: "Comunicación", hallazgo: "Canal de emergencia probado hoy: OK. Punto de encuentro señalizado." },
        { x: 84, y: 60, etq: "Preguntar al trabajador", hallazgo: "«El equipo sabe el punto de encuentro y a quién llamar; hicimos el simulacro hace poco.»" }
      ],
      veredictoOk: "efectivo",
      vExplic:
        "Todo cumple el estándar: equipo vigente, simulacro dentro de plazo y comunicación probada. " +
        "El control crítico está EFECTIVO. (No toda verificación encuentra una falla.)",
      respuestas: [
        { id: "registrar", label: "Registrar 'conforme' y reportar el desempeño al dueño" },
        { id: "detener", label: "Detener igualmente por precaución" },
        { id: "nada", label: "No registrar nada: está todo bien" }
      ],
      respuestaOk: "registrar",
      rExplic:
        "Un control efectivo también se REPORTA (Paso 8): registrar 'conforme' deja evidencia del " +
        "buen desempeño y alimenta el sistema. 'No registrar nada' rompe la cadena de verificación.",
      siguiente: "reporte"
    },

    // =================== PASO 8 · REPORTE ===================
    reporte: {
      tipo: "reporte",
      titulo: "Reporte de verificación",
      cuerpo:
        "Consolidaste la recorrida. Este es el reporte que se envía al dueño de cada control " +
        "y al liderazgo (Paso 8): la verificación no termina hasta que se reporta.",
      boton: "Enviar reporte",
      siguiente: "final"
    },

    final: {
      tipo: "final",
      variante: "exito",
      ilustracion: "terreno",
      titulo: "¡Recorrida completada!",
      cuerpo:
        "Verificaste en terreno, distinguiste controles efectivos de los degradados/ausentes, " +
        "respondiste según la jerarquía correcta y reportaste. Con esto cierras el ciclo completo " +
        "de la Gestión de Controles Críticos: de planificar (Cap. A) a responder en operación (Cap. D).\n\n" +
        "Cerro Alto ya no tiene controles críticos «de papel»: los mantiene vivos, los verifica y " +
        "actúa cuando fallan. Eso salva vidas.",
      persona: "rivas",
      dialogo:
        "Esto es lo que separa un sistema real de uno decorativo: gente que sale a terreno, mira " +
        "con ojo crítico y actúa. Te ganaste el título, Guardián del Control.",
      insignia: "Guardián del Control",
      umbralAprobacion: 0
    }
  }
};

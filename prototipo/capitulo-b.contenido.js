/*
 * Contenido del Capítulo B — "Escape: La Sala de Controles Críticos"
 * Pasos 3 y 4 del proceso CCM de la guía ICMM 2026:
 *   Paso 3 — Identificar controles (construir el bowtie)
 *   Paso 4 — Seleccionar los controles críticos
 *
 * A diferencia del Capítulo A (decisiones), aquí las mecánicas son de MANIPULACIÓN
 * estilo ESCAPE ROOM: clasificar, filtrar, ensamblar y un teclado final. No hay
 * preguntas de alternativas. El motor (motor-b.js) interpreta estos tipos de nodo:
 *   portada | escena | sorteo | filtro | codigo | teclado | final
 */
window.CAPITULO_B = {
  id: "cap-b",
  titulo: "Guardianes del Control",
  subtitulo: "Capítulo B · La Sala de Controles Críticos",
  inicio: "portada",
  indicadorInicial: 60,

  personajes: {
    rivas: { nombre: "Ing. Rivas", rol: "Mentora en Controles Críticos" }
  },

  nodos: {
    // -------------------------------------------------------- PORTADA
    portada: {
      tipo: "portada",
      titulo: "Escape: Controles Críticos",
      subtitulo: "Capítulo B · Del bowtie al control crítico",
      capitulo: "Pasos 3 y 4 · Guía ICMM 2026",
      persona: "rivas",
      dialogo:
        "Tras el cuasi-accidente, la Sala de Control quedó sellada. Para salir tendrás " +
        "que reconstruir el sistema de controles críticos y descubrir el código de la " +
        "puerta. Nada de responder alternativas: aquí se trabaja con las manos.",
      boton: "Entrar a la sala",
      siguiente: "intro"
    },

    // ---------------------------------------------------------- INTRO
    intro: {
      tipo: "escena",
      ilustracion: "sala",
      titulo: "Sala de Control · sellada",
      cuerpo:
        "La puerta blindada muestra un teclado de 3 dígitos. En la pared, tres candados " +
        "esperan: el bowtie, el filtro de criticidad y la definición. Resuelve cada uno " +
        "para revelar un dígito del código.\n\n" +
        "El evento a controlar es el mismo de Cerro Alto: «un camión de acarreo impacta " +
        "a una persona a pie».",
      persona: "rivas",
      dialogo:
        "Recuerda el Paso 3: primero identificamos los controles y dónde actúan. Empecemos " +
        "por el bowtie.",
      siguiente: "paso3_intro"
    },

    // ================= PASO 3 · CANDADO 1: ARMAR EL BOWTIE =================
    paso3_intro: {
      tipo: "escena",
      ilustracion: "bowtie",
      titulo: "El diagrama de corbatín (bowtie)",
      cuerpo:
        "El bowtie coloca el EVENTO en el centro. A la izquierda, los controles " +
        "PREVENTIVOS (evitan que ocurra). A la derecha, los MITIGADORES (reducen el daño " +
        "si ya ocurrió).\n\nClasifica cada control en su lado correcto.",
      persona: "rivas",
      dialogo: "Toca un control y luego el lado donde actúa. Si te equivocas, lo puedes mover.",
      siguiente: "lock_bowtie"
    },

    lock_bowtie: {
      tipo: "sorteo",
      candado: 1,
      titulo: "Candado 1 · Arma el bowtie",
      evento: "Camión de acarreo impacta a persona a pie",
      zonas: [
        { id: "prev", nombre: "Preventivo", sub: "antes del evento", color: "#2DD4BF" },
        { id: "mit", nombre: "Mitigador", sub: "después del evento", color: "#9B7BFF" }
      ],
      cartas: [
        { t: "Segregación física peatón–vehículo (barreras)", z: "prev" },
        { t: "Sensores de proximidad con alerta al operador", z: "prev" },
        { t: "Inspección de frenos antes de cada turno", z: "prev" },
        { t: "Gestión de fatiga del operador", z: "prev" },
        { t: "Plan de respuesta a emergencias y rescate", z: "mit" },
        { t: "Atención médica en faena y evacuación", z: "mit" }
      ],
      digito: "4",
      pistaDigito: "Cuenta los controles PREVENTIVOS que colocaste: ese es el dígito.",
      exito:
        "¡Bowtie armado! 4 controles preventivos evitan el evento y 2 mitigadores reducen " +
        "el daño. El candado revela el dígito.",
      error:
        "Aún hay controles del lado equivocado. Pregúntate: ¿este control evita el impacto " +
        "(preventivo) o reduce el daño una vez ocurrido (mitigador)?",
      siguiente: "paso4_intro"
    },

    // ============= PASO 4 · CANDADO 2: FILTRO DE CRITICIDAD =============
    paso4_intro: {
      tipo: "escena",
      ilustracion: "filtro",
      titulo: "¿Cuáles son CRÍTICOS?",
      cuerpo:
        "No todos los controles son críticos. Según la guía 2026, un control CRÍTICO " +
        "previene o mitiga un evento de consecuencia catastrófica, es específico, fiable y " +
        "VERIFICABLE. Los avisos, charlas y EPP ayudan, pero no son críticos.\n\n" +
        "El panel tiene 3 ranuras. Encuentra los 3 controles críticos.",
      persona: "rivas",
      dialogo:
        "Cuidado: elegir demasiados 'críticos' diluye el sistema. Toca un control para " +
        "pasarlo por el filtro; si no cumple, el filtro te dirá por qué.",
      siguiente: "lock_criticos"
    },

    lock_criticos: {
      tipo: "filtro",
      candado: 2,
      titulo: "Candado 2 · Filtro de criticidad",
      ranuras: 3,
      candidatos: [
        { t: "Segregación física peatón–vehículo", critico: true,
          motivo: "Barrera física de alta fiabilidad y verificable: previene el evento mortal. CRÍTICO." },
        { t: "Sensores de proximidad con alerta al operador", critico: true,
          motivo: "Detección con estándar medible (distancia/alerta) y verificable. CRÍTICO." },
        { t: "Plan de respuesta y rescate", critico: true,
          motivo: "Mitiga la consecuencia catastrófica; verificable con simulacros. CRÍTICO." },
        { t: "Cartel «Precaución: tránsito de camiones»", critico: false,
          motivo: "Control administrativo de baja fiabilidad: no detiene al camión. No es crítico." },
        { t: "Charla de seguridad semanal", critico: false,
          motivo: "Refuerza la cultura, pero depende del comportamiento. No es un control crítico." },
        { t: "Chaleco reflectante del trabajador", critico: false,
          motivo: "EPP: última barrera; no evita el impacto de un camión. No es crítico." }
      ],
      digito: "3",
      pistaDigito: "El número de ranuras que llenaste es el dígito.",
      exito:
        "3 controles críticos aislados. Pocos, específicos y verificables: así se blinda el " +
        "evento sin diluir el sistema.",
      siguiente: "paso4_estandar"
    },

    // ============= PASO 4 · CANDADO 3: COMPLETAR LA DEFINICIÓN =============
    paso4_estandar: {
      tipo: "escena",
      ilustracion: "bowtie",
      titulo: "Sella la definición",
      cuerpo:
        "Último candado: completa la definición de un control crítico arrastrando las " +
        "palabras correctas a los huecos. Esto fija el criterio para todo el sistema.",
      persona: "rivas",
      dialogo: "Toca la ficha correcta para cada hueco. Si te equivocas, tócalo de nuevo para vaciarlo.",
      siguiente: "lock_estandar"
    },

    lock_estandar: {
      tipo: "codigo",
      candado: 3,
      titulo: "Candado 3 · La definición",
      // La frase se arma intercalando texto fijo y huecos (uno por respuesta).
      frase: [
        "Un control es CRÍTICO cuando ",
        { hueco: 0 },
        " un evento de consecuencia ",
        { hueco: 1 },
        " y su desempeño es ",
        { hueco: 2 },
        "."
      ],
      respuestas: ["previene o mitiga", "catastrófica", "verificable"],
      fichas: ["catastrófica", "verificable", "previene o mitiga", "económico", "frecuente", "opcional"],
      digito: "1",
      pistaDigito: "Un solo criterio bien definido: el dígito es 1.",
      exito:
        "Definición sellada. Prevenir/mitigar + consecuencia catastrófica + verificable: ese " +
        "es el corazón del Paso 4.",
      error: "La definición aún no calza. Revisa: ¿qué hace, sobre qué evento y qué exige medir?",
      siguiente: "puerta"
    },

    // =================== TECLADO FINAL: ABRIR LA PUERTA ===================
    puerta: {
      tipo: "teclado",
      titulo: "La puerta blindada",
      cuerpo: "Ingresa el código de 3 dígitos que revelaste en los candados.",
      codigo: "431",
      exito: "Código correcto. La puerta se abre.",
      error: "Código incorrecto. Revisa los dígitos de los tres candados.",
      siguiente: "final"
    },

    // ------------------------------------------------------------ FINAL
    final: {
      tipo: "final",
      variante: "exito",
      ilustracion: "puerta",
      titulo: "¡Escapaste!",
      cuerpo:
        "Reconstruiste el bowtie, aislaste los 3 controles críticos y sellaste la " +
        "definición. La Sala de Control se abre: Cerro Alto ya sabe qué controles no " +
        "pueden fallar.\n\nEn el Capítulo C definirás el estándar de desempeño de cada " +
        "control crítico y asignarás a sus dueños (Pasos 5–6).",
      persona: "rivas",
      dialogo:
        "Impecable trabajo de campo. Identificar y seleccionar bien los controles críticos " +
        "es la mitad de la batalla. Nos vemos en el siguiente capítulo.",
      insignia: "Maestro del Bowtie",
      umbralAprobacion: 0
    }
  }
};

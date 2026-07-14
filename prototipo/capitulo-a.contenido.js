/*
 * Contenido del Capítulo A — "Fundamentos y planificación"
 * Cubre los pasos 1 y 2 del proceso CCM de la guía ICMM 2026:
 *   Paso 1 — Planificar el proceso (gobernanza, liderazgo, equipo, alcance)
 *   Paso 2 — Identificar Eventos No Deseados Materiales (MUEs)
 *
 * Formato: grafo de nodos interpretado por el motor (motor.js). El diseñador
 * instruccional puede editar este archivo sin tocar código.
 *
 * Tipos de nodo:
 *   escena     -> texto narrativo, avanza con "continuar"
 *   decision   -> opciones con efectos (puntos, banderas) y retroalimentación
 *   seleccion  -> el jugador marca varios ítems de una lista (identificar MUEs)
 *   evaluacion -> pregunta puntuada del cierre de capítulo
 *   final      -> pantalla de cierre con el puntaje
 */
window.CAPITULO_A = {
  id: "cap-a",
  titulo: "Capítulo A — Fundamentos y planificación",
  subtitulo: "Pasos 1 y 2 · ICMM 2026",
  inicio: "intro",

  // La "salud" del sistema CCM de la mina virtual. Empieza neutra.
  indicadorInicial: 50,

  personajes: {
    rivas: { nombre: "Ing. Rivas", rol: "Tu mentora en CCM", color: "#1f6feb" },
    superintendente: { nombre: "Superint. Delgado", rol: "Producción", color: "#c9510c" },
    gerente: { nombre: "Gerente Ortiz", rol: "Gerencia de la faena", color: "#6e40c9" }
  },

  nodos: {
    // ---------------------------------------------------------------- INTRO
    intro: {
      tipo: "escena",
      titulo: "Mina Cerro Alto",
      cuerpo:
        "Llegas a Mina Cerro Alto como responsable de implementar la Gestión de " +
        "Controles Críticos (CCM). La faena tuvo un cuasi-accidente grave el mes " +
        "pasado: un camión de acarreo casi arrolla a un trabajador a pie.\n\n" +
        "Tu misión en este capítulo: sentar las bases del proceso (Paso 1) e " +
        "identificar cuáles son los Eventos No Deseados Materiales de la operación " +
        "(Paso 2).",
      persona: "rivas",
      dialogo:
        "«Antes de elegir un solo control, hay que construir bien los cimientos. " +
        "La edición 2026 de la guía es clara: sin liderazgo ni gobernanza, el " +
        "sistema se cae. Empecemos.»",
      siguiente: "p1_sponsor"
    },

    // ------------------------------------------------ PASO 1: LIDERAZGO
    p1_sponsor: {
      tipo: "decision",
      paso: "Paso 1 · Planificar el proceso",
      titulo: "Asegurar el patrocinio",
      cuerpo:
        "Para arrancar necesitas respaldo del liderazgo. El Gerente Ortiz tiene la " +
        "agenda llena y te ofrece 15 minutos. ¿Qué haces?",
      opciones: [
        {
          texto:
            "Pedir que la gerencia patrocine visiblemente el programa y asigne " +
            "recursos y tiempo del personal.",
          indicador: +12,
          bandera: "patrocinio",
          correcta: true,
          feedback:
            "Correcto. La guía 2026 refuerza que el compromiso *visible* del " +
            "liderazgo y una gobernanza clara son la primera condición de éxito. " +
            "Sin recursos ni tiempo asignado, el proceso queda en buenas intenciones."
        },
        {
          texto:
            "Aceptar arrancar tú solo/a con lo que haya, para no molestar a la " +
            "gerencia, y mostrar resultados después.",
          indicador: -8,
          bandera: "sin_patrocinio",
          feedback:
            "Riesgo alto. Sin patrocinio ni gobernanza formal, más adelante te " +
            "faltará autoridad para asignar dueños de control y detener tareas. " +
            "Este atajo se paga en capítulos posteriores."
        },
        {
          texto:
            "Delegar todo el programa al área de Seguridad, porque 'es su tema'.",
          indicador: -10,
          bandera: "sin_patrocinio",
          feedback:
            "Error frecuente. El CCM no es 'del área de seguridad': es de la línea " +
            "operativa. Aislarlo en Seguridad debilita la rendición de cuentas."
        }
      ],
      siguiente: "p1_equipo"
    },

    p1_equipo: {
      tipo: "decision",
      paso: "Paso 1 · Planificar el proceso",
      titulo: "Formar el equipo",
      cuerpo:
        "Debes armar el equipo que llevará adelante el proceso. ¿A quiénes " +
        "convocas?",
      opciones: [
        {
          texto:
            "Un equipo multidisciplinario: operaciones, mantenimiento, seguridad " +
            "y trabajadores de primera línea con experiencia en la tarea.",
          indicador: +12,
          bandera: "equipo_linea",
          correcta: true,
          feedback:
            "Correcto. La guía 2026 pone énfasis en el involucramiento de la " +
            "primera línea: quienes ejecutan la tarea conocen los controles reales, " +
            "no los que están 'en el papel'."
        },
        {
          texto:
            "Solo ingenieros y jefaturas: son quienes toman las decisiones " +
            "técnicas.",
          indicador: -6,
          feedback:
            "Incompleto. Sin la voz de la primera línea corres el riesgo de " +
            "diseñar controles que no reflejan cómo se hace realmente el trabajo."
        },
        {
          texto:
            "Contratar una consultora para que lo haga íntegramente por fuera.",
          indicador: -8,
          feedback:
            "Débil. Una consultora puede facilitar, pero si el conocimiento y la " +
            "responsabilidad no quedan en la operación, el sistema no se sostiene."
        }
      ],
      siguiente: "p1_alcance"
    },

    p1_alcance: {
      tipo: "escena",
      paso: "Paso 1 · Planificar el proceso",
      titulo: "Definir el alcance",
      cuerpo:
        "Con el equipo formado, definen el alcance: se enfocarán en los riesgos " +
        "con potencial de consecuencia catastrófica (fatalidades o eventos " +
        "mayores), no en todos los riesgos de la operación.",
      persona: "rivas",
      dialogo:
        "«Bien. El CCM no reemplaza tu sistema de gestión de riesgos: se concentra " +
        "en los pocos eventos que pueden matar o destruir. Eso nos lleva al Paso 2.»",
      siguiente: "p2_intro"
    },

    // ------------------------------------------- PASO 2: IDENTIFICAR MUEs
    p2_intro: {
      tipo: "escena",
      paso: "Paso 2 · Identificar MUEs",
      titulo: "¿Qué es un MUE?",
      cuerpo:
        "Un Evento No Deseado Material (MUE, Material Unwanted Event) es un evento " +
        "con potencial de consecuencia MUY GRAVE: fatalidad o daño catastrófico.\n\n" +
        "OJO: no es lo mismo que un riesgo frecuente. Algo puede pasar seguido y aun " +
        "así NO ser un MUE si su peor consecuencia es menor. Y algo raro puede ser un " +
        "MUE si, cuando ocurre, mata.",
      persona: "rivas",
      dialogo:
        "«Este es el paso que más equivocan las faenas. Si priorizas mal aquí, todo " +
        "lo que construyas encima queda torcido. Concéntrate en la CONSECUENCIA, no " +
        "en la frecuencia.»",
      siguiente: "p2_seleccion"
    },

    p2_seleccion: {
      tipo: "seleccion",
      paso: "Paso 2 · Identificar MUEs",
      titulo: "Identifica los MUEs",
      cuerpo:
        "Estos son los riesgos reportados en Cerro Alto. Marca únicamente los que " +
        "califican como Eventos No Deseados Materiales (potencial de fatalidad o " +
        "catástrofe). Deja sin marcar los que son frecuentes pero de baja " +
        "consecuencia.",
      minCorrectas: 4,
      items: [
        {
          texto: "Interacción camión de acarreo – persona a pie",
          esMUE: true,
          nota: "MUE. Es justo el cuasi-accidente que motivó el programa: potencial de fatalidad."
        },
        {
          texto: "Caída de rocas en labor subterránea",
          esMUE: true,
          nota: "MUE. Alta energía, potencial de sepultamiento y fatalidad."
        },
        {
          texto: "Incendio de correa transportadora",
          esMUE: true,
          nota: "MUE. Puede escalar a incendio mayor con víctimas y pérdida catastrófica."
        },
        {
          texto: "Falla del depósito de relaves (tranque)",
          esMUE: true,
          nota: "MUE. Consecuencia catastrófica para personas, comunidades y ambiente."
        },
        {
          texto: "Cortes menores en las manos al manipular herramientas",
          esMUE: false,
          nota: "No es MUE. Frecuente, pero su peor consecuencia no es catastrófica. Se gestiona por el sistema de riesgos ordinario."
        },
        {
          texto: "Resbalones y tropiezos en oficinas",
          esMUE: false,
          nota: "No es MUE. Alta frecuencia, baja consecuencia. No entra en CCM."
        },
        {
          texto: "Fatiga por ergonomía de escritorio",
          esMUE: false,
          nota: "No es MUE. Tema de salud ocupacional, sin potencial catastrófico agudo."
        }
      ],
      feedbackAlto:
        "Excelente lectura del riesgo: distinguiste consecuencia de frecuencia. " +
        "Esos 4 MUEs serán la base de todo el sistema CCM.",
      feedbackBajo:
        "Revisa el criterio: no importa cuán seguido pase, sino si puede MATAR o " +
        "causar una catástrofe. Los cortes, resbalones y la ergonomía son reales, " +
        "pero no son eventos materiales."
    },

    p2_ranking: {
      tipo: "decision",
      paso: "Paso 2 · Identificar MUEs",
      titulo: "Priorizar",
      cuerpo:
        "El equipo tiene recursos limitados para empezar. El Superintendente " +
        "Delgado presiona: «Partamos por lo que más se reporta, los cortes de " +
        "mano; hay decenas al mes». ¿Qué respondes?",
      opciones: [
        {
          texto:
            "Priorizar los MUEs por potencial de consecuencia; los cortes se " +
            "gestionan por el sistema ordinario, no por CCM.",
          indicador: +10,
          correcta: true,
          feedback:
            "Correcto. CCM se ordena por consecuencia potencial, no por número de " +
            "reportes. Los cortes importan, pero no son el foco de los controles " +
            "críticos."
        },
        {
          texto:
            "Ceder y empezar por los cortes de mano, para mostrar cifras que " +
            "bajen rápido.",
          indicador: -10,
          feedback:
            "Trampa clásica. Reducir la estadística de lesiones menores no reduce " +
            "el riesgo de fatalidad. Es el error que la guía 2026 busca corregir."
        }
      ],
      siguiente: "eval_intro"
    },

    // --------------------------------------------- EVALUACIÓN DE CIERRE
    eval_intro: {
      tipo: "escena",
      titulo: "Caso integrador",
      cuerpo:
        "Para cerrar el capítulo, dos preguntas rápidas que integran lo visto. " +
        "Necesitas responder bien para consolidar las bases del sistema.",
      siguiente: "eval_1"
    },

    eval_1: {
      tipo: "evaluacion",
      titulo: "Pregunta 1 de 2",
      cuerpo: "¿Cuál es el criterio que define a un Evento No Deseado Material (MUE)?",
      opciones: [
        { texto: "Que ocurra con mucha frecuencia en la operación.", correcta: false },
        { texto: "Que tenga potencial de consecuencia catastrófica (fatalidad o daño mayor).", correcta: true },
        { texto: "Que sea difícil y costoso de controlar.", correcta: false },
        { texto: "Que esté reportado en el sistema de incidentes.", correcta: false }
      ],
      feedbackOk: "Exacto: lo define la CONSECUENCIA potencial, no la frecuencia ni el costo.",
      feedbackNo: "Recuerda: un MUE se define por su potencial de consecuencia catastrófica.",
      siguiente: "eval_2"
    },

    eval_2: {
      tipo: "evaluacion",
      titulo: "Pregunta 2 de 2",
      cuerpo:
        "Según la edición 2026, ¿cuál es la primera condición para que el proceso " +
        "CCM funcione?",
      opciones: [
        { texto: "Comprar un software de gestión de controles.", correcta: false },
        { texto: "Que el área de Seguridad se haga cargo en exclusiva.", correcta: false },
        { texto: "Compromiso visible del liderazgo y gobernanza clara.", correcta: true },
        { texto: "Tener el mayor número posible de controles críticos.", correcta: false }
      ],
      feedbackOk: "Correcto. Liderazgo y gobernanza son los cimientos del sistema.",
      feedbackNo: "La base es el liderazgo y la gobernanza, no la tecnología ni delegar en Seguridad.",
      siguiente: "final"
    },

    // ------------------------------------------------------------ FINAL
    final: {
      tipo: "final",
      titulo: "Capítulo A completado",
      cuerpo:
        "Sentaste las bases: aseguraste liderazgo, formaste un equipo con la " +
        "primera línea, definiste el alcance en lo catastrófico e identificaste los " +
        "MUEs de Cerro Alto.\n\n" +
        "En el Capítulo B pasarás del riesgo al control: construirás el diagrama " +
        "de corbatín (bowtie) y seleccionarás los controles CRÍTICOS.",
      persona: "rivas",
      dialogoAlto:
        "«Bases sólidas. Con este criterio, el resto del sistema se va a sostener. " +
        "Nos vemos en el bowtie.»",
      dialogoBajo:
        "«Terminamos, pero repasa el criterio de MUE y el rol del liderazgo antes " +
        "de seguir: si esto queda flojo, lo demás se tuerce.»",
      insignia: "Analista de MUEs",
      umbralAprobacion: 65
    }
  }
};

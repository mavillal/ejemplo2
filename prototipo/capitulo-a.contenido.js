/*
 * Contenido del Capítulo A — "Fundamentos y planificación" (Pasos 1 y 2, ICMM 2026)
 *
 * NARRATIVA RAMIFICADA (árbol de decisiones): cada opción puede definir su propio
 * "siguiente", llevando al jugador por caminos distintos. Las consecuencias se
 * arrastran mediante banderas (estado.banderas) que un nodo posterior consulta.
 *
 * "siguiente" puede ser:
 *   - un string (id de nodo), o
 *   - una función(estado) => id   (para consecuencias diferidas según el camino)
 *
 * Tipos de nodo: portada | escena | decision | seleccion | evaluacion | final
 */
window.CAPITULO_A = {
  id: "cap-a",
  titulo: "Guardianes del Control",
  subtitulo: "Capítulo A · Fundamentos y planificación",
  inicio: "portada",
  indicadorInicial: 50,

  personajes: {
    rivas: { nombre: "Ing. Rivas", rol: "Mentora en Controles Críticos" },
    delgado: { nombre: "Superint. Delgado", rol: "Producción" },
    ortiz: { nombre: "Gerente Ortiz", rol: "Gerencia de faena" }
  },

  nodos: {
    // -------------------------------------------------------- PORTADA
    portada: {
      tipo: "portada",
      titulo: "Guardianes del Control",
      subtitulo: "Gestión de Controles Críticos · Guía ICMM 2026",
      capitulo: "Capítulo A — Fundamentos y planificación",
      persona: "rivas",
      dialogo:
        "Soy la Ing. Rivas. Cada decisión que tomes cambia el rumbo de la faena. " +
        "Juntos vamos a blindar Mina Cerro Alto contra los eventos que pueden costar " +
        "vidas. ¿List@ para empezar?",
      boton: "Comenzar capítulo",
      siguiente: "intro"
    },

    // ---------------------------------------------------------- INTRO
    intro: {
      tipo: "escena",
      ilustracion: "mina_amanecer",
      titulo: "Mina Cerro Alto",
      cuerpo:
        "Llegas como responsable de implementar la Gestión de Controles Críticos " +
        "(CCM). Hace un mes, un camión de acarreo casi arrolla a un trabajador a pie: " +
        "un aviso de que la faena necesita blindar sus riesgos mortales.\n\n" +
        "Aquí no hay un guion único: tus decisiones abren caminos distintos y sus " +
        "consecuencias te alcanzarán más adelante.",
      persona: "rivas",
      dialogo:
        "Antes de elegir un solo control, hay que construir los cimientos. La guía " +
        "2026 es clara: sin liderazgo ni gobernanza, el sistema se cae. Empecemos.",
      siguiente: "p1_sponsor"
    },

    // ============================================================
    // PASO 1 — DECISIÓN RAÍZ: el patrocinio del liderazgo
    // ============================================================
    p1_sponsor: {
      tipo: "decision",
      paso: "Paso 1 · Planificar el proceso",
      ilustracion: "gerencia",
      titulo: "Asegurar el patrocinio",
      cuerpo:
        "Para arrancar necesitas respaldo del liderazgo. El Gerente Ortiz tiene la " +
        "agenda llena y te ofrece 15 minutos. ¿Qué haces?",
      opciones: [
        {
          texto:
            "Pedir que la gerencia patrocine visiblemente el programa y asigne " +
            "recursos y tiempo del personal.",
          indicador: +12, xp: 20, bandera: "apoyo", correcta: true,
          feedback:
            "Correcto. La guía 2026 refuerza que el compromiso visible del liderazgo " +
            "y una gobernanza clara son la primera condición de éxito.",
          siguiente: "c_apoyo_si"
        },
        {
          texto:
            "Arrancar tú solo/a con lo que haya, para no molestar a la gerencia, y " +
            "mostrar resultados después.",
          indicador: -8, xp: 5,
          feedback:
            "Camino cuesta arriba. Sin patrocinio ni gobernanza, más adelante te " +
            "faltará autoridad. Pero aún puedes intentar revertirlo.",
          siguiente: "c_apoyo_no"
        },
        {
          texto: "Delegar todo el programa al área de Seguridad, porque 'es su tema'.",
          indicador: -10, xp: 5,
          feedback:
            "Error frecuente. El CCM es de la línea operativa, no 'de Seguridad'. " +
            "Aislarlo debilita la rendición de cuentas.",
          siguiente: "c_apoyo_no"
        }
      ]
    },

    // ---- Consecuencia CAMINO A: con apoyo → pregunta "formar equipo" ----
    c_apoyo_si: {
      tipo: "escena",
      paso: "Paso 1 · Camino: con respaldo",
      ilustracion: "exito",
      titulo: "La gerencia se compromete",
      cuerpo:
        "Ortiz firma el patrocinio, asigna presupuesto y libera tiempo del personal. " +
        "Tienes autoridad y recursos para avanzar con fuerza.",
      persona: "rivas",
      dialogo: "Con el liderazgo detrás, ahora sí: armemos el equipo correcto.",
      siguiente: "p1_equipo_apoyo"
    },

    p1_equipo_apoyo: {
      tipo: "decision",
      paso: "Paso 1 · Con respaldo",
      ilustracion: "equipo",
      titulo: "Formar el equipo",
      cuerpo:
        "Con el respaldo asegurado, armas el equipo que llevará el proceso. " +
        "¿A quiénes convocas?",
      opciones: [
        {
          texto:
            "Equipo multidisciplinario: operaciones, mantenimiento, seguridad y " +
            "trabajadores de primera línea con experiencia en la tarea.",
          indicador: +12, xp: 20, bandera: "equipo", correcta: true,
          feedback:
            "Correcto. La guía 2026 enfatiza el involucramiento de la primera línea: " +
            "quienes ejecutan la tarea conocen los controles reales.",
          siguiente: "p1_alcance"
        },
        {
          texto: "Solo ingenieros y jefaturas: ellos toman las decisiones técnicas.",
          indicador: -6, xp: 8,
          feedback:
            "Incompleto. Sin la voz de la primera línea diseñarás controles que no " +
            "reflejan cómo se hace realmente el trabajo.",
          siguiente: "p1_alcance"
        },
        {
          texto: "Contratar una consultora para que lo haga íntegramente por fuera.",
          indicador: -8, xp: 8,
          feedback:
            "Débil. Si el conocimiento y la responsabilidad no quedan en la operación, " +
            "el sistema no se sostiene.",
          siguiente: "p1_alcance"
        }
      ]
    },

    // ---- Consecuencia CAMINO B: sin apoyo → pregunta DISTINTA (recuperar) ----
    c_apoyo_no: {
      tipo: "escena",
      paso: "Paso 1 · Camino: sin respaldo",
      ilustracion: "traba",
      titulo: "Avanzas sin red",
      cuerpo:
        "Sin patrocinio formal, arrancas con lo justo: ni presupuesto claro ni tiempo " +
        "liberado del personal. La línea operativa te ve como 'un tema de Seguridad " +
        "más'. Este camino será más difícil.",
      persona: "rivas",
      dialogo:
        "No es el fin del mundo, pero ojo: sin liderazgo, cuando toque DETENER una " +
        "tarea te va a faltar autoridad. ¿Cómo procedes?",
      siguiente: "p1_recuperar"
    },

    p1_recuperar: {
      tipo: "decision",
      paso: "Paso 1 · Sin respaldo",
      ilustracion: "traba",
      titulo: "Recuperar el rumbo",
      cuerpo:
        "En la primera reunión te falta peso. Tienes una oportunidad de enderezar el " +
        "proceso. ¿Qué haces?",
      opciones: [
        {
          texto:
            "Documentar los riesgos mortales de la faena y volver a la gerencia con " +
            "evidencia para conseguir el patrocinio que faltó.",
          indicador: +14, xp: 22, bandera: "apoyo", correcta: true,
          feedback:
            "Bien recuperado. Con evidencia del potencial de fatalidad, Ortiz " +
            "reacciona y respalda el programa. Vuelves al camino sólido.",
          siguiente: "c_recupera_ok"
        },
        {
          texto:
            "Avanzar igual, sin involucrar a la línea, para mostrar algo rápido.",
          indicador: -8, xp: 6,
          feedback:
            "Sigues sin cimientos. Mostrar 'algo' no construye un sistema que aguante. " +
            "La deuda de liderazgo te seguirá.",
          siguiente: "p1_alcance"
        },
        {
          texto: "Formar el equipo solo con el área de Seguridad, que es lo que tienes.",
          indicador: -6, xp: 6,
          feedback:
            "Comprensible, pero refuerza el error: el CCM queda aislado de operaciones, " +
            "justo donde ocurren los eventos mortales.",
          siguiente: "p1_alcance"
        }
      ]
    },

    c_recupera_ok: {
      tipo: "escena",
      paso: "Paso 1 · Rumbo recuperado",
      ilustracion: "exito",
      titulo: "Reviertes la situación",
      cuerpo:
        "La evidencia de riesgos mortales cambia la conversación. Ortiz asigna " +
        "recursos y respalda el programa: recuperas la autoridad que faltaba.",
      persona: "rivas",
      dialogo: "Así se hace. Nunca es tarde para poner el liderazgo donde corresponde.",
      siguiente: "p1_alcance"
    },

    // ---- Reconvergencia: definir alcance (todos los caminos pasan por aquí) ----
    p1_alcance: {
      tipo: "escena",
      paso: "Paso 1 · Planificar el proceso",
      ilustracion: "alcance",
      titulo: "Definir el alcance",
      cuerpo:
        "Defines el alcance: el CCM se enfocará en los riesgos con potencial de " +
        "consecuencia catastrófica (fatalidades o eventos mayores), no en todos los " +
        "riesgos de la operación.",
      persona: "rivas",
      dialogo:
        "El CCM no reemplaza tu sistema de riesgos: se concentra en los pocos eventos " +
        "que pueden matar o destruir. Eso nos lleva al Paso 2.",
      siguiente: "p2_intro"
    },

    // ============================================================
    // PASO 2 — IDENTIFICAR MUEs
    // ============================================================
    p2_intro: {
      tipo: "escena",
      paso: "Paso 2 · Identificar MUEs",
      ilustracion: "mues",
      titulo: "¿Qué es un MUE?",
      cuerpo:
        "Un Evento No Deseado Material (MUE) es un evento con potencial de consecuencia " +
        "MUY GRAVE: fatalidad o daño catastrófico.\n\n" +
        "OJO: no es lo mismo que un riesgo frecuente. Algo puede pasar seguido y aun " +
        "así NO ser un MUE si su peor consecuencia es menor. Y algo raro puede ser un " +
        "MUE si, cuando ocurre, mata.",
      persona: "rivas",
      dialogo:
        "Este es el paso que más equivocan las faenas. Concéntrate en la CONSECUENCIA, " +
        "no en la frecuencia.",
      siguiente: "p2_seleccion"
    },

    p2_seleccion: {
      tipo: "seleccion",
      paso: "Paso 2 · Identificar MUEs",
      titulo: "Identifica los MUEs",
      cuerpo:
        "Estos son los riesgos reportados en Cerro Alto. Marca únicamente los que " +
        "califican como Eventos No Deseados Materiales (potencial de fatalidad o " +
        "catástrofe). Deja sin marcar los frecuentes pero de baja consecuencia.",
      minCorrectas: 6,
      items: [
        { texto: "Interacción camión de acarreo – persona a pie", icono: "camion", esMUE: true,
          nota: "MUE. Es justo el cuasi-accidente que motivó el programa: potencial de fatalidad." },
        { texto: "Caída de rocas en labor subterránea", icono: "roca", esMUE: true,
          nota: "MUE. Alta energía, potencial de sepultamiento y fatalidad." },
        { texto: "Incendio de correa transportadora", icono: "fuego", esMUE: true,
          nota: "MUE. Puede escalar a incendio mayor con víctimas y pérdida catastrófica." },
        { texto: "Falla del depósito de relaves (tranque)", icono: "relave", esMUE: true,
          nota: "MUE. Consecuencia catastrófica para personas, comunidades y ambiente." },
        { texto: "Cortes menores en las manos con herramientas", icono: "corte", esMUE: false,
          nota: "No es MUE. Frecuente, pero su peor consecuencia no es catastrófica. Sistema de riesgos ordinario." },
        { texto: "Resbalones y tropiezos en oficinas", icono: "resbalon", esMUE: false,
          nota: "No es MUE. Alta frecuencia, baja consecuencia. No entra en CCM." },
        { texto: "Fatiga por ergonomía de escritorio", icono: "ergonomia", esMUE: false,
          nota: "No es MUE. Tema de salud ocupacional, sin potencial catastrófico agudo." }
      ],
      feedbackAlto:
        "Excelente lectura del riesgo: distinguiste consecuencia de frecuencia. Esos 4 " +
        "MUEs serán la base de todo el sistema CCM.",
      feedbackBajo:
        "Revisa el criterio: no importa cuán seguido pase, sino si puede MATAR o causar " +
        "una catástrofe. Cortes, resbalones y ergonomía son reales, pero no son eventos " +
        "materiales.",
      siguiente: "p2_ranking"
    },

    // ---- DECISIÓN que ramifica el desenlace + CONSECUENCIA DIFERIDA del Paso 1 ----
    p2_ranking: {
      tipo: "decision",
      paso: "Paso 2 · Identificar MUEs",
      ilustracion: "camion_persona",
      titulo: "Priorizar bajo presión",
      cuerpo:
        "El Superintendente Delgado presiona: «Partamos por lo que más se reporta, los " +
        "cortes de mano; hay decenas al mes». ¿Qué respondes?",
      opciones: [
        {
          texto:
            "Priorizar los MUEs por potencial de consecuencia; los cortes se gestionan " +
            "por el sistema ordinario, no por CCM.",
          indicador: +10, xp: 20, correcta: true,
          feedback:
            "Correcto. CCM se ordena por consecuencia potencial, no por número de " +
            "reportes. Ahora veremos qué tan firme quedó tu decisión.",
          // Consecuencia DIFERIDA: depende de si aseguraste el liderazgo en el Paso 1
          siguiente: function (estado) {
            return estado.banderas.apoyo ? "final_bien" : "final_sinapoyo";
          }
        },
        {
          texto:
            "Ceder y empezar por los cortes de mano, para mostrar cifras que bajen " +
            "rápido.",
          indicador: -12, xp: 4,
          feedback:
            "Cediste a la presión de producción. Reducir lesiones menores no reduce el " +
            "riesgo de fatalidad… y el destino de la faena lo confirmará.",
          siguiente: "final_incidente"
        }
      ]
    },

    // ============================================================
    // DESENLACES RAMIFICADOS (tres finales distintos)
    // ============================================================
    final_bien: {
      tipo: "final", variante: "exito",
      ilustracion: "exito",
      titulo: "¡Faena blindada!",
      cuerpo:
        "Semanas después, el sistema CCM está en pie: liderazgo comprometido, equipo " +
        "con la primera línea y los MUEs correctamente priorizados. Cuando un camión " +
        "invade una zona de tránsito peatonal, el control crítico funciona y se evita " +
        "la tragedia.\n\nEn el Capítulo B pasarás del riesgo al control: el diagrama de " +
        "corbatín (bowtie) y la selección de controles CRÍTICOS.",
      persona: "rivas",
      dialogo:
        "Camino impecable: cimientos sólidos y foco en lo que mata. Así se sostiene un " +
        "sistema. Nos vemos en el bowtie.",
      insignia: "Guardián de Cimientos",
      umbralAprobacion: 65
    },

    final_sinapoyo: {
      tipo: "final", variante: "mixto",
      ilustracion: "traba",
      titulo: "Lo correcto, cuesta arriba",
      cuerpo:
        "Priorizaste bien los MUEs, pero la deuda del Paso 1 te alcanza: sin patrocinio " +
        "firme del liderazgo, cuando hubo que DETENER una tarea riesgosa te faltó " +
        "autoridad y la orden llegó tarde. Aprendiste en carne propia por qué la guía " +
        "2026 pone el liderazgo primero.\n\nEn el Capítulo B pasarás del riesgo al " +
        "control: el bowtie y la selección de controles CRÍTICOS.",
      persona: "rivas",
      dialogo:
        "Tu criterio de riesgo fue bueno. La lección: sin liderazgo, hasta la decisión " +
        "correcta pierde fuerza. En el próximo capítulo lo tendremos en cuenta.",
      insignia: "Analista de MUEs",
      umbralAprobacion: 55
    },

    final_incidente: {
      tipo: "final", variante: "fallo",
      ilustracion: "camion_persona",
      titulo: "Una lección amarga",
      cuerpo:
        "Enfocaste el esfuerzo en los cortes de mano y las cifras menores bajaron. Pero " +
        "los riesgos mortales quedaron sin controles críticos. Semanas después, el mismo " +
        "escenario del inicio se repite: un camión de acarreo y un trabajador a pie, esta " +
        "vez sin nada que lo frene a tiempo.\n\nEs momento de volver a empezar y ordenar " +
        "el CCM por CONSECUENCIA, no por frecuencia.",
      persona: "rivas",
      dialogo:
        "Duele, pero es la lección central: reducir lo frecuente no salva vidas si " +
        "dejas descubierto lo que mata. Repasemos y volvamos a intentarlo.",
      insignia: null,
      umbralAprobacion: 200 // nunca aprueba: es el desenlace de fallo
    }
  }
};

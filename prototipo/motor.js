/*
 * Motor narrativo — intérprete del grafo de nodos.
 * Independiente del contenido: lee window.CAPITULO_A y lo renderiza.
 * Guardado automático en localStorage (simula el offline-first de la app).
 */
(function () {
  "use strict";

  var cap = window.CAPITULO_A;
  var app = document.getElementById("app");
  var barra = document.getElementById("indicador-valor");
  var barraFill = document.getElementById("indicador-fill");
  var pasoEl = document.getElementById("paso-actual");
  var CLAVE = "ccm_cap_a_estado";

  var estado = cargar() || {
    nodo: cap.inicio,
    indicador: cap.indicadorInicial,
    banderas: {},
    aciertosEval: 0,
    totalEval: 0
  };

  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) {}
  }
  function cargar() {
    try { return JSON.parse(localStorage.getItem(CLAVE)); } catch (e) { return null; }
  }

  function clamp(n) { return Math.max(0, Math.min(100, n)); }

  function pintarIndicador() {
    var v = clamp(estado.indicador);
    barra.textContent = v;
    barraFill.style.width = v + "%";
    barraFill.className = "fill " + (v >= 65 ? "ok" : v >= 40 ? "med" : "bajo");
  }

  function pintarPaso(nodo) {
    pasoEl.textContent = nodo.paso || "";
    pasoEl.style.display = nodo.paso ? "block" : "none";
  }

  function persona(id) { return id ? cap.personajes[id] : null; }

  function bloqueDialogo(personaId, texto) {
    if (!texto) return "";
    var p = persona(personaId);
    var nombre = p ? p.nombre : "";
    var color = p ? p.color : "#888";
    var rol = p ? p.rol : "";
    return (
      '<div class="dialogo" style="border-color:' + color + '">' +
      '<div class="dialogo-cabecera"><span class="avatar" style="background:' + color + '">' +
      (nombre ? nombre.charAt(0) : "?") + "</span>" +
      '<div><div class="dialogo-nombre">' + esc(nombre) + "</div>" +
      '<div class="dialogo-rol">' + esc(rol) + "</div></div></div>" +
      '<div class="dialogo-texto">' + esc(texto) + "</div></div>"
    );
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>");
  }

  function ir(id) { estado.nodo = id; guardar(); render(); }

  function render() {
    var nodo = cap.nodos[estado.nodo];
    pintarIndicador();
    pintarPaso(nodo);
    app.scrollTop = 0;
    ({
      escena: renderEscena,
      decision: renderDecision,
      seleccion: renderSeleccion,
      evaluacion: renderEvaluacion,
      final: renderFinal
    }[nodo.tipo] || renderEscena)(nodo);
  }

  // ---------------------------------------------------------- ESCENA
  function renderEscena(nodo) {
    app.innerHTML =
      card(
        '<h2>' + esc(nodo.titulo) + "</h2>" +
        '<p class="cuerpo">' + esc(nodo.cuerpo) + "</p>" +
        bloqueDialogo(nodo.persona, nodo.dialogo)
      ) +
      '<button class="btn primario" id="continuar">Continuar</button>';
    document.getElementById("continuar").onclick = function () { ir(nodo.siguiente); };
  }

  // -------------------------------------------------------- DECISIÓN
  function renderDecision(nodo) {
    var html = card(
      '<h2>' + esc(nodo.titulo) + "</h2>" +
      '<p class="cuerpo">' + esc(nodo.cuerpo) + "</p>"
    );
    html += '<div class="opciones">';
    nodo.opciones.forEach(function (op, i) {
      html += '<button class="btn opcion" data-i="' + i + '">' + esc(op.texto) + "</button>";
    });
    html += "</div>";
    app.innerHTML = html;

    Array.prototype.forEach.call(app.querySelectorAll(".opcion"), function (b) {
      b.onclick = function () {
        var op = nodo.opciones[+b.dataset.i];
        estado.indicador = clamp(estado.indicador + (op.indicador || 0));
        if (op.bandera) estado.banderas[op.bandera] = true;
        guardar();
        pintarIndicador();

        Array.prototype.forEach.call(app.querySelectorAll(".opcion"), function (x) {
          x.disabled = true; x.classList.add("inerte");
        });
        b.classList.add(op.correcta ? "elegida-ok" : "elegida-mal");

        var fb = document.createElement("div");
        fb.className = "feedback " + (op.correcta ? "fb-ok" : "fb-mal");
        fb.innerHTML =
          '<div class="fb-titulo">' + (op.correcta ? "✓ Bien" : "Reflexiona") + "</div>" +
          '<div class="fb-delta">' + deltaTexto(op.indicador) + "</div>" +
          "<p>" + esc(op.feedback) + "</p>" +
          '<button class="btn primario" id="seguir">Continuar</button>';
        app.appendChild(fb);
        fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
        document.getElementById("seguir").onclick = function () { ir(nodo.siguiente); };
      };
    });
  }

  function deltaTexto(d) {
    if (!d) return "";
    return (d > 0 ? "▲ +" : "▼ ") + d + " Seguridad de la mina";
  }

  // -------------------------------------------------------- SELECCIÓN
  function renderSeleccion(nodo) {
    var html = card(
      '<h2>' + esc(nodo.titulo) + "</h2>" +
      '<p class="cuerpo">' + esc(nodo.cuerpo) + "</p>"
    );
    html += '<div class="items">';
    nodo.items.forEach(function (it, i) {
      html += '<label class="item"><input type="checkbox" data-i="' + i + '">' +
        '<span>' + esc(it.texto) + "</span></label>";
    });
    html += "</div>";
    html += '<button class="btn primario" id="verificar">Verificar selección</button>';
    app.innerHTML = html;

    document.getElementById("verificar").onclick = function () {
      var marcados = {};
      Array.prototype.forEach.call(app.querySelectorAll('input[type=checkbox]'), function (c) {
        marcados[+c.dataset.i] = c.checked;
        c.disabled = true;
      });
      var correctas = 0;
      nodo.items.forEach(function (it, i) {
        var acierto = !!marcados[i] === !!it.esMUE;
        if (acierto) correctas++;
        var label = app.querySelectorAll(".item")[i];
        label.classList.add(acierto ? "item-ok" : "item-mal");
        var nota = document.createElement("div");
        nota.className = "item-nota " + (it.esMUE ? "es-mue" : "no-mue");
        nota.innerHTML = (it.esMUE ? "★ MUE — " : "○ No MUE — ") + esc(it.nota);
        label.appendChild(nota);
      });

      var aprob = correctas >= nodo.minCorrectas;
      estado.indicador = clamp(estado.indicador + (aprob ? 14 : -6));
      guardar();
      pintarIndicador();

      document.getElementById("verificar").style.display = "none";
      var fb = document.createElement("div");
      fb.className = "feedback " + (aprob ? "fb-ok" : "fb-mal");
      fb.innerHTML =
        '<div class="fb-titulo">' + correctas + " / " + nodo.items.length + " correctas</div>" +
        "<p>" + esc(aprob ? nodo.feedbackAlto : nodo.feedbackBajo) + "</p>" +
        '<button class="btn primario" id="seguir">Continuar</button>';
      app.appendChild(fb);
      fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
      document.getElementById("seguir").onclick = function () { ir("p2_ranking"); };
    };
  }

  // ------------------------------------------------------ EVALUACIÓN
  function renderEvaluacion(nodo) {
    var html = card(
      '<h2>' + esc(nodo.titulo) + "</h2>" +
      '<p class="cuerpo">' + esc(nodo.cuerpo) + "</p>"
    );
    html += '<div class="opciones">';
    nodo.opciones.forEach(function (op, i) {
      html += '<button class="btn opcion" data-i="' + i + '">' + esc(op.texto) + "</button>";
    });
    html += "</div>";
    app.innerHTML = html;

    Array.prototype.forEach.call(app.querySelectorAll(".opcion"), function (b) {
      b.onclick = function () {
        var op = nodo.opciones[+b.dataset.i];
        estado.totalEval++;
        if (op.correcta) { estado.aciertosEval++; estado.indicador = clamp(estado.indicador + 6); }
        else { estado.indicador = clamp(estado.indicador - 4); }
        guardar();
        pintarIndicador();

        Array.prototype.forEach.call(app.querySelectorAll(".opcion"), function (x, i) {
          x.disabled = true; x.classList.add("inerte");
          if (nodo.opciones[i].correcta) x.classList.add("elegida-ok");
        });
        if (!op.correcta) b.classList.add("elegida-mal");

        var fb = document.createElement("div");
        fb.className = "feedback " + (op.correcta ? "fb-ok" : "fb-mal");
        fb.innerHTML = "<p>" + esc(op.correcta ? nodo.feedbackOk : nodo.feedbackNo) + "</p>" +
          '<button class="btn primario" id="seguir">Continuar</button>';
        app.appendChild(fb);
        fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
        document.getElementById("seguir").onclick = function () { ir(nodo.siguiente); };
      };
    });
  }

  // ----------------------------------------------------------- FINAL
  function renderFinal(nodo) {
    var v = clamp(estado.indicador);
    var aprob = v >= nodo.umbralAprobacion;
    var dialogo = aprob ? nodo.dialogoAlto : nodo.dialogoBajo;

    app.innerHTML =
      card(
        '<div class="medalla ' + (aprob ? "" : "gris") + '">🛡️</div>' +
        '<h2 style="text-align:center">' + esc(nodo.titulo) + "</h2>" +
        '<div class="resultado">' +
          '<div class="metrica"><span>' + v + '</span><small>Seguridad de la mina</small></div>' +
          '<div class="metrica"><span>' + estado.aciertosEval + "/" + estado.totalEval +
            '</span><small>Evaluación</small></div>' +
        "</div>" +
        (aprob ? '<div class="insignia">🏅 Insignia obtenida: ' + esc(nodo.insignia) + "</div>" : "") +
        '<p class="cuerpo">' + esc(nodo.cuerpo) + "</p>" +
        bloqueDialogo(nodo.persona, dialogo)
      ) +
      '<button class="btn primario" id="reiniciar">Volver a jugar el capítulo</button>' +
      '<div class="prox">Próximamente: Capítulo B — «Del bowtie al control crítico»</div>';

    document.getElementById("reiniciar").onclick = function () {
      localStorage.removeItem(CLAVE);
      estado = { nodo: cap.inicio, indicador: cap.indicadorInicial, banderas: {}, aciertosEval: 0, totalEval: 0 };
      guardar();
      render();
    };
  }

  function card(inner) { return '<div class="card">' + inner + "</div>"; }

  // Botón de reinicio global (en la barra superior)
  document.getElementById("btn-reiniciar").onclick = function () {
    if (confirm("¿Reiniciar el capítulo desde el principio?")) {
      localStorage.removeItem(CLAVE);
      estado = { nodo: cap.inicio, indicador: cap.indicadorInicial, banderas: {}, aciertosEval: 0, totalEval: 0 };
      guardar();
      render();
    }
  };

  document.getElementById("cap-titulo").textContent = cap.titulo;
  render();
})();

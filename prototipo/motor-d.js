/*
 * Motor del Capítulo D — SIMULADOR DE INSPECCIÓN EN TERRENO.
 * Tipos de nodo: portada | escena | inspeccion | reporte | final
 * Cada inspección: observar (hotspots) -> veredicto -> respuesta.
 * Comparte el lenguaje visual de los capítulos anteriores.
 */
function iniciarMotorD(onHome) {
  "use strict";

  const cap = window.CAPITULO_D;
  const app = document.getElementById("app");
  const hud = document.getElementById("hud");
  const CLAVE = "ccm_cap_d_estado_v1";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let estado = cargar() || nuevoEstado();
  function nuevoEstado() { return { nodo: cap.inicio, indicador: cap.indicadorInicial, xp: 0, reporte: [], mostrado: {} }; }
  const guardar = () => { try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) {} };
  function cargar() { try { return JSON.parse(localStorage.getItem(CLAVE)); } catch (e) { return null; } }
  const clamp = (n) => Math.max(0, Math.min(100, n));
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
  const persona = (id) => (id ? cap.personajes[id] : null);
  const nivel = (xp) => Math.floor(xp / 100) + 1;
  const barajar = (a) => a.map((x) => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map((p) => p[1]);

  /* ============================ SVG ============================ */
  function rivas(size) {
    size = size || 96;
    return `<svg viewBox="0 0 120 120" width="${size}" height="${size}" aria-label="Ingeniera Rivas">
      <defs>
        <radialGradient id="rbg" cx="50%" cy="38%" r="70%"><stop offset="0%" stop-color="#243154"/><stop offset="100%" stop-color="#0E1424"/></radialGradient>
        <linearGradient id="rhelm" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFC24B"/><stop offset="100%" stop-color="#F5820A"/></linearGradient>
        <linearGradient id="rskin" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#F0C09A"/><stop offset="100%" stop-color="#E0A579"/></linearGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill="url(#rbg)"/>
      <path d="M40 108 q20 -20 40 0 v12 h-40 z" fill="#FF6B1A"/><rect x="40" y="103" width="40" height="6" fill="#DCE7F5" opacity=".85"/>
      <path d="M22 120 q6 -26 38 -26 q32 0 38 26 z" fill="#FF7A22"/><path d="M52 96 h16 l-3 10 h-10 z" fill="#DCE7F5" opacity=".7"/>
      <path d="M32 62 q0 -34 28 -34 q28 0 28 34 q0 20 -6 30 q-4 -18 -22 -18 q-18 0 -22 18 q-6 -10 -6 -30z" fill="#2A2118"/>
      <path d="M40 58 q0 34 20 34 q20 0 20 -34 q0 -20 -20 -20 q-20 0 -20 20z" fill="url(#rskin)"/>
      <circle cx="40" cy="64" r="4.5" fill="#E0A579"/><circle cx="80" cy="64" r="4.5" fill="#E0A579"/>
      <path d="M30 52 q0 -30 30 -30 q30 0 30 30 q0 3 -2 4 h-56 q-2 -1 -2 -4z" fill="url(#rhelm)"/>
      <path d="M28 52 h64 q3 0 3 4 t-3 4 h-64 q-3 0 -3 -4 t3 -4z" fill="#F5820A"/>
      <path d="M40 24 q20 -8 40 0 l-1 6 q-19 -7 -38 0z" fill="#FFD98A" opacity=".8"/>
      <rect x="55" y="21" width="10" height="9" rx="2" fill="#3A465A"/><circle cx="60" cy="26" r="3.2" fill="#BFE9FF"/>
      <path d="M45 58 q6 -4 12 -1" stroke="#3A2A1C" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M63 57 q6 -3 12 1" stroke="#3A2A1C" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <ellipse cx="51" cy="65" rx="4.4" ry="4.8" fill="#fff"/><circle cx="52" cy="66" r="2.4" fill="#2A2118"/>
      <ellipse cx="69" cy="65" rx="4.4" ry="4.8" fill="#fff"/><circle cx="68" cy="66" r="2.4" fill="#2A2118"/>
      <circle cx="52.8" cy="65" r=".8" fill="#fff"/><circle cx="68.8" cy="65" r=".8" fill="#fff"/>
      <path d="M60 66 q2 6 -1 9" stroke="#CE8F60" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M50 79 q10 9 20 0" stroke="#B4653C" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M52 80 q8 6 16 0z" fill="#fff"/>
      <circle cx="46" cy="74" r="3.5" fill="#F1A177" opacity=".5"/><circle cx="74" cy="74" r="3.5" fill="#F1A177" opacity=".5"/>
    </svg>`;
  }

  const S = {};
  const cielo = (id, a, b) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${a}"/><stop offset="100%" stop-color="${b}"/></linearGradient>`;

  S.terreno = () => `<svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice">
    <defs>${cielo("t0", "#1B2550", "#C97B3C")}</defs>
    <rect width="400" height="210" fill="url(#t0)"/>
    <circle cx="320" cy="70" r="22" fill="#FFE7A0"/>
    <path d="M0 120 L130 80 L250 115 L400 75 V210 H0z" fill="#25315A"/>
    <path d="M0 150 L400 128 V210 H0z" fill="#7B5638"/><path d="M0 175 L400 158 V210 H0z" fill="#8E6242"/>
    <g transform="translate(60 120) scale(.8)"><path d="M2 24 h44 v8 q0 4 -4 4 h-36 q-4 0 -4 -4z" fill="#F5A623"/><path d="M8 4 h20 l8 12 v8 h-36 v-14 q0 -6 8 -6z" fill="#3A465A"/><circle cx="14" cy="38" r="6" fill="#1A2233"/><circle cx="38" cy="38" r="6" fill="#1A2233"/></g>
    <g transform="translate(300 150)"><circle cy="-16" r="6" fill="#FFC24B"/><rect x="-5" y="-10" width="10" height="16" rx="3" fill="#FF7A22"/><rect x="-4" y="6" width="3.5" height="11" fill="#2A3B5E"/><rect x="1" y="6" width="3.5" height="11" fill="#2A3B5E"/></g>
  </svg>`;

  // Estación 1: barrera peatonal con abertura
  S.barrera = () => `<svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice">
    <defs>${cielo("b0", "#243056", "#3A3550")}</defs>
    <rect width="400" height="210" fill="url(#b0)"/>
    <path d="M0 150 L400 120 V210 H0z" fill="#6E4C34"/>
    <rect x="0" y="150" width="400" height="60" fill="#5A3E2B" opacity=".5"/>
    <!-- pasillo peatonal -->
    <rect x="0" y="170" width="400" height="30" fill="#3A465A"/>
    <g fill="#DCE7F5" opacity=".7">${[20,80,140,260,320,380].map(x=>`<rect x="${x}" y="180" width="24" height="8" rx="2"/>`).join("")}</g>
    <!-- barrera con abertura (falta tramo central) -->
    <g stroke="#FFC53D" stroke-width="4">
      <path d="M10 160 H150 M250 160 H390"/>
    </g>
    <g fill="#FFC53D">${[20,60,100,140,260,300,340,380].map(x=>`<rect x="${x-3}" y="150" width="6" height="20"/>`).join("")}</g>
    <text x="200" y="150" fill="#FF5A5F" font-size="13" text-anchor="middle" font-family="sans-serif">abertura</text>
    <!-- camion cerca -->
    <g transform="translate(150 96) scale(.9)"><path d="M2 24 h44 v8 q0 4 -4 4 h-36 q-4 0 -4 -4z" fill="#F5A623"/><path d="M8 4 h20 l8 12 v8 h-36 v-14 q0 -6 8 -6z" fill="#3A465A"/><circle cx="14" cy="38" r="6" fill="#1A2233"/><circle cx="38" cy="38" r="6" fill="#1A2233"/></g>
  </svg>`;

  // Estación 2: parte trasera de camión + panel del sensor
  S.sensor = () => `<svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice">
    <rect width="400" height="210" fill="#101A30"/>
    <path d="M0 160 L400 160 V210 H0z" fill="#3A2E22"/>
    <!-- camion (trasera) -->
    <g transform="translate(90 40)"><rect x="0" y="0" width="150" height="100" rx="6" fill="#C9821E"/><rect x="14" y="14" width="122" height="54" rx="4" fill="#8A5A14"/><circle cx="40" cy="150" r="20" fill="#1A2233"/><circle cx="130" cy="150" r="20" fill="#1A2233"/><rect x="60" y="120" width="34" height="10" fill="#FFC53D"/></g>
    <!-- panel sensor con luz de falla -->
    <g transform="translate(270 70)"><rect width="70" height="50" rx="6" fill="#0F1D33" stroke="#33456B" stroke-width="2"/><circle cx="20" cy="18" r="7" fill="#FFC53D"/><circle cx="44" cy="18" r="7" fill="#26314D"/><rect x="12" y="34" width="46" height="6" rx="3" fill="#26314D"/></g>
  </svg>`;

  // Estación 3: punto de respuesta a emergencias
  S.emergencia = () => `<svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice">
    <rect width="400" height="210" fill="#0F2018"/>
    <path d="M0 160 L400 160 V210 H0z" fill="#183024"/>
    <!-- gabinete de emergencia -->
    <g transform="translate(60 60)"><rect width="90" height="90" rx="6" fill="#127A3E"/><rect x="10" y="10" width="70" height="70" rx="4" fill="#0E5E30"/><path d="M45 20 v50 M20 45 h50" stroke="#EAF7EE" stroke-width="8"/></g>
    <!-- camilla -->
    <g transform="translate(180 110)"><rect width="80" height="14" rx="4" fill="#EAF0FA"/><rect x="6" y="14" width="6" height="18" fill="#8A97B4"/><rect x="68" y="14" width="6" height="18" fill="#8A97B4"/></g>
    <!-- señal punto de encuentro -->
    <g transform="translate(300 70)"><rect width="60" height="60" rx="6" fill="#2DD4BF"/><circle cx="30" cy="22" r="7" fill="#0F2018"/><path d="M20 52 q10 -20 20 0z" fill="#0F2018"/></g>
  </svg>`;

  const escena = (id) => `<div class="escena">${(S[id] || S.terreno)()}<div class="escena-fade"></div></div>`;

  /* ============================ HUD ============================ */
  function pintarHUD() {
    const v = clamp(estado.indicador), nv = nivel(estado.xp), xpEn = estado.xp % 100;
    hud.innerHTML = `
      <div class="hud-btns">
        <button id="btn-home" class="hud-menu" title="Menú principal">🏠</button>
        <button id="btn-menu" class="hud-menu" title="Reiniciar">↻</button>
      </div>
      <div class="hud-perfil">
        <div class="hud-avatar">${rivas(40)}</div>
        <div class="hud-nivel">
          <div class="hud-nivel-top"><span>Nivel ${nv}</span><span class="hud-xp-num">${xpEn}/100 XP</span></div>
          <div class="hud-xpbar"><div class="hud-xpfill" style="width:${xpEn}%"></div></div>
        </div>
      </div>
      <div class="hud-score ${v>=65?"ok":v>=40?"med":"bajo"}">
        <svg viewBox="0 0 40 44" width="30" height="33"><path d="M20 2 L37 9 V22 Q37 38 20 42 Q3 38 3 22 V9z" fill="currentColor" opacity=".18" stroke="currentColor" stroke-width="2"/></svg>
        <div class="hud-score-txt"><b id="score-num">${v}</b><small>Seguridad</small></div>
      </div>`;
    document.getElementById("btn-menu").onclick = reiniciar;
    document.getElementById("btn-home").onclick = () => { if (onHome) onHome(); };
  }
  function ganar(indDelta, xpDelta) {
    estado.indicador = clamp(estado.indicador + (indDelta || 0));
    estado.xp += (xpDelta || 0); guardar(); pintarHUD();
    if (xpDelta) flotante("+" + xpDelta + " XP");
  }
  function flotante(txt) {
    const el = document.createElement("div"); el.className = "flotante-xp"; el.textContent = txt;
    hud.appendChild(el); setTimeout(() => el.remove(), 1200);
  }

  /* ============================ NAV ============================ */
  const sig = (v) => (typeof v === "function" ? v(estado) : v);
  const ir = (id) => { estado.nodo = sig(id); guardar(); render(); };

  function render() {
    const nodo = cap.nodos[estado.nodo];
    if (nodo.tipo === "portada") hud.style.display = "none"; else { hud.style.display = "flex"; pintarHUD(); }
    estado.mostrado[estado.nodo] = true; app.scrollTop = 0;
    ({ portada: rPortada, escena: rEscena, inspeccion: rInspeccion, reporte: rReporte, final: rFinal }[nodo.tipo] || rEscena)(nodo);
  }

  function bloqueDialogo(personaId, texto) {
    if (!texto) return "";
    const p = persona(personaId);
    return `<div class="dialogo"><div class="dialogo-av">${rivas(54)}</div>
      <div class="dialogo-cuerpo"><div class="dialogo-nombre">${esc(p ? p.nombre : "")}<span>${esc(p ? p.rol : "")}</span></div>
      <div class="dialogo-texto">${esc(texto)}</div></div></div>`;
  }
  const card = (inner, cls) => `<div class="card ${cls || ""}">${inner}</div>`;
  const chipPaso = (t) => t ? `<div class="chip-paso">${esc(t)}</div>` : "";

  function rPortada(nodo) {
    app.innerHTML = `
      <div class="portada">
        <div class="portada-cielo">${S.terreno()}<div class="dust"></div><div class="dust d2"></div><div class="dust d3"></div></div>
        <div class="portada-cont">
          <div class="logo-escudo">
            <svg viewBox="0 0 80 92" width="86" height="99">
              <defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFC24B"/><stop offset="100%" stop-color="#FF6B1A"/></linearGradient></defs>
              <path d="M40 3 L74 16 V40 Q74 74 40 89 Q6 74 6 40 V16z" fill="#0E1424" stroke="url(#lg)" stroke-width="3"/>
              <circle cx="36" cy="44" r="13" fill="none" stroke="url(#lg)" stroke-width="4"/><line x1="46" y1="54" x2="56" y2="64" stroke="url(#lg)" stroke-width="5" stroke-linecap="round"/>
            </svg>
          </div>
          <h1 class="portada-titulo">${esc(nodo.titulo)}</h1>
          <div class="portada-sub">${esc(nodo.subtitulo)}</div>
          <div class="portada-chip">${esc(nodo.capitulo)}</div>
          ${bloqueDialogo(nodo.persona, nodo.dialogo)}
          <button class="btn primario grande" id="jugar">${esc(nodo.boton)} <span>▸</span></button>
        </div>
      </div>`;
    document.getElementById("jugar").onclick = () => ir(nodo.siguiente);
  }

  function rEscena(nodo) {
    app.innerHTML =
      card((nodo.ilustracion ? escena(nodo.ilustracion) : "") +
        `<div class="card-pad"><h2>${esc(nodo.titulo)}</h2><p class="cuerpo">${esc(nodo.cuerpo)}</p>
         ${bloqueDialogo(nodo.persona, nodo.dialogo)}</div>`, "con-escena") +
      `<button class="btn primario" id="continuar">Continuar <span>▸</span></button>`;
    document.getElementById("continuar").onclick = () => ir(nodo.siguiente);
  }

  /* ===================== MECÁNICA · INSPECCIÓN EN TERRENO =============== */
  const VLABEL = { efectivo: "Efectivo", degradado: "Degradado", ausente: "Ausente" };
  function rInspeccion(nodo) {
    let fase = "observar";
    const vistos = {};       // hotspots inspeccionados
    let veredicto = null, respuesta = null;

    function pintar() {
      if (fase === "observar") return pintarObservar();
      if (fase === "veredicto") return pintarVeredicto();
      if (fase === "respuesta") return pintarRespuesta();
    }

    function cabecera() {
      return `<div class="insp-cab">
        <div class="chip-paso">🔎 Paso 7 · Verificación en terreno</div>
        <div class="insp-est">Estación ${nodo.estacion}/${nodo.total}</div></div>
        <h2 style="margin:6px 0 2px">${esc(nodo.titulo)}</h2>
        <div class="insp-control">Control: <b>${esc(nodo.control)}</b></div>`;
    }

    // ---- Fase 1: observar (hotspots) ----
    function pintarObservar() {
      const nVistos = Object.keys(vistos).length, total = nodo.hotspots.length;
      const pins = nodo.hotspots.map((h, i) =>
        `<button class="pin ${vistos[i] ? "visto" : ""} ${h.etq.startsWith("Preguntar") ? "pin-preg" : ""}" style="left:${h.x}%;top:${h.y}%" data-i="${i}">${vistos[i] ? "✓" : (h.etq.startsWith("Preguntar") ? "?" : "+")}</button>`).join("");
      const obs = nodo.hotspots.map((h, i) => vistos[i]
        ? `<div class="obs ${h.clave ? "clave" : ""}"><b>${esc(h.etq)}</b><span>${esc(h.hallazgo)}</span></div>` : "").join("");
      app.innerHTML = card(
        `<div class="escena escena-insp">${(S[nodo.ilustracion] || S.terreno)()}<div class="pins">${pins}</div></div>` +
        `<div class="card-pad">${cabecera()}
          <div class="insp-hint">Toca los puntos para observar · <b>${nVistos}/${total}</b></div>
          <div class="obs-list">${obs || `<div class="obs vacia">Aún no has inspeccionado nada.</div>`}</div>
         </div>`, "con-escena") +
        `<button class="btn primario" id="ir-veredicto" ${nVistos < total ? "disabled" : ""}>${nVistos < total ? "Inspecciona todos los puntos" : "Emitir veredicto ▸"}</button>`;
      app.querySelectorAll(".pin").forEach((b) => b.onclick = () => {
        const i = +b.dataset.i;
        if (!vistos[i]) { vistos[i] = true; if (!reduce) flotante("+2 XP"); estado.xp += 2; guardar(); pintarHUD(); }
        pintar();
      });
      const vb = document.getElementById("ir-veredicto");
      if (vb) vb.onclick = () => { fase = "veredicto"; pintar(); };
    }

    // ---- Fase 2: veredicto ----
    function pintarVeredicto() {
      app.innerHTML = card(
        `<div class="card-pad">${cabecera()}
          <div class="fase-lbl">Tu veredicto sobre el control crítico</div>
          <div class="veredictos">
            ${["efectivo", "degradado", "ausente"].map((id) =>
              `<button class="ver-btn ver-${id}" data-v="${id}">${VLABEL[id]}</button>`).join("")}
          </div>
          <details class="repaso"><summary>Repasar observaciones</summary>
            ${nodo.hotspots.map((h) => `<div class="obs ${h.clave ? "clave" : ""}"><b>${esc(h.etq)}</b><span>${esc(h.hallazgo)}</span></div>`).join("")}
          </details>
         </div>`, "");
      app.querySelectorAll(".ver-btn").forEach((b) => b.onclick = () => {
        veredicto = b.dataset.v;
        const ok = veredicto === nodo.veredictoOk;
        ganar(ok ? 8 : -4, ok ? 20 : 0);
        app.querySelectorAll(".ver-btn").forEach((x) => { x.disabled = true; x.classList.add("inerte"); });
        app.querySelector(`.ver-${nodo.veredictoOk}`).classList.add("correcto");
        if (!ok) b.classList.add("incorrecto");
        const fb = document.createElement("div");
        fb.className = "feedback " + (ok ? "fb-ok" : "fb-mal");
        fb.innerHTML = `<div class="fb-cab">${ok ? "✓ Veredicto correcto" : "Veredicto a revisar"}: ${VLABEL[nodo.veredictoOk]}</div>
          <p>${esc(nodo.vExplic)}</p><button class="btn primario" id="ir-respuesta">Definir respuesta ▸</button>`;
        app.querySelector(".card-pad").appendChild(fb);
        fb.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
        document.getElementById("ir-respuesta").onclick = () => { fase = "respuesta"; pintar(); };
      });
    }

    // ---- Fase 3: respuesta (Paso 9) ----
    const respBaraja = barajar(nodo.respuestas.slice()); // evita que la correcta caiga siempre primera
    function pintarRespuesta() {
      app.innerHTML = card(
        `<div class="card-pad">${cabecera()}
          <div class="fase-lbl">🛡 Paso 9 · ¿Cómo respondes?</div>
          <div class="opciones">
            ${respBaraja.map((r) => `<button class="btn opcion" data-r="${r.id}"><span class="op-dot"></span><span>${esc(r.label)}</span></button>`).join("")}
          </div></div>`, "");
      app.querySelectorAll(".opcion").forEach((b) => b.onclick = () => {
        respuesta = b.dataset.r;
        const ok = respuesta === nodo.respuestaOk;
        ganar(ok ? 8 : -5, ok ? 20 : 0);
        app.querySelectorAll(".opcion").forEach((x) => { x.disabled = true; x.classList.add("inerte"); });
        b.classList.remove("inerte"); b.classList.add(ok ? "elegida-ok" : "elegida-mal");
        // registrar hallazgo para el reporte
        const bienTotal = (veredicto === nodo.veredictoOk) && ok;
        estado.reporte.push({ estacion: nodo.estacion, control: nodo.control, veredicto: VLABEL[veredicto] || "—", ok: bienTotal });
        guardar();
        const fb = document.createElement("div");
        fb.className = "feedback " + (ok ? "fb-ok" : "fb-mal");
        fb.innerHTML = `<div class="fb-cab">${ok ? "✓ Respuesta correcta" : "Respuesta a revisar"}</div>
          <p>${esc(nodo.rExplic)}</p><button class="btn primario" id="seguir">${nodo.estacion < nodo.total ? "Siguiente estación ▸" : "Ir al reporte ▸"}</button>`;
        app.querySelector(".card-pad").appendChild(fb);
        fb.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
        document.getElementById("seguir").onclick = () => ir(nodo.siguiente);
      });
    }

    pintar();
  }

  /* ===================== PASO 8 · REPORTE ===================== */
  function rReporte(nodo) {
    const filas = estado.reporte.map((r) => `
      <div class="rep-fila ${r.ok ? "ok" : "mal"}">
        <div class="rep-ico">${r.ok ? "✓" : "!"}</div>
        <div class="rep-txt"><b>Estación ${r.estacion} · ${esc(r.control)}</b><span>Veredicto: ${esc(r.veredicto)}${r.ok ? "" : " · revisar criterio"}</span></div>
      </div>`).join("");
    const aciertos = estado.reporte.filter((r) => r.ok).length;
    app.innerHTML = chipPaso("Paso 8 · Reporte del desempeño") + card(
      `<div class="card-pad">
        <h2>${esc(nodo.titulo)}</h2>
        <p class="cuerpo">${esc(nodo.cuerpo)}</p>
        <div class="reporte">${filas || "<p>Sin registros.</p>"}</div>
        <div class="rep-resumen">Verificaciones correctas: <b>${aciertos}/${estado.reporte.length}</b></div>
      </div>`, "") +
      `<button class="btn primario" id="enviar">${esc(nodo.boton)} ▸</button>`;
    document.getElementById("enviar").onclick = () => { ganar(6, 15); ir(nodo.siguiente); };
  }

  /* -------------------------------- FINAL ------------------------------- */
  function rFinal(nodo) {
    const v = clamp(estado.indicador);
    app.innerHTML = card(
      escena(nodo.ilustracion) +
      `<div class="card-pad">
        <h2 style="text-align:center">${esc(nodo.titulo)}</h2>
        <div class="resultado">
          <div class="metrica"><b>${v}</b><small>Seguridad</small></div>
          <div class="metrica"><b>Nv ${nivel(estado.xp)}</b><small>Nivel</small></div>
          <div class="metrica"><b>${estado.xp}</b><small>XP total</small></div>
        </div>
        ${nodo.insignia ? `<div class="insignia"><span class="ins-medalla">🏅</span> Insignia obtenida<b>${esc(nodo.insignia)}</b></div>` : ""}
        <p class="cuerpo">${esc(nodo.cuerpo)}</p>
        ${bloqueDialogo(nodo.persona, nodo.dialogo)}
      </div>`, "con-escena") +
      `<button class="btn primario" id="reiniciar-final">Volver a jugar</button>
       <button class="btn" id="volver-menu">Volver al menú principal</button>
       <div class="prox">🎓 Has completado el arco de los 9 pasos CCM (Capítulos A–D)</div>`;
    document.getElementById("reiniciar-final").onclick = reiniciarDirecto;
    document.getElementById("volver-menu").onclick = () => { if (onHome) onHome(); };
    if (!reduce) confeti();
  }

  /* ------------------------------ CONFETI ------------------------------- */
  function confeti() {
    const cv = document.createElement("canvas"); cv.className = "confeti"; app.appendChild(cv);
    const ctx = cv.getContext("2d");
    const w = cv.width = app.clientWidth, h = cv.height = app.clientHeight;
    const cols = ["#FFC24B", "#FF6B1A", "#2DD4BF", "#9B7BFF", "#EAF0FA"];
    const P = Array.from({ length: 90 }, () => ({
      x: Math.random() * w, y: -20 - Math.random() * h * 0.4, s: 4 + Math.random() * 5,
      vy: 2 + Math.random() * 3, vx: -1 + Math.random() * 2, c: cols[(Math.random() * cols.length) | 0],
      r: Math.random() * 6, vr: -0.2 + Math.random() * 0.4
    }));
    let t = 0;
    (function loop() {
      t++; ctx.clearRect(0, 0, w, h);
      P.forEach((p) => { p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
        ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 1.6); ctx.restore(); });
      if (t < 180) requestAnimationFrame(loop); else cv.remove();
    })();
  }

  /* ------------------------------ RESET ------------------------------- */
  function reiniciarDirecto() { try { localStorage.removeItem(CLAVE); } catch (e) {} estado = nuevoEstado(); guardar(); render(); }
  function reiniciar() {
    const ov = document.createElement("div"); ov.className = "modal-ov";
    ov.innerHTML = `<div class="modal"><h3>¿Reiniciar el capítulo?</h3><p>Perderás el progreso de esta partida.</p>
      <div class="modal-btns"><button class="btn" id="m-no">Cancelar</button><button class="btn primario" id="m-si">Reiniciar</button></div></div>`;
    document.querySelector(".telefono").appendChild(ov);
    requestAnimationFrame(() => ov.classList.add("visible"));
    const cerrar = () => ov.remove();
    ov.addEventListener("click", (e) => { if (e.target === ov) cerrar(); });
    ov.querySelector("#m-no").onclick = cerrar;
    ov.querySelector("#m-si").onclick = () => { cerrar(); reiniciarDirecto(); };
  }

  render();
}
window.MotorD = { iniciar: iniciarMotorD };

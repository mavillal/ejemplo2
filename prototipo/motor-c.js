/*
 * Motor del Capítulo C — SIMULACIÓN DE GESTIÓN (dashboard).
 * Tipos de nodo: portada | escena | asignar | estandar | turno | final
 * Comparte el lenguaje visual de los capítulos A y B (avatar, HUD, confeti).
 */
function iniciarMotorC(onHome) {
  "use strict";

  const cap = window.CAPITULO_C;
  const app = document.getElementById("app");
  const hud = document.getElementById("hud");
  const CLAVE = "ccm_cap_c_estado_v1";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let simTimer = null; // intervalo de la simulación de turno (se limpia al navegar)

  let estado = cargar() || nuevoEstado();
  function nuevoEstado() { return { nodo: cap.inicio, indicador: cap.indicadorInicial, xp: 0, mostrado: {} }; }
  const guardar = () => { try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) {} };
  function cargar() { try { return JSON.parse(localStorage.getItem(CLAVE)); } catch (e) { return null; } }
  const clamp = (n) => Math.max(0, Math.min(100, n));
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
  const persona = (id) => (id ? cap.personajes[id] : null);
  const nivel = (xp) => Math.floor(xp / 100) + 1;

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
  S.centro = () => `<svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice">
    <defs><radialGradient id="cg" cx="50%" cy="35%" r="65%"><stop offset="0%" stop-color="#12233F"/><stop offset="100%" stop-color="#0A1220"/></radialGradient></defs>
    <rect width="400" height="210" fill="url(#cg)"/>
    <g stroke="#182842" stroke-width="1"><path d="M0 70 H400 M0 140 H400 M100 0 V210 M200 0 V210 M300 0 V210"/></g>
    <!-- pantallas -->
    <g>
      <rect x="30" y="40" width="100" height="60" rx="6" fill="#0F1D33" stroke="#2DD4BF" stroke-width="1.5"/>
      <polyline points="40,86 60,70 78,78 100,54 120,60" fill="none" stroke="#2DD4BF" stroke-width="2.5"/>
      <rect x="150" y="40" width="100" height="60" rx="6" fill="#0F1D33" stroke="#FF8A3D" stroke-width="1.5"/>
      <g transform="translate(200 70)"><path d="M-30 0 a30 30 0 0 1 60 0" fill="none" stroke="#26314D" stroke-width="6"/><path d="M-30 0 a30 30 0 0 1 42 -21" fill="none" stroke="#FF8A3D" stroke-width="6"/><line x1="0" y1="0" x2="14" y2="-14" stroke="#FFC53D" stroke-width="2.5"/></g>
      <rect x="270" y="40" width="100" height="60" rx="6" fill="#0F1D33" stroke="#9B7BFF" stroke-width="1.5"/>
      ${[0,1,2].map(i=>`<rect x="${284+i*28}" y="${86-(i+1)*12}" width="16" height="${(i+1)*12}" rx="2" fill="#9B7BFF" opacity=".7"/>`).join("")}
    </g>
    <!-- consola -->
    <rect x="0" y="150" width="400" height="60" fill="#101E36"/>
    <g fill="#2DD4BF"><circle cx="60" cy="175" r="5"/><circle cx="90" cy="175" r="5" fill="#FFC53D"/><circle cx="120" cy="175" r="5" fill="#FF5A5F"/></g>
    <rect x="180" y="168" width="180" height="8" rx="4" fill="#1B2C49"/><rect x="180" y="168" width="120" height="8" rx="4" fill="#2DD4BF"/>
  </svg>`;

  S.org = () => `<svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice">
    <rect width="400" height="210" fill="#0F1830"/>
    <g stroke="#33456B" stroke-width="2" fill="none"><path d="M200 46 V78 M120 110 V78 H280 V110 M200 78 V110"/></g>
    ${[[200,32,"#FF8A3D"],[120,124,"#2DD4BF"],[200,124,"#FFC53D"],[280,124,"#9B7BFF"]].map(([x,y,c])=>`<g transform="translate(${x} ${y})"><circle r="15" fill="#16223F" stroke="${c}" stroke-width="2.5"/><circle cy="-4" r="5" fill="${c}"/><path d="M-7 8 a7 7 0 0 1 14 0" fill="${c}"/></g>`).join("")}
  </svg>`;

  S.medidor = () => `<svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice">
    <rect width="400" height="210" fill="#0F1830"/>
    ${[80,200,320].map((x,i)=>`<g transform="translate(${x} 110)">
      <path d="M-46 0 a46 46 0 0 1 92 0" fill="none" stroke="#26314D" stroke-width="12"/>
      <path d="M-46 0 a46 46 0 0 1 92 0" fill="none" stroke="${["#FF5A5F","#FFC53D","#2DD4BF"][i]}" stroke-width="12" stroke-dasharray="${48+i*30} 999"/>
      <line x1="0" y1="0" x2="${-20+i*22}" y2="${-38+i*6}" stroke="#EAF0FA" stroke-width="3" stroke-linecap="round"/>
      <circle r="5" fill="#EAF0FA"/></g>`).join("")}
  </svg>`;

  const escena = (id) => `<div class="escena">${(S[id] || S.centro)()}<div class="escena-fade"></div></div>`;

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
    document.getElementById("btn-home").onclick = () => { if (simTimer) { clearInterval(simTimer); simTimer = null; } if (onHome) onHome(); };
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
  function ir(id) { if (simTimer) { clearInterval(simTimer); simTimer = null; } estado.nodo = sig(id); guardar(); render(); }

  function render() {
    const nodo = cap.nodos[estado.nodo];
    if (nodo.tipo === "portada") hud.style.display = "none"; else { hud.style.display = "flex"; pintarHUD(); }
    estado.mostrado[estado.nodo] = true; app.scrollTop = 0;
    ({ portada: rPortada, escena: rEscena, asignar: rAsignar, estandar: rEstandar, turno: rTurno, final: rFinal }[nodo.tipo] || rEscena)(nodo);
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
  const cabecera = (nodo) => `<div class="card-pad"><h2>${esc(nodo.titulo)}</h2>${nodo.cuerpo ? `<p class="cuerpo">${esc(nodo.cuerpo)}</p>` : ""}</div>`;

  /* ------------------------------- PORTADA ------------------------------- */
  function rPortada(nodo) {
    app.innerHTML = `
      <div class="portada">
        <div class="portada-cielo">${S.centro()}<div class="dust"></div><div class="dust d2"></div><div class="dust d3"></div></div>
        <div class="portada-cont">
          <div class="logo-escudo">
            <svg viewBox="0 0 80 92" width="86" height="99">
              <defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFC24B"/><stop offset="100%" stop-color="#FF6B1A"/></linearGradient></defs>
              <path d="M40 3 L74 16 V40 Q74 74 40 89 Q6 74 6 40 V16z" fill="#0E1424" stroke="url(#lg)" stroke-width="3"/>
              <path d="M24 62 a16 16 0 0 1 32 0" fill="none" stroke="url(#lg)" stroke-width="4"/>
              <line x1="40" y1="62" x2="52" y2="46" stroke="#2DD4BF" stroke-width="4" stroke-linecap="round"/><circle cx="40" cy="62" r="4" fill="url(#lg)"/>
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

  /* ===================== MECÁNICA 1 · ASIGNAR DUEÑOS ==================== */
  function rAsignar(nodo) {
    const asign = {}; // controlId -> duenoId
    let sel = null, resuelto = false;
    const nombreDueno = (id) => (nodo.duenos.find((d) => d.id === id) || {}).nombre || "";

    function pintar() {
      const ctrlHTML = nodo.controles.map((c) => {
        const d = asign[c.id];
        const cls = resuelto ? (d === c.dueno ? "ok" : "mal") : (sel === c.id ? "sel" : "");
        return `<button class="ctrl-card ${cls}" data-c="${c.id}">
          <span class="ctrl-t">${esc(c.t)}</span>
          <span class="ctrl-d ${d ? "puesto" : ""}">${d ? "👤 " + esc(nombreDueno(d)) : "sin dueño — toca para asignar"}</span></button>`;
      }).join("");
      const rosterHTML = nodo.duenos.map((d) =>
        `<button class="persona ${sel ? "activo" : ""}" data-d="${d.id}"><b>${esc(d.nombre)}</b><small>${esc(d.nivel)}</small></button>`).join("");
      const completo = nodo.controles.every((c) => asign[c.id]);
      app.innerHTML = chipPaso("Paso 6 · Asignar dueños") + card(
        cabecera({ titulo: nodo.titulo, cuerpo: null }) +
        `<div class="card-pad" style="padding-top:0">
          <div class="ctrl-list">${ctrlHTML}</div>
          <div class="roster-lbl">${sel ? "Ahora toca el dueño para «" + esc(nodo.controles.find((c) => c.id === sel).t) + "»" : "Toca un control para asignarle dueño"}</div>
          <div class="roster">${rosterHTML}</div>
        </div>`, "") +
        `<button class="btn primario" id="verificar" ${completo ? "" : "disabled"}>Verificar asignaciones</button>`;

      app.querySelectorAll(".ctrl-card").forEach((b) => b.onclick = () => {
        if (resuelto) return; const id = b.dataset.c;
        if (asign[id]) { delete asign[id]; sel = null; } else { sel = sel === id ? null : id; }
        pintar();
      });
      app.querySelectorAll(".persona").forEach((b) => b.onclick = () => {
        if (resuelto || !sel) return; asign[sel] = b.dataset.d; sel = null; pintar();
      });
      const vb = document.getElementById("verificar"); if (vb) vb.onclick = verificar;
    }

    function verificar() {
      const bien = nodo.controles.every((c) => asign[c.id] === c.dueno);
      resuelto = true; pintar();
      if (!bien) {
        resuelto = false; ganar(-4, 0);
        setTimeout(() => {
          const fb = document.createElement("div"); fb.className = "feedback fb-mal";
          fb.innerHTML = `<div class="fb-cab">Revisa los dueños</div><p>${esc(nodo.motivoMal)}</p><button class="btn primario" id="reintentar">Ajustar</button>`;
          app.appendChild(fb); fb.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
          document.getElementById("reintentar").onclick = () => { nodo.controles.forEach((c) => { if (asign[c.id] !== c.dueno) delete asign[c.id]; }); pintar(); };
        }, 350);
        return;
      }
      ganar(10, 30);
      setTimeout(() => {
        const fb = document.createElement("div"); fb.className = "feedback fb-ok";
        fb.innerHTML = `<div class="fb-cab">✓ Dueños asignados</div><p>${esc(nodo.exito)}</p><button class="btn primario" id="seguir">Continuar <span>▸</span></button>`;
        app.appendChild(fb); fb.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
        document.getElementById("seguir").onclick = () => ir(nodo.siguiente);
      }, 350);
    }
    pintar();
  }

  /* ===================== MECÁNICA 2 · ESTÁNDARES (SLIDERS) ============== */
  function rEstandar(nodo) {
    const val = {}; nodo.controles.forEach((c) => (val[c.id] = 1));
    let resuelto = false;

    function pintar() {
      const filas = nodo.controles.map((c) => {
        const cls = resuelto ? (val[c.id] === c.target ? "ok" : "mal") : "";
        return `<div class="std-fila ${cls}">
          <div class="std-top"><b>${esc(c.t)}</b><span class="std-val">${esc(nodo.escala[val[c.id]])}</span></div>
          <input type="range" min="0" max="${nodo.escala.length - 1}" step="1" value="${val[c.id]}" data-c="${c.id}" class="slider">
          <div class="std-escala">${nodo.escala.map((e) => `<span>${esc(e)}</span>`).join("")}</div>
          ${resuelto ? `<div class="std-nota ${val[c.id] === c.target ? "ok" : "mal"}">${val[c.id] === c.target ? "✓ " : "✗ "}${esc(c.nota)}</div>` : ""}
        </div>`;
      }).join("");
      app.innerHTML = chipPaso("Paso 5 · Estándar de verificación") + card(
        cabecera({ titulo: nodo.titulo, cuerpo: null }) +
        `<div class="card-pad" style="padding-top:0"><div class="std-list">${filas}</div></div>`, "") +
        `<button class="btn primario" id="confirmar">Confirmar estándares</button>`;
      app.querySelectorAll(".slider").forEach((s) => s.oninput = () => {
        if (resuelto) return; val[s.dataset.c] = +s.value;
        s.closest(".std-fila").querySelector(".std-val").textContent = nodo.escala[+s.value];
      });
      document.getElementById("confirmar").onclick = confirmar;
    }

    function confirmar() {
      const bien = nodo.controles.every((c) => val[c.id] === c.target);
      resuelto = true; pintar();
      if (!bien) {
        resuelto = false; ganar(-4, 0);
        setTimeout(() => {
          const fb = document.createElement("div"); fb.className = "feedback fb-mal";
          fb.innerHTML = `<div class="fb-cab">Ajusta la frecuencia</div><p>Revisa las notas: cada control necesita una frecuencia acorde a cómo puede fallar.</p><button class="btn primario" id="reintentar">Ajustar</button>`;
          app.appendChild(fb); fb.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
          document.getElementById("reintentar").onclick = pintar;
        }, 350);
        return;
      }
      ganar(10, 30);
      setTimeout(() => {
        const fb = document.createElement("div"); fb.className = "feedback fb-ok";
        fb.innerHTML = `<div class="fb-cab">✓ Estándares definidos</div><p>${esc(nodo.exito)}</p><button class="btn primario" id="seguir">Continuar <span>▸</span></button>`;
        app.appendChild(fb); fb.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
        document.getElementById("seguir").onclick = () => ir(nodo.siguiente);
      }, 350);
    }
    pintar();
  }

  /* ===================== MECÁNICA 3 · SIMULACIÓN DE TURNO =============== */
  // Se construye el tablero UNA vez y solo se actualizan las partes que cambian
  // en cada tick (barra de avance, estado de medidores y la alerta activa).
  function rTurno(nodo) {
    const ctr = nodo.controles.map((c) => ({ ...c, estado: "ok", tRestante: 0, txtAlerta: "" }));
    const DUR = Math.round((nodo.duracionSeg || 26) * 10); // ticks de 100ms
    let progreso = 0, resueltos = 0, incidentes = 0, activa = null, finalizado = false, alertaRender = "init";

    app.innerHTML = card(
      `<div class="card-pad">
        <div class="turno-cab"><h2 style="margin:0">${esc(nodo.titulo)}</h2><div class="turno-kpi">🛡 <b id="kpi-seg">${clamp(estado.indicador)}</b></div></div>
        <div class="turno-prog"><div class="turno-prog-fill" id="prog-fill"></div></div>
        <div class="turno-prog-lbl" id="prog-lbl"></div>
        <div class="gauges">${ctr.map((c, i) => `
          <div class="gauge est-ok" id="g-${i}">
            <div class="gauge-top"><b>${esc(c.t)}</b><span class="gauge-pill" id="p-${i}">OK</span></div>
            <div class="gauge-sub">${esc(c.dueno)}</div>
            <div class="gauge-bar"><div class="gauge-fill"></div></div>
          </div>`).join("")}</div>
        <div id="alerta-box"></div>
      </div>`, "");
    const progFill = document.getElementById("prog-fill");
    const progLbl = document.getElementById("prog-lbl");
    const kpi = document.getElementById("kpi-seg");
    const alertaBox = document.getElementById("alerta-box");

    function renderAlerta() {
      const clave = activa == null ? "vacia" : activa + "";
      if (clave === alertaRender) { // solo actualiza la barra de cuenta atrás
        if (activa != null) { const f = alertaBox.querySelector(".alerta-cd-fill"); if (f) f.style.width = (ctr[activa].tRestante / 50) * 100 + "%"; }
        return;
      }
      alertaRender = clave;
      if (activa == null) { alertaBox.innerHTML = `<div class="alerta vacia">Turno estable · vigila el tablero</div>`; return; }
      alertaBox.innerHTML = `<div class="alerta">
        <div class="alerta-txt"><b>⚠ ${esc(ctr[activa].txtAlerta)}</b><span>${esc(ctr[activa].t)} · ${esc(ctr[activa].dueno)}</span></div>
        <div class="alerta-cd"><div class="alerta-cd-fill" style="width:100%"></div></div>
        <button class="btn primario alerta-btn" data-a="responder">Responder</button></div>`;
      alertaBox.querySelector('[data-a="responder"]').onclick = responder;
    }
    function updateGauges() {
      ctr.forEach((c, i) => {
        const g = document.getElementById("g-" + i);
        const cls = "gauge est-" + c.estado;
        if (g.className !== cls) g.className = cls;
        const pill = document.getElementById("p-" + i);
        const txt = c.estado === "ok" ? "OK" : c.estado === "alerta" ? "ALERTA" : "FALLA";
        if (pill.textContent !== txt) pill.textContent = txt;
      });
    }
    function pintar() {
      const pct = Math.min(100, Math.round((progreso / DUR) * 100));
      progFill.style.width = pct + "%";
      progLbl.innerHTML = `Avance del turno · ${pct}% &nbsp;·&nbsp; Resueltas ${resueltos} &nbsp;·&nbsp; Fallas ${incidentes}`;
      kpi.textContent = clamp(estado.indicador);
      updateGauges(); renderAlerta();
    }

    function responder() {
      if (activa == null) return;
      ctr[activa].estado = "ok"; ctr[activa].tRestante = 0; activa = null; resueltos++;
      ganar(3, 10); pintar();
    }

    function tick() {
      if (finalizado) return;
      progreso++;
      if (activa == null && progreso % 24 === 0 && progreso < DUR - 12) {
        const sanos = ctr.map((c, i) => ({ c, i })).filter((o) => o.c.estado === "ok");
        if (sanos.length) {
          const o = sanos[(Math.random() * sanos.length) | 0];
          o.c.estado = "alerta"; o.c.tRestante = 50;
          o.c.txtAlerta = nodo.alertas[(Math.random() * nodo.alertas.length) | 0];
          activa = o.i;
        }
      }
      if (activa != null) {
        ctr[activa].tRestante--;
        if (ctr[activa].tRestante <= 0) { ctr[activa].estado = "falla"; incidentes++; ganar(-7, 0); activa = null; }
      }
      if (progreso >= DUR) { finalizado = true; clearInterval(simTimer); simTimer = null; return finTurno(); }
      pintar();
    }

    function finTurno() {
      const v = clamp(estado.indicador);
      app.innerHTML = card(
        `<div class="card-pad turno-fin">
          <div class="fin-ico ${incidentes === 0 ? "perfecto" : ""}">${incidentes === 0 ? "🏆" : "✅"}</div>
          <h2 style="text-align:center">Turno completado</h2>
          <div class="resultado">
            <div class="metrica"><b>${resueltos}</b><small>Alertas resueltas</small></div>
            <div class="metrica"><b>${incidentes}</b><small>Fallas</small></div>
            <div class="metrica"><b>${v}</b><small>Seguridad</small></div>
          </div>
          <p class="cuerpo">${incidentes === 0
            ? "Turno impecable: ningún control cayó en rojo. Así se ve un sistema de controles críticos vivo y verificado."
            : "Turno cerrado. Cada alerta ignorada fue un control crítico degradado: en la vida real, un evento a punto de escapar. Repite para afinar tu respuesta."}</p>
        </div>`, "") +
        `<button class="btn primario" id="seguir">Cerrar turno <span>▸</span></button>`;
      document.getElementById("seguir").onclick = () => ir(nodo.siguiente);
    }

    pintar();
    if (simTimer) clearInterval(simTimer);
    simTimer = setInterval(tick, 100);
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
       <button class="btn" id="volver-menu">Volver al menú principal</button>`;
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
  function reiniciarDirecto() { if (simTimer) { clearInterval(simTimer); simTimer = null; } try { localStorage.removeItem(CLAVE); } catch (e) {} estado = nuevoEstado(); guardar(); render(); }
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
window.MotorC = { iniciar: iniciarMotorC };

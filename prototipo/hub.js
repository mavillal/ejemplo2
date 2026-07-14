/*
 * Hub — menú principal de «Guardianes del Control».
 * Compila los 4 capítulos (motores A–D, ya convertidos en window.MotorX.iniciar(onHome))
 * en una sola aplicación: pantalla de inicio con perfil agregado y selección de capítulo.
 * No depende de los motores internamente: solo lee sus localStorage y llama a .iniciar().
 */
(function () {
  "use strict";

  const app = document.getElementById("app");
  const hud = document.getElementById("hud");
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const CAPS = [
    {
      id: "a", letra: "A", emoji: "🔀", color: "#2DD4BF",
      nombre: "Fundamentos y planificación", pasos: "Pasos 1–2", tecnica: "Narrativa ramificada",
      clave: "ccm_cap_a_estado_v2", contenido: () => window.CAPITULO_A, motor: () => window.MotorA
    },
    {
      id: "b", letra: "B", emoji: "🔐", color: "#9B7BFF",
      nombre: "La Sala de Controles Críticos", pasos: "Pasos 3–4", tecnica: "Escape room",
      clave: "ccm_cap_b_estado_v1", contenido: () => window.CAPITULO_B, motor: () => window.MotorB
    },
    {
      id: "c", letra: "C", emoji: "🖥️", color: "#FF8A3D",
      nombre: "Centro de Operaciones", pasos: "Pasos 5–6", tecnica: "Simulación de gestión",
      clave: "ccm_cap_c_estado_v1", contenido: () => window.CAPITULO_C, motor: () => window.MotorC
    },
    {
      id: "d", letra: "D", emoji: "🔍", color: "#FFC53D",
      nombre: "Recorrida de Terreno", pasos: "Pasos 7–9", tecnica: "Inspección en terreno",
      clave: "ccm_cap_d_estado_v1", contenido: () => window.CAPITULO_D, motor: () => window.MotorD
    }
  ];

  function leer(cap) {
    try { return JSON.parse(localStorage.getItem(cap.clave)); } catch (e) { return null; }
  }

  function estadoDe(cap) {
    const est = leer(cap);
    const contenido = cap.contenido();
    if (!est || !est.mostrado || !Object.keys(est.mostrado).length) return { fase: "nuevo", est, pct: 0 };
    const nodo = contenido && contenido.nodos[est.nodo];
    const completado = nodo && nodo.tipo === "final";
    const totalNodos = contenido ? Object.keys(contenido.nodos).length : 1;
    const vistos = Object.keys(est.mostrado).length;
    const pct = Math.min(100, Math.round((vistos / totalNodos) * 100));
    return { fase: completado ? "completo" : "progreso", est, nodo, pct: completado ? 100 : pct };
  }

  function insigniaDe(cap, info) {
    if (info.fase !== "completo" || !info.nodo) return null;
    return info.nodo.insignia || null;
  }

  function perfilAgregado() {
    let xpTotal = 0, completados = 0, insignias = [];
    CAPS.forEach((cap) => {
      const info = estadoDe(cap);
      if (info.est) xpTotal += info.est.xp || 0;
      if (info.fase === "completo") { completados++; const ins = insigniaDe(cap, info); if (ins) insignias.push({ ins, color: cap.color }); }
    });
    return { xpTotal, nivel: Math.floor(xpTotal / 100) + 1, completados, insignias };
  }

  /* --------------------------- Avatar Rivas (mini) --------------------------- */
  function rivas(size) {
    size = size || 96;
    return `<svg viewBox="0 0 120 120" width="${size}" height="${size}" aria-label="Ingeniera Rivas">
      <defs>
        <radialGradient id="hrbg" cx="50%" cy="38%" r="70%"><stop offset="0%" stop-color="#243154"/><stop offset="100%" stop-color="#0E1424"/></radialGradient>
        <linearGradient id="hrhelm" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFC24B"/><stop offset="100%" stop-color="#F5820A"/></linearGradient>
        <linearGradient id="hrskin" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#F0C09A"/><stop offset="100%" stop-color="#E0A579"/></linearGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill="url(#hrbg)"/>
      <path d="M40 108 q20 -20 40 0 v12 h-40 z" fill="#FF6B1A"/><rect x="40" y="103" width="40" height="6" fill="#DCE7F5" opacity=".85"/>
      <path d="M22 120 q6 -26 38 -26 q32 0 38 26 z" fill="#FF7A22"/><path d="M52 96 h16 l-3 10 h-10 z" fill="#DCE7F5" opacity=".7"/>
      <path d="M32 62 q0 -34 28 -34 q28 0 28 34 q0 20 -6 30 q-4 -18 -22 -18 q-18 0 -22 18 q-6 -10 -6 -30z" fill="#2A2118"/>
      <path d="M40 58 q0 34 20 34 q20 0 20 -34 q0 -20 -20 -20 q-20 0 -20 20z" fill="url(#hrskin)"/>
      <circle cx="40" cy="64" r="4.5" fill="#E0A579"/><circle cx="80" cy="64" r="4.5" fill="#E0A579"/>
      <path d="M30 52 q0 -30 30 -30 q30 0 30 30 q0 3 -2 4 h-56 q-2 -1 -2 -4z" fill="url(#hrhelm)"/>
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

  /* -------------------------------- RENDER -------------------------------- */
  function renderHub() {
    hud.style.display = "none";
    const perfil = perfilAgregado();

    const tarjetas = CAPS.map((cap) => {
      const info = estadoDe(cap);
      const etiqueta = { nuevo: "No iniciado", progreso: "En progreso", completo: "✓ Completado" }[info.fase];
      const insignia = insigniaDe(cap, info);
      return `<button class="cap-card fase-${info.fase}" data-id="${cap.id}" style="--cc:${cap.color}">
        <div class="cap-card-top">
          <div class="cap-emblema">${esc(cap.emoji)}</div>
          <div class="cap-letra">CAP. ${esc(cap.letra)}</div>
        </div>
        <div class="cap-nombre">${esc(cap.nombre)}</div>
        <div class="cap-meta"><span>${esc(cap.pasos)}</span><span class="cap-dot">·</span><span>${esc(cap.tecnica)}</span></div>
        <div class="cap-bar"><div class="cap-bar-fill" style="width:${info.pct}%"></div></div>
        <div class="cap-footer">
          <span class="cap-estado est-${info.fase}">${etiqueta}</span>
          ${insignia ? `<span class="cap-ins">🏅 ${esc(insignia)}</span>` : ""}
        </div>
      </button>`;
    }).join("");

    const insigniasHTML = perfil.insignias.length
      ? perfil.insignias.map((i) => `<div class="badge-chip" style="--bc:${i.color}">🏅 ${esc(i.ins)}</div>`).join("")
      : `<div class="badge-vacio">Completa capítulos para ganar insignias.</div>`;

    app.innerHTML = `
      <div class="hub">
        <div class="hub-hero">
          <div class="hub-hero-bg"></div>
          <div class="hub-hero-cont">
            <div class="hub-avatar">${rivas(64)}</div>
            <h1 class="hub-titulo">Guardianes del Control</h1>
            <div class="hub-sub">Gestión de Controles Críticos · Guía ICMM 2026</div>
          </div>
        </div>
        <div class="hub-perfilcard">
          <div class="hub-perfil-fila">
            <div class="hub-stat"><b>Nv ${perfil.nivel}</b><small>Nivel</small></div>
            <div class="hub-stat"><b>${perfil.xpTotal}</b><small>XP total</small></div>
            <div class="hub-stat"><b>${perfil.completados}/4</b><small>Capítulos</small></div>
          </div>
          <div class="hub-badges">${insigniasHTML}</div>
        </div>
        <div class="hub-lbl">Elige un capítulo</div>
        <div class="cap-grid">${tarjetas}</div>
        <button class="hub-reset" id="hub-reset">Reiniciar todo el progreso</button>
        <div class="hub-foot">Arco completo · Pasos 1–9 del proceso CCM (ICMM 2026)</div>
      </div>`;

    app.querySelectorAll(".cap-card").forEach((b) => b.onclick = () => abrir(b.dataset.id));
    document.getElementById("hub-reset").onclick = confirmarReset;
  }

  function abrir(id) {
    const cap = CAPS.find((c) => c.id === id);
    if (!cap || !cap.motor()) return;
    cap.motor().iniciar(renderHub);
  }

  function confirmarReset() {
    const ov = document.createElement("div");
    ov.className = "modal-ov";
    ov.innerHTML = `<div class="modal">
        <h3>¿Reiniciar todo el progreso?</h3>
        <p>Se borrará el avance de los 4 capítulos, XP e insignias.</p>
        <div class="modal-btns">
          <button class="btn" id="m-no">Cancelar</button>
          <button class="btn primario" id="m-si">Reiniciar todo</button>
        </div></div>`;
    document.querySelector(".telefono").appendChild(ov);
    requestAnimationFrame(() => ov.classList.add("visible"));
    const cerrar = () => ov.remove();
    ov.addEventListener("click", (e) => { if (e.target === ov) cerrar(); });
    ov.querySelector("#m-no").onclick = cerrar;
    ov.querySelector("#m-si").onclick = () => {
      CAPS.forEach((cap) => { try { localStorage.removeItem(cap.clave); } catch (e) {} });
      cerrar(); renderHub();
    };
  }

  window.APP_HUB = { render: renderHub };
  renderHub();
})();

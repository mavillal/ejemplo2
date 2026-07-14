/*
 * Motor del Capítulo B — mecánicas de ESCAPE ROOM (no hay preguntas de alternativas).
 * Tipos de nodo: portada | escena | sorteo | filtro | codigo | teclado | final
 * Comparte el lenguaje visual del Capítulo A (avatar de Rivas, HUD, confeti).
 */
(function () {
  "use strict";

  const cap = window.CAPITULO_B;
  const app = document.getElementById("app");
  const hud = document.getElementById("hud");
  const CLAVE = "ccm_cap_b_estado_v1";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let estado = cargar() || nuevoEstado();
  function nuevoEstado() {
    return { nodo: cap.inicio, indicador: cap.indicadorInicial, xp: 0, digitos: {}, mostrado: {} };
  }
  const guardar = () => { try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) {} };
  function cargar() { try { return JSON.parse(localStorage.getItem(CLAVE)); } catch (e) { return null; } }
  const clamp = (n) => Math.max(0, Math.min(100, n));
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
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
      <path d="M40 108 q20 -20 40 0 v12 h-40 z" fill="#FF6B1A"/>
      <rect x="40" y="103" width="40" height="6" fill="#DCE7F5" opacity=".85"/>
      <path d="M22 120 q6 -26 38 -26 q32 0 38 26 z" fill="#FF7A22"/>
      <path d="M52 96 h16 l-3 10 h-10 z" fill="#DCE7F5" opacity=".7"/>
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
      <path d="M50 79 q10 9 20 0" stroke="#B4653C" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M52 80 q8 6 16 0z" fill="#fff"/>
      <circle cx="46" cy="74" r="3.5" fill="#F1A177" opacity=".5"/><circle cx="74" cy="74" r="3.5" fill="#F1A177" opacity=".5"/>
    </svg>`;
  }

  const S = {};
  // Sala de control sellada con puerta blindada + teclado
  S.sala = () => `<svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice">
    <rect width="400" height="210" fill="#0C1526"/>
    <rect width="400" height="210" fill="url(#sg)"/>
    <defs><radialGradient id="sg" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#16233F"/><stop offset="100%" stop-color="#0C1526"/></radialGradient></defs>
    <g stroke="#1D2A45" stroke-width="1"><path d="M0 60 H400 M0 150 H400 M100 0 V210 M300 0 V210"/></g>
    <!-- puerta blindada -->
    <rect x="150" y="40" width="100" height="150" rx="6" fill="#1A2540" stroke="#33456B" stroke-width="3"/>
    <rect x="150" y="40" width="100" height="150" rx="6" fill="none" stroke="#FF8A3D" stroke-width="1.5" opacity=".4"/>
    <line x1="200" y1="40" x2="200" y2="190" stroke="#0C1526" stroke-width="3"/>
    <!-- teclado -->
    <rect x="255" y="95" width="30" height="42" rx="4" fill="#0F1A30" stroke="#FF8A3D" stroke-width="1.5"/>
    ${[0,1,2].map(r=>[0,1].map(c=>`<rect x="${259+c*13}" y="${100+r*11}" width="9" height="8" rx="1.5" fill="#FF8A3D" opacity=".55"/>`).join("")).join("")}
    <!-- candados en la pared -->
    ${[70,90,110].map((y,i)=>`<g transform="translate(110 ${y+ i*0})"><rect x="0" y="0" width="18" height="14" rx="2" fill="#FFC53D"/><path d="M3 0 v-4 a6 6 0 0 1 12 0 v4" fill="none" stroke="#FFC53D" stroke-width="2.5"/></g>`).slice(0,1).join("")}
    <g transform="translate(80 80)"><rect width="20" height="15" rx="2" fill="#FFC53D"/><path d="M4 0 v-5 a6 6 0 0 1 12 0 v5" fill="none" stroke="#FFC53D" stroke-width="2.6"/><circle cx="10" cy="7" r="2.2" fill="#0C1526"/></g>
    <g transform="translate(80 120)"><rect width="20" height="15" rx="2" fill="#9B7BFF"/><path d="M4 0 v-5 a6 6 0 0 1 12 0 v5" fill="none" stroke="#9B7BFF" stroke-width="2.6"/><circle cx="10" cy="7" r="2.2" fill="#0C1526"/></g>
    <g transform="translate(300 100)"><rect width="20" height="15" rx="2" fill="#2DD4BF"/><path d="M4 0 v-5 a6 6 0 0 1 12 0 v5" fill="none" stroke="#2DD4BF" stroke-width="2.6"/><circle cx="10" cy="7" r="2.2" fill="#0C1526"/></g>
  </svg>`;

  // Puerta abierta con luz (final)
  S.puerta = () => `<svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id="luz" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFE9A8"/><stop offset="100%" stop-color="#2DD4BF"/></linearGradient>
    <radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FFF4D6"/><stop offset="100%" stop-color="#FFF4D6" stop-opacity="0"/></radialGradient></defs>
    <rect width="400" height="210" fill="#0C1526"/>
    <rect x="140" y="30" width="120" height="170" rx="8" fill="url(#luz)"/>
    <ellipse cx="200" cy="115" rx="140" ry="120" fill="url(#halo)" opacity=".8"/>
    <rect x="120" y="30" width="24" height="170" rx="4" fill="#1A2540" stroke="#33456B" stroke-width="2"/>
    <rect x="256" y="30" width="24" height="170" rx="4" fill="#1A2540" stroke="#33456B" stroke-width="2"/>
    <g transform="translate(200 118)"><circle r="30" fill="#0C1526" opacity=".25"/><path d="M-14 2 l10 12 l22 -28" fill="none" stroke="#0C1526" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity=".5"/></g>
  </svg>`;

  // Bowtie (diagrama de corbatín) ilustrativo
  S.bowtie = () => `<svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice">
    <rect width="400" height="210" fill="#0F1830"/>
    <g opacity=".9">
      <path d="M40 60 L180 100 L40 150 Z" fill="#2DD4BF" opacity=".18" stroke="#2DD4BF" stroke-width="2"/>
      <path d="M360 60 L220 100 L360 150 Z" fill="#9B7BFF" opacity=".18" stroke="#9B7BFF" stroke-width="2"/>
      <circle cx="200" cy="100" r="26" fill="#FF6B1A"/>
      <path d="M200 88 l0 14 M200 108 l0 2" stroke="#0C1526" stroke-width="3" stroke-linecap="round"/>
      <g stroke="#2DD4BF" stroke-width="2" opacity=".6"><path d="M60 75 H150 M60 100 H150 M60 125 H150"/></g>
      <g stroke="#9B7BFF" stroke-width="2" opacity=".6"><path d="M250 88 H340 M250 112 H340"/></g>
    </g>
    <text x="200" y="180" fill="#8A97B4" font-size="12" text-anchor="middle" font-family="sans-serif">Prevención ◂ EVENTO ▸ Mitigación</text>
  </svg>`;

  S.filtro = () => `<svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice">
    <rect width="400" height="210" fill="#0F1830"/>
    <path d="M120 40 H280 L215 120 V175 H185 V120 Z" fill="#16223F" stroke="#FF8A3D" stroke-width="3" stroke-linejoin="round"/>
    <g fill="#33456B"><circle cx="150" cy="55" r="7"/><circle cx="200" cy="52" r="8"/><circle cx="250" cy="56" r="7"/><circle cx="175" cy="70" r="6"/><circle cx="228" cy="72" r="6"/></g>
    <g transform="translate(200 150)"><rect x="-14" y="0" width="28" height="20" rx="3" fill="#FFC53D"/><path d="M-9 0 v-6 a9 9 0 0 1 18 0 v6" fill="none" stroke="#FFC53D" stroke-width="3"/></g>
  </svg>`;

  const escena = (id) => `<div class="escena">${(S[id] || S.sala)()}<div class="escena-fade"></div></div>`;

  /* ============================ HUD ============================ */
  function pintarHUD() {
    const v = clamp(estado.indicador);
    const nv = nivel(estado.xp), xpEn = estado.xp % 100;
    const cod = [1, 2, 3].map((c) => estado.digitos[c] || "·").join(" ");
    hud.innerHTML = `
      <button id="btn-menu" class="hud-menu" title="Reiniciar">↻</button>
      <div class="hud-perfil">
        <div class="hud-avatar">${rivas(40)}</div>
        <div class="hud-nivel">
          <div class="hud-nivel-top"><span>Nivel ${nv}</span><span class="hud-xp-num">Código ${cod}</span></div>
          <div class="hud-xpbar"><div class="hud-xpfill" style="width:${xpEn}%"></div></div>
        </div>
      </div>
      <div class="hud-score ${v>=65?"ok":v>=40?"med":"bajo"}">
        <svg viewBox="0 0 40 44" width="30" height="33"><path d="M20 2 L37 9 V22 Q37 38 20 42 Q3 38 3 22 V9z" fill="currentColor" opacity=".18" stroke="currentColor" stroke-width="2"/></svg>
        <div class="hud-score-txt"><b id="score-num">${v}</b><small>Seguridad</small></div>
      </div>`;
    document.getElementById("btn-menu").onclick = reiniciar;
  }
  function ganar(indDelta, xpDelta) {
    estado.indicador = clamp(estado.indicador + (indDelta || 0));
    estado.xp += (xpDelta || 0);
    guardar(); pintarHUD();
    if (xpDelta) flotante("+" + xpDelta + " XP");
  }
  function flotante(txt) {
    const el = document.createElement("div"); el.className = "flotante-xp"; el.textContent = txt;
    hud.appendChild(el); setTimeout(() => el.remove(), 1200);
  }
  function revelarDigito(candado, d) {
    estado.digitos[candado] = d; guardar(); pintarHUD();
  }

  /* ============================ NAV ============================ */
  const sig = (v) => (typeof v === "function" ? v(estado) : v);
  const ir = (id) => { estado.nodo = sig(id); guardar(); render(); };

  function render() {
    const nodo = cap.nodos[estado.nodo];
    if (nodo.tipo === "portada") hud.style.display = "none"; else { hud.style.display = "flex"; pintarHUD(); }
    estado.mostrado[estado.nodo] = true; app.scrollTop = 0;
    ({ portada: rPortada, escena: rEscena, sorteo: rSorteo, filtro: rFiltro,
       codigo: rCodigo, teclado: rTeclado, final: rFinal }[nodo.tipo] || rEscena)(nodo);
  }

  function bloqueDialogo(personaId, texto) {
    if (!texto) return "";
    const p = persona(personaId);
    return `<div class="dialogo"><div class="dialogo-av">${rivas(54)}</div>
      <div class="dialogo-cuerpo"><div class="dialogo-nombre">${esc(p ? p.nombre : "")}<span>${esc(p ? p.rol : "")}</span></div>
      <div class="dialogo-texto">${esc(texto)}</div></div></div>`;
  }
  const card = (inner, cls) => `<div class="card ${cls || ""}">${inner}</div>`;
  const chipCandado = (n) => n ? `<div class="chip-paso">🔒 Candado ${n} de 3</div>` : "";
  const cabecera = (nodo) => `<div class="card-pad"><h2>${esc(nodo.titulo)}</h2>${nodo.cuerpo ? `<p class="cuerpo">${esc(nodo.cuerpo)}</p>` : ""}</div>`;

  /* ------------------------------- PORTADA ------------------------------- */
  function rPortada(nodo) {
    app.innerHTML = `
      <div class="portada">
        <div class="portada-cielo">${S.sala()}<div class="dust"></div><div class="dust d2"></div><div class="dust d3"></div></div>
        <div class="portada-cont">
          <div class="logo-escudo">
            <svg viewBox="0 0 80 92" width="86" height="99">
              <defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFC24B"/><stop offset="100%" stop-color="#FF6B1A"/></linearGradient></defs>
              <path d="M40 3 L74 16 V40 Q74 74 40 89 Q6 74 6 40 V16z" fill="#0E1424" stroke="url(#lg)" stroke-width="3"/>
              <rect x="28" y="44" width="24" height="20" rx="3" fill="url(#lg)"/>
              <path d="M31 44 v-6 a9 9 0 0 1 18 0 v6" fill="none" stroke="url(#lg)" stroke-width="3.5"/>
              <circle cx="40" cy="53" r="3.4" fill="#0E1424"/>
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

  /* ------------------------------- ESCENA ------------------------------- */
  function rEscena(nodo) {
    app.innerHTML =
      card((nodo.ilustracion ? escena(nodo.ilustracion) : "") +
        `<div class="card-pad"><h2>${esc(nodo.titulo)}</h2><p class="cuerpo">${esc(nodo.cuerpo)}</p>
         ${bloqueDialogo(nodo.persona, nodo.dialogo)}</div>`, "con-escena") +
      `<button class="btn primario" id="continuar">Continuar <span>▸</span></button>`;
    document.getElementById("continuar").onclick = () => ir(nodo.siguiente);
  }

  /* ===================== MECÁNICA 1 · SORTEO (BOWTIE) ==================== */
  function rSorteo(nodo) {
    // pos[i] = id de zona o null (bandeja). sel = índice seleccionado.
    const pos = nodo.cartas.map(() => null);
    let sel = null, resuelto = false;

    function pintar() {
      const bandeja = nodo.cartas.map((c, i) => pos[i] == null
        ? `<button class="carta ${sel === i ? "sel" : ""}" data-i="${i}">${esc(c.t)}</button>` : "").join("");
      const zonaHTML = (z) => {
        const dentro = nodo.cartas.map((c, i) => pos[i] === z.id
          ? `<button class="carta puesta ${resuelto ? (c.z === z.id ? "ok" : "mal") : ""}" data-i="${i}">${esc(c.t)}</button>` : "").join("");
        return `<div class="zona" data-z="${z.id}" style="--zc:${z.color}">
          <div class="zona-cab"><b>${esc(z.nombre)}</b><small>${esc(z.sub)}</small></div>
          <div class="zona-body">${dentro || `<span class="zona-vacia">Toca aquí para colocar</span>`}</div></div>`;
      };
      const faltan = pos.filter((p) => p == null).length;
      app.innerHTML = chipCandado(nodo.candado) + card(
        cabecera({ titulo: nodo.titulo, cuerpo: null }) +
        `<div class="card-pad" style="padding-top:0">
          <div class="evento-chip">⚠ EVENTO · ${esc(nodo.evento)}</div>
          ${sel != null ? `<div class="sorteo-hint">Ahora toca un lado para colocar el control seleccionado.</div>` : `<div class="sorteo-hint tenue">Toca un control de la bandeja para seleccionarlo.</div>`}
          <div class="bandeja">${bandeja || `<span class="zona-vacia">Todos los controles colocados</span>`}</div>
          <div class="zonas">${nodo.zonas.map(zonaHTML).join("")}</div>
        </div>`, "") +
        `<button class="btn primario" id="verificar" ${faltan ? "disabled" : ""}>Verificar bowtie</button>`;

      app.querySelectorAll(".bandeja .carta").forEach((b) => b.onclick = () => {
        sel = sel === +b.dataset.i ? null : +b.dataset.i; pintar();
      });
      app.querySelectorAll(".zona").forEach((zEl) => zEl.onclick = () => {
        if (resuelto) return;
        if (sel != null) { pos[sel] = zEl.dataset.z; sel = null; pintar(); }
      });
      app.querySelectorAll(".zona .carta.puesta").forEach((b) => b.onclick = (e) => {
        if (resuelto) return;
        // Si hay una carta seleccionada, tocar aquí la COLOCA en esta zona
        // (en vez de quitar la que ya está). Sin selección, quita esta carta.
        if (sel != null) { pos[sel] = b.closest(".zona").dataset.z; sel = null; e.stopPropagation(); pintar(); return; }
        e.stopPropagation();
        pos[+b.dataset.i] = null; pintar();
      });
      const vb = document.getElementById("verificar");
      if (vb) vb.onclick = verificar;
    }

    function verificar() {
      const bien = nodo.cartas.every((c, i) => pos[i] === c.z);
      if (!bien) {
        resuelto = true; pintar(); resuelto = false; // pinta ok/mal un instante
        setTimeout(() => {
          const fb = document.createElement("div");
          fb.className = "feedback fb-mal";
          fb.innerHTML = `<div class="fb-cab">Aún no calza</div><p>${esc(nodo.error)}</p><button class="btn primario" id="reintentar">Ajustar</button>`;
          app.appendChild(fb); fb.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
          document.getElementById("reintentar").onclick = pintar;
        }, 400);
        ganar(-4, 0);
        return;
      }
      resuelto = true; pintar();
      revelarDigito(nodo.candado, nodo.digito); ganar(10, 30);
      exitoCandado(nodo);
    }
    pintar();
  }

  /* ==================== MECÁNICA 2 · FILTRO (CRÍTICOS) =================== */
  function rFiltro(nodo) {
    const cand = barajar(nodo.candidatos.map((c, i) => ({ ...c, i })));
    const slots = Array(nodo.ranuras).fill(null);
    const usados = {};

    function pintar(msg, tipo) {
      const slotHTML = slots.map((s) =>
        s == null ? `<div class="slot vacio">RANURA<br>CRÍTICA</div>`
                  : `<div class="slot lleno">🛡️<span>${esc(s.t)}</span></div>`).join("");
      const candHTML = cand.map((c) => usados[c.i]
        ? `<button class="cand usado" disabled>${esc(c.t)}</button>`
        : `<button class="cand" data-i="${c.i}">${esc(c.t)}</button>`).join("");
      app.innerHTML = chipCandado(nodo.candado) + card(
        cabecera({ titulo: nodo.titulo, cuerpo: null }) +
        `<div class="card-pad" style="padding-top:0">
          <div class="slots">${slotHTML}</div>
          <div class="filtro-lbl">Controles disponibles · toca para pasarlos por el filtro</div>
          <div class="cands">${candHTML}</div>
          <div class="filtro-msg ${tipo || ""}">${msg || "Solo 3 controles cumplen los criterios ICMM de criticidad."}</div>
        </div>`, "");
      app.querySelectorAll(".cand:not(.usado)").forEach((b) => b.onclick = () => intentar(+b.dataset.i));
    }

    function intentar(i) {
      const c = nodo.candidatos[i];
      if (c.critico) {
        const idx = slots.indexOf(null);
        if (idx === -1) return;
        slots[idx] = c; usados[i] = true; ganar(4, 12);
        if (slots.every((s) => s)) { pintar(nodo.exito, "ok"); revelarDigito(nodo.candado, nodo.digito); ganar(8, 20); exitoCandado(nodo); }
        else pintar("✓ Control crítico aislado. " + c.motivo, "ok");
      } else {
        ganar(-3, 0);
        pintar("✗ Rechazado. " + c.motivo, "mal");
        const el = app.querySelector(`.cand[data-i="${i}"]`);
        if (el) { el.classList.add("rechazado"); setTimeout(() => el.classList.remove("rechazado"), 500); }
      }
    }
    pintar();
  }

  /* =================== MECÁNICA 3 · CÓDIGO (DEFINICIÓN) ================== */
  function rCodigo(nodo) {
    const fichas = barajar(nodo.fichas.slice());
    const puestas = nodo.respuestas.map(() => null); // palabra por hueco
    let resuelto = false;

    function pintar(err) {
      let h = 0;
      const fraseHTML = nodo.frase.map((tr) => {
        if (typeof tr === "string") return esc(tr);
        const idx = tr.hueco;
        const val = puestas[idx];
        return `<button class="hueco ${val ? "lleno" : ""} ${resuelto ? (val === nodo.respuestas[idx] ? "ok" : "mal") : ""}" data-h="${idx}">${val ? esc(val) : "＿＿"}</button>`;
      }).join("");
      const fichaHTML = fichas.map((f, i) =>
        puestas.indexOf(f) >= 0 ? `<button class="ficha usada" disabled>${esc(f)}</button>`
        : `<button class="ficha" data-f="${i}">${esc(f)}</button>`).join("");
      const completo = puestas.every((p) => p != null);
      app.innerHTML = chipCandado(nodo.candado) + card(
        cabecera({ titulo: nodo.titulo, cuerpo: null }) +
        `<div class="card-pad" style="padding-top:0">
          <div class="frase">${fraseHTML}</div>
          <div class="fichas-lbl">Fichas · toca para colocar en el hueco</div>
          <div class="fichas">${fichaHTML}</div>
          ${err ? `<div class="filtro-msg mal">${esc(nodo.error)}</div>` : ""}
        </div>`, "") +
        `<button class="btn primario" id="sellar" ${completo ? "" : "disabled"}>Sellar la definición</button>`;
      app.querySelectorAll(".ficha:not(.usada)").forEach((b) => b.onclick = () => {
        const idx = puestas.indexOf(null); if (idx === -1) return;
        puestas[idx] = fichas[+b.dataset.f]; pintar();
      });
      app.querySelectorAll(".hueco.lleno").forEach((b) => b.onclick = () => { puestas[+b.dataset.h] = null; pintar(); });
      const sb = document.getElementById("sellar");
      if (sb) sb.onclick = () => {
        const bien = puestas.every((p, i) => p === nodo.respuestas[i]);
        if (!bien) { ganar(-4, 0); pintar(true); return; }
        resuelto = true; pintar(); revelarDigito(nodo.candado, nodo.digito); ganar(10, 30); exitoCandado(nodo);
      };
    }
    pintar();
  }

  /* ==================== ÉXITO DE CANDADO (transición) =================== */
  function exitoCandado(nodo) {
    setTimeout(() => {
      const fb = document.createElement("div");
      fb.className = "feedback fb-ok candado-ok";
      fb.innerHTML =
        `<div class="fb-cab">🔓 Candado ${nodo.candado} abierto</div>
         <div class="digito-revelado">Dígito&nbsp; <b>${esc(nodo.digito)}</b></div>
         <p>${esc(nodo.exito)}</p>
         <button class="btn primario" id="seguir">Continuar <span>▸</span></button>`;
      app.appendChild(fb); fb.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
      document.getElementById("seguir").onclick = () => ir(nodo.siguiente);
    }, 450);
  }

  /* ===================== MECÁNICA 4 · TECLADO (PUERTA) ================== */
  function rTeclado(nodo) {
    let entrada = "";
    function pintar(estadoMsg) {
      const cod = [1, 2, 3].map((c) => estado.digitos[c] || "?").join("");
      const disp = (entrada + "___").slice(0, 3).split("").map((ch) =>
        `<span class="disp-dig ${ch !== "_" ? "on" : ""}">${ch === "_" ? "" : ch}</span>`).join("");
      app.innerHTML = card(
        `<div class="escena">${S.sala()}<div class="escena-fade"></div></div>` +
        `<div class="card-pad"><h2>${esc(nodo.titulo)}</h2><p class="cuerpo">${esc(nodo.cuerpo)}</p>
          <div class="pista-cod">Dígitos revelados: <b>${esc(cod)}</b></div>
          <div class="display">${disp}</div>
          <div class="teclado">
            ${[1,2,3,4,5,6,7,8,9].map((n) => `<button class="tecla" data-n="${n}">${n}</button>`).join("")}
            <button class="tecla borrar" data-a="clear">✕</button>
            <button class="tecla" data-n="0">0</button>
            <button class="tecla ok" data-a="enter">▸</button>
          </div>
          ${estadoMsg ? `<div class="filtro-msg mal">${esc(estadoMsg)}</div>` : ""}
        </div>`, "con-escena");
      app.querySelectorAll(".tecla[data-n]").forEach((b) => b.onclick = () => {
        if (entrada.length < 3) { entrada += b.dataset.n; pintar(); }
      });
      app.querySelector('[data-a="clear"]').onclick = () => { entrada = ""; pintar(); };
      app.querySelector('[data-a="enter"]').onclick = () => {
        if (entrada.length < 3) return;
        if (entrada === nodo.codigo) { ganar(10, 25); ir(nodo.siguiente); }
        else { ganar(-4, 0); const d = app.querySelector(".display"); if (d && !reduce) { d.classList.add("shake"); } entrada = ""; setTimeout(() => pintar(nodo.error), 300); }
      };
    }
    pintar();
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
       <div class="prox">🔒 Próximamente · Capítulo C — «Estándares de desempeño y dueños»</div>`;
    document.getElementById("reiniciar-final").onclick = reiniciarDirecto;
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
    ov.innerHTML = `<div class="modal"><h3>¿Reiniciar el capítulo?</h3>
      <p>Perderás el progreso de esta partida.</p>
      <div class="modal-btns"><button class="btn" id="m-no">Cancelar</button>
      <button class="btn primario" id="m-si">Reiniciar</button></div></div>`;
    document.querySelector(".telefono").appendChild(ov);
    requestAnimationFrame(() => ov.classList.add("visible"));
    const cerrar = () => ov.remove();
    ov.addEventListener("click", (e) => { if (e.target === ov) cerrar(); });
    ov.querySelector("#m-no").onclick = cerrar;
    ov.querySelector("#m-si").onclick = () => { cerrar(); reiniciarDirecto(); };
  }

  render();
})();

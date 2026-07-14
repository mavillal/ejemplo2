/*
 * Motor narrativo + biblioteca de ilustraciones SVG.
 * Independiente del contenido: interpreta window.CAPITULO_A.
 * Toda la gráfica es SVG incrustado (nítido, liviano, sin recursos externos).
 */
function iniciarMotorA(onHome) {
  "use strict";

  const cap = window.CAPITULO_A;
  const app = document.getElementById("app");
  const hud = document.getElementById("hud");
  const CLAVE = "ccm_cap_a_estado_v2";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let estado = cargar() || nuevoEstado();
  function nuevoEstado() {
    return { nodo: cap.inicio, indicador: cap.indicadorInicial, xp: 0, banderas: {},
      aciertosEval: 0, totalEval: 0, mostrado: {} };
  }
  const guardar = () => { try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) {} };
  function cargar() { try { return JSON.parse(localStorage.getItem(CLAVE)); } catch (e) { return null; } }
  const clamp = (n) => Math.max(0, Math.min(100, n));
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
  const persona = (id) => (id ? cap.personajes[id] : null);
  const nivel = (xp) => Math.floor(xp / 100) + 1;

  /* ============================ BIBLIOTECA SVG ============================ */
  const S = {}; // ilustraciones de escena (viewBox 0 0 400 210)

  // --- Avatar de la Ing. Rivas: rostro visible, casco, lentes, sonrisa ---
  function rivas(size) {
    size = size || 96;
    return `<svg class="rivas-svg" viewBox="0 0 120 120" width="${size}" height="${size}" aria-label="Ingeniera Rivas">
      <defs>
        <radialGradient id="rbg" cx="50%" cy="38%" r="70%">
          <stop offset="0%" stop-color="#243154"/><stop offset="100%" stop-color="#0E1424"/>
        </radialGradient>
        <linearGradient id="rhelm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FFC24B"/><stop offset="100%" stop-color="#F5820A"/>
        </linearGradient>
        <linearGradient id="rskin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F0C09A"/><stop offset="100%" stop-color="#E0A579"/>
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill="url(#rbg)"/>
      <circle cx="60" cy="60" r="57" fill="none" stroke="#3A4straight" opacity="0"/>
      <!-- cuello / cuello hi-vis -->
      <path d="M40 108 q20 -20 40 0 v12 h-40 z" fill="#FF6B1A"/>
      <rect x="40" y="103" width="40" height="6" fill="#DCE7F5" opacity=".85"/>
      <!-- hombros hi-vis -->
      <path d="M22 120 q6 -26 38 -26 q32 0 38 26 z" fill="#FF7A22"/>
      <path d="M52 96 h16 l-3 10 h-10 z" fill="#DCE7F5" opacity=".7"/>
      <!-- pelo detrás -->
      <path d="M32 62 q0 -34 28 -34 q28 0 28 34 q0 20 -6 30 q-4 -18 -22 -18 q-18 0 -22 18 q-6 -10 -6 -30z" fill="#2A2118"/>
      <!-- cara -->
      <path d="M40 58 q0 34 20 34 q20 0 20 -34 q0 -20 -20 -20 q-20 0 -20 20z" fill="url(#rskin)"/>
      <!-- orejas -->
      <circle cx="40" cy="64" r="4.5" fill="#E0A579"/><circle cx="80" cy="64" r="4.5" fill="#E0A579"/>
      <!-- casco -->
      <path d="M30 52 q0 -30 30 -30 q30 0 30 30 q0 3 -2 4 h-56 q-2 -1 -2 -4z" fill="url(#rhelm)"/>
      <path d="M28 52 h64 q3 0 3 4 t-3 4 h-64 q-3 0 -3 -4 t3 -4z" fill="#F5820A"/>
      <path d="M40 24 q20 -8 40 0 l-1 6 q-19 -7 -38 0z" fill="#FFD98A" opacity=".8"/>
      <rect x="55" y="21" width="10" height="9" rx="2" fill="#3A4straight"/>
      <circle cx="60" cy="26" r="3.2" fill="#BFE9FF"/>
      <!-- cejas -->
      <path d="M45 58 q6 -4 12 -1" stroke="#3A2A1C" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M63 57 q6 -3 12 1" stroke="#3A2A1C" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <!-- ojos -->
      <ellipse cx="51" cy="65" rx="4.4" ry="4.8" fill="#fff"/><circle cx="52" cy="66" r="2.4" fill="#2A2118"/>
      <ellipse cx="69" cy="65" rx="4.4" ry="4.8" fill="#fff"/><circle cx="68" cy="66" r="2.4" fill="#2A2118"/>
      <circle cx="52.8" cy="65" r=".8" fill="#fff"/><circle cx="68.8" cy="65" r=".8" fill="#fff"/>
      <!-- nariz -->
      <path d="M60 66 q2 6 -1 9" stroke="#CE8F60" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- sonrisa -->
      <path d="M50 79 q10 9 20 0" stroke="#B4653C" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M52 80 q8 6 16 0z" fill="#fff"/>
      <!-- rubor -->
      <circle cx="46" cy="74" r="3.5" fill="#F1A177" opacity=".5"/><circle cx="74" cy="74" r="3.5" fill="#F1A177" opacity=".5"/>
    </svg>`.replace(/3A4straight/g, "3A465A");
  }

  const sky = (id, a, b) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="${a}"/><stop offset="100%" stop-color="${b}"/></linearGradient>`;

  // Camión de acarreo reutilizable
  const truck = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M2 24 h44 v8 q0 4 -4 4 h-36 q-4 0 -4 -4z" fill="${c || "#F5A623"}"/>
    <path d="M8 4 h20 l8 12 v8 h-36 v-14 q0 -6 8 -6z" fill="#3A465A"/>
    <rect x="10" y="8" width="12" height="8" rx="1" fill="#BFE9FF"/>
    <circle cx="14" cy="38" r="6" fill="#1A2233"/><circle cx="14" cy="38" r="2.5" fill="#556"/>
    <circle cx="38" cy="38" r="6" fill="#1A2233"/><circle cx="38" cy="38" r="2.5" fill="#556"/>
  </g>`;

  // Escena: mina al amanecer con camión
  S.mina_amanecer = () => `<svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice">
    <defs>${sky("s1", "#1B2550", "#F6923A")}
      <radialGradient id="sun" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FFE9A8"/><stop offset="60%" stop-color="#FFB347" stop-opacity=".6"/><stop offset="100%" stop-color="#FFB347" stop-opacity="0"/></radialGradient></defs>
    <rect width="400" height="210" fill="url(#s1)"/>
    <circle cx="300" cy="120" r="90" fill="url(#sun)"/><circle cx="300" cy="120" r="26" fill="#FFE7A0"/>
    <g fill="#fff" opacity=".7"><circle cx="40" cy="30" r="1.2"/><circle cx="90" cy="18" r="1"/><circle cx="150" cy="40" r="1.3"/><circle cx="70" cy="55" r="1"/></g>
    <path d="M0 120 L120 70 L230 110 L400 60 V210 H0z" fill="#25315A"/>
    <!-- terrazas del rajo -->
    <path d="M0 150 L400 120 V210 H0z" fill="#6B4A32"/>
    <path d="M0 168 L400 145 V210 H0z" fill="#835A3C"/>
    <path d="M0 186 L400 172 V210 H0z" fill="#9C6B47"/>
    <path d="M0 150 L400 120" stroke="#4E3624" stroke-width="2"/>
    <path d="M0 168 L400 145" stroke="#5E4127" stroke-width="2"/>
    ${truck(150, 128, 0.9, "#F5A623")}
    <g fill="#C79A6B" opacity=".5"><circle cx="205" cy="150" r="3"/><circle cx="215" cy="146" r="2"/><circle cx="225" cy="151" r="2.5"/></g>
  </svg>`;

  // Escena: oficina de gerencia
  S.gerencia = () => `<svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice">
    <defs>${sky("s2", "#182murky", "#101830")}</defs>
    <rect width="400" height="210" fill="#0F1830"/>
    <rect x="30" y="24" width="150" height="96" rx="6" fill="#16223F" stroke="#2A3congo" stroke-width="2"/>
    <!-- gráfico ascendente -->
    <polyline points="46,104 78,86 104,92 134,58 166,44" fill="none" stroke="#2DD4BF" stroke-width="4" stroke-linecap="round"/>
    <g fill="#2DD4BF"><circle cx="46" cy="104" r="3"/><circle cx="134" cy="58" r="3"/><circle cx="166" cy="44" r="3.5"/></g>
    <rect x="30" y="132" width="340" height="4" rx="2" fill="#233b"/>
    <!-- mesa -->
    <rect x="0" y="150" width="400" height="60" fill="#20304F"/>
    <rect x="220" y="120" width="150" height="70" rx="8" fill="#16223F" stroke="#2A3congo" stroke-width="2"/>
    <rect x="236" y="136" width="118" height="10" rx="5" fill="#FF8A3D"/>
    <rect x="236" y="154" width="80" height="8" rx="4" fill="#33456b"/>
    <rect x="236" y="168" width="100" height="8" rx="4" fill="#33456b"/>
  </svg>`.replace(/2A3congo/g, "2A3B5E").replace(/182murky/g, "1A2murky").replace(/1A2murky/g, "1A2440").replace(/233b/g, "233B5E").replace(/33456b/g, "33456B");

  // Escena: equipo (cascos)
  S.equipo = () => {
    const fig = (x, c) => `<g transform="translate(${x} 70)">
      <path d="M-24 120 q4 -54 24 -54 q20 0 24 54z" fill="${c}"/>
      <circle cx="0" cy="40" r="22" fill="#E7B78C"/>
      <path d="M-24 34 q0 -22 24 -22 q24 0 24 22 q0 3 -2 4 h-44 q-2 -1 -2 -4z" fill="#F5820A"/>
      <path d="M-26 38 h52 q3 0 3 3 t-3 3 h-52 q-3 0 -3 -3 t3 -3z" fill="#E0730A"/>
      <ellipse cx="-8" cy="42" rx="3" ry="3.4" fill="#2A2118"/><ellipse cx="8" cy="42" rx="3" ry="3.4" fill="#2A2118"/>
      <path d="M-8 52 q8 6 16 0" stroke="#B4653C" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    </g>`;
    return `<svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="210" fill="#101A33"/>
      <circle cx="200" cy="150" r="150" fill="#16223F" opacity=".6"/>
      ${fig(120, "#2E7D9A")}${fig(280, "#C0562A")}
      <g transform="translate(200 60)">${fig(0, "#FF8A3D").replace("translate(0 70)", "translate(0 10) scale(1.15)")}</g>
    </svg>`;
  };

  // Escena: definir alcance (embudo / foco en lo catastrófico)
  S.alcance = () => `<svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice">
    <rect width="400" height="210" fill="#101A33"/>
    <g opacity=".85"><circle cx="120" cy="60" r="10" fill="#33456B"/><circle cx="170" cy="40" r="8" fill="#33456B"/><circle cx="230" cy="52" r="9" fill="#33456B"/><circle cx="280" cy="42" r="7" fill="#33456B"/><circle cx="90" cy="90" r="7" fill="#33456B"/><circle cx="310" cy="80" r="8" fill="#33456B"/></g>
    <path d="M110 100 L290 100 L228 150 L228 186 L172 186 L172 150z" fill="#16223F" stroke="#FF8A3D" stroke-width="3"/>
    <path d="M172 186 L228 186 L228 196 L172 196z" fill="#FF8A3D"/>
    <g transform="translate(200 168)"><path d="M0 -14 L13 10 H-13z" fill="#FFC53D" stroke="#0F1830" stroke-width="1.5"/><rect x="-1.6" y="-6" width="3.2" height="9" rx="1.5" fill="#0F1830"/><circle cx="0" cy="7" r="1.8" fill="#0F1830"/></g>
  </svg>`;

  // Escena: MUEs (triángulos de peligro)
  S.mues = () => {
    const tri = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -26 L24 18 H-24z" fill="#FFC53D" stroke="#0F1830" stroke-width="3" stroke-linejoin="round"/><rect x="-3" y="-14" width="6" height="17" rx="3" fill="#0F1830"/><circle cx="0" cy="9" r="3.4" fill="#0F1830"/></g>`;
    return `<svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice">
      <defs><radialGradient id="mg" cx="50%" cy="45%" r="60%"><stop offset="0%" stop-color="#3A2417"/><stop offset="100%" stop-color="#101A33"/></radialGradient></defs>
      <rect width="400" height="210" fill="url(#mg)"/>
      ${tri(120, 100, 0.8)}${tri(285, 90, 0.7)}${tri(300, 160, 0.5)}
      ${tri(200, 110, 1.35)}
    </svg>`;
  };

  // Escena: camión vs persona (peligro)
  S.camion_persona = () => `<svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice">
    <defs>${sky("s3", "#2A2140", "#7A3B1E")}</defs>
    <rect width="400" height="210" fill="url(#s3)"/>
    <path d="M0 130 L400 100 V210 H0z" fill="#7B5638"/>
    <path d="M0 150 L400 124 V210 H0z" fill="#8E6242"/>
    ${truck(60, 116, 1.5, "#F5A623")}
    <!-- trabajador a pie -->
    <g transform="translate(300 130)">
      <circle cx="0" cy="0" r="9" fill="#FFC24B"/>
      <rect x="-7" y="9" width="14" height="22" rx="4" fill="#FF7A22"/>
      <rect x="-6" y="16" width="12" height="4" fill="#DCE7F5"/>
      <rect x="-6" y="31" width="5" height="16" rx="2" fill="#2A3B5E"/><rect x="1" y="31" width="5" height="16" rx="2" fill="#2A3B5E"/>
    </g>
    <!-- destello de alerta -->
    <g transform="translate(232 96)"><path d="M0 -22 L20 16 H-20z" fill="#FF5A5F" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/><rect x="-2.6" y="-12" width="5.2" height="14" rx="2.6" fill="#fff"/><circle cx="0" cy="8" r="2.8" fill="#fff"/></g>
  </svg>`;

  // Escena: evaluación (diana / checklist)
  S.evaluacion = () => `<svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice">
    <rect width="400" height="210" fill="#101A33"/>
    <g transform="translate(130 105)">
      <circle r="66" fill="none" stroke="#26314D" stroke-width="14"/>
      <circle r="44" fill="none" stroke="#2E7D9A" stroke-width="14"/>
      <circle r="22" fill="none" stroke="#FF8A3D" stroke-width="14"/>
      <circle r="6" fill="#FFC53D"/>
    </g>
    <g transform="translate(250 60)">
      <rect width="110" height="96" rx="10" fill="#16223F" stroke="#2A3B5E" stroke-width="2"/>
      ${[0,1,2].map(i=>`<circle cx="20" cy="${26+i*26}" r="8" fill="none" stroke="#2DD4BF" stroke-width="3"/><path d="M16 ${26+i*26} l3 4 l6 -8" stroke="#2DD4BF" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="36" y="${22+i*26}" width="58" height="7" rx="3.5" fill="#33456B"/>`).join("")}
    </g>
  </svg>`;

  // Escena: consecuencia positiva (sistema sólido / camino correcto)
  S.exito = () => `<svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice">
    <defs>${sky("se", "#0E2A2A", "#10233A")}
      <radialGradient id="seg" cx="50%" cy="45%" r="55%"><stop offset="0%" stop-color="#2DD4BF" stop-opacity=".5"/><stop offset="100%" stop-color="#2DD4BF" stop-opacity="0"/></radialGradient></defs>
    <rect width="400" height="210" fill="url(#se)"/>
    <circle cx="200" cy="100" r="120" fill="url(#seg)"/>
    <polyline points="60,150 130,150 175,95 230,120 300,55 350,55" fill="none" stroke="#2DD4BF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M330 55 l20 0 l0 20" fill="none" stroke="#2DD4BF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(200 100)">
      <circle r="42" fill="#10233A" stroke="#2DD4BF" stroke-width="4"/>
      <path d="M-18 2 l12 14 l26 -32" fill="none" stroke="#2DD4BF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </svg>`;

  // Escena: consecuencia negativa / traba (camino difícil, sin respaldo)
  S.traba = () => `<svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice">
    <rect width="400" height="210" fill="#20161A"/>
    <rect width="400" height="210" fill="#101A33" opacity=".5"/>
    <!-- barrera a rayas -->
    <g transform="translate(0 118)">
      <rect x="40" y="0" width="320" height="20" rx="4" fill="#1A2338" stroke="#33456B" stroke-width="1.5"/>
      ${Array.from({length:8},(_, i)=>`<path d="M${52+i*40} 2 l16 0 l-16 16 l-6 0z" fill="#FF8A3D"/>`).join("")}
      <rect x="60" y="20" width="8" height="52" fill="#33456B"/><rect x="332" y="20" width="8" height="52" fill="#33456B"/>
    </g>
    <!-- cono -->
    <g transform="translate(200 150)"><path d="M0 -34 L16 26 H-16z" fill="#FF6B1A"/><rect x="-20" y="26" width="40" height="8" rx="3" fill="#E0730A"/><rect x="-9" y="-8" width="18" height="6" fill="#F4EEE6"/><rect x="-12" y="4" width="24" height="6" fill="#F4EEE6"/></g>
    <!-- alerta -->
    <g transform="translate(300 70)"><path d="M0 -20 L18 14 H-18z" fill="none" stroke="#FFC53D" stroke-width="3" stroke-linejoin="round"/><rect x="-2.4" y="-10" width="4.8" height="12" rx="2.4" fill="#FFC53D"/><circle cx="0" cy="7" r="2.6" fill="#FFC53D"/></g>
  </svg>`;

  // Iconos de ítems MUE (24x24)
  const IC = {
    camion: `<path d="M2 15 h13 v-5 l3 0 3 4 v6 q0 1 -1 1 h-2" stroke="#FF8A3D" stroke-width="1.8" fill="none" stroke-linejoin="round"/><path d="M2 8 h13 v9 h-13z" fill="#FF8A3D" opacity=".25"/><circle cx="7" cy="19" r="2.2" fill="#FF8A3D"/><circle cx="18" cy="19" r="2.2" fill="#FF8A3D"/>`,
    roca: `<path d="M4 18 l3 -9 l6 -3 l6 5 l1 7z" fill="#FF8A3D" opacity=".3" stroke="#FF8A3D" stroke-width="1.6" stroke-linejoin="round"/><path d="M10 6 l-1 -3 M15 5 l1 -2 M6 7 l-2 -2" stroke="#FFC53D" stroke-width="1.6" stroke-linecap="round"/>`,
    fuego: `<path d="M12 3 q5 5 4 9 q4 -1 3 -5 q4 5 1 10 q-2 4 -8 4 q-6 0 -7 -6 q-1 -5 4 -7 q-1 3 1 4 q-1 -6 4 -9z" fill="#FF8A3D" stroke="#FF6B1A" stroke-width="1.2" stroke-linejoin="round"/>`,
    relave: `<path d="M3 15 q4 -3 8 0 t8 0 v6 h-16z" fill="#2DD4BF" opacity=".4"/><path d="M3 15 q4 -3 8 0 t8 0" stroke="#2DD4BF" stroke-width="1.8" fill="none"/><path d="M6 6 l0 8 M12 4 l0 10 M18 6 l0 8" stroke="#FF8A3D" stroke-width="1.8" stroke-linecap="round"/>`,
    corte: `<path d="M4 20 l9 -9 M15 9 l5 -5" stroke="#8A97B4" stroke-width="2" stroke-linecap="round"/><path d="M13 11 l2 -2 l1 1 l-2 2z" fill="#8A97B4"/><circle cx="6" cy="18" r="2" fill="none" stroke="#8A97B4" stroke-width="1.5"/>`,
    resbalon: `<circle cx="9" cy="5" r="2.4" fill="#8A97B4"/><path d="M9 8 l4 5 l4 -1 M9 8 l-2 6 l-4 4 M9 8 l4 5 l0 6" stroke="#8A97B4" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
    ergonomia: `<circle cx="9" cy="5" r="2.4" fill="#8A97B4"/><path d="M9 8 l0 6 l6 0 M9 14 l0 5 M15 14 l0 5" stroke="#8A97B4" stroke-width="1.8" fill="none" stroke-linecap="round"/><rect x="15" y="7" width="6" height="4" rx="1" fill="none" stroke="#8A97B4" stroke-width="1.5"/>`
  };
  const icono = (n) => `<svg viewBox="0 0 24 24" width="26" height="26">${IC[n] || ""}</svg>`;

  const escena = (id) => `<div class="escena">${(S[id] || S.mues)()}<div class="escena-fade"></div></div>`;

  /* ============================ HUD ============================ */
  function pintarHUD(anim) {
    const v = clamp(estado.indicador);
    const nv = nivel(estado.xp);
    const xpEn = estado.xp % 100;
    hud.innerHTML = `
      <div class="hud-btns">
        <button id="btn-home" class="hud-menu" title="Menú principal">🏠</button>
        <button id="btn-menu" class="hud-menu" title="Reiniciar">↻</button>
      </div>
      <div class="hud-perfil">
        <div class="hud-avatar">${rivas(40)}</div>
        <div class="hud-nivel">
          <div class="hud-nivel-top"><span>Nivel ${nv}</span><span class="hud-xp-num">${xpEn}/100 XP</span></div>
          <div class="hud-xpbar"><div class="hud-xpfill" style="width:${anim?0:xpEn}%"></div></div>
        </div>
      </div>
      <div class="hud-score ${v>=65?"ok":v>=40?"med":"bajo"}">
        <svg viewBox="0 0 40 44" width="30" height="33"><path d="M20 2 L37 9 V22 Q37 38 20 42 Q3 38 3 22 V9z" fill="currentColor" opacity=".18" stroke="currentColor" stroke-width="2"/></svg>
        <div class="hud-score-txt"><b id="score-num">${v}</b><small>Seguridad</small></div>
      </div>`;
    document.getElementById("btn-menu").onclick = reiniciar;
    document.getElementById("btn-home").onclick = () => { if (onHome) onHome(); };
    if (anim && !reduce) requestAnimationFrame(() => {
      const f = hud.querySelector(".hud-xpfill"); if (f) f.style.width = xpEn + "%";
    });
  }

  function ganar(indDelta, xpDelta) {
    const scoreEl = document.getElementById("score-num");
    const antes = clamp(estado.indicador);
    estado.indicador = clamp(estado.indicador + (indDelta || 0));
    estado.xp += (xpDelta || 0);
    guardar();
    if (scoreEl && !reduce) animarNumero(scoreEl, antes, clamp(estado.indicador), 600);
    else if (scoreEl) scoreEl.textContent = clamp(estado.indicador);
    // repintar barra xp/nivel y clase de color
    const nvBefore = hud.querySelector(".hud-nivel-top span");
    pintarHUD(false);
    if (xpDelta) flotante("+" + xpDelta + " XP");
  }

  function animarNumero(el, a, b, ms) {
    const t0 = performance.now();
    (function step(t) {
      const k = Math.min(1, (t - t0) / ms);
      el.textContent = Math.round(a + (b - a) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  function flotante(txt) {
    const el = document.createElement("div");
    el.className = "flotante-xp"; el.textContent = txt;
    hud.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }

  /* ============================ NAVEGACIÓN ============================ */
  // Resuelve un "siguiente" que puede ser string o función(estado) => id.
  // Es la base de la narrativa ramificada y de las consecuencias diferidas.
  const sig = (v) => (typeof v === "function" ? v(estado) : v);
  const ir = (id) => { estado.nodo = sig(id); guardar(); render(); };

  function render() {
    const nodo = cap.nodos[estado.nodo];
    if (nodo.tipo === "portada") { hud.style.display = "none"; }
    else { hud.style.display = "flex"; pintarHUD(!estado.mostrado[estado.nodo]); }
    estado.mostrado[estado.nodo] = true;
    app.scrollTop = 0;
    ({ portada: rPortada, escena: rEscena, decision: rDecision, seleccion: rSeleccion,
       evaluacion: rEvaluacion, final: rFinal }[nodo.tipo] || rEscena)(nodo);
  }

  function bloqueDialogo(personaId, texto, chico) {
    if (!texto) return "";
    const p = persona(personaId);
    return `<div class="dialogo ${chico ? "chico" : ""}">
      <div class="dialogo-av">${rivas(chico ? 44 : 54)}</div>
      <div class="dialogo-cuerpo">
        <div class="dialogo-nombre">${esc(p ? p.nombre : "")}<span>${esc(p ? p.rol : "")}</span></div>
        <div class="dialogo-texto">${esc(texto)}</div>
      </div></div>`;
  }

  const card = (inner, cls) => `<div class="card ${cls || ""}">${inner}</div>`;
  const chipPaso = (nodo) => nodo.paso ? `<div class="chip-paso">${esc(nodo.paso)}</div>` : "";

  /* ------------------------------- PORTADA ------------------------------- */
  function rPortada(nodo) {
    app.innerHTML = `
      <div class="portada">
        <div class="portada-cielo">
          ${S.mina_amanecer()}
          <div class="dust"></div><div class="dust d2"></div><div class="dust d3"></div>
        </div>
        <div class="portada-cont">
          <div class="logo-escudo">
            <svg viewBox="0 0 80 92" width="86" height="99">
              <defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFC24B"/><stop offset="100%" stop-color="#FF6B1A"/></linearGradient></defs>
              <path d="M40 3 L74 16 V40 Q74 74 40 89 Q6 74 6 40 V16z" fill="#0E1424" stroke="url(#lg)" stroke-width="3"/>
              <path d="M25 44 q0 -20 15 -20 q15 0 15 20 q0 2 -1 3 h-28 q-1 -1 -1 -3z" fill="url(#lg)"/>
              <path d="M22 46 h36 q2 0 2 3 t-2 3 h-36 q-2 0 -2 -3 t2 -3z" fill="#FF6B1A"/>
              <path d="M33 58 l5 6 l11 -14" stroke="#2DD4BF" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
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
      chipPaso(nodo) +
      card(
        (nodo.ilustracion ? escena(nodo.ilustracion) : "") +
        `<div class="card-pad"><h2>${esc(nodo.titulo)}</h2>
         <p class="cuerpo">${esc(nodo.cuerpo)}</p>
         ${bloqueDialogo(nodo.persona, nodo.dialogo)}</div>`, "con-escena") +
      `<button class="btn primario" id="continuar">Continuar <span>▸</span></button>`;
    document.getElementById("continuar").onclick = () => ir(nodo.siguiente);
  }

  /* ------------------------------ DECISIÓN ------------------------------ */
  function rDecision(nodo) {
    app.innerHTML =
      chipPaso(nodo) +
      card(
        (nodo.ilustracion ? escena(nodo.ilustracion) : "") +
        `<div class="card-pad"><h2>${esc(nodo.titulo)}</h2>
         <p class="cuerpo">${esc(nodo.cuerpo)}</p></div>`, "con-escena") +
      `<div class="opciones">${nodo.opciones.map((op, i) =>
        `<button class="btn opcion" data-i="${i}"><span class="op-dot"></span><span>${esc(op.texto)}</span></button>`).join("")}</div>`;

    app.querySelectorAll(".opcion").forEach((b) => {
      b.onclick = () => {
        const op = nodo.opciones[+b.dataset.i];
        ganar(op.indicador, op.xp);
        if (op.bandera) estado.banderas[op.bandera] = true;
        guardar();
        app.querySelectorAll(".opcion").forEach((x) => { x.disabled = true; x.classList.add("inerte"); });
        b.classList.remove("inerte");
        b.classList.add(op.correcta ? "elegida-ok" : "elegida-mal");
        const fb = document.createElement("div");
        fb.className = "feedback " + (op.correcta ? "fb-ok" : "fb-mal");
        fb.innerHTML =
          `<div class="fb-cab">${op.correcta ? "✓ Bien pensado" : "◆ Reflexiona"}${op.indicador ? `<span class="fb-delta">${op.indicador > 0 ? "▲ +" : "▼ "}${op.indicador}</span>` : ""}</div>
           <p>${esc(op.feedback)}</p>
           <button class="btn primario" id="seguir">Continuar <span>▸</span></button>`;
        app.appendChild(fb);
        fb.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
        // RAMIFICACIÓN: cada opción define su propio camino (o cae al del nodo).
        const destino = op.siguiente != null ? op.siguiente : nodo.siguiente;
        document.getElementById("seguir").onclick = () => ir(destino);
      };
    });
  }

  /* ------------------------------ SELECCIÓN ----------------------------- */
  function rSeleccion(nodo) {
    app.innerHTML =
      chipPaso(nodo) +
      card(`<div class="card-pad"><h2>${esc(nodo.titulo)}</h2><p class="cuerpo">${esc(nodo.cuerpo)}</p></div>`) +
      `<div class="items">${nodo.items.map((it, i) =>
        `<label class="item" data-i="${i}">
           <span class="item-ic">${icono(it.icono)}</span>
           <span class="item-txt">${esc(it.texto)}</span>
           <span class="item-check"></span>
           <input type="checkbox" data-i="${i}" hidden>
         </label>`).join("")}</div>
      <button class="btn primario" id="verificar">Verificar selección</button>`;

    app.querySelectorAll(".item").forEach((l) => {
      l.onclick = (e) => {
        if (l.classList.contains("bloq")) return;
        const cb = l.querySelector("input");
        cb.checked = !cb.checked;
        l.classList.toggle("marcado", cb.checked);
        e.preventDefault();
      };
    });

    document.getElementById("verificar").onclick = () => {
      let correctas = 0;
      nodo.items.forEach((it, i) => {
        const l = app.querySelector(`.item[data-i="${i}"]`);
        const marcado = l.querySelector("input").checked;
        const acierto = marcado === !!it.esMUE;
        if (acierto) correctas++;
        l.classList.add("bloq", acierto ? "item-ok" : "item-mal");
        const nota = document.createElement("div");
        nota.className = "item-nota " + (it.esMUE ? "es-mue" : "no-mue");
        nota.innerHTML = `<b>${it.esMUE ? "★ MUE" : "○ No es MUE"}</b> — ${esc(it.nota)}`;
        l.appendChild(nota);
      });
      const aprob = correctas >= nodo.minCorrectas;
      ganar(aprob ? 14 : -6, correctas * 6);
      const btn = document.getElementById("verificar"); btn.style.display = "none";
      const fb = document.createElement("div");
      fb.className = "feedback " + (aprob ? "fb-ok" : "fb-mal");
      fb.innerHTML =
        `<div class="fb-cab">${correctas} / ${nodo.items.length} correctas ${aprob ? "✓" : ""}</div>
         <p>${esc(aprob ? nodo.feedbackAlto : nodo.feedbackBajo)}</p>
         <button class="btn primario" id="seguir">Continuar <span>▸</span></button>`;
      app.appendChild(fb);
      fb.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
      document.getElementById("seguir").onclick = () => ir(nodo.siguiente);
    };
  }

  /* ------------------------------ EVALUACIÓN ---------------------------- */
  function rEvaluacion(nodo) {
    app.innerHTML =
      card((nodo.ilustracion ? escena(nodo.ilustracion) : "") +
        `<div class="card-pad"><div class="quiz-badge">EVALUACIÓN</div><h2>${esc(nodo.titulo)}</h2>
         <p class="cuerpo">${esc(nodo.cuerpo)}</p></div>`, nodo.ilustracion ? "con-escena" : "") +
      `<div class="opciones">${nodo.opciones.map((op, i) =>
        `<button class="btn opcion" data-i="${i}"><span class="op-letra">${String.fromCharCode(65 + i)}</span><span>${esc(op.texto)}</span></button>`).join("")}</div>`;

    app.querySelectorAll(".opcion").forEach((b) => {
      b.onclick = () => {
        const op = nodo.opciones[+b.dataset.i];
        estado.totalEval++;
        if (op.correcta) { estado.aciertosEval++; ganar(6, 25); } else { ganar(-4, 0); }
        guardar();
        app.querySelectorAll(".opcion").forEach((x, i) => {
          x.disabled = true; x.classList.add("inerte");
          if (nodo.opciones[i].correcta) { x.classList.remove("inerte"); x.classList.add("elegida-ok"); }
        });
        if (!op.correcta) b.classList.add("elegida-mal");
        const fb = document.createElement("div");
        fb.className = "feedback " + (op.correcta ? "fb-ok" : "fb-mal");
        fb.innerHTML = `<div class="fb-cab">${op.correcta ? "✓ Correcto" : "✗ Incorrecto"}</div>
          <p>${esc(op.correcta ? nodo.feedbackOk : nodo.feedbackNo)}</p>
          <button class="btn primario" id="seguir">Continuar <span>▸</span></button>`;
        app.appendChild(fb);
        fb.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
        document.getElementById("seguir").onclick = () => ir(nodo.siguiente);
      };
    });
  }

  /* -------------------------------- FINAL ------------------------------- */
  // Tres variantes de desenlace según el camino tomado: exito | mixto | fallo.
  const HEROES = {
    exito: { col: "#2DD4BF", ico: `<path d="M28 46 l8 9 l18 -22" stroke="#2DD4BF" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` },
    mixto: { col: "#FFC53D", ico: `<rect x="36.6" y="30" width="6.8" height="26" rx="3.4" fill="#FFC53D"/><circle cx="40" cy="66" r="4" fill="#FFC53D"/>` },
    fallo: { col: "#FF5A5F", ico: `<path d="M31 37 l18 18 M49 37 l-18 18" stroke="#FF5A5F" stroke-width="6" fill="none" stroke-linecap="round"/>` }
  };
  function rFinal(nodo) {
    const v = clamp(estado.indicador);
    const variante = nodo.variante || "exito";
    const h = HEROES[variante] || HEROES.exito;
    const celebra = variante === "exito";
    app.innerHTML = card(`
      <div class="final-hero var-${variante}">
        <div class="final-glow" style="background:radial-gradient(circle, ${h.col}66, transparent 65%)"></div>
        <svg viewBox="0 0 80 92" width="104" height="120" class="final-escudo">
          <path d="M40 3 L74 16 V40 Q74 74 40 89 Q6 74 6 40 V16z" fill="#141C2E" stroke="${h.col}" stroke-width="3"/>
          ${h.ico}
        </svg>
      </div>
      <div class="card-pad">
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
      `<button class="btn primario" id="reiniciar-final">${variante === "fallo" ? "Reintentar el capítulo" : "Volver a jugar"}</button>
       <button class="btn" id="volver-menu">Volver al menú principal</button>`;
    // Reinicio directo y garantizado (sin confirm() nativo, que el hosting bloquea).
    document.getElementById("reiniciar-final").onclick = reiniciarDirecto;
    document.getElementById("volver-menu").onclick = () => { if (onHome) onHome(); };
    if (celebra && !reduce) confeti();
  }

  /* ------------------------------ CONFETI ------------------------------- */
  function confeti() {
    const cv = document.createElement("canvas");
    cv.className = "confeti"; app.appendChild(cv);
    const ctx = cv.getContext("2d");
    const w = cv.width = app.clientWidth, h = cv.height = app.clientHeight;
    const cols = ["#FFC24B", "#FF6B1A", "#2DD4BF", "#9B7BFF", "#EAF0FA"];
    const P = Array.from({ length: 90 }, () => ({
      x: Math.random() * w, y: -20 - Math.random() * h * 0.4,
      s: 4 + Math.random() * 5, vy: 2 + Math.random() * 3, vx: -1 + Math.random() * 2,
      c: cols[(Math.random() * cols.length) | 0], r: Math.random() * 6, vr: -0.2 + Math.random() * 0.4
    }));
    let t = 0;
    (function loop() {
      t++; ctx.clearRect(0, 0, w, h);
      P.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 1.6); ctx.restore();
      });
      if (t < 180) requestAnimationFrame(loop); else cv.remove();
    })();
  }

  function reiniciarDirecto() {
    try { localStorage.removeItem(CLAVE); } catch (e) {}
    estado = nuevoEstado(); guardar(); render();
  }

  // Diálogo de confirmación propio (no usamos confirm() nativo: el iframe del
  // hosting lo bloquea, por eso antes el botón "no hacía nada").
  function reiniciar() {
    const ov = document.createElement("div");
    ov.className = "modal-ov";
    ov.innerHTML = `<div class="modal">
        <h3>¿Reiniciar el capítulo?</h3>
        <p>Perderás el progreso y las decisiones de esta partida.</p>
        <div class="modal-btns">
          <button class="btn" id="m-no">Cancelar</button>
          <button class="btn primario" id="m-si">Reiniciar</button>
        </div></div>`;
    document.querySelector(".telefono").appendChild(ov);
    requestAnimationFrame(() => ov.classList.add("visible"));
    const cerrar = () => ov.remove();
    ov.addEventListener("click", (e) => { if (e.target === ov) cerrar(); });
    ov.querySelector("#m-no").onclick = cerrar;
    ov.querySelector("#m-si").onclick = () => { cerrar(); reiniciarDirecto(); };
  }

  render();
}
window.MotorA = { iniciar: iniciarMotorA };

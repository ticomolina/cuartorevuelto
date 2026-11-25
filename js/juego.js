/* CUARTO REVUELTO · lógica del juego */
(function () {
  "use strict";
  const D = window.DATOS;
  const $ = (id) => document.getElementById(id);

  const CLAVE_RECORD = "cuartoRevuelto.record";
  const CLAVE_VOZ = "cuartoRevuelto.voz";
  const leer = (k, def) => { try { const v = localStorage.getItem(k); return v === null ? def : v; } catch (e) { return def; } };
  const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };

  let record = parseInt(leer(CLAVE_RECORD, "0"), 10) || 0;
  let vozActiva = leer(CLAVE_VOZ, "1") === "1";

  /* ---------- utilidades ---------- */
  const azar = (a, b) => a + Math.random() * (b - a);
  const entero = (a, b) => Math.floor(azar(a, b + 1));
  const elegir = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const limitar = (v, a, b) => Math.max(a, Math.min(b, v));
  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
  const mezclar = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  const reiniciarAnimacion = (el, clase) => { el.classList.remove(clase); void el.offsetWidth; el.classList.add(clase); };

  /* ---------- títulos de letras recortadas ---------- */
  const COLORES = ["#E8505B", "#F9A03F", "#3FB8AF", "#7B6CF6", "#F2C14E", "#4FB848", "#EF6FA8", "#4A90E2"];
  const GIROS = [-7, 5, -3, 8, -5, 3, -8, 6, -2, 7, -4, 4];
  function recortar(el, texto) {
    el.innerHTML = "";
    let i = 0;
    texto.split("|").forEach((renglon) => {
      const r = document.createElement("span");
      r.className = "renglon";
      for (const ch of renglon) {
        const s = document.createElement("span");
        if (ch === " ") { s.className = "espacio"; r.appendChild(s); continue; }
        s.className = "letra";
        s.textContent = ch;
        s.style.color = COLORES[(i * 3 + 1) % COLORES.length];
        s.style.setProperty("--rot", GIROS[i % GIROS.length] + "deg");
        s.style.setProperty("--dy", ((i % 3) - 1) * 0.04 + "em");
        r.appendChild(s);
        i++;
      }
      el.appendChild(r);
    });
  }

  /* ---------- pantallas y capas ---------- */
  const mostrarPantalla = (id) => document.querySelectorAll(".pantalla").forEach((p) => p.classList.toggle("activa", p.id === id));
  const capa = (id, on) => $(id).classList.toggle("activa", on);
  const cerrarCapas = () => ["capa-festejo", "capa-tiempo", "capa-pausa", "capa-fin", "capa-ajustes"].forEach((c) => capa(c, false));

  /* ---------- estado ---------- */
  const E = {
    estrellas: 0, vidas: 0, pistas: 0, nivel: 1,
    escenario: null, nivelesEnEscenario: 0,
    cfg: null, misiones: [], errores: 0, pistasNivel: 0,
    tiempoTotal: 1, tiempoRestante: 1,
    corriendo: false, bloqueado: true, enJuego: false, pistaVisible: false,
    ultimoTick: 0, token: 0
  };
  window.CuartoRevuelto = E; // útil para probar desde la consola

  const configNivel = (n) => D.niveles[Math.min(n, D.niveles.length) - 1];

  function nuevoEscenario() {
    const opciones = D.escenarios.filter((e) => e !== E.escenario);
    E.escenario = elegir(opciones.length ? opciones : D.escenarios);
    E.nivelesEnEscenario = 0;
  }

  /* ---------- partida ---------- */
  function iniciarPartida() {
    E.token++;
    cerrarCapas();
    E.estrellas = 0;
    E.vidas = D.partida.vidas;
    E.pistas = D.partida.pistas;
    E.nivel = 1;
    E.escenario = null;
    nuevoEscenario();
    E.enJuego = true;
    mostrarPantalla("pantalla-juego");
    pintarEstrellas(); pintarVidas(); pintarPistas();
    prepararNivel();
  }

  function prepararNivel() {
    pintarNivel();
    E.cfg = configNivel(E.nivel);
    E.errores = 0;
    E.pistasNivel = 0;
    const objs = mezclar(E.escenario.objetos);
    const n = Math.max(1, Math.min(E.cfg.misiones, objs.length - 1, 3));
    E.misiones = objs.slice(0, n).map((o) => ({ obj: o, total: entero(E.cfg.cantidad[0], E.cfg.cantidad[1]), encontrados: 0, llegados: 0, el: null }));
    armarNivel();
  }

  // Arma (o rearma, si se acabó el tiempo) el nivel actual con las mismas misiones
  function armarNivel() {
    E.misiones.forEach((m) => { m.encontrados = 0; m.llegados = 0; });
    pintarMisiones();
    generarObjetos();
    E.tiempoTotal = E.cfg.segundos;
    E.tiempoRestante = E.cfg.segundos;
    pintarTiempo();
    E.bloqueado = false;
    E.corriendo = true;
    E.ultimoTick = 0;
  }

  /* ---------- objetos sobre el escenario ---------- */
  function elegirRelleno() {
    const buscadas = new Set(E.misiones.map((m) => m.obj.palabra));
    const pool = E.escenario.objetos.filter((o) => !buscadas.has(o.palabra));
    const porPalabra = {};
    E.escenario.objetos.forEach((o) => { porPalabra[o.palabra] = o; });
    const parecidos = [];
    E.misiones.forEach((m) => (m.obj.parecidos || []).forEach((p) => {
      if (porPalabra[p] && !buscadas.has(p)) parecidos.push(porPalabra[p]);
    }));
    const res = [];
    let bolsa = [];
    if (!pool.length) return res;
    for (let i = 0; i < E.cfg.relleno; i++) {
      if (parecidos.length && Math.random() < E.cfg.parecidos) res.push(elegir(parecidos));
      else { if (!bolsa.length) bolsa = mezclar(pool); res.push(bolsa.pop()); }
    }
    return res;
  }

  // Rectángulo donde se dibuja la imagen de fondo (entera, centrada) dentro del escenario
  function caja() {
    const r = $("escenario").getBoundingClientRect();
    const iw = E.escenario._iw || 1, ih = E.escenario._ih || 1;
    const margen = 0.01;
    const esc = Math.min((r.width * (1 - 2 * margen)) / iw, (r.height * (1 - 2 * margen)) / ih);
    const w = iw * esc, h = ih * esc;
    return { x: (r.width - w) / 2, y: (r.height - h) / 2, w, h };
  }

  function pintarFondo(c) {
    const esc = $("escenario");
    esc.style.backgroundImage = `url("${E.escenario.fondo}")`;
    esc.style.backgroundSize = `${c.w}px ${c.h}px`;
    esc.style.backgroundPosition = `${c.x}px ${c.y}px`;
  }

  // piso: puntos [x, y] en % de la imagen; se achica un poco hacia el centro
  function poligonoPiso() {
    const pts = (E.escenario.piso && E.escenario.piso.length >= 3)
      ? E.escenario.piso.map(([x, y]) => [x / 100, y / 100])
      : [[0.1, 0.1], [0.9, 0.1], [0.9, 0.9], [0.1, 0.9]];
    const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length;
    const cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
    return pts.map(([x, y]) => [cx + (x - cx) * 0.94, cy + (y - cy) * 0.94]);
  }
  function dentro(pol, x, y) {
    let adentro = false;
    for (let i = 0, j = pol.length - 1; i < pol.length; j = i++) {
      const [xi, yi] = pol[i], [xj, yj] = pol[j];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) adentro = !adentro;
    }
    return adentro;
  }

  function generarObjetos() {
    const cont = $("objetos");
    cont.innerHTML = "";
    const cfg = E.cfg;
    const c = caja();
    pintarFondo(c);
    const s = (cfg.tamano / 100) * c.w;
    const pol = poligonoPiso();
    const xs = pol.map((p) => p[0]), ys = pol.map((p) => p[1]);
    const bx0 = Math.min(...xs), bx1 = Math.max(...xs), by0 = Math.min(...ys), by1 = Math.max(...ys);
    const alPiso = () => { // punto al azar dentro del piso (en fracción de la imagen)
      for (let t = 0; t < 300; t++) {
        const u = azar(bx0, bx1), v = azar(by0, by1);
        if (dentro(pol, u, v)) return [u, v];
      }
      return [(bx0 + bx1) / 2, (by0 + by1) / 2];
    };

    const puestos = [];
    let minD = s * 1.15;
    function lugar() {
      for (let intento = 1; intento <= 500; intento++) {
        if (intento % 60 === 0) minD = Math.max(minD * 0.9, s * 0.7);
        const [u, v] = alPiso();
        const x = u * c.w, y = v * c.h;
        if (puestos.every((p) => Math.hypot(p.x - x, p.y - y) >= minD)) { puestos.push({ x, y }); return [u, v]; }
      }
      const p = alPiso();
      puestos.push({ x: p[0] * c.w, y: p[1] * c.h });
      return p;
    }
    function crear(obj, u, v, mision, zIndex) {
      const el = document.createElement("div");
      el.className = "obj";
      el.textContent = obj.emoji;
      el._obj = obj;
      el._mision = mision;
      el._f = azar(0.9, 1.1);
      el._u = u;
      el._v = v;
      el.style.zIndex = zIndex;
      el.style.setProperty("--r", azar(-cfg.giro, cfg.giro).toFixed(1) + "deg");
      el.addEventListener("pointerdown", tocarObjeto);
      cont.appendChild(el);
    }

    const buscados = [];
    E.misiones.forEach((m) => { for (let k = 0; k < m.total; k++) buscados.push(m); });
    const relleno = elegirRelleno();
    const nTapados = Math.round(buscados.length * cfg.tapados);

    mezclar(buscados).forEach((m, i) => {
      const [u, v] = lugar();
      crear(m.obj, u, v, m, 3);
      if (i < nTapados && relleno.length) {
        // un objeto de relleno queda encima, tapando una parte
        for (let t = 0; t < 12; t++) {
          const ang = azar(0, Math.PI * 2), d = s * azar(0.45, 0.6);
          const tu = u + (Math.cos(ang) * d) / c.w, tv = v + (Math.sin(ang) * d) / c.h;
          if (dentro(pol, tu, tv) || t === 11) {
            crear(relleno.pop(), tu, tv, null, 8);
            puestos.push({ x: tu * c.w, y: tv * c.h });
            break;
          }
        }
      }
    });
    relleno.forEach((o) => { const [u, v] = lugar(); crear(o, u, v, null, entero(1, 5)); });
    ubicarObjetos(c);
  }

  // posiciona y dimensiona los objetos según el tamaño actual de la pantalla
  function ubicarObjetos(c) {
    if (!E.cfg) return;
    c = c || caja();
    pintarFondo(c);
    const s = (E.cfg.tamano / 100) * c.w;
    document.querySelectorAll("#objetos .obj").forEach((el) => {
      el.style.left = c.x + el._u * c.w + "px";
      el.style.top = c.y + el._v * c.h + "px";
      el.style.fontSize = s * el._f + "px";
    });
  }

  /* ---------- toques ---------- */
  function tocarObjeto(ev) {
    ev.preventDefault();
    if (!E.corriendo || E.bloqueado) return;
    const el = ev.currentTarget;
    if (el.classList.contains("ok")) return;
    const m = el._mision;
    if (m && m.encontrados < m.total) acierto(el, m);
    else fallo(el);
  }

  function acierto(el, m) {
    m.encontrados++;
    el.classList.add("ok");
    Sonidos.tocar("acierto");
    if (E.misiones.every((x) => x.encontrados >= x.total)) { E.corriendo = false; E.bloqueado = true; }
    const t = E.token;
    setTimeout(() => {
      if (t !== E.token) return;
      volar(el, m, () => {
        if (t !== E.token) return;
        m.llegados++;
        actualizarMision(m);
        if (E.misiones.every((x) => x.llegados >= x.total)) nivelCompleto(t);
      });
    }, 330);
  }

  function volar(el, m, listo) {
    const r = el.getBoundingClientRect();
    const destino = m.el.querySelector(".palabra").getBoundingClientRect();
    const v = document.createElement("div");
    v.className = "volador";
    v.textContent = el._obj.emoji;
    v.style.fontSize = el.style.fontSize;
    $("vuelos").appendChild(v);
    const w = v.offsetWidth, h = v.offsetHeight;
    const sx = r.left + r.width / 2 - w / 2, sy = r.top + r.height / 2 - h / 2;
    const dx = destino.left + destino.width / 2 - w / 2, dy = destino.top + destino.height / 2 - h / 2;
    const escala = Math.max(0.3, (destino.height * 1.3) / h);
    el.classList.add("oculto");
    const anim = v.animate([
      { transform: `translate(${sx}px, ${sy}px) scale(1.2)` },
      { transform: `translate(${(sx + dx) / 2}px, ${Math.min(sy, dy) - 60}px) scale(1.3)`, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(${escala})`, opacity: 0.85 }
    ], { duration: 650, easing: "cubic-bezier(.45,.05,.55,1)" });
    anim.onfinish = () => { v.remove(); listo(); };
  }

  function fallo(el) {
    reiniciarAnimacion(el, "mal");
    Sonidos.tocar("error");
    E.errores++;
    perderVida();
  }

  // devuelve true si se terminó la partida
  function perderVida() {
    E.vidas = Math.max(0, E.vidas - 1);
    pintarVidas(true);
    if (E.vidas <= 0) {
      E.corriendo = false;
      E.bloqueado = true;
      const t = E.token;
      setTimeout(() => { if (t === E.token) finPartida(); }, 1000);
      return true;
    }
    return false;
  }

  async function tiempoAgotado() {
    E.corriendo = false;
    E.bloqueado = true;
    E.tiempoRestante = 0;
    pintarTiempo();
    E.errores++;
    Sonidos.tocar("tiempo");
    const t = E.token;
    capa("capa-tiempo", true);
    const terminada = perderVida();
    if (terminada) return;
    await esperar(1900);
    if (t !== E.token) return;
    capa("capa-tiempo", false);
    armarNivel();
  }

  function usarPista() {
    if (!E.corriendo || E.bloqueado || E.pistas <= 0 || E.pistaVisible) return;
    E.pistas--;
    E.pistasNivel++;
    E.pistaVisible = true;
    pintarPistas();
    Sonidos.tocar("pista");
    E.misiones.filter((m) => m.llegados < m.total).forEach((m) => {
      const b = document.createElement("span");
      b.className = "pista-emoji";
      b.textContent = m.obj.emoji;
      m.el.appendChild(b);
    });
    setTimeout(() => {
      document.querySelectorAll(".pista-emoji").forEach((b) => b.remove());
      E.pistaVisible = false;
    }, D.partida.segundosPista * 1000);
  }

  /* ---------- fin de nivel ---------- */
  async function nivelCompleto(t) {
    if (t !== E.token) return;
    const fallas = E.errores + E.pistasNivel;
    const ganadas = fallas === 0 ? 3 : fallas === 1 ? 2 : 1;
    E.estrellas += ganadas;

    E.nivel++;
    E.nivelesEnEscenario++;
    let cambio = false;
    if (E.nivelesEnEscenario >= D.partida.cambiarEscenarioCada) { nuevoEscenario(); cambio = true; }

    await esperar(250);
    if (t !== E.token) return;
    recortar($("titulo-festejo"), "¡MUY BIEN!");
    const cont = $("estrellas-festejo");
    cont.innerHTML = "";
    const svgs = [];
    for (let i = 0; i < 3; i++) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 100 100");
      const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
      use.setAttribute("href", i < ganadas ? "#i-estrella" : "#i-estrella-gris");
      svg.appendChild(use);
      cont.appendChild(svg);
      svgs.push(svg);
    }
    $("proximo").innerHTML = cambio ? `<span class="ico">${E.escenario.icono || ""}</span>${E.escenario.nombre}` : "";
    capa("capa-festejo", true);
    Sonidos.tocar("nivel");
    for (let i = 0; i < 3; i++) {
      await esperar(i === 0 ? 350 : 260);
      if (t !== E.token) return;
      svgs[i].classList.add("ve");
      if (i < ganadas) Sonidos.tocar("estrella", i);
    }
    pintarEstrellas(true);
    await esperar(D.partida.segundosFestejo * 1000 - 600 + (cambio ? 500 : 0));
    if (t !== E.token) return;
    capa("capa-festejo", false);
    prepararNivel();
  }

  function finPartida() {
    E.token++;
    E.corriendo = false;
    E.bloqueado = true;
    E.enJuego = false;
    cerrarCapas();
    const nuevo = E.estrellas > record;
    if (nuevo) { record = E.estrellas; guardar(CLAVE_RECORD, String(record)); }
    recortar($("titulo-fin"), nuevo ? "¡NUEVO|RÉCORD!" : "¡BUENA|PARTIDA!");
    $("estrellas-fin").textContent = E.estrellas;
    $("record-fin").textContent = record;
    $("record-inicio").textContent = record;
    $("capa-fin").querySelector(".ventana").classList.toggle("record", nuevo);
    capa("capa-fin", true);
    if (nuevo) { Sonidos.tocar("record"); confeti(); } else Sonidos.tocar("fin");
  }

  function irInicio() {
    E.token++;
    E.corriendo = false;
    E.bloqueado = true;
    E.enJuego = false;
    cerrarCapas();
    $("record-inicio").textContent = record;
    mostrarPantalla("pantalla-inicio");
  }

  function pausar() {
    if (!E.corriendo) return;
    E.corriendo = false;
    capa("capa-pausa", true);
  }
  function seguir() {
    capa("capa-pausa", false);
    if (E.enJuego && !E.bloqueado) { E.corriendo = true; E.ultimoTick = 0; }
  }

  // Cambiar de nivel con − / + (salta al nivel elegido, sin perder estrellas ni vidas)
  const NIVEL_MAXIMO = 99;
  function cambiarNivel(d) {
    if (!E.enJuego || E.vidas <= 0) return;
    if ($("capa-festejo").classList.contains("activa")) return;
    const n = limitar(E.nivel + d, 1, NIVEL_MAXIMO);
    if (n === E.nivel) return;
    E.token++;
    capa("capa-tiempo", false);
    document.querySelectorAll("#vuelos .volador").forEach((v) => v.remove());
    E.nivel = n;
    prepararNivel();
  }

  /* ---------- pintar interfaz ---------- */
  function pintarNivel() {
    $("num-nivel").textContent = E.nivel;
    $("btn-nivel-menos").disabled = E.nivel <= 1;
    $("btn-nivel-mas").disabled = E.nivel >= NIVEL_MAXIMO;
  }

  function pintarEstrellas(saltar) {
    $("num-estrellas").textContent = E.estrellas;
    if (saltar) reiniciarAnimacion($("contador-estrellas"), "salta");
  }

  function pintarVidas(perdio) {
    const c = $("vidas");
    c.innerHTML = "";
    for (let i = 0; i < D.partida.vidas; i++) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 100 90");
      const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
      use.setAttribute("href", "#i-corazon");
      svg.appendChild(use);
      if (i >= E.vidas) svg.classList.add("perdido");
      if (perdio && i === E.vidas) svg.classList.add("pierde");
      c.appendChild(svg);
    }
  }

  function pintarPistas() {
    $("num-pistas").textContent = E.pistas;
    $("btn-pista").classList.toggle("agotada", E.pistas <= 0);
  }

  function pintarTiempo() {
    const f = limitar(E.tiempoRestante / E.tiempoTotal, 0, 1);
    const r = $("relleno-tiempo");
    r.style.width = f * 100 + "%";
    r.classList.toggle("medio", f <= 0.5 && f > 0.2);
    r.classList.toggle("poco", f <= 0.2);
  }

  function pintarMisiones() {
    const c = $("misiones");
    c.innerHTML = "";
    E.misiones.forEach((m, i) => {
      const d = document.createElement("button");
      d.className = "mision c" + i;
      d.innerHTML = `<span class="numero">${m.total}</span><span class="cuerpo"><span class="palabra"></span><span class="cuenta">0/${m.total}</span></span>`;
      d.querySelector(".palabra").textContent = m.total > 1 ? m.obj.plural : m.obj.palabra;
      d.addEventListener("click", () => decir(m));
      m.el = d;
      c.appendChild(d);
    });
    ajustarPalabras();
  }

  // achica la palabra si no entra en la tarjeta (palabras largas en celular)
  function ajustarPalabras() {
    document.querySelectorAll(".mision .palabra").forEach((p) => {
      p.style.fontSize = "";
      const max = p.parentElement.clientWidth - 6;
      let fs = parseFloat(getComputedStyle(p).fontSize);
      while (p.scrollWidth > max && fs > 15) { fs -= 1; p.style.fontSize = fs + "px"; }
    });
  }

  function actualizarMision(m) {
    m.el.querySelector(".cuenta").textContent = `${m.llegados}/${m.total}`;
    reiniciarAnimacion(m.el, "salta");
    Sonidos.tocar("llega");
    if (m.llegados >= m.total) m.el.classList.add("completa");
  }

  /* ---------- voz (Web Speech API) ---------- */
  let voces = [];
  function cargarVoces() { try { voces = speechSynthesis.getVoices(); } catch (e) {} }
  function vozEspanol() {
    const pref = ["es-ar", "es-419", "es-us", "es-mx", "es-es"];
    for (const p of pref) {
      const v = voces.find((x) => x.lang.replace("_", "-").toLowerCase() === p);
      if (v) return v;
    }
    return voces.find((x) => x.lang.toLowerCase().startsWith("es"));
  }
  function decir(m) {
    if (!vozActiva || !("speechSynthesis" in window)) return;
    const palabra = (m.total > 1 ? m.obj.plural : m.obj.palabra).toLowerCase();
    const u = new SpeechSynthesisUtterance(m.total > 1 ? `${m.total} ${palabra}` : palabra);
    const v = vozEspanol();
    u.lang = v ? v.lang : "es-AR";
    if (v) u.voice = v;
    u.rate = 0.85;
    u.pitch = 1.1;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }
  if ("speechSynthesis" in window) {
    cargarVoces();
    speechSynthesis.addEventListener && speechSynthesis.addEventListener("voiceschanged", cargarVoces);
  }

  /* ---------- confeti ---------- */
  function confeti() {
    const cv = $("confeti");
    const cx = cv.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    cv.style.display = "block";
    cv.width = innerWidth * dpr;
    cv.height = innerHeight * dpr;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const ps = Array.from({ length: 170 }, () => ({
      x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * 0.7,
      vx: azar(-1.6, 1.6), vy: azar(2, 5), r: azar(0, 6.3), vr: azar(-0.2, 0.2),
      w: azar(9, 16), h: azar(6, 10), c: elegir(COLORES)
    }));
    const inicio = performance.now();
    (function cuadro(t) {
      cx.clearRect(0, 0, innerWidth, innerHeight);
      ps.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.r += p.vr; p.vy += 0.03;
        cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r);
        cx.fillStyle = p.c; cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        cx.restore();
      });
      if (t - inicio < 4800) requestAnimationFrame(cuadro);
      else cv.style.display = "none";
    })(inicio);
  }

  /* ---------- reloj del nivel ---------- */
  function bucle(t) {
    requestAnimationFrame(bucle);
    const dt = E.ultimoTick ? (t - E.ultimoTick) / 1000 : 0;
    E.ultimoTick = t;
    if (!E.corriendo) return;
    E.tiempoRestante -= Math.min(dt, 0.25);
    pintarTiempo();
    if (E.tiempoRestante <= 0) tiempoAgotado();
  }

  /* ---------- arranque ---------- */
  function conToque(id, fn) {
    $(id).addEventListener("click", () => { Sonidos.tocar("toque"); fn(); });
  }

  function iniciar() {
    document.querySelectorAll("[data-texto]").forEach((el) => recortar(el, el.dataset.texto));
    $("record-inicio").textContent = record;
    const pintarSonido = () => $("icono-sonido").setAttribute("href", Sonidos.mudo ? "#i-mudo" : "#i-sonido");
    pintarSonido();
    $("estado-voz").textContent = vozActiva ? "SÍ" : "NO";

    // precargar fondos y conocer su tamaño
    const fondosListos = Promise.all(D.escenarios.map((e) => new Promise((listo) => {
      const img = new Image();
      img.onload = () => { e._iw = img.naturalWidth; e._ih = img.naturalHeight; listo(); };
      img.onerror = () => { e._iw = 1; e._ih = 1; listo(); };
      img.src = e.fondo;
    })));
    const jugar = () => fondosListos.then(iniciarPartida);

    document.addEventListener("pointerdown", () => Sonidos.desbloquear(), { once: true });
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    conToque("btn-jugar", jugar);
    conToque("btn-pausa", pausar);
    conToque("btn-seguir", seguir);
    conToque("btn-inicio-pausa", irInicio);
    conToque("btn-otra-vez-fin", jugar);
    conToque("btn-inicio-fin", irInicio);
    $("btn-pista").addEventListener("click", usarPista);
    conToque("btn-nivel-menos", () => cambiarNivel(-1));
    conToque("btn-nivel-mas", () => cambiarNivel(1));
    $("btn-sonido").addEventListener("click", () => {
      Sonidos.alternar();
      pintarSonido();
      Sonidos.tocar("toque");
    });

    // ajustes (para adultos)
    conToque("btn-ajustes", () => capa("capa-ajustes", true));
    conToque("btn-cerrar-ajustes", () => capa("capa-ajustes", false));
    conToque("btn-voz", () => {
      vozActiva = !vozActiva;
      guardar(CLAVE_VOZ, vozActiva ? "1" : "0");
      $("estado-voz").textContent = vozActiva ? "SÍ" : "NO";
    });
    let confirmarBorrado = null;
    conToque("btn-borrar-record", () => {
      const b = $("btn-borrar-record");
      if (confirmarBorrado) {
        clearTimeout(confirmarBorrado); confirmarBorrado = null;
        record = 0; guardar(CLAVE_RECORD, "0");
        $("record-inicio").textContent = "0";
        b.textContent = "RÉCORD BORRADO"; b.classList.remove("confirmar");
        setTimeout(() => { b.textContent = "BORRAR RÉCORD"; }, 1800);
      } else {
        b.textContent = "¿SEGURO? TOCÁ OTRA VEZ"; b.classList.add("confirmar");
        confirmarBorrado = setTimeout(() => { confirmarBorrado = null; b.textContent = "BORRAR RÉCORD"; b.classList.remove("confirmar"); }, 3000);
      }
    });

    document.addEventListener("visibilitychange", () => { if (document.hidden) pausar(); });
    let espera = null;
    window.addEventListener("resize", () => {
      clearTimeout(espera);
      espera = setTimeout(() => { if (E.enJuego) { ubicarObjetos(); ajustarPalabras(); } }, 120);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (E.enJuego) ajustarPalabras(); });

    requestAnimationFrame(bucle);

    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }

  iniciar();
})();

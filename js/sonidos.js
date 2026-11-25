/* Sonidos suaves sintetizados (no necesitan archivos, funcionan offline) */
window.Sonidos = (function () {
  const CLAVE = "cuartoRevuelto.mudo";
  let ctx = null;
  let mudo = false;
  try { mudo = localStorage.getItem(CLAVE) === "1"; } catch (e) {}

  function contexto() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // nota: frecuencia, inicio (s), duración (s), tipo de onda, volumen, frecuencia final
  function nota(f, t0, dur, tipo = "sine", vol = 0.16, fFin = null) {
    const c = contexto(); if (!c || mudo) return;
    const t = c.currentTime + t0;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = tipo;
    o.frequency.setValueAtTime(f, t);
    if (fFin) o.frequency.exponentialRampToValueAtTime(fFin, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination);
    o.start(t); o.stop(t + dur + 0.05);
  }

  const sonidos = {
    toque()    { nota(520, 0, 0.07, "triangle", 0.08); },
    acierto()  { nota(660, 0, 0.12, "triangle", 0.16); nota(990, 0.08, 0.2, "triangle", 0.14); },
    llega()    { nota(1180, 0, 0.09, "sine", 0.1, 1500); },
    error()    { nota(260, 0, 0.32, "sine", 0.2, 150); nota(200, 0.05, 0.3, "triangle", 0.06, 120); },
    pista()    { [880, 1100, 1320].forEach((f, i) => nota(f, i * 0.07, 0.18, "sine", 0.09)); },
    nivel()    { [523, 659, 784, 1047].forEach((f, i) => nota(f, i * 0.11, 0.28, "triangle", 0.14)); },
    estrella(i){ nota(880 + i * 220, 0, 0.18, "triangle", 0.12); },
    tiempo()   { nota(440, 0, 0.25, "triangle", 0.14, 330); nota(330, 0.25, 0.4, "triangle", 0.14, 220); },
    fin()      { [784, 659, 523, 659].forEach((f, i) => nota(f, i * 0.16, 0.3, "triangle", 0.12)); },
    record()   {
      [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => nota(f, i * 0.12, 0.3, "triangle", 0.14));
      for (let i = 0; i < 6; i++) nota(1800 + Math.random() * 900, 0.9 + i * 0.08, 0.12, "sine", 0.05);
    }
  };

  return {
    tocar(nombre, arg) { try { sonidos[nombre] && sonidos[nombre](arg); } catch (e) {} },
    desbloquear() { contexto(); },
    get mudo() { return mudo; },
    alternar() {
      mudo = !mudo;
      try { localStorage.setItem(CLAVE, mudo ? "1" : "0"); } catch (e) {}
      return mudo;
    }
  };
})();

// Pitidos del timer de descanso vía Web Audio API (sin assets externos).

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

/** Un pitido corto. `strong` = más grave y largo (aviso final). */
export function beep(strong = false): void {
  const c = getCtx();
  if (!c) return;
  if (c.state === 'suspended') void c.resume();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.type = 'sine';
  osc.frequency.value = strong ? 660 : 880;
  const now = c.currentTime;
  const dur = strong ? 0.4 : 0.12;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(strong ? 0.35 : 0.22, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.start(now);
  osc.stop(now + dur + 0.02);
}

/** Desbloquea el audio en el primer gesto del usuario (política de autoplay). */
export function primeAudio(): void {
  const c = getCtx();
  if (c && c.state === 'suspended') void c.resume();
}

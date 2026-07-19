// Utilidades de formato y fechas. Fechas siempre como YYYY-MM-DD (clave natural).

export function todayISO(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function daysBetween(aISO: string, bISO: string): number {
  const a = new Date(aISO + 'T00:00:00').getTime();
  const b = new Date(bISO + 'T00:00:00').getTime();
  return Math.round((b - a) / 86_400_000);
}

export function shortDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export function fmtDuration(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function fmtWeight(kg: number): string {
  if (kg === 0) return '—';
  return Number.isInteger(kg) ? `${kg}` : kg.toFixed(1);
}

/** "90s" → 90. Devuelve null si no hay número. */
export function parseRestSeconds(rest: string): number | null {
  const m = rest.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

/** Reps objetivo "6-8" → 8 (extremo alto), "12" → 12, "10 c/l" → 10. */
export function parseTargetReps(reps: string): number {
  const nums = reps.match(/\d+/g);
  if (!nums) return 0;
  return parseInt(nums[nums.length - 1], 10);
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** Redondea al múltiplo de `step` y limita a [min, max]. */
export function roundToStep(value: number, step: number, min: number, max: number): number {
  if (step <= 0) return 0;
  const w = Math.round(value / step) * step;
  return clamp(Number(w.toFixed(2)), min, max);
}

export function uid(prefix = ''): string {
  return prefix + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

/** Slug estable a partir de un nombre (para IDs de ejercicios añadidos a mano). */
export function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

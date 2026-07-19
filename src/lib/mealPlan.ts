// Rotación del pool de comidas: cada semana y día muestra una combinación
// distinta (determinista), y el usuario puede cambiar cada comida a mano.

import type { Macros, Meal } from '@/types';
import { MEAL_POOL, MEAL_SLOTS } from '@/data/nutrition';
import { WEEK_TEMPLATE } from '@/data/schedule';

export interface PlannedMeal {
  slotId: string;
  slotLabel: string;
  time: string;
  meal: Meal;
  poolIndex: number;
  poolLength: number;
  key: string;
}

/** Semana absoluta (cambia el plan cada 7 días de forma automática). */
export function weekBucket(now = Date.now()): number {
  return Math.floor(now / (7 * 86_400_000));
}

/** Plan de comidas de un día concreto de esta semana. */
export function planForDay(
  dayIdx: number,
  bucket: number,
  overrides: Record<string, number>,
): PlannedMeal[] {
  const isRest = WEEK_TEMPLATE[dayIdx]?.type === 'rest';
  const out: PlannedMeal[] = [];
  MEAL_SLOTS.forEach((slot, si) => {
    if (isRest && !slot.onRestDay) return;
    const pool = MEAL_POOL[slot.id] ?? [];
    if (pool.length === 0) return;
    const key = `${bucket}-${dayIdx}-${slot.id}`;
    const base = (bucket * 3 + dayIdx * 2 + si * 5) % pool.length;
    const override = overrides[key];
    const idx = override !== undefined ? ((override % pool.length) + pool.length) % pool.length : base;
    out.push({
      slotId: slot.id,
      slotLabel: slot.label,
      time: slot.time,
      meal: pool[idx],
      poolIndex: idx,
      poolLength: pool.length,
      key,
    });
  });
  return out;
}

export function dayMacros(meals: PlannedMeal[]): Macros {
  return meals.reduce<Macros>(
    (a, m) => ({
      kcal: a.kcal + m.meal.macros.kcal,
      protein: a.protein + m.meal.macros.p,
      carbs: a.carbs + m.meal.macros.c,
      fat: a.fat + m.meal.macros.f,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

/** Comida "hero": la próxima según la hora (o la actual si estás en su franja ±90 min). */
export function pickHero(meals: PlannedMeal[]): { meal: PlannedMeal; label: string } | null {
  if (meals.length === 0) return null;
  const now = new Date().getHours() * 60 + new Date().getMinutes();
  const min = (t: string) => {
    const [h, m] = t.split(':').map((x) => parseInt(x, 10));
    return h * 60 + (m || 0);
  };
  const sorted = [...meals].sort((a, b) => min(a.time) - min(b.time));
  const current = sorted.find((m) => Math.abs(min(m.time) - now) <= 90);
  if (current) return { meal: current, label: 'Ahora' };
  const next = sorted.find((m) => min(m.time) > now);
  if (next) return { meal: next, label: 'Siguiente' };
  return { meal: sorted[0], label: 'Mañana' };
}

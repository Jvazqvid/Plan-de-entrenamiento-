// Herramientas de sesión: series de aproximación (warm-up ramp) y racha de constancia.

import type { ScheduleSlot } from '@/types';
import { roundToStep } from './format';

export interface WarmupSet {
  pct: number;
  weight: number;
  reps: number;
}

/**
 * Series de aproximación hacia el peso de trabajo. Rampa clásica 40/60/80%
 * con reps decrecientes, para lubricar la articulación y activar sin fatigar.
 */
export function warmupRamp(workingWeight: number, step: number, min: number): WarmupSet[] {
  if (workingWeight <= 0 || step <= 0) return [];
  const st = step > 0 ? step : 2.5;
  const plan: { pct: number; reps: number }[] = [
    { pct: 0.4, reps: 8 },
    { pct: 0.6, reps: 5 },
    { pct: 0.8, reps: 3 },
  ];
  const out: WarmupSet[] = [];
  let prev = -1;
  for (const p of plan) {
    const w = roundToStep(workingWeight * p.pct, st, min, workingWeight);
    if (w <= 0 || w >= workingWeight) continue;
    if (w === prev) continue; // evita repetir el mismo peso
    prev = w;
    out.push({ pct: p.pct, weight: w, reps: p.reps });
  }
  return out;
}

/**
 * Racha de sesiones consecutivas: días distintos con una sesión completada,
 * contando hacia atrás desde la más reciente, permitiendo huecos de hasta 3 días
 * (descansos) entre sesiones. Se rompe si el último entreno fue hace >3 días.
 */
export function currentStreak(schedule: ScheduleSlot[]): number {
  const dayMs = 86_400_000;
  const days = [
    ...new Set(
      schedule
        .filter((s) => s.status === 'done' && s.ts)
        .map((s) => {
          const d = new Date(s.ts as number);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        }),
    ),
  ].sort((a, b) => b - a);
  if (days.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (today.getTime() - days[0] > 3 * dayMs) return 0; // racha rota

  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    if (days[i - 1] - days[i] <= 3 * dayMs) streak++;
    else break;
  }
  return streak;
}

/** Nº total de sesiones completadas. */
export function totalSessionsDone(schedule: ScheduleSlot[]): number {
  return schedule.filter((s) => s.status === 'done').length;
}

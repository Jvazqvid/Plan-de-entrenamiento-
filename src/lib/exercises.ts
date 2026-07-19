// ============================================================================
// Filtrado de ejercicios por variante de semana y helpers de claves.
//
// El `id` del ejercicio es estable e independiente de la semana. La clave de
// historial es `${sessionId}:${exerciseId}` — NUNCA un índice posicional
// (ver docs/decisiones-datos.md #1).
// ============================================================================

import type { Exercise, ExerciseKey, Session, SessionId } from '@/types';
import { DELOAD_WEEK } from '@/data/schedule';

/**
 * Semanas (0-index) en las que aparece una variante.
 *   'base'    → todas
 *   'S1S3'    → {0, 2}
 *   'S2S4'    → {1, 3}
 *   'S5'      → {4}
 *   'S1S2S3'  → {0, 1, 2}
 */
export function variantWeeks(variant: string): Set<number> | 'all' {
  if (variant === 'base') return 'all';
  const weeks = new Set<number>();
  const matches = variant.match(/S(\d)/g);
  if (!matches) return 'all';
  for (const m of matches) {
    const n = parseInt(m.slice(1), 10);
    if (!Number.isNaN(n)) weeks.add(n - 1);
  }
  return weeks;
}

export function appearsInWeek(ex: Exercise, weekIdx: number): boolean {
  const w = variantWeeks(ex.variant);
  return w === 'all' || w.has(weekIdx);
}

/** Ejercicios de una sesión para una semana concreta, en orden. */
export function exercisesForWeek(session: Session, weekIdx: number): Exercise[] {
  return session.exercises.filter((ex) => appearsInWeek(ex, weekIdx));
}

export function historyKey(sessionId: SessionId, exerciseId: string): ExerciseKey {
  return `${sessionId}:${exerciseId}`;
}

/** Nº de series para una semana (weekSets tiene prioridad sobre sets). */
export function setsForWeek(ex: Exercise, weekIdx: number): number {
  return ex.weekSets?.[weekIdx] ?? ex.sets;
}

/** Reps objetivo para una semana (weekReps tiene prioridad sobre reps). */
export function repsForWeek(ex: Exercise, weekIdx: number): string {
  return ex.weekReps?.[weekIdx] ?? ex.reps;
}

/** RIR objetivo por semana del mesociclo (autorregulación, ver metodología §2, §7). */
export function targetRirForWeek(weekIdx: number): number {
  // Sem 1-2 técnica (3) · Sem 3 acumulación (2) · Sem 4 intensificación (1) · Sem 5 descarga (4)
  const map: Record<number, number> = { 0: 3, 1: 3, 2: 2, 3: 1, [DELOAD_WEEK]: 4 };
  return map[weekIdx] ?? 2;
}

export function isDeloadWeek(weekIdx: number): boolean {
  return weekIdx === DELOAD_WEEK;
}

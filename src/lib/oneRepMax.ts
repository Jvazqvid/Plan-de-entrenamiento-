// ============================================================================
// PUNTO ÚNICO de cálculo de 1RM. Todas las vistas (cabecera, tendencia, progreso)
// consumen desde aquí. No dupliques la fórmula (ver docs/decisiones-datos.md #3).
//
// Se usa SIEMPRE el peso máximo de la serie top, nunca la media (decisiones #3, #4).
// ============================================================================

import type { HistoryEntry } from '@/types';

/** Epley: 1RM ≈ peso · (1 + reps/30). Base de toda la app. */
export function epley(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

/** Brzycki, como referencia alternativa en la Guía técnica. */
export function brzycki(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0 || reps >= 37) return 0;
  return (weight * 36) / (37 - reps);
}

/** 1RM estimado de una entrada de historial (siempre desde el peso máximo). */
export function entryOneRm(e: HistoryEntry): number {
  return epley(e.maxWeight, e.reps);
}

/** Carga de trabajo para un %1RM objetivo. */
export function loadForPercent(oneRm: number, percent: number): number {
  return oneRm * (percent / 100);
}

/** 1RM estimado más reciente de un historial (0 si vacío). */
export function latestOneRm(history: HistoryEntry[]): number {
  if (history.length === 0) return 0;
  const sorted = [...history].sort((a, b) => a.ts - b.ts);
  return entryOneRm(sorted[sorted.length - 1]);
}

/** Tendencia del 1RM entrada a entrada: '↑' | '↓' | '='. */
export function oneRmTrend(history: HistoryEntry[]): '↑' | '↓' | '=' {
  if (history.length < 2) return '=';
  const sorted = [...history].sort((a, b) => a.ts - b.ts);
  const last = entryOneRm(sorted[sorted.length - 1]);
  const prev = entryOneRm(sorted[sorted.length - 2]);
  const diff = last - prev;
  if (Math.abs(diff) < 0.5) return '=';
  return diff > 0 ? '↑' : '↓';
}

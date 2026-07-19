// ============================================================================
// Sugerencia de peso y detección de estancamiento.
//
// Reglas (ver docs/especificacion-funcional.md y metodologia-fuerza.md §2, §4):
//   - Deload (semana 5): siempre −40% de la carga.
//   - Primera vez: peso de partida = min + 2·step.
//   - AUTORREGULACIÓN POR RIR (doble progresión, si hay RIR registrado):
//       · Tope de reps con RIR ≥ objetivo → sube carga.
//       · Se puso más duro de lo previsto (RIR < objetivo) → repite y consolida.
//       · 3 sesiones consistentemente muy duras → deload 5%.
//   - Sin RIR: se cae a la lógica por peso máximo (progresión/estancamiento clásicos).
//   - Multiplicador de disposición: fresco +5%, normal 0%, cansado −10%.
// ============================================================================

import type { Exercise, HistoryEntry, Readiness } from '@/types';
import { roundToStep, parseTargetReps } from './format';
import { isDeloadWeek, repsForWeek, targetRirForWeek } from './exercises';

export type SuggestionType = 'progress' | 'repeat' | 'deload' | 'start';

export interface Suggestion {
  weight: number;
  reason: string;
  type: SuggestionType;
  icon: string;
}

export function readinessMultiplier(readiness: Readiness): number {
  if (readiness === 'fresh') return 1.05;
  if (readiness === 'tired') return 0.9;
  return 1;
}

/** Segundos extra de descanso por disposición (cansado descansa más). */
export function readinessRestBonus(readiness: Readiness): number {
  return readiness === 'tired' ? 15 : 0;
}

const ICONS: Record<SuggestionType, string> = {
  progress: '↑',
  repeat: '🎯',
  deload: '↓',
  start: '✳️',
};

function pack(type: SuggestionType, weight: number, reason: string): Suggestion {
  return { type, weight, reason, icon: ICONS[type] };
}

export function suggestWeight(
  history: HistoryEntry[],
  ex: Exercise,
  weekIdx: number,
  readiness: Readiness = 'normal',
): Suggestion {
  const step = ex.step > 0 ? ex.step : 2.5;
  const mult = readinessMultiplier(readiness);
  const round = (v: number) => roundToStep(v, step, ex.min, ex.max);

  // Ejercicios sin carga (core con peso corporal): no hay peso que sugerir.
  if (ex.step === 0 && ex.max === 0) {
    return pack('repeat', 0, 'Peso corporal · céntrate en el control y el rango');
  }

  const entries = [...history].sort((a, b) => a.ts - b.ts);
  const last = entries[entries.length - 1];

  // --- Semana de descarga: siempre −40% ---
  if (isDeloadWeek(weekIdx)) {
    const base = last ? Math.max(last.maxWeight, last.avgWeight) : ex.min + 2 * step;
    return pack('deload', round(base * 0.6 * mult), 'Semana de descarga · −40% para disipar fatiga');
  }

  // --- Primera vez ---
  if (entries.length === 0) {
    return pack('start', round((ex.min + 2 * step) * mult), 'Primera vez · peso de partida conservador');
  }

  const targetRir = targetRirForWeek(weekIdx);
  const topReps = parseTargetReps(repsForWeek(ex, weekIdx));

  // --- Autorregulación por RIR (doble progresión) ---
  if (last.rir !== undefined) {
    const last3 = entries.slice(-3);
    const allHard = last3.length === 3 && last3.every((e) => e.rir !== undefined && e.rir < targetRir - 1);
    if (allHard) {
      return pack('deload', round(last.maxWeight * 0.95 * mult), '3 sesiones muy exigentes · baja 5% y resetea');
    }
    if (last.reps >= topReps && last.rir >= targetRir) {
      return pack('progress', round((last.maxWeight + step) * mult), `Tope de reps con ${last.rir} en reserva · +${step} kg`);
    }
    if (last.rir < targetRir) {
      return pack('repeat', round(last.maxWeight * mult), `Se puso exigente (RIR ${last.rir}) · repite y consolida`);
    }
    return pack('repeat', round(last.maxWeight * mult), 'Gana alguna rep más a este peso antes de subir');
  }

  // --- Estancamiento real: media y máximo estancados en las últimas 3 ---
  if (entries.length >= 3) {
    const [a, b, c] = entries.slice(-3);
    const avgStalled = b.avgWeight <= a.avgWeight && c.avgWeight <= b.avgWeight;
    const maxStalled = b.maxWeight <= a.maxWeight && c.maxWeight <= b.maxWeight;
    if (avgStalled && maxStalled) {
      return pack('deload', round(last.maxWeight * 0.95 * mult), '3 sesiones sin progresar · baja 5% y resetea');
    }
  }

  // --- Progresión: el máximo subió respecto a la sesión anterior ---
  if (entries.length >= 2) {
    const prev = entries[entries.length - 2];
    if (last.maxWeight > prev.maxWeight) {
      return pack('progress', round((last.maxWeight + step) * mult), `Vienes subiendo · +${step} kg esta sesión`);
    }
  }

  // --- Segunda sesión: intenta un incremento ---
  if (entries.length === 1) {
    return pack('progress', round((last.maxWeight + step) * mult), `Segunda sesión · intenta +${step} kg`);
  }

  // --- Por defecto: repite y consolida ---
  return pack('repeat', round(last.maxWeight * mult), 'Repite el peso de la última sesión y consolida');
}

/** ¿Está el ejercicio realmente estancado? (para avisos de la vista de progreso). */
export function isStalled(history: HistoryEntry[]): boolean {
  const entries = [...history].sort((a, b) => a.ts - b.ts);
  if (entries.length < 3) return false;
  const [a, b, c] = entries.slice(-3);
  const avgStalled = b.avgWeight <= a.avgWeight && c.avgWeight <= b.avgWeight;
  const maxStalled = b.maxWeight <= a.maxWeight && c.maxWeight <= b.maxWeight;
  return avgStalled && maxStalled;
}

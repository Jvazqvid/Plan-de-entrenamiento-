// ============================================================================
// Ajuste de macros por TDEE a partir de la tendencia de peso corporal.
//
// Si el ajuste calculado supera ±50 kcal respecto al objetivo base, se escala:
// kcal ajustadas, proteína FIJA, y carbos/grasa proporcionales al resto de kcal.
// (ver docs/especificacion-funcional.md, sección Nutrición.)
// ============================================================================

import type { BodyWeightEntry, Macros } from '@/types';
import { daysBetween } from './format';

const KCAL_PER_KG = 7700; // ~kcal por kg de peso corporal
const TARGET_RATE_KG_WEEK = 0.15; // objetivo de ganancia magra ~0.15 kg/semana
const MAX_ADJ = 400; // límite de seguridad del ajuste diario

export interface MacroAdjustment {
  macros: Macros;
  adjusted: boolean;
  deltaKcal: number;
  rateKgWeek: number | null;
}

/** Tendencia de peso (kg/semana) usando la primera y última medición de la ventana. */
export function bodyWeightRate(entries: BodyWeightEntry[], windowDays = 21): number | null {
  if (entries.length < 3) return null;
  const sorted = [...entries].sort((a, b) => a.ts - b.ts);
  const last = sorted[sorted.length - 1];
  const cutoffFirst = sorted.find((e) => daysBetween(e.date, last.date) <= windowDays) ?? sorted[0];
  const spanDays = daysBetween(cutoffFirst.date, last.date);
  if (spanDays < 7) return null;
  const deltaKg = last.v - cutoffFirst.v;
  return (deltaKg / spanDays) * 7;
}

export function adjustMacros(base: Macros, bodyWeights: BodyWeightEntry[]): MacroAdjustment {
  const rate = bodyWeightRate(bodyWeights);
  if (rate === null) {
    return { macros: base, adjusted: false, deltaKcal: 0, rateKgWeek: null };
  }

  // Corrección diaria de kcal para acercar la tasa real a la objetivo.
  const rawDelta = ((TARGET_RATE_KG_WEEK - rate) * KCAL_PER_KG) / 7;
  const deltaKcal = Math.max(-MAX_ADJ, Math.min(MAX_ADJ, Math.round(rawDelta)));

  if (Math.abs(deltaKcal) <= 50) {
    return { macros: base, adjusted: false, deltaKcal, rateKgWeek: rate };
  }

  const newKcal = Math.max(1400, base.kcal + deltaKcal);
  // Proteína fija; el resto de kcal se reparte en la proporción carbos:grasa del objetivo base.
  const protein = base.protein;
  const proteinKcal = protein * 4;
  const remaining = Math.max(0, newKcal - proteinKcal);
  const baseCarbKcal = base.carbs * 4;
  const baseFatKcal = base.fat * 9;
  const baseNonProtein = baseCarbKcal + baseFatKcal || 1;
  const carbShare = baseCarbKcal / baseNonProtein;
  const carbs = Math.round((remaining * carbShare) / 4);
  const fat = Math.round((remaining * (1 - carbShare)) / 9);

  return {
    macros: { kcal: Math.round(newKcal), protein, carbs, fat },
    adjusted: true,
    deltaKcal,
    rateKgWeek: rate,
  };
}

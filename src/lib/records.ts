// Récords personales (PRs) derivados del historial. Todo se calcula desde entryOneRm.

import type { HistoryEntry } from '@/types';
import { entryOneRm } from './oneRepMax';
import { daysBetween, todayISO } from './format';

export interface Records {
  bestOneRm: number;
  bestOneRmDate: string | null;
  bestWeight: number;
  bestWeightReps: number;
  bestWeightDate: string | null;
  bestVolume: number; // maxWeight · reps · sets (tonelaje de la serie top)
  bestVolumeDate: string | null;
  sessions: number;
}

export function computeRecords(history: HistoryEntry[]): Records {
  let bestOneRm = 0, bestOneRmDate: string | null = null;
  let bestWeight = 0, bestWeightReps = 0, bestWeightDate: string | null = null;
  let bestVolume = 0, bestVolumeDate: string | null = null;
  for (const e of history) {
    const orm = entryOneRm(e);
    if (orm > bestOneRm) { bestOneRm = orm; bestOneRmDate = e.date; }
    if (e.maxWeight > bestWeight) { bestWeight = e.maxWeight; bestWeightReps = e.reps; bestWeightDate = e.date; }
    const vol = e.maxWeight * e.reps * e.sets;
    if (vol > bestVolume) { bestVolume = vol; bestVolumeDate = e.date; }
  }
  return { bestOneRm, bestOneRmDate, bestWeight, bestWeightReps, bestWeightDate, bestVolume, bestVolumeDate, sessions: history.length };
}

/** ¿La marca candidata supera el mejor 1RM histórico? */
export function isOneRmPr(history: HistoryEntry[], candidateOneRm: number): boolean {
  const best = history.reduce((mx, e) => Math.max(mx, entryOneRm(e)), 0);
  return candidateOneRm > best + 0.4;
}

export interface WeekPr {
  key: string;
  oneRm: number;
  date: string;
}

/** PRs de 1RM logrados en los últimos `days` días (uno por ejercicio como máximo). */
export function prsThisWeek(history: Record<string, HistoryEntry[]>, days = 7): WeekPr[] {
  const today = todayISO();
  const out: WeekPr[] = [];
  for (const [key, entries] of Object.entries(history)) {
    if (entries.length === 0) continue;
    let best = entries[0];
    let bestOrm = entryOneRm(entries[0]);
    for (const e of entries) {
      const orm = entryOneRm(e);
      if (orm > bestOrm) { bestOrm = orm; best = e; }
    }
    if (bestOrm > 0 && daysBetween(best.date, today) < days) {
      out.push({ key, oneRm: Math.round(bestOrm), date: best.date });
    }
  }
  return out;
}

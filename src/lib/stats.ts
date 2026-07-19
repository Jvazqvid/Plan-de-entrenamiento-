// Cálculos derivados para la vista de Progreso. Todo consume 1RM desde oneRepMax.

import type { Exercise, HistoryEntry, MuscleGroup, ScheduleSlot, SessionId } from '@/types';
import { SESSIONS } from '@/data/sessions';
import { entryOneRm } from './oneRepMax';
import { historyKey } from './exercises';
import { daysBetween, todayISO } from './format';

/** Índice global: `${sessionId}:${exerciseId}` → Exercise (para grupo, nombre, etc.). */
export const EXERCISE_INDEX: Record<string, Exercise & { sessionId: SessionId }> = (() => {
  const idx: Record<string, Exercise & { sessionId: SessionId }> = {};
  for (const s of SESSIONS) {
    for (const ex of s.exercises) {
      idx[historyKey(s.id, ex.id)] = { ...ex, sessionId: s.id };
    }
  }
  return idx;
})();

export interface KeyLift {
  sessionId: SessionId;
  sessionTitle: string;
  color: string;
  exercise: Exercise;
  key: string;
}

/** Ejercicio principal de cada sesión de fuerza (A-D). */
export function keyLifts(): KeyLift[] {
  const out: KeyLift[] = [];
  for (const s of SESSIONS) {
    if (s.id === 'E') continue;
    const principal = s.exercises.find((e) => e.tag === 'principal') ?? s.exercises[0];
    out.push({
      sessionId: s.id,
      sessionTitle: s.title.split('—')[0].trim(),
      color: s.color,
      exercise: principal,
      key: historyKey(s.id, principal.id),
    });
  }
  return out;
}

export interface OneRmPoint {
  date: string;
  oneRm: number;
}

export function oneRmSeries(history: HistoryEntry[]): OneRmPoint[] {
  return [...history]
    .sort((a, b) => a.ts - b.ts)
    .map((e) => ({ date: e.date, oneRm: Math.round(entryOneRm(e) * 10) / 10 }));
}

/** Proyección lineal simple del próximo 1RM a partir de las 2 últimas mediciones. */
export function projectNext(series: OneRmPoint[]): number | null {
  if (series.length < 2) return null;
  const a = series[series.length - 2].oneRm;
  const b = series[series.length - 1].oneRm;
  const next = b + (b - a) * 0.6; // suaviza la pendiente
  return Math.round(next * 10) / 10;
}

/** Volumen (series efectivas) por grupo muscular en los últimos `days` días. */
export function weeklyVolumeByGroup(
  history: Record<string, HistoryEntry[]>,
  days = 7,
): Record<string, number> {
  const today = todayISO();
  const vol: Record<string, number> = {};
  for (const [key, entries] of Object.entries(history)) {
    const ex = EXERCISE_INDEX[key];
    if (!ex || ex.group === 'Cardio') continue;
    for (const e of entries) {
      if (daysBetween(e.date, today) < days) {
        vol[ex.group] = (vol[ex.group] ?? 0) + e.sets;
      }
    }
  }
  return vol;
}

/** Sesiones completadas en una ventana [desde, hasta) días atrás, vía calendario. */
export function sessionsCompleted(schedule: ScheduleSlot[], fromDaysAgo: number, toDaysAgo: number): number {
  const today = todayISO();
  return schedule.filter((s) => {
    if (s.status !== 'done' || !s.ts) return false;
    const d = daysBetween(todayISO(new Date(s.ts)), today);
    return d >= toDaysAgo && d < fromDaysAgo;
  }).length;
}

/** Entradas de historial más recientes, con nombre y grupo resueltos. */
export interface RecentEntry {
  key: string;
  sessionId: SessionId;
  exerciseId: string;
  name: string;
  group: MuscleGroup;
  date: string;
  maxWeight: number;
  reps: number;
  rir?: number;
  oneRm: number;
  unit?: string;
}

/** Mapa fecha(YYYY-MM-DD) → nº de ejercicios registrados ese día (para el heatmap). */
export function trainingDayCounts(history: Record<string, HistoryEntry[]>): Map<string, number> {
  const map = new Map<string, number>();
  for (const entries of Object.values(history)) {
    for (const e of entries) {
      map.set(e.date, (map.get(e.date) ?? 0) + 1);
    }
  }
  return map;
}

export function recentHistory(history: Record<string, HistoryEntry[]>, limit = 12): RecentEntry[] {
  const all: (HistoryEntry & { key: string })[] = [];
  for (const [key, entries] of Object.entries(history)) {
    for (const e of entries) all.push({ ...e, key });
  }
  all.sort((a, b) => b.ts - a.ts);
  return all.slice(0, limit).map((e) => {
    const ex = EXERCISE_INDEX[e.key];
    return {
      key: e.key,
      sessionId: e.sessionId,
      exerciseId: e.exerciseId,
      name: ex?.name ?? e.exerciseId,
      group: ex?.group ?? 'Core',
      date: e.date,
      maxWeight: e.maxWeight,
      reps: e.reps,
      rir: e.rir,
      oneRm: Math.round(entryOneRm(e)),
      unit: ex?.unit,
    };
  });
}

/** Exporta todo el historial a CSV. */
export function historyToCsv(history: Record<string, HistoryEntry[]>): string {
  const rows = [['fecha', 'sesion', 'ejercicio', 'grupo', 'peso_max', 'reps', 'series', 'rir', '1rm_est']];
  const all: (HistoryEntry & { key: string })[] = [];
  for (const [key, entries] of Object.entries(history)) {
    for (const e of entries) all.push({ ...e, key });
  }
  all.sort((a, b) => a.ts - b.ts);
  for (const e of all) {
    const ex = EXERCISE_INDEX[e.key];
    rows.push([
      e.date,
      e.sessionId,
      (ex?.name ?? e.exerciseId).replace(/[",\n]/g, ' '),
      ex?.group ?? '',
      String(e.maxWeight),
      String(e.reps),
      String(e.sets),
      e.rir !== undefined ? String(e.rir) : '',
      String(Math.round(entryOneRm(e))),
    ]);
  }
  return rows.map((r) => r.join(',')).join('\n');
}

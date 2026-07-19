// ============================================================================
// Store central (Zustand + persist). UN ÚNICO modelo de datos coherente.
//
// Decisiones de diseño frente a los bugs del legado (docs/decisiones-datos.md):
//   #1 Historial indexado por (sessionId, exerciseId) estable, nunca por índice.
//   #2 Upsert por (ejercicio, fecha): nunca se duplican entradas del mismo día.
//   #5 Peso "tocado" separado del sugerido: touched vs suggestion.
//   #6 persist escribe el estado COMPLETO (merge por diseño): imposible perder campos.
//   #7 Migraciones versionadas y síncronas vía persist({version, migrate}).
//   #8 Reps se leen y escriben desde el MISMO campo (active.reps).
// ============================================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ActiveSession,
  BodyWeightEntry,
  CoachVerdict,
  Exercise,
  HistoryEntry,
  Joint,
  Measurement,
  MeasurementKind,
  PainEntry,
  Readiness,
  ScheduleSlot,
  SessionId,
  Settings,
} from '@/types';
import { SESSIONS_BY_ID } from '@/data/sessions';
import { WEEK_TEMPLATE, MESOCYCLE_WEEKS } from '@/data/schedule';
import { WARMUPS } from '@/data/warmups';
import {
  exercisesForWeek,
  historyKey,
  repsForWeek,
  setsForWeek,
} from '@/lib/exercises';
import { entryOneRm } from '@/lib/oneRepMax';
import { analyzeSession, type ExerciseResult } from '@/lib/coach';
import { parseTargetReps, todayISO, uid } from '@/lib/format';

export type Tab = 'home' | 'plan' | 'progress' | 'nutrition' | 'guide';

export interface PendingStart {
  sessionId: SessionId;
  slotId: string | null;
  weekIdx: number;
}

const DEFAULT_SETTINGS: Settings = {
  restAutoStart: true,
  restDefaultSec: 0,
  sound: true,
  vibrate: true,
  trackRir: true,
};

interface PersistState {
  version: number;
  startDate: number;
  weekIdx: number;
  darkMode: boolean;
  onboarded: boolean;
  history: Record<string, HistoryEntry[]>;
  bodyWeights: BodyWeightEntry[];
  measurements: Measurement[];
  pain: PainEntry[];
  schedule: ScheduleSlot[];
  checkedItems: Record<string, boolean>;
  mealOverrides: Record<string, number>;
  bodyWeightGoal: number | null;
  bodyWeightGoalDate: string | null;
  settings: Settings;
  active: ActiveSession | null;
}

interface Actions {
  setWeek: (weekIdx: number) => void;
  toggleDark: () => void;
  completeOnboarding: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
  addBodyWeight: (v: number, date?: string) => void;
  setBodyWeightGoal: (v: number | null, date: string | null) => void;
  addMeasurement: (kind: MeasurementKind, value: number, date?: string) => void;
  removeMeasurement: (id: string) => void;
  addPain: (joint: Joint, intensity: number, note: string) => void;
  removePain: (id: string) => void;
  // flujo de inicio (modal de disposición global)
  requestStart: (p: PendingStart) => void;
  cancelStart: () => void;
  // sesión activa
  startSession: (args: { sessionId: SessionId; slotId: string | null; weekIdx: number; readiness: Readiness }) => void;
  setPhase: (phase: ActiveSession['phase']) => void;
  setWeight: (exerciseId: string, setIdx: number, value: number) => void;
  setReps: (exerciseId: string, setIdx: number, value: string) => void;
  setRir: (exerciseId: string, setIdx: number, value: string) => void;
  toggleSetDone: (exerciseId: string, setIdx: number) => void;
  addExtraExercise: (ex: Exercise) => void;
  removeExtraExercise: (exerciseId: string) => void;
  setSessionNote: (note: string) => void;
  saveActiveSession: () => CoachVerdict;
  cancelActiveSession: () => void;
  reopenSlot: (slotId: string) => void;
  // historial
  updateHistoryEntry: (key: string, date: string, patch: Partial<HistoryEntry>) => void;
  deleteHistoryEntry: (key: string, date: string) => void;
  // compra
  toggleShopItem: (id: string) => void;
  clearShopItems: () => void;
  // nutrición
  setMealOverride: (key: string, index: number) => void;
  clearMealOverrides: () => void;
  // mantenimiento
  resetMesocycle: (startDate?: number) => void;
  exportState: () => string;
  importState: (json: string) => boolean;
  pendingStart: PendingStart | null;
  lastVerdict: CoachVerdict | null;
  dismissVerdict: () => void;
}

export type AppState = PersistState & Actions;

const STORE_VERSION = 2;

/** Genera el calendario de un mesociclo (5 semanas × sesiones con día asignado). */
export function generateSchedule(): ScheduleSlot[] {
  const slots: ScheduleSlot[] = [];
  for (let weekIdx = 0; weekIdx < MESOCYCLE_WEEKS; weekIdx++) {
    for (const day of WEEK_TEMPLATE) {
      if (!day.session) continue;
      slots.push({
        id: `w${weekIdx}-d${day.id}`,
        sessionId: day.session,
        weekIdx,
        slotIdx: day.id,
        status: 'pending',
        ts: null,
        completionPct: null,
        durationMin: null,
      });
    }
  }
  return slots;
}

export function currentWeekFromStart(startDate: number): number {
  const weeks = Math.floor((Date.now() - startDate) / (7 * 86_400_000));
  return Math.max(0, Math.min(MESOCYCLE_WEEKS - 1, weeks));
}

function newActive(args: {
  sessionId: SessionId;
  slotId: string | null;
  weekIdx: number;
  readiness: Readiness;
  phase: ActiveSession['phase'];
}): ActiveSession {
  return {
    sessionId: args.sessionId,
    slotId: args.slotId,
    weekIdx: args.weekIdx,
    readiness: args.readiness,
    startedAt: Date.now(),
    phase: args.phase,
    weights: {},
    reps: {},
    rir: {},
    touched: {},
    doneSets: {},
    extra: [],
    note: '',
  };
}

/** Upsert de una entrada de historial por (ejercicio, fecha). Reemplaza, no acumula. */
function upsertHistory(
  history: Record<string, HistoryEntry[]>,
  key: string,
  entry: HistoryEntry,
): Record<string, HistoryEntry[]> {
  const list = history[key] ? [...history[key]] : [];
  const idx = list.findIndex((e) => e.date === entry.date);
  if (idx >= 0) list[idx] = entry;
  else list.push(entry);
  list.sort((a, b) => a.ts - b.ts);
  return { ...history, [key]: list };
}

const initialStartDate = Date.now();

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      version: STORE_VERSION,
      startDate: initialStartDate,
      weekIdx: 0,
      darkMode: true,
      onboarded: false,
      history: {},
      bodyWeights: [],
      measurements: [],
      pain: [],
      schedule: generateSchedule(),
      checkedItems: {},
      mealOverrides: {},
      bodyWeightGoal: null,
      bodyWeightGoalDate: null,
      settings: DEFAULT_SETTINGS,
      active: null,
      pendingStart: null,
      lastVerdict: null,

      setWeek: (weekIdx) => set({ weekIdx }),
      toggleDark: () => set((s) => ({ darkMode: !s.darkMode })),
      completeOnboarding: () => set({ onboarded: true }),
      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      addBodyWeight: (v, date = todayISO()) =>
        set((s) => {
          const rest = s.bodyWeights.filter((b) => b.date !== date);
          return {
            bodyWeights: [...rest, { v, date, ts: Date.now() }].sort((a, b) => a.ts - b.ts),
          };
        }),

      setBodyWeightGoal: (v, date) => set({ bodyWeightGoal: v, bodyWeightGoalDate: date }),

      addMeasurement: (kind, value, date = todayISO()) =>
        set((s) => {
          const rest = s.measurements.filter((m) => !(m.kind === kind && m.date === date));
          return {
            measurements: [...rest, { id: uid('m_'), kind, value, date, ts: Date.now() }].sort((a, b) => a.ts - b.ts),
          };
        }),
      removeMeasurement: (id) => set((s) => ({ measurements: s.measurements.filter((m) => m.id !== id) })),

      addPain: (joint, intensity, note) =>
        set((s) => ({
          pain: [
            ...s.pain,
            { id: uid('pain_'), joint, intensity, note, date: todayISO(), ts: Date.now() },
          ],
        })),
      removePain: (id) => set((s) => ({ pain: s.pain.filter((p) => p.id !== id) })),

      requestStart: (p) => set({ pendingStart: p }),
      cancelStart: () => set({ pendingStart: null }),

      startSession: ({ sessionId, slotId, weekIdx, readiness }) => {
        const hasWarmup = sessionId in WARMUPS;
        set({
          active: newActive({ sessionId, slotId, weekIdx, readiness, phase: hasWarmup ? 'warmup' : 'exercises' }),
          pendingStart: null,
        });
      },

      setPhase: (phase) => set((s) => (s.active ? { active: { ...s.active, phase } } : {})),

      setWeight: (exerciseId, setIdx, value) =>
        set((s) => {
          if (!s.active) return {};
          const k = `${exerciseId}-${setIdx}`;
          return {
            active: {
              ...s.active,
              weights: { ...s.active.weights, [k]: value },
              touched: { ...s.active.touched, [k]: true },
            },
          };
        }),

      setReps: (exerciseId, setIdx, value) =>
        set((s) => {
          if (!s.active) return {};
          const k = `${exerciseId}-${setIdx}`;
          return { active: { ...s.active, reps: { ...s.active.reps, [k]: value } } };
        }),

      setRir: (exerciseId, setIdx, value) =>
        set((s) => {
          if (!s.active) return {};
          const k = `${exerciseId}-${setIdx}`;
          return { active: { ...s.active, rir: { ...s.active.rir, [k]: value } } };
        }),

      toggleSetDone: (exerciseId, setIdx) =>
        set((s) => {
          if (!s.active) return {};
          const k = `${exerciseId}-${setIdx}`;
          return {
            active: { ...s.active, doneSets: { ...s.active.doneSets, [k]: !s.active.doneSets[k] } },
          };
        }),

      addExtraExercise: (ex) =>
        set((s) => {
          if (!s.active) return {};
          if (s.active.extra.some((e) => e.id === ex.id)) return {};
          return { active: { ...s.active, extra: [...s.active.extra, ex] } };
        }),
      removeExtraExercise: (exerciseId) =>
        set((s) => (s.active ? { active: { ...s.active, extra: s.active.extra.filter((e) => e.id !== exerciseId) } } : {})),

      setSessionNote: (note) => set((s) => (s.active ? { active: { ...s.active, note } } : {})),

      saveActiveSession: () => {
        const s = get();
        const active = s.active;
        if (!active) {
          return { score: 0, headline: 'Sin sesión activa', highlights: [], improvement: '', nextSuggestion: '' };
        }
        const session = SESSIONS_BY_ID[active.sessionId];
        const exercises = [...exercisesForWeek(session, active.weekIdx), ...active.extra];
        const date = todayISO();
        const now = Date.now();

        let history = s.history;
        const results: ExerciseResult[] = [];
        let plannedTotal = 0;
        let doneTotal = 0;

        for (const ex of exercises) {
          const nSets = setsForWeek(ex, active.weekIdx);
          const targetReps = parseTargetReps(repsForWeek(ex, active.weekIdx));
          plannedTotal += nSets;

          const setWeights: number[] = [];
          const setReps: number[] = [];
          const setRir: (number | undefined)[] = [];
          let doneCount = 0;
          for (let i = 0; i < nSets; i++) {
            const k = `${ex.id}-${i}`;
            const w = active.weights[k] ?? 0;
            const rRaw = active.reps[k];
            const r = rRaw && rRaw.trim() !== '' ? parseInt(rRaw, 10) : targetReps;
            const rirRaw = active.rir[k];
            const rir = rirRaw && rirRaw.trim() !== '' ? parseInt(rirRaw, 10) : undefined;
            const isDone = active.doneSets[k] || active.touched[k];
            if (isDone) {
              doneCount++;
              setWeights.push(w);
              setReps.push(Number.isNaN(r) ? targetReps : r);
              setRir.push(rir);
            }
          }
          doneTotal += doneCount;
          if (doneCount === 0) continue; // ejercicio no realizado → sin entrada

          const positives = setWeights.filter((w) => w > 0);
          const avgWeight = positives.length ? positives.reduce((a, b) => a + b, 0) / positives.length : 0;
          const maxWeight = positives.length ? Math.max(...positives) : 0;
          // reps y RIR de la serie top (la de mayor peso), fallback a objetivo
          let topReps = targetReps;
          let topRir: number | undefined;
          if (positives.length) {
            const maxIdx = setWeights.indexOf(maxWeight);
            topReps = setReps[maxIdx] ?? targetReps;
            topRir = setRir[maxIdx];
          } else if (setReps.length) {
            topReps = setReps[0];
            topRir = setRir[0];
          }

          const key = historyKey(active.sessionId, ex.id);
          const prior = history[key] ?? [];
          const prevBestOneRm = prior
            .filter((e) => e.date !== date)
            .reduce((mx, e) => Math.max(mx, entryOneRm(e)), 0);

          const entry: HistoryEntry = {
            sessionId: active.sessionId,
            exerciseId: ex.id,
            date,
            ts: now,
            avgWeight: Number(avgWeight.toFixed(2)),
            maxWeight,
            reps: topReps,
            sets: doneCount,
            rir: topRir,
            note: active.note || undefined,
          };
          const oneRm = entryOneRm(entry);
          history = upsertHistory(history, key, entry);

          results.push({
            name: ex.name,
            group: ex.group,
            tag: ex.tag,
            plannedSets: nSets,
            doneSets: doneCount,
            avgWeight: entry.avgWeight,
            maxWeight,
            reps: topReps,
            oneRm,
            prevOneRm: prevBestOneRm,
            isPr: oneRm > 0 && oneRm > prevBestOneRm + 0.4,
          });
        }

        const durationMin = Math.max(0, Math.round((now - active.startedAt) / 60_000));
        const completionPct = plannedTotal > 0 ? Math.round((doneTotal / plannedTotal) * 100) : 0;

        const verdict = analyzeSession({
          sessionId: active.sessionId,
          sessionTitle: session.title,
          weekIdx: active.weekIdx,
          readiness: active.readiness,
          durationMin,
          exercises: results,
        });

        const schedule = active.slotId
          ? s.schedule.map((slot) =>
              slot.id === active.slotId
                ? { ...slot, status: 'done' as const, ts: now, completionPct, durationMin }
                : slot,
            )
          : s.schedule;

        set({ history, schedule, active: null, lastVerdict: verdict });
        return verdict;
      },

      cancelActiveSession: () => set({ active: null }),

      dismissVerdict: () => set({ lastVerdict: null }),

      reopenSlot: (slotId) => {
        const s = get();
        const slot = s.schedule.find((x) => x.id === slotId);
        if (!slot) return;
        const session = SESSIONS_BY_ID[slot.sessionId];
        const exercises = exercisesForWeek(session, slot.weekIdx);
        const date = slot.ts ? todayISO(new Date(slot.ts)) : todayISO();
        const base = newActive({
          sessionId: slot.sessionId,
          slotId: slot.id,
          weekIdx: slot.weekIdx,
          readiness: 'normal',
          phase: 'exercises', // reabrir salta el calentamiento
        });
        for (const ex of exercises) {
          const key = historyKey(slot.sessionId, ex.id);
          const entry = (s.history[key] ?? []).find((e) => e.date === date);
          if (!entry) continue;
          const nSets = setsForWeek(ex, slot.weekIdx);
          for (let i = 0; i < nSets; i++) {
            const k = `${ex.id}-${i}`;
            base.weights[k] = entry.avgWeight;
            base.reps[k] = String(entry.reps);
            if (entry.rir !== undefined) base.rir[k] = String(entry.rir);
            base.touched[k] = true;
            base.doneSets[k] = i < entry.sets;
          }
        }
        set({ active: base });
      },

      updateHistoryEntry: (key, date, patch) =>
        set((s) => {
          const list = s.history[key];
          if (!list) return {};
          const next = list.map((e) => (e.date === date ? { ...e, ...patch } : e));
          return { history: { ...s.history, [key]: next } };
        }),
      deleteHistoryEntry: (key, date) =>
        set((s) => {
          const list = s.history[key];
          if (!list) return {};
          const next = list.filter((e) => e.date !== date);
          const history = { ...s.history };
          if (next.length) history[key] = next;
          else delete history[key];
          return { history };
        }),

      toggleShopItem: (id) =>
        set((s) => ({ checkedItems: { ...s.checkedItems, [id]: !s.checkedItems[id] } })),
      clearShopItems: () => set({ checkedItems: {} }),

      setMealOverride: (key, index) =>
        set((s) => ({ mealOverrides: { ...s.mealOverrides, [key]: index } })),
      clearMealOverrides: () => set({ mealOverrides: {} }),

      resetMesocycle: (startDate = Date.now()) =>
        set({ startDate, weekIdx: 0, schedule: generateSchedule(), active: null, lastVerdict: null }),

      exportState: () => {
        const s = get();
        return JSON.stringify(partialize(s), null, 2);
      },

      importState: (json) => {
        try {
          const data = JSON.parse(json) as Partial<PersistState>;
          if (typeof data !== 'object' || data === null) return false;
          set((s) => ({ ...s, ...data }));
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'fuerza_v1',
      version: STORE_VERSION,
      partialize: (s) => partialize(s),
      migrate: (persisted, version) => {
        const p = persisted as Partial<PersistState>;
        // v1 → v2: nuevos campos con valores por defecto; active gana rir/extra.
        if (version < 2) {
          p.settings = { ...DEFAULT_SETTINGS, ...(p.settings ?? {}) };
          p.measurements = p.measurements ?? [];
          if (p.active) {
            p.active = { ...p.active, rir: p.active.rir ?? {}, extra: p.active.extra ?? [] };
          }
          p.version = 2;
        }
        return p as PersistState;
      },
    },
  ),
);

function partialize(s: AppState): PersistState {
  return {
    version: s.version,
    startDate: s.startDate,
    weekIdx: s.weekIdx,
    darkMode: s.darkMode,
    onboarded: s.onboarded,
    history: s.history,
    bodyWeights: s.bodyWeights,
    measurements: s.measurements,
    pain: s.pain,
    schedule: s.schedule,
    checkedItems: s.checkedItems,
    mealOverrides: s.mealOverrides,
    bodyWeightGoal: s.bodyWeightGoal,
    bodyWeightGoalDate: s.bodyWeightGoalDate,
    settings: s.settings,
    active: s.active,
  };
}

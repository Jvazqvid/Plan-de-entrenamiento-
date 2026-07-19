// Smoke test de la lógica de dominio. Ejecutar: npx vite-node smoke.test.ts
// Polyfill mínimo de localStorage para que zustand/persist no reviente en node.
const mem: Record<string, string> = {};
(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (k: string) => (k in mem ? mem[k] : null),
  setItem: (k: string, v: string) => { mem[k] = v; },
  removeItem: (k: string) => { delete mem[k]; },
  clear: () => { for (const k of Object.keys(mem)) delete mem[k]; },
  key: () => null,
  length: 0,
} as unknown as Storage;

import { epley, entryOneRm } from '@/lib/oneRepMax';
import { suggestWeight } from '@/lib/progression';
import { adjustMacros } from '@/lib/tdee';
import { analyzeSession } from '@/lib/coach';
import { exercisesForWeek, variantWeeks } from '@/lib/exercises';
import { computeRecords, isOneRmPr, prsThisWeek } from '@/lib/records';
import { warmupRamp, currentStreak } from '@/lib/tools';
import { historyToCsv } from '@/lib/stats';
import { methodForExercise, weekMethod } from '@/data/methods';
import { planForDay, dayMacros, weekBucket } from '@/lib/mealPlan';
import { SESSIONS_BY_ID } from '@/data/sessions';
import { MACROS_BASE } from '@/data/nutrition';
import { useStore } from '@/store/useStore';
import type { Exercise, HistoryEntry, ScheduleSlot } from '@/types';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean, extra = '') {
  if (cond) { pass++; console.log('  ✓', name); }
  else { fail++; console.log('  ✗', name, extra); }
}

console.log('\n== 1RM (Epley) ==');
ok('epley 100x1 = 100', epley(100, 1) === 100);
ok('epley 100x5 ≈ 116.7', Math.abs(epley(100, 5) - 116.667) < 0.01);

console.log('\n== Variantes por semana ==');
ok("'base' aparece siempre", variantWeeks('base') === 'all');
const w = variantWeeks('S1S3');
ok("S1S3 -> {0,2}", w !== 'all' && w.has(0) && w.has(2) && !w.has(1));
const A = SESSIONS_BY_ID['A'];
const wk0 = exercisesForWeek(A, 0).length;
const wk4 = exercisesForWeek(A, 4).length;
ok('semana 1 y 5 filtran distinto', wk0 !== wk4, `wk0=${wk0} wk4=${wk4}`);
ok('los base están en todas las semanas', exercisesForWeek(A, 0).every((e) => e.min !== undefined));

console.log('\n== Sugerencia de peso ==');
const bench = A.exercises[0] as Exercise;
const first = suggestWeight([], bench, 0, 'normal');
ok('primera vez = start', first.type === 'start', JSON.stringify(first));
ok('start = min + 2·step', first.weight === bench.min + 2 * bench.step, JSON.stringify(first));
const deload = suggestWeight([], bench, 4, 'normal');
ok('semana 5 = deload', deload.type === 'deload');
// historial ascendente -> progresa
const mkEntry = (max: number, ts: number): HistoryEntry => ({
  sessionId: 'A', exerciseId: bench.id, date: new Date(ts).toISOString().slice(0, 10),
  ts, avgWeight: max - 2.5, maxWeight: max, reps: 8, sets: 4,
});
const rising = [mkEntry(40, 1), mkEntry(42.5, 2), mkEntry(45, 3)];
const sg = suggestWeight(rising, bench, 0, 'normal');
ok('historial creciente -> progress', sg.type === 'progress', JSON.stringify(sg));
ok('progress sube el peso', sg.weight > 45);
// estancado 3 sesiones -> deload
const stall = [mkEntry(50, 1), mkEntry(50, 2), mkEntry(50, 3)];
const sd = suggestWeight(stall, bench, 0, 'normal');
ok('estancado -> deload 5%', sd.type === 'deload', JSON.stringify(sd));
// disposición fresco sube ~5%
const freshS = suggestWeight(rising, bench, 0, 'fresh');
ok('fresco >= normal', freshS.weight >= sg.weight);

console.log('\n== Autorregulación por RIR ==');
const mkR = (max: number, ts: number, reps: number, rir: number): HistoryEntry => ({
  sessionId: 'A', exerciseId: bench.id, date: new Date(ts).toISOString().slice(0, 10),
  ts, avgWeight: max - 2.5, maxWeight: max, reps, sets: 4, rir,
});
// tope de reps (8) con RIR alto (3 >= objetivo 3 en sem 0) -> sube
const rirEasy = suggestWeight([mkR(40, 1, 8, 3)], bench, 0, 'normal');
ok('RIR holgado en el tope -> progress', rirEasy.type === 'progress', JSON.stringify(rirEasy));
// RIR bajo (0) por debajo del objetivo -> repite
const rirHard = suggestWeight([mkR(40, 1, 6, 0)], bench, 0, 'normal');
ok('RIR bajo (duro) -> repeat', rirHard.type === 'repeat', JSON.stringify(rirHard));
// 3 sesiones muy duras -> deload
const rir3hard = [mkR(40, 1, 5, 0), mkR(40, 2, 5, 0), mkR(40, 3, 5, 1)];
const rirD = suggestWeight(rir3hard, bench, 0, 'normal');
ok('3 sesiones muy duras -> deload', rirD.type === 'deload', JSON.stringify(rirD));

console.log('\n== Récords (PR) ==');
const recHist = [mkEntry(40, 1), mkEntry(45, 2), mkEntry(42.5, 3)];
const rec = computeRecords(recHist);
ok('mejor peso = 45', rec.bestWeight === 45, JSON.stringify(rec));
ok('detecta PR de 1RM', isOneRmPr(recHist, epley(50, 8)));
ok('no marca PR si es menor', !isOneRmPr(recHist, 10));

console.log('\n== Warm-up ramp ==');
const ramp = warmupRamp(100, 2.5, 20);
ok('rampa tiene series ascendentes', ramp.length >= 2 && ramp[0].weight < ramp[ramp.length - 1].weight, JSON.stringify(ramp));
ok('rampa por debajo del peso de trabajo', ramp.every((s) => s.weight < 100));

console.log('\n== Racha ==');
const mkSlot = (daysAgo: number): ScheduleSlot => ({
  id: 'x' + daysAgo, sessionId: 'A', weekIdx: 0, slotIdx: 0, status: 'done',
  ts: Date.now() - daysAgo * 86_400_000, completionPct: 100, durationMin: 40,
});
ok('racha de 3 sesiones seguidas', currentStreak([mkSlot(0), mkSlot(2), mkSlot(4)]) === 3, String(currentStreak([mkSlot(0), mkSlot(2), mkSlot(4)])));
ok('racha rota si último > 3 días', currentStreak([mkSlot(5), mkSlot(7)]) === 0);

console.log('\n== TDEE ==');
const noAdj = adjustMacros(MACROS_BASE.train, []);
ok('sin historial no ajusta', !noAdj.adjusted);
// tendencia plana (0 kg/sem) -> debería subir kcal (target 0.15)
const bws = [
  { v: 80, date: '2026-06-01', ts: new Date('2026-06-01').getTime() },
  { v: 80, date: '2026-06-10', ts: new Date('2026-06-10').getTime() },
  { v: 80, date: '2026-06-20', ts: new Date('2026-06-20').getTime() },
];
const adj = adjustMacros(MACROS_BASE.train, bws);
ok('estancado -> sube kcal', adj.adjusted && adj.deltaKcal > 0, JSON.stringify({ adjusted: adj.adjusted, d: adj.deltaKcal }));
ok('proteína se mantiene fija', adj.macros.protein === MACROS_BASE.train.protein);

console.log('\n== Coach ==');
const verdict = analyzeSession({
  sessionId: 'A', sessionTitle: 'PUSH', weekIdx: 0, readiness: 'normal', durationMin: 45,
  exercises: [
    { name: bench.name, group: 'Pecho', tag: 'principal', plannedSets: 4, doneSets: 4, avgWeight: 45, maxWeight: 47.5, reps: 8, oneRm: 60, prevOneRm: 55, isPr: true },
  ],
});
ok('score 0-100', verdict.score >= 0 && verdict.score <= 100, String(verdict.score));
ok('detecta PR en highlights', verdict.highlights.some((h) => h.toLowerCase().includes('récord')), JSON.stringify(verdict.highlights));

console.log('\n== Store: guardar sesión (upsert + sin duplicados) ==');
const st = useStore.getState();
st.startSession({ sessionId: 'A', slotId: 'w0-d0', weekIdx: 0, readiness: 'normal' });
const exs = exercisesForWeek(SESSIONS_BY_ID['A'], 0);
// rellena 2 series del primer ejercicio
useStore.getState().setWeight(exs[0].id, 0, 50);
useStore.getState().setReps(exs[0].id, 0, '8');
useStore.getState().toggleSetDone(exs[0].id, 0);
useStore.getState().setWeight(exs[0].id, 1, 52.5);
useStore.getState().toggleSetDone(exs[0].id, 1);
const v1 = useStore.getState().saveActiveSession();
ok('verdict tras guardar', v1.score >= 0);
const key = `A:${exs[0].id}`;
const hist1 = useStore.getState().history[key] ?? [];
ok('1 entrada de historial', hist1.length === 1, `len=${hist1.length}`);
ok('maxWeight = 52.5', hist1[0]?.maxWeight === 52.5, JSON.stringify(hist1[0]));
ok('1RM coherente', Math.abs(entryOneRm(hist1[0]) - epley(52.5, 8)) < 0.01);
// guarda otra vez el mismo día -> debe REEMPLAZAR, no duplicar
useStore.getState().startSession({ sessionId: 'A', slotId: 'w0-d0', weekIdx: 0, readiness: 'normal' });
useStore.getState().setWeight(exs[0].id, 0, 55);
useStore.getState().toggleSetDone(exs[0].id, 0);
useStore.getState().saveActiveSession();
const hist2 = useStore.getState().history[key] ?? [];
ok('sigue habiendo 1 entrada (upsert por fecha)', hist2.length === 1, `len=${hist2.length}`);

console.log('\n== Store: RIR + PRs + CSV ==');
useStore.getState().startSession({ sessionId: 'B', slotId: 'w0-d1', weekIdx: 0, readiness: 'normal' });
const exsB = exercisesForWeek(SESSIONS_BY_ID['B'], 0);
useStore.getState().setWeight(exsB[0].id, 0, 12.5);
useStore.getState().setReps(exsB[0].id, 0, '8');
useStore.getState().setRir(exsB[0].id, 0, '2');
useStore.getState().toggleSetDone(exsB[0].id, 0);
useStore.getState().saveActiveSession();
const bKey = `B:${exsB[0].id}`;
const bHist = useStore.getState().history[bKey] ?? [];
ok('RIR guardado en la entrada', bHist[0]?.rir === 2, JSON.stringify(bHist[0]));
const prs = prsThisWeek(useStore.getState().history, 7);
ok('prsThisWeek encuentra PRs', prs.length >= 1, `n=${prs.length}`);
const csv = historyToCsv(useStore.getState().history);
ok('CSV tiene cabecera + filas', csv.split('\n').length >= 3 && csv.startsWith('fecha,'), csv.split('\n')[0]);

console.log('\n== Métodos de entrenamiento ==');
ok('Sem1 = estándar (sin técnica en accesorios)', methodForExercise(0, 'accesorio') === null);
ok('Sem2 aplica superserie a accesorios', methodForExercise(1, 'accesorio')?.id === 'superserie', JSON.stringify(methodForExercise(1, 'accesorio')));
ok('Sem3 aplica dropset a aislamientos', methodForExercise(2, 'aislamiento')?.id === 'dropset');
ok('Sem3 NO aplica a principal', methodForExercise(2, 'principal') === null);
ok('weekMethod tiene label', (weekMethod(1)?.label ?? '').length > 0);

console.log('\n== Variedad de ejercicios entre semanas ==');
for (const sid of ['A', 'B', 'C', 'D'] as const) {
  const sets = [0, 1, 2, 3].map((w) => new Set(exercisesForWeek(SESSIONS_BY_ID[sid], w).map((e) => e.id)));
  // ninguna semana idéntica a otra
  let allDistinct = true;
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
    if (sets[i].size === sets[j].size && [...sets[i]].every((x) => sets[j].has(x))) allDistinct = false;
  }
  ok(`sesión ${sid}: 4 semanas de carga con ejercicios distintos`, allDistinct);
}

console.log('\n== Plan de comidas (rotación + cambiar) ==');
const bucket = weekBucket();
const plan = planForDay(0, bucket, {});
ok('plan de día de entreno tiene comidas', plan.length >= 4, `n=${plan.length}`);
const dm = dayMacros(plan);
ok('macros del día suman kcal', dm.kcal > 1000, `kcal=${dm.kcal}`);
const restPlan = planForDay(2, bucket, {}); // miércoles = descanso, sin post-entreno
ok('día de descanso no tiene post-entreno', !restPlan.some((m) => m.slotId === 'postEntreno'));
const mealFirst = planForDay(0, bucket, {})[0];
const mealSwapped = planForDay(0, bucket, { [mealFirst.key]: (mealFirst.poolIndex + 1) % mealFirst.poolLength })[0];
ok('cambiar comida rota a otra del pool', mealFirst.poolLength < 2 || mealSwapped.poolIndex !== mealFirst.poolIndex);

console.log(`\nRESULT: ${pass} passed, ${fail} failed\n`);
if (fail > 0) process.exit(1);

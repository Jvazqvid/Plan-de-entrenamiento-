// Mount real (cliente) con jsdom: monta App y recorre el flujo de sesión activa
// para confirmar que no hay crashes de render en el camino crítico.
// Ejecutar: npx vite-node mount.test.tsx
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});
const g = globalThis as unknown as Record<string, unknown>;
g.window = dom.window;
g.document = dom.window.document;
g.HTMLElement = dom.window.HTMLElement;
g.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 0);
g.cancelAnimationFrame = (id: number) => clearTimeout(id);
g.IS_REACT_ACT_ENVIRONMENT = true;
const mem: Record<string, string> = {};
g.localStorage = {
  getItem: (k: string) => (k in mem ? mem[k] : null),
  setItem: (k: string, v: string) => { mem[k] = v; },
  removeItem: (k: string) => { delete mem[k]; },
  clear: () => {}, key: () => null, length: 0,
};

import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import { useStore } from '@/store/useStore';
import { exercisesForWeek } from '@/lib/exercises';
import { SESSIONS_BY_ID } from '@/data/sessions';

let pass = 0, fail = 0;
const check = (name: string, cond: boolean, extra = '') => {
  if (cond) { pass++; console.log('  ✓', name); }
  else { fail++; console.log('  ✗', name, extra); }
};

async function main() {
  const container = dom.window.document.getElementById('root')!;
  const root = createRoot(container);

  // onboarding completo + tema, para entrar directo a la app
  useStore.getState().completeOnboarding();

  await act(async () => { root.render(createElement(App)); });
  check('monta el Dashboard (Hoy)', container.innerHTML.includes('Racha') || container.innerHTML.length > 500, `len=${container.innerHTML.length}`);

  // el modal de disposición global aparece con requestStart
  await act(async () => { useStore.getState().requestStart({ sessionId: 'A', slotId: 'w0-d0', weekIdx: 0 }); });
  check('modal de disposición visible', container.innerHTML.includes('llegas hoy') || container.innerHTML.includes('Fresco'), 'no readiness modal');

  // arranca una sesión y avanza calentamiento -> ejercicios
  await act(async () => {
    useStore.getState().startSession({ sessionId: 'A', slotId: 'w0-d0', weekIdx: 0, readiness: 'fresh' });
  });
  check('sesión activa montada (calentamiento)', container.innerHTML.includes('Calentamiento') || container.innerHTML.includes('calentamiento'), 'no warmup text');

  await act(async () => { useStore.getState().setPhase('exercises'); });
  const exs = exercisesForWeek(SESSIONS_BY_ID['A'], 0);
  check('fase ejercicios muestra el 1er ejercicio', container.innerHTML.includes(exs[0].name.slice(0, 10)), exs[0].name);

  // marca una serie con RIR -> no rompe (dispara timer de descanso)
  await act(async () => {
    useStore.getState().setWeight(exs[0].id, 0, 50);
    useStore.getState().setReps(exs[0].id, 0, '8');
    useStore.getState().setRir(exs[0].id, 0, '2');
    useStore.getState().toggleSetDone(exs[0].id, 0);
  });
  check('serie con RIR marcada sin crash', container.innerHTML.length > 500);

  // añade un ejercicio extra -> aparece en la sesión
  await act(async () => {
    useStore.getState().addExtraExercise({
      id: 'extra-test', name: 'Curl extra test', sets: 3, reps: '10', rest: '60s', note: 'x',
      min: 5, max: 20, step: 2.5, group: 'Biceps', tag: 'accesorio', variant: 'base',
    });
  });
  check('ejercicio extra visible', container.innerHTML.includes('Curl extra test'), 'no extra ex');

  // guarda -> vuelve a la app y muestra el resumen del coach
  await act(async () => { useStore.getState().saveActiveSession(); });
  await act(async () => { await new Promise((r) => setTimeout(r, 20)); });
  const savedHtml = container.innerHTML;
  check('tras guardar hay veredicto o vuelve al plan', savedHtml.includes('/ 100') || savedHtml.includes('Entreno') || savedHtml.length > 300, `len=${savedHtml.length}`);
  check('historial guardado', (useStore.getState().history[`A:${exs[0].id}`] ?? []).length === 1);

  await act(async () => { root.unmount(); });

  console.log(`\nRESULT: ${pass} passed, ${fail} failed\n`);
  if (fail > 0) process.exit(1);
}
main().catch((e) => { console.error('CRASH:', e); process.exit(1); });

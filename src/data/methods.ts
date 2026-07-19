// ============================================================================
// Métodos / técnicas de intensidad (multiseries y demás). Se asignan por semana
// para que el mesociclo varíe la FORMA de entrenar y no se haga monótono, y se
// explican en la Guía. Basado en metodología estándar de fuerza/hipertrofia.
// ============================================================================

import type { ExerciseTag } from '@/types';

export interface TrainingMethod {
  id: string;
  name: string;
  emoji: string;
  /** Cómo se ejecuta. */
  how: string;
  /** Cuándo/para qué usarlo. */
  when: string;
}

export const METHODS: TrainingMethod[] = [
  {
    id: 'estandar',
    name: 'Series estándar',
    emoji: '⚙️',
    how: 'Series rectas con descanso completo entre ellas. La base de todo.',
    when: 'Semanas de técnica y de fuerza pesada, donde interesa calidad y recuperación.',
  },
  {
    id: 'superserie',
    name: 'Superseries',
    emoji: '🔗',
    how: 'Encadenas dos ejercicios seguidos sin descanso; descansas al terminar el par. Ideal en músculos antagonistas (bíceps/tríceps) o accesorios.',
    when: 'Para ahorrar tiempo y acumular volumen con más densidad. Accesorios, no básicos pesados.',
  },
  {
    id: 'dropset',
    name: 'Series descendentes (dropset)',
    emoji: '📉',
    how: 'Llegas cerca del fallo, bajas el peso ~20-30% y sigues sin descanso. 1-2 descensos en la última serie del ejercicio.',
    when: 'Aislamientos, última serie. Gran estímulo de hipertrofia con poco tiempo.',
  },
  {
    id: 'rest-pause',
    name: 'Rest-pause',
    emoji: '⏸️',
    how: 'Tras llegar al fallo, descansas 15-20 s y sacas 2-4 reps más. Repite 1-2 veces con el mismo peso.',
    when: 'Última serie de un ejercicio para exprimir reps efectivas. Intensificación.',
  },
  {
    id: 'myo-reps',
    name: 'Myo-reps',
    emoji: '🔁',
    how: 'Una serie de activación cerca del fallo (12-20 reps); luego mini-series de 3-5 reps descansando solo 3-5 respiraciones. 3-5 mini-series.',
    when: 'Aislamientos. Mucho estímulo con poco tiempo, muy eficiente para hipertrofia.',
  },
  {
    id: 'cluster',
    name: 'Series cluster',
    emoji: '🧩',
    how: 'Divides la serie en mini-bloques (p. ej. 2+2+2) con 10-20 s de descanso dentro de la serie. Permite mover más peso con buena técnica.',
    when: 'Básicos pesados cuando quieres calidad de fuerza sin acumular tanta fatiga.',
  },
  {
    id: '21s',
    name: 'Veintiunos (21s)',
    emoji: '2️⃣',
    how: '7 reps en la mitad inferior del recorrido + 7 en la mitad superior + 7 completas = 21.',
    when: 'Curl de bíceps y aislamientos. Cambia el estímulo y castiga el músculo en todo el rango.',
  },
  {
    id: 'excentrico',
    name: 'Énfasis excéntrico',
    emoji: '🐢',
    how: 'Fase de bajada lenta y muy controlada (3-5 s). Puedes usar algo más de peso del que subirías.',
    when: 'Casi cualquier ejercicio. La excéntrica genera mucho estímulo y control articular.',
  },
];

export const METHODS_BY_ID: Record<string, TrainingMethod> = Object.fromEntries(
  METHODS.map((m) => [m.id, m]),
);

export interface WeekMethod {
  methodId: string;
  /** A qué tipo de ejercicios se aplica esta semana. */
  appliesTo: ExerciseTag[];
  /** Frase para la cabecera de la sesión. */
  label: string;
}

/** Método destacado de cada semana del mesociclo (índice 0-4). */
export const WEEK_METHOD: Record<number, WeekMethod> = {
  0: { methodId: 'estandar', appliesTo: [], label: 'Series estándar · asienta la técnica' },
  1: { methodId: 'superserie', appliesTo: ['accesorio', 'aislamiento'], label: 'Superseries en los accesorios' },
  2: { methodId: 'dropset', appliesTo: ['aislamiento'], label: 'Dropset en la última serie de aislamientos' },
  3: { methodId: 'rest-pause', appliesTo: ['aislamiento', 'accesorio'], label: 'Rest-pause para intensificar' },
  4: { methodId: 'estandar', appliesTo: [], label: 'Descarga · series suaves, sin técnicas' },
};

export function weekMethod(weekIdx: number): WeekMethod | null {
  return WEEK_METHOD[weekIdx] ?? null;
}

/** Devuelve el método a aplicar a un ejercicio esta semana según su tag, o null. */
export function methodForExercise(weekIdx: number, tag: ExerciseTag): TrainingMethod | null {
  const wm = WEEK_METHOD[weekIdx];
  if (!wm || wm.appliesTo.length === 0) return null;
  if (!wm.appliesTo.includes(tag)) return null;
  return METHODS_BY_ID[wm.methodId] ?? null;
}

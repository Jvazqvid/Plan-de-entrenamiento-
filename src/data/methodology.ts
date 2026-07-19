// ============================================================================
// Base técnica estructurada para la Guía. Extraída de los libros de `Musculación`.
// Fuentes: [Bal] Balsalobre (VBT) · [Bad] González-Badillo · [Car] Carrasco ·
// [Vin] Vinuesa · [Camp] Campoverde · [Cons] consenso moderno (editable).
// Ver docs/metodologia-fuerza.md para el detalle y las atribuciones completas.
// ============================================================================

export interface RmZone {
  pct: string;
  reps: string;
  goal: string;
  vbtBench: string;
}

/** Zonas de %1RM → reps → objetivo (Balsalobre, Tabla 4.1). */
export const RM_ZONES: RmZone[] = [
  { pct: '100%', reps: '1', goal: 'Fuerza máxima (neural)', vbtBench: '0.15 m/s' },
  { pct: '90%', reps: '3-4', goal: 'Fuerza máxima', vbtBench: '0.30 m/s' },
  { pct: '85%', reps: '5-6', goal: 'Fuerza / hipertrofia miofibrilar', vbtBench: '0.37 m/s' },
  { pct: '80%', reps: '7-8', goal: 'Fuerza-hipertrofia', vbtBench: '0.45 m/s' },
  { pct: '75%', reps: '9-10', goal: 'Hipertrofia', vbtBench: '0.53 m/s' },
  { pct: '70%', reps: '11-13', goal: 'Hipertrofia', vbtBench: '0.61 m/s' },
  { pct: '65%', reps: '15', goal: 'Hipertrofia / resistencia', vbtBench: '0.69 m/s' },
  { pct: '60%', reps: '20', goal: 'Resistencia muscular', vbtBench: '0.77 m/s' },
];

export interface RirRow {
  rpe: string;
  rir: string;
  feel: string;
  use: string;
}

/** Escala RIR ↔ RPE (autorregulación del esfuerzo). */
export const RIR_SCALE: RirRow[] = [
  { rpe: '10', rir: '0', feel: 'Fallo muscular', use: 'Evitar salvo hipertrofia puntual' },
  { rpe: '9', rir: '1', feel: '1 en reserva', use: 'Fuerza pesada' },
  { rpe: '8', rir: '2', feel: '2 en reserva', use: 'Trabajo efectivo fuerza/hipertrofia' },
  { rpe: '7', rir: '3', feel: '3 en reserva', use: 'Hipertrofia con volumen, técnica' },
  { rpe: '6', rir: '4', feel: 'Cómodo', use: 'Velocidad/potencia, descarga' },
  { rpe: '≤5', rir: '≥5', feel: 'Muy fácil', use: 'Calentamiento, deload' },
];

export interface VolumeRow {
  label: string;
  series: string;
  meaning: string;
}

/** Volumen semanal por grupo muscular (marco MEV/MAV/MRV). */
export const VOLUME_LANDMARKS: VolumeRow[] = [
  { label: 'Mantenimiento (MV)', series: '~6', meaning: 'Mínimo para no perder' },
  { label: 'MEV (mínimo efectivo)', series: '8-10', meaning: 'A partir de aquí hay progreso' },
  { label: 'MAV (óptimo)', series: '12-20', meaning: 'Zona diana para hipertrofia' },
  { label: 'MRV (máximo recuperable)', series: '20-22', meaning: 'Techo; superarlo estanca' },
];

export interface RestRow {
  goal: string;
  intensity: string;
  rest: string;
}

/** Descanso entre series según objetivo. */
export const REST_GUIDE: RestRow[] = [
  { goal: 'Fuerza máxima', intensity: '85-100%', rest: '3-5 min' },
  { goal: 'Fuerza-hipertrofia', intensity: '70-85%', rest: '2-5 min' },
  { goal: 'Hipertrofia', intensity: '65-85%', rest: '2-3 min' },
  { goal: 'Hipertrofia sarcoplasmática', intensity: '60-80%', rest: '30-60 s' },
  { goal: 'Fuerza-resistencia / metabólico', intensity: '20-60%', rest: '30-90 s' },
];

export interface WeekPlanRow {
  week: string;
  focus: string;
  rir: string;
}

/** Estructura del mesociclo de 5 semanas (acumulación + descarga). */
export const MESOCYCLE_PLAN: WeekPlanRow[] = [
  { week: 'Semana 1', focus: 'Carga base · técnica', rir: 'RIR 3' },
  { week: 'Semana 2', focus: 'Acumulación de volumen', rir: 'RIR 3' },
  { week: 'Semana 3', focus: 'Subida de carga', rir: 'RIR 2' },
  { week: 'Semana 4', focus: 'Intensificación (pico)', rir: 'RIR 1' },
  { week: 'Semana 5', focus: 'Descarga · disipar fatiga', rir: 'RIR 4+' },
];

export interface Principle {
  title: string;
  body: string;
  source: string;
}

/** Principios clave que sostienen la lógica de la app. */
export const PRINCIPLES: Principle[] = [
  {
    title: 'Doble progresión',
    body: 'Fija un rango de reps (p. ej. 8-12). Cuando llegas al tope en todas las series con buena técnica y el RIR objetivo, sube la carga (+2.5 kg tren superior, +5 kg tren inferior) y vuelves al fondo del rango.',
    source: '[Cons/Vin]',
  },
  {
    title: 'Entrena a la mitad de las reps posibles',
    body: 'Dejar reps en reserva (RIR ≈ reps hechas) maximiza la ganancia de fuerza con la mínima fatiga. El fallo es menos eficaz para rendimiento; resérvalo para hipertrofia puntual.',
    source: '[Bal]',
  },
  {
    title: 'Velocidad de la concéntrica',
    body: 'Empuja la fase concéntrica a máxima velocidad intencional aunque el peso sea alto y la barra se mueva lento. La relación carga-velocidad es lineal y estable: sirve para estimar el %1RM sin tests máximos.',
    source: '[Bal]',
  },
  {
    title: 'Supercompensación y descarga',
    body: 'Tras la carga viene fatiga; solo con recuperación suficiente el cuerpo rebasa el nivel previo. La semana de descarga disipa fatiga y deja aflorar las adaptaciones. Sin recuperación no hay supercompensación.',
    source: '[Car]',
  },
  {
    title: 'Frecuencia 2×/semana por grupo',
    body: 'Repartir el volumen semanal en al menos 2 sesiones por grupo muscular supera a concentrarlo en una sola, a igual volumen. Deja 48-72 h entre sesiones intensas del mismo grupo.',
    source: '[Car/Cons]',
  },
  {
    title: 'Orden de progresión',
    body: 'Primero sube reps y series, luego carga, después reduce pausas y por último aumenta la velocidad. La sobrecarga progresiva es la táctica principal de adaptación a largo plazo.',
    source: '[Vin/Camp]',
  },
];

export interface Formula {
  name: string;
  expr: string;
  note: string;
}

/** Fórmulas de estimación de 1RM y afines. */
export const FORMULAS: Formula[] = [
  { name: 'Epley (la que usa la app)', expr: '1RM = peso · (1 + reps/30)', note: 'Base de todos los cálculos de 1RM.' },
  { name: 'Brzycki', expr: '1RM = peso · 36 / (37 − reps)', note: 'Alternativa fiable con reps ≤ 10.' },
  { name: 'Lineal / Landers [Vin]', expr: '%1RM = 102.78 − 2.78 · reps', note: 'Fiable si reps ≤ 10.' },
  { name: 'Carga objetivo', expr: 'peso = 1RM · (%objetivo / 100)', note: 'Para programar por %1RM.' },
];

// --- Técnica por ejercicio (Delavier). Se rellena desde el catálogo de cues. ---

export interface TechniqueCue {
  exercise: string;
  muscles: string;
  cues: string[];
  mistake: string;
}

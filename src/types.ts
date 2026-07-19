// ============================================================================
// Modelo de datos central. Un solo sitio para cada tipo.
//
// Principio de diseño (ver docs/decisiones-datos.md):
//   - Cada ejercicio tiene un `id` estable propio (string), nunca un índice
//     posicional. El historial se indexa por (sessionId, exerciseId).
//   - Una sola definición de cada concepto; los tipos compartidos evitan que
//     lectura y escritura usen claves distintas.
// ============================================================================

export type SessionId = 'A' | 'B' | 'C' | 'D' | 'E';

export type MuscleGroup =
  | 'Pecho'
  | 'Hombro'
  | 'Triceps'
  | 'Biceps'
  | 'Espalda'
  | 'Cuadriceps'
  | 'Gluteo'
  | 'Femoral'
  | 'Gemelo'
  | 'Core'
  | 'Cardio';

/** Disposición declarada al empezar la sesión ("¿cómo llegas hoy?"). */
export type Readiness = 'fresh' | 'normal' | 'tired';

/** Nivel de esfuerzo objetivo por serie (autorregulación por RIR). */
export type ExerciseTag = 'principal' | 'accesorio' | 'aislamiento' | 'core' | 'cardio';

export interface Exercise {
  /** Identidad estable y única dentro de su sesión. Base de las claves de historial. */
  id: string;
  name: string;
  /** Número de series por defecto (puede sobreescribirse por semana con weekSets). */
  sets: number;
  reps: string;
  /** Descanso sugerido, p.ej. "90s". */
  rest: string;
  note: string;
  min: number;
  max: number;
  step: number;
  /** Unidad especial, p.ej. "kg extra" para dominadas lastradas. */
  unit?: string;
  group: MuscleGroup;
  tag: ExerciseTag;
  /**
   * Código de variante por semana:
   *   'base'  → aparece siempre
   *   'S1S3'  → solo semanas 1 y 3 (índices 0 y 2)
   *   'S2S4'  → solo semanas 2 y 4
   *   'S5'    → solo semana de descarga (índice 4)
   *   ...combinaciones análogas.
   */
  variant: string;
  /** RIR objetivo por semana (reps en reserva). Menor = más cerca del fallo. */
  targetRir?: number;
  weekSets?: Record<number, number>;
  weekReps?: Record<number, string>;
}

export interface Session {
  id: SessionId;
  label: string;
  title: string;
  color: string;
  icon: string;
  exercises: Exercise[];
}

// --- Calentamiento y movilidad ------------------------------------------------

export interface WarmupStep {
  name: string;
  sets: string;
  note: string;
}

export interface Warmup {
  title: string;
  duration: string;
  color: string;
  steps: WarmupStep[];
}

export interface Stretch {
  name: string;
  side: boolean;
  secs: number;
  cue: string;
}

export interface StretchBlock {
  title: string;
  color: string;
  stretches: Stretch[];
}

// --- Calendario ---------------------------------------------------------------

export type DayType = 'train' | 'cardio' | 'rest';

export interface WeekdayTemplate {
  id: number;
  short: string;
  label: string;
  type: DayType;
  session: SessionId | null;
  color: string;
}

// --- Catálogo de ejercicios ---------------------------------------------------

export interface CatalogEntry {
  name: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
}

// --- Nutrición ----------------------------------------------------------------

export interface Macros {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealMacros {
  p: number;
  c: number;
  f: number;
  kcal: number;
}

export interface Meal {
  label: string;
  time: string;
  highlight: string | null;
  items: string[];
  macros: MealMacros;
  note: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  qty: string;
  price: string;
}

export interface ShoppingSection {
  section: string;
  emoji: string;
  items: ShoppingItem[];
}

export interface NutritionTip {
  icon: string;
  title: string;
  text: string;
}

// --- Historial y estado persistido -------------------------------------------

/** Una entrada de historial por (ejercicio, día). Clave natural: exerciseKey + date. */
export interface HistoryEntry {
  sessionId: SessionId;
  exerciseId: string;
  /** YYYY-MM-DD. Con exerciseKey forma la clave natural única (upsert, no insert). */
  date: string;
  ts: number;
  /** Peso medio de las series (detecta progresión del peso de trabajo). */
  avgWeight: number;
  /** Peso máximo de la serie top (base de 1RM y detección de estancamiento). */
  maxWeight: number;
  /** Reps reales de la serie top (fallback a reps objetivo si no se registraron). */
  reps: number;
  sets: number;
  /** RIR (reps en reserva) declarado de la serie top, si se registró. Autorregulación. */
  rir?: number;
  note?: string;
}

/** Clave de historial de un ejercicio dentro de una sesión: estable entre semanas. */
export type ExerciseKey = string; // `${SessionId}:${exerciseId}`

export interface BodyWeightEntry {
  v: number;
  date: string;
  ts: number;
}

export type Joint = 'Rodilla' | 'Hombro' | 'Codo' | 'Muñeca' | 'Cadera' | 'Espalda' | 'Cuello' | 'Tobillo';

export interface PainEntry {
  id: string;
  joint: Joint;
  intensity: number; // 1-10
  note: string;
  date: string;
  ts: number;
}

export type SlotStatus = 'pending' | 'done' | 'skipped';

/** Un hueco del calendario del mesociclo (una sesión programada un día concreto). */
export interface ScheduleSlot {
  id: string;
  sessionId: SessionId;
  weekIdx: number; // 0-4
  slotIdx: number; // día dentro de la semana
  status: SlotStatus;
  ts: number | null;
  completionPct: number | null;
  durationMin: number | null;
}

/** Sesión activa en curso. Se persiste para sobrevivir a una recarga a media sesión. */
export interface ActiveSession {
  sessionId: SessionId;
  slotId: string | null;
  weekIdx: number;
  readiness: Readiness;
  /** Date.now() al pulsar "Empezar": base del cronómetro de sesión. */
  startedAt: number;
  phase: 'warmup' | 'exercises';
  /** Peso introducido por serie: clave `${exerciseId}-${setIdx}` → kg. */
  weights: Record<string, number>;
  /** Reps introducidas por serie: MISMA clave (leer y escribir aquí, decisiones #8). */
  reps: Record<string, string>;
  /** RIR declarado por serie: MISMA clave `${exerciseId}-${setIdx}` → string. */
  rir: Record<string, string>;
  /** Qué claves de peso han sido tocadas (input en blanco hasta entonces, decisiones #5). */
  touched: Record<string, boolean>;
  /** Series marcadas como hechas: clave `${exerciseId}-${setIdx}` → bool. */
  doneSets: Record<string, boolean>;
  /** Ejercicios extra añadidos a mano durante la sesión (fuera del plan base). */
  extra: Exercise[];
  note: string;
}

export type MeasurementKind = 'Cuello' | 'Pecho' | 'Brazo' | 'Cintura' | 'Cadera' | 'Muslo' | 'Gemelo';

export interface Measurement {
  id: string;
  kind: MeasurementKind;
  value: number; // cm
  date: string;
  ts: number;
}

export interface Settings {
  /** Arrancar el timer de descanso automáticamente al marcar una serie. */
  restAutoStart: boolean;
  /** Segundos de descanso por defecto si un ejercicio no define descanso (0 = usar el del ejercicio). */
  restDefaultSec: number;
  sound: boolean;
  vibrate: boolean;
  /** Mostrar la columna de RIR en la sesión. */
  trackRir: boolean;
}

/** Veredicto del coach post-sesión (heurístico local, ampliable a IA). */
export interface CoachVerdict {
  score: number; // 0-100
  headline: string;
  highlights: string[];
  improvement: string;
  nextSuggestion: string;
}

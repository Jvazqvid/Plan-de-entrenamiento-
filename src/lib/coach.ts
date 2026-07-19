// ============================================================================
// Coach post-sesión — análisis heurístico LOCAL (sin red, funciona offline).
//
// Devuelve el mismo shape (CoachVerdict) que devolvería un modelo de IA, de modo
// que en el futuro se puede sustituir esta función por una llamada a un LLM sin
// tocar la UI. Determinista y honesto: no infla el score.
// ============================================================================

import type { CoachVerdict, MuscleGroup, Readiness, SessionId } from '@/types';
import { isDeloadWeek } from './exercises';
import { fmtWeight } from './format';

export interface ExerciseResult {
  name: string;
  group: MuscleGroup;
  tag: string;
  plannedSets: number;
  doneSets: number;
  avgWeight: number;
  maxWeight: number;
  reps: number;
  oneRm: number;
  prevOneRm: number;
  isPr: boolean;
}

export interface SessionSummary {
  sessionId: SessionId;
  sessionTitle: string;
  weekIdx: number;
  readiness: Readiness;
  durationMin: number;
  exercises: ExerciseResult[];
}

const READINESS_LABEL: Record<Readiness, string> = {
  fresh: 'fresco',
  normal: 'normal',
  tired: 'cansado',
};

export function analyzeSession(s: SessionSummary): CoachVerdict {
  const planned = s.exercises.reduce((n, e) => n + e.plannedSets, 0);
  const done = s.exercises.reduce((n, e) => n + e.doneSets, 0);
  const completion = planned > 0 ? done / planned : 0;
  const pct = Math.round(completion * 100);

  const prs = s.exercises.filter((e) => e.isPr && e.oneRm > 0);
  const progressed = s.exercises.filter((e) => !e.isPr && e.prevOneRm > 0 && e.oneRm > e.prevOneRm);

  // --- Score ---
  const base = completion * 70;
  const prBonus = Math.min(20, prs.length * 7);
  const consistency = s.durationMin > 0 ? 10 : 0;
  const score = Math.max(0, Math.min(100, Math.round(base + prBonus + consistency)));

  // --- Titular ---
  let headline: string;
  if (score >= 90) headline = 'Sesión sobresaliente 🔥';
  else if (score >= 75) headline = 'Muy buena sesión 💪';
  else if (score >= 60) headline = 'Sesión sólida ✅';
  else if (score >= 40) headline = 'Sesión cumplida';
  else headline = 'Algo es mejor que nada';

  // --- Highlights ---
  const highlights: string[] = [];
  for (const pr of prs.slice(0, 2)) {
    highlights.push(`Nuevo récord en ${pr.name}: ${fmtWeight(pr.oneRm)} kg de 1RM estimado`);
  }
  if (pct >= 100) highlights.push('Completaste todas las series planificadas');
  else highlights.push(`Completaste ${done}/${planned} series (${pct}%)`);
  if (progressed.length > 0 && prs.length === 0) {
    highlights.push(`Subiste cargas en ${progressed.length} ejercicio${progressed.length > 1 ? 's' : ''}`);
  }
  if (isDeloadWeek(s.weekIdx)) {
    highlights.push('Semana de descarga: la fatiga baja y las adaptaciones afloran');
  }

  // --- Punto de mejora ---
  let improvement: string;
  const worst = [...s.exercises]
    .filter((e) => e.plannedSets > 0)
    .sort((a, b) => a.doneSets / a.plannedSets - b.doneSets / b.plannedSets)[0];
  if (s.readiness === 'tired') {
    improvement = 'Llegabas cansado. Prioriza sueño y una comida con carbos 60-90 min antes de entrenar.';
  } else if (worst && worst.doneSets < worst.plannedSets) {
    improvement = `Te quedaron series sin completar en ${worst.name}. Ajusta el peso para llegar a todas.`;
  } else if (s.exercises.some((e) => e.reps === 0)) {
    improvement = 'Registra las reps reales de cada serie: afinan mucho la sugerencia de peso.';
  } else {
    improvement = 'Cuida la velocidad de la fase concéntrica: empújala rápido aunque el peso sea alto.';
  }

  // --- Próxima sugerencia ---
  const mainLift = [...s.exercises]
    .filter((e) => e.tag === 'principal')
    .sort((a, b) => b.maxWeight - a.maxWeight)[0];
  let nextSuggestion: string;
  if (isDeloadWeek(s.weekIdx)) {
    nextSuggestion = 'La semana que viene arranca un mesociclo nuevo. Vuelve a cargas de trabajo progresivas.';
  } else if (mainLift) {
    nextSuggestion = `Próxima ${s.sessionId}: intenta +2.5 kg en ${mainLift.name} si mantienes la técnica.`;
  } else {
    nextSuggestion = 'Mantén la progresión: pequeño incremento cuando llegues al tope de reps con buena técnica.';
  }

  void READINESS_LABEL; // reservado para futuros mensajes personalizados
  return { score, headline, highlights: highlights.slice(0, 4), improvement, nextSuggestion };
}

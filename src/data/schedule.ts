// ============================================================================
// Plantilla semanal (qué sesión toca cada día)
// Datos base migrados del entrenamiento anterior de Javier.
// Se modificarán mucho: este es el punto de partida, no la versión final.
// ============================================================================

import type { WeekdayTemplate } from '@/types';

export const WEEK_TEMPLATE: WeekdayTemplate[] = [
  {
    "id": 0,
    "short": "L",
    "label": "Lunes",
    "type": "train",
    "session": "A",
    "color": "#ef4444"
  },
  {
    "id": 1,
    "short": "M",
    "label": "Martes",
    "type": "train",
    "session": "B",
    "color": "#3b82f6"
  },
  {
    "id": 2,
    "short": "X",
    "label": "Miércoles",
    "type": "rest",
    "session": null,
    "color": "#475569"
  },
  {
    "id": 3,
    "short": "J",
    "label": "Jueves",
    "type": "train",
    "session": "C",
    "color": "#f59e0b"
  },
  {
    "id": 4,
    "short": "V",
    "label": "Viernes",
    "type": "train",
    "session": "D",
    "color": "#8b5cf6"
  },
  {
    "id": 5,
    "short": "S",
    "label": "Sábado",
    "type": "cardio",
    "session": "E",
    "color": "#10b981"
  },
  {
    "id": 6,
    "short": "D",
    "label": "Domingo",
    "type": "rest",
    "session": null,
    "color": "#475569"
  }
];

/** Semanas del mesociclo. La última (índice 4) es descarga. */
export const MESOCYCLE_WEEKS = 5;
export const DELOAD_WEEK = 4;


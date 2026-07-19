// ============================================================================
// Catálogo de ejercicios por grupo muscular
// Datos base migrados del entrenamiento anterior de Javier.
// Se modificarán mucho: este es el punto de partida, no la versión final.
// ============================================================================

import type { CatalogEntry, MuscleGroup } from '@/types';

export const CATALOG: Record<string, CatalogEntry[]> = {
  "Pecho": [
    {
      "name": "Press banca plano (Smith)",
      "min": 5,
      "max": 80,
      "step": 2.5
    },
    {
      "name": "Press banca inclinado (Smith)",
      "min": 5,
      "max": 70,
      "step": 2.5
    },
    {
      "name": "Press banca declinado (Smith)",
      "min": 5,
      "max": 70,
      "step": 2.5
    },
    {
      "name": "Press landmine unilateral",
      "min": 5,
      "max": 30,
      "step": 2.5
    },
    {
      "name": "Aperturas mancuernas banco plano",
      "min": 5,
      "max": 20,
      "step": 2.5
    },
    {
      "name": "Cruces en polea baja",
      "min": 5,
      "max": 20,
      "step": 2.5
    }
  ],
  "Hombro": [
    {
      "name": "Press militar (Smith)",
      "min": 5,
      "max": 60,
      "step": 2.5
    },
    {
      "name": "Press Arnold mancuernas",
      "min": 5,
      "max": 20,
      "step": 2.5
    },
    {
      "name": "Elevaciones laterales mancuernas",
      "min": 2.5,
      "max": 15,
      "step": 2.5
    },
    {
      "name": "Elevaciones laterales polea baja",
      "min": 5,
      "max": 20,
      "step": 2.5
    },
    {
      "name": "Elevaciones frontales mancuernas",
      "min": 5,
      "max": 12.5,
      "step": 2.5
    },
    {
      "name": "Press tras nuca (Smith)",
      "min": 5,
      "max": 40,
      "step": 2.5
    },
    {
      "name": "Remo al menton mancuernas",
      "min": 5,
      "max": 20,
      "step": 2.5
    },
    {
      "name": "Face pull cuerda polea alta",
      "min": 5,
      "max": 30,
      "step": 2.5
    },
    {
      "name": "Pajaros mancuernas",
      "min": 2.5,
      "max": 12.5,
      "step": 2.5
    }
  ],
  "Triceps": [
    {
      "name": "Extension triceps polea cuerda",
      "min": 5,
      "max": 40,
      "step": 2.5
    },
    {
      "name": "Extension triceps cabeza mancuerna",
      "min": 5,
      "max": 20,
      "step": 2.5
    },
    {
      "name": "Patada de triceps mancuerna",
      "min": 2.5,
      "max": 10,
      "step": 2.5
    },
    {
      "name": "Dips en banco lastrados",
      "min": 0,
      "max": 20,
      "step": 2.5
    },
    {
      "name": "Fondos entre bancos",
      "min": 0,
      "max": 20,
      "step": 2.5
    },
    {
      "name": "Press agarre cerrado (Smith)",
      "min": 5,
      "max": 70,
      "step": 2.5
    }
  ],
  "Biceps": [
    {
      "name": "Curl biceps alterno mancuernas",
      "min": 5,
      "max": 20,
      "step": 2.5
    },
    {
      "name": "Curl inclinado mancuernas 45 grados",
      "min": 5,
      "max": 15,
      "step": 2.5
    },
    {
      "name": "Curl concentrado mancuerna",
      "min": 5,
      "max": 20,
      "step": 2.5
    },
    {
      "name": "Curl martillo mancuernas",
      "min": 5,
      "max": 20,
      "step": 2.5
    },
    {
      "name": "Curl polea baja barra Z",
      "min": 5,
      "max": 30,
      "step": 2.5
    },
    {
      "name": "Curl cuerda polea baja",
      "min": 5,
      "max": 20,
      "step": 2.5
    },
    {
      "name": "Curl Scott banco + polea",
      "min": 5,
      "max": 20,
      "step": 2.5
    }
  ],
  "Espalda": [
    {
      "name": "Dominadas agarre prono (F28)",
      "min": 0,
      "max": 20,
      "step": 2.5,
      "unit": "kg extra"
    },
    {
      "name": "Jalon al pecho agarre ancho",
      "min": 5,
      "max": 70,
      "step": 2.5
    },
    {
      "name": "Jalon agarre neutro V-bar",
      "min": 5,
      "max": 70,
      "step": 2.5
    },
    {
      "name": "Remo barra T landmine",
      "min": 5,
      "max": 60,
      "step": 2.5
    },
    {
      "name": "Remo unilateral mancuerna",
      "min": 5,
      "max": 40,
      "step": 2.5
    },
    {
      "name": "Remo polea baja agarre neutro",
      "min": 5,
      "max": 60,
      "step": 2.5
    },
    {
      "name": "Remo polea alta agarre prono",
      "min": 5,
      "max": 50,
      "step": 2.5
    },
    {
      "name": "Pullover mancuerna en banco",
      "min": 5,
      "max": 25,
      "step": 2.5
    },
    {
      "name": "Straight-arm pulldown polea",
      "min": 5,
      "max": 30,
      "step": 2.5
    }
  ],
  "Cuadriceps": [
    {
      "name": "Sentadilla Smith profunda",
      "min": 5,
      "max": 100,
      "step": 2.5
    },
    {
      "name": "Sentadilla bulgara Smith",
      "min": 5,
      "max": 40,
      "step": 2.5
    },
    {
      "name": "Sentadilla hack talones elevados",
      "min": 5,
      "max": 70,
      "step": 2.5
    },
    {
      "name": "Extension cuadriceps polea",
      "min": 5,
      "max": 40,
      "step": 2.5
    },
    {
      "name": "Step-up con mancuernas",
      "min": 5,
      "max": 20,
      "step": 2.5
    },
    {
      "name": "Prensa unilateral Smith",
      "min": 5,
      "max": 60,
      "step": 2.5
    }
  ],
  "Gluteo": [
    {
      "name": "Hip thrust Smith Machine",
      "min": 5,
      "max": 100,
      "step": 2.5
    },
    {
      "name": "Patada de gluteo polea baja",
      "min": 5,
      "max": 20,
      "step": 2.5
    },
    {
      "name": "Abductor lateral polea baja",
      "min": 5,
      "max": 20,
      "step": 2.5
    }
  ],
  "Femoral": [
    {
      "name": "Peso muerto rumano mancuernas",
      "min": 5,
      "max": 40,
      "step": 2.5
    },
    {
      "name": "Curl femoral tumbado polea",
      "min": 5,
      "max": 30,
      "step": 2.5
    }
  ],
  "Gemelo": [
    {
      "name": "Elevacion gemelar de pie Smith",
      "min": 5,
      "max": 80,
      "step": 2.5
    },
    {
      "name": "Elevacion gemelar sentado mancuerna",
      "min": 10,
      "max": 30,
      "step": 2.5
    }
  ],
  "Core": [
    {
      "name": "Crunch en polea alta cuerda",
      "min": 5,
      "max": 40,
      "step": 2.5
    },
    {
      "name": "Pallof press polea lateral",
      "min": 5,
      "max": 20,
      "step": 2.5
    },
    {
      "name": "Rotaciones polea Woodchop",
      "min": 5,
      "max": 20,
      "step": 2.5
    },
    {
      "name": "Dragon flag en banco Smith",
      "min": 0,
      "max": 0,
      "step": 0
    },
    {
      "name": "Rueda abdominal",
      "min": 0,
      "max": 0,
      "step": 0
    },
    {
      "name": "Plancha prona con elevacion",
      "min": 0,
      "max": 0,
      "step": 0
    },
    {
      "name": "Elevacion piernas colgado",
      "min": 0,
      "max": 0,
      "step": 0
    },
    {
      "name": "Crunch inverso en banco",
      "min": 0,
      "max": 0,
      "step": 0
    }
  ]
};

export const MUSCLE_GROUPS = Object.keys(CATALOG) as MuscleGroup[];


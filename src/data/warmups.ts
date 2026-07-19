// ============================================================================
// Calentamientos por sesión + variación semanal rotatoria
// Datos base migrados del entrenamiento anterior de Javier.
// Se modificarán mucho: este es el punto de partida, no la versión final.
// ============================================================================

import type { Warmup, WarmupStep } from '@/types';

export const WARMUPS: Record<'A' | 'B' | 'C' | 'D', Warmup> = {
  "A": {
    "title": "Calentamiento PUSH",
    "duration": "5-6 min",
    "color": "#ef4444",
    "steps": [
      {
        "name": "Rotación de hombros",
        "sets": "2×10",
        "note": "Círculos amplios hacia delante y hacia atrás. Moviliza la articulación glenohumeral."
      },
      {
        "name": "Band pull-apart (o cuerda polea baja)",
        "sets": "2×15",
        "note": "Abre pecho y activa manguito rotador. Imprescindible antes de press."
      },
      {
        "name": "Press con barra vacía (Smith)",
        "sets": "1×15",
        "note": "Rango completo, muy lento. Lubrica la articulación y activa los estabilizadores."
      },
      {
        "name": "Elevaciones frontales con mancuerna ligera",
        "sets": "1×12",
        "note": "2,5 kg. Activa deltoides anterior antes del press militar."
      },
      {
        "name": "Aperturas de pecho en la polea",
        "sets": "1×15",
        "note": "Carga muy ligera. Estira y activa el pectoral antes del trabajo pesado."
      }
    ]
  },
  "B": {
    "title": "Calentamiento PULL",
    "duration": "5-6 min",
    "color": "#3b82f6",
    "steps": [
      {
        "name": "Rotación interna/externa de hombro (cuerda polea)",
        "sets": "2×12 c/lado",
        "note": "Carga mínima. Fundamental para el manguito rotador antes de jalones y dominadas."
      },
      {
        "name": "Retracciones escapulares",
        "sets": "2×15",
        "note": "Sin peso. Activa romboides y trapecio medio. Mejora la conciencia de la escápula."
      },
      {
        "name": "Dominadas con ayuda o jalón muy ligero",
        "sets": "1×10",
        "note": "Amplitud completa, sin esfuerzo. Activa el dorsal y prepara el agarre."
      },
      {
        "name": "Remo con banda o polea muy ligera",
        "sets": "1×15",
        "note": "Activa los retractores escapulares. Prepara el patrón de tirón horizontal."
      },
      {
        "name": "Curl con barra o mancuerna ligera",
        "sets": "1×12",
        "note": "Activa el bíceps y prepara el codo antes del trabajo de curls pesado."
      }
    ]
  },
  "C": {
    "title": "Calentamiento LEGS",
    "duration": "6-7 min",
    "color": "#f59e0b",
    "steps": [
      {
        "name": "Sentadilla de peso corporal",
        "sets": "2×15",
        "note": "Lenta, controlada, profundidad máxima. Moviliza cadera, rodilla y tobillo."
      },
      {
        "name": "Zancada con rotación de torso",
        "sets": "1×10 c/lado",
        "note": "Estira flexores de cadera y moviliza la columna torácica."
      },
      {
        "name": "Peso muerto rumano con barra vacía",
        "sets": "1×12",
        "note": "Activa isquiotibiales y enseña al cuerpo el patrón de bisagra de cadera."
      },
      {
        "name": "Puente de glúteo en el suelo",
        "sets": "2×15",
        "note": "Activa glúteo antes del hip thrust. Reduce el riesgo de dominancia de isquiotibiales."
      },
      {
        "name": "Sentadilla Smith con carga muy ligera",
        "sets": "1×10",
        "note": "20-30% de tu carga de trabajo. Prepara el patrón motor específico."
      }
    ]
  },
  "D": {
    "title": "Calentamiento UPPER",
    "duration": "5 min",
    "color": "#8b5cf6",
    "steps": [
      {
        "name": "Rotación de hombros + movilidad torácica",
        "sets": "2×10",
        "note": "Combina rotaciones de hombro con extensiones de columna torácica."
      },
      {
        "name": "Press con barra vacía (Smith)",
        "sets": "1×12",
        "note": "Agarre cerrado. Activa el tríceps y prepara el codo."
      },
      {
        "name": "Jalón o dominada asistida muy ligera",
        "sets": "1×10",
        "note": "Activa dorsal y escápulas antes del remo con landmine."
      },
      {
        "name": "Curl + extensión simultáneos (mancuerna ligera)",
        "sets": "1×10",
        "note": "Activa bíceps y tríceps. Prepara el codo para el trabajo de aislamiento."
      }
    ]
  }
};

/** Paso alternativo que rota cada semana (weekIdx % 4) para evitar monotonía. */
export const WARMUPS_ALT: Record<'A' | 'B' | 'C' | 'D', WarmupStep[]> = {
  "A": [
    {
      "name": "Elevaciones laterales con mancuerna",
      "sets": "1x12",
      "note": "2.5kg. Activa deltoides lateral antes del press."
    },
    {
      "name": "Push-up con manos elevadas",
      "sets": "1x15",
      "note": "Manos en banco. Activa pectoral en rango completo."
    },
    {
      "name": "Face pull con cuerda",
      "sets": "2x12",
      "note": "Polea alta. Fortalece manguito y trapecio medio."
    },
    {
      "name": "Dips asistidos con banda",
      "sets": "1x10",
      "note": "Activa triceps y pectoral inferior."
    }
  ],
  "B": [
    {
      "name": "Pullover con mancuerna ligera",
      "sets": "1x12",
      "note": "5kg. Estira y activa dorsal antes del jalon."
    },
    {
      "name": "Face pull o cuerda en polea",
      "sets": "2x12",
      "note": "Activa manguito rotador externo antes de jalones."
    },
    {
      "name": "Remo unilateral ligero",
      "sets": "1x10/lado",
      "note": "Activa el dorsal de forma unilateral."
    },
    {
      "name": "Encogimientos con mancuerna",
      "sets": "2x15",
      "note": "Activa trapecio superior. Prepara el cuello."
    }
  ],
  "C": [
    {
      "name": "Hip thrust sin peso",
      "sets": "2x15",
      "note": "Activa gluteo sin carga antes del trabajo pesado."
    },
    {
      "name": "Sentadilla goblet con mancuerna",
      "sets": "1x12",
      "note": "10kg. Moviliza cadera y tobillo con carga ligera."
    },
    {
      "name": "Paso de oso (bear crawl)",
      "sets": "1x20s",
      "note": "Activa core y cadena cinetica completa."
    },
    {
      "name": "Salto al cajon suave",
      "sets": "1x8",
      "note": "Activa el sistema nervioso antes de sentadilla."
    }
  ],
  "D": [
    {
      "name": "Press mancuerna ligero alterno",
      "sets": "1x12/lado",
      "note": "5kg. Activa pectoral y hombro anterior."
    },
    {
      "name": "Dominada negativa lenta",
      "sets": "1x5",
      "note": "Solo la bajada. 5 segundos. Activa dorsal."
    },
    {
      "name": "Curl martillo ligero",
      "sets": "1x15",
      "note": "5kg. Activa biceps braquial antes de press cerrado."
    },
    {
      "name": "Press Arnold ligero",
      "sets": "1x10",
      "note": "5kg. Activa las 3 cabezas del deltoides."
    }
  ]
};


// ============================================================================
// Estiramientos / movilidad post-sesión
// Datos base migrados del entrenamiento anterior de Javier.
// Se modificarán mucho: este es el punto de partida, no la versión final.
// ============================================================================

import type { StretchBlock } from '@/types';

export const STRETCHES: Record<string, StretchBlock> = {
  "A": {
    "title": "Movilidad post-PUSH",
    "color": "#ef4444",
    "stretches": [
      {
        "name": "Estiramiento pectoral en marco de puerta",
        "side": false,
        "secs": 40,
        "cue": "Apoya el antebrazo en el marco y gira el cuerpo hacia el lado contrario. Siente el estiramiento en pecho y hombro anterior."
      },
      {
        "name": "Estiramiento deltoides anterior",
        "side": true,
        "secs": 30,
        "cue": "Lleva el brazo al pecho con el otro codo. Mira hacia el lado contrario para intensificar."
      },
      {
        "name": "Estiramiento triceps sobre cabeza",
        "side": true,
        "secs": 30,
        "cue": "Lleva el codo hacia atras con la otra mano. Mantén el core activo."
      },
      {
        "name": "Extension toracica sobre foam roller",
        "side": false,
        "secs": 45,
        "cue": "Apoya el roller a nivel toracico y extiende lentamente. Neutraliza la flexion de quirofano y del gym."
      },
      {
        "name": "Rotacion interna de hombro",
        "side": true,
        "secs": 35,
        "cue": "Con el hombro a 90 grados, rota hacia adentro suavemente. Fundamental para el manguito rotador."
      }
    ]
  },
  "B": {
    "title": "Movilidad post-PULL",
    "color": "#3b82f6",
    "stretches": [
      {
        "name": "Postura del nino extendida",
        "side": false,
        "secs": 45,
        "cue": "De rodillas, extiende los brazos al frente y lleva el pecho al suelo. Relaja el dorsal en cada espiracion."
      },
      {
        "name": "Estiramiento biceps contra la pared",
        "side": true,
        "secs": 30,
        "cue": "Con el pulgar hacia abajo, apoya la palma en la pared y gira el cuerpo hacia afuera."
      },
      {
        "name": "Rotacion externa de hombro tumbado",
        "side": true,
        "secs": 35,
        "cue": "Codo a 90 grados, deja caer el antebrazo hacia el suelo. La gravedad es suficiente."
      },
      {
        "name": "Flexion cervical lateral",
        "side": true,
        "secs": 25,
        "cue": "Inclina la oreja al hombro suavemente. El trapecio acumula tension en dominadas y remo."
      },
      {
        "name": "Apertura toracica brazos en T",
        "side": false,
        "secs": 40,
        "cue": "Tumbado boca arriba, abre los brazos en T. Trabaja la capsula articular posterior."
      }
    ]
  },
  "C": {
    "title": "Movilidad post-LEGS",
    "color": "#f59e0b",
    "stretches": [
      {
        "name": "Estiramiento cuadriceps de pie",
        "side": true,
        "secs": 35,
        "cue": "De pie, lleva el talon al gluteo. Mantén las rodillas juntas y el core activo."
      },
      {
        "name": "Estiramiento isquiotibial con banda",
        "side": true,
        "secs": 40,
        "cue": "Tumbado, eleva la pierna con rodilla ligeramente flexionada. Clave para la salud de la rodilla."
      },
      {
        "name": "Flexor de cadera en zancada baja",
        "side": true,
        "secs": 40,
        "cue": "Rodilla trasera en el suelo, avanza la cadera. El psoas acumula tension con sentadillas y horas en quirofano."
      },
      {
        "name": "Piriforme en figura del 4",
        "side": true,
        "secs": 40,
        "cue": "Tumbado, cruza el tobillo sobre la rodilla contraria y empuja suavemente."
      },
      {
        "name": "Gemelar y soleo en pared",
        "side": true,
        "secs": 35,
        "cue": "Gemelar: rodilla estirada. Soleo: flexiona ligeramente. Ambos contra la pared."
      },
      {
        "name": "Rotacion de cadera en el suelo",
        "side": false,
        "secs": 40,
        "cue": "Sentado con piernas cruzadas, inclinate hacia un lado con el brazo extendido."
      }
    ]
  },
  "D": {
    "title": "Movilidad post-UPPER",
    "color": "#8b5cf6",
    "stretches": [
      {
        "name": "Estiramiento pectoral y hombro anterior",
        "side": true,
        "secs": 35,
        "cue": "El press agarre cerrado carga especialmente el pectoral medial y el deltoides anterior."
      },
      {
        "name": "Triceps sobre cabeza",
        "side": true,
        "secs": 30,
        "cue": "Cabeza larga del triceps. Mantén el hombro estable y el codo bien alineado."
      },
      {
        "name": "Rotacion glenohumeral suave",
        "side": true,
        "secs": 35,
        "cue": "Alterna suavemente entre rotacion interna y externa. Lubrifica la articulacion."
      },
      {
        "name": "Postura del nino extendida",
        "side": false,
        "secs": 40,
        "cue": "La sesion Upper carga la columna toracica. Dedicale tiempo a esta posicion."
      }
    ]
  },
  "E": {
    "title": "Movilidad post-CARDIO",
    "color": "#10b981",
    "stretches": [
      {
        "name": "Cuadriceps de pie",
        "side": true,
        "secs": 35,
        "cue": "El pedaleo carga el cuadriceps de forma excentrica. Estiralo bien antes de sentarte."
      },
      {
        "name": "Isquiotibial sentado",
        "side": false,
        "secs": 40,
        "cue": "Sentado con piernas estiradas, inclinate hacia adelante con espalda neutra."
      },
      {
        "name": "Gemelar en pared",
        "side": true,
        "secs": 35,
        "cue": "El trabajo en rodillo acumula tension en gemelar y soleo."
      },
      {
        "name": "Rotacion de cadera en el suelo",
        "side": false,
        "secs": 40,
        "cue": "Las caderas quedan rigidas tras el ciclismo. Suelta la tension con rotaciones lentas."
      },
      {
        "name": "Extension toracica sobre foam roller",
        "side": false,
        "secs": 45,
        "cue": "La posicion en el rodillo flexiona la columna. Contrarresta con esta extension."
      }
    ]
  }
};


// ============================================================================
// Cues técnicos por ejercicio. Base: Delavier, "Guía de los movimientos de
// musculación" (4ª ed.), complementado con técnica estándar para los ejercicios
// que no tienen entrada propia en el libro (face pull, hip thrust, búlgara, RDL,
// plancha/Pallof). Ver docs/tecnica-ejercicios.md.
// ============================================================================

import type { TechniqueCue } from './methodology';

export const TECHNIQUE: TechniqueCue[] = [
  {
    exercise: 'Press banca plano',
    muscles: 'Pectoral mayor, deltoides anterior, tríceps, serrato',
    cues: [
      'Agarre en pronación algo más ancho que los hombros; glúteos en el banco y pies firmes.',
      'Baja controlado hasta rozar el pecho, codos a ~45° del tronco; empuja y espira al final.',
    ],
    mistake: 'Rebotar la barra en el pecho, despegar glúteos/lumbar o abrir los codos a 90°.',
  },
  {
    exercise: 'Press militar / hombro',
    muscles: 'Deltoides anterior y medio, haz clavicular del pectoral, tríceps',
    cues: [
      'Sentado con espalda recta, barra en la parte alta del pecho; empuja en línea vertical.',
      'Codos hacia delante = más deltoides anterior; codos separados = más deltoides medio.',
    ],
    mistake: 'Arquear la lumbar o empujar la barra hacia delante en vez de recto arriba.',
  },
  {
    exercise: 'Aperturas con mancuernas',
    muscles: 'Pectoral mayor (aislamiento), deltoides anterior',
    cues: [
      'Codos ligeramente flexionados y fijos para aliviar el hombro; abre solo hasta la horizontal.',
      'Contracción isométrica breve arriba; nunca con cargas máximas.',
    ],
    mistake: 'Bajar muy por debajo de la horizontal o usar demasiado peso (riesgo de desgarro).',
  },
  {
    exercise: 'Dominadas agarre prono',
    muscles: 'Dorsal ancho, redondo mayor, trapecio, romboides, bíceps',
    cues: [
      'Agarre prono ancho; tracciona llevando el pecho a la barra y los codos hacia abajo y atrás.',
      'Controla la bajada hasta extensión casi completa; espira al final.',
    ],
    mistake: 'Balanceo/kipping sin control o hacer solo media repetición.',
  },
  {
    exercise: 'Jalón al pecho',
    muscles: 'Dorsal ancho, trapecio medio/inferior, romboides, bíceps',
    cues: [
      'Tira hasta la parte alta del pecho ensanchando el tórax y llevando codos atrás.',
      'Retrae las escápulas; expira al final sin encoger los hombros.',
    ],
    mistake: 'Llevar la barra tras la nuca o tirar con impulso del tronco.',
  },
  {
    exercise: 'Remo (barra / mancuerna)',
    muscles: 'Dorsal ancho, redondo mayor, deltoides posterior, trapecio, romboides',
    cues: [
      'Espalda fija y recta en bisagra de cadera; tira llevando el codo alto y atrás, pegado al cuerpo.',
      'Ligera retracción escapular al final para máxima contracción.',
    ],
    mistake: 'Redondear la espalda, tirar con impulso lumbar o abrir el codo.',
  },
  {
    exercise: 'Face pull',
    muscles: 'Deltoides posterior, rotadores externos, trapecio medio/inferior',
    cues: [
      'Cuerda a la altura de la cara; tira hacia la frente separando los extremos y rotando externamente.',
      'Codos altos y retracción escapular; carga moderada y controlada.',
    ],
    mistake: 'Usar demasiado peso y convertirlo en remo, o tirar al pecho en vez de a la cara.',
  },
  {
    exercise: 'Curl de bíceps',
    muscles: 'Bíceps braquial, braquial anterior, supinador largo',
    cues: [
      'Codos fijos pegados al cuerpo; supina la muñeca al subir.',
      'Controla la fase excéntrica; espira al final.',
    ],
    mistake: 'Balanceo del tronco o adelantar los codos para ayudar a subir.',
  },
  {
    exercise: 'Curl martillo',
    muscles: 'Braquiorradial, braquial anterior, bíceps',
    cues: [
      'Agarre neutro (semipronación) mantenido todo el recorrido; codos fijos.',
      'Sube sin balanceo, controlando la bajada.',
    ],
    mistake: 'Rotar la muñeca (deja de trabajar el braquiorradial) o usar impulso.',
  },
  {
    exercise: 'Extensión de tríceps en polea',
    muscles: 'Tríceps braquial (3 porciones), ancóneo',
    cues: [
      'Codos pegados al cuerpo sin separarlos; extensión completa hasta bloquear el codo.',
      'Contracción isométrica 1-2 s al final; la cuerda enfatiza el vasto externo.',
    ],
    mistake: 'Separar/mover los codos (mete hombro y dorsal) o rango parcial con impulso.',
  },
  {
    exercise: 'Sentadilla profunda',
    muscles: 'Cuádriceps, glúteo mayor/medio, isquiotibiales, aductores, core',
    cues: [
      'Pies a la anchura de hombros con puntas ligeramente hacia fuera.',
      'Inspira y contrae el core (presión intraabdominal) antes de bajar; espalda neutra; baja bajo el paralelo.',
    ],
    mistake: 'Redondear la lumbar, meter las rodillas (valgo) o caer el busto adelante.',
  },
  {
    exercise: 'Hip thrust',
    muscles: 'Glúteo mayor (principal), isquiotibiales',
    cues: [
      'Espalda alta en el banco, barra sobre la cadera; empuja con los talones y extiende la cadera.',
      'Contracción máxima del glúteo 1-2 s arriba; costillas abajo y barbilla metida.',
    ],
    mistake: 'Hiperextender la lumbar en lugar de extender la cadera, o empujar con las puntas.',
  },
  {
    exercise: 'Sentadilla búlgara',
    muscles: 'Glúteo mayor, cuádriceps, isquiotibiales, aductores',
    cues: [
      'Pie trasero elevado; tronco recto (ligera inclinación = más glúteo); rodilla sobre el pie.',
      'Baja controlado la rodilla trasera; empieza con carga ligera por el equilibrio.',
    ],
    mistake: 'Colapsar la rodilla delantera hacia dentro o cargar el peso en la pierna trasera.',
  },
  {
    exercise: 'Peso muerto rumano',
    muscles: 'Isquiotibiales, glúteo mayor, erectores espinales',
    cues: [
      'Bisagra de cadera llevando el glúteo atrás con rodillas semiflexionadas fijas; barra pegada a las piernas.',
      'Baja hasta notar estiramiento en isquios; extiende la cadera apretando glúteos al subir.',
    ],
    mistake: 'Redondear la columna, flexionar demasiado las rodillas o alejar la barra del cuerpo.',
  },
  {
    exercise: 'Elevación de gemelos',
    muscles: 'Tríceps sural (gastrocnemio + sóleo)',
    cues: [
      'Rango completo: estiramiento máximo abajo y flexión plantar completa arriba, con pausa.',
      'De pie enfatiza gemelos; sentado (rodilla flexionada) enfatiza el sóleo.',
    ],
    mistake: 'Hacer rebotes cortos sin recorrido completo.',
  },
  {
    exercise: 'Elevaciones laterales',
    muscles: 'Deltoides medio (principal), supraespinoso, trapecio',
    cues: [
      'Codos ligeramente flexionados; eleva hasta la horizontal liderando con los codos.',
      'Controla el descenso; varía la posición inicial para cubrir todo el deltoides medio.',
    ],
    mistake: 'Dar impulso con el tronco o subir por encima de la horizontal encogiendo el trapecio.',
  },
  {
    exercise: 'Plancha / Pallof (core)',
    muscles: 'Recto y transverso del abdomen, oblicuos, cuadrado lumbar',
    cues: [
      'Plancha: cuerpo en línea recta, abdomen y glúteos contraídos, pelvis en ligera retroversión.',
      'Pallof: brazos extendidos al frente resistiendo la rotación; caderas y hombros cuadrados.',
    ],
    mistake: 'Hundir la lumbar en la plancha o dejar que el tronco gire hacia la polea en el Pallof.',
  },
];

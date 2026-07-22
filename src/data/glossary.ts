// ============================================================================
// Glosario: significado y utilidad de cada abreviatura, término e icono de la
// app. ÚNICA fuente de verdad para las explicaciones que aparecen al tocar un
// término (componente <Explain>) y para la sección "Glosario" de la Guía.
// Los métodos de entrenamiento se derivan de METHODS para no duplicar texto.
// ============================================================================

import { METHODS } from '@/data/methods';

export type GlossaryCategory = 'entreno' | 'nutricion' | 'iconos';

export interface GlossaryEntry {
  /** Clave estable, en kebab-case. Se usa en <Explain id="..." />. */
  id: string;
  /** Token tal y como se muestra (p. ej. "RIR", "1RM", "🏆"). */
  term: string;
  /** Nombre completo / a qué corresponde. */
  title: string;
  /** Frase corta con la idea principal. */
  short: string;
  /** Explicación y para qué sirve. */
  body: string;
  /** Ejemplo concreto opcional. */
  example?: string;
  category: GlossaryCategory;
}

const ENTRENO: GlossaryEntry[] = [
  {
    id: 'rir',
    term: 'RIR',
    title: 'Reps en reserva (Reps In Reserve)',
    short: 'Las repeticiones que aún podrías hacer antes de fallar.',
    body:
      'Mide cuánto esfuerzo te ha costado una serie. Un RIR alto = serie cómoda; ' +
      'un RIR bajo = cerca del fallo muscular. Sirve para autorregular la carga: ' +
      'entrenas con las reps justas para progresar acumulando la mínima fatiga. La app ' +
      'lo usa para decidir si subir, mantener o bajar el peso.',
    example: 'RIR 3 = paras dejándote 3 reps "en el depósito". RIR 0 = fallo, no podrías una más.',
    category: 'entreno',
  },
  {
    id: 'rpe',
    term: 'RPE',
    title: 'Esfuerzo percibido (Rate of Perceived Exertion)',
    short: 'Escala de 1 a 10 de lo dura que fue la serie.',
    body:
      'Es la otra cara del RIR: RPE = 10 − RIR. RPE 10 es el fallo absoluto; RPE 8 deja ' +
      '2 reps en reserva. Se usa para dosificar la intensidad sin depender solo del %1RM.',
    example: 'RPE 8 ≈ RIR 2. RPE 10 ≈ RIR 0 (fallo).',
    category: 'entreno',
  },
  {
    id: 'one-rm',
    term: '1RM',
    title: 'Una repetición máxima',
    short: 'El peso máximo que podrías levantar una sola vez.',
    body:
      'Referencia de tu fuerza en un ejercicio. La app no te hace probarlo (es arriesgado): ' +
      'lo estima con la fórmula de Epley a partir del peso y las reps de tu serie top. ' +
      'Sirve para seguir tu progreso y para calcular cargas por porcentaje (%1RM).',
    example: '60 kg × 8 reps ≈ 74 kg de 1RM estimado.',
    category: 'entreno',
  },
  {
    id: 'pct-1rm',
    term: '%1RM',
    title: 'Porcentaje de tu 1RM',
    short: 'La carga expresada como fracción de tu máximo.',
    body:
      'Permite prescribir la intensidad con precisión. Zonas orientativas: 85-100% para fuerza ' +
      '(1-6 reps), 65-85% para hipertrofia (6-12 reps), <65% para resistencia. La app lo aplica ' +
      'según la semana del mesociclo.',
    example: 'Si tu 1RM es 100 kg, el 80% son 80 kg.',
    category: 'entreno',
  },
  {
    id: 'pr',
    term: 'PR',
    title: 'Récord personal (Personal Record)',
    short: 'Tu mejor marca hasta la fecha en un ejercicio.',
    body:
      'La app marca un PR cuando superas tu mejor 1RM estimado en ese ejercicio. Aparece como ' +
      'una insignia durante la sesión y en el resumen. Es la señal objetiva de que estás progresando.',
    example: 'Insignia 🏆 "PR" junto al ejercicio = acabas de batir tu récord.',
    category: 'entreno',
  },
  {
    id: 'serie-top',
    term: 'serie top',
    title: 'Serie top (la de mayor peso)',
    short: 'La serie más pesada que completas en un ejercicio.',
    body:
      'Es la serie de referencia: de ella la app toma el peso, las reps y el RIR para estimar tu ' +
      '1RM y decidir la progresión. Siempre se usa el máximo, nunca la media de todas las series.',
    category: 'entreno',
  },
  {
    id: 'reps',
    term: 'reps',
    title: 'Repeticiones',
    short: 'Cada ejecución completa del movimiento.',
    body:
      'Una repetición es un ciclo completo del ejercicio (bajar y subir). El objetivo se muestra como ' +
      'un rango: haces la serie dentro de ese rango y, cuando llegas al tope con buen RIR, toca subir peso.',
    example: '"4 × 8-12" = 4 series de entre 8 y 12 repeticiones.',
    category: 'entreno',
  },
  {
    id: 'series',
    term: 'series',
    title: 'Series (sets)',
    short: 'Un grupo de repeticiones seguidas, con descanso después.',
    body:
      'Entre series descansas para recuperar. El volumen de entrenamiento se cuenta en series por grupo ' +
      'muscular a la semana, que es la palanca principal para ganar músculo.',
    example: '"4 × 8" = 4 series de 8 reps.',
    category: 'entreno',
  },
  {
    id: 'doble-progresion',
    term: 'doble progresión',
    title: 'Doble progresión',
    short: 'Primero subes reps; cuando llegas al tope, subes peso.',
    body:
      'Método de progresión que usa la app: te mantienes en un peso hasta completar el tope de reps del ' +
      'rango con buen RIR; entonces subes la carga y vuelves a la parte baja del rango. Progreso sostenible ' +
      'sin saltos bruscos.',
    example: 'Llegas a 4×12 cómodo → subes peso y vuelves a buscar 4×8.',
    category: 'entreno',
  },
  {
    id: 'aproximacion',
    term: 'aproximación',
    title: 'Series de aproximación (warm-up ramp)',
    short: 'Series ligeras y ascendentes antes de la carga de trabajo.',
    body:
      'Preparan el músculo y el sistema nervioso subiendo el peso de forma progresiva hasta el de trabajo. ' +
      'Reducen el riesgo de lesión y mejoran el rendimiento de las primeras series efectivas. La app las calcula ' +
      'automáticamente a partir de tu peso objetivo.',
    example: 'Antes de 60 kg: 20 kg × 8, 35 kg × 5, 50 kg × 3.',
    category: 'entreno',
  },
  {
    id: 'readiness',
    term: 'disposición',
    title: 'Disposición del día (readiness)',
    short: 'Cómo llegas de fresco antes de entrenar.',
    body:
      'Antes de empezar eliges si vienes fresco, normal o cansado. La app ajusta la sugerencia de peso y el ' +
      'descanso: fresco puede subir algo más, cansado modera la carga. Autorregulación según tu estado real.',
    example: 'Cansado → sugiere algo menos de peso y +15 s de descanso.',
    category: 'entreno',
  },
  {
    id: 'mesociclo',
    term: 'mesociclo',
    title: 'Mesociclo de 5 semanas',
    short: 'El bloque de entrenamiento con su propia progresión.',
    body:
      'La app organiza el entreno en bloques de 5 semanas: se acumula esfuerzo durante 4 y la 5ª es de descarga. ' +
      'Así la fatiga no se dispara y las adaptaciones afloran (supercompensación).',
    category: 'entreno',
  },
  {
    id: 'descarga',
    term: 'descarga',
    title: 'Semana de descarga (deload)',
    short: 'Semana suave para recuperar y asimilar.',
    body:
      'Se reduce el volumen y/o la intensidad (la 5ª semana del mesociclo) para bajar la fatiga acumulada. No es ' +
      'perder el tiempo: es cuando el cuerpo consolida las ganancias de las semanas duras.',
    category: 'entreno',
  },
  {
    id: 'racha',
    term: 'racha',
    title: 'Racha de constancia',
    short: 'Sesiones seguidas sin dejar pasar demasiados días.',
    body: 'Cuenta cuántas sesiones encadenas manteniendo el hábito. Se rompe si dejas pasar más de unos días sin entrenar. Es un empujón de motivación: la constancia es lo que de verdad construye resultados.',
    category: 'entreno',
  },
  {
    id: 'volumen',
    term: 'volumen',
    title: 'Volumen de entrenamiento',
    short: 'Cuánto trabajo haces, medido en series efectivas por músculo/semana.',
    body:
      'Es el principal motor de la hipertrofia. Se navega entre umbrales: MEV (mínimo para crecer), MAV (rango óptimo) ' +
      'y MRV (máximo recuperable). Pasarse no da más músculo, solo más fatiga.',
    category: 'entreno',
  },
  {
    id: 'mv',
    term: 'MV',
    title: 'Volumen de mantenimiento (Maintenance Volume)',
    short: 'Las series semanales justas para no perder músculo.',
    body: 'Por debajo de este volumen empiezas a perder masa. Sirve de referencia en fases de descanso o descarga: con muy poco ya mantienes lo ganado.',
    category: 'entreno',
  },
  {
    id: 'mev',
    term: 'MEV',
    title: 'Volumen mínimo efectivo (Minimum Effective Volume)',
    short: 'El mínimo de series semanales para que un músculo crezca.',
    body: 'Por debajo del MEV mantienes, pero apenas ganas. Es el suelo del volumen productivo para cada grupo muscular.',
    category: 'entreno',
  },
  {
    id: 'mav',
    term: 'MAV',
    title: 'Volumen adaptativo máximo (Maximum Adaptive Volume)',
    short: 'La franja de volumen donde más progresas.',
    body: 'El rango óptimo de series semanales: suficiente estímulo para crecer y aún recuperable. Es donde interesa vivir la mayor parte del tiempo.',
    category: 'entreno',
  },
  {
    id: 'mrv',
    term: 'MRV',
    title: 'Volumen máximo recuperable (Maximum Recoverable Volume)',
    short: 'El techo que puedes recuperar sin pasarte.',
    body: 'Por encima del MRV acumulas más fatiga de la que puedes asimilar y el rendimiento cae. Señala cuándo toca descargar.',
    category: 'entreno',
  },
  {
    id: 'epley',
    term: 'Epley',
    title: 'Fórmula de Epley',
    short: 'La ecuación con la que la app estima tu 1RM.',
    body: 'Estima el 1RM a partir del peso y las reps: 1RM ≈ peso × (1 + reps/30). Es el único punto de cálculo de 1RM en toda la app, para que todas las vistas coincidan.',
    example: '50 kg × 10 reps → 50 × (1 + 10/30) ≈ 66,7 kg.',
    category: 'entreno',
  },
  {
    id: 'kg',
    term: 'kg',
    title: 'Kilogramos',
    short: 'La unidad de carga.',
    body: 'El peso que levantas. Los botones + y − suben o bajan según el incremento mínimo realista de ese ejercicio (p. ej. 2,5 kg en barra, 1-2 kg en mancuernas).',
    category: 'entreno',
  },
  {
    id: 'sesion-push',
    term: 'PUSH',
    title: 'Sesión A · PUSH (empuje)',
    short: 'Día de empujes: pecho, hombro y tríceps.',
    body: 'Agrupa los ejercicios en los que empujas el peso lejos del cuerpo (press de banca, press militar, fondos). Es la sesión A del plan.',
    category: 'entreno',
  },
  {
    id: 'sesion-pull',
    term: 'PULL',
    title: 'Sesión B · PULL (tracción)',
    short: 'Día de tirones: espalda y bíceps.',
    body: 'Agrupa los ejercicios en los que traccionas el peso hacia el cuerpo (dominadas, remos, curls). Es la sesión B del plan.',
    category: 'entreno',
  },
  {
    id: 'sesion-legs',
    term: 'LEGS',
    title: 'Sesión C · LEGS (pierna)',
    short: 'Día de tren inferior: cuádriceps, femoral y glúteo.',
    body: 'Sentadillas, peso muerto, zancadas y accesorios de pierna. Es la sesión C del plan.',
    category: 'entreno',
  },
  {
    id: 'sesion-upper',
    term: 'UPPER',
    title: 'Sesión D · UPPER (torso completo)',
    short: 'Día de tren superior combinado: empuje + tracción.',
    body: 'Mezcla pecho, espalda, hombro y brazos en una sola sesión de torso. Es la sesión D del plan.',
    category: 'entreno',
  },
  {
    id: 'sesion-cardio',
    term: 'CARDIO',
    title: 'Sesión E · CARDIO',
    short: 'Trabajo cardiovascular y acondicionamiento.',
    body: 'Sesión de resistencia cardiovascular que complementa la fuerza: salud cardiaca, gasto calórico y recuperación activa. Es la sesión E del plan.',
    category: 'entreno',
  },
  {
    id: 'c-l',
    term: 'c/l',
    title: 'Cada lado',
    short: 'Las reps son por cada lado del cuerpo.',
    body: 'En ejercicios unilaterales (zancadas, remo a una mano…) el objetivo se cuenta por lado, no en total. "10 c/l" = 10 con la derecha y 10 con la izquierda.',
    example: '"10 c/l" = 10 repeticiones por pierna/brazo.',
    category: 'entreno',
  },
  {
    id: 'variante-semana',
    term: 'S1·S2·S3',
    title: 'Códigos de semana (S1–S5)',
    short: 'En qué semanas del mesociclo aplica ese ejercicio o serie.',
    body: 'Algunos ejercicios o series solo aparecen en ciertas semanas para dar variedad. S1 = semana 1, S5 = semana 5 (descarga). "S1+S3" = semanas 1 y 3. Así ninguna semana se repite idéntica.',
    example: '"S5 deload" = esa variante es la de la semana de descarga.',
    category: 'entreno',
  },
  {
    id: 'hiit',
    term: 'HIIT',
    title: 'Entrenamiento interválico de alta intensidad',
    short: 'Alternar esfuerzos muy intensos con recuperaciones cortas.',
    body: 'Intervalos "all-out" (a tope) seguidos de descanso o trabajo suave, p. ej. 20 s fuerte / 40 s flojo. Gran estímulo cardiovascular y quema calórica en poco tiempo. Aparece en la sesión de cardio.',
    example: '20/40 = 20 s a tope, 40 s de recuperación.',
    category: 'entreno',
  },
  {
    id: 'zona2',
    term: 'Zona 2',
    title: 'Zona 2 (cardio aeróbico suave)',
    short: 'Ritmo cómodo en el que aún podrías hablar.',
    body: 'Intensidad baja-moderada (~60-70% de tu FCmax) que desarrolla la base aeróbica y ayuda a recuperar sin acumular fatiga. La "Zona 3" es un punto más exigente.',
    category: 'entreno',
  },
  {
    id: 'fcmax',
    term: 'FCmax',
    title: 'Frecuencia cardiaca máxima',
    short: 'El máximo de pulsaciones por minuto de tu corazón.',
    body: 'Referencia para dosificar el cardio por zonas. Estimación sencilla: 220 − tu edad. Las zonas de esfuerzo se expresan como % de la FCmax.',
    example: 'A los 40 años, FCmax ≈ 180 lpm; Zona 2 ≈ 108-126 lpm.',
    category: 'entreno',
  },
];

const NUTRICION: GlossaryEntry[] = [
  {
    id: 'tdee',
    term: 'TDEE',
    title: 'Gasto energético diario total (Total Daily Energy Expenditure)',
    short: 'Las calorías que quemas al día en total.',
    body:
      'Suma tu metabolismo basal más la actividad y el entrenamiento. Es la referencia para comer: por encima ' +
      'del TDEE ganas peso, por debajo lo pierdes. La app lo estima y ajusta tus macros según cómo evoluciona tu peso real.',
    category: 'nutricion',
  },
  {
    id: 'kcal',
    term: 'kcal',
    title: 'Kilocalorías',
    short: 'La energía que aportan los alimentos.',
    body:
      'La "caloría" que se usa en nutrición es en realidad una kilocaloría. Cada macronutriente aporta: proteína y ' +
      'carbohidratos 4 kcal/g, grasa 9 kcal/g. El total del día debe cuadrar con tu objetivo.',
    category: 'nutricion',
  },
  {
    id: 'macros',
    term: 'macros',
    title: 'Macronutrientes',
    short: 'Proteína, carbohidratos y grasa: de dónde salen las calorías.',
    body:
      'Los tres macronutrientes que aportan energía. Repartirlos bien —no solo contar calorías— es lo que sostiene el ' +
      'músculo y el rendimiento. La app te da un objetivo diario de cada uno.',
    category: 'nutricion',
  },
  {
    id: 'proteina',
    term: 'proteína',
    title: 'Proteína',
    short: 'El macro que construye y repara músculo.',
    body:
      'Aporta los aminoácidos para reparar y ganar tejido muscular. Es el macro que la app mantiene fijo (prioritario) ' +
      'aunque ajuste calorías. Orientativo: ~1,6-2,2 g por kg de peso al día. 4 kcal/g.',
    category: 'nutricion',
  },
  {
    id: 'carbohidratos',
    term: 'carbohidratos',
    title: 'Carbohidratos',
    short: 'El combustible principal para entrenar fuerte.',
    body:
      'Rellenan el glucógeno muscular: son la gasolina del entrenamiento intenso. La app sube los carbos en día de ' +
      'entreno y los baja en día de descanso. 4 kcal/g.',
    category: 'nutricion',
  },
  {
    id: 'grasa',
    term: 'grasa',
    title: 'Grasas',
    short: 'Imprescindibles para las hormonas y absorber vitaminas.',
    body:
      'Sostienen la función hormonal (incluida la testosterona) y la absorción de vitaminas liposolubles. No conviene ' +
      'bajarlas en exceso. Es el macro más denso: 9 kcal/g.',
    category: 'nutricion',
  },
];

// Iconos/emoji con significado en la UI.
const ICONOS: GlossaryEntry[] = [
  {
    id: 'icon-pr',
    term: '🏆',
    title: 'Insignia de récord (PR)',
    short: 'Acabas de batir tu mejor marca en ese ejercicio.',
    body: 'Aparece junto a un ejercicio cuando superas tu mejor 1RM estimado. Ver [[pr]].',
    category: 'iconos',
  },
  {
    id: 'icon-fire',
    term: '🔥',
    title: 'Series de aproximación',
    short: 'Despliega el calentamiento ascendente del ejercicio.',
    body: 'Toca para ver las series ligeras previas a tu peso de trabajo. Ver [[aproximacion]].',
    category: 'iconos',
  },
  {
    id: 'icon-bulb',
    term: '💡',
    title: 'Peso sugerido',
    short: 'La carga que la app te propone para esa serie.',
    body: 'Es una sugerencia autorregulada por tu historial, tu RIR y tu disposición del día. Puedes ajustarla con los botones + y −. Ver [[rir]].',
    category: 'iconos',
  },
  {
    id: 'icon-note',
    term: '💬',
    title: 'Nota técnica del ejercicio',
    short: 'Un recordatorio de ejecución o enfoque.',
    body: 'Consejo breve sobre cómo hacer el ejercicio o en qué fijarte. La técnica detallada está en la pestaña Guía.',
    category: 'iconos',
  },
  {
    id: 'icon-check',
    term: '✓',
    title: 'Marcar serie como hecha',
    short: 'Registra la serie y (si está activo) arranca el descanso.',
    body: 'Al marcarla, la serie cuenta como completada y el cronómetro de descanso puede iniciarse solo, según tus ajustes.',
    category: 'iconos',
  },
  {
    id: 'icon-swap',
    term: '🔄',
    title: 'Cambiar comida',
    short: 'Rota a otra alternativa del catálogo para esa franja.',
    body: 'Cada comida tiene varias opciones equivalentes en macros. El número (p. ej. 5/12) indica cuál ves de cuántas hay. Así evitas la monotonía.',
    category: 'iconos',
  },
  {
    id: 'icon-eye',
    term: '👁',
    title: 'Ver la sesión',
    short: 'Previsualiza los ejercicios sin empezar a entrenar.',
    body: 'Abre un detalle de la sesión (ejercicios, series, método de la semana y volumen) para hacerte una idea antes de arrancar.',
    category: 'iconos',
  },
  {
    id: 'icon-trend',
    term: '↑ ↓',
    title: 'Tendencia del 1RM',
    short: 'Si tu fuerza estimada sube, baja o se mantiene.',
    body: 'Compara tu 1RM estimado reciente con el anterior. ↑ progresas, ↓ retrocedes, → estable. Ver [[one-rm]].',
    category: 'iconos',
  },
  {
    id: 'sugerencia-peso',
    term: '↑ 🎯 ↓',
    title: 'Sugerencia de carga',
    short: 'Qué hacer con el peso hoy: subir, mantener o bajar.',
    body:
      'La app propone el peso de cada ejercicio según tu historial, tu RIR y tu disposición:\n\n' +
      '↑ progresar (subir carga) · 🎯 consolidar (repetir peso) · ↓ descargar (bajar) · ✳️ empezar (primera vez). ' +
      'Es solo una sugerencia: ajústala con los botones + y −. Ver [[doble-progresion]] y [[rir]].',
    category: 'iconos',
  },
];

// Métodos de entrenamiento: derivados de METHODS para no duplicar texto.
const METODOS: GlossaryEntry[] = METHODS.map((m) => ({
  id: `metodo-${m.id}`,
  term: m.name,
  title: `${m.emoji} ${m.name}`,
  short: m.how.split('.')[0] + '.',
  body: `${m.how}\n\nCuándo: ${m.when}`,
  category: 'entreno' as const,
}));

export const GLOSSARY: GlossaryEntry[] = [...ENTRENO, ...METODOS, ...NUTRICION, ...ICONOS];

export const GLOSSARY_BY_ID: Record<string, GlossaryEntry> = Object.fromEntries(
  GLOSSARY.map((g) => [g.id, g]),
);

/** Mapa id de sesión (A-E) → ficha del glosario correspondiente. */
export const SESSION_GLOSSARY: Record<string, string> = {
  A: 'sesion-push',
  B: 'sesion-pull',
  C: 'sesion-legs',
  D: 'sesion-upper',
  E: 'sesion-cardio',
};

export const GLOSSARY_CATEGORIES: { id: GlossaryCategory; label: string; emoji: string }[] = [
  { id: 'entreno', label: 'Entrenamiento', emoji: '🏋️' },
  { id: 'nutricion', label: 'Nutrición', emoji: '🍽️' },
  { id: 'iconos', label: 'Iconos', emoji: '✨' },
];

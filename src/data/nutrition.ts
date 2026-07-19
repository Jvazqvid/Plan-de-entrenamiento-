// ============================================================================
// Nutrición: comidas por día, macros objetivo, compra y estrategia
// Datos base migrados del entrenamiento anterior de Javier.
// Se modificarán mucho: este es el punto de partida, no la versión final.
// ============================================================================

import type { Macros, Meal, ShoppingSection, NutritionTip } from '@/types';

/** Macros objetivo base según sea día de entreno o de descanso. */
export const MACROS_BASE: { train: Macros; rest: Macros } = {
  "train": {
    "kcal": 2750,
    "protein": 172,
    "carbs": 240,
    "fat": 76
  },
  "rest": {
    "kcal": 2400,
    "protein": 172,
    "carbs": 160,
    "fat": 82
  }
};

/** Comidas por día de la semana (0 = lunes). */
export const MEALS_BY_DAY: Meal[][] = [
  [
    {
      "label": "Desayuno",
      "time": "07:30",
      "highlight": null,
      "items": [
        "4 huevos + 1 clara revueltos con tomate y oregano (5 min)",
        "90g avena Vitafit Lidl con 250ml leche Milbona y 1 platano en rodajas",
        "Cafe solo"
      ],
      "macros": {
        "p": 42,
        "c": 82,
        "f": 20,
        "kcal": 684
      },
      "note": "Rapido y completo. Los huevos Campobello Lidl aportan proteina de alta calidad desde primera hora."
    },
    {
      "label": "Media manana",
      "time": "11:00",
      "highlight": null,
      "items": [
        "250g yogur griego Milbona 0% (Lidl)",
        "1 kiwi + 1 mandarina en trozos encima",
        "20g miel Lidl",
        "20g nueces Lidl"
      ],
      "macros": {
        "p": 22,
        "c": 36,
        "f": 12,
        "kcal": 354
      },
      "note": "Postre de media manana: yogur con fruta fresca. El kiwi aporta vitamina C y el yogur griego Milbona tiene 10g proteina/100g."
    },
    {
      "label": "Comida · Pre-entreno",
      "time": "14:00",
      "highlight": "Pre",
      "items": [
        "220g pechuga de pollo a la plancha con pimenton y ajo en polvo (10 min)",
        "180g arroz basmati Lidl cocido + 1.5 cda aceite oliva",
        "Ensalada: lechuga + tomate cherry + pepino (5 min)"
      ],
      "macros": {
        "p": 52,
        "c": 86,
        "f": 18,
        "kcal": 710
      },
      "note": "Pre-entreno clasico. La plancha tarda 8-10 min. El arroz lo puedes tener preparado del dia anterior."
    },
    {
      "label": "Post-entreno",
      "time": "17:30",
      "highlight": "Post",
      "items": [
        "40g proteina whey con leche Milbona",
        "1 platano grande",
        "1 tostada pan integral Lidl con miel"
      ],
      "macros": {
        "p": 42,
        "c": 62,
        "f": 5,
        "kcal": 454
      },
      "note": "Proteina rapida + carbos simples para la recuperacion muscular."
    },
    {
      "label": "Cena",
      "time": "21:00",
      "highlight": null,
      "items": [
        "220g salmon al horno con limon y eneldo (12 min horno a 200C)",
        "Espinacas baby Lidl salteadas con ajo + 1 cda aceite (5 min)",
        "1 naranja de postre"
      ],
      "macros": {
        "p": 48,
        "c": 22,
        "f": 28,
        "kcal": 548
      },
      "note": "El salmon fresco de Lidl es rico en omega-3. La naranja de postre aporta vitamina C que mejora la absorcion de hierro."
    }
  ],
  [
    {
      "label": "Desayuno",
      "time": "07:30",
      "highlight": null,
      "items": [
        "Tortilla francesa 4 huevos con jamon york Lidl (5 min)",
        "3 tostadas pan integral Lieken Urkorn Lidl con tomate rallado y aceite",
        "Cafe con leche Milbona"
      ],
      "macros": {
        "p": 42,
        "c": 58,
        "f": 24,
        "kcal": 644
      },
      "note": "Desayuno mediterraneo rapido. El pan Lieken de Lidl tiene excelente perfil de fibra."
    },
    {
      "label": "Media manana",
      "time": "11:00",
      "highlight": null,
      "items": [
        "250g yogur griego Milbona natural",
        "1 pera + 8 fresas en trozos (o fruta de temporada Lidl)",
        "35g almendras Lidl"
      ],
      "macros": {
        "p": 24,
        "c": 40,
        "f": 22,
        "kcal": 474
      },
      "note": "Fruta de temporada siempre disponible en Lidl a buen precio. Cambia segun la semana."
    },
    {
      "label": "Comida · Pre-entreno",
      "time": "14:00",
      "highlight": "Pre",
      "items": [
        "200g lentejas pardinas de bote Lidl escurridas (sin cocinar, listas!)",
        "2 huevos duros encima + 1 pimiento rojo en tiras",
        "Aliñada con 1.5 cda aceite oliva Primadonna + vinagre + oregano (5 min)"
      ],
      "macros": {
        "p": 36,
        "c": 46,
        "f": 18,
        "kcal": 476
      },
      "note": "Las lentejas de bote Lidl son proteina vegetal + hierro listos en 2 min. Añade el huevo duro para completar el perfil aminoacidico."
    },
    {
      "label": "Post-entreno",
      "time": "17:30",
      "highlight": "Post",
      "items": [
        "40g proteina whey con agua fria",
        "1 platano + 4 datiles Medjool Lidl"
      ],
      "macros": {
        "p": 41,
        "c": 62,
        "f": 3,
        "kcal": 432
      },
      "note": "Post-entreno minimalista. Los datiles de Lidl son el mejor carbohidrato rapido natural."
    },
    {
      "label": "Cena",
      "time": "21:00",
      "highlight": null,
      "items": [
        "250g contramuslo pollo sin piel al horno con especias (12 min precalentado a 200C)",
        "Ensalada: rucula + tomate + mozarella fresca Milbona Lidl + 2 cda aceite",
        "1 manzana de postre"
      ],
      "macros": {
        "p": 54,
        "c": 36,
        "f": 32,
        "kcal": 646
      },
      "note": "La rucula de Lidl aporta hierro y calcio. La manzana de postre ayuda a la digestion por su contenido en pectina."
    }
  ],
  [
    {
      "label": "Desayuno",
      "time": "07:30",
      "highlight": null,
      "items": [
        "4 huevos revueltos con champiñones laminados Lidl y cebolla (8 min)",
        "1.5 tostadas pan integral con aguacate en rodajas",
        "Cafe solo"
      ],
      "macros": {
        "p": 34,
        "c": 30,
        "f": 28,
        "kcal": 494
      },
      "note": "Dia de descanso: menos carbos, mas grasas saludables. El aguacate Lidl aporta grasas monoinsaturadas y potasio."
    },
    {
      "label": "Media manana",
      "time": "11:00",
      "highlight": null,
      "items": [
        "250g queso cottage Milbona Lidl con canela",
        "1 platano en rodajas encima",
        "10 nueces peladas Lidl"
      ],
      "macros": {
        "p": 30,
        "c": 36,
        "f": 20,
        "kcal": 436
      },
      "note": "El cottage es la fuente de caseina mas economica. Con platano y nueces se convierte en un postre saciante."
    },
    {
      "label": "Comida",
      "time": "14:00",
      "highlight": null,
      "items": [
        "250g garbanzos de bote Lidl + 220g atun al natural Nixe Lidl escurrido",
        "Ensalada grande: pepino + tomate + cebolla morada + pimiento verde",
        "Aliño: limon + 2 cda aceite oliva + comino (5 min)"
      ],
      "macros": {
        "p": 60,
        "c": 56,
        "f": 26,
        "kcal": 692
      },
      "note": "Proteina animal + vegetal. Los garbanzos Lidl en bote son perfectos: listos al instante, altos en fibra y proteina."
    },
    {
      "label": "Merienda",
      "time": "17:30",
      "highlight": null,
      "items": [
        "1 yogur natural Milbona Lidl",
        "1 naranja o 2 mandarinas de temporada",
        "25g almendras Lidl"
      ],
      "macros": {
        "p": 14,
        "c": 30,
        "f": 16,
        "kcal": 316
      },
      "note": "Merienda ligera de dia de descanso. La fruta aporta fructosa que repone el glucogeno hepatico."
    },
    {
      "label": "Cena",
      "time": "21:00",
      "highlight": null,
      "items": [
        "220g merluza o bacalao al horno con ajo y perejil (10 min)",
        "Brocoli al vapor bolsa Lidl + 1 cda aceite (4 min microondas)",
        "1 kiwi de postre"
      ],
      "macros": {
        "p": 46,
        "c": 18,
        "f": 10,
        "kcal": 362
      },
      "note": "Cena minima de dia de descanso. El pescado blanco es la proteina mas magra disponible en Lidl."
    }
  ],
  [
    {
      "label": "Desayuno",
      "time": "07:30",
      "highlight": null,
      "items": [
        "110g avena Vitafit Lidl con leche Milbona + 1.5 cda miel + 1 platano troceado",
        "4 huevos duros (hechos el dia anterior) o revueltos rapidos (5 min)",
        "Cafe solo"
      ],
      "macros": {
        "p": 48,
        "c": 100,
        "f": 20,
        "kcal": 780
      },
      "note": "Maximo carbohidrato: dia de pierna es el mas exigente. Prepara los huevos duros la noche anterior para ganar tiempo."
    },
    {
      "label": "Media manana",
      "time": "11:00",
      "highlight": null,
      "items": [
        "250g yogur griego Milbona",
        "1 platano + 1 puñado grande arandanos o fresas Lidl (temporada)",
        "15g almendras Lidl"
      ],
      "macros": {
        "p": 22,
        "c": 48,
        "f": 8,
        "kcal": 344
      },
      "note": "Carbos extras antes de la sesion de pierna. Los arandanos son potentes antioxidantes que reducen el dano muscular."
    },
    {
      "label": "Comida · Pre-entreno",
      "time": "14:00",
      "highlight": "Pre",
      "items": [
        "180g arroz largo Lidl cocido con salmon en lata Nixe o fresco a la plancha (10 min)",
        "Judias verdes al vapor bolsa Lidl + 1 cda aceite (4 min microondas)"
      ],
      "macros": {
        "p": 48,
        "c": 90,
        "f": 18,
        "kcal": 730
      },
      "note": "La sesion de pierna necesita el mayor aporte de carbos del dia. El arroz + salmon es la combinacion optima."
    },
    {
      "label": "Post-entreno",
      "time": "17:30",
      "highlight": "Post",
      "items": [
        "40g proteina whey con leche",
        "1 platano grande",
        "40g copos de avena en agua (mini batido)"
      ],
      "macros": {
        "p": 44,
        "c": 76,
        "f": 5,
        "kcal": 516
      },
      "note": "Post-pierna: mas carbos que tras otras sesiones. Los musculos grandes necesitan mas glucogeno."
    },
    {
      "label": "Cena",
      "time": "21:00",
      "highlight": null,
      "items": [
        "220g pechuga de pavo en lonchas Lidl a la plancha con mostaza (8 min)",
        "Ensalada de tomate + lechuga iceberg + rabanos Lidl + 1 cda aceite",
        "1 yogur natural Milbona de postre"
      ],
      "macros": {
        "p": 46,
        "c": 24,
        "f": 12,
        "kcal": 380
      },
      "note": "Cena ligera post-pierna. El pavo en lonchas es la proteina mas rapida de preparar. Yogur natural como postre proteico."
    }
  ],
  [
    {
      "label": "Desayuno",
      "time": "07:30",
      "highlight": null,
      "items": [
        "4 huevos + 1 clara revueltos con tomate y albahaca (5 min)",
        "90g avena Vitafit con leche y 1.5 cda mermelada sin azucar Lidl",
        "Cafe con leche"
      ],
      "macros": {
        "p": 42,
        "c": 74,
        "f": 20,
        "kcal": 660
      },
      "note": "Variante del lunes. La mermelada sin azucar Lidl añade sabor con minimas calorias."
    },
    {
      "label": "Media manana",
      "time": "11:00",
      "highlight": null,
      "items": [
        "250g queso cottage Milbona con 1 pera en dados y canela",
        "20g almendras Lidl"
      ],
      "macros": {
        "p": 30,
        "c": 32,
        "f": 16,
        "kcal": 392
      },
      "note": "Cottage con fruta: proteina de lenta digestion + carbos complejos. Perfecto como pre-entreno lejano."
    },
    {
      "label": "Comida · Pre-entreno",
      "time": "14:00",
      "highlight": "Pre",
      "items": [
        "180g pasta integral Combino Lidl cocida (10 min)",
        "220g ternera picada magra Lidl salteada con ajo y pimenton (8 min)",
        "Esparragos trigueros a la plancha Lidl + 1 cda aceite (5 min)"
      ],
      "macros": {
        "p": 54,
        "c": 86,
        "f": 20,
        "kcal": 746
      },
      "note": "La ternera picada Lidl es creatina natural. Rapida de cocinar y con el mejor perfil aminoacidico para la sesion de fuerza."
    },
    {
      "label": "Post-entreno",
      "time": "17:30",
      "highlight": "Post",
      "items": [
        "40g proteina whey con agua",
        "1 platano",
        "1.5 tostada pan integral con mermelada sin azucar Lidl"
      ],
      "macros": {
        "p": 41,
        "c": 60,
        "f": 4,
        "kcal": 432
      },
      "note": "Ultimo post-entreno de la semana laboral. Recuperacion completa para el fin de semana."
    },
    {
      "label": "Cena",
      "time": "21:00",
      "highlight": null,
      "items": [
        "220g lomos de merluza al horno con pisto rapido: calabacin + tomate + cebolla + 1 cda aceite (12 min)",
        "1 naranja de postre"
      ],
      "macros": {
        "p": 44,
        "c": 28,
        "f": 14,
        "kcal": 444
      },
      "note": "El pisto rapido en microondas o sarten lleva 8 min. La merluza de Lidl es excelente calidad/precio."
    }
  ],
  [
    {
      "label": "Desayuno",
      "time": "07:30",
      "highlight": null,
      "items": [
        "4 huevos revueltos con jamon serrano Lidl (5 min)",
        "3 tostadas pan integral con tomate rallado y aceite oliva",
        "1 naranja exprimida"
      ],
      "macros": {
        "p": 40,
        "c": 58,
        "f": 26,
        "kcal": 646
      },
      "note": "Sabado mas tranquilo. Zumo de naranja natural para la vitamina C matutina."
    },
    {
      "label": "Media manana",
      "time": "11:00",
      "highlight": null,
      "items": [
        "250g yogur griego Milbona con 1 platano y 1.5 cucharada miel",
        "15g nueces Lidl"
      ],
      "macros": {
        "p": 22,
        "c": 42,
        "f": 10,
        "kcal": 354
      },
      "note": "Carbos moderados antes del cardio. Si el rodillo sera intenso (HIIT) puedes añadir unas fresas."
    },
    {
      "label": "Comida",
      "time": "14:00",
      "highlight": null,
      "items": [
        "250g dorada o lubina al horno con limon y romero (12 min)",
        "150g quinoa Lidl cocida con perejil y limon (12 min)",
        "Ensalada: rucula + tomate cherry + pepino + 2 cda aceite oliva"
      ],
      "macros": {
        "p": 54,
        "c": 66,
        "f": 26,
        "kcal": 712
      },
      "note": "La dorada de Lidl es excepcional. La quinoa es proteina completa vegetal con los 9 aminoacidos esenciales."
    },
    {
      "label": "Merienda",
      "time": "17:30",
      "highlight": null,
      "items": [
        "250g queso cottage Milbona",
        "1 manzana en trozos con canela",
        "10g almendras Lidl"
      ],
      "macros": {
        "p": 28,
        "c": 24,
        "f": 10,
        "kcal": 298
      },
      "note": "Merienda proteica y ligera para la tarde del sabado."
    },
    {
      "label": "Cena",
      "time": "21:00",
      "highlight": "Social",
      "items": [
        "280g salmon al horno con salsa de yogur + eneldo (12 min)",
        "Verdura asada: pimiento + cebolla + tomate Lidl + 1.5 cda aceite (10 min)",
        "1 yogur griego Milbona con frutas de temporada de postre"
      ],
      "macros": {
        "p": 56,
        "c": 34,
        "f": 32,
        "kcal": 660
      },
      "note": "Sabado: cena con mas calidad y tranquilidad. El yogur griego con fruta es el postre perfecto: proteico y refrescante."
    }
  ],
  [
    {
      "label": "Desayuno",
      "time": "08:30",
      "highlight": null,
      "items": [
        "Tortilla 4 huevos con jamon serrano Lidl y tomate (8 min)",
        "2 tostadas pan integral Lidl tostado",
        "Cafe con leche Milbona"
      ],
      "macros": {
        "p": 36,
        "c": 42,
        "f": 22,
        "kcal": 526
      },
      "note": "Domingo relajado. Desayuno sin prisa a las 8:30."
    },
    {
      "label": "Media manana",
      "time": "11:30",
      "highlight": null,
      "items": [
        "250g yogur griego Milbona con mermelada sin azucar Lidl",
        "1 puñado grande nueces Lidl"
      ],
      "macros": {
        "p": 22,
        "c": 24,
        "f": 22,
        "kcal": 386
      },
      "note": "Media manana tardia del domingo. El yogur con mermelada es rapido y sabroso."
    },
    {
      "label": "Comida",
      "time": "14:00",
      "highlight": "Social",
      "items": [
        "260g pollo entero asado Lidl (muslo + contramuslo sin piel)",
        "220g patata al horno con piel y romero + 1.5 cda aceite (15 min microondas)",
        "Ensalada verde variada Lidl",
        "1 fruta de temporada de postre"
      ],
      "macros": {
        "p": 54,
        "c": 72,
        "f": 26,
        "kcal": 730
      },
      "note": "Comida social del domingo. La patata al microondas con piel tarda 12-15 min. Un dia mas generoso en carbos no rompe el plan."
    },
    {
      "label": "Merienda",
      "time": "17:30",
      "highlight": null,
      "items": [
        "1 yogur natural Milbona Lidl",
        "1 pera o 2 kiwis",
        "10g almendras Lidl"
      ],
      "macros": {
        "p": 12,
        "c": 30,
        "f": 8,
        "kcal": 248
      },
      "note": "Merienda ligera y frutal del domingo."
    },
    {
      "label": "Cena",
      "time": "21:00",
      "highlight": null,
      "items": [
        "220g salmon o caballa en lata Nixe Lidl con ensalada templada de espinacas + garbanzos de bote (10 min)",
        "1 yogur griego Milbona de postre"
      ],
      "macros": {
        "p": 46,
        "c": 28,
        "f": 24,
        "kcal": 478
      },
      "note": "Cena rapida y proteica para cerrar el domingo. Los garbanzos + pescado es la combinacion perfecta de proteina animal y vegetal."
    }
  ]
];

export const SHOPPING: ShoppingSection[] = [
  {
    "section": "Proteinas animales",
    "emoji": "🥩",
    "items": [
      {
        "id": "s01",
        "name": "Huevos Campobello L Lidl (x18)",
        "qty": "18 uds",
        "price": "~3,50"
      },
      {
        "id": "s02",
        "name": "Pechuga de pollo fresca Lidl",
        "qty": "600g",
        "price": "~4,00"
      },
      {
        "id": "s03",
        "name": "Contramuslo de pollo sin piel Lidl",
        "qty": "400g",
        "price": "~2,50"
      },
      {
        "id": "s04",
        "name": "Ternera picada magra Lidl",
        "qty": "400g",
        "price": "~4,00"
      },
      {
        "id": "s05",
        "name": "Jamon serrano Lidl (en lonchas)",
        "qty": "200g",
        "price": "~2,50"
      },
      {
        "id": "s06",
        "name": "Jamon york / pavo pechuga Lidl",
        "qty": "200g",
        "price": "~1,80"
      },
      {
        "id": "s07",
        "name": "Salmon fresco Lidl (mostrador)",
        "qty": "400g",
        "price": "~6,00"
      },
      {
        "id": "s08",
        "name": "Merluza o bacalao lomos Lidl",
        "qty": "400g",
        "price": "~4,50"
      },
      {
        "id": "s09",
        "name": "Dorada o lubina Lidl (pieza)",
        "qty": "2 uds",
        "price": "~5,00"
      },
      {
        "id": "s10",
        "name": "Atun al natural Nixe Lidl (latas)",
        "qty": "x4",
        "price": "~3,00"
      },
      {
        "id": "s11",
        "name": "Mozarella fresca Milbona Lidl",
        "qty": "125g",
        "price": "~1,20"
      }
    ]
  },
  {
    "section": "Lacteos y huevos",
    "emoji": "🥛",
    "items": [
      {
        "id": "s12",
        "name": "Yogur griego 0% Milbona Lidl (pack)",
        "qty": "x6",
        "price": "~3,50"
      },
      {
        "id": "s13",
        "name": "Yogur natural Milbona Lidl",
        "qty": "x4",
        "price": "~1,20"
      },
      {
        "id": "s14",
        "name": "Queso cottage Milbona Lidl",
        "qty": "x2 (250g c/u)",
        "price": "~2,80"
      },
      {
        "id": "s15",
        "name": "Leche semidesnatada Milbona Lidl",
        "qty": "2L",
        "price": "~1,60"
      }
    ]
  },
  {
    "section": "Legumbres y cereales",
    "emoji": "🌾",
    "items": [
      {
        "id": "s16",
        "name": "Lentejas pardinas bote Lidl",
        "qty": "x2 botes",
        "price": "~1,60"
      },
      {
        "id": "s17",
        "name": "Garbanzos cocidos bote Lidl",
        "qty": "x2 botes",
        "price": "~1,60"
      },
      {
        "id": "s18",
        "name": "Arroz basmati largo Lidl",
        "qty": "1kg",
        "price": "~1,80"
      },
      {
        "id": "s19",
        "name": "Pasta integral Combino Lidl",
        "qty": "500g",
        "price": "~1,20"
      },
      {
        "id": "s20",
        "name": "Avena integral Vitafit Lidl",
        "qty": "500g",
        "price": "~1,30"
      },
      {
        "id": "s21",
        "name": "Quinoa Lidl",
        "qty": "400g",
        "price": "~2,50"
      },
      {
        "id": "s22",
        "name": "Pan integral Lieken Urkorn Lidl",
        "qty": "1 barra",
        "price": "~1,80"
      }
    ]
  },
  {
    "section": "Frutas y verduras",
    "emoji": "🍎",
    "items": [
      {
        "id": "s23",
        "name": "Platanos Lidl (mano)",
        "qty": "x8",
        "price": "~1,80"
      },
      {
        "id": "s24",
        "name": "Manzanas Lidl",
        "qty": "x4",
        "price": "~1,50"
      },
      {
        "id": "s25",
        "name": "Naranjas de zumo Lidl",
        "qty": "x6",
        "price": "~2,00"
      },
      {
        "id": "s26",
        "name": "Peras Lidl",
        "qty": "x4",
        "price": "~1,50"
      },
      {
        "id": "s27",
        "name": "Kiwis Lidl",
        "qty": "x4",
        "price": "~1,50"
      },
      {
        "id": "s28",
        "name": "Fruta temporada Lidl (fresas/arándanos)",
        "qty": "250g",
        "price": "~2,00"
      },
      {
        "id": "s29",
        "name": "Brocoli fresco bolsa Lidl",
        "qty": "400g",
        "price": "~1,50"
      },
      {
        "id": "s30",
        "name": "Espinacas baby bolsa Lidl",
        "qty": "200g",
        "price": "~1,50"
      },
      {
        "id": "s31",
        "name": "Tomates cherry Lidl",
        "qty": "500g",
        "price": "~2,00"
      },
      {
        "id": "s32",
        "name": "Pimiento + calabacin + cebolla Lidl",
        "qty": "surtido",
        "price": "~3,00"
      },
      {
        "id": "s33",
        "name": "Champiñones laminados Lidl",
        "qty": "250g",
        "price": "~1,50"
      },
      {
        "id": "s34",
        "name": "Aguacate Lidl",
        "qty": "x2",
        "price": "~2,00"
      },
      {
        "id": "s35",
        "name": "Rucula o lechugas variadas Lidl",
        "qty": "bolsa",
        "price": "~1,20"
      },
      {
        "id": "s36",
        "name": "Judias verdes bolsa Lidl",
        "qty": "400g",
        "price": "~1,50"
      },
      {
        "id": "s37",
        "name": "Esparragos trigueros Lidl",
        "qty": "300g",
        "price": "~1,80"
      }
    ]
  },
  {
    "section": "Grasas y condimentos",
    "emoji": "🫒",
    "items": [
      {
        "id": "s38",
        "name": "Aceite oliva virgen extra Primadonna Lidl",
        "qty": "750ml",
        "price": "~4,50"
      },
      {
        "id": "s39",
        "name": "Nueces peladas Lidl (bolsa)",
        "qty": "200g",
        "price": "~3,50"
      },
      {
        "id": "s40",
        "name": "Almendras tostadas sin sal Lidl",
        "qty": "200g",
        "price": "~3,00"
      },
      {
        "id": "s41",
        "name": "Miel Lidl (bote)",
        "qty": "500g",
        "price": "~2,50"
      },
      {
        "id": "s42",
        "name": "Mermelada sin azucar Lidl",
        "qty": "340g",
        "price": "~1,50"
      },
      {
        "id": "s43",
        "name": "Datiles Medjool Lidl (bolsa)",
        "qty": "200g",
        "price": "~2,50"
      }
    ]
  },
  {
    "section": "Extras y suplementos",
    "emoji": "💊",
    "items": [
      {
        "id": "s44",
        "name": "Proteina whey Lidl Sports / Aldi",
        "qty": "1kg",
        "price": "~20,00"
      },
      {
        "id": "s45",
        "name": "Infusion manzanilla o tila Lidl",
        "qty": "x20 sobres",
        "price": "~1,00"
      },
      {
        "id": "s46",
        "name": "Canela molida Lidl",
        "qty": "sobre",
        "price": "~0,80"
      }
    ]
  }
];

export const NUTRITION_TIPS: NutritionTip[] = [
  {
    "icon": "🛒",
    "title": "Lista semanal Lidl",
    "text": "Huevos Campobello, avena Vitafit, yogur griego Milbona, queso cottage Milbona, pechuga pollo fresca, salmón, atún Nixe, merluza, arroz basmati, pasta integral Combino, aceite oliva Primadonna, nueces, almendras, plátanos, fruta temporada."
  },
  {
    "icon": "🎯",
    "title": "Superávit mínimo",
    "text": "+150-200 kcal solo en días de entreno. Los días de descanso come un poco menos de carbos."
  },
  {
    "icon": "🥩",
    "title": "172g proteína: la clave",
    "text": "Distribuye en 5 tomas de ~35g. El yogur Milbona, cottage y huevos Lidl son tus aliados más económicos."
  },
  {
    "icon": "🔄",
    "title": "Prep dominical",
    "text": "El domingo prepara: arroz cocido para 3 días, pollo al horno para 2 días, crema de verduras. Ahorra tiempo y dinero."
  },
  {
    "icon": "⚡",
    "title": "Timing pre-entreno",
    "text": "60-90 min entre comida y entreno. El arroz basmati Lidl es el mejor combustible pre-sesión."
  },
  {
    "icon": "💰",
    "title": "Presupuesto estimado",
    "text": "Con los productos Lidl este plan cuesta aproximadamente 55-70€/semana para una persona. La proteína whey y los huevos son la mejor relación calidad-precio."
  },
  {
    "icon": "⏰",
    "title": "Días de mucho trabajo",
    "text": "Lleva al trabajo: 2 latas atún Nixe Lidl + 30g nueces + 2 piezas fruta. Mínimo esfuerzo, máxima proteína si la jornada se alarga."
  },
  {
    "icon": "💧",
    "title": "Hidratación",
    "text": "3L agua mínimo. El agua Lidl en garrafa de 5L es la opción más económica y ecológica."
  }
];


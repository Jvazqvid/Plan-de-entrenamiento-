// ============================================================================
// Nutrición: catálogo AMPLIO de comidas (Lidl España), macros objetivo, compra
// y estrategia. El pool de cada franja rota por semana y día para dar variedad
// (ver src/lib/mealPlan.ts); el usuario puede cambiar cada comida a mano.
// 60 comidas (12 por franja) con macros consistentes dentro de cada franja.
// ============================================================================

import type { Macros, Meal, MealSlot, ShoppingSection, NutritionTip } from '@/types';

/** Macros objetivo base según sea día de entreno o de descanso. */
export const MACROS_BASE: { train: Macros; rest: Macros } = {
  train: { kcal: 2750, protein: 172, carbs: 240, fat: 76 },
  rest: { kcal: 2400, protein: 172, carbs: 160, fat: 82 },
};

export const MEAL_SLOTS: MealSlot[] = [
  { id: 'desayuno', label: 'Desayuno', time: '07:30', onRestDay: true },
  { id: 'mediaManana', label: 'Media mañana', time: '11:00', onRestDay: true },
  { id: 'comida', label: 'Comida', time: '14:00', onRestDay: true },
  { id: 'postEntreno', label: 'Post-entreno', time: '17:30', onRestDay: false },
  { id: 'cena', label: 'Cena', time: '21:00', onRestDay: true },
];

/** Pool de comidas por franja. Cada combinación diaria cuadra ~con el objetivo. */
export const MEAL_POOL: Record<string, Meal[]> = {
  desayuno: [
    {
      "label": "Avena proteica con plátano y cacahuete",
      "time": "07:30",
      "highlight": null,
      "items": [
        "60 g copos de avena Crownfield con 200 ml leche semidesnatada Milbona",
        "30 g proteína whey en polvo",
        "1 plátano",
        "15 g crema de cacahuete Alesto"
      ],
      "macros": {
        "p": 43,
        "c": 70,
        "f": 20,
        "kcal": 632
      },
      "note": "Cuece la avena con la leche y añade la proteína fuera del fuego para que no se corte."
    },
    {
      "label": "Tostadas de huevo y aguacate con skyr",
      "time": "07:30",
      "highlight": null,
      "items": [
        "3 rebanadas de pan integral Lieken Urkorn",
        "3 huevos",
        "50 g aguacate",
        "150 g skyr natural Milbona"
      ],
      "macros": {
        "p": 43,
        "c": 64,
        "f": 22,
        "kcal": 626
      },
      "note": "Haz los huevos en tortilla con poco aceite y sirve el skyr aparte con un poco de canela."
    },
    {
      "label": "Tortitas de claras y avena con miel",
      "time": "07:30",
      "highlight": null,
      "items": [
        "150 g claras de huevo pasteurizadas + 2 huevos",
        "50 g copos de avena Crownfield y 1 plátano",
        "15 g miel Maribel",
        "15 g crema de cacahuete Alesto"
      ],
      "macros": {
        "p": 40,
        "c": 68,
        "f": 21,
        "kcal": 621
      },
      "note": "Tritura avena, claras, huevos y plátano y cuaja en sartén antiadherente sin aceite."
    },
    {
      "label": "Bowl de skyr, muesli y arándanos",
      "time": "07:30",
      "highlight": null,
      "items": [
        "250 g skyr natural Milbona",
        "60 g muesli Crownfield",
        "60 g arándanos y 20 g nueces Alesto",
        "15 g miel Maribel"
      ],
      "macros": {
        "p": 40,
        "c": 72,
        "f": 19,
        "kcal": 619
      },
      "note": "Monta el bowl justo antes de comer para que el muesli quede crujiente."
    },
    {
      "label": "Pan de centeno con salmón ahumado y queso batido",
      "time": "07:30",
      "highlight": null,
      "items": [
        "130 g pan de centeno Lieken Urkorn",
        "80 g salmón ahumado Deluxe",
        "150 g queso batido 0% Milbona",
        "1 huevo cocido, tomate y eneldo"
      ],
      "macros": {
        "p": 44,
        "c": 64,
        "f": 20,
        "kcal": 612
      },
      "note": "Un chorrito de limón sobre el salmón realza el sabor sin sumar calorías."
    },
    {
      "label": "Smoothie proteico de avena, plátano y fresa",
      "time": "07:30",
      "highlight": null,
      "items": [
        "30 g proteína whey + 250 ml leche semidesnatada Milbona",
        "1 plátano y 100 g fresas",
        "50 g copos de avena Crownfield",
        "15 g crema de almendra Alesto"
      ],
      "macros": {
        "p": 42,
        "c": 72,
        "f": 18,
        "kcal": 618
      },
      "note": "Bate todo con hielo; si lo quieres más espeso, congela el plátano la noche antes."
    },
    {
      "label": "Requesón con tostadas, pavo y tomate",
      "time": "07:30",
      "highlight": null,
      "items": [
        "200 g requesón Milbona",
        "3 rebanadas de pan integral Lieken Urkorn",
        "60 g pavo en lonchas Dulano",
        "1 naranja, tomate y 8 ml AOVE Baresa"
      ],
      "macros": {
        "p": 44,
        "c": 66,
        "f": 21,
        "kcal": 629
      },
      "note": "Desayuno salado ideal si no te gusta el dulce por la mañana."
    },
    {
      "label": "Porridge de manzana, canela y proteína",
      "time": "07:30",
      "highlight": null,
      "items": [
        "60 g copos de avena Crownfield con 250 ml leche semidesnatada Milbona",
        "30 g proteína whey en polvo",
        "1 manzana y canela",
        "10 g nueces Alesto"
      ],
      "macros": {
        "p": 41,
        "c": 72,
        "f": 18,
        "kcal": 614
      },
      "note": "Ralla la manzana y cuécela con la avena para un sabor tipo tarta de manzana."
    },
    {
      "label": "Tortitas de avena y plátano con skyr",
      "time": "07:30",
      "highlight": null,
      "items": [
        "60 g copos de avena Crownfield + 2 huevos + 80 g plátano",
        "150 g skyr natural Milbona",
        "10 g miel Maribel",
        "10 g nueces Alesto"
      ],
      "macros": {
        "p": 40,
        "c": 72,
        "f": 21,
        "kcal": 637
      },
      "note": "Sirve el skyr como topping en vez de nata para sumar proteína."
    },
    {
      "label": "Mollete integral con huevos revueltos y queso",
      "time": "07:30",
      "highlight": null,
      "items": [
        "1 mollete integral (90 g)",
        "3 huevos y 20 g queso curado en lonchas Milbona",
        "150 g queso batido 0% Milbona",
        "1 pieza de fruta"
      ],
      "macros": {
        "p": 44,
        "c": 60,
        "f": 23,
        "kcal": 623
      },
      "note": "Revuelve los huevos a fuego bajo para que queden cremosos sin más grasa."
    },
    {
      "label": "Skyr con granola, plátano y cacahuete",
      "time": "07:30",
      "highlight": null,
      "items": [
        "300 g skyr natural Milbona",
        "50 g granola Crownfield",
        "1 plátano",
        "18 g crema de cacahuete Alesto"
      ],
      "macros": {
        "p": 42,
        "c": 72,
        "f": 19,
        "kcal": 634
      },
      "note": "Calienta la crema de cacahuete 10 segundos y úsala como sirope."
    },
    {
      "label": "Sándwich de tortilla francesa y pavo",
      "time": "07:30",
      "highlight": null,
      "items": [
        "3 rebanadas de pan integral Lieken Urkorn",
        "2 huevos y 50 g pavo en lonchas Dulano",
        "25 g queso curado Milbona",
        "tomate y 1 pieza de fruta"
      ],
      "macros": {
        "p": 40,
        "c": 66,
        "f": 22,
        "kcal": 622
      },
      "note": "Tuesta el pan para que aguante mejor la tortilla y no se humedezca."
    }
  ],
  mediaManana: [
    {
      "label": "Yogur griego proteico con nueces y miel",
      "time": "11:00",
      "highlight": null,
      "items": [
        "200 g yogur griego proteico Milbona",
        "20 g nueces Alesto",
        "15 g miel Maribel",
        "canela"
      ],
      "macros": {
        "p": 24,
        "c": 34,
        "f": 13,
        "kcal": 349
      },
      "note": "Elige el yogur griego alto en proteínas para más saciedad con menos grasa."
    },
    {
      "label": "Tostada de crema de cacahuete y plátano",
      "time": "11:00",
      "highlight": null,
      "items": [
        "2 rebanadas de pan integral Lieken Urkorn",
        "20 g crema de cacahuete Alesto",
        "1 plátano"
      ],
      "macros": {
        "p": 20,
        "c": 38,
        "f": 14,
        "kcal": 358
      },
      "note": "Corta el plátano en rodajas sobre la tostada y espolvorea canela."
    },
    {
      "label": "Queso batido con frutos secos y uvas",
      "time": "11:00",
      "highlight": null,
      "items": [
        "200 g queso batido 0% Milbona",
        "30 g mezcla de frutos secos Alesto",
        "100 g uvas"
      ],
      "macros": {
        "p": 24,
        "c": 30,
        "f": 15,
        "kcal": 351
      },
      "note": "El queso batido aporta proteína lenta ideal para media mañana."
    },
    {
      "label": "Batido de proteína con avena y manzana",
      "time": "11:00",
      "highlight": null,
      "items": [
        "25 g proteína whey en polvo",
        "200 ml leche semidesnatada Milbona",
        "30 g copos de avena Crownfield",
        "1 manzana"
      ],
      "macros": {
        "p": 26,
        "c": 36,
        "f": 10,
        "kcal": 338
      },
      "note": "Bátelo con hielo; llévalo en botella si comes fuera de casa."
    },
    {
      "label": "Mini sándwich de pavo y queso",
      "time": "11:00",
      "highlight": null,
      "items": [
        "2 rebanadas de pan integral Lieken Urkorn",
        "60 g pavo en lonchas Dulano",
        "20 g queso curado Milbona",
        "tomate y lechuga"
      ],
      "macros": {
        "p": 25,
        "c": 32,
        "f": 13,
        "kcal": 345
      },
      "note": "Opción salada y transportable para llevar al trabajo."
    },
    {
      "label": "Requesón con miel, arándanos y tostada",
      "time": "11:00",
      "highlight": null,
      "items": [
        "150 g requesón Milbona",
        "60 g arándanos",
        "1 rebanada de pan integral Lieken Urkorn",
        "10 g miel Maribel"
      ],
      "macros": {
        "p": 23,
        "c": 36,
        "f": 12,
        "kcal": 344
      },
      "note": "El requesón es más suave que el skyr y combina genial con fruta."
    },
    {
      "label": "Skyr con granola y frambuesas",
      "time": "11:00",
      "highlight": null,
      "items": [
        "200 g skyr natural Milbona",
        "30 g granola Crownfield",
        "80 g frambuesas"
      ],
      "macros": {
        "p": 24,
        "c": 35,
        "f": 12,
        "kcal": 344
      },
      "note": "Añade la granola al momento para que no se reblandezca."
    },
    {
      "label": "Tortitas de arroz con atún y aguacate",
      "time": "11:00",
      "highlight": null,
      "items": [
        "3 tortitas de arroz Sondey",
        "1 lata de atún al natural Nixe (52 g escurrido)",
        "40 g aguacate",
        "tomate"
      ],
      "macros": {
        "p": 24,
        "c": 32,
        "f": 14,
        "kcal": 350
      },
      "note": "Machaca el aguacate como base y reparte el atún por encima."
    },
    {
      "label": "Huevos cocidos con tostada y plátano",
      "time": "11:00",
      "highlight": null,
      "items": [
        "2 huevos cocidos",
        "1 rebanada de pan integral Lieken Urkorn",
        "1 plátano"
      ],
      "macros": {
        "p": 22,
        "c": 34,
        "f": 14,
        "kcal": 350
      },
      "note": "Cuece los huevos por lotes al inicio de semana para tenerlos listos."
    },
    {
      "label": "Leche con cereales, semillas y proteína",
      "time": "11:00",
      "highlight": null,
      "items": [
        "250 ml leche semidesnatada Milbona",
        "40 g cereales integrales Crownfield",
        "15 g proteína whey en polvo",
        "10 g semillas Alesto"
      ],
      "macros": {
        "p": 23,
        "c": 38,
        "f": 11,
        "kcal": 343
      },
      "note": "Disuelve la proteína en la leche fría antes de echar los cereales."
    },
    {
      "label": "Hummus con crudités, pita y pavo",
      "time": "11:00",
      "highlight": null,
      "items": [
        "80 g hummus Freshona",
        "1 pan de pita integral",
        "zanahoria y pepino en bastones",
        "40 g pavo en lonchas Dulano"
      ],
      "macros": {
        "p": 22,
        "c": 36,
        "f": 12,
        "kcal": 340
      },
      "note": "Snack mediterráneo y saciante; unta la pita con el hummus."
    },
    {
      "label": "Yogur proteico con plátano y cacao",
      "time": "11:00",
      "highlight": null,
      "items": [
        "250 g yogur proteico Milbona",
        "1 plátano",
        "10 g cacao puro desgrasado",
        "10 g nueces Alesto"
      ],
      "macros": {
        "p": 25,
        "c": 35,
        "f": 11,
        "kcal": 339
      },
      "note": "El cacao puro da sabor a chocolate sin azúcar añadido."
    }
  ],
  comida: [
    {
      "label": "Pollo a la plancha con arroz y verduras",
      "time": "14:00",
      "highlight": null,
      "items": [
        "180 g pechuga de pollo Lidl",
        "100 g (crudo) arroz Combino",
        "200 g verduras salteadas Freshona",
        "10 ml AOVE Baresa"
      ],
      "macros": {
        "p": 53,
        "c": 88,
        "f": 17,
        "kcal": 717
      },
      "note": "Marca el pollo a fuego fuerte y termina tapado para que quede jugoso."
    },
    {
      "label": "Ternera magra con patata y ensalada",
      "time": "14:00",
      "highlight": null,
      "items": [
        "170 g filetes de ternera magra Lidl",
        "300 g patata cocida",
        "ensalada variada",
        "10 ml AOVE Baresa"
      ],
      "macros": {
        "p": 52,
        "c": 85,
        "f": 19,
        "kcal": 719
      },
      "note": "Cuece las patatas con piel para conservar más nutrientes."
    },
    {
      "label": "Salmón al horno con quinoa y espárragos",
      "time": "14:00",
      "highlight": null,
      "items": [
        "170 g salmón fresco Nixe",
        "80 g (crudo) quinoa Combino",
        "espárragos verdes",
        "limón y eneldo"
      ],
      "macros": {
        "p": 50,
        "c": 82,
        "f": 22,
        "kcal": 726
      },
      "note": "Hornea el salmón 12 min a 200 ºC para que quede en su punto."
    },
    {
      "label": "Pasta integral boloñesa de pavo",
      "time": "14:00",
      "highlight": null,
      "items": [
        "100 g (crudo) pasta integral Combino",
        "150 g carne picada de pavo Dulano",
        "200 g tomate triturado Realvalle",
        "20 g queso rallado Primadonna"
      ],
      "macros": {
        "p": 52,
        "c": 90,
        "f": 16,
        "kcal": 712
      },
      "note": "Sofríe cebolla y zanahoria para dar cuerpo a la salsa sin nata."
    },
    {
      "label": "Lentejas estofadas con arroz y verduras",
      "time": "14:00",
      "highlight": null,
      "items": [
        "150 g (escurridas) lentejas cocidas Freshona",
        "70 g (crudo) arroz Combino",
        "zanahoria, pimiento y cebolla",
        "especias Kania"
      ],
      "macros": {
        "p": 50,
        "c": 92,
        "f": 16,
        "kcal": 712
      },
      "note": "Legumbre + cereal completa el perfil de aminoácidos del plato."
    },
    {
      "label": "Pollo al curry con arroz basmati",
      "time": "14:00",
      "highlight": null,
      "items": [
        "180 g pechuga de pollo Lidl",
        "90 g (crudo) arroz basmati Combino",
        "100 ml leche de coco light Vemondo",
        "curry y cebolla"
      ],
      "macros": {
        "p": 54,
        "c": 86,
        "f": 18,
        "kcal": 722
      },
      "note": "Usa leche de coco light para el toque cremoso sin dispararte de grasa."
    },
    {
      "label": "Merluza con patata panadera y guisantes",
      "time": "14:00",
      "highlight": null,
      "items": [
        "200 g merluza Nixe",
        "300 g patata",
        "100 g guisantes Freshona",
        "10 ml AOVE Baresa"
      ],
      "macros": {
        "p": 50,
        "c": 84,
        "f": 18,
        "kcal": 698
      },
      "note": "Hornea la patata en láminas finas para que quede tipo panadera."
    },
    {
      "label": "Ensalada de pasta con atún y tomate",
      "time": "14:00",
      "highlight": null,
      "items": [
        "100 g (crudo) pasta Combino",
        "2 latas de atún al natural Nixe",
        "tomate y 100 g maíz Freshona",
        "10 ml AOVE Baresa"
      ],
      "macros": {
        "p": 52,
        "c": 88,
        "f": 18,
        "kcal": 722
      },
      "note": "Perfecta en tupper; enfríala y aliña justo antes de comer."
    },
    {
      "label": "Wok de tofu con arroz y verduras",
      "time": "14:00",
      "highlight": null,
      "items": [
        "200 g tofu natural Vemondo",
        "90 g (crudo) arroz Combino",
        "verduras para wok Freshona",
        "salsa de soja Kania y sésamo"
      ],
      "macros": {
        "p": 48,
        "c": 92,
        "f": 18,
        "kcal": 722
      },
      "note": "Dora el tofu bien antes de saltear para que quede firme y sabroso."
    },
    {
      "label": "Solomillo de cerdo con boniato y brócoli",
      "time": "14:00",
      "highlight": null,
      "items": [
        "180 g solomillo de cerdo Lidl",
        "250 g boniato al horno",
        "brócoli al vapor",
        "10 ml AOVE Baresa"
      ],
      "macros": {
        "p": 53,
        "c": 84,
        "f": 18,
        "kcal": 710
      },
      "note": "Deja reposar el solomillo 5 min tras cocinarlo antes de cortarlo."
    },
    {
      "label": "Garbanzos con pollo y arroz",
      "time": "14:00",
      "highlight": null,
      "items": [
        "120 g (escurridos) garbanzos cocidos Freshona",
        "120 g pechuga de pollo Lidl",
        "60 g (crudo) arroz Combino",
        "pimiento y tomate"
      ],
      "macros": {
        "p": 52,
        "c": 90,
        "f": 17,
        "kcal": 721
      },
      "note": "Un guiso completo tipo potaje ligero, ideal para batch cooking."
    },
    {
      "label": "Dorada al horno con patata y ensalada",
      "time": "14:00",
      "highlight": null,
      "items": [
        "1 dorada Nixe (200 g)",
        "300 g patata panadera",
        "ensalada variada",
        "limón y 10 ml AOVE Baresa"
      ],
      "macros": {
        "p": 50,
        "c": 85,
        "f": 20,
        "kcal": 720
      },
      "note": "Hornea la dorada sobre la patata para que absorba los jugos."
    }
  ],
  postEntreno: [
    {
      "label": "Batido de proteína con plátano y avena",
      "time": "17:30",
      "highlight": null,
      "items": [
        "30 g proteína whey en polvo",
        "250 ml leche desnatada Milbona",
        "1 plátano",
        "40 g copos de avena Crownfield"
      ],
      "macros": {
        "p": 43,
        "c": 58,
        "f": 6,
        "kcal": 458
      },
      "note": "Proteína rápida más carbo para reponer glucógeno tras entrenar."
    },
    {
      "label": "Skyr con arroz inflado, miel y piña",
      "time": "17:30",
      "highlight": null,
      "items": [
        "350 g skyr natural Milbona",
        "30 g arroz inflado Crownfield",
        "15 g miel Maribel",
        "100 g piña"
      ],
      "macros": {
        "p": 42,
        "c": 62,
        "f": 5,
        "kcal": 461
      },
      "note": "La piña aporta azúcares de rápida absorción para la ventana post-entreno."
    },
    {
      "label": "Pavo con pan y mermelada",
      "time": "17:30",
      "highlight": null,
      "items": [
        "100 g pavo en lonchas Dulano",
        "4 rebanadas de pan integral Lieken Urkorn",
        "20 g mermelada Maribel"
      ],
      "macros": {
        "p": 44,
        "c": 60,
        "f": 6,
        "kcal": 470
      },
      "note": "Combo salado-dulce muy digestivo y bajo en grasa."
    },
    {
      "label": "Tortitas de arroz con claras y mermelada",
      "time": "17:30",
      "highlight": null,
      "items": [
        "200 g claras de huevo pasteurizadas",
        "3 tortitas de arroz Sondey",
        "1 plátano y 20 g mermelada Maribel",
        "15 g proteína whey en polvo"
      ],
      "macros": {
        "p": 43,
        "c": 60,
        "f": 5,
        "kcal": 457
      },
      "note": "Cuaja las claras en tortilla y móntalas sobre las tortitas."
    },
    {
      "label": "Yogur proteico con cereales y frutos rojos",
      "time": "17:30",
      "highlight": null,
      "items": [
        "400 g yogur proteico Milbona",
        "40 g cereales integrales Crownfield",
        "80 g frutos rojos"
      ],
      "macros": {
        "p": 42,
        "c": 60,
        "f": 6,
        "kcal": 462
      },
      "note": "Rápido y sin cocinar; ideal si entrenas y tienes poco tiempo."
    },
    {
      "label": "Sándwich de atún sin mayonesa",
      "time": "17:30",
      "highlight": null,
      "items": [
        "2 latas de atún al natural Nixe",
        "4 rebanadas de pan integral Lieken Urkorn",
        "tomate y lechuga"
      ],
      "macros": {
        "p": 44,
        "c": 58,
        "f": 7,
        "kcal": 471
      },
      "note": "Aliña con limón y mostaza en vez de mayonesa para no sumar grasa."
    },
    {
      "label": "Batido de whey con dátiles, plátano y skyr",
      "time": "17:30",
      "highlight": null,
      "items": [
        "25 g proteína whey + 250 ml leche desnatada Milbona",
        "1 plátano y 3 dátiles",
        "150 g skyr natural Milbona"
      ],
      "macros": {
        "p": 43,
        "c": 62,
        "f": 5,
        "kcal": 465
      },
      "note": "Los dátiles endulzan de forma natural y suman carbos rápidos."
    },
    {
      "label": "Boniato con pollo desmechado",
      "time": "17:30",
      "highlight": null,
      "items": [
        "130 g pechuga de pollo Lidl",
        "300 g boniato cocido",
        "especias Kania"
      ],
      "macros": {
        "p": 44,
        "c": 60,
        "f": 6,
        "kcal": 470
      },
      "note": "Cocina el pollo a la plancha y desméchalo para que se integre bien."
    },
    {
      "label": "Queso batido con arroz con leche y miel",
      "time": "17:30",
      "highlight": null,
      "items": [
        "250 g queso batido 0% Milbona",
        "60 g (cocido) arroz Combino",
        "15 g miel Maribel",
        "canela"
      ],
      "macros": {
        "p": 42,
        "c": 62,
        "f": 5,
        "kcal": 461
      },
      "note": "Mezcla el arroz cocido frío con el queso batido para una textura cremosa."
    },
    {
      "label": "Gofre proteico con plátano y arándanos",
      "time": "17:30",
      "highlight": null,
      "items": [
        "25 g proteína whey + 40 g copos de avena Crownfield",
        "200 g claras de huevo pasteurizadas",
        "1 plátano y 80 g arándanos"
      ],
      "macros": {
        "p": 44,
        "c": 58,
        "f": 6,
        "kcal": 462
      },
      "note": "Tritura y cuaja en gofrera o sartén; corona con la fruta."
    },
    {
      "label": "Claras con patata y pavo",
      "time": "17:30",
      "highlight": null,
      "items": [
        "200 g claras de huevo pasteurizadas",
        "300 g patata cocida",
        "80 g pavo en lonchas Dulano",
        "100 g maíz dulce Freshona"
      ],
      "macros": {
        "p": 44,
        "c": 60,
        "f": 5,
        "kcal": 461
      },
      "note": "Opción salada post-entreno con carbo de absorción media-rápida."
    },
    {
      "label": "Batido con pan de centeno y pavo",
      "time": "17:30",
      "highlight": null,
      "items": [
        "batido de 25 g proteína whey + 250 ml leche desnatada Milbona",
        "2 rebanadas de pan de centeno Lieken Urkorn",
        "70 g pavo en lonchas Dulano",
        "15 g mermelada Maribel"
      ],
      "macros": {
        "p": 43,
        "c": 58,
        "f": 6,
        "kcal": 458
      },
      "note": "Toma primero el batido y a los pocos minutos el sólido."
    }
  ],
  cena: [
    {
      "label": "Salmón a la plancha con ensalada y aguacate",
      "time": "21:00",
      "highlight": null,
      "items": [
        "180 g salmón fresco Nixe",
        "ensalada verde variada",
        "60 g aguacate",
        "10 ml AOVE Baresa"
      ],
      "macros": {
        "p": 47,
        "c": 22,
        "f": 30,
        "kcal": 546
      },
      "note": "Grasas saludables por la noche que sacian sin cargar de carbohidratos."
    },
    {
      "label": "Tortilla de espinacas y queso con pavo",
      "time": "21:00",
      "highlight": null,
      "items": [
        "4 huevos",
        "150 g espinacas frescas Freshona",
        "40 g queso curado Milbona",
        "60 g pavo en lonchas Dulano"
      ],
      "macros": {
        "p": 50,
        "c": 24,
        "f": 27,
        "kcal": 539
      },
      "note": "Saltea las espinacas antes para eliminar el agua y que cuaje mejor."
    },
    {
      "label": "Revuelto de gambas y champiñones con aguacate",
      "time": "21:00",
      "highlight": null,
      "items": [
        "150 g gambas peladas Nixe",
        "3 huevos",
        "champiñones laminados",
        "50 g aguacate"
      ],
      "macros": {
        "p": 48,
        "c": 24,
        "f": 28,
        "kcal": 540
      },
      "note": "Saltea las gambas con ajo antes de añadir el huevo batido."
    },
    {
      "label": "Caballa con ensalada mediterránea y feta",
      "time": "21:00",
      "highlight": null,
      "items": [
        "2 latas de caballa Nixe",
        "ensalada de tomate y pepino",
        "40 g queso feta Milbona",
        "aceitunas Baresa"
      ],
      "macros": {
        "p": 46,
        "c": 26,
        "f": 28,
        "kcal": 540
      },
      "note": "La caballa es rica en omega-3 y muy práctica de conserva."
    },
    {
      "label": "Pollo al horno con verduras asadas y almendras",
      "time": "21:00",
      "highlight": null,
      "items": [
        "170 g pechuga de pollo Lidl",
        "verduras asadas (pimiento, calabacín, cebolla)",
        "20 g almendras Alesto",
        "10 ml AOVE Baresa"
      ],
      "macros": {
        "p": 50,
        "c": 26,
        "f": 26,
        "kcal": 538
      },
      "note": "Asa todo junto en una bandeja para ensuciar un solo recipiente."
    },
    {
      "label": "Tofu salteado con verduras y anacardos",
      "time": "21:00",
      "highlight": null,
      "items": [
        "200 g tofu natural Vemondo",
        "verduras para wok Freshona",
        "20 g anacardos Alesto",
        "salsa de soja Kania y sésamo"
      ],
      "macros": {
        "p": 46,
        "c": 28,
        "f": 27,
        "kcal": 539
      },
      "note": "Marca el tofu en dados hasta dorar antes de añadir la verdura."
    },
    {
      "label": "Mejillones con ensalada templada y huevo",
      "time": "21:00",
      "highlight": null,
      "items": [
        "250 g mejillones al natural Nixe",
        "2 huevos",
        "ensalada con 1 patata pequeña",
        "10 ml AOVE Baresa"
      ],
      "macros": {
        "p": 47,
        "c": 25,
        "f": 27,
        "kcal": 531
      },
      "note": "Los mejillones al vapor con limón son una cena proteica exprés."
    },
    {
      "label": "Hamburguesa de ternera con queso y ensalada",
      "time": "21:00",
      "highlight": null,
      "items": [
        "180 g hamburguesa de ternera Lidl",
        "30 g queso curado Milbona",
        "ensalada y tomate",
        "sin pan"
      ],
      "macros": {
        "p": 50,
        "c": 22,
        "f": 28,
        "kcal": 540
      },
      "note": "Sírvela sin pan y con ensalada para bajar el carbo de la noche."
    },
    {
      "label": "Merluza al horno con pisto y almendras",
      "time": "21:00",
      "highlight": null,
      "items": [
        "200 g merluza Nixe",
        "150 g pisto de verduras Freshona",
        "15 ml AOVE Baresa",
        "10 g almendras Alesto"
      ],
      "macros": {
        "p": 48,
        "c": 26,
        "f": 26,
        "kcal": 530
      },
      "note": "Cocina la merluza sobre el pisto para que quede jugosa y sabrosa."
    },
    {
      "label": "Ensalada de atún, huevo, queso batido y aguacate",
      "time": "21:00",
      "highlight": null,
      "items": [
        "2 latas de atún al natural Nixe",
        "2 huevos cocidos",
        "200 g queso batido 0% Milbona",
        "40 g aguacate y verduras"
      ],
      "macros": {
        "p": 48,
        "c": 24,
        "f": 28,
        "kcal": 540
      },
      "note": "Usa el queso batido con limón y mostaza como aliño cremoso proteico."
    },
    {
      "label": "Pavo a la plancha con guacamole y queso",
      "time": "21:00",
      "highlight": null,
      "items": [
        "180 g filetes de pavo Dulano",
        "80 g guacamole casero (aguacate)",
        "30 g queso curado Milbona",
        "ensalada"
      ],
      "macros": {
        "p": 50,
        "c": 24,
        "f": 27,
        "kcal": 539
      },
      "note": "Prepara el guacamole con limón, tomate y cebolla picada."
    },
    {
      "label": "Brocheta de pollo con salsa de yogur y nueces",
      "time": "21:00",
      "highlight": null,
      "items": [
        "170 g pechuga de pollo Lidl",
        "pimientos y cebolla",
        "150 g yogur griego Milbona",
        "20 g nueces Alesto y AOVE Baresa"
      ],
      "macros": {
        "p": 50,
        "c": 25,
        "f": 26,
        "kcal": 534
      },
      "note": "Mezcla el yogur con ajo y hierbas para una salsa tipo tzatziki."
    }
  ],
};

export const SHOPPING: ShoppingSection[] = [
  {
    "section": "Proteínas animales",
    "emoji": "🥩",
    "items": [
      {
        "id": "s01",
        "name": "Pechuga de pollo Lidl",
        "qty": "1 kg",
        "price": "~5,99"
      },
      {
        "id": "s02",
        "name": "Filetes de pavo Dulano",
        "qty": "700 g",
        "price": "~4,49"
      },
      {
        "id": "s03",
        "name": "Pavo en lonchas Dulano",
        "qty": "2x120 g",
        "price": "~2,49"
      },
      {
        "id": "s04",
        "name": "Filetes de ternera magra Lidl",
        "qty": "500 g",
        "price": "~6,49"
      },
      {
        "id": "s05",
        "name": "Solomillo de cerdo Lidl",
        "qty": "500 g",
        "price": "~4,99"
      },
      {
        "id": "s06",
        "name": "Carne picada de pavo Dulano",
        "qty": "500 g",
        "price": "~3,49"
      },
      {
        "id": "s07",
        "name": "Hamburguesa de ternera Lidl",
        "qty": "2x180 g",
        "price": "~3,29"
      },
      {
        "id": "s08",
        "name": "Salmón fresco Nixe",
        "qty": "2 lomos (250 g)",
        "price": "~4,99"
      },
      {
        "id": "s09",
        "name": "Merluza congelada Nixe",
        "qty": "400 g",
        "price": "~4,29"
      },
      {
        "id": "s10",
        "name": "Dorada Nixe",
        "qty": "2 uds",
        "price": "~3,99"
      },
      {
        "id": "s11",
        "name": "Atún al natural Nixe",
        "qty": "pack 3x52 g",
        "price": "~2,29"
      },
      {
        "id": "s12",
        "name": "Caballa en aceite Nixe",
        "qty": "2x120 g",
        "price": "~1,99"
      },
      {
        "id": "s13",
        "name": "Gambas peladas congeladas Nixe",
        "qty": "400 g",
        "price": "~5,49"
      },
      {
        "id": "s14",
        "name": "Mejillones al natural Nixe",
        "qty": "250 g",
        "price": "~1,79"
      }
    ]
  },
  {
    "section": "Lácteos y huevos",
    "emoji": "🥚",
    "items": [
      {
        "id": "s15",
        "name": "Skyr natural Milbona",
        "qty": "450 g",
        "price": "~1,69"
      },
      {
        "id": "s16",
        "name": "Yogur griego proteico Milbona",
        "qty": "pack 4 uds",
        "price": "~2,49"
      },
      {
        "id": "s17",
        "name": "Yogur proteico bebible Milbona",
        "qty": "pack 4 uds",
        "price": "~2,29"
      },
      {
        "id": "s18",
        "name": "Queso batido 0% Milbona",
        "qty": "500 g",
        "price": "~1,29"
      },
      {
        "id": "s19",
        "name": "Requesón Milbona",
        "qty": "250 g",
        "price": "~1,49"
      },
      {
        "id": "s20",
        "name": "Leche semidesnatada Milbona",
        "qty": "6x1 L",
        "price": "~4,80"
      },
      {
        "id": "s21",
        "name": "Leche desnatada Milbona",
        "qty": "6x1 L",
        "price": "~4,80"
      },
      {
        "id": "s22",
        "name": "Huevos M",
        "qty": "docena",
        "price": "~2,19"
      },
      {
        "id": "s23",
        "name": "Claras de huevo pasteurizadas",
        "qty": "1 kg",
        "price": "~3,49"
      },
      {
        "id": "s24",
        "name": "Queso feta Milbona",
        "qty": "200 g",
        "price": "~1,79"
      },
      {
        "id": "s25",
        "name": "Queso curado en lonchas Milbona",
        "qty": "200 g",
        "price": "~2,29"
      },
      {
        "id": "s26",
        "name": "Salmón ahumado Deluxe",
        "qty": "100 g",
        "price": "~2,49"
      },
      {
        "id": "s27",
        "name": "Queso rallado Primadonna",
        "qty": "cuña 150 g",
        "price": "~2,99"
      }
    ]
  },
  {
    "section": "Legumbres y cereales",
    "emoji": "🌾",
    "items": [
      {
        "id": "s28",
        "name": "Copos de avena Crownfield",
        "qty": "1 kg",
        "price": "~1,09"
      },
      {
        "id": "s29",
        "name": "Muesli / granola Crownfield",
        "qty": "750 g",
        "price": "~1,99"
      },
      {
        "id": "s30",
        "name": "Cereales integrales Crownfield",
        "qty": "500 g",
        "price": "~1,49"
      },
      {
        "id": "s31",
        "name": "Arroz redondo / basmati Combino",
        "qty": "1 kg",
        "price": "~1,29"
      },
      {
        "id": "s32",
        "name": "Quinoa Combino",
        "qty": "500 g",
        "price": "~2,49"
      },
      {
        "id": "s33",
        "name": "Pasta integral Combino",
        "qty": "500 g",
        "price": "~0,99"
      },
      {
        "id": "s34",
        "name": "Pan integral Lieken Urkorn",
        "qty": "500 g",
        "price": "~1,39"
      },
      {
        "id": "s35",
        "name": "Pan de centeno Lieken Urkorn",
        "qty": "500 g",
        "price": "~1,49"
      },
      {
        "id": "s36",
        "name": "Molletes / pan de pita integral",
        "qty": "pack 4 uds",
        "price": "~1,19"
      },
      {
        "id": "s37",
        "name": "Lentejas cocidas Freshona",
        "qty": "570 g",
        "price": "~0,89"
      },
      {
        "id": "s38",
        "name": "Garbanzos cocidos Freshona",
        "qty": "570 g",
        "price": "~0,79"
      },
      {
        "id": "s39",
        "name": "Tortitas de arroz Sondey",
        "qty": "130 g",
        "price": "~0,79"
      },
      {
        "id": "s40",
        "name": "Tofu natural Vemondo",
        "qty": "2x200 g",
        "price": "~1,79"
      },
      {
        "id": "s41",
        "name": "Hummus Freshona",
        "qty": "200 g",
        "price": "~1,49"
      }
    ]
  },
  {
    "section": "Frutas y verduras",
    "emoji": "🥦",
    "items": [
      {
        "id": "s42",
        "name": "Plátanos",
        "qty": "1 kg",
        "price": "~1,29"
      },
      {
        "id": "s43",
        "name": "Manzanas",
        "qty": "1 kg",
        "price": "~1,49"
      },
      {
        "id": "s44",
        "name": "Naranjas",
        "qty": "malla 2 kg",
        "price": "~2,29"
      },
      {
        "id": "s45",
        "name": "Arándanos",
        "qty": "125 g",
        "price": "~1,79"
      },
      {
        "id": "s46",
        "name": "Frutos rojos / frambuesas",
        "qty": "125 g",
        "price": "~1,99"
      },
      {
        "id": "s47",
        "name": "Fresas",
        "qty": "500 g",
        "price": "~1,99"
      },
      {
        "id": "s48",
        "name": "Aguacate",
        "qty": "2 uds",
        "price": "~1,69"
      },
      {
        "id": "s49",
        "name": "Tomates",
        "qty": "1 kg",
        "price": "~1,49"
      },
      {
        "id": "s50",
        "name": "Espinacas frescas Freshona",
        "qty": "bolsa 300 g",
        "price": "~1,29"
      },
      {
        "id": "s51",
        "name": "Brócoli",
        "qty": "500 g",
        "price": "~1,19"
      },
      {
        "id": "s52",
        "name": "Verduras para wok congeladas Freshona",
        "qty": "1 kg",
        "price": "~1,79"
      },
      {
        "id": "s53",
        "name": "Boniato",
        "qty": "1 kg",
        "price": "~1,69"
      },
      {
        "id": "s54",
        "name": "Patatas",
        "qty": "malla 2 kg",
        "price": "~1,49"
      },
      {
        "id": "s55",
        "name": "Ensalada mixta en bolsa",
        "qty": "250 g",
        "price": "~1,29"
      }
    ]
  },
  {
    "section": "Grasas y frutos secos",
    "emoji": "🥜",
    "items": [
      {
        "id": "s56",
        "name": "Aceite de oliva virgen extra Baresa",
        "qty": "1 L",
        "price": "~6,99"
      },
      {
        "id": "s57",
        "name": "Crema de cacahuete Alesto",
        "qty": "500 g",
        "price": "~2,29"
      },
      {
        "id": "s58",
        "name": "Crema de almendra Alesto",
        "qty": "300 g",
        "price": "~3,49"
      },
      {
        "id": "s59",
        "name": "Almendras crudas Alesto",
        "qty": "200 g",
        "price": "~1,99"
      },
      {
        "id": "s60",
        "name": "Nueces Alesto",
        "qty": "200 g",
        "price": "~2,49"
      },
      {
        "id": "s61",
        "name": "Anacardos Alesto",
        "qty": "200 g",
        "price": "~2,79"
      },
      {
        "id": "s62",
        "name": "Mezcla de frutos secos Alesto",
        "qty": "200 g",
        "price": "~2,29"
      },
      {
        "id": "s63",
        "name": "Semillas de chía/lino/girasol Alesto",
        "qty": "200 g",
        "price": "~1,79"
      },
      {
        "id": "s64",
        "name": "Aceitunas Baresa",
        "qty": "350 g",
        "price": "~1,49"
      },
      {
        "id": "s65",
        "name": "Leche de coco light Vemondo",
        "qty": "400 ml",
        "price": "~1,19"
      },
      {
        "id": "s66",
        "name": "Dátiles",
        "qty": "250 g",
        "price": "~1,99"
      }
    ]
  },
  {
    "section": "Extras y suplementos",
    "emoji": "🧂",
    "items": [
      {
        "id": "s67",
        "name": "Proteína whey en polvo",
        "qty": "bote 1 kg",
        "price": "~14,99"
      },
      {
        "id": "s68",
        "name": "Miel Maribel",
        "qty": "500 g",
        "price": "~3,49"
      },
      {
        "id": "s69",
        "name": "Mermelada Maribel",
        "qty": "340 g",
        "price": "~1,49"
      },
      {
        "id": "s70",
        "name": "Tomate frito Realvalle",
        "qty": "725 g",
        "price": "~1,29"
      },
      {
        "id": "s71",
        "name": "Tomate triturado Realvalle",
        "qty": "400 g",
        "price": "~0,55"
      },
      {
        "id": "s72",
        "name": "Salsa de soja Kania",
        "qty": "150 ml",
        "price": "~0,99"
      },
      {
        "id": "s73",
        "name": "Caldo de verduras Kania",
        "qty": "1 L",
        "price": "~0,99"
      },
      {
        "id": "s74",
        "name": "Especias variadas Kania",
        "qty": "bote",
        "price": "~0,69"
      },
      {
        "id": "s75",
        "name": "Cacao puro desgrasado",
        "qty": "250 g",
        "price": "~2,49"
      },
      {
        "id": "s76",
        "name": "Maíz dulce Freshona",
        "qty": "pack 3x140 g",
        "price": "~1,29"
      },
      {
        "id": "s77",
        "name": "Guisantes Freshona",
        "qty": "560 g",
        "price": "~0,99"
      },
      {
        "id": "s78",
        "name": "Pisto de verduras Freshona",
        "qty": "400 g",
        "price": "~1,29"
      },
      {
        "id": "s79",
        "name": "Arroz inflado Crownfield",
        "qty": "200 g",
        "price": "~1,49"
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

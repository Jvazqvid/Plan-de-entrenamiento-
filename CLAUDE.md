# Fuerza — App de entrenamiento de fuerza

## Qué es

PWA (React + TypeScript + Vite) de entrenamiento de fuerza personal. Gestiona un
mesociclo de 5 semanas con periodización ondulante (semana 5 = descarga), 5 sesiones
tipo (A=PUSH, B=PULL, C=LEGS, D=UPPER, E=CARDIO), progresión de carga **autorregulada
por RIR** (doble progresión) según historial y disposición, calentamiento integrado con
series de aproximación, nutrición adaptativa al TDEE, y una **Guía técnica** con la
metodología y la técnica de ejercicios extraídas de la biblioteca de fuerza.

Pestañas: **Hoy** (dashboard: sesión del día, racha, volumen, récords), **Entreno**
(plan del mesociclo), **Progreso** (1RM, heatmap de constancia, medidas, historial por
ejercicio editable), **Nutrición** y **Guía**. Además: récords personales (PRs) con
badges en sesión, modo kiosco, registro de molestias, calculadora de 1RM, export
JSON/CSV, ajustes de timer (sonido/vibración/auto-start), y añadir ejercicios extra.

Es la reescritura desde cero del antiguo monolito HTML de Javier (cirujano ortopédico,
Sevilla). Los datos de entrenamiento y nutrición se migraron tal cual como punto de
partida — **se irán modificando mucho**; no son la versión final.

## Cómo trabajar aquí

```bash
npm install       # instalar dependencias
npm run dev       # servidor de desarrollo
npm run build     # typecheck (tsc --noEmit) + build de producción + PWA
npm test          # tests de lógica (smoke.test.ts) + flujo de UI (mount.test.tsx)
npm run typecheck # solo tipos
```

`npm test` es una red de seguridad barata: cubre 1RM, sugerencia de peso, filtrado por
variante de semana, TDEE, coach, y el flujo real de sesión (montar → calentar →
entrenar → guardar → veredicto → historial). **Corre `npm test` antes de dar por
buena cualquier cosa que toque `src/lib` o `src/store`.**

## Arquitectura

```
src/
├── types.ts              ← modelo de datos central (un tipo por concepto)
├── data/                 ← datos semilla (GENERADOS del legado; ver nota abajo)
│   ├── sessions.ts       · 5 sesiones + accesorios extra por semana (variedad), IDs estables
│   ├── warmups.ts        · calentamientos + variación semanal
│   ├── stretches.ts      · movilidad post-sesión
│   ├── catalog.ts        · catálogo por grupo muscular
│   ├── schedule.ts       · plantilla semanal + constantes del mesociclo
│   ├── methods.ts        · métodos de intensidad (superseries, dropset…) + asignación por semana
│   ├── nutrition.ts      · POOL de 60 comidas Lidl (12/franja) + macros + compra + tips
│   ├── methodology.ts    · tablas de la Guía (de docs/metodologia-fuerza.md)
│   └── technique.ts      · cues por ejercicio (de docs/tecnica-ejercicios.md)
├── lib/                  ← lógica pura, testeable
│   ├── oneRepMax.ts      · Epley — ÚNICO punto de cálculo de 1RM
│   ├── exercises.ts      · filtrado por variante, claves de historial, RIR por semana
│   ├── progression.ts    · sugerencia de peso RIR-aware + detección de estancamiento
│   ├── records.ts        · récords personales (PRs) y PRs de la semana
│   ├── tools.ts          · series de aproximación (warm-up ramp) + racha de constancia
│   ├── tdee.ts           · ajuste de macros por tendencia de peso
│   ├── coach.ts          · análisis post-sesión heurístico LOCAL (ampliable a IA)
│   ├── stats.ts          · derivados para Progreso (1RM, volumen, heatmap, CSV)
│   ├── mealPlan.ts       · rotación del pool de comidas por semana/día + swap
│   ├── format.ts, sound.ts
├── store/useStore.ts     ← Zustand + persist. UN store, migraciones versionadas (v2).
├── hooks/useRestTimer.ts ← timer de descanso (pitidos + vibración) + cronómetro
└── components/           ← UI por pestaña (home · plan · progress · nutrition · guide · session)
```

### Regenerar los datos semilla

Los `src/data/*.ts` de entrenamiento/nutrición se generaron desde el HTML legado con un
script puntual. Ya son ficheros normales editables — edítalos a mano de aquí en adelante.
No hay que regenerarlos; el script de extracción fue de un solo uso.

## Reglas de oro (por qué el modelo evita los bugs del legado)

Estas trampas costaron sesiones enteras de depuración en el monolito. El modelo nuevo las
evita **por diseño**; no las reintroduzcas. Detalle en `docs/decisiones-datos.md`.

1. **IDs estables.** Cada ejercicio tiene un `id` propio; el historial se indexa por
   `` `${sessionId}:${exerciseId}` `` (`historyKey`), nunca por índice posicional/filtrado.
2. **Upsert por fecha.** Guardar dos veces el mismo día **reemplaza**, no duplica
   (`upsertHistory` en el store). Evita falsos "3 sesiones sin progresar".
3. **1RM en un solo sitio.** `epley()` en `oneRepMax.ts`; todas las vistas lo consumen de
   ahí. Siempre desde el **peso máximo** de la serie top, nunca la media.
4. **Estancamiento por máximo Y media.** El deload solo se sugiere si ambos están
   estancados en 3 sesiones (`isStalled` / `suggestWeight`).
5. **Input en blanco ≠ cero.** `active.touched` separa "tocado" de "sugerido"; el input
   está vacío hasta que el usuario escribe.
6. **Persistencia = estado completo.** `persist` escribe todo el estado (merge por diseño);
   nunca reconstruimos el objeto a mano. Imposible perder campos.
7. **Migraciones síncronas y versionadas** vía `persist({ version, migrate })`.
8. **Reps: misma clave para leer y escribir** (`active.reps`).

## Convenciones

- Español en UI, comentarios y nombres de dominio; inglés en identificadores técnicos.
- Componentes pequeños; la lógica vive en `src/lib` (pura y testeada), no en la UI.
- Al añadir lógica de dominio, añade un caso en `smoke.test.ts`.
- **Cuidado con los selectores de Zustand:** nunca devuelvas un objeto/array nuevo desde
  un selector (`s.x ?? []`) — provoca un bucle infinito de renders. Usa una referencia
  estable (constante `EMPTY`) o selecciona el contenedor y deriva con `useMemo`.
- PWA: se despliega como estático (Vercel u otro). Funciona offline con localStorage.

## Base técnica

La metodología (RIR, %1RM, volumen MEV/MAV/MRV, descanso, periodización, descarga) y la
técnica por ejercicio están en `docs/metodologia-fuerza.md` y `docs/tecnica-ejercicios.md`,
extraídas de los libros de la carpeta `Musculación` (Balsalobre, González-Badillo,
Carrasco, Vinuesa, Delavier). La pestaña **Guía** las muestra en la app.

## Fuente de verdad de comportamiento

`docs/especificacion-funcional.md` describe qué debe seguir haciendo la app, feature por
feature. Si cambias comportamiento a propósito, actualiza ese documento.

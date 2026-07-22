# Fuerza 🏋️

App de entrenamiento de fuerza personal: mesociclo de 5 semanas periodizado, progresión
de carga autorregulada, nutrición adaptada al TDEE y una guía técnica basada en
bibliografía de entrenamiento de fuerza. Funciona como PWA instalable y sin conexión.

## Arranque rápido

```bash
npm install
npm run dev      # abre http://localhost:5173
```

Para producción:

```bash
npm run build    # genera dist/ (PWA lista para desplegar en Vercel u otro estático)
npm run preview  # sirve el build localmente
npm test         # tests de lógica y de flujo de UI
```

## Qué hace

- **Hoy** — dashboard: la sesión de hoy con un toque para empezar, tu racha de constancia,
  las sesiones y series de la semana, récords recientes y tu peso corporal.
- **Entreno** — plan del mesociclo (A·PUSH / B·PULL / C·LEGS / D·UPPER / E·CARDIO),
  selección de semana (la 5ª es descarga), **vista previa de cada sesión** antes de
  empezar, **método de intensidad destacado por semana** (superseries, dropset,
  rest-pause, myo-reps…) para variar el estímulo, sesión activa con calentamiento y
  series de aproximación, **sugerencia de peso autorregulada por RIR** (doble progresión),
  RIR por serie, cronómetro con avisos y vibración, modo kiosco, añadir ejercicios extra y
  registro de molestias. Récords (PR) en directo. Al guardar, un coach local te da un veredicto.
- **Progreso** — 1RM estimado por básico con tendencia y proyección, heatmap de constancia,
  peso corporal, medidas, volumen por grupo, comparativa semanal, e historial por ejercicio
  editable con sus récords. Export JSON/CSV, import y ajustes.
- **Nutrición** — **catálogo de 60 comidas Lidl** (12 por franja) que rota cada semana
  para no repetir; puedes **cambiar cada comida** entre sus alternativas. Objetivo de
  macros del día (ajustado por TDEE si hay historial de peso), comida destacada según la
  hora, progreso de macros, estrategia y lista de la compra.
- **Guía** — **glosario buscable** (qué significa cada sigla e icono: RIR, 1RM, PR, TDEE…),
  calculadora de 1RM y metodología (RIR, %1RM, volumen, descanso, periodización) y técnica por
  ejercicio, extraídas de la biblioteca de fuerza.

Cada abreviatura o icono **subrayado** en la app se puede **tocar** para ver, sin salir de la
pantalla, qué significa y para qué sirve.

## Datos

Todo se guarda en tu dispositivo (localStorage), funciona offline y es exportable a JSON.
No hay backend ni cuentas.

## Documentación

- `CLAUDE.md` — arquitectura y reglas de trabajo para desarrollo.
- `docs/especificacion-funcional.md` — comportamiento esperado, feature por feature.
- `docs/decisiones-datos.md` — decisiones del modelo de datos y bugs a no reintroducir.
- `docs/metodologia-fuerza.md` · `docs/tecnica-ejercicios.md` — base técnica y sus fuentes.

## Stack

React 18 · TypeScript · Vite · Zustand (persist) · vite-plugin-pwa. Sin dependencias de UI
pesadas: los gráficos son SVG propios.

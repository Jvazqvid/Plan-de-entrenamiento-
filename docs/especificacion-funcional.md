# Especificación funcional — qué hace la app hoy

Esta es la fuente de verdad de comportamiento. Cualquier reimplementación debe
preservar esto salvo que Javier decida explícitamente cambiarlo.

## Estructura general

Tres pestañas: **Entreno** (plan semanal + sesión activa), **Progreso** (historial,
1RM, gráficos), **Nutrición** (comidas del día, macros, lista de la compra).

Mesociclo de 5 semanas con periodización ondulante. Semanas 1-4 progresión normal,
semana 5 = deload (descarga, -40% de carga). 5 sesiones tipo: A=PUSH, B=PULL, C=LEGS,
D=UPPER, E=CARDIO. El calendario semanal (`Sn`) define qué sesión toca cada día.

## Sesión de entrenamiento

**Variación por semana:** cada ejercicio tiene un `variant` (`base`, `S1S3`, `S2S4`, `S5`).
Los `base` aparecen siempre; los demás solo en las semanas indicadas. Esto hace que el
mismo "día A" tenga ejercicios accesorios distintos según la semana, manteniendo los
compuestos principales constantes.

**Empezar sesión:** al pulsar "Empezar" se abre un modal "¿Cómo llegas hoy?" con tres
opciones (Fresco/Normal/Cansado) que ajustan el peso sugerido (±% multiplicador) y el
tiempo de descanso. Al confirmar:
1. Arranca el cronómetro de la sesión (persiste como timestamp de inicio).
2. Si la sesión tiene calentamiento definido, se muestra **primero** una pantalla de
   calentamiento (dentro del mismo flujo, con el cronómetro ya corriendo) con los pasos,
   y un botón "Continuar al entreno →" (o "Saltar calentamiento").
3. Tras el calentamiento (o directamente si no aplica), se muestran los ejercicios.

**Reabrir sesión ya completada:** va directa a los ejercicios, sin repetir el calentamiento,
y muestra los pesos ya registrados (no en blanco).

**Calentamiento:** pasos específicos por sesión (movilidad, activación). A partir de la
semana 2, un paso rota semanalmente con una variación alternativa (mismo grupo muscular,
ejercicio distinto) para evitar monotonía.

**Cada ejercicio muestra:**
- Nombre, número de series, reps objetivo, tiempo de descanso.
- Una nota/tip de ejecución.
- 1RM estimado (fórmula de Epley: `peso_max_top_set * (1 + reps/30)`), coherente en
  todas las vistas (cabecera del ejercicio, flechas de tendencia, vista de Progreso).
- Una sugerencia de peso con icono y motivo (ej: "↑ 40kg · Mismo peso medio. Sube 2.5kg
  esta sesión" / "🎯 37.5kg · Repite el peso de la última sesión" / "↓ 35kg · 3 sesiones
  sin progresar. Baja 5% y resetea").
- Tendencia de 1RM de las últimas sesiones (flechas ↑/↓/= comparando el 1RM estimado
  entrada a entrada, usando el historial **de ese ejercicio concreto**).

**Cada serie:**
- Input de peso: aparece **en blanco** ("—") hasta que el usuario lo toca, con el peso
  recomendado mostrado en pequeño debajo del número de serie (💡 40 kg). Al tocarlo se
  activa visualmente.
- Input de reps opcional junto al peso.
- Botones +/- de incremento rápido según el `step` del ejercicio (normalmente 2.5kg).

**Timer de descanso entre series:** al marcar una serie, arranca un cronómetro de
descanso. Es un elemento **flotante fijo** (`position:fixed`, anclado arriba de la
pantalla, por encima de todo el contenido) que permanece visible sin importar el scroll.
Patrón de pitidos: 1 pitido de aviso a los 10s restantes, 1 pitido por cada segundo de
los últimos 5 (cuenta 5-4-3-2-1), y 1 pitido fuerte al llegar a 0.

**Guardar sesión:** al completar, se calcula por cada ejercicio el peso medio y el peso
máximo de las series realizadas, y las reps reales introducidas (con fallback a las reps
objetivo si no se introdujeron). Se guarda una entrada de historial por ejercicio,
**reemplazando** cualquier entrada previa de la misma fecha (nunca se duplica un mismo
día). Se registra también la duración total de la sesión (desde que se pulsó Empezar,
incluyendo el calentamiento).

**Análisis IA post-sesión:** tras guardar, se llama a un modelo con el resumen de la
sesión (ejercicios, pesos, reps reales, % completado, semana) y devuelve un veredicto
breve (score, titular, highlights, punto de mejora, próxima sugerencia) en JSON.

**Modo kiosco:** vista a pantalla completa, un ejercicio a la vez, pensada para no tener
que mirar el móvil de cerca durante el entrenamiento. Usa la misma lógica de progresión
e historial que la vista normal (comparten fuente de datos).

**Registro de molestias/dolor:** modal accesible desde la sesión activa para anotar dolor
por articulación (rodilla, hombro, etc.) con intensidad y nota. Se acumula un historial
de estas entradas.

## Progresión y sugerencia de peso

La lógica compara el historial de un ejercicio (últimas 1-3 entradas) para decidir:
- **Primera vez** (sin historial): sugiere un peso de partida (mínimo del ejercicio + 2
  incrementos), o el último peso conocido si existe historial mínimo.
- **Progresión normal:** si el peso subió respecto a la sesión anterior, anima a seguir
  subiendo el mismo incremento.
- **Estancamiento real:** si las 3 últimas sesiones tienen tanto el peso medio como el
  peso máximo iguales o decrecientes, sugiere un deload del 5%. Esto usa **el máximo**
  de la serie top, no solo la media, para no confundir progresión intra-sesión (subir
  peso en series sucesivas el mismo día) con estancamiento real entre sesiones distintas.
- **Semana de deload (semana 5):** siempre sugiere -40% de la carga, independientemente
  del historial.
- El multiplicador de disposición (fresco +5%, normal ±0%, cansado -10% y +15s de
  descanso) se aplica sobre la sugerencia base.

## Vista de Progreso

- **1RM por ejercicio clave** (uno por sesión A-D) con gráfico de tendencia y proyección.
- **Correlación peso corporal vs fuerza:** gráfico de doble línea (peso corporal y 1RM
  del ejercicio principal) con insight automático generado a partir de las tendencias.
- **Comparativa semanal:** % de completado de esta semana vs la anterior, basado en
  sesiones con `status==="done"` de los últimos 7/14 días.
- **Volumen semanal por grupo muscular.**
- **Historial detallado por ejercicio** (`exHistory`): lista de todas las entradas con
  fecha, peso, y reps reales si se registraron.

## Nutrición

- **Macros objetivo del día**, adaptados al TDEE cuando hay suficiente historial de peso
  corporal: si el ajuste calculado supera ±50 kcal respecto al objetivo base, se escala
  (kcal ajustadas, proteína fija, carbos y grasa proporcionales) y se muestra un badge
  "AJUSTADO POR TDEE".
- **Comida "hero":** la próxima comida según la hora actual (o la actual si estás dentro
  de su franja horaria ±90min) se muestra como tarjeta destacada arriba, con hora,
  nombre, primer ingrediente, y sus macros. El resto de comidas del día aparece en una
  lista compacta debajo.
- **Progreso de macros del día:** barras de progreso (kcal, proteína, carbos, grasa)
  comparando lo planificado del día vs el objetivo.
- **Estrategia + Lidl:** acordeón colapsado con tips (lista semanal, superávit, timing
  pre-entreno, presupuesto estimado, hidratación, prep dominical, etc).
- **Lista de la compra semanal:** colapsable, por secciones, con checkbox por producto y
  contador de marcados. Botón "Desmarcar todo".

## Persistencia y sincronización

Todo se guarda en `localStorage` bajo una única clave principal (`javier_v4`) que
contiene: pesos en curso, historial de entrenamiento, calendario/schedule, peso
corporal, checkedItems de la compra, repsData, fecha de inicio del mesociclo, y varias
banderas de migración de una sola ejecución. El registro de dolor vive en una clave
independiente (`javier_pain`), igual que el objetivo de peso corporal, la racha de
Strava y el flag de onboarding — estas claves independientes existen porque se añadieron
en momentos distintos del desarrollo, no por diseño intencional; en la reimplementación
debería unificarse todo en un único modelo de datos coherente.

**Export/import JSON:** permite descargar todo el estado como archivo y restaurarlo,
útil como backup manual o para mover datos entre dispositivos.

## PWA e icono

Instalable como PWA (manifest inline, generado por JS, con iconos SVG y PNG embebidos
como data-URIs). Icono actual: monograma "J" en serif blanco con degradado, sobre fondo
grafito oscuro (`#30303a` → `#0e0e13`), con una mini mancuerna roja de base. El SVG de
la "J" es un path vectorial extraído de una fuente serif (no depende de que el
dispositivo tenga la fuente instalada). Ver `docs/legacy/icon-monograma-j.svg`.

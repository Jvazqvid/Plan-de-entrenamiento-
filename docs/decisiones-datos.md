# Decisiones de modelo de datos y bugs ya resueltos

Este documento existe porque varios de estos bugs costaron sesiones enteras de
depuración en el HTML legado. Al reimplementar, el modelo de datos nuevo debe evitar
estas trampas de diseño desde el principio, no solo parchearlas.

## 1. Clave de historial debe ser estable, no depender del índice filtrado por semana

**El bug:** los ejercicios de una sesión se filtran por variante de semana (`Qt()`).
El índice dentro del array *filtrado* cambiaba según la semana — el mismo ejercicio
podía tener índice 2 en la semana 1 y el "Press declinado" (otro ejercicio distinto)
tener también índice 2 en la semana 2. Como el historial se guardaba con ese índice
filtrado como parte de la clave, dos ejercicios completamente distintos acababan
compartiendo la misma entrada de historial y mezclando sus datos.

**La solución en el legado:** `Qt()` ahora adjunta `_fi` (índice en el array *completo*
de ejercicios de la sesión, estable independientemente de qué semana sea) a cada
ejercicio. El guardado (`Hf`) y la lectura del historial (`Vn`) usan siempre `_fi`,
nunca el índice post-filtrado.

**Para la reimplementación:** identifica cada ejercicio por un ID estable propio (string
único, no un índice posicional de ningún tipo) desde el modelo de datos, y evita este
problema de raíz.

## 2. Deduplicación de historial por fecha — nunca acumular entradas del mismo día

**El bug:** guardar (o reabrir y volver a guardar) la misma sesión el mismo día creaba
múltiples entradas de historial idénticas. Esto disparaba falsos avisos de "3 sesiones
sin progresar" cuando en realidad era el mismo entrenamiento guardado varias veces.

**La solución:** al guardar una entrada de historial, si ya existe una entrada con la
misma fecha para ese ejercicio, se **reemplaza** en vez de añadir una nueva.

**Para la reimplementación:** cada entrada de historial debe tener una clave natural
única de (ejercicio, fecha) — upsert, no insert.

## 3. 1RM debe calcularse siempre igual: peso máximo de la serie top, no la media

**El bug:** la cabecera del ejercicio calculaba el 1RM con el peso *medio* de las series,
mientras que las flechas de tendencia lo calculaban con el peso *máximo*. Dos números de
1RM distintos y visiblemente incoherentes en la misma pantalla.

**La solución:** unificar todas las vistas (cabecera, flechas de tendencia, vista de
Progreso) para usar siempre `Qc(peso_maximo_serie_top, reps_reales)` con la fórmula de
Epley. Cada entrada de historial guarda tanto el peso medio (`v`, usado para detectar
progresión de "peso de trabajo") como el máximo (`maxV`, usado para 1RM y detección de
estancamiento real).

**Para la reimplementación:** define un único punto de cálculo de 1RM y haz que todas
las vistas lo consuman desde ahí. No dupliques la fórmula en varios sitios.

## 4. Detección de estancamiento debe usar el máximo, no la media

**El bug relacionado:** el aviso de "sin progresión, baja peso" comparaba solo la media
de 3 sesiones. Si dentro de una sesión subías de peso serie a serie (aproximación
progresiva) pero la media entre sesiones se mantenía similar, el sistema sugería
incorrectamente bajar peso.

**La solución:** el deload solo se sugiere si tanto la media **como el máximo** están
estancados o decreciendo en las 3 últimas sesiones. Si el máximo sube aunque la media
se mantenga, se interpreta como progresión real.

## 5. Input de peso en blanco vs peso sugerido — no confundir "sin tocar" con "cero"

**El bug (versión 1):** el input de peso arrastraba el valor de la última sesión
indefinidamente porque la clave de almacenamiento de pesos no distinguía sesiones
distintas de la misma semana/ejercicio.

**El bug (versión 2, tras el primer intento de arreglo):** se probó a pre-rellenar el
input con el peso sugerido automáticamente al empezar sesión, pero el usuario prefería
ver el input vacío con la sugerencia como texto pequeño de referencia, no como valor
editable pre-cargado.

**La solución final:** existe un registro aparte (`touchedW`) de qué claves de peso han
sido tocadas manualmente en la sesión activa. El input muestra "—" (blanco) hasta que
el usuario lo toca; mientras tanto, el peso recomendado se muestra en texto pequeño
junto al número de serie (💡 40 kg), con fallback en cascada: sugerencia de progresión →
último peso conocido del historial → peso de partida (mínimo + 2 incrementos) si es la
primera vez.

**Para la reimplementación:** separa claramente en el modelo "valor actual del input
para esta sesión" de "valor sugerido para mostrar como ayuda" — son conceptos distintos
que no deben compartir el mismo campo de estado.

## 6. Persistencia: nunca reconstruyas el objeto de almacenamiento desde cero

**El bug (el más grave, y el más reciente):** la función que guarda el estado en
`localStorage` reconstruía el objeto completo con solo los campos que ella conocía
(`{weights, history, schedule, ...}`), sin incluir campos añadidos después (como
banderas de migración de una sola ejecución: `histResetV3`, `painResetV1`, etc). Cada
vez que se guardaba una sesión de entrenamiento, esas banderas desaparecían del
almacenamiento. En la siguiente carga de la app, el sistema veía que la bandera no
existía, pensaba que tocaba ejecutar una migración de "reset único", y **borraba el
historial que el usuario acababa de guardar** — un bucle de auto-sabotaje.

**La solución:** la función de guardado ahora lee el estado actual de `localStorage`
antes de escribir y hace un *merge* (`{...actual, ...camposNuevos}`), nunca una
sustitución completa.

**Para la reimplementación:** si usas un store único en `localStorage`/IndexedDB con
persistencia manual (en vez de algo como Zustand+persist o similar que ya gestiona esto
bien), asegúrate de que cualquier escritura parcial sea un merge explícito, o mejor aún,
usa una librería de estado con persistencia que lo garantice por diseño. Este es
probablemente el bug más importante a tener en cuenta de todo este documento.

## 7. Migraciones de "ejecutar una sola vez" deben ser síncronas, no con setTimeout

**El bug relacionado con el anterior:** las migraciones de limpieza de datos se
programaban con `setTimeout(...)` de varios cientos de milisegundos antes de marcar la
bandera de "ya ejecutado". Si el usuario cerraba la app o navegaba antes de que ese
timeout se disparara, la bandera nunca se guardaba y la migración volvía a ejecutarse
en la siguiente carga (incluyendo un reset de historial completo, pensado para
ejecutarse una única vez).

**La solución:** todas las migraciones se calculan y escriben de forma síncrona, en la
misma pasada de inicialización, sin depender de temporizadores.

**Para la reimplementación:** si necesitas migraciones de datos versionadas, hazlas
síncronas y atómicas (todo o nada) en el arranque, idealmente con una tabla de
versión/migraciones aplicadas explícita, no banderas sueltas por campo.

## 8. Reps reales deben leerse del mismo sitio donde se escriben

**El bug:** el input de reps escribía en un estado (`_n` / `repsData`) con una clave sin
sufijo, pero la función de guardado de sesión y el prompt de análisis IA leían de otro
estado (`a` / weights) con una clave que además llevaba un sufijo `-reps` que nunca se
escribía. Resultado: las reps reales introducidas por el usuario nunca llegaban al
historial ni al análisis IA — siempre caía al valor por defecto de las reps objetivo.

**Para la reimplementación:** un solo campo de estado por dato, con la misma clave usada
tanto para escribir como para leer. Si esto se modela con TypeScript, un tipo compartido
para la clave evita este desajuste por construcción.

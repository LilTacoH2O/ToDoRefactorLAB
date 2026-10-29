# ToDo Refactor Starter

Proyecto inicial para **ToDo Refactor Lab**: refactorización, pruebas unitarias y Pair Programming.

## Integrantes

- Estudiante A: Martínez Flores Javier Alexander
- Estudiante B: Hernández López Clara Paulina

## Objetivo

Transformar una ToDo App funcional (tareas como strings y DOM mezclado con datos) en software mantenible y comprobable: modelo de objetos, reglas de dominio en `taskService.js`, pruebas unitarias con Vitest y una interfaz que solo actúa como adaptador. Desarrollado en Pair Programming.

## Inicio

```bash
npm install
npm test
```

Durante el desarrollo:

```bash
npm run test:watch
```

La primera prueba estaba preparada para fallar: fue el punto de partida de la **Misión 2** y del ciclo **RED → GREEN → REFACTOR**.

## Estructura

- `src/legacy.js`: código funcional simple que analizamos antes de cambiar.
- `src/taskService.js`: lógica de dominio completada misión por misión.
- `src/app.js`: interfaz; desde la Misión 9 delega la lógica a `taskService.js`.
- `tests/taskService.test.js`: suite incremental de pruebas unitarias con Vitest.

## Misión 0 · Antes de modificar código

1. ¿Dónde almacenarías ahora el estado `completada` de una tarea?

   **Respuesta:** en cada tarea, como una propiedad booleana (`completada: false`). Con tareas representadas como strings no hay dónde guardarlo; habría que crear un segundo arreglo paralelo y mantenerlo sincronizado por posición, lo cual se rompe fácilmente al agregar o eliminar tareas.

2. ¿Qué ocurriría si mañana cada tarea necesita prioridad, fecha o responsable?

   **Respuesta:** con strings tendríamos que crear un arreglo paralelo por cada dato nuevo (prioridades, fechas, responsables) y mantenerlos todos sincronizados. Con objetos basta agregar una propiedad a cada tarea (`prioridad`, `fecha`, `responsable`) sin cambiar la estructura de la colección.

3. ¿Qué parte del código representa datos y qué parte representa interfaz?

   **Respuesta:** el arreglo `tareas` representa los datos. La función `mostrarTareas()`, el acceso a `lista` con `querySelector`, el uso de `innerHTML` y la etiqueta `<li>` representan la interfaz. En `legacy.js` ambas cosas están mezcladas dentro de la misma función, por lo que no se puede probar el recorrido de datos sin un navegador.

4. ¿Qué comportamiento debemos conservar durante el refactor?

   **Respuesta:** que la aplicación siga mostrando las tareas iniciales en el mismo orden, que una tarea nueva se agregue al final sin perder las anteriores, y que el texto de cada tarea se muestre tal cual lo escribió el usuario. Además, que no se pueda agregar una tarea con título vacío.

### Tres comportamientos observables que NO deben cambiar

1. Se muestran todas las tareas iniciales ("Revisar requisitos", "Diseñar pruebas", "Refactorizar código") en ese mismo orden.
2. Al agregar una tarea nueva aparece al final de la lista y las tareas anteriores se conservan.
3. El texto de cada tarea se muestra exactamente como lo escribió el usuario (sin alterarlo ni perderlo).

## Misión 1 · Modelo de objetos

Cada tarea pasó de string a `{ id, titulo, completada }`. Pertenecen a la tarea las propiedades que describen la entidad (`id`, `titulo`, `completada`); pertenecen a la interfaz el `<li>`, la clase `done`, los botones y el filtro activo. Al cambiar el modelo hubo que tocar `mostrarTareas()`: ese acoplamiento es lo que se separa en la Misión 9.

## Registro RED → GREEN → REFACTOR (Misión 2 · crearTarea)

- Prueba: "crea una tarea pendiente con id y título".
- **RED:** salida observada (`npm test`): `Error: Misión 2 pendiente: implementar crearTarea()` (1 failed). Falló porque la función era un stub que lanzaba un error; aún no cumplía el comportamiento. Evidencia: `evidencia-red.png`.
- **GREEN:** cambio mínimo: `return { id, titulo, completada: false };`.
- **REFACTOR:** sin cambios; no había mejora que pudiéramos justificar.
- Resultado: la prueba pasó (`1 passed`).

## Misión 3 · agregarTarea

- Función: `agregarTarea(tareas, nuevaTarea)` devuelve `[...tareas, nuevaTarea]`: un arreglo nuevo, sin modificar el recibido ni tocar el DOM.
- Pruebas (4): la nueva tarea queda al final; el resultado tiene un elemento más; no modifica el arreglo recibido; funciona con una colección vacía.
- RED → GREEN: 4 failed (`Misión 3 pendiente`) → 5 passed.
- Pregunta del caso: si `agregarTarea` hiciera `push` sobre el arreglo recibido, lo detecta la prueba "no modifica el arreglo recibido"; las otras dos pasarían igual.

## Misión 4 · buscarTarea con find()

- Función: `buscarTarea(tareas, id)` usa `find()` porque la intención es encontrar una sola tarea, no recorrerlas todas.
- `find()` devuelve el primer elemento que cumple la condición o `undefined` si no existe.
- Pruebas (2): id existente; id inexistente devuelve `undefined`.
- RED → GREEN: 2 failed (`Misión 4 pendiente`) → 7 passed.

## Misión 5 · obtenerPendientes y obtenerTerminadas con filter()

- Funciones: `obtenerPendientes(tareas)` y `obtenerTerminadas(tareas)` usan `filter()`, que selecciona sin transformar y devuelve un arreglo nuevo.
- Pruebas (5): pendientes en colección mixta; ninguna pendiente; colección vacía; terminadas en colección mixta; no modifica la colección original.
- RED → GREEN: 5 failed → 12 passed.
- Pregunta del caso: sin coincidencias, `filter()` devuelve `[]`, nunca `undefined`; por eso se puede usar `.length` o `.map()` sin riesgo.

## Misión 6 · cambiarEstado con map() y spread

- Función: `cambiarEstado(tareas, id)` usa `map()` para producir una colección nueva del mismo tamaño; con spread (`{ ...tarea, completada: !tarea.completada }`) copia la tarea y cambia solo `completada`.
- No se busca y muta el objeto original: las tareas que no coinciden se devuelven tal cual.
- Pruebas (5): cambia la tarea correcta; no altera las demás; id inexistente conserva el contenido; no muta el original; aplicarlo dos veces regresa al estado inicial.
- RED → GREEN: 5 failed → 17 passed.

## Misión 7 · eliminarTarea con filter()

- Antes de programar elegimos `filter()`: eliminar es "conservar todas excepto la del id". `map()` conserva el tamaño (no elimina) y `find()` solo devuelve un elemento.
- Función: `eliminarTarea(tareas, id)` devuelve `tareas.filter(tarea => tarea.id !== id)`.
- Pruebas (4), más allá del caso feliz: id existente (con `some()` comprobamos que ya no queda ninguna con ese id); id inexistente; colección vacía; no modifica el arreglo recibido.
- RED → GREEN: 4 failed → 21 passed.

## Misión 8 · obtenerResumen

- Función: `obtenerResumen(tareas)` devuelve `{ total, pendientes, terminadas }` reutilizando `obtenerPendientes` y `obtenerTerminadas`.
- Pruebas (3): colección mixta; colección vacía (todo en cero); pendientes + terminadas siempre es igual al total.
- RED → GREEN: 3 failed → 24 passed.
- La comparación entre las dos soluciones está en "Decisiones de refactor", punto 4.

## Misión 9 · Integración con la interfaz

- Dos reglas nuevas que la interfaz necesitaba, con prueba antes de implementar:
  - `generarId(tareas)`: 1 con colección vacía; máximo id + 1 aunque falten números intermedios.
  - `filtrarPorEstado(tareas, filtro)`: "todas", "pendientes", "terminadas" y un filtro desconocido (devuelve todas).
- RED → GREEN: 6 failed (`is not a function`) → 30 passed.
- `app.js` quedó como adaptador: evento → función de `taskService.js` → nuevo estado → `render()` → DOM. Ya no contiene reglas de negocio.
- Se probaron los cinco escenarios manuales con Live Server; los resultados están en "Pruebas de integración manual".

## Misión 10 · Refactor final protegido por pruebas

- Regla nueva con prueba: `esTituloValido(titulo)` (texto válido; vacío, solo espacios y no texto). RED → GREEN: 2 failed → 32 passed.
- Refactor de `app.js` sin cambiar comportamiento (detalle en "Decisiones de refactor", puntos 5 y 6).
- Después de cada cambio pequeño ejecutamos `npm test` (verde) y repetimos los cinco escenarios manuales: no hubo regresiones.

## Misión 11 · Extensión elegida: Opción C · Porcentaje de avance

- Función: `obtenerPorcentajeAvance(tareas)` devuelve el porcentaje entero de tareas terminadas.
- Pregunta del caso (colección vacía): devuelve 0, porque `0 / 0` daría `NaN`. Redondea al entero más cercano (1 de 3 = 33).
- Pruebas (4): colección vacía; ninguna terminada; redondeo 1 de 3 = 33; todas terminadas = 100. RED → GREEN: 4 failed → 36 passed.
- Interfaz: solo tres líneas (un `<p id="progress">`, una referencia y una línea en `render()`).
- ¿El refactor facilitó el cambio? Sí: una función pura, sus pruebas y tres líneas de interfaz, sin tocar el resto del código. Eso indica que el refactor redujo el acoplamiento.

## Decisiones de refactor

1. **De strings a objetos `{ id, titulo, completada }`.** Da identidad y estado a cada tarea y permite agregar propiedades sin arreglos paralelos.
2. **Funciones que reciben datos y devuelven datos.** `agregarTarea`, `cambiarEstado` y `eliminarTarea` devuelven un arreglo nuevo en vez de modificar el recibido; así las pruebas son deterministas y no hay efectos secundarios. Hay una prueba de "no muta" en cada una.
3. **Método de arreglo según la intención.** `find()` para encontrar uno; `filter()` para seleccionar varios (pendientes, terminadas) y para eliminar ("conservar todas excepto una"); `map()` para transformar conservando el tamaño (`cambiarEstado`). En `eliminarTarea` descartamos `map()` porque no reduce el tamaño y `find()` porque solo devuelve un elemento. `some()` lo usamos en la prueba de `eliminarTarea` para comprobar que ya no queda ninguna tarea con ese id (devuelve true/false).
4. **`obtenerResumen` reutiliza `obtenerPendientes` y `obtenerTerminadas`.** Comparada con calcular directo en un solo recorrido (`pendientes = total - terminadas`), elegimos la composición porque comunica mejor la intención y deja la regla de "completada" en un solo lugar, a cambio de recorrer el arreglo dos veces (irrelevante con pocas tareas).
5. **La validación del título pasó al dominio.** La condición de título vacío estaba escrita dentro del manejador del formulario en `app.js`; la movimos a `esTituloValido()` en `taskService.js`, con su prueba. La interfaz solo decide qué mensaje mostrar; la regla vive en un solo lugar y se prueba sin navegador.
6. **`app.js` reorganizado como adaptador.** Un solo `render()` dibuja la lista, el resumen y el filtro activo a partir del estado; los manejadores de eventos solo llaman a una función de `taskService.js`, actualizan el estado y vuelven a llamar a `render()`. Se usa `createElement` y `textContent` en lugar de `innerHTML`, para que el texto del usuario se muestre tal cual (comportamiento 3 de la Misión 0).

## Casos de prueba (36 en total)

| Función | Casos |
|---|---|
| `crearTarea` | tarea pendiente con id y título |
| `agregarTarea` | al final; un elemento más; no muta; colección vacía |
| `buscarTarea` | id existente; id inexistente (`undefined`) |
| `obtenerPendientes` / `obtenerTerminadas` | mixta; ninguna; vacía; terminadas; no muta |
| `cambiarEstado` | tarea correcta; otras intactas; id inexistente; no muta; doble cambio |
| `eliminarTarea` | existente; inexistente; vacía; no muta |
| `obtenerResumen` | mixta; vacía; pendientes + terminadas = total |
| `generarId` | colección vacía; máximo + 1 con huecos |
| `filtrarPorEstado` | todas; pendientes; terminadas; filtro desconocido |
| `esTituloValido` | texto válido; vacío, solo espacios y no texto |
| `obtenerPorcentajeAvance` | vacía; ninguna; redondeo 1 de 3 = 33; todas = 100 |

Caso frontera destacado: colección vacía en `obtenerPorcentajeAvance`, porque `0 / 0` daría `NaN`.

## Pruebas de integración manual

| Escenario | Resultado |
|---|---|
| Alta válida | Pasó |
| Alta inválida (título vacío) | Pasó: no se agrega y muestra mensaje |
| Cambio de estado | Pasó: tachado y contadores cambian |
| Filtro Pendientes | Pasó |
| Eliminar | Pasó: desaparece y se actualiza el resumen |

Fallos encontrados (entrada → observado → esperado → corrección): ninguno.

## Pair Programming

Registramos por misión quién fue **Driver** y quién **Navigator**. Intercambiamos roles en cada misión y no hicimos commit hasta que ambos pudimos explicar el código y la prueba.

| Misión | Driver | Navigator | Commit | Aprendizaje clave |
|---|---|---|---|---|
| 00 Comprender el legacy | Javier | Clara | Mision 00: analisis del codigo legacy y respuestas en README - Driver: Javier / Navigator: Clara | Antes de cambiar código hay que fijar qué comportamientos deben conservarse. |
| 01 Modelo de objetos | Clara | Javier | Mision 01: modelo de tareas como objetos con id, titulo y completada - Driver: Clara / Navigator: Javier | Un objeto agrupa los datos de la tarea y evita arreglos paralelos. |
| 02 crearTarea + 1.ª prueba | Javier | Clara | Mision 02: crearTarea (RED visto en evidencia-red, GREEN implementado) - Driver: Javier / Navigator: Clara | Ver fallar la prueba primero demuestra que de verdad verifica algo. |
| 03 agregarTarea | Clara | Javier | Mision 03 (GREEN): implementa agregarTarea sin mutar - Driver: Clara / Navigator: Javier | El spread crea un arreglo nuevo; `push` modificaría el original. |
| 04 buscarTarea (find) | Javier | Clara | Mision 04 (GREEN): buscarTarea con find() - Driver: Javier / Navigator: Clara | `find()` devuelve un elemento o `undefined`, y eso también se prueba. |
| 05 obtenerPendientes / obtenerTerminadas (filter) | Clara | Javier | Mision 05 (GREEN): obtenerPendientes y obtenerTerminadas con filter() - Driver: Clara / Navigator: Javier | `filter()` sin coincidencias devuelve `[]`, nunca `undefined`. |
| 06 cambiarEstado (map + spread) | Javier | Clara | Mision 06 (GREEN): cambiarEstado con map() y spread sin mutar - Driver: Javier / Navigator: Clara | Probar que las demás tareas no cambian es tan importante como probar la que sí. |
| 07 eliminarTarea | Clara | Javier | Mision 07 (GREEN): eliminarTarea con filter() - Driver: Clara / Navigator: Javier | Eliminar es "conservar todas excepto una"; elegir el método por la intención. |
| 08 obtenerResumen | Javier | Clara | Mision 08 (GREEN): obtenerResumen reutilizando funciones probadas - Driver: Javier / Navigator: Clara | Componer funciones ya probadas deja cada regla en un solo lugar. |
| 09 Integración con la interfaz | Clara | Javier | Mision 09 (GREEN): integracion de taskService con app.js y render() - Driver: Clara / Navigator: Javier | La interfaz solo traduce eventos a llamadas del dominio y vuelve a dibujar. |
| 10 Refactor final | Javier | Clara | Mision 10 (GREEN): esTituloValido en dominio y refactor de app.js protegido por pruebas - Driver: Javier / Navigator: Clara | Con la suite en verde se puede refactorizar en pasos pequeños sin miedo. |
| 11 Extensión: porcentaje de avance | Clara | Javier | Mision 11 (GREEN): extension porcentaje de avance en dominio y UI - Driver: Clara / Navigator: Javier | Un buen diseño se nota cuando agregar una función toca muy poco código. |

## Evidencia

- Suite en verde: ![Suite en verde](evidencia-suite-verde.png)
- Prueba que inicialmente falló (RED): ver el registro de la Misión 2 y `evidencia-red.png`.

## Historial de commits

[pegar aquí la salida de `git log --format="%h | %an | %ad | %s" --date=short`]

## Pregunta de ingeniería (Pair Programming)

Si una prueba pasa pero ninguno puede explicar qué comportamiento protege, no aporta confianza real: podría estar verificando algo irrelevante o pasar siempre. Una prueba da confianza cuando sabemos qué regla protege y la hemos visto fallar cuando esa regla se rompe. Por eso la regla de salida de cada misión fue que ambos pudieran explicar código y prueba antes de hacer commit.

## Reflexión de pareja

El cambio que más aumentó la mantenibilidad fue mover las reglas de las tareas a `taskService.js` como funciones que reciben datos y devuelven datos. En `legacy.js` el arreglo de strings estaba mezclado con `innerHTML`, así que cualquier ajuste obligaba a tocar la interfaz. Al pasar a objetos con `id`, `titulo` y `completada` pudimos agregar estado sin arreglos paralelos, y `app.js` quedó como un adaptador: lee el evento, llama a una función y vuelve a dibujar con `render()`.

La prueba que más confianza nos dio fue la de `cambiarEstado` que comprueba que las demás tareas no se alteran y que el arreglo original no se muta. Al principio pensamos que bastaba con verificar que la tarea cambiaba, pero al diseñar los casos frontera, como el id inexistente, entendimos que una prueba debe proteger un comportamiento concreto y no solo el caso feliz. También comprobamos el valor del ciclo RED, GREEN, REFACTOR: ver fallar una prueba antes de implementar nos obligó a definir qué debía devolver cada función.

La extensión del porcentaje de avance confirmó el diseño: solo agregamos una función pura, sus pruebas y tres líneas de interfaz, sin tocar el resto del código. Alternar los roles de Driver y Navigator nos ayudó a detectar casos que quien tecleaba no veía, como el id inexistente.

## Reflexión individual
Javier:
Lo que más me costó entender fue por qué cambiarEstado no debía modificar la tarea original si el resultado en pantalla se veía igual; lo entendí cuando la prueba de “no muta” falló en un intento con asignación directa. Como Navigator en la Misión 9 vi que app.js todavía tenía reglas escondidas en los eventos, algo que como Driver en otras misiones no notaba por estar enfocado en teclear. En la siguiente práctica escribiría los casos frontera antes que el caso feliz.
Clara:
Lo que más me costó fue distinguir cuándo usar map() y cuándo filter(), sobre todo en eliminarTarea, hasta que lo pensé como “transformar todas” contra “conservar algunas”. Como Navigator en generarId propuse el caso de ids con huecos, y me di cuenta de que desde afuera es más fácil imaginar cómo se puede romper una función. La próxima vez haría commits más pequeños para no acumular cambios y evitar conflictos como el del README.

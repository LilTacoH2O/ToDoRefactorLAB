# ToDo Refactor Starter

Proyecto inicial para **ToDo Refactor Lab**: refactorización, pruebas unitarias y Pair Programming.
## Integrantes
- Estudiante A: Martínez Flores Javier Alexander
- Estudiante B: Hernández López Clara Paulina
 
## Objetivo
Transformar una ToDo App funcional (tareas como strings y DOM mezclado
con datos) en software mantenible y comprobable: modelo de objetos,
reglas de dominio en taskService.js, pruebas unitarias con Vitest y
una interfaz que solo actúa como adaptador. Desarrollado en Pair
Programming.
 


## Inicio

```bash
npm install
npm test
```

Durante el desarrollo:

```bash
npm run test:watch
```

La primera prueba está preparada para fallar: es el punto de partida de la **Misión 2** y del ciclo **RED → GREEN → REFACTOR**.

## Estructura

- `src/legacy.js`: código funcional simple para analizar antes de cambiar.
- `src/taskService.js`: lógica de dominio que completarás misión por misión.
- `src/app.js`: interfaz inicial; en la Misión 9 deberá delegar la lógica a `taskService.js`.
- `tests/taskService.test.js`: suite incremental de pruebas unitarias con Vitest.

## Misión 0 · Antes de modificar código
 
Responde aquí:
 
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


## Registro RED → GREEN → REFACTOR

Documenta al menos una iteración:

- **RED:** ¿qué prueba escribiste y por qué falló?
- **GREEN:** ¿cuál fue el cambio mínimo que la hizo pasar?
- **REFACTOR:** ¿qué mejoraste sin cambiar el comportamiento?
## Registro de una prueba que inicialmente falló (RED)

- Misión: 02, `crearTarea`.
- Prueba: "crea una tarea pendiente con id y título".
- Salida observada (`npm test`): `Error: Misión 2 pendiente: implementar crearTarea()` (1 failed). Evidencia: `evidencia-red.png`.
- Por qué falló: la función era un stub que lanza un error; aún no cumplía el comportamiento.
- GREEN: `return { id, titulo, completada: false };`.
- REFACTOR: sin cambios; no había mejora que pudiéramos justificar.
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


## Decisiones de refactor

1. **De strings a objetos `{ id, titulo, completada }`.** Da identidad y estado a cada tarea y permite agregar propiedades sin arreglos paralelos.
2. **Funciones que reciben datos y devuelven datos.** `agregarTarea`, `cambiarEstado` y `eliminarTarea` devuelven un arreglo nuevo en vez de modificar el recibido; así las pruebas son deterministas y no hay efectos secundarios. Hay una prueba de "no muta" en cada una.
3. **Método de arreglo según la intención.** `find()` para encontrar uno; `filter()` para seleccionar varios (pendientes, terminadas) y para eliminar ("conservar todas excepto una"); `map()` para transformar conservando el tamaño (`cambiarEstado`). En `eliminarTarea` descartamos `map()` porque no reduce el tamaño y `find()` porque solo devuelve un elemento. `some()` lo usamos en la prueba de `eliminarTarea` para comprobar que ya no queda ninguna tarea con ese id (devuelve true/false).
4. **`obtenerResumen` reutiliza `obtenerPendientes` y `obtenerTerminadas`.** Compara con calcular directo con un solo recorrido (`pendientes = total - terminadas`): elegimos la composición porque comunica mejor la intención y deja la regla de "completada" en un solo lugar, a cambio de recorrer el arreglo dos veces (irrelevante con pocas tareas).


## Pair Programming
 
Registra por misión quién fue **Driver** y quién **Navigator**. Intercambien roles con frecuencia y no hagan commit hasta que ambos puedan explicar el código y la prueba.
<<<<<<< HEAD


=======
 
| Misión | Driver | Navigator | Commit |
|---|---|---|---|
| 00 Comprender el legacy | Javier | Clara | Mision 00: analisis del codigo legacy y respuestas en README - Driver: Javier / Navigator: Clara |
| 01 Modelo de objetos | Clara | Javier | Mision 01: modelo de tareas como objetos con id, titulo y completada - Driver: Clara / Navigator: Javier  |
| 02 crearTarea + 1.ª prueba | Javier | Clara | Mision 02: crearTarea (RED visto en evidencia-red, GREEN implementado) - Driver: Javier / Navigator: Clara |
| 03 agregarTarea | Clara | Javier | Mision 03 (GREEN): implementa agregarTarea sin mutar - Driver: Clara / Navigator: Javier |
| 04 buscarTarea (find) | Javier | Clara | Mision 04 (GREEN): buscarTarea con find() - Driver: Javier / Navigator: Clara |
| 05 obtenerPendientes / obtenerTerminadas (filter) | Clara | Javier | Mision 05 (GREEN): obtenerPendientes y obtenerTerminadas con filter() - Driver: Clara / Navigator: Javier |
| 06 cambiarEstado (map + spread) | Javier | Clara | Mision 06 (GREEN): cambiarEstado con map() y spread sin mutar - Driver: Javier / Navigator: Clara |
| 07 eliminarTarea | Clara | Javier | Mision 07 (GREEN): eliminarTarea con filter() - Driver: Clara / Navigator: Javier |
| 08 obtenerResumen | Javier | Clara | Mision 08 (GREEN): obtenerResumen reutilizando funciones probadas - Driver: Javier / Navigator: Clara |
| 09 Integración con la interfaz | Clara | Javier | Mision 09 (GREEN): integracion de taskService con app.js y render() - Driver: Clara / Navigator: Javier |
| 10 Refactor final | Javier | Clara |  |
| 11 Extensión: porcentaje de avance | Clara | Javier |  |


>>>>>>> e352cea16512d9e9892caf0268a6d45d0e30dc64

## Misión 1 · Modelo de objetos

Cada tarea pasó de string a `{ id, titulo, completada }`. Pertenecen a la tarea las propiedades que describen la entidad (`id`, `titulo`, `completada`); pertenecen a la interfaz el `<li>`, la clase `done`, los botones y el filtro activo. Al cambiar el modelo hubo que tocar `mostrarTareas()`: ese acoplamiento es lo que se separa en la Misión 9.


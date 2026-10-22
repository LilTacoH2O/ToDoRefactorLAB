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

## Pair Programming
 
Registra por misión quién fue **Driver** y quién **Navigator**. Intercambien roles con frecuencia y no hagan commit hasta que ambos puedan explicar el código y la prueba.
<<<<<<< HEAD


=======
 
| Misión | Driver | Navigator | Commit |
|---|---|---|---|
| 00 Comprender el legacy | Javier | Clara | Mision 00: analisis del codigo legacy y respuestas en README - Driver: Javier / Navigator: Clara |
| 01 Modelo de objetos | Clara | Javier | Mision 01: modelo de tareas como objetos con id, titulo y completada - Driver: Clara / Navigator: Javier  |
| 02 crearTarea + 1.ª prueba | Javier | Clara |  |
| 03 agregarTarea | Clara | Javier |  |
| 04 buscarTarea (find) | Javier | Clara |  |
| 05 obtenerPendientes / obtenerTerminadas (filter) | Clara | Javier |  |
| 06 cambiarEstado (map + spread) | Javier | Clara |  |
| 07 eliminarTarea | Clara | Javier |  |
| 08 obtenerResumen | Javier | Clara |  |
| 09 Integración con la interfaz | Clara | Javier |  |
| 10 Refactor final | Javier | Clara |  |
| 11 Extensión: porcentaje de avance | Clara | Javier |  |


>>>>>>> e352cea16512d9e9892caf0268a6d45d0e30dc64

## Misión 1 · Modelo de objetos

Cada tarea pasó de string a `{ id, titulo, completada }`. Pertenecen a la tarea las propiedades que describen la entidad (`id`, `titulo`, `completada`); pertenecen a la interfaz el `<li>`, la clase `done`, los botones y el filtro activo. Al cambiar el modelo hubo que tocar `mostrarTareas()`: ese acoplamiento es lo que se separa en la Misión 9.
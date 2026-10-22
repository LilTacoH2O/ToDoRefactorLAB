import { describe, it, expect } from "vitest";
import {
  crearTarea,
  agregarTarea,
  buscarTarea,
  obtenerPendientes,
  obtenerTerminadas,
  cambiarEstado,
  eliminarTarea,
  obtenerResumen
} from "../src/taskService.js";

function crearTareasMixtas() {
  return [
    { id: 1, titulo: "Revisar requisitos", completada: true },
    { id: 2, titulo: "Diseñar pruebas", completada: false },
    { id: 3, titulo: "Refactorizar código", completada: false }
  ];
}


/*
 * TODO REFACTOR LAB · SUITE STARTER
 *
 * Activa/crea pruebas misión por misión. No escribas todas las soluciones de
 * una vez. Para cada comportamiento sigue RED → GREEN → REFACTOR.
 */

describe("crearTarea", () => {
  it("crea una tarea pendiente con id y título", () => {
    // Arrange
    const id = 10;
    const titulo = "Diseñar pruebas";

    // Act
    const tarea = crearTarea(id, titulo);

    // Assert
    expect(tarea).toEqual({ id: 10, titulo: "Diseñar pruebas", completada: false });
  });
});

describe("agregarTarea (Misión 3)", () => {
  it("devuelve la colección con la nueva tarea al final", () => {
    const tareas = crearTareasMixtas();
    const nueva = crearTarea(4, "Escribir README");
    const resultado = agregarTarea(tareas, nueva);
    expect(resultado[resultado.length - 1]).toEqual(nueva);
  });

  it("el resultado contiene un elemento más", () => {
    const tareas = crearTareasMixtas();
    const resultado = agregarTarea(tareas, crearTarea(4, "Escribir README"));
    expect(resultado).toHaveLength(tareas.length + 1);
  });

  it("no modifica el arreglo recibido", () => {
    const tareas = crearTareasMixtas();
    agregarTarea(tareas, crearTarea(4, "Escribir README"));
    expect(tareas).toHaveLength(3);
  });

  it("funciona con una colección vacía", () => {
    const resultado = agregarTarea([], crearTarea(1, "Primera"));
    expect(resultado).toEqual([{ id: 1, titulo: "Primera", completada: false }]);
  });
});
describe("buscarTarea (Misión 4)", () => {
  it("encuentra una tarea con un id existente", () => {
    const tarea = buscarTarea(crearTareasMixtas(), 2);
    expect(tarea).toEqual({ id: 2, titulo: "Diseñar pruebas", completada: false });
  });

  it("devuelve undefined con un id inexistente", () => {
    expect(buscarTarea(crearTareasMixtas(), 99)).toBeUndefined();
  });
});


// MISIÓN 5: prueba colección mixta, sin coincidencias y vacía.
// MISIÓN 6: prueba cambio correcto, otra tarea intacta e id inexistente.
// MISIÓN 7: prueba eliminar existente, inexistente y colección vacía.
// MISIÓN 8: prueba obtenerResumen(), incluyendo colección vacía.

// Los imports anteriores quedan preparados para que construyas la suite de forma incremental.

void obtenerPendientes;
void obtenerTerminadas;
void cambiarEstado;
void eliminarTarea;
void obtenerResumen;

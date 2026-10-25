import { describe, it, expect } from "vitest";
import {
  crearTarea,
  agregarTarea,
  buscarTarea,
  obtenerPendientes,
  obtenerTerminadas,
  cambiarEstado,
  eliminarTarea,
  obtenerResumen,
  generarId,
  filtrarPorEstado
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

describe("obtenerPendientes y obtenerTerminadas (Misión 5)", () => {
  it("separa pendientes en una colección mixta", () => {
    const ids = obtenerPendientes(crearTareasMixtas()).map(t => t.id);
    expect(ids).toEqual([2, 3]);
  });

  it("devuelve [] si ninguna está pendiente", () => {
    const todasTerminadas = [crearTarea(1, "A"), crearTarea(2, "B")]
      .map(t => ({ ...t, completada: true }));
    expect(obtenerPendientes(todasTerminadas)).toEqual([]);
  });

  it("devuelve [] con una colección vacía", () => {
    expect(obtenerPendientes([])).toEqual([]);
    expect(obtenerTerminadas([])).toEqual([]);
  });

  it("separa terminadas en una colección mixta", () => {
    const ids = obtenerTerminadas(crearTareasMixtas()).map(t => t.id);
    expect(ids).toEqual([1]);
  });

  it("no modifica la colección original", () => {
    const tareas = crearTareasMixtas();
    obtenerPendientes(tareas);
    expect(tareas).toHaveLength(3);
  });
});

describe("cambiarEstado (Misión 6)", () => {
  it("cambia el estado de la tarea correcta", () => {
    const resultado = cambiarEstado(crearTareasMixtas(), 2);
    expect(buscarTarea(resultado, 2).completada).toBe(true);
  });

  it("no altera las demás tareas", () => {
    const original = crearTareasMixtas();
    const resultado = cambiarEstado(original, 2);
    expect(buscarTarea(resultado, 1)).toEqual(original[0]);
    expect(buscarTarea(resultado, 3)).toEqual(original[2]);
  });

  it("con un id inexistente conserva el contenido", () => {
    const original = crearTareasMixtas();
    expect(cambiarEstado(original, 99)).toEqual(original);
  });

  it("no modifica el objeto original (no hay mutación)", () => {
    const original = crearTareasMixtas();
    cambiarEstado(original, 2);
    expect(original[1].completada).toBe(false);
  });

  it("aplicarlo dos veces regresa al estado inicial", () => {
    const original = crearTareasMixtas();
    const resultado = cambiarEstado(cambiarEstado(original, 2), 2);
    expect(resultado).toEqual(original);
  });
});

describe("eliminarTarea (Misión 7)", () => {
  it("elimina una tarea con un id existente", () => {
    const resultado = eliminarTarea(crearTareasMixtas(), 2);
    expect(resultado.map(t => t.id)).toEqual([1, 3]);
    // some() responde "¿queda alguna con ese id?" (true/false)
    expect(resultado.some(t => t.id === 2)).toBe(false);
  });

  it("con un id inexistente conserva todas las tareas", () => {
    const original = crearTareasMixtas();
    expect(eliminarTarea(original, 99)).toEqual(original);
  });

  it("con una colección vacía devuelve []", () => {
    expect(eliminarTarea([], 1)).toEqual([]);
  });

  it("no modifica el arreglo recibido", () => {
    const original = crearTareasMixtas();
    eliminarTarea(original, 2);
    expect(original).toHaveLength(3);
  });
});

describe("obtenerResumen (Misión 8)", () => {
  it("cuenta total, pendientes y terminadas", () => {
    expect(obtenerResumen(crearTareasMixtas())).toEqual({
      total: 3,
      pendientes: 2,
      terminadas: 1
    });
  });

  it("devuelve ceros con una colección vacía", () => {
    expect(obtenerResumen([])).toEqual({ total: 0, pendientes: 0, terminadas: 0 });
  });

  it("pendientes + terminadas siempre es igual al total", () => {
    const r = obtenerResumen(crearTareasMixtas());
    expect(r.pendientes + r.terminadas).toBe(r.total);
  });
});

// Los imports anteriores quedan preparados para que construyas la suite de forma incremental.

describe("generarId (Misión 9)", () => {
  it("devuelve 1 cuando no hay tareas", () => {
    expect(generarId([])).toBe(1);
  });

  it("devuelve el máximo id + 1, aunque falten números intermedios", () => {
    const tareas = [crearTarea(1, "A"), crearTarea(5, "B")];
    expect(generarId(tareas)).toBe(6);
  });
});

describe("filtrarPorEstado (Misión 9)", () => {
  it("'todas' devuelve todas las tareas", () => {
    expect(filtrarPorEstado(crearTareasMixtas(), "todas")).toHaveLength(3);
  });

  it("'pendientes' devuelve solo las pendientes", () => {
    const resultado = filtrarPorEstado(crearTareasMixtas(), "pendientes");
    expect(resultado.every(t => !t.completada)).toBe(true);
    expect(resultado).toHaveLength(2);
  });

  it("'terminadas' devuelve solo las terminadas", () => {
    const resultado = filtrarPorEstado(crearTareasMixtas(), "terminadas");
    expect(resultado.every(t => t.completada)).toBe(true);
    expect(resultado).toHaveLength(1);
  });

  it("un filtro desconocido devuelve todas", () => {
    expect(filtrarPorEstado(crearTareasMixtas(), "xyz")).toHaveLength(3);
  });
});

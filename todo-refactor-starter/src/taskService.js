/*
 * TODO REFACTOR LAB · LÓGICA DE DOMINIO
 *
 * Completa estas funciones misión por misión. Favorece funciones que reciben
 * datos y devuelven datos, sin acceder al DOM. Ejecuta la suite después de
 * cada cambio.
 */

// MISIÓN 2: una tarea nueva siempre nace pendiente
export function crearTarea(id, titulo) {
  return { id, titulo, completada: false }; 
}

// MISIÓN 3: devuelve un arreglo NUEVO, no modifica el recibido
export function agregarTarea(tareas, nuevaTarea) {
  return [...tareas, nuevaTarea];
}

// MISIÓN 4: find devuelve el primer elemento o undefined
export function buscarTarea(tareas, id) {
  return tareas.find(tarea => tarea.id === id);
}

// MISIÓN 5: filter selecciona sin transformar
export function obtenerPendientes(tareas) {
  return tareas.filter(tarea => !tarea.completada);
}

export function obtenerTerminadas(tareas) {
  return tareas.filter(tarea => tarea.completada);
}

// MISIÓN 6: map produce una colección nueva; spread copia la tarea
export function cambiarEstado(tareas, id) {
  return tareas.map(tarea =>
    tarea.id === id
      ? { ...tarea, completada: !tarea.completada }
      : tarea
  );
}


// MISIÓN 7: "conservar todas excepto..." es un filter
export function eliminarTarea(tareas, id) {
  return tareas.filter(tarea => tarea.id !== id);
}


// MISIÓN 8
// Solución A (elegida): compone funciones ya probadas
export function obtenerResumen(tareas) {
  return {
    total: tareas.length,
    pendientes: obtenerPendientes(tareas).length,
    terminadas: obtenerTerminadas(tareas).length
  };
}

// MISIÓN 9: reglas que la interfaz necesita
export function generarId(tareas) {
  if (tareas.length === 0) return 1;
  return Math.max(...tareas.map(tarea => tarea.id)) + 1;
}

export function filtrarPorEstado(tareas, filtro) {
  switch (filtro) {
    case "pendientes": return obtenerPendientes(tareas);
    case "terminadas": return obtenerTerminadas(tareas);
    default: return tareas; // "todas" o un valor desconocido
  }
}
// MISIÓN 10: la validación del título es una regla de dominio, no del DOM
export function esTituloValido(titulo) {
  return typeof titulo === "string" && titulo.trim() !== "";
}





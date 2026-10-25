/*
 * MISIÓN 9-10 · ADAPTADOR DE INTERFAZ
 * Flujo: evento -> función de dominio -> nuevo estado -> render() -> DOM
 * Aquí NO hay reglas de negocio: todas viven en taskService.js.
 */
import {
  crearTarea,
  agregarTarea,
  cambiarEstado,
  eliminarTarea,
  filtrarPorEstado,
  obtenerResumen,
  esTituloValido,
  generarId
} from "./taskService.js";

// 1. ESTADO
let tareas = [
  { id: 1, titulo: "Revisar requisitos", completada: false },
  { id: 2, titulo: "Diseñar pruebas", completada: false },
  { id: 3, titulo: "Refactorizar código", completada: false }
];
let filtroActual = "todas";

// 2. REFERENCIAS AL DOM
const formulario = document.querySelector("#task-form");
const inputTitulo = document.querySelector("#task-input");
const lista = document.querySelector("#task-list");
const mensaje = document.querySelector("#message");
const resumenTexto = document.querySelector("#summary");
const botonesFiltro = [...document.querySelectorAll("[data-filter]")];

// 3. EVENTOS
formulario.addEventListener("submit", manejarAlta);
lista.addEventListener("click", manejarClicEnLista);
botonesFiltro.forEach(boton =>
  boton.addEventListener("click", () => manejarFiltro(boton))
);

function manejarAlta(evento) {
  evento.preventDefault();
  const titulo = inputTitulo.value.trim();

  if (!esTituloValido(titulo)) {
    mensaje.textContent = "Escribe un título antes de agregar.";
    return;
  }

  tareas = agregarTarea(tareas, crearTarea(generarId(tareas), titulo));
  inputTitulo.value = "";
  mensaje.textContent = "";
  render();
}

function manejarClicEnLista(evento) {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton) return;

  const id = Number(boton.dataset.id);
  if (boton.dataset.accion === "cambiar") tareas = cambiarEstado(tareas, id);
  if (boton.dataset.accion === "eliminar") tareas = eliminarTarea(tareas, id);
  render();
}

function manejarFiltro(botonSeleccionado) {
  filtroActual = botonSeleccionado.dataset.filter;
  botonesFiltro.forEach(boton =>
    boton.classList.toggle("active", boton === botonSeleccionado)
  );
  mensaje.textContent = "";
  render();
}

// 4. RENDER (solo dibuja)
function render() {
  const visibles = filtrarPorEstado(tareas, filtroActual);
  lista.replaceChildren(...visibles.map(crearElementoTarea));

  const resumen = obtenerResumen(tareas);
  resumenTexto.textContent =
    `Total: ${resumen.total} · Pendientes: ${resumen.pendientes} · Terminadas: ${resumen.terminadas}`;
}

function crearElementoTarea(tarea) {
  const item = document.createElement("li");
  item.className = "task";
  item.classList.toggle("done", tarea.completada);

  const texto = document.createElement("span");
  texto.className = "title";
  texto.textContent = tarea.titulo; // textContent evita inyectar HTML

  const acciones = document.createElement("span");
  acciones.className = "task-actions";
  acciones.append(
    crearBoton(tarea.completada ? "Reabrir" : "Completar", "cambiar", tarea.id),
    crearBoton("Eliminar", "eliminar", tarea.id)
  );

  item.append(texto, acciones);
  return item;
}

function crearBoton(texto, accion, id) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.textContent = texto;
  boton.dataset.accion = accion;
  boton.dataset.id = id;
  return boton;
}

render();

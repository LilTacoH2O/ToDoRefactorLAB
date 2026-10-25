/*
 * MISIÓN 9 · ADAPTADOR DE INTERFAZ
 * Flujo: evento -> función de dominio -> nuevo estado -> render() -> DOM
 */
import {
  crearTarea,
  agregarTarea,
  cambiarEstado,
  eliminarTarea,
  filtrarPorEstado,
  obtenerResumen,
  generarId
} from "./taskService.js";

// ESTADO
let tareas = [
  { id: 1, titulo: "Revisar requisitos", completada: false },
  { id: 2, titulo: "Diseñar pruebas", completada: false },
  { id: 3, titulo: "Refactorizar código", completada: false }
];
let filtro = "todas";

// REFERENCIAS AL DOM
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const message = document.querySelector("#message");
const summary = document.querySelector("#summary");
const filters = [...document.querySelectorAll("[data-filter]")];

// EVENTOS
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const titulo = input.value.trim();
  if (titulo === "") {
    message.textContent = "Escribe un título antes de agregar.";
    return;
  }
  tareas = agregarTarea(tareas, crearTarea(generarId(tareas), titulo));
  input.value = "";
  message.textContent = "";
  render();
});

list.addEventListener("click", (event) => {
  const boton = event.target.closest("button[data-accion]");
  if (!boton) return;
  const id = Number(boton.dataset.id);
  if (boton.dataset.accion === "cambiar") tareas = cambiarEstado(tareas, id);
  if (boton.dataset.accion === "eliminar") tareas = eliminarTarea(tareas, id);
  render();
});

filters.forEach(button => button.addEventListener("click", () => {
  filtro = button.dataset.filter;
  filters.forEach(b => b.classList.toggle("active", b === button));
  message.textContent = "";
  render();
}));

// RENDER
function render() {
  const v = filtrarPorEstado(tareas, filtro);
  list.innerHTML = "";
  v.forEach(t => {
    const li = document.createElement("li");
    li.className = t.completada ? "task done" : "task";
    const span = document.createElement("span");
    span.className = "title";
    span.textContent = t.titulo;
    const acciones = document.createElement("span");
    acciones.className = "task-actions";
    const b1 = document.createElement("button");
    b1.textContent = t.completada ? "Reabrir" : "Completar";
    b1.dataset.accion = "cambiar";
    b1.dataset.id = t.id;
    const b2 = document.createElement("button");
    b2.textContent = "Eliminar";
    b2.dataset.accion = "eliminar";
    b2.dataset.id = t.id;
    acciones.append(b1, b2);
    li.append(span, acciones);
    list.appendChild(li);
  });
  const r = obtenerResumen(tareas);
  summary.textContent = `Total: ${r.total} · Pendientes: ${r.pendientes} · Terminadas: ${r.terminadas}`;
}

render();
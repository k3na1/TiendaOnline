// admin/productos.js
// Página simple de productos: listar, buscar, crear/editar/eliminar (localStorage).
// Depende de ../js/productos.js (arreglo "productos" como semilla).

const KEY_PRODUCTOS = "productos";
let PRODUCTOS = [];
let editIndex = null;

// -------- Storage --------
function loadProductos() {
  const raw = localStorage.getItem(KEY_PRODUCTOS);
  if (raw) { try { return JSON.parse(raw); } catch {} }
  localStorage.setItem(KEY_PRODUCTOS, JSON.stringify(productos || []));
  return [...(productos || [])];
}
function saveProductos(arr){ localStorage.setItem(KEY_PRODUCTOS, JSON.stringify(arr)); }

// -------- Render tabla + búsqueda --------
function renderTabla() {
  const tbody = document.querySelector("#tabla tbody");
  if (!tbody) return;

  const q = (document.getElementById("buscador").value || "").trim().toLowerCase();

  const data = PRODUCTOS.filter(p => {
    if (!q) return true;
    return p.id.toLowerCase().includes(q) || p.nombre.toLowerCase().includes(q);
  });

  tbody.innerHTML = "";
  data.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="badge">${p.id}</span></td>
      <td>${p.nombre}</td>
      <td>$${Number(p.precio||0).toLocaleString('es-CL')}</td>
      <td>${Number(p.stock||0)}</td>
      <td>${p.imagen ? `<img class="img-thumb" src="${p.imagen}" alt="${p.nombre}">` : "-"}</td>
      <td>
        <button class="btn-ghost" data-act="edit" data-id="${p.id}">Editar</button>
        <button class="btn-ghost" data-act="del" data-id="${p.id}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Acciones
  tbody.querySelectorAll("button[data-act]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const act = e.currentTarget.getAttribute("data-act");
      const id = e.currentTarget.getAttribute("data-id");
      const idx = PRODUCTOS.findIndex(x => x.id === id);
      if (idx === -1) return;
      if (act === "edit") abrirModal(idx);
      if (act === "del") eliminar(idx);
    });
  });
}

// -------- Modal & validación --------
const dlg = document.getElementById("modal");
const form = document.getElementById("form");
const errBox = document.getElementById("form-error");

function abrirModal(index = null) {
  editIndex = index;
  document.getElementById("form-titulo").textContent = index === null ? "Nuevo producto" : "Editar producto";
  if (index === null) {
    form.reset();
  } else {
    const p = PRODUCTOS[index];
    document.getElementById("p-id").value = p.id;
    document.getElementById("p-nombre").value = p.nombre;
    document.getElementById("p-descripcion").value = p.descripcion || "";
    document.getElementById("p-precio").value = Number(p.precio||0);
    document.getElementById("p-stock").value = Number(p.stock||0);
    document.getElementById("p-imagen").value = p.imagen || "";
  }
  errBox.style.display = "none";
  dlg.showModal();
}
function cerrarModal(){ dlg.close(); }
document.getElementById("btn-cancelar").addEventListener("click", cerrarModal);

function validar(p){
  if (!p.id) return "ID requerido.";
  if (!p.nombre) return "Nombre requerido.";
  if (p.precio === "" || isNaN(p.precio) || Number(p.precio) < 0) return "Precio inválido.";
  if (p.stock === "" || isNaN(p.stock) || Number(p.stock) < 0) return "Stock inválido.";
  // ID único (si creamos o cambiamos ID)
  const repetido = PRODUCTOS.some((x, i) => x.id === p.id && i !== editIndex);
  if (repetido) return "Ya existe un producto con ese ID.";
  return null;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nuevo = {
    id: document.getElementById("p-id").value.trim().toUpperCase(),
    nombre: document.getElementById("p-nombre").value.trim(),
    descripcion: document.getElementById("p-descripcion").value.trim(),
    precio: Number(document.getElementById("p-precio").value),
    stock: Number(document.getElementById("p-stock").value),
    imagen: document.getElementById("p-imagen").value.trim(),
  };
  const msg = validar(nuevo);
  if (msg){
    errBox.textContent = msg;
    errBox.style.display = "block";
    return;
  }

  if (editIndex === null) PRODUCTOS.push(nuevo);
  else PRODUCTOS[editIndex] = nuevo;

  saveProductos(PRODUCTOS);
  renderTabla();
  cerrarModal();
});

function eliminar(index){
  const p = PRODUCTOS[index];
  if (!confirm(`Eliminar "${p.nombre}" (${p.id})?`)) return;
  PRODUCTOS.splice(index, 1);
  saveProductos(PRODUCTOS);
  renderTabla();
}

// -------- Init --------
document.addEventListener("DOMContentLoaded", () => {
  PRODUCTOS = loadProductos();

  // eventos
  document.getElementById("btn-nuevo").addEventListener("click", () => abrirModal(null));
  document.getElementById("buscador").addEventListener("input", renderTabla);

  renderTabla();
});

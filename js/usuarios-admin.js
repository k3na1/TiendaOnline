const KEY_USUARIOS = "usuarios";

let USUARIOS = [];
let editIndex = null;

// ---------------- Storage ----------------
function loadUsuarios() {
  const raw = localStorage.getItem(KEY_USUARIOS);
  if (raw) { try { return JSON.parse(raw); } catch {} }
  localStorage.setItem(KEY_USUARIOS, JSON.stringify(usuariosBase || []));
  return [...(usuariosBase || [])];
}
function saveUsuarios(arr) {
  localStorage.setItem(KEY_USUARIOS, JSON.stringify(arr));
}

// ---------------- Helpers UI ----------------
function setText(id, v){ const el = document.getElementById(id); if (el) el.textContent = v; }
function normalizarTipo(t) {
  const s = (t || "").trim().toLowerCase();
  if (s.startsWith("admin")) return "Administrador";
  if (s === "vendedor") return "Vendedor";
  if (s === "cliente") return "Cliente";
  return "Cliente";
}

// ---------------- Resumen por tipo ----------------
function renderResumen() {
  const total = USUARIOS.length;
  const vendedores = USUARIOS.filter(u => (u.tipo||"").trim().toLowerCase() === "vendedor").length;
  const clientes = USUARIOS.filter(u => (u.tipo||"").trim().toLowerCase() === "cliente").length;

  setText("sum-total", total);
  setText("sum-vendedores", vendedores);
  setText("sum-clientes", clientes);
}

// ---------------- Tabla + filtros ----------------
function renderTabla() {
  const tbody = document.querySelector("#tabla tbody");
  if (!tbody) return;

  const q = document.getElementById("buscador").value.trim().toLowerCase();
  const tipo = document.getElementById("filtro-tipo").value;

  const data = USUARIOS.filter(u => {
    const coincideTexto = !q || u.run.toLowerCase().includes(q)
      || (u.nombre + " " + u.apellidos).toLowerCase().includes(q)
      || u.correo.toLowerCase().includes(q);
    const coincideTipo = !tipo || u.tipo === tipo;
    return coincideTexto && coincideTipo;
  });

  tbody.innerHTML = "";
  data.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="badge">${u.run}</span></td>
      <td>${u.nombre} ${u.apellidos}</td>
      <td>${u.correo}</td>
      <td>${u.tipo}</td>
      <td>
        <button class="btn-ghost" data-act="edit" data-run="${u.run}">Editar</button>
        <button class="btn-ghost" data-act="del" data-run="${u.run}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Acciones
  tbody.querySelectorAll("button[data-act]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const act = e.currentTarget.getAttribute("data-act");
      const run = e.currentTarget.getAttribute("data-run");
      const idx = USUARIOS.findIndex(x => x.run === run);
      if (idx === -1) return;
      if (act === "edit") abrirModal(idx);
      if (act === "del") eliminar(idx);
    });
  });
}

// ---------------- Modal CRUD ----------------
const dlg = document.getElementById("modal");
const form = document.getElementById("form");
const errBox = document.getElementById("form-error");

function abrirModal(index = null) {
  editIndex = index;
  document.getElementById("form-titulo").textContent = index === null ? "Nuevo usuario" : "Editar usuario";
  if (index === null) {
    form.reset();
  } else {
    const u = USUARIOS[index];
    document.getElementById("f-run").value = u.run;
    document.getElementById("f-tipo").value = u.tipo;
    document.getElementById("f-nombre").value = u.nombre;
    document.getElementById("f-apellidos").value = u.apellidos;
    document.getElementById("f-correo").value = u.correo;
    document.getElementById("f-pass").value = u.password;
  }
  errBox.style.display = "none";
  dlg.showModal();
}
function cerrarModal(){ dlg.close(); }
document.getElementById("btn-cancelar").addEventListener("click", cerrarModal);

// Validaciones básicas (simples y claras)
const dominiosOK = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
function validar(u) {
  if (!u.run) return "RUN requerido.";
  if (!u.tipo) return "Tipo de usuario requerido.";
  if (!u.nombre) return "Nombre requerido.";
  if (!u.apellidos) return "Apellidos requeridos.";
  if (!u.correo) return "Correo requerido.";
  if (!dominiosOK.some(d => u.correo.endsWith(d))) return "Dominio de correo no permitido.";
  if (!u.password || u.password.length < 4 || u.password.length > 10) return "Password: 4 a 10 caracteres.";
  const repetido = USUARIOS.some((x, i) => x.run === u.run && i !== editIndex);
  if (repetido) return "Ya existe un usuario con ese RUN.";
  return null;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nuevo = {
    run: document.getElementById("f-run").value.trim().toUpperCase(),
    tipo: normalizarTipo(document.getElementById("f-tipo").value),
    nombre: document.getElementById("f-nombre").value.trim(),
    apellidos: document.getElementById("f-apellidos").value.trim(),
    correo: document.getElementById("f-correo").value.trim().toLowerCase(),
    password: document.getElementById("f-pass").value
  };
  const msg = validar(nuevo);
  if (msg) {
    errBox.textContent = msg;
    errBox.style.display = "block";
    return;
  }

  if (editIndex === null) USUARIOS.push(nuevo);
  else USUARIOS[editIndex] = nuevo;

  saveUsuarios(USUARIOS);
  renderResumen();
  renderTabla();
  cerrarModal();
});

function eliminar(index) {
  const u = USUARIOS[index];
  if (!confirm(`Eliminar a ${u.nombre} ${u.apellidos} (${u.run})?`)) return;
  USUARIOS.splice(index, 1);
  saveUsuarios(USUARIOS);
  renderResumen();
  renderTabla();
}

// ---------------- Init ----------------
document.addEventListener("DOMContentLoaded", () => {
  USUARIOS = loadUsuarios();

  // Eventos de filtros
  document.getElementById("buscador").addEventListener("input", renderTabla);
  document.getElementById("filtro-tipo").addEventListener("change", renderTabla);
  document.getElementById("btn-nuevo").addEventListener("click", () => abrirModal(null));

  renderResumen();
  renderTabla();
});

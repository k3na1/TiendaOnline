// admin/admin.js
// Dashboard: KPIs + preview de usuarios (solo lectura)

const KEY_USUARIOS = "usuarios";
const KEY_PRODUCTOS = "productos";

let USUARIOS = [];
let PRODUCTOS = [];

// ---------- Storage ----------
function loadUsuarios() {
  const raw = localStorage.getItem(KEY_USUARIOS);
  if (raw) { try { return JSON.parse(raw); } catch {} }
  localStorage.setItem(KEY_USUARIOS, JSON.stringify(usuariosBase || []));
  return [...(usuariosBase || [])];
}
function loadProductos() {
  const raw = localStorage.getItem(KEY_PRODUCTOS);
  if (raw) { try { return JSON.parse(raw); } catch {} }
  localStorage.setItem(KEY_PRODUCTOS, JSON.stringify(productos || []));
  return [...(productos || [])];
}

// ---------- KPIs ----------
function setText(id, v){ const el = document.getElementById(id); if (el) el.textContent = v; }

function renderKPIs() {
  const total = USUARIOS.length;
  const vendedores = USUARIOS.filter(u => (u.tipo||"") === "Vendedor").length;
  const clientes = USUARIOS.filter(u => (u.tipo||"") === "Cliente").length;

  const totalProductos = PRODUCTOS.length;
  const stockTotal = PRODUCTOS.reduce((s, p) => s + (Number(p.stock) || 0), 0);

  setText("kpi-usuarios", total);
  setText("kpi-vendedores", vendedores);
  setText("kpi-clientes", clientes);
  setText("kpi-productos", totalProductos);
  setText("kpi-stock", stockTotal);
}

// ---------- Tabla (preview) ----------
function renderTablaPreview() {
  const tbody = document.querySelector("#tabla tbody");
  if (!tbody) return;

  const q = (document.getElementById("buscador")?.value || "").trim().toLowerCase();

  // Filtra y muestra solo 5
  const data = USUARIOS
    .filter(u => {
      if (!q) return true;
      return (
        u.run.toLowerCase().includes(q) ||
        (u.nombre + " " + u.apellidos).toLowerCase().includes(q) ||
        u.correo.toLowerCase().includes(q)
      );
    })
    .slice(0, 5);

  tbody.innerHTML = "";
  data.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="badge">${u.run}</span></td>
      <td>${u.nombre} ${u.apellidos}</td>
      <td>${u.correo}</td>
      <td>${u.tipo}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  USUARIOS = loadUsuarios();
  PRODUCTOS = loadProductos();

  renderKPIs();
  renderTablaPreview();

  const busc = document.getElementById("buscador");
  busc.addEventListener("input", renderTablaPreview);

  document.getElementById("btn-ver-todos").addEventListener("click", () => {
    location.href = "./usuarios.html";
  });
});

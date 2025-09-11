
const ADMIN_KEY_USUARIOS = "usuarios";
const ADMIN_KEY_PRODUCTOS = "productos";


// =============================
// FUNCIONES DE CARGA
// =============================

// Cargar usuarios desde localStorage o fallback
function loadUsuarios() {
  const raw = localStorage.getItem(ADMIN_KEY_USUARIOS);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("Error parseando usuarios:", e);
    }
  }
  if (typeof usuariosBase !== "undefined") {
    localStorage.setItem(ADMIN_KEY_USUARIOS, JSON.stringify(usuariosBase));
    return [...usuariosBase];
  }
  return [];
}

// Cargar productos desde localStorage o fallback
function loadProductos() {
  const raw = localStorage.getItem(ADMIN_KEY_PRODUCTOS);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("Error parseando productos:", e);
    }
  }
  if (typeof productosBase !== "undefined") {
    localStorage.setItem(ADMIN_KEY_PRODUCTOS, JSON.stringify(productosBase));
    return [...productosBase];
  }
  return [];
}

// =============================
// VARIABLES GLOBALES
// =============================
let USUARIOS = loadUsuarios();
let PRODUCTOS = loadProductos();

// =============================
// RENDER DE KPIs
// =============================
function renderKPIs() {
  const totalUsuarios = USUARIOS.length;
  const totalVendedores = USUARIOS.filter(u => u.tipo === "Vendedor").length;
  const totalClientes = USUARIOS.filter(u => u.tipo === "Cliente").length;
  const totalProductos = PRODUCTOS.length;
  const totalStock = PRODUCTOS.reduce((acc, p) => acc + (p.stock || 0), 0);

  document.getElementById("kpi-usuarios").textContent = totalUsuarios;
  document.getElementById("kpi-vendedores").textContent = totalVendedores;
  document.getElementById("kpi-clientes").textContent = totalClientes;
  document.getElementById("kpi-productos").textContent = totalProductos;
  document.getElementById("kpi-stock").textContent = totalStock;
}

// =============================
// RENDER DE USUARIOS RECIENTES
// =============================
function renderUsuariosRecientes() {
  const container = document.getElementById("tabla-usuarios-recientes");
  if (!container) return;

  container.innerHTML = "";

  if (USUARIOS.length === 0) {
    container.innerHTML = `
      <tr><td colspan="4">Sin usuarios registrados</td></tr>
    `;
    return;
  }

  USUARIOS.slice(0, 5).forEach(usuario => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${usuario.run}</td>
      <td>${usuario.nombre} ${usuario.apellidos || ""}</td>
      <td>${usuario.correo}</td>
      <td>${usuario.tipo}</td>
    `;
    container.appendChild(tr);
  });
}

// =============================
// EVENTOS
// =============================
document.addEventListener("DOMContentLoaded", () => {
  // Render inicial
  renderKPIs();
  renderUsuariosRecientes();

  // Botón cerrar sesión
  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("usuarioLogueado");
      window.location.href = "../index.html";
    });
  }

  // Botón "Ver todos"
  const btnVerTodos = document.getElementById("btn-ver-todos");
  if (btnVerTodos) {
    btnVerTodos.addEventListener("click", () => {
      window.location.href = "./usuarios.html";
    });
  }
});


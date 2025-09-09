document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Obtener valores
    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value.trim();

    // Limpiar errores
    document.querySelectorAll(".error").forEach(el => el.textContent = "");

    let valido = true;

    // Validación correo
    if (correo.length === 0) {
      document.getElementById("errorCorreo").textContent = "El correo es obligatorio";
      valido = false;
    }

    // Validación contraseña
    if (password.length === 0) {
      document.getElementById("errorPassword").textContent = "La contraseña es obligatoria";
      valido = false;
    }

    if (!valido) return;

    // ==============================
    // Unir usuarios base + registrados
    // ==============================
    const usuariosRegistrados = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuariosTotales = [...usuariosBase, ...usuariosRegistrados];

    // Buscar coincidencia
    const usuario = usuariosTotales.find(u => u.correo === correo && u.password === password);

    if (!usuario) {
      alert("Correo o contraseña incorrectos ❌");
      return;
    }

    // Guardar sesión
    localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));

    alert(`Bienvenido ${usuario.nombre} 👋 (Rol: ${usuario.tipo})`);

    // Redirección según rol
    if (usuario.tipo === "Administrador") {
      window.location.href = "/TiendaOnline/admin/index.html";
    } else if (usuario.tipo === "Vendedor") {
      window.location.href = "/TiendaOnline/admin/productos.html";
    } else {
      window.location.href = "/TiendaOnline/tienda/index.html";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const navbarAuth = document.getElementById("navbarAuth");

  // Verificar si hay usuario logueado
  const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

  if (usuarioLogueado) {
    // Mostrar bienvenida + cerrar sesión
    navbarAuth.innerHTML = `
      <span style="color: #fff; font-weight: bold;">
        Bienvenido, ${usuarioLogueado.nombre}
      </span>
      <a href="#" id="logoutBtn">Cerrar sesión</a>
    `;

    // Agregar evento al botón de cerrar sesión
    document.getElementById("logoutBtn").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("usuarioLogueado");
      window.location.href = "/TiendaOnline/tienda/index.html"; // Redirigir al inicio
    });
  } else {
    // Mostrar botones normales
    navbarAuth.innerHTML = `
      <a href="/TiendaOnline/tienda/registro.html">Registro</a>
      <a href="/TiendaOnline/tienda/login.html">Login</a>
    `;
  }
});

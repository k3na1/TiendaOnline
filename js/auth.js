// admin/auth.js
document.addEventListener("DOMContentLoaded", () => {
  const data = localStorage.getItem("usuarioLogueado");
  const user = data ? JSON.parse(data) : null;

  if (!user) {
    // Sin sesión → al login
    window.location.href = "../tienda/login.html";
    return;
  }

  const rol = (user.tipo || "").trim();
  const page = window.location.pathname.split("/").pop();

  // Si es Vendedor: solo puede estar en productos.html
  if (rol === "Vendedor") {
    // Oculta botones de Dashboard y Usuarios si existen en el sidebar
    const linkDashboard = document.querySelector('a[href="./index.html"]');
    const linkUsuarios  = document.querySelector('a[href="./usuarios.html"]');
    if (linkDashboard) linkDashboard.style.display = "none";
    if (linkUsuarios)  linkUsuarios.style.display = "none";

    // Forzar que solo vea productos.html
    if (page !== "productos.html") {
      window.location.href = "./productos.html";
      return;
    }
  }

  // Si es Cliente: no debería estar en admin
  if (rol === "Cliente") {
    window.location.href = "../index.html";
    return;
  }

  // Botón de cerrar sesión
    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
    btnLogout.addEventListener("click", () => {
        localStorage.removeItem("usuarioLogueado"); // limpiar sesión
        window.location.href = "/TiendaOnline/tienda/index.html";     // redirigir a inicio tienda
    });
    }

  
});

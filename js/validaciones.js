document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // Datos auxiliares
  // =========================
  const regiones = {
    "Metropolitana": ["Santiago", "Puente Alto", "Maipú"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué"],
    "Biobío": ["Concepción", "Talcahuano", "Los Ángeles"]
  };

  const regionSelect = document.getElementById("region");
  const comunaSelect = document.getElementById("comuna");

  // =========================
  // Cargar regiones y comunas
  // =========================
  for (let region in regiones) {
    const option = document.createElement("option");
    option.value = region;
    option.textContent = region;
    regionSelect.appendChild(option);
  }

  regionSelect.addEventListener("change", () => {
    comunaSelect.innerHTML = "<option value=''>Seleccione comuna</option>";
    if (regionSelect.value) {
      regiones[regionSelect.value].forEach(comuna => {
        const option = document.createElement("option");
        option.value = comuna;
        option.textContent = comuna;
        comunaSelect.appendChild(option);
      });
    }
  });

  // =========================
  // Funciones de usuarios
  // =========================
  function getUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
  }

  function saveUsuario(usuario) {
    let usuarios = getUsuarios();

    // Validar RUN duplicado
    if (usuarios.some(u => u.run === usuario.run)) {
      alert("El RUN ya está registrado ❌");
      return false;
    }

    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    return true;
  }

  // =========================
  // Validaciones del formulario
  // =========================
  document.getElementById("registroForm").addEventListener("submit", (e) => {
    e.preventDefault();
    let valido = true;

    // Obtener valores
    const run = document.getElementById("run").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const fecha = document.getElementById("fecha").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const region = document.getElementById("region").value;
    const comuna = document.getElementById("comuna").value;
    const password = document.getElementById("password").value.trim();
    const tipo = "Cliente"; // Siempre se registra como Cliente


    // Limpiar errores
    document.querySelectorAll(".error").forEach(el => el.textContent = "");

    // RUN
    if (!/^[0-9]{7,8}[0-9Kk]$/.test(run)) {
      document.getElementById("errorRun").textContent = "RUN inválido (sin puntos ni guion, ej: 19011022K)";
      valido = false;
    }

    // Nombre
    if (nombre.length === 0 || nombre.length > 50) {
      document.getElementById("errorNombre").textContent = "El nombre es obligatorio (máx. 50 caracteres)";
      valido = false;
    }

    // Apellidos
    if (apellidos.length === 0 || apellidos.length > 100) {
      document.getElementById("errorApellidos").textContent = "Los apellidos son obligatorios (máx. 100 caracteres)";
      valido = false;
    }

    // Correo
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    if (!emailRegex.test(correo)) {
      document.getElementById("errorCorreo").textContent = "Correo inválido (solo @duoc.cl, @profesor.duoc.cl o @gmail.com)";
      valido = false;
    }

    // Dirección
    if (direccion.length === 0 || direccion.length > 300) {
      document.getElementById("errorDireccion").textContent = "La dirección es obligatoria (máx. 300 caracteres)";
      valido = false;
    }

    // Región y comuna
    if (!region) {
      alert("Debe seleccionar una región");
      valido = false;
    }
    if (!comuna) {
      alert("Debe seleccionar una comuna");
      valido = false;
    }

    // Contraseña
    if (password.length < 4 || password.length > 10) {
      document.getElementById("errorPassword").textContent = "La contraseña debe tener entre 4 y 10 caracteres";
      valido = false;
    }

    // Si es válido, guardar en localStorage
    if (valido) {
      const nuevoUsuario = {
        run,
        nombre,
        apellidos,
        correo,
        fecha,
        direccion,
        region,
        comuna,
        tipo,
        password
      };

      if (saveUsuario(nuevoUsuario)) {
        alert("Registro exitoso ✅");
        document.getElementById("registroForm").reset();
      }
    }
  });
});

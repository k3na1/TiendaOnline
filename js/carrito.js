// js/carrito.js

const KEY_CARRITO = "carrito";

document.addEventListener("DOMContentLoaded", () => {
    // Solo ejecutar en la página del carrito
    if (window.location.pathname.endsWith("carrito.html")) {
        renderizarCarrito();

        // Eventos para botones de resumen
        const btnVaciar = document.getElementById("btn-vaciar");
        const btnComprar = document.getElementById("btn-comprar");

        if (btnVaciar) {
            btnVaciar.addEventListener("click", vaciarCarrito);
        }
        if (btnComprar) {
            btnComprar.addEventListener("click", () => {
                alert("Gracias por tu compra!");
                vaciarCarrito();
            });
        }
    }
});

function getCarrito() {
    return JSON.parse(localStorage.getItem(KEY_CARRITO)) || [];
}

function saveCarrito(carrito) {
    localStorage.setItem(KEY_CARRITO, JSON.stringify(carrito));
}

function renderizarCarrito() {
  const carrito = getCarrito();
  const container = document.getElementById("carrito-container");
  const resumenContainer = document.getElementById("carrito-resumen");

  if (!container || !resumenContainer) return;

  if (carrito.length === 0) {
    container.innerHTML = "<p id='mensaje-carrito-vacio'>Tu carrito está vacío.</p>";
    resumenContainer.style.display = "none";
    return;
  }

  resumenContainer.style.display = "block";
  container.innerHTML = "";

  let subtotal = 0;

  carrito.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "carrito-item";
    itemDiv.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}">
      <div class="carrito-item-info">
        <h3>${item.nombre}</h3>
        <p>Precio: $${item.precio.toLocaleString('es-CL')}</p>
      </div>
      <div class="carrito-item-actions">
        <input type="number" value="${item.cantidad}" min="1" max="${item.stock}" data-id="${item.id}" class="item-cantidad">
        <p>Subtotal: <strong>$${(item.cantidad * item.precio).toLocaleString('es-CL')}</strong></p>
        <button data-id="${item.id}" class="btn-eliminar">Eliminar</button>
      </div>
    `;
    container.appendChild(itemDiv);

    subtotal += item.cantidad * item.precio;
  });

  // Mostrar resumen
  document.getElementById("subtotal-precio").textContent =
    `$${subtotal.toLocaleString("es-CL")}`;

  const envio = 4000;
  document.getElementById("envio-precio").textContent =
    `$${envio.toLocaleString("es-CL")}`;

  const total = subtotal + envio;
  document.getElementById("total-precio").textContent =
    `$${total.toLocaleString("es-CL")}`;

  // Eventos eliminar y actualizar
  document.querySelectorAll(".btn-eliminar").forEach(btn => {
    btn.addEventListener("click", (e) => eliminarDelCarrito(e.target.getAttribute("data-id")));
  });

  document.querySelectorAll(".item-cantidad").forEach(input => {
    input.addEventListener("change", (e) => {
      const id = e.target.getAttribute("data-id");
      const cantidad = parseInt(e.target.value);
      actualizarCantidad(id, cantidad);

  });
});
}

      
function eliminarDelCarrito(id) {
    let carrito = getCarrito();
    carrito = carrito.filter(item => item.id !== id);
    saveCarrito(carrito);
    renderizarCarrito();
}

function actualizarCantidad(id, cantidad) {
    let carrito = getCarrito();
    const item = carrito.find(p => p.id === id);
    if (item) {
        if (cantidad > 0 && cantidad <= item.stock) {
            item.cantidad = cantidad;
        } else if (cantidad > item.stock) {
            alert(`Stock máximo: ${item.stock} unidades.`);
            item.cantidad = item.stock; // Ajusta a la cantidad máxima
        }
    }
    saveCarrito(carrito);
    renderizarCarrito();
}

function vaciarCarrito() {
    localStorage.removeItem(KEY_CARRITO);
    renderizarCarrito();
}

function agregarAlCarrito(producto, cantidad) {
    let carrito = getCarrito();
    const itemExistente = carrito.find(item => item.id === producto.id);

    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({ ...producto, cantidad: cantidad });
    }

    saveCarrito(carrito);
    alert(`${cantidad} "${producto.nombre}" añadido(s) al carrito.`);
    // Opcional: actualizar un contador en el header
}
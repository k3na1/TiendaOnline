// EN: js/productos.js

/**
 * Función para mostrar los productos en la página productos.html
 */
function renderizarListaProductos() {
    const container = document.getElementById('productos-container');
    if (!container) {
        console.error("El contenedor de productos no se encontró en productos.html");
        return;
    }

    container.innerHTML = ''; // Limpiamos el contenedor

    // Obtenemos los productos desde localStorage para reflejar los cambios del admin
    const productosDesdeStorage = JSON.parse(localStorage.getItem("productos")) || productos;

    productosDesdeStorage.forEach(producto => {
        const productoCard = document.createElement('div');
        productoCard.className = 'producto-card'; // Asignamos la clase principal

        // Creamos el contenido HTML de la nueva tarjeta mejorada
        productoCard.innerHTML = `
            <div class="producto-imagen-wrap">
                <img src="${producto.imagen}" alt="${producto.nombre}">
            </div>
            <div class="producto-info">
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <p class="producto-precio">$${producto.precio.toLocaleString('es-CL')}</p>
                <button class="btn-ver-detalle" data-id="${producto.id}">Ver Detalle</button>
            </div>
        `;

        // Añadimos la tarjeta al contenedor
        container.appendChild(productoCard);
    });

    // Añadimos el evento de clic a los botones "Ver Detalle"
    document.querySelectorAll('.btn-ver-detalle').forEach(button => {
        button.addEventListener('click', (event) => {
            const productoId = event.target.getAttribute('data-id');
            window.location.href = `producto-detalle.html?id=${productoId}`;
        });
    });
}
// /js/productos.js

// 1. LISTA DE PRODUCTOS (ARREGLO DE OBJETOS)
// Este es el arreglo de productos que se usará para mostrar en la tienda.
const KEY_PRODUCTOS = "productos";

// Productos base (solo se usarán si no hay nada en localStorage)
const productosBase = [
    {
        id: "SKU001",
        nombre: "Café de Grano Clásico",
        descripcion: "Un café equilibrado y suave, perfecto para empezar el día. Notas de chocolate y nuez.",
        precio: 12000,
        stock: 50,
        imagen: "https://via.placeholder.com/300x300.png?text=Cafe+Clasico"
    },
    {
        id: "SKU002",
        nombre: "Café de Origen Único Etiopía",
        descripcion: "Café de especialidad con notas florales y cítricas. Acidez brillante y cuerpo ligero.",
        precio: 18000,
        stock: 30,
        imagen: "https://via.placeholder.com/300x300.png?text=Cafe+Etiopia"
    },
    {
        id: "SKU003",
        nombre: "Prensa Francesa de Acero",
        descripcion: "Prepara tu café favorito con esta elegante y duradera prensa francesa de 800ml.",
        precio: 25000,
        stock: 25,
        imagen: "https://via.placeholder.com/300x300.png?text=Prensa+Francesa"
    },
    {
        id: "SKU004",
        nombre: "Molinillo de Café Manual",
        descripcion: "Muele tus granos de café al momento para una frescura y aroma inigualables.",
        precio: 22000,
        stock: 40,
        imagen: "https://via.placeholder.com/300x300.png?text=Molinillo"
    }
];

// Función para cargar productos desde localStorage o base
function loadProductos() {
    const raw = localStorage.getItem(KEY_PRODUCTOS);
    if (raw) {
        try {
            return JSON.parse(raw);
        } catch (e) {
            console.error("Error parseando productos de localStorage:", e);
        }
    }
    // Si no hay nada en localStorage, inicializamos
    localStorage.setItem(KEY_PRODUCTOS, JSON.stringify(productosBase));
    return [...productosBase];
}

// Variable global con la lista actual
let productos = loadProductos();

// 2. LÓGICA PARA RENDERIZAR (DIBUJAR) LOS PRODUCTOS

// Espera a que el DOM (la estructura de la página) esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Verificamos en qué página estamos para ejecutar el código correspondiente
    const path = window.location.pathname.split("/").pop(); // Obtiene el nombre del archivo HTML

    if (path === 'productos.html') {
        renderizarListaProductos();
    } else if (path === 'producto-detalle.html') {
        renderizarDetalleProducto();
    }
});


/**
 * Función para mostrar los productos en la página productos.html
 */
function renderizarListaProductos() {
    const container = document.getElementById('productos-container');
    if (!container) {
        console.error("El contenedor de productos no se encontró en productos.html");
        return;
    }

    // Limpiamos el contenedor por si acaso
    container.innerHTML = '';

    // Recorremos el arreglo de productos y creamos una tarjeta para cada uno
    productos.forEach(producto => {
        const productoCard = document.createElement('div');
        productoCard.className = 'producto-card'; // Asignamos una clase para el CSS

        // Creamos el contenido HTML de la tarjeta
        productoCard.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio.toLocaleString('es-CL')}</p>
            <button class="btn-ver-detalle" data-id="${producto.id}">Ver Detalle</button>
        `;

        // Añadimos la tarjeta al contenedor
        container.appendChild(productoCard);
    });

    // Añadimos el evento de clic a los botones "Ver Detalle"
    document.querySelectorAll('.btn-ver-detalle').forEach(button => {
        button.addEventListener('click', (event) => {
            const productoId = event.target.getAttribute('data-id');
            // Redirigimos a la página de detalle, pasando el ID del producto en la URL
            window.location.href = `producto-detalle.html?id=${productoId}`;
        });
    });
}


/**
 * Función para mostrar el detalle de un producto en la página producto-detalle.html
 */
function renderizarDetalleProducto() {
    const container = document.getElementById('producto-detalle-container');
     if (!container) {
        console.error("El contenedor de detalle de producto no se encontró en producto-detalle.html");
        return;
    }

    // Obtenemos el ID del producto de la URL
    const params = new URLSearchParams(window.location.search);
    const productoId = params.get('id');

    if (!productoId) {
        container.innerHTML = '<p>Producto no encontrado. Por favor, seleccione un producto válido.</p>';
        return;
    }

    // Buscamos el producto en nuestro arreglo
    const producto = productos.find(p => p.id === productoId);

    if (!producto) {
        container.innerHTML = '<p>Producto no encontrado. Por favor, seleccione un producto válido.</p>';
        return;
    }

    // Creamos el HTML para el detalle del producto
    container.innerHTML = `
        <div class="detalle-img">
            <img src="${producto.imagen}" alt="${producto.nombre}">
        </div>
        <div class="detalle-info">
            <h2>${producto.nombre}</h2>
            <p class="precio">$${producto.precio.toLocaleString('es-CL')}</p>
            <p class="descripcion">${producto.descripcion}</p>
            <div class="cantidad-selector">
                <label for="cantidad">Cantidad:</label>
                <input type="number" id="cantidad" name="cantidad" value="1" min="1" max="${producto.stock}">
            </div>
            <button class="btn-agregar-carrito" data-id="${producto.id}">Añadir al Carrito</button>
        </div>
    `;

    
}
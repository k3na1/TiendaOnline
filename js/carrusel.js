
// /js/carrusel.js
document.addEventListener('DOMContentLoaded', () => {
  // ===== Carrusel =====
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.carrusel-btn.prev');
  const nextBtn = document.querySelector('.carrusel-btn.next');
  let index = 0;

  function showSlide(i) {
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === i);
    });
  }

  if (prevBtn && nextBtn && slides.length) {
    prevBtn.addEventListener('click', () => {
      index = (index - 1 + slides.length) % slides.length;
      showSlide(index);
    });
    nextBtn.addEventListener('click', () => {
      index = (index + 1) % slides.length;
      showSlide(index);
    });
    setInterval(() => {
      index = (index + 1) % slides.length;
      showSlide(index);
    }, 4000);
  }

  // ===== Productos destacados =====
  const container = document.getElementById('destacados-container');
  if (!container) return;

  // Tomar productos desde getProductos() si existe; si no, fallback a localStorage o productosBase
  const lista = (typeof window.getProductos === 'function')
    ? window.getProductos()
    : (() => {
        const raw = localStorage.getItem('productos');
        if (raw) {
          try { return JSON.parse(raw); } catch (e) {}
        }
        // último fallback: si existe productosBase en window
        return Array.isArray(window.productosBase) ? window.productosBase.slice() : [];
      })();

  const destacados = lista.slice(0, 3); // muestra 3, ajusta si quieres
  container.innerHTML = '';
  destacados.forEach(p => {
    const card = document.createElement('div');
    card.className = 'producto-card';
    card.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>$${Number(p.precio || 0).toLocaleString('es-CL')}</p>
      <a href="producto-detalle.html?id=${p.id}" class="btn">Ver más</a>
    `;
    container.appendChild(card);
  });
});

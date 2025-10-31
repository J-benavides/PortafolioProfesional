// Navbar cambia color al hacer scroll
window.addEventListener("scroll", function() {
  const nav = document.querySelector(".blur-nav");
  nav.classList.toggle("scrolled", window.scrollY > 50);
});

// Animación Typed.js
const typed = new Typed(".typed-text", {
  strings: ["Desarrollador Full-Stack", "Apasionado por la tecnología", "Software que siempre escala"],
  typeSpeed: 60,
  backSpeed: 35,
  loop: true
});

// Inicializa AOS
AOS.init({
  duration: 1000,
  once: true
});

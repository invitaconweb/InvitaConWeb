// menu.js
// Este script controla el comportamiento del menú de navegación y el selector de idioma

document.addEventListener('DOMContentLoaded', () => {
  // === Referencias a elementos del DOM ===
  const menuToggle = document.getElementById("menu-toggle");       // Botón del menú hamburguesa (☰)
  const navLinks = document.getElementById("nav-links");           // Contenedor de los enlaces del menú
  const languageToggle = document.getElementById("language-toggle"); // Botón para abrir/cerrar el menú de idiomas
  const languageMenu = document.getElementById("language-menu");   // Lista desplegable de idiomas
  const currentLanguage = document.getElementById("currentLanguage"); // Texto que muestra el idioma actual
  const langOptions = document.querySelectorAll(".lang-option");   // Todas las opciones de idioma dentro del desplegable

  // Seguridad: si no existen los elementos principales del menú, no ejecutar el script
  if (!menuToggle || !navLinks) return;

  // === MENÚ HAMBURGUESA (para móviles) ===
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation(); // Evita que el clic se propague al window (para no cerrar el menú inmediatamente)
    navLinks.classList.toggle("active"); // Alterna la visibilidad del menú (muestra u oculta los enlaces)

    // Cambia el icono del botón hamburguesa:
    // ☰ cuando está cerrado, ✖ cuando está abierto
    menuToggle.textContent = navLinks.classList.contains("active") ? "✖" : "☰";
  });

  // === Cierra el menú si se hace clic fuera de él ===
  window.addEventListener('click', (e) => {
    // Comprueba si el menú está abierto y si el clic no ocurrió dentro del menú ni en el botón
    if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && e.target !== menuToggle) {
      navLinks.classList.remove('active');  // Oculta el menú
      menuToggle.textContent = "☰";         // Vuelve el icono al estado cerrado
    }
  });

  // === Resetea el menú al cambiar el tamaño de la ventana ===
  window.addEventListener('resize', () => {
    // Si pasamos al modo escritorio (>768px), aseguramos que el menú móvil se cierre
    if (window.innerWidth > 768) {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.textContent = "☰";
      }
    }
  });

  // === DESPLEGABLE DE IDIOMA ===
  if (languageToggle && languageMenu) {
    // Abre o cierra el menú de idioma al hacer clic
    languageToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      languageMenu.classList.toggle("show"); // Añade o quita la clase CSS .show para mostrar/ocultar
    });

    // Cierra el menú de idioma si se hace clic fuera
    window.addEventListener("click", (e) => {
      if (!languageToggle.contains(e.target)) {
        languageMenu.classList.remove("show");
      }
    });
  }

  // === CAMBIO DE IDIOMA ===
  if (langOptions && currentLanguage) {
    // Recorre todas las opciones de idioma
    langOptions.forEach(option => {
      option.addEventListener("click", () => {
        const lang = option.dataset.lang;  // Obtiene el código del idioma (por ejemplo: "es", "en", "eu")
        localStorage.setItem("lang", lang); // Guarda el idioma seleccionado en localStorage (para recordar la preferencia)

        // Actualiza el texto visible con el idioma actual
        currentLanguage.textContent = option.textContent;

        // Marca la opción seleccionada como activa
        langOptions.forEach(o => o.classList.remove("active"));
        option.classList.add("active");

        // Cierra el menú de idioma
        if (languageMenu) languageMenu.classList.remove("show");
      });
    });

    // === Muestra el idioma guardado al cargar la página ===
    const savedLang = localStorage.getItem("lang");
    if (savedLang) {
      const active = document.querySelector(`.lang-option[data-lang="${savedLang}"]`);
      if (active) {
        active.classList.add("active");
        currentLanguage.textContent = active.textContent; // Refleja el idioma guardado
      }
    }
  }
});

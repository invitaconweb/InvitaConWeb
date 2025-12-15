document.addEventListener("DOMContentLoaded", () => {
  const languageMenu = document.getElementById("language-menu");
  const languageToggle = document.getElementById("language-toggle");
  const currentLangLabel = document.getElementById("currentLanguage");
  const langOptions = document.querySelectorAll(".lang-option");
  const elements = document.querySelectorAll("[data-uid]");

  let currentLang = localStorage.getItem("lang") || "es";

  applyActiveLang(currentLang);
  loadLanguage(currentLang);

  // abrir/cerrar menú
  languageToggle.addEventListener("click", () => {
    languageMenu.classList.toggle("active");
  });

  // seleccionar idioma
  langOptions.forEach(opt => {
    opt.addEventListener("click", () => {
      const lang = opt.dataset.lang;
      setLanguage(lang);
      languageMenu.classList.remove("active");
    });
  });

  function setLanguage(lang) {
    localStorage.setItem("lang", lang);
    applyActiveLang(lang);
    loadLanguage(lang);
  }

  function applyActiveLang(lang) {
    langOptions.forEach(o => {
      o.classList.toggle("active", o.dataset.lang === lang);
    });
    currentLangLabel.textContent =
      lang === "es" ? "Español" :
      lang === "eu" ? "Euskara" :
      "English";
  }

  function loadLanguage(lang) {
    fetch(`lang/strings_${lang}.json`)
      .then(response => response.json())
      .then(data => {
        elements.forEach(el => {
          const key = el.getAttribute("data-uid");
          if (data[key]) el.textContent = data[key];
        });
      })
      .catch(error => console.error("Error cargando idioma:", error));
  }
});

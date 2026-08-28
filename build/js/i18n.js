/**
 * Language engine: applies translations from /data/i18n.js, toggles
 * <html lang>/<html dir>, and persists the chosen language across pages.
 * Depends on window.I18N (data/i18n.js) and window.SITE_CONFIG (js/site-config.js).
 */
(function () {
  const STORAGE_KEY = "medbay_lang";
  const RTL_LANGS = ["ar"];

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || (window.SITE_CONFIG && window.SITE_CONFIG.defaultLanguage) || "en";
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    applyLang(lang);
  }

  function t(key, lang) {
    const dict = window.I18N && window.I18N[lang];
    return (dict && dict[key]) || key;
  }

  function applyLang(lang) {
    const dir = RTL_LANGS.includes(lang) ? "rtl" : "ltr";
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", dir);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const translated = t(key, lang);
      if (el.hasAttribute("data-i18n-attr")) {
        el.setAttribute(el.getAttribute("data-i18n-attr"), translated);
      } else {
        el.textContent = translated;
      }
    });

    document.querySelectorAll("[data-lang-switch] .lang-switch__btn").forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang") === lang);
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang") === lang ? "true" : "false");
    });
  }

  function initLangSwitch() {
    document.querySelectorAll("[data-lang-switch] .lang-switch__btn").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang")));
    });
  }

  window.MedBayI18n = { t, getLang, setLang };

  document.addEventListener("DOMContentLoaded", () => {
    applyLang(getLang());
    initLangSwitch();
  });
})();

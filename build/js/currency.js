/**
 * Currency engine: reprices every element carrying a `data-price-aed`
 * attribute into the selected currency, and persists the choice.
 * Depends on window.CURRENCY / formatPrice (data/currency.js) and
 * window.SITE_CONFIG (js/site-config.js).
 */
(function () {
  const STORAGE_KEY = "medbay_currency";

  function getCurrency() {
    return localStorage.getItem(STORAGE_KEY) || (window.SITE_CONFIG && window.SITE_CONFIG.defaultCurrency) || "AED";
  }

  function setCurrency(code) {
    localStorage.setItem(STORAGE_KEY, code);
    applyCurrency(code);
    if (window.MedBayCart && typeof window.MedBayCart.render === "function") {
      window.MedBayCart.render();
    }
  }

  function applyCurrency(code) {
    document.querySelectorAll("[data-price-aed]").forEach((el) => {
      const amount = parseFloat(el.getAttribute("data-price-aed"));
      if (!isNaN(amount)) {
        el.textContent = formatPrice(amount, code);
      }
    });
    document.querySelectorAll("[data-currency-select]").forEach((select) => {
      select.value = code;
    });
  }

  function initCurrencySelect() {
    document.querySelectorAll("[data-currency-select]").forEach((select) => {
      select.addEventListener("change", (e) => setCurrency(e.target.value));
    });
  }

  window.MedBayCurrency = { getCurrency, setCurrency, applyCurrency };

  document.addEventListener("DOMContentLoaded", () => {
    applyCurrency(getCurrency());
    initCurrencySelect();
  });
})();

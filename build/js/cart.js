/**
 * Cart engine: localStorage-backed cart shared across every page.
 * Depends on window.PRODUCTS (data/products.js), window.CURRENCY /
 * formatPrice (data/currency.js), and window.MedBayI18n (js/i18n.js).
 *
 * Cart items are stored as [{ id, qty }] and resolved against PRODUCTS at
 * render time, so switching language or currency never touches cart state.
 */
(function () {
  const STORAGE_KEY = "medbay_cart";

  function readCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function writeCart(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    render();
  }

  function findProduct(id) {
    return (window.PRODUCTS || []).find((p) => p.id === id);
  }

  function add(id, qty) {
    qty = qty || 1;
    const items = readCart();
    const existing = items.find((i) => i.id === id);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ id, qty });
    }
    writeCart(items);
  }

  function setQty(id, qty) {
    let items = readCart();
    if (qty <= 0) {
      items = items.filter((i) => i.id !== id);
    } else {
      const existing = items.find((i) => i.id === id);
      if (existing) existing.qty = qty;
    }
    writeCart(items);
  }

  function removeItem(id) {
    writeCart(readCart().filter((i) => i.id !== id));
  }

  function clear() {
    writeCart([]);
  }

  function getLineItems() {
    return readCart()
      .map((i) => {
        const product = findProduct(i.id);
        return product ? { ...product, qty: i.qty } : null;
      })
      .filter(Boolean);
  }

  function getCount() {
    return readCart().reduce((sum, i) => sum + i.qty, 0);
  }

  function getSubtotalAED() {
    return getLineItems().reduce((sum, item) => sum + item.priceAED * item.qty, 0);
  }

  function renderBadge() {
    const count = getCount();
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = String(count);
      el.classList.toggle("is-empty", count === 0);
    });
  }

  function renderCartPage() {
    const container = document.querySelector("[data-cart-items]");
    if (!container) return;

    const currency = (window.MedBayCurrency && window.MedBayCurrency.getCurrency()) || "AED";
    const lang = (window.MedBayI18n && window.MedBayI18n.getLang()) || "en";
    const t = (key) => (window.MedBayI18n ? window.MedBayI18n.t(key, lang) : key);
    const items = getLineItems();
    const emptyState = document.querySelector("[data-cart-empty]");
    const summary = document.querySelector("[data-cart-summary]");

    if (items.length === 0) {
      container.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      if (summary) summary.style.display = "none";
      renderBadge();
      return;
    }

    if (emptyState) emptyState.style.display = "none";
    if (summary) summary.style.display = "";

    container.innerHTML = items
      .map(
        (item) => `
      <div class="cart-line" data-cart-line="${item.id}">
        <div class="cart-line__info">
          <h3>${item.name}</h3>
          <p>${item.manufacturer}${item.sku ? " &middot; SKU " + item.sku : ""}</p>
        </div>
        <div class="cart-line__qty">
          <button type="button" class="cart-qty-btn" data-qty-decrease="${item.id}" aria-label="${t("ecommerce.quantity")} -">&minus;</button>
          <span>${item.qty}</span>
          <button type="button" class="cart-qty-btn" data-qty-increase="${item.id}" aria-label="${t("ecommerce.quantity")} +">+</button>
        </div>
        <div class="cart-line__price">${formatPrice(item.priceAED * item.qty, currency)}</div>
        <button type="button" class="cart-line__remove" data-remove-item="${item.id}" aria-label="${t("ecommerce.remove")}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13"/></svg>
        </button>
      </div>`
      )
      .join("");

    const subtotalEl = document.querySelector("[data-cart-subtotal]");
    if (subtotalEl) subtotalEl.textContent = formatPrice(getSubtotalAED(), currency);

    container.querySelectorAll("[data-qty-increase]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-qty-increase");
        const item = readCart().find((i) => i.id === id);
        setQty(id, (item ? item.qty : 0) + 1);
      });
    });
    container.querySelectorAll("[data-qty-decrease]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-qty-decrease");
        const item = readCart().find((i) => i.id === id);
        // Decreasing at qty 1 stays at 1 — Remove is the explicit way to delete a line.
        setQty(id, Math.max(1, (item ? item.qty : 1) - 1));
      });
    });
    container.querySelectorAll("[data-remove-item]").forEach((btn) => {
      btn.addEventListener("click", () => removeItem(btn.getAttribute("data-remove-item")));
    });
  }

  function renderCheckoutSummary() {
    const container = document.querySelector("[data-checkout-items]");
    if (!container) return;

    const currency = (window.MedBayCurrency && window.MedBayCurrency.getCurrency()) || "AED";
    const items = getLineItems();

    container.innerHTML = items
      .map(
        (item) => `
      <div class="checkout-line">
        <span>${item.name} &times; ${item.qty}</span>
        <strong>${formatPrice(item.priceAED * item.qty, currency)}</strong>
      </div>`
      )
      .join("") || `<p class="body-text">${(window.MedBayI18n && window.MedBayI18n.t("ecommerce.emptyCart", window.MedBayI18n.getLang())) || "Your cart is currently empty."}</p>`;

    const totalEl = document.querySelector("[data-checkout-total]");
    if (totalEl) totalEl.textContent = formatPrice(getSubtotalAED(), currency);
  }

  function render() {
    renderBadge();
    renderCartPage();
    renderCheckoutSummary();
  }

  /** Clamp a raw quantity value into the demo's 1–99 range (invalid input falls back to 1). */
  function clampQty(value) {
    const n = parseInt(value, 10);
    if (isNaN(n)) return 1;
    return Math.min(99, Math.max(1, n));
  }

  /** Per-card quantity steppers (product cards + product detail) — local UI state only. */
  function initQtySelectors() {
    document.querySelectorAll("[data-qty-selector]").forEach((selector) => {
      const input = selector.querySelector("[data-qty-input]");
      if (!input) return;
      const decreaseBtn = selector.querySelector("[data-qty-decrease-card]");
      const increaseBtn = selector.querySelector("[data-qty-increase-card]");

      if (decreaseBtn) {
        decreaseBtn.addEventListener("click", () => {
          input.value = clampQty(parseInt(input.value, 10) - 1);
        });
      }
      if (increaseBtn) {
        increaseBtn.addEventListener("click", () => {
          input.value = clampQty(parseInt(input.value, 10) + 1);
        });
      }
      input.addEventListener("change", () => {
        input.value = clampQty(input.value);
      });
      input.addEventListener("blur", () => {
        input.value = clampQty(input.value);
      });
    });
  }

  function initAddToCartButtons() {
    document.querySelectorAll("[data-add-to-cart]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const actionsContainer = btn.closest(".product-card__actions, .pd-actions") || btn.parentElement;
        const qtyInput = actionsContainer ? actionsContainer.querySelector("[data-qty-input]") : null;
        const qty = qtyInput ? clampQty(qtyInput.value) : 1;
        add(btn.getAttribute("data-add-to-cart"), qty);
        const original = btn.textContent;
        btn.textContent = "✓";
        setTimeout(() => {
          btn.textContent = original;
        }, 900);
      });
    });

    document.querySelectorAll("[data-clear-cart]").forEach((btn) => {
      btn.addEventListener("click", clear);
    });
  }

  window.MedBayCart = { add, removeItem, setQty, clear, getLineItems, getCount, getSubtotalAED, render };

  document.addEventListener("DOMContentLoaded", () => {
    initQtySelectors();
    initAddToCartButtons();
    render();
  });
})();

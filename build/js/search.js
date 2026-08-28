/**
 * Lightweight client-side product search/filter for the Products page.
 * Works against product cards already in the DOM (data-product-* attributes)
 * plus window.SEARCH_ALIASES (data/products.js) so English and Arabic terms
 * both work, regardless of the active UI language.
 */
(function () {
  function normalize(str) {
    return (str || "").toString().trim().toLowerCase();
  }

  function matchesAliasCategory(query) {
    const q = normalize(query);
    if (!q) return null;
    const aliases = window.SEARCH_ALIASES || [];
    const hit = aliases.find((entry) => entry.terms.some((term) => normalize(term).includes(q) || q.includes(normalize(term))));
    return hit ? hit.category : null;
  }

  function initSearch() {
    const grid = document.querySelector("[data-product-grid]");
    const searchInput = document.querySelector("[data-search-input]");
    const categorySelect = document.querySelector("[data-filter-category]");
    const manufacturerSelect = document.querySelector("[data-filter-manufacturer]");
    const chips = document.querySelectorAll("[data-filter-chip]");
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll("[data-product-card]"));

    function apply() {
      const query = normalize(searchInput ? searchInput.value : "");
      const aliasCategory = matchesAliasCategory(query);
      const category = categorySelect && categorySelect.value !== "all" ? categorySelect.value : null;
      const manufacturer = manufacturerSelect && manufacturerSelect.value !== "all" ? manufacturerSelect.value : null;
      const activeChip = document.querySelector("[data-filter-chip].is-active");
      const chipCategory = activeChip && activeChip.getAttribute("data-filter-chip") !== "all" ? activeChip.getAttribute("data-filter-chip") : null;

      cards.forEach((card) => {
        const name = normalize(card.getAttribute("data-product-name"));
        const sku = normalize(card.getAttribute("data-product-sku"));
        const mfr = normalize(card.getAttribute("data-product-manufacturer"));
        const cat = card.getAttribute("data-product-category") || "";

        const textMatch = !query || name.includes(query) || sku.includes(query) || mfr.includes(query) || (aliasCategory && cat === aliasCategory);
        const categoryMatch = !category || cat === category;
        const manufacturerMatch = !manufacturer || mfr === normalize(manufacturer);
        const chipMatch = !chipCategory || cat === chipCategory;

        card.style.display = textMatch && categoryMatch && manufacturerMatch && chipMatch ? "" : "none";
      });
    }

    if (searchInput) searchInput.addEventListener("input", apply);
    if (categorySelect) categorySelect.addEventListener("change", apply);
    if (manufacturerSelect) manufacturerSelect.addEventListener("change", apply);
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        apply();
      });
    });

    apply();
  }

  document.addEventListener("DOMContentLoaded", initSearch);
})();

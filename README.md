# MedBay International — Demo Website

A static, bilingual (English/Arabic) e-commerce demo website for MedBay International, a medical technology and healthcare solutions company. Built as a client-ready template: no backend required to view or demo the site, with clear integration points for a real payment gateway later.

**The deployable website is the `build/` folder.** Everything else in this repository (`data/source-content.json`, `CONTENT-MIGRATION.md`, `references/`, etc.) is project/reference material, not part of the published site.

## What's inside

- Real MedBay content (company info, contact details, specialties, 12 real products, policies, FAQs) imported from medbayint.com — see `CONTENT-MIGRATION.md` for sourcing.
- Header/footer, mega-style navigation, product catalogue, filters, and a working demo cart + checkout.
- English/Arabic language switcher (LTR/RTL) with no external translation API.
- Multi-currency price display (AED / USD / SAR / EGP).
- A payment integration seam that is ready to wire up to a real gateway without touching the checkout UI.

## Run it locally

You need [Node.js](https://nodejs.org) installed (only for the local static file server — the deployed site itself needs no Node).

```
node serve.js
```

Then open **http://localhost:8090**. `serve.js` just serves the `build/` folder as static files; you can equally open `build/index.html` directly in a browser, or use any other static server (`npx serve build`, VS Code Live Server, etc.) — nothing here needs a real backend.

## Deploy to GitHub Pages

Two options:

1. **Automatic (recommended):** push to `main`. `.github/workflows/deploy-pages.yml` publishes the `build/` folder to GitHub Pages automatically. In your repo settings, set **Pages → Source → GitHub Actions** once.
2. **Manual:** GitHub Pages' built-in "deploy from a branch" option only serves `/` or `/docs`, not `/build` — so if you don't want to use the Actions workflow, copy the contents of `build/` into a `docs/` folder (or the repo root of a dedicated `gh-pages` branch) and point Pages at that instead.

The site works from any subpath (e.g. `https://USERNAME.github.io/medbay-demo/`) because every internal link, script, and stylesheet uses a relative path (`./`, `../`) — never an absolute `/` path.

## Publish a static demo / zip it for a client

Just zip the `build/` folder (or the whole repo) and send it — there is nothing to build/compile. Opening `build/index.html` in a browser works with no server at all, though a couple of features (none critical to browsing) behave better served over `http://` than `file://` in some browsers.

## Folder structure

```
build/                    ← the deployable website (this is what you zip/deploy)
  index.html, about/, products/, specialties/, services/, brands/, contact/,
  request-quote/, product-category/, product-detail/, cart/, checkout/,
  shipping-delivery/, returns-policy/, payment-methods/, privacy-policy/,
  terms-conditions/, faqs/, request-unavailable-product/   ← one folder per page,
                                                              each an index.html
  styles/global.css, styles/medbay.css   ← all design tokens, layout, components
  assets/                 ← logo, images
  data/
    products.js           ← the 12 real MedBay products (single source of truth)
    currency.js           ← exchange rates + price formatting
    i18n.js                ← English/Arabic UI translation strings
  js/
    site-config.js        ← demoMode / default language / default currency / paymentsEnabled
    i18n.js                ← language switching engine
    currency.js            ← currency switching engine
    cart.js                ← cart engine (localStorage)
    search.js               ← bilingual product search/filter (Products page)
    payment-adapter.js     ← PaymentProvider abstraction (see "Payments" below)

data/source-content.json  ← raw facts imported from medbayint.com (reference, not deployed)
CONTENT-MIGRATION.md      ← log of what content came from where (reference, not deployed)
config/payment.example.js ← template for future payment provider config (copy → config/payment.js)
serve.js                  ← tiny local dev server (Node), not required for deployment
.github/workflows/deploy-pages.yml ← GitHub Pages auto-deploy
```

## How translations work

- `build/data/i18n.js` holds every UI string in English and Arabic (`window.I18N.en` / `window.I18N.ar`), covering navigation, footer, ecommerce actions (Add to Cart, Checkout, etc.), and page headings.
- `build/js/i18n.js` reads the saved language from `localStorage`, applies it to every element carrying `data-i18n="some.key"` (setting `textContent`, or an attribute if the element also has `data-i18n-attr="placeholder"` etc.), and sets `<html lang>` / `<html dir>` (`rtl` for Arabic).
- The language toggle in the header (`EN` / `العربية`) calls `MedBayI18n.setLang('ar')`, which persists and re-applies — the same choice follows you across every page.
- **Real product names, SKUs, manufacturer names, and the factual body copy imported from medbayint.com are intentionally left untranslated** — only reusable interface chrome is translated, to avoid mistranslating real business content. Add more `data-i18n="..."` keys to `i18n.js` and tag more elements if you want deeper coverage.
- Arabic uses a system Arabic-safe font fallback (`Segoe UI, Tahoma, Arial`) under `[dir="rtl"]` rather than changing the site's base typeface.

## How currency switching works

- All prices are authored once, in AED, as `data-price-aed="200.00"` on a `<span class="price">` next to the product's SKU/manufacturer line (see any product card in `build/products/index.html`).
- `build/data/currency.js` holds the exchange rates (relative to 1 AED) and a `formatPrice()` helper.
- `build/js/currency.js` reprices every `[data-price-aed]` element into the selected currency and persists the choice in `localStorage`.
- **The exchange rates are static/hardcoded for this demo — they are not live.** Before using this in production, replace `CURRENCY.exchangeRates` in `data/currency.js` with rates fetched from a trusted FX data provider (or your own backend/serverless endpoint), refreshed on a reasonable schedule. Don't ship static numbers as if they were current market rates.
- Discount percentages (where used) are calculated from the AED base/sale prices and do not change when currency changes.

## How the cart works

- `build/js/cart.js` stores `[{ id, qty }]` in `localStorage` (`medbay_cart`), resolved against `build/data/products.js` at render time — so switching language or currency never touches cart contents.
- Any button with `data-add-to-cart="product-id"` adds that product; the cart badge (`[data-cart-count]`) in the header updates everywhere automatically.
- The cart page (`build/cart/index.html`) renders line items into `[data-cart-items]`, with quantity +/-, remove, clear, and a subtotal that re-renders on currency change.

## How checkout works (demo mode)

`build/checkout/index.html` collects the standard fields (name, email, phone, company, country, city, address, notes) and shows an order summary built from the cart. Submitting calls `PaymentProvider.createCheckout(order)`.

## How future payment integration works

`build/js/payment-adapter.js` is the **only** file a real payment integration should need to touch — it defines `window.PaymentProvider.createCheckout(order)`. Right now, with `SITE_CONFIG.paymentsEnabled = false` (see `build/js/site-config.js`), it shows a "Secure payment gateway will be connected for production" demo modal and does nothing else.

To go live:

1. Stand up a backend or serverless endpoint that creates a checkout session with your chosen provider (Stripe Checkout, PayPal, or a UAE/GCC gateway like Telr/PayTabs/Network International) using that provider's **secret** key. The secret key must never be shipped to the browser — this static site has nowhere safe to put it.
2. Copy `config/payment.example.js` to `config/payment.js` (gitignored) and fill in only `PUBLIC_*` values — a publishable/client key is fine there, a secret key is not.
3. Implement the commented-out branch in `payment-adapter.js` to `POST` the order to your endpoint and redirect to the URL it returns.
4. Set `paymentsEnabled: true` in `site-config.js`.

No checkout markup or flow needs to change to do this.

**This is a static site (GitHub Pages compatible), so it cannot process real payments by itself** — real payment processing always requires a hosted checkout page, a serverless function, or a backend you control.

## How to replace products

Edit `build/data/products.js` — it's the single source of truth for product id/name/SKU/category/manufacturer/price(AED). Product cards on the Products page, homepage, and detail/category templates read from the same `data-product-*` / `data-price-aed` / `data-add-to-cart` attributes, so update the corresponding HTML card to match if you add or remove products (the HTML isn't auto-generated from `products.js` in this version — see "Known limitations" below).

## How to replace images

Swap files under `build/assets/` (keep the same filenames, e.g. `medbay-logo.png`, to avoid touching every page's `<img src>`), or update the `src` path in the relevant page(s) if you rename a file. Most product imagery in this demo is CSS/SVG placeholder art (`.media-ph`), not photography — replace a `.media-ph` block with a plain `<img>` where you have a real product photo.

## How to change FX rates

Edit the `exchangeRates` object in `build/data/currency.js`. See the note in that file about using a live FX source in production.

## Known limitations (demo scope)

- Product cards are static HTML, not generated from `products.js` — adding/removing a product means editing both.
- Only the Products page has working search/filter; other pages' search inputs are decorative.
- UI translation covers navigation, footer, and common ecommerce actions — not every paragraph of body copy.
- Checkout has no real payment processing (see above) and no order persistence/email — it's a demo of the flow.

# Content Migration Log

Tracks every fact imported from live sources into the MedBay International demo. Full structured data lives in `data/source-content.json`.

**Status note (2026-08-28):** the previous session's remote-control connection dropped mid-task, before the rows below were actually applied to the build files (only this log and the JSON had been written). This session verified the gap and finished applying every row to the live HTML.

| Content | Source URL | Target page/component | Status |
|---|---|---|---|
| Company description, mission, vision, operations presence, manufacturing, services, leadership, group companies | https://medbayint.com/about-us/ | `build/about/index.html` (Who We Are section) | Done |
| Phone numbers (+201000993812, +201000855255, +201270320470), email (support@medbayint.com), 4 office addresses | https://medbayint.com/contact-us/ | `build/contact/index.html`, `build/index.html` (contact preview) | Done |
| 14 real medical specialties list | https://medbayint.com/ (nav) | `build/index.html` (specialties grid, 9 of 14 shown), `build/specialties/index.html` (all 14), `build/request-quote/index.html` (specialty select) | Done |
| 8 real manufacturer names (Covidien, Medtronic, Abbott, Alcon, Boston Scientific, Excalibur, Bojin, Amcrylate) | https://medbayint.com/shop/ | `build/brands/index.html`, `build/index.html` (brand strip), product filter selects | Done |
| 12 real products (name, SKU, category, manufacturer, price) | https://medbayint.com/shop/ | `build/products/index.html` (all 12), `build/index.html` (4 featured), `build/product-detail/index.html` (1 representative), `build/product-category/index.html` (4 General Surgery items) | Done |
| Shipping & delivery policy (Egypt-only, timeframes, costs) | https://medbayint.com/shipping-delivery/ | `build/shipping-delivery/index.html` (new page) | Done |
| Returns policy (14-day window, free returns, process) | https://medbayint.com/returns-policy/ | `build/returns-policy/index.html` (new page) | Done |
| Payment methods (COD, bank transfer, Vodafone Cash) | https://medbayint.com/payment-method/ | `build/payment-methods/index.html` (new page) | Done |
| Privacy policy summary | https://medbayint.com/privacy-policy/ | `build/privacy-policy/index.html` (new page) | Done |
| Terms & conditions summary | https://medbayint.com/terms-and-conditions/ | `build/terms-conditions/index.html` (new page) | Done |
| FAQ (1 genuine Q&A; source page's other 6 answers are placeholder text on medbayint.com itself) | https://medbayint.com/faqs/ | `build/faqs/index.html` (new page) | Done |
| "Request an Unavailable Product" intro copy | https://medbayint.com/request-an-unavailable-product/ | `build/request-unavailable-product/index.html` (new page, reuses Request Quote form layout) | Done |
| Footer links (About, Contact, Privacy, Terms, FAQs, Payment Methods, Returns Policy, Shipping & Delivery, Request an Unavailable Product) | https://medbayint.com/ (footer) | All page footers (Support column extended, Legal hrefs fixed; existing 5-column grid layout untouched) | Done |
| "Shop DentalBay" footer link | https://medbayint.com/ (footer) | Not added &mdash; DentalBay remained unreachable this session too (see below), so no destination page exists to link to | Not done |

## Not imported (explicitly)

- **DentalBay catalogue/content** — `dentalbay.com` has an expired SSL certificate; `dentalbay.store` is a client-rendered SPA that returns only loading placeholders to a non-JS fetch, and `/products` returns HTTP 410 Gone. No DentalBay categories, products, or copy were fabricated to fill this gap. The homepage/footer link to DentalBay points at `https://www.dentalbay.store/` as an external reference only (per MedBay's own site, which links there).
- **Company history, certifications, hospital clients, "years in business" claims** — not published on the source site; not invented, per instructions.
- **6 of 7 FAQ answers** — the source page itself serves duplicated WooCommerce placeholder text for these; left out rather than invented.
- **Business hours** — not published on the source contact page.
- **A physical map/location** for the contact page — MedBay has 4 office addresses (Egypt) rather than one; used the primary Sheraton/Heliopolis office address as the representative one, all 4 listed on the Contact page.

## Design constraint honored

No visual/structural changes were made to the approved baseline (commit `APPROVED DESIGN BASELINE - DO NOT OVERWRITE`). All changes below are content-only edits to existing markup, plus new pages built from the exact same header/footer/section patterns already in use.

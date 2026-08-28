# Section 7 — "Medical Devices" Carousel — Reconstruction Notes

## What this is
`site-dna.json` → `layout['1440px'].sections[7]` = `main > section:nth-child(6)`,
class `w-full py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16 bg-white dark:bg-zinc-900`,
rect 1440×686 at `top:3212`. `top:3212` == `sections[6].top(2526) + sections[6].height(686)`,
confirming this section begins immediately after 06-soft-products with no gap.
Structurally identical shell/component to 06-soft-products (same wrapper/container/
carousel classes) — only heading text, lead copy, and the 7 product cards differ.
A centered "MEDICAL DEVICES" heading + lead paragraph, followed by a horizontally
scrolling carousel of 7 product cards (Sofwave™, Ultraformer MPT, Volnewmer, Secret
Duo, Viora V Series, SkinPen®, Etherea MX), each with a background image, a
"medical devices" category-pill badge, title, description, and a "Read more" link,
plus prev/next chevron controls and 7 pagination dots below the carousel.

## Ground truth used
- DOM structure and content confirmed via `curl https://www.dubaimed.com/`
  (2026-08-27), block id `S:2`: `<section><div class="wrapper"><div class="mx-auto
  max-w-7xl"><div class="text-center ...">` (header) + `<div><div class="relative">
  <div class="overflow-hidden"><div class="flex gap-4 pl-4 pr-4">` (7 slides,
  `flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0`) + `<div class="mt-8
  flex items-center justify-between">` (prev/next chevron buttons + dot pagination).
- Reused `.typo-section-title`/`.typo-lead`, card/pill/link typography, and
  `.category-pill`/`.category-pill-hover` box styling verbatim from
  06-soft-products (identical component, only text differs) — same DNA
  typography[22,25,30,31,32,35] backing and same `assets/css/0s__7n242xu4_-f76612.css`
  source for the pill's box/border/backdrop-filter.
- All 7 product images already present in `assets/images/` from extraction
  (`df1d84699...`, `21f1ad148...`, `f9a0c889...`, `5ee9cc65f...`, `9bcf4883...`,
  `0cd78d337...`, `c564e2605...`); order/mapping confirmed by matching each
  `href="/products/..."` to the nearest following `cdn.sanity.io` image URL in
  source order in the live HTML.
- `box-sizing: border-box` reset applied to this section **from the start**
  (per orchestrator dispatch notes), carrying forward 06-soft-products' round-2
  finding that `.wrapper`'s `max-width` + `padding-inline` without an explicit
  border-box reset renders 64px wider than the DNA-specified 1280px, inflating
  every 25%-flex-basis card from 296px to 312px.

## Carousel default-slide derivation (pixel-verified, not assumed)
Unlike 06-soft-products (whose reference screenshot showed the active slide
flush against the container's left edge with zero peek), this section's
reference screenshot (`references/screenshots/1440-section-7-w-full.png`)
shows a partially-visible previous slide (Ultraformer MPT, ~63px sliver)
peeking in on the left — so the flush-card formula could not be assumed and
was re-derived from pixel data instead of reused blindly, per the orchestrator's
warning about non-default slide freezes in sections 3 and 6.
- Row-scanned the reference PNG (sharp raw buffer, y=400) for card border
  x-positions at 1024px+: slide "Volnewmer" spans 192–487 (295–296px card),
  "Secret Duo" 504–799, "Viora V Series" 816–1111, "SkinPen" starts at 1128
  (cut by the viewport's right edge). "Ultraformer MPT" sliver visible 112–176.
- Row-scanned the pagination-dot cluster (y=604–610): 7 dots total, with the
  3rd (index 2, "Volnewmer") rendered as the wide maroon active pill
  (1200–1231px), confirming which DOM index is active.
- Solved `position(i) = 128 + i·312 - S` for the measured Volnewmer left edge
  (192, i=2) → `S = 560`. Verified algebraically against the other three
  measured card positions (504, 816, 1128 for i=3,4,5) — all three matched
  exactly, confirming `translateX(-560px)` (not a reused/guessed value) as
  ground truth for this section's captured scroll state.
- Implemented via `data-active-slide="2"` + a scoped `translateX(-560px)` at
  `min-width:1024px`, same pattern as 06-soft-products' `data-active-slide`
  hook, and 7 pagination dots with the 3rd marked
  `.medical-devices-carousel__dot--active`.

## Deviations / approximations
1. **Carousel is embla-JS-driven on the live site; reproduced as native
   horizontal `flex` + `scroll-snap` here**, identical stub pattern to
   06-soft-products. `data-carousel-viewport`, `data-carousel-track`,
   `data-carousel-prev`/`data-carousel-next` hooks stubbed for a Step 11 pass.
2. **"Glowing effect" card border is stubbed, not animated** — same
   `data-glow-card` / `opacity:0` pattern as 05-achievements/06-soft-products.
3. **Prev/next arrow and pagination-dot colors reused directly from
   06-soft-products' round-2 pixel-sampled values** (same white-background
   component instance, same DNA component-button entries for "Previous
   slide"/"Next slide": 32×32px, `--radius-3` pill, `--color-border-1` border,
   `--color-text-1` icon). Not re-sampled independently for arrows since the
   component is visually identical in both sections' screenshots.
4. **Pagination dot inactive gray (`rgb(212,212,216)`) hardcoded**, no
   matching DNA token, same as 06-soft-products.

## Flag for orchestrator
None — this section's content and images are fully backed by the DNA/live
HTML/downloaded assets. Section height renders at 685.875px vs. reference
686px (0.125px rounding diff, matches 06-soft-products' identical discrepancy).

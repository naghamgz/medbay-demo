# Section 6 — "Soft Products" Carousel — Reconstruction Notes

## What this is
`site-dna.json` → `layout['1440px'].sections[6]` = `main > section:nth-child(5)`,
class `w-full py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16 bg-white dark:bg-zinc-900`,
rect 1440×686 at `top:2526`. `top:2526` == `sections[5].top(1932) + sections[5].height(594)`,
confirming this section begins immediately after 05-achievements with no gap. A
centered "SOFT PRODUCTS" heading + lead paragraph, followed by a horizontally
scrolling carousel of 5 product cards (mesohyal®, AnteAGE® MDX Biosome™, traneX
glow, SuneKOS, Cellenis® PRP), each with a background image, a "soft products"
category-pill badge, title, description, and a "Read more" link, plus
prev/next chevron controls below the carousel.

## Ground truth used
- DOM structure and Tailwind class chain confirmed via `curl
  https://www.dubaimed.com/` (2026-08-27): `<section><div class="wrapper">
  <div class="mx-auto max-w-7xl"><div class="text-center ...">` (header) +
  `<div><div class="relative"><div class="overflow-hidden"><div class="flex
  gap-4 pl-4 pr-4">` (5 slides, `flex-[0_0_100%] sm:flex-[0_0_50%]
  lg:flex-[0_0_25%] min-w-0`) + `<div class="mt-8 flex items-center
  justify-between">` (prev/next chevron buttons + one empty reserved slot).
- `.typo-section-title`/`.typo-lead` reused verbatim from `typography[22,25]`
  (identical classes/computed values as 05-achievements' h2/lead).
- Card title/description/link/category-pill text properties from
  `typography[30,31,32,35]`; `.category-pill`/`.category-pill-hover` box
  styling (background, border, backdrop-blur, shadow, pill radius) pulled
  verbatim from `assets/css/0s__7n242xu4_-f76612.css` since the DNA typography
  table only captures text properties, not box/border/backdrop-filter.
  `--radius-3` (`3.35544e+07px`) already exists in `tokens.css` and matches
  the pill's `border-radius:3.40282e38px` (both are "effectively infinite").
- All 5 product images (`d5f46af...`, `5576df235...`, `8a6a41d07...`,
  `ad3bfdc7e...`, `dd7897466...`) were already present in `assets/images/`
  from extraction; order/mapping to each product confirmed by matching
  `href="/products/..."` position to the nearest following `cdn.sanity.io`
  image URL in source order in the live HTML.
- Padding chain (24/32/40/48/64px across breakpoints) cross-checked against
  `layout['1024px'/'768px'/'375px'].sections[6]`, all matching the same
  `py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16` scale used in 05-achievements.
- Lucide `chevron-left`/`chevron-right`/`arrow-up-right` icons inlined
  directly (no local SVG files exist for these — confirmed via `ls
  assets/svg`) with `stroke="currentColor"`, matching the live site's own
  inline-SVG + `currentColor` fill strategy; sized 16×16 to match the
  03-hero carousel's arrow convention.

## Deviations / approximations
1. **Carousel is embla-JS-driven on the live site; reproduced as native
   horizontal `flex` + `scroll-snap` here.** `data-carousel-viewport`,
   `data-carousel-track`, `data-carousel-prev`/`data-carousel-next` hooks are
   stubbed for a Step 11 pass if JS-driven slide-to-slide transform (matching
   the live site's `translate3d` easing) is ever required instead of native
   scroll-snap.
2. **"Glowing effect" card border is stubbed, not animated** — same pattern
   as 05-achievements' `.achievement-card__glow` (mouse-tracked radial
   gradient ring, invisible at rest since `--active:0`). `.product-card__glow`
   is `opacity:0` with a `data-glow-card` hook.
3. **Prev/next arrow button colors (`bg-background`/`hover:bg-accent`/
   `hover:text-accent-foreground`) are approximated.** `interactiveStates` in
   `site-dna.json` failed extraction for all 48 recorded selectors
   (`stateExtractionFailed:true`, "Too many arguments" error) and none target
   this section's `.slider-arrow` buttons anyway. Used the closest extracted
   neutral tokens (`--color-border-2` for border, `--color-bg-10` for hover
   background, `--color-text-9`/`--color-text-11` for icon color) instead of
   inventing shadcn `--background`/`--accent` values not present in the DNA.
4. **`box-shadow` on the category pill approximated via `--shadow-1`** (the
   closest multi-layer shadow token in `tokens.css`) since the DNA's captured
   shadow tokens are not explicitly labeled by Tailwind utility name.

## Flag for orchestrator
None — this section's content and images are fully backed by the DNA/live
HTML/downloaded assets; no missing-asset or gap issues like 03/04's.

## Round 2 — comparator fixes (85.42% → 99.08% pixelmatch)
Comparator flagged 4 issues; all fixed and visually re-verified against
`references/screenshots/1440-section-6-w-full.png` via a local
Playwright + pixelmatch check (not the orchestrator's comparator agent).

1. **Carousel default slide position.** Added `data-active-slide="1"` to
   `.soft-products-carousel` and, at `min-width:1024px`,
   `transform:translateX(-328px)` on `.soft-products-carousel__track` so
   AnteAGE/traneX/SuneKOS/Cellenis render as the first four visible cards
   (mesohyal scrolled off-left), matching the reference's embla
   `startIndex:1` capture. The -328px derivation: slide 0 sits at
   containerEdge(112)+pl-4(16)=128px unshifted; slide 1 would be at
   128+296+16=440px; but the reference shows the *active* slide's edge
   flush with the container edge (112px) — embla collapses the pl-4 peek
   for the current slide — so net shift = 440-112 = 328px.
2. **Root-caused a `box-sizing` bug**, not just the reported symptoms:
   `.soft-products-section__wrapper` had `max-width:1280px` +
   `padding-inline` with no `box-sizing:border-box`, so the browser's
   default content-box sizing summed padding on top of max-width,
   rendering the wrapper at 1344px instead of 1280px. This cascaded into
   every card computing 25% of an oversized flex container (312px
   instead of the reference's actual 296px — confirmed by pixel-sampling
   card borders in the reference at x=112/407/424/719/736/1031/1048).
   Added a scoped `.soft-products-section, .soft-products-section *, ::before, ::after { box-sizing: border-box }`
   reset (matching Tailwind Preflight's global behavior on the live site,
   applied locally since this build has no such global reset). This also
   corrected the -328px shift math above (originally would have been
   -344px against the old 312px card width).
3. **Pagination dots** (`.soft-products-carousel__actions`) were empty;
   added 5 `<button aria-label="Go to slide N">` dots, 2nd one active.
   The DNA's captured 8×8 slider-dot component (`--color-bg-1` inactive)
   turned out to belong to the *hero* carousel's dark-background instance
   only — applying it here rendered near-invisible off-white-on-white.
   Pixel-sampled the actual reference dots instead: inactive
   `rgb(212,212,216)` 8×8 circle, active `rgb(155,0,88)` (=
   `--color-text-8`) as a wider 32×8 pill, 16px gaps — all hardcoded with
   inline comments since no DNA token matches the inactive gray exactly.
4. **Prev/next arrows**: DNA's own `main>section:nth-child(1)` "Previous
   slide"/"Next slide" button entries (same shared component) gave exact
   values: 32×32px, `border-radius:var(--radius-3)` (pill),
   `border:1px solid var(--color-border-1)` (exact lab() match),
   transparent background, `color:var(--color-text-1)` (exact lab()
   match) — replacing the prior 36×36/6px-radius/white-bg approximation.
5. **Description line-clamp**: CSS already had `-webkit-line-clamp:2`,
   but it silently did nothing because the paragraph was itself a flex
   item (`flex:1` inside `display:flex;flex-direction:column`) —
   Chromium blockifies `display:-webkit-box` to `display:flow-root` on
   flex items (verified via `getComputedStyle` probe), breaking the
   clamp. Fixed by moving `flex:1` onto a new non-flex-item wrapper
   (`.product-card__desc-wrap`) so `.product-card__desc` itself is a
   plain block child and keeps its `-webkit-box` display, restoring the
   2-line ellipsis truncation (confirmed 48px/2-line height post-fix vs.
   74px/3-line before).

Section height post-fix: 685.875px vs. reference 686px (0.125px rounding
diff). Did not touch the reCAPTCHA badge per orchestrator instructions —
it still shows as a diff region but is an unrelated floating page widget,
not part of this section's DOM.

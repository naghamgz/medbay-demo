# Section 5 — "Achievements" Stat Grid — Reconstruction Notes

## What this is
`site-dna.json` → `layout['1440px'].sections[5]` = `main > section:nth-child(4)`
(the section after the hero carousel + the ungapped "about" intro block +
04-about's video/copy block), class `w-full py-6 sm:py-8 md:py-10 lg:py-12
xl:py-16 bg-white dark:bg-zinc-900`, rect 1440×594 at `top:1932`. A centered
"ACHIEVEMENTS" heading + lead paragraph, followed by a 4-card stat grid
(2 cols below 1024px, 4 cols at 1024px+): Satisfied Clients, Aesthetic
Leader, Device Installations, GCC Presence.

## Ground truth used
- DOM structure and Tailwind class chain confirmed via `curl
  https://www.dubaimed.com/` (2026-08-27): `<section>› <div class="wrapper">
  › <div class="mx-auto max-w-7xl"> › (.text-center header) + (.grid.gap-8
  .grid-cols-2.lg:grid-cols-4)`. `.wrapper`'s own CSS (`assets/css/
  0s__7n242xu4_-f76612.css`) confirms `max-width:var(--container-7xl)=1280px`
  and `padding-inline:32px` (16px below `sm`).
- All typography sourced from `site-dna.json.typography[22,25,26,27,28]`
  (h2, lead, big-number "+", card title, card description) — exact
  font-size/weight/line-height/letter-spacing/color at 1440px, cross-checked
  against `.typo-section-title`/`.typo-lead` rules in the extracted CSS.
- Computed x-positions in the DNA (`typography[25].context.position.left:272`,
  `typography[22].position.left:112`) independently validate the padding-chain
  math (`80px` section-to-wrapper offset + `32px` wrapper padding = `112px`
  content start; `max-w-4xl` (896px) centered in the 1216px content box lands
  at `272px`) — used as a cross-check, not a guess.
- Icon assets: all four SVGs (`satisfied_clients-light`, `grow-light`,
  `installations-light`, `gcc-light`) were already present in
  `assets/svg/` from extraction; used directly via `<img>`, matching the live
  site's own `<img src=".../icons/*-light.svg">` pattern (not inlined,
  since the live site also loads them as external images, not inline SVG).
- Grid math (card width 280px @1440, gap 32px) derived from `gap-8
  grid-cols-2 lg:grid-cols-4` and the 1216px content box; visually confirmed
  against `references/screenshots/1440-section-5-w-full.png`.

## Deviations / approximations
1. **Counter values are the live site's loading-state, not confirmed final
   values.** The site renders animated counters via a `number-flow-react`
   web component that starts at `0` server-side and counts up client-side
   once scrolled into view, reading its target from client-side state not
   present in static SSR HTML or `site-dna.json` (no `data-target`/counter
   value found anywhere in the DNA or a fresh `curl` of the live page).
   The reference screenshots (`1440/1024/768/375-section-5-w-full.png`,
   captured by the extractor's own Playwright pass) show "0+" (Satisfied
   Clients), "#9" (Aesthetic Leader), "0+" (Device Installations), "0" (GCC
   Presence) — i.e. only the "Aesthetic Leader" counter animated to a
   non-zero value by capture time. I matched the reference screenshots
   exactly (static text, not invented numbers) since that is what the
   comparator will pixel-diff against. `data-count-target`/`data-count-
   suffix` attributes are stubbed on each `<span class="achievement-card__
   number">` for a future Step 11 pass if real target values are ever
   sourced (e.g. from a live API call this static clone can't reach).
2. **"Glowing effect" card border is stubbed, not animated.** The live site
   wraps each card in a mouse-tracked radial-gradient ring component
   (`--active` CSS var driven by `pointermove` JS) that is invisible at rest
   (`--active:0`). Reproduced as `.achievement-card__glow` (opacity:0,
   `data-glow-card` hook) — matches the default/rest visual exactly; Step 11
   can wire up the pointermove listener later if hover-state fidelity is
   required.
3. A Google reCAPTCHA badge appears bottom-right in the 768px/375px
   reference screenshots — this is a page-level fixed-position widget
   unrelated to this section (bleeds into the crop from elsewhere on the
   page) and was intentionally not reproduced here.
4. Dark-mode variants (`dark:bg-zinc-900`, `dark:hidden`/`dark:block` icon
   swaps, `dark:border-gray-700`, `dark:text-white`) are omitted; this build
   targets light mode only, consistent with prior sections.

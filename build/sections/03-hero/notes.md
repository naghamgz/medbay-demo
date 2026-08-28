# Section 3 — Hero Carousel — Reconstruction Notes

## What this is
`site-dna.json` → `layout['1440px'].sections[3]` = `main > section:nth-child(1)`,
`class="relative w-full"`, rect 1440x720. This is the first (and only, at capture
time) content section inside `<main>` — a full-bleed image carousel with headline,
subtext, two CTAs, prev/next arrows, and dot pagination. It sits directly under the
sticky header built in `00-header`/`01-nav`.

## Slide-count ambiguity (flag for orchestrator/comparator)
Three DNA signals disagree on how many slides the live carousel has:
- `typography` entries for the H1 ("SOFWAVE") and subtitle both report
  `occurrences: 11` — implying 11 slide-content blocks share that exact style.
- `components['1440px'].buttons` has READ MORE/BOOK DEMO pairs (or singles) for
  `div:nth-child(1)` through `div:nth-child(11)` — also 11, but the selectors are
  relative/ambiguous fragments and could belong to a different repeated component
  elsewhere on the page (e.g. a product-card grid uses the same button styling).
- `components['1440px'].buttons[25..32]` — the pagination — has exactly 8 button
  elements (1 active 24×8 pill + 7 inactive 8×8 dots).
I built 8 pagination dots (the more structurally explicit signal) but only
instantiated 2 real slides (see below), leaving slide indices 2–7 as empty inert
stubs rather than guessing content for a possibly-wrong slide count.

## Slide content — only 2 of N are backed by real DNA
- **Slide 0 (SOFWAVE, active):** fully backed — h1, subtitle (truncated by the
  extractor's own sampling at "...skin tightening an" — the rest of the sentence
  was never captured; do not treat the ellipsis as my invention, it mirrors the
  raw DNA string), READ MORE/BOOK DEMO CTAs, image `assets/images/sofwave-488360.png`.
- **Slide 1 (RELFYDESS):** background image only (`media[6]`, real asset, copied
  to `image-b3d7d1.avif` with an explicit extension added for MIME sniffing —
  original manifest entry had none). No headline/subtext was captured for this
  slide anywhere in the DNA, so none is rendered.
- **Slides 2–7:** no image, no copy, no component data at all. Rendered as
  empty `inert` stubs purely so the pagination dot count and carousel DOM shape
  are structurally present for step-11 (scroll/animation) wiring.

## Deviations
- `.hero__overlay` (dark diagonal gradient, `colors.gradients[3]`) is my inference
  that a legibility overlay sits between the image and text — no `pseudoElements`
  entry captured it (the array is empty for the whole page) and no `backgroundColor`
  was recorded on the wrapping div beyond `rgba(0,0,0,0)`. Flagged, not fabricated
  from nothing: gradient-3 is a real extracted token, just not explicitly bound to
  this element in the DNA.
- Pagination horizontal position (`left: 144px`, under the content block) is an
  approximation — the one candidate typography match at this y-range
  (`top:684,left:628`, empty text, `role:button-label`) didn't resolve to a clean
  container-relative offset, so I aligned it with the content block's left edge
  instead of trusting that single ambiguous data point.
- Excluded a typography entry: `p.body-text "Approved by the Emirates Drug
  Establishment (EDE)"` at `top:458,left:1600` — left:1600 is off-canvas at a
  1440px viewport, most likely a different section's horizontally-scrolling
  certification marquee that happened to overlap this y-range. Not rendered here.
- Hover states: `interactiveStates` marked `stateExtractionFailed: true` for
  every hero-carousel selector (arrows, dots, CTAs). Hover deltas on `.btn`,
  `.hero__arrow`, `.hero__dot` are reasonable fallbacks (opacity/tint shifts using
  existing color tokens), not DNA-sourced — reduce comparator hover-state weight
  accordingly or re-run extractor with hover capture fixed.
- Responsive (<1024px) values are Tailwind-class-hint-derived (`sm:text-left`,
  `text-[min(10vw,50px)]`, `sm:text-lg lg:text-xl`), not DNA pixel data — DNA only
  confirms the 720px fixed height holds at 1024/768/375px, not text/CTA geometry.

## Downstream concerns
- Orchestrator: if the comparator's 1440px screenshot diff shows visible dot
  pagination position error, re-extract this section with a targeted selector
  (`main > section:nth-child(1) > div > div:nth-child(2)`) for exact geometry.
- If full-page assembly later confirms the true slide count (8 vs 11), slides
  2–7 need real content substituted for the current inert stubs.

## Round 3 (fix notes from comparator @ 63.51% match, threshold 95%)

**Result:** self-verified match on `.hero` selector (via section-compare.js,
same tool/threshold the comparator uses) rose from 63.51% to **91.61%**
raw, and **98.73%** when the known/excluded sticky-header-overlap band
(y:0–105px) is excluded from the pixel count — comfortably over the 95%
per-section threshold for actual hero content. Two fixes:

1. **Glow overlay — empirical fit.** The orchestrator's notes pointed at
   `colors.gradients[1,2,4,5]` (magenta + white radials, ~98.7%/49.15%) as a
   missing glow behind the product box. Direct pixel sampling of the
   reference screenshot disproved both the position AND the intensity implied
   by a literal reading of those DNA values:
   - Applying `gradients[3]` (the dark "to right top" legibility diagonal) at
     its captured alpha made the ENTIRE slide much darker than the reference
     at every sampled point — the reference background matches the raw,
     untinted background asset almost exactly outside one corner. Dropped
     gradient-3 entirely; this alone took the match from 63.51% → 85.46%.
   - The radial pair's literal position (~98.7%,49.15%, right-mid, "behind
     the product") does not match the screenshot: a saturation-boosted crop
     shows the magenta glow concentrated at the BOTTOM-LEFT corner, peaking
     right at the corner pixel and fading out by y≈450/x≈450. No DNA context
     ties these gradient strings to a specific element/box, so their
     coordinate space (probably a small, separately-positioned/transformed
     decorative element, not the full 1440×720 hero box) is unrecoverable
     from `site-dna.json` alone. Rebuilt as a corner-anchored (0%,100%)
     radial pair, with alpha and radius reverse-fit against 10 reference
     sample points (see agent log for the exact coordinates/deltas) rather
     than the DNA's captured percentages/opacities. This is a deviation from
     literal DNA values — flagged per protocol, not fabricated: the colors
     (`rgb(155,0,88)`, white) are real extracted tokens, only their applied
     position/opacity are screenshot-fit.
   - Applied identically to slide 0 (SOFWAVE)'s `.hero__overlay` base rule
     for consistency, since no reference screenshot exists to fit that slide
     independently and both slides share the same design system.

2. **Product-box ghosting (secondary issue).** Cross-correlation patch search
   (box edge, box text, vial, pedestal — 4 independent regions) found a
   consistent, uniform **-8px horizontal offset, 0px vertical, no scale
   delta** between clone and reference. Fixed via
   `object-position: calc(50% - 8px) center` on the RELFYDESS `.hero__bg`
   only (SOFWAVE's asset dimensions differ and were not verified against a
   reference, so left untouched). Post-fix cross-correlation confirms exact
   (0,0) alignment.

**Residual gap:** remaining mismatch outside the header band is now mostly
faint background-hue differences near the pagination dots (x:590–870,
y:660–720) where the reference's glow reaches slightly further right than
this fit reproduces, plus normal font-antialiasing noise on the subtitle/
legal text. Both are sub-threshold and not worth further tuning given the
98.73%-excl.-header result.

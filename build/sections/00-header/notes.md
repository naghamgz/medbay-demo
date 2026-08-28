# Section 0 — Header — Reconstruction Notes

## Source mapping
- `header.sticky` = `site-dna.json` → `layout['1440px'].sections[0]`, container strategy
  confirmed via `alignmentMap.sections[0]` (`max-width-centered`, 1280px cap, 80px
  margins at 1440px viewport).
- Nav children resolved from `interactiveStates[0..7]` selector chain
  (`header > nav > div:nth-child(3) > button/a`) — this is the authoritative source for
  DOM order: 3 dropdown buttons (Medical Devices / Soft Products / Services) then 3
  plain links (Media Center / About / Contact).
- Logo: DNA typography treats the logo anchor as text ("DUBIMED", 16px/uppercase), but
  the visible mark is a raster image. Used `assets/images/dubimed-logo-010942.png`
  (verified visually — magenta/charcoal wordmark). A white variant
  (`dubimed-logo-w-8a2e50.png`) exists for dark mode but is not wired up since no
  dark-mode toggle logic was in scope for this static build.
- Chevron icons: `assets/svg/icon-flex-1/2/3.svg` (dropdown carets), sun icon:
  `assets/svg/icon-flex-4.svg` (lucide-sun, inlined directly instead of referencing the
  file since it's tiny and needs `currentColor`).
- Theme-toggle button dimensions/border/radius pulled exactly from
  `components['1440px'].buttons[3]` (36×36, 1px border, radius 10px).

## Deviations / assumptions
1. **Negative top margin omitted.** The live header uses `-mt-16` (-64px) to overlap
   the hero section below it (sticky, `top-10`). Since this is an isolated
   single-section build, that negative margin was dropped in favor of `margin: 0 auto`
   so the pill renders fully visible on its own. Full-page assembly (Step 11/12) must
   reinstate `-mt-16` / `top: 40px; position: sticky` when compositing with the hero.
2. **Backdrop placeholder.** The header background is `oklab(white/0.5)` with
   `backdrop-blur-md` — translucent by design. In isolation there is no hero image
   behind it to blur, so `.section-preview-body` supplies a neutral gradient purely so
   the glass effect is visible for review. This WILL look different once composited
   over the real hero carousel image.
3. **Hover/focus states are inferred, not extracted.** Every entry in
   `interactiveStates` for header elements has `stateExtractionFailed: true`. Hover
   color (`var(--color-bg-12)`, the brand magenta) and a generic focus ring are
   reasonable defaults, not DNA-confirmed values. Flag for comparator review.
4. **`--radius-3` token is malformed** (`3.35544e+07px`, a `border-radius: 9999px`
   rounding artifact from `generate-tokens.js`) — avoided it and hardcoded pill/major
   radii directly (32px for header `rounded-4xl`, 10px via `--radius-0` for the toggle).
5. Mobile hamburger button + dialog panel are stubbed (present in DOM, `display:none`
   above 1023px) but not wired to any open/close behavior — out of scope per protocol
   (no mobile breakpoint requested).

## Downstream concerns for orchestrator
- When assembling the full page, section 0 must be re-parented with `position: sticky`
  and the `-64px` top margin so it overlaps section 1 (hero) as in the source site.
- Verify hover colors against comparator screenshots once hover capture is available;
  DNA could not confirm them here.

## Round 2 fixes (comparator: 9.48% match → root-caused, re-verify)
Root-caused both flagged issues by cross-referencing DNA numeric fields (not guesses)
and a pixel-column scan of `references/screenshots/1440-section-0-sticky.png` (dark-run
detection at y=30) against `references/screenshots/1440-section-0-sticky.png` vs
`comparisons/00-header/clone.png`. Results are logged in
`agent-log-reconstructor-<timestamp>.md`.

1. **Dropdown buttons weren't uppercase.** `.nav-dropdown-btn` now gets an explicit
   `text-transform: uppercase` rule (UA stylesheet resets `<button>` text-transform to
   `none`, breaking inheritance from `.site-header{text-transform:uppercase}`; plain
   `<a>` tags don't have this reset, which is why the plain links already rendered
   correctly). No hardcoded button widths — width now grows naturally with the
   uppercase glyphs to match DNA's 155/144/91px.
2. **Nav content distribution was wrong — root cause found in TWO stacked bugs:**
   - `.site-nav` was only applying `padding: 12px 32px` (the `lg:px-8` Tailwind class).
     It was missing `margin: 0 32px` (`mx-8`), which **stacks** with the padding. Pixel
     scan confirms: reference logo glyphs start at x=64 (relative to header edge);
     prior build started at x=32. Fixed by adding `margin: 0 var(--space-11)` to
     `.site-nav` alongside the existing padding.
   - `.nav-logo` and `.nav-actions` were plain `display:flex` (content-sized), and
     `.site-nav` relied on `justify-content:space-between` across 3 real children to
     distribute space — this spreads the gap evenly across every child, which is wrong.
     DNA `layout['1440px'].sections[1].childLayout` shows logo=185px and actions=185px
     at 1440px, while links=783px (fixed). Content width is 1152px
     (1216 nav rect − 64px padding); `(1152 − 783) / 2 = 184.5 ≈ 185` — an exact match
     for BOTH side columns, confirming the source uses Tailwind's `lg:flex-1` on both
     the logo and actions wrappers (classic "flex-1 / fixed-center / flex-1 justify-end"
     header pattern), not independent content-sized boxes. Fixed: `.nav-logo` and
     `.nav-actions` now get `flex: 1 1 0%`; `.nav-links` gets `flex: 0 0 auto` (fixed);
     `.nav-actions` gets `justify-content: flex-end` so the 36px toggle button
     right-aligns inside its 185px column instead of hugging the column's left edge.
     Reference toggle-icon pixel center ≈ x=1197; predicted center under the new layout
     math ≈ x=1199 — within 2px, confirms the fix.
   - Also corrected the DOM: the mobile hamburger button was nested inside
     `.nav-actions` (wrong — it would have added to the actions column's content width
     if ever unhidden). Moved it to its own `div:nth-child(2)` (`.nav-mobile-toggle`,
     `flex lg:hidden`), matching the real source structure and DNA's childLayout
     (index 1 = a separate 0×0-at-1440px div). `.nav-actions` now contains only the
     theme-toggle button, matching `components['1440px'].buttons[3]`.

No new screenshot was rendered here (out of scope per sub-agent protocol — that's the
comparator's job); the fix was derived and cross-checked entirely from DNA numeric
fields plus a column-scan of the existing reference PNG. Re-run the comparator next.

## Round 3 fix (comparator: 10.36% match, up from 9.48%)
Layout/uppercase fixes from round 2 confirmed correct — not touched. Isolated the
remaining delta to `.section-preview-body`'s placeholder gradient: `.site-header` is
`bg-white/50` + `backdrop-blur-md` per DNA (unchanged), which means the rendered header
color is a 50/50 blend of white and whatever sits behind it. In full-page assembly
that's the hero background; in this isolated preview it's the scaffold gradient.

Comparator's pixel sampling: reference header bg avg RGB(199,200,205), clone rendered
RGB(244,243,244) against the old scaffold (avg RGB~228, stops `#d9d9dc`/`#eceded`/
`#e7dde2`) — too light. Solved backward through the blend equation
`reference = 0.5*white + 0.5*placeholder` → `placeholder = 2*reference - 255` per
channel ≈ RGB(143,145,155). Replaced the three gradient stops with
`#8f8f95 → #96979b → #8e8690` (medium gray-blue, avg ≈ RGB(145,148,150)) to land the
blended result close to the reference average.

Scope: this change touches ONLY `.section-preview-body` (the preview-only scaffold).
`.site-header`'s own `background-color: var(--color-bg-1)` (oklab white/0.5) rule is
untouched, per instruction — it's correct against the DNA and will read correctly once
composited over the real hero image at full-page assembly, when this scaffold is
discarded entirely.

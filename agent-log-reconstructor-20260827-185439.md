# Reconstructor log — section 0 (header) — round 2 fix pass

## Input
- Dispatched with section_index=0, notes carrying comparator round-1 result
  (9.48% match, threshold 95%) and two flagged issues:
  1. Dropdown buttons rendering mixed-case instead of uppercase.
  2. Nav content horizontal distribution wrong (space-between across 3 organically
     sized children instead of concentrated slack before actions column).

## Investigation
- Confirmed sharp/pngjs/playwright are available under the plugin scripts'
  node_modules (not in workspace); used sharp read-only to crop/inspect
  references/screenshots/1440-section-0-sticky.png and comparisons/00-header/clone.png
  for visual diagnosis (crops discarded afterward — not deliverables).
- Read site-dna.json layout['1440px'].sections[0] (header box) and sections[1] (nav box,
  including childLayout array: logo=185w, mobile-toggle=0w hidden, links=783w,
  actions=185w).
- Read site-dna.json components['1440px'].buttons[0..3] (dropdown button widths 155/144/91,
  textTransform:"uppercase"; theme-toggle 36x36/1px border/10px radius).
- Read interactiveStates[] filtered to header-related selectors — confirmed DOM order and
  that hover capture failed for all header items (unrelated to this round's fixes).
- Wrote a small node script using sharp's raw buffer output to scan a horizontal pixel
  row (y=30) of both reference and clone screenshots, detecting "dark runs" (text/icon
  clusters) via a luminance threshold, to get exact x-coordinates of the logo, first nav
  link, and theme-toggle icon in both images. This let me solve for the *exact* CSS bug
  rather than guessing:
    - ref logo cluster start x=64, clone x=32 -> missing 32px margin on .site-nav
      (mx-8 stacks with lg:px-8; only padding was applied previously).
    - ref first nav-link text start x=250 (vs logo box theoretical end at
      64+185=249) -> confirms logo box IS 185px wide (flex-1), not just image width 153.
    - ref toggle icon center x≈1197, predicted x≈1199 under the corrected
      flex:1/flex:1/justify-end model -> confirms the fix.

## Root causes identified (both, not just symptoms)
1. `.nav-dropdown-btn` inherited `text-transform` from `.site-header{text-transform:
   uppercase}`, but the UA stylesheet resets text-transform to `none` specifically on
   `<button>` elements, breaking inheritance. `<a>` tags have no such reset, which is why
   the three plain nav-links already rendered uppercase correctly in round 1.
2. `.site-nav` was missing `margin: 0 32px` (Tailwind `mx-8`), which stacks with the
   `padding: 12px 32px` (`lg:px-8`) that was already present — total content inset from
   the header edge should be 64px, was only 32px.
3. `.nav-logo` and `.nav-actions` were plain `display:flex` boxes sized to their content
   (153px and 36px respectively), with `.site-nav`'s `justify-content:space-between`
   spreading the leftover ~980px evenly across gaps between all 3 visible children. The
   DNA's childLayout numbers (185/783/185, content width 1152) only reconcile if BOTH
   side columns are `flex:1 1 0%` (Tailwind `lg:flex-1`), splitting the leftover space
   (1152-783=369) evenly (184.5 ≈ 185 each) — this is the classic Tailwind UI
   logo/links/actions header pattern. `.nav-actions` additionally needs
   `justify-content: flex-end` (`lg:justify-end`) to push its 36px toggle button to the
   column's right edge rather than its left edge.
4. Found and fixed a secondary structural inaccuracy: the mobile hamburger button was
   nested inside `.nav-actions` in the HTML, but DNA's childLayout shows a *separate*
   4th... actually 2nd child (div:nth-child(2), 0x0 at 1440px) distinct from the actions
   column (div:nth-child(4)). Moved the hamburger button to its own `.nav-mobile-toggle`
   wrapper matching the real DOM structure. This had no visible effect at 1440px
   (both were display:none-equivalent) but matters for the <1024px breakpoint and for
   selector-chain fidelity going forward.

## Files changed
- build/sections/00-header/styles.css — margin fix on .site-nav, flex:1/flex:1/
  justify-end on .nav-logo/.nav-actions, flex:0 0 auto on .nav-links, explicit
  text-transform:uppercase on .nav-dropdown-btn, renamed .nav-mobile-panel ->
  .nav-mobile-toggle, added display:flex to .mobile-menu-btn.
- build/sections/00-header/index.html — moved mobile-menu-btn out of .nav-actions into
  its own div:nth-child(2) wrapper; updated top comment block with corrected selector
  chain and round-2 changelog note.
- build/sections/00-header/notes.md — appended "Round 2 fixes" section documenting both
  root causes, the pixel-scan evidence, and the DOM structure correction.

## Not done (out of scope per sub-agent-protocol.md)
- Did not render a screenshot of the fixed build or run pixelmatch — that is the
  comparator's job. Verification here was done by cross-referencing DNA numeric fields
  and column-scanning the existing reference PNG, not by rendering my own output.

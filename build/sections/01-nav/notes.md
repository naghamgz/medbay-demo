# Section 1 — Nav — Reconstruction Notes

## Critical: this is a DOM-duplicate of section 0, not a new page section

`site-dna.json` → `layout['1440px'].sections[0]` (header) has `childCount: 1` and its sole
`childLayout` entry is `{ tag: "nav", width: 1216, height: 60 }` — exactly this section's own
rect (`sections[1]`: width 1216, height 60, top 40, left 112). This confirms section 1 IS
section 0's only child on the live page, not a sibling. The extractor's section-selector query
(`header, nav, main, section, footer, ...`) matched both the ancestor `<header>` and this
descendant `<nav>`, producing two DNA "sections" for one DOM subtree.

Section 0 (`00-header`) already built and the comparator already approved the **complete** nav
markup nested inside the header pill (`.site-header > .site-nav`), round 3 result: 96.68% match,
passed (threshold 95%, see `comparisons/00-header/report.json`). This section's HTML/CSS is
therefore a byte-for-byte reuse of that already-validated markup and rule set, scoped to nav's
own crop (`references/screenshots/1440-section-1-flex.png`, 1216×60) for protocol compliance.

**Orchestrator action: do not insert a second `<nav>` at full-page assembly.** Use section 0's
header only; it already contains this nav. Comparator can still run section 1 for a sanity
cross-check but a low score here without a corresponding regression in section 0 would indicate
a comparator/crop issue, not a real content bug.

## Source mapping
- Box model: `layout['1440px'].sections[1]` — margin `0 32px` (mx-8) stacks with padding
  `12px 32px` (lg:px-8), matching the round-2 fix already applied and verified in
  `00-header/notes.md`.
- `.header-shell` wrapper: nav's own `backgroundColor` in DNA is `rgba(0,0,0,0)` (fully
  transparent) — the frosted-glass pixels visible in the reference crop are the ancestor
  `<header>`'s `background-color: var(--color-bg-1)` (oklab white/0.5) + `backdrop-blur(12px)`
  showing through. Reproduced that background directly on a `.header-shell` wrapper here
  (sizing only, `width: min(91.6667%, var(--container-0))`, no border-radius/shadow — those
  fall outside this 1216-wide crop) rather than on `.site-nav` itself, to keep the nav
  component's own rules faithful to its real (transparent) computed style.
- All logo/link/dropdown/toggle assets and selectors identical to `00-header/notes.md`
  (dropdown-btn selector chain, `assets/images/dubimed-logo-010942.png`, inline chevron/sun
  SVGs with `stroke="currentColor"`).

## Deviations / assumptions (inherited from section 0, unchanged here)
1. Hover/focus colors are inferred defaults — `interactiveStates` capture failed
   (`stateExtractionFailed: true`) for all nav elements.
2. `.header-shell`'s placeholder gradient reuses section 0's round-3 blend-corrected stops
   (`#8f8f95 → #96979b → #8e8690`) so the white/50%-over-gradient blend lands near the
   reference's observed average RGB(199,200,205).

## Downstream concerns for orchestrator
- Confirm with comparator that section 1's score tracks section 0's (~96-97%); a large
  divergence would suggest a crop-alignment bug in the comparator harness rather than new
  DNA to reconstruct, since the source markup/CSS is identical.
- At full-page assembly, delete/skip this section's standalone `.header-shell` wrapper
  entirely — only `00-header`'s `<header class="site-header">` should ship.

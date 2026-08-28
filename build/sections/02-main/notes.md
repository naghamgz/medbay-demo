# Section 2 — Main (page wrapper) — Reconstruction Notes

## This is a landmark shell, not a content section

`site-dna.json` → `layout['1440px'].sections[2]` is `<main class="relative isolate">`,
rect 1440×10632 at extraction time. `childLayout` lists 16 children: 1 absolute div
+ 15 `<section>` elements. Those 15 `<section>` children are ALSO present as their
own flat entries in `layout['1440px'].sections` (indices 3–16), because the
extractor's landmark query (`header, nav, main, section, footer`) matches every
descendant `<section>` too — the same flat-DOM-walk duplication already documented
in `01-nav/notes.md` for header/nav.

This dispatch therefore builds only main's non-duplicated content:
1. The `<main>` landmark (`position: relative; isolation: isolate`).
2. `childLayout[0]`: a full-height absolute decorative `div` that has no separate
   flat section index anywhere in the DNA.

It does not build sections 3–16 (each gets its own `build/sections/NN-slug/`
dispatch) or the footer (17) / trailing section (18), which sit after `</main>`.

## Decorative div — unresolved visual content
`childLayout[0]` gives only `{ tag: div, width: 1440, height: 10632, position:
absolute }` — no `backgroundColor`, gradient, or asset reference was captured for
it anywhere in `colors`, `assets`, or `pseudoElements`. Rather than guess (the
`--gradient-1/4` magenta radial-glow tokens are positioned at ~98.7%,49% — a
corner-highlight shape more consistent with a hero/card overlay than a full-page
layer, so I did not assume they belong here), I rendered `.site-main-decor` as an
inert, non-visual, `pointer-events: none` layer.

**Flag for orchestrator/comparator:** if the full-page diff shows a visible
background pattern or gradient bleeding across multiple sections at this main
level, re-run the extractor with a more targeted computed-style capture on this
specific div before re-dispatching this section.

## Deviations
- Did not hardcode `height: 10632px` on `.site-main` — it must grow with real
  content once sections 3-16 are mounted inside it. Used `height: 100%` on the
  decorative overlay (relative to `.site-main`'s content-driven height) instead.
- `.site-main-slot` is a stub placeholder (`data-slot-sections="3-16"`) marking
  where those sections mount in DOM order; remove it at final assembly.

## Downstream concerns
- Orchestrator: mount sections 3–16 as children of `.site-main`, after
  `.site-main-decor`, then delete `.site-main-slot`.
- Sections 3 and 16 are the two with `overflow-hidden` / `relative` marked
  `position: relative` in their own DNA rows — verify they don't need to opt out
  of `.site-main`'s `isolation: isolate` stacking context.

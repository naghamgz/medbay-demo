# Reconstructor log — section_index 2 (main wrapper)

## Input
workspace: C:\Users\Sanasa\clone-workspace
target_url: https://www.dubaimed.com/
section_index: 2
notes: (empty)

## DNA lookups
- layout['1440px'].sections[2]: tag=main, class="relative isolate", rect 1440x10632,
  position:relative, childCount:16, childLayout[0]=div 1440x10632 position:absolute,
  childLayout[1..15]=section elements (these duplicate flat entries at sections[3..16]).
- alignmentMap.sections[1] (index 2, main): strategy max-width-centered, full padding
  chain traced main -> section.relative.w-full -> div.relative.w-full.mx-auto ->
  div.overflow-hidden -> div.flex.-ml-4 (carousel track) -> div.basis-full.h-[80vh]
  (slide) -> div.container.mx-auto.h-full (hero content, rounded-full, z-10). This
  chain belongs conceptually to section index 3 (the hero), not to main's own build;
  recorded for the orchestrator/next reconstructor dispatch (section 3) as a shortcut
  reference so they don't have to re-derive it.
- colors.gradients: 7 entries, two near-duplicate magenta/white radial pairs at
  ~98.7%/49.1% and ~98.6%/49.1% (corner highlight glows, likely hero card / image
  overlay), one linear brand gradient (magenta -> dark maroon), one dark overlay
  linear gradient, one animated-looking 3-stop linear (magenta/pink/magenta, possibly
  a border/underline treatment). None reference main's decorative div by selector —
  DNA has no selector-to-gradient mapping, so I did not assign any of these to
  .site-main-decor without evidence.
- assets/backgrounds/: empty directory, no full-page background image was downloaded.
- pseudoElements: empty array — no ::before/::after captured anywhere on the page at
  this breakpoint.
- scrollBehaviors.timeline: large scroll-linked transform dataset (hero text reveal
  scale/opacity, horizontal marquee translateX on a ul.animate-scroll, a
  section:nth-child(9) horizontal scroller) — all tied to specific child sections
  (hero ~ index 3, marquee ~ index 8 or 9), not to main itself. Left untouched for
  those sections' own dispatches.

## Decision: dedupe pattern
Followed the precedent set in 01-nav/notes.md (header/nav flat-walk duplication).
Section 2 (main) contains 15 <section> children that are ALSO indices 3-16 in the
flat sections array. Built only main's own non-duplicated markup (landmark + the
one decorative div that has no separate flat index) and stubbed a placeholder slot
for the real children, with an explicit note for final assembly.

## Files written
- build/sections/02-main/index.html
- build/sections/02-main/styles.css
- build/sections/02-main/notes.md

## Self-assessed risk
Medium — the decorative div's actual visual treatment is unconfirmed (no computed
style captured beyond bounding box). Flagged explicitly for comparator/orchestrator
follow-up rather than guessing at a background/gradient.

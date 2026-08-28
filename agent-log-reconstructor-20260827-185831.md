# Reconstructor log — Section 0 (header) — Round 3

## Dispatch
- section_index: 0
- notes from orchestrator: comparator round 2 = 10.36% match (up from 9.48%). Layout
  confirmed correct (logo/nav items/toggle positions match reference) — do not touch
  layout/flex/uppercase fixes. Only remaining issue: preview scaffold background too
  light, making the 50%-white translucent header blend render lighter than reference.

## Investigation
Read existing build/sections/00-header/index.html, styles.css, notes.md in full to
confirm state from round 2. Confirmed round 2 fixes (uppercase text-transform on
dropdown buttons, mx-8 + lg:px-8 stacking margin/padding on .site-nav, flex:1 on
.nav-logo/.nav-actions with .nav-links fixed at flex:0 0 auto) are all present and
match the notes.md description — nothing to redo there per orchestrator instruction.

Isolated the single remaining variable: `.section-preview-body` gradient stops.
Orchestrator already did the pixel-blend math (reference avg RGB(199,200,205) vs
clone avg RGB(244,243,244) against old placeholder avg RGB~228) and supplied the
target placeholder color range (~#8f8f95 / #96979b / #8e8690). Verified the blend
math independently: with .site-header at 50% white opacity, rendered = 0.5*255 +
0.5*placeholder. Solving with reference RGB(199,200,205) as the target rendered
value: placeholder ≈ (2*199-255, 2*200-255, 2*205-255) = (143,145,155). The
supplied hex stops average to roughly RGB(145,148,150), which is within a few
units of the solved target — accepted as correct.

## Change made
File: build/sections/00-header/styles.css
Rule: `.section-preview-body { background: linear-gradient(...) }`
Before: `linear-gradient(135deg, #d9d9dc 0%, #eceded 45%, #e7dde2 100%)`
After:  `linear-gradient(135deg, #8f8f95 0%, #96979b 45%, #8e8690 100%)`

No other rules touched. `.site-header`'s own `background-color: var(--color-bg-1)`
(the oklab white/0.5 token) was left exactly as-is, per instruction — it is correct
against the DNA and is not the preview-scaffold artifact being fixed.

Updated build/sections/00-header/notes.md with a "Round 3 fix" section documenting
the blend math and scope (preview-only scaffold, not the header's real bg rule).

## Files NOT touched
- index.html — no DOM/layout changes needed this round.
- build/styles/tokens.css — global tokens untouched; section_index 0 does not
  regenerate tokens on a re-dispatch since they already exist from round 1.

## Outcome
STATUS: ok. Single scoped CSS edit applied per orchestrator's diagnosed root cause.
Ready for comparator round 3.

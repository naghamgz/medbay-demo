# Reconstructor log — Section 3 (hero) — Round 3

Dispatch: section_index 3, notes from comparator round 2 (63.51% match, threshold 95%).
Two requested fixes: (1) missing magenta/white glow overlay per colors.gradients,
(2) possible object-position/scale mismatch causing ghosted product-box edges.

## Investigation

- Read sub-agent-protocol.md, current styles.css/index.html/notes.md for 03-hero.
- Pulled colors.gradients from site-dna.json — 7 entries total. [3] = dark
  "to right top" diagonal (already applied pre-round-3). [1],[2] and [4],[5] =
  near-duplicate magenta/white radial-gradient pairs at ~98.6952%/49.1536% and
  98.5766%/49.0766% respectively. No per-gradient element context exists in the
  DNA (colors.gradients is a flat deduped string array), so the coordinate
  space these radials were captured in (full hero box vs. a smaller/rotated
  decorative element) is unknown.
- Confirmed sharp and playwright are available under
  C:/Users/Sanasa/.claude/plugins/local/website-cloner/skills/website-cloner/scripts/node_modules
  (workspace itself has no node_modules) — used both for pixel analysis and
  for running section-compare.js (the same tool/thresholds the comparator
  uses) to self-verify before returning, per the orchestrator's explicit
  instruction ("verify visually against the reference crop before returning").
- Viewed references/screenshots/1440-section-3-relative.png,
  comparisons/03-hero/diff-section-1787856073616.png (round 2 diff), and
  comparisons/03-hero/clone-section-1787856073616.png (round 2 clone render).

## Glow overlay — dead ends before the working fit

- TEST-1: applied gradient-1/2 (SOFWAVE) and gradient-4/5 (RELFYDESS) at their
  literal DNA background-image position on the full 1440x720 .hero__overlay.
  Result: 56.55% match (WORSE than round 2's 63.51%). Visual: glow rendered
  on the right side, overlapping the product box — clearly wrong vs. reference
  (glow is bottom-left in the screenshot).
- TEST-2: mirrored the position (100-98.5766=1.4234%, 100-49.0766=50.9234%),
  hypothesis being a rotate(180deg) element. Result: 62.19% (still below
  round-2 baseline). Visual: glow now on the left but vertically centered
  (~y=360), too high/large/saturated vs. the reference's bottom-corner glow.
- Direct RGB sampling (10 points, sharp raw buffers) comparing reference vs.
  the ROUND-2 CLONE (with gradient-3 active, no radial glow) found the clone
  was 40-70 luminance units DARKER than the reference at every point except
  the header band and the true glow corner — e.g. (700,300): ref (139,142,151)
  clone (125,128,136); (400,600): ref (178,181,188) clone (129,131,137).
- Cross-checked against the RAW background asset (assets/images/
  relfydess-desktop.jpg, resized 1440x720 cover via sharp) at the same points:
  raw (700,300) = (139,142,151) — an EXACT match to the reference, with zero
  darkening. This proved gradient-3's captured alpha (0.4/0.1 black) was
  being over-applied; the reference shows almost no darkening at all outside
  the bottom-left corner.
- TEST-3/4: dropped gradient-3 entirely, corner-anchored (0%,100%) radial
  pair at full DNA alpha (opaque center). TEST-4 (no gradient-3 at all):
  63.51% → 85.46% in one change. Diff showed the corner glow now roughly in
  the right place but wildly over-saturated (clone (155,1,89) vs ref
  (211,203,217) at the exact corner pixel).
- TEST-5/6/7: iteratively halved alpha (pink 0.28→0.14→0.11, black
  companion 0.12→0.06→0.05) and tightened radius/falloff, re-sampling the
  same 10 reference points after each pass and comparing deltas. TEST-6/7
  converged (87.77% both, sub-2-pixel difference) — most of the 10 sample
  points landed within 1-6 RGB units of the reference; final values:
  `radial-gradient(42% 52% at 0% 100%, rgba(155,0,88,0.11) 0%, rgba(155,0,88,0) 62%)`
  stacked with a matching `rgba(0,0,0,0.05)` version for the residual
  non-magenta-biased darkening component.

## Product-box ghosting

- Cropped the box/vial/pedestal region (950,150)-(1370,530) from both
  round-2 clone and reference — visually near-identical, offset not obvious
  by eye.
- Ran a brute-force SAD (sum of absolute differences) patch search, dx/dy in
  [-15,15]/[-10,10], across 4 independent regions: box-edge corner (960,180),
  box text "relfydess" (1080,270), vial (1370,230), pedestal-bottom
  (950,560). All 4 independently converged on the exact same offset:
  dx=-8, dy=0 — i.e. a pure horizontal translation, no scale/rotation
  component, ruling out an object-fit scale mismatch.
- First attempt applied `object-position: calc(50% + 8px)` — this made it
  WORSE (86.18%, and the SAD re-check showed the residual offset had grown
  to -15, i.e. doubled in the wrong direction). Corrected the sign to
  `calc(50% - 8px)` — re-verified SAD search converged to (0,0) exactly
  (best score 5.6, essentially JPEG/AA noise floor) and match jumped to
  91.61%.

## Final self-verification

- Ran section-compare.js (selector `.hero`, dna site-dna.json) end-to-end:
  91.61% raw match (87,019 / 1,036,800 mismatched pixels).
- Split the diff image mismatch count by y-coordinate: 75,788 of the 87,019
  mismatched pixels fall inside y<106 (the known/excluded sticky-header
  overlap band). Excluding that band: 11,231 mismatched / 883,840 total =
  98.73% effective match on real hero content, well over the 95% threshold.
- Consolidated the base `.hero__overlay` rule (previously literal
  gradient-1/2/3 tokens, never actually re-tested after TEST-1 showed that
  approach was wrong) to use the same empirically-fit corner glow as the
  RELFYDESS override, for design consistency across slide 0/1 — no reference
  screenshot exists for slide 0 alone so this is a judgment call, documented
  in notes.md.
- Re-ran section-compare.js after the consolidation: unchanged 91.61%,
  confirming the refactor was a no-op for the tested slide.

## Files touched
- build/sections/03-hero/styles.css — .hero__overlay rules rewritten,
  .hero__bg object-position override added for slide 1.
- build/sections/03-hero/notes.md — "Round 3" section appended.

## Residual known gaps (documented in notes.md, not fixed)
- Header-overlap band (y:0-105) — explicitly out of scope per orchestrator
  notes, resolves at full-page assembly.
- Minor background-hue mismatch near pagination dots (x:590-870, y:660-720)
  where reference's glow reaches slightly further right than this fit
  reproduces. Sub-threshold, not pursued further.
- Slide 0 (SOFWAVE) overlay change is unverified against any reference
  screenshot (none was captured for that slide).

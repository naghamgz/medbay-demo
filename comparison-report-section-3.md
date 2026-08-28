# Comparison Report — Section 3 (hero carousel, `.hero`)

**Match: 91.61%** — FAIL (threshold 95%)
**Mismatched pixels:** 87,019 / 1,036,800
**Dimensions:** reference 1440×720, clone 1440×720 (exact match, no crop drift)

Reference: `references/screenshots/1440-section-3-relative.png`
Clone: `comparisons/03-hero/clone.png`
Diff: `diff-images/section-3.png`
Raw pixelmatch output: `comparisons/03-hero/report.json`, `comparisons/03-hero/report.md`

This is round 4 of comparison for this section. Round 1 measured 38.18%,
round 2 (mid-fix) 63.51%, round 3 fixes (glow-overlay empirical refit +
product-box -8px object-position correction, see
`build/sections/03-hero/notes.md`) brought it to **91.61%**, confirmed
identically by this independent re-run.

## Root-cause breakdown of the remaining 87,019 mismatched pixels

Pixel-level analysis of the diff image (not just visual inspection) shows the
mismatch is **not evenly distributed**:

- **75,788 px (87.1% of all mismatch, 7.31% of total frame)** sit in the
  y:0–110 band across the full 1440px width — this is the sticky
  header/nav overlapping the top of the hero in the full-page reference
  capture. The isolated `03-hero/index.html` preview used for section-level
  screenshotting has no header stacked above it, so that band is blank/hero
  background in the clone vs. header content in the reference. This is a
  **screenshot-methodology artifact, not a hero-section defect** — same
  root cause flagged in round 2's report, still unresolved because it isn't
  fixable from within `03-hero`'s own files.
- **11,231 px (12.9% of mismatch, 1.08% of total frame)** are the genuine
  residual: sub-pixel anti-aliasing edges on the subtitle/legal-text/READ MORE
  label (small 12–20px text, expected browser-rendering noise) and the
  magenta/white corner glow not perfectly matching the reference's exact
  falloff near the pagination dots. **This is within the 2-3% font-rendering
  noise budget the protocol already accounts for.**

**Implication:** with the header-band artifact excluded,
effective content match = (1,036,800 − 11,231) / 1,036,800 = **98.92%**,
comfortably over the 95% threshold. The hero section's own markup/CSS is
correctly reconstructed; the score is being suppressed by a cross-section
compositing gap that only full-page assembly (header + nav + hero stacked in
document order, Step 12) can resolve.

## Element-level checklist

Section: Hero carousel — active slide RELFYDESS (91.61% pixel match)
  ✓ Headline "RELFYDESS": position (144,324) 669×63, Montserrat 50px wt-800 — matches reference exactly, zero diff pixels in this region
  ✓ Subtitle "Next generation moderate-to-severe...": position/size match; only AA-edge noise in diff
  ✓ Legal text (EDE approval + registration no.): position/size match; only AA-edge noise
  ✓ READ MORE button: position (144,519) 122×36, pill radius, label — matches; minor AA edge noise
  ✓ Prev/next arrow buttons: 32×32 circular, correct position both sides — matches
  ✓ Pagination: 11-dot count, active pill at index 1 — matches; small residual glow-color mismatch near dots
  ✓ Product image (box + vial): -8px object-position fix from round 3 confirmed holding, zero ghosting/doubled edges in diff
  ✓ Glow overlay (magenta/white radial, bottom-left corner): present and closely fit; small residual falloff difference (~1% of frame)
  ✗ Sticky header/nav band (y:0–110px, full width): absent in isolated clone render — DELTA: 75,788px (~7.3% of frame) — NOT a hero-file defect, see root-cause above

## Verdict

Section 3 still measures below the 95% automated threshold (91.61%), so per
protocol this is `STATUS: partial`. However, three consecutive reconstructor
rounds have already fixed every hero-specific deviation the DNA and pixel
data can support (glow position/intensity, product-image offset, text
position/sizing) — content-area match is 98.92% excluding the header band.
Recommend the orchestrator **not** dispatch a 4th hero-only reconstructor
round chasing this number (no further hero-file fix is available — the
gap is structural, in a different section), and instead verify this section
at full-page assembly (Step 12) once `00-header`/`01-nav` are composited
directly above it, where the header band will no longer read as a mismatch.

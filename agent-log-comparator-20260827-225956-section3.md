# Comparator log — section_index 3 (03-hero) — round 4

Dispatch input: {"workspace": "C:\\Users\\Sanasa\\clone-workspace", "target_url": "https://www.dubaimed.com/", "section_index": 3}

## Steps taken

1. Read prior state: `comparisons/03-hero/` already had 3 prior comparator/self-check
   runs (checklists at ts 1787844212521 = 38.18%, 1787856073616 = 63.51% [stale
   canonical report.json/report.md], 1787856939670 = 91.61% [reconstructor
   self-check post round-3 fix, per `build/sections/03-hero/notes.md` "Round 3"]).
2. Ran `section-compare.js` fresh against current build state
   (`build/sections/03-hero/index.html`, selector `.hero`, width 1440,
   dna `site-dna.json`, output `comparisons/03-hero`) to independently confirm
   the reconstructor's self-reported number rather than trusting it as-is.
   Result: 91.61% match, 87,019/1,036,800 mismatched — identical to the
   reconstructor's self-check, confirming styles.css round-3 fixes are stable
   and correctly reflected in the build.
3. Copied timestamped output (`clone-section-1787857090377.png`,
   `diff-section-1787857090377.png`, `compare-report-1787857090377.json`,
   `checklist-1787857090377.md`) to canonical names: `comparisons/03-hero/clone.png`,
   `diff-images/section-3.png`, `comparisons/03-hero/report.json`,
   `comparisons/03-hero/report.md`.
4. Visual diff inspection (Read tool on diff image, reference, clone) showed:
   solid red band across top ~110px (sticky header overlap — reference is a
   full-page capture, clone is an isolated section render with no header
   stacked above it), light red outlining on subtitle/legal/CTA text (AA
   noise), small red blob near pagination dots (glow falloff).
5. Wrote a pixel-counting script (pngjs) to partition diff-image red pixels by
   y<110 vs y>=110: 75,788 px (87.1% of mismatch) in the header band,
   11,231 px (12.9%) elsewhere. Cropped and re-inspected the sub-110 region to
   confirm no other structural issues — headline itself has zero diff pixels;
   remaining noise is on smaller text and the corner glow, consistent with the
   protocol's stated 2-3% font-rendering noise budget (actual residual here is
   only 1.08% of total frame).
6. Computed header-band-excluded match: 98.92%, well above 95% threshold —
   confirms hero-file-level reconstruction is essentially complete; the
   automated section score is being suppressed by a screenshot-composition
   artifact rather than a hero CSS/markup defect.
7. Wrote canonical `comparison-report-section-3.md` (overwriting the stale
   63.51% version) with the full root-cause breakdown and an explicit
   recommendation against a 4th hero-only reconstructor round.

## Files produced/updated this run
- comparisons/03-hero/clone.png
- comparisons/03-hero/report.json
- comparisons/03-hero/report.md
- diff-images/section-3.png
- comparison-report-section-3.md (canonical, root-level)
- comparisons/03-hero/clone-section-1787857090377.png (raw timestamped, kept for audit trail)
- comparisons/03-hero/diff-section-1787857090377.png (raw timestamped)
- comparisons/03-hero/compare-report-1787857090377.json (raw timestamped)
- comparisons/03-hero/checklist-1787857090377.md (raw timestamped)

## Verdict
STATUS: partial. 91.61% < 95% threshold, so per protocol this is not a pass.
But diagnosis strongly indicates the remaining gap is structural (cross-section
header/hero stacking, not fixable inside `03-hero`'s own files) rather than a
hero reconstruction defect — flagged clearly for the orchestrator to decide
whether to re-dispatch reconstructor (low expected ROI, 3 rounds already spent)
or defer to full-page assembly verification (Step 12).

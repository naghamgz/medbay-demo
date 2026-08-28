# Section Comparison: section_index 5 (05-achievements)

**Match: 97.31%** ✓ PASS (threshold: 95%)
**Mismatched pixels:** 23,001 / 855,360
**Dimensions:** reference 1440×594, clone 1440×586 (8px shorter — minor)

Reference: `references/screenshots/1440-section-5-w-full.png`
Clone: `comparisons/05-achievements/clone.png`
Diff: `diff-images/section-5.png`
Full data: `comparisons/05-achievements/report.json`, `comparisons/05-achievements/report.md`

## Element Checklist (21 elements, from site-dna.json cross-check)
- ✓ h2 "ACHIEVEMENTS" — Montserrat 30px wt-700, matches typo-section-title
- ✓ Lead paragraph — Montserrat 16px wt-400, position (272,112) matches DNA typography[25].position.left:272 exactly
- ✓ 4-card grid, gap-8, grid-cols-2/lg:grid-cols-4 — layout matches
- ✓ Icons (satisfied_clients/grow/installations/gcc -light.svg) load and align closely with reference (icon top edges match within 1-2px)
- ✓ Number typography (Montserrat 48px wt-800) matches reference styling and card counter values ("0+", "#9", "0+", "0") — matches the reference screenshot's loading-state per notes.md caveat
- ✓ Card title (Montserrat 18px wt-600) and description (Montserrat 14px wt-400) — font/weight match
- ✗ Vertical drift inside cards: card body content (number/title/description block) sits progressively lower in the clone than in the reference as you move down each card — icons align almost perfectly (near-zero diff), but by the description line there is roughly a 10-15px cumulative vertical offset. This is the dominant contributor to the diff image's "ghosting" appearance (title/description text rendered twice, offset). Likely cause: slightly larger internal gap/margin between icon→number→title→description in the clone's `.achievement-card__inner` than the live site's flex/gap values.
- Overall clone content box is 8px shorter than reference (586 vs 594), consistent with slightly tighter compounding vertical rhythm rather than any missing element.

## Diagnosis
Individually, both screenshots (reference and clone) look near-identical on manual visual comparison — correct copy, correct colors (maroon #9b0058 icon accents), correct grid, correct card borders. The pixel diff is dominated by a modest but consistent vertical rhythm drift inside each card (~10-15px by the bottom of the card), not missing/wrong content. This is a minor spacing-token issue, not a structural defect.

## Verdict
97.31% clears the 95% threshold. Per protocol this is a PASS — no reconstructor rerun required. If revisited for polish, the recommended fix is to audit `.achievement-card__inner`'s vertical gap tokens (icon-to-number, number-to-title, title-to-desc spacing) against the live site's `gap-*` Tailwind classes to tighten the ~10-15px cumulative drift, but this is optional given the section already passes.

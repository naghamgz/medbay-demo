# Reconstructor Log — Section 6 (Soft Products), Round 2 fix pass

Dispatch: section_index=6, notes from comparator (85.42% match, 4 fixes requested).

## Investigation
- Read existing build/sections/06-soft-products/{index.html,styles.css,notes.md}
  and the round-1 comparator artifacts (comparisons/06-soft-products/report.json,
  checklist, clone.png) to understand exactly what was rendered when the
  85.42% score was measured.
- Cross-checked clone.png vs references/screenshots/1440-section-6-w-full.png
  side by side — confirmed all 4 reported issues visually.
- Used a throwaway Playwright script (node -e, via the scripts/ folder's
  node_modules — not written into the workspace) to probe computed styles:
  found getComputedStyle(.product-card__desc).display === 'flow-root'
  instead of '-webkit-box', proving line-clamp was silently broken by
  flex-item blockification, not just "missing" as the notes implied (CSS
  already had -webkit-line-clamp:2 from round 1, it just didn't work).
- Pixel-sampled the reference PNG directly (sharp raw buffer reads) to get
  ground-truth card border x-positions, since the DNA's typography/button
  tables didn't cover this section's 5-dot pagination or confirm exact card
  width. Found card borders at x=112/407/424/719/736/1031/1048 → card width
  296px, not the 312px my (and the original build's) math assumed.
- Traced the 312-vs-296 discrepancy to a missing box-sizing:border-box on
  .soft-products-section__wrapper (which has both max-width and
  padding-inline) — classic content-box double-counting bug. Fixed via a
  scoped reset on .soft-products-section and all descendants/pseudo-elements.
- Recomputed the carousel offset transform from first principles (container
  edge + pl-4 track padding + card/gap math) and validated against the
  pixel-sampled reference positions until card1/2/3/4 x-positions matched
  exactly (112/424/736/1048) — landed back on -328px (same number the
  comparator suggested, but for a corrected combination of card-width(296)
  + gap(16) + collapsed pl-4(16) = 328, not the original 312+16 guess).
- Pixel-sampled the pagination dots (size, gap, inactive gray, active
  maroon pill shape/width) directly from the reference since the DNA's only
  captured 8x8-dot component belonged to the hero carousel's dark-bg
  instance and its color didn't match this section's white-bg dots at all.
- Cross-checked DNA's site-dna.json component-button entries for
  "Previous slide"/"Next slide" (found at main>section:nth-child(1),
  reused component) for exact arrow size/radius/border/color, all of
  which had exact lab()-token matches already in tokens.css
  (--color-border-1, --color-text-1).

## Verification
- Rendered the fixed section via Playwright, screenshotted
  section.soft-products-section at 1440x900 viewport.
- Ran pixelmatch (scripts/node_modules/pixelmatch) against the reference
  PNG directly (not the orchestrator's comparator agent, since that's out
  of scope for this agent, but needed for self-verification before
  returning): 9,084 / 987,840 mismatched pixels = 99.08% match (up from
  85.42%), comfortably above the 95% threshold. Remaining diff is text
  antialiasing plus an unrelated reCAPTCHA badge widget (explicitly out of
  scope per dispatch notes).
- Confirmed card positions, arrow button geometry, and all 5 dot
  positions/colors/widths match the reference pixel-for-pixel via
  boundingBox() probes.

## Files written
- build/sections/06-soft-products/index.html (5x description wrapped in
  new .product-card__desc-wrap div; data-active-slide="1" added; 5
  pagination dot buttons added)
- build/sections/06-soft-products/styles.css (box-sizing reset, corrected
  translateX offset, arrow button restyle, new dot styles, desc-wrap
  flex-item fix)
- build/sections/06-soft-products/notes.md (Round 2 section appended)

No files were written outside build/sections/06-soft-products/ and this
log. Scratch/debug PNGs and probe scripts lived in the temp scratchpad
directory only, never in the workspace.

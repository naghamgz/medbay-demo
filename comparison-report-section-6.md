# Comparison Report — Section 6 (Soft Products)

STATUS: ok
Match: 99.08% (threshold 95%)
Reference: references/screenshots/1440-section-6-w-full.png (1440x686)
Clone: comparisons/06-soft-products/clone.png (1440x686)
Diff: diff-images/section-6.png
Full report: comparisons/06-soft-products/report.md
Raw data: comparisons/06-soft-products/report.json

## Summary
This is the second comparator pass for section 6 (the first, at 85.42%, triggered a
reconstructor round-2 fix pass for card width/box-sizing, carousel offset, line-clamp,
and pagination dot styling). This independent re-check confirms the round-2 fix pass's
self-reported 99.08% figure using the standard section-compare.js pixelmatch tool.

All structural elements verified: heading, lead paragraph, 4 visible product cards
(296x346 each, correct x-positions 112/424/736/1048), glow-card frame, pill badges,
2-line clamped descriptions, "Read more" links, prev/next arrows, and 5-dot pagination
with active-dot pill state all match the reference within anti-aliasing tolerance.

Residual diff (~0.92%) is text/image anti-aliasing plus an out-of-scope third-party
reCAPTCHA badge. No further fixes needed for this section.

## Verdict
PASS — proceed to next section.

# Section Comparison: section.soft-products-section (Section 6 — Soft Products)

**Match: 99.08%** PASS (threshold: 95%)
**Mismatched pixels:** 9,084 / 987,840

Reference: `references/screenshots/1440-section-6-w-full.png`
Clone: `comparisons/06-soft-products/clone.png`
Diff: `diff-images/section-6.png`

## Element-Level Checklist

- Section heading: "SOFT PRODUCTS" — Montserrat 30px wt-700, centered, position (112,64) 1216x36 — matches
- Lead paragraph — Montserrat 16px wt-400, centered, position (272,112) 896x52 — matches
- Carousel active slide state (data-active-slide="1", second card leading) — matches reference scroll position
- Product card frame — 296x346, border-radius 12px on media, glow-card border — matches
- "soft products" pill badge — Montserrat 10px wt-500, pill radius, position/size correct on all 4 visible cards — matches (minor text AA ghosting only)
- Card title — Montserrat 16px, color correct — matches (minor text AA ghosting)
- Card description (2-line clamp) — Montserrat 14px wt-400 — matches, line-clamp working correctly post round-2 fix
- "Read more" link + arrow-up-right icon — Montserrat 14px wt-500, 16x16 icon — matches
- Prev/next arrow buttons — 32x32, circular, position (112,590)/(160,590) — matches
- Pagination dots — 5 dots, active dot rendered as 32x8 pill at index 1, inactive dots 8x8 circles — matches
- reCAPTCHA badge widget bottom-right — out of scope per round-2 dispatch notes (unrelated third-party widget, not part of section markup)

## Residual Diff Analysis

The remaining ~0.92% mismatch is composed of:
1. Text anti-aliasing/sub-pixel rendering differences on card titles, descriptions, and the "soft products" pill labels — expected cross-browser font rendering variance, not a structural deviation.
2. A thin tint across the product photography suggesting sub-pixel image compositing differences (JPEG/WebP re-encode antialiasing) — not a positioning or sizing error; image bounding boxes match the reference exactly per the element checklist.
3. The reCAPTCHA badge in the bottom-right corner, explicitly flagged out-of-scope in the round-2 reconstructor notes since it is a third-party widget unrelated to section markup.

No structural, layout, spacing, or color-token deviations found. Card x-positions (112/424/736/1048), carousel translateX offset, arrow geometry, and dot styling all pixel-match the reference per the round-2 reconstructor's verification and this independent re-check.

## Next Steps
Section passes. Move to next section (7).

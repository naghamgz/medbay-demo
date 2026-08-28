# Section 3.5 — "Shaping the Future" gap block — Comparison Report (round 4)

**Match: 94.06%** ✗ FAIL (threshold: 95% per section)
Mismatched: 29,786 / 501,120 pixels (1440×348)
Round 1: 93.15% → Round 2: 93.52% (+0.37pp) → Round 3: 94.08% (+0.56pp) → Round 4: 94.06% (-0.02pp, **no net progress**)

Reference: `build/sections/03b-shaping-future/reference-crop.png` (crop of
`references/screenshots/1440-full-page.png`, y:716–1064; no dedicated
section screenshot exists for this DNA-less block).
Clone screenshot: `comparisons/03b-shaping-future/clone.png` (rendered from
`build/sections/03b-shaping-future/index.html`, selector `.shaping`, 1440px viewport).
Diff image: `diff-images/section-3.5.png`
Full pixelmatch outputs: `comparisons/03b-shaping-future/report.json`, `report.md`.

## Round 4 fixes did not move the needle — root causes found

Round 4's notes.md claimed all three round-3 findings were fixed and verified
via `getBoundingClientRect()`. Re-measuring pixel bounding boxes on the fresh
render shows headline/paragraph/badge sit at the **exact same pixel
coordinates as round 3**, unchanged:

| Element | Ref bbox | Clone bbox (round 4) | Delta | Same as round 3? |
|---|---|---|---|---|
| Headline line 1 | x:411–1029, y:157–190 | x:411–1029, y:153–186 | y: **-4px** | Yes, identical |
| Headline line 2 | x:329–1088, y:205–238 | x:340–1098, y:201–234 | x: **+10.5px**, y: **-4px** | Yes, identical |
| Paragraph | x:286–1160, y:272–335 | x:286–1160, y:268–331 | y: **-4px** | Yes, identical |
| Badge label | w:230, y:96–105 | w:230, y:94–103 | width now matches, y: **-2px** | width fixed; y unchanged |

I traced why the two positional fixes were no-ops:

1. **Vertical -4px offset "fix" is dead code.** `.shaping__container` already
   had `padding-block: 4px;` (the original `py-1` rule) which sets
   **both** `padding-top` and `padding-bottom` to 4px. Round 4 added an
   explicit `padding-top: 4px;` to the same rule — restating the value the
   shorthand already produced, so computed `padding-top` is still `4px`,
   not `8px`. I confirmed this by rendering a variant with the explicit
   `padding-top: 4px` line deleted entirely: `.shaping__badge-row`'s
   `getBoundingClientRect().top` was `84` in **both** cases (with and
   without the "fix"). **Real fix**: split the shorthand — e.g.
   `padding-top: 8px; padding-bottom: 4px;` — so computed padding-top
   actually increases by the needed 4px on top of what's already there.
   Verify with `getComputedStyle(...).paddingTop` after the edit (not just
   a visual screenshot), since this exact non-fix passed silent visual
   review last round.

2. **Line-2 rightward shift is not a word-spacing problem — misdiagnosed
   twice.** Line 1 is a pixel-perfect x-match (0px delta) proving the
   headline's horizontal centering axis is correct in general. Line 2's
   *own* rendered width is essentially identical between clone (758px) and
   reference (759px) in both round 3 and round 4 — so neither the
   round-3 `margin-left: 0.16em` hack nor round-4's `letter-spacing: 0.16em`
   on a dedicated gap span actually changed anything measurable, because
   neither changes the total line width by enough to matter, and centering
   math (`(container_width - line_width) / 2`) puts the resulting line at
   effectively the same x-position either way. The actual anomaly: in the
   **reference**, line 2's own center (x≈708.5) sits ~11.5px **left** of
   line 1's center (x≈720), i.e. the reference's line 2 is NOT symmetrically
   centered under line 1. In the **clone**, line 2 centers at x≈719,
   dead-center under line 1. This asymmetry in the reference is consistent
   with the live site's rough-notation-style underline annotation reserving
   extra inline layout width to the right of "UAE" (for the SVG stroke's
   overshoot hook) that isn't purely decorative/absolute-positioned —
   pushing the visible glyphs left of true center. Tweaking inter-word
   letter-spacing cannot fix an asymmetric-centering problem; it needs an
   asymmetric solution (e.g. reserved trailing width/margin on the
   rotator+annotation group, or abandoning `text-align: center` for line 2
   in favor of a manually offset position). Recommend the reconstructor
   inspect the live site's actual DOM/computed box model for the
   annotation wrapper (devtools computed style on dubaimed.com directly)
   rather than continuing to infer it from static screenshot pixel-sampling,
   since two rounds of that approach produced no net change.

## Wins confirmed this round
- Badge label width: 230px clone vs 230px ref (was 248px/+18px in round 3) —
  the `letter-spacing: -0.05em` fix genuinely worked and should be kept.
- Badge fill/tone, underline stroke weight, rotator color — still holding
  from earlier rounds, no regression.

## Unchanged / out of scope
- Top-right icon artifact: confirmed Google Translate browser-extension
  overlay in the reference capture, not real page content (~1% of pixels).
  Do not ask the reconstructor to address this.

## Verdict
STATUS: partial (94.06% < 95%, essentially flat vs round 3's 94.08%).
The badge-width fix is a real, keepable win, but the two positional fixes
(vertical offset, line-2 shift) were both no-ops due to the root causes
above. Recommend one more targeted reconstructor pass:
(a) fix the padding shorthand collision so `.shaping__container`'s computed
`padding-top` actually becomes 8px (verify via `getComputedStyle`, not
eyeballing), and
(b) address line 2's asymmetric centering with a fundamentally different
technique than letter-spacing/margin tricks (see diagnosis above) — ideally
after checking the live site's real computed layout for the annotation
wrapper.
Do not chase item "top-right icon artifact" — confirmed unfixable capture
noise.

# Section 3.5 — "Shaping the Future" gap block — Reconstruction Notes

## Why this section exists outside site-dna.json
Confirmed via the section_index=4 reconstructor's flag
(`build/sections/04-about/notes.md`, "CRITICAL — gap between section 3 and
section 4"): `site-dna.json` `layout['1440px'].sections` only scans
`header/nav/main/section/footer` tags. On the live page this content is
wrapped in a plain `<div>` between the hero carousel (DNA `sections[3]`,
rect bottom ≈716px) and the about/video section (DNA `sections[4]`, rect
top 1064px), so the extractor never indexed it. No DNA entry, no dedicated
reference screenshot, no typography/color/component table backs this
section.

## Sourcing (per orchestrator instruction)
1. **Live DOM**: fetched `https://www.dubaimed.com/` directly via curl and
   located the block by searching for "Shaping the Future" in the Next.js
   RSC payload. This gave exact classes, text, and the word-rotator list
   `["Dubai","UAE","Qatar","Oman","GCC"]` bound to `action:"underline"`,
   `color:"#9b0058"`.
2. **Global tokens**: cross-referenced computed values against
   `assets/css/0s__7n242xu4_-f76612.css` (the site's own extracted
   stylesheet) for exact resolved custom properties: `--text-5xl:3rem`,
   `--text-5xl--line-height:1`, `--tracking-tight:-.025em`,
   `--color-gray-900:#101828`, `--text-base:1rem`,
   `--leading-relaxed:1.625`, `--color-gray-700:#364153`,
   `--blur-3xl:64px`. This confirms `.typo-h2`/`.typo-lead` (reused
   verbatim from the live classnames) resolve identically to how section 4
   uses them — same design system, as expected.
3. **Reference image**: no crop existed, so I cropped
   `references/screenshots/1440-full-page.png` at `y:716→1064` (DNA
   section-3 bottom → section-4 top) into `reference-crop.png` in this
   folder, and used it for direct visual verification via a Playwright
   render of `index.html` (bounding box came back exactly `1440×348`,
   matching the crop's dimensions).
4. **Badge component**: reused the same gradient-ring-pill technique as
   `04-about`'s `.about-pill` (mask/glow/ring-wrap), renamed
   `.shaping-badge*`, adjusted to match this instance's actual classes
   (`px-4 py-1 font-semibold`, black label text, `<button>` not `<a>`).

## Content — all copy verbatim from the live DOM
- Badge: "GROWTH • INNOVATION • TRUST" (bullets colored `text-maroon`)
- H1 (`.typo-h2`, uppercase via CSS): "Shaping the Future of Aesthetic &
  Medicine in {rotating word}" — defaulted to "Dubai" (first item in the
  live `words` array) as the static/initial state.
- Lead paragraph verbatim, with "aesthetic medical devices and soft
  product supplies" bolded per the live `<strong>`.

## Approximations / flagged as inferred
- **Underline stroke on the rotating word**: the live site uses a
  hand-drawn/rough-notation-style SVG annotation (not `text-decoration`),
  confirmed by zooming into the reference screenshot — a single sketchy
  stroke that bows and terminates in a small overshoot hook past the
  text's right edge. Exact path geometry isn't recoverable from a static
  screenshot, so I approximated it with a hand-authored inline SVG on
  `::after` (single quadratic-curve stroke + hook, `#9b0058`, 3px). Visual
  match confirmed close via Playwright render but flag if the comparator
  diffs stroke shape.
- **Word rotator**: stubbed only — `data-word-rotator` +
  `data-words="Dubai,UAE,Qatar,Oman,GCC"` +
  `data-word-interval-ms="2200"` on `.shaping__title-rotator`, static
  "Dubai" text rendered. Cycling animation is out of scope here (Step 11).
- **Gradient blob colors** (`#9b0058` → `#500b32`, `opacity:.3`,
  `bg-linear-to-tr`) came directly from the live DOM's inline
  `style="clip-path:..."` + Tailwind arbitrary-value classes, so these are
  exact, not guessed — flagging only because they aren't in
  `build/styles/tokens.css` (the token generator didn't capture this
  arbitrary color pair), so they're hardcoded here, same precedent as
  `04-about/styles.css`'s `.about-pill__glow--light`.
- `.section-preview-body` background is plain white; the pink wash visible
  in the reference is entirely the two blurred blobs, not a section
  background color — confirmed by the live DOM (`bg-white` is on the
  *next* section, this block's ancestor has no explicit background).
- Section wrapped in `overflow:hidden` (not present on the live ancestor)
  to keep the blobs contained within this isolated section for standalone
  comparator screenshots; the live page lets them bleed into ancestor
  stacking context via `-z-10`. Flag if full-page assembly needs this
  removed to avoid double-clipping against section 3/4.
- Dark-mode variants (`dark:hidden` gradient swap, `dark:bg-black` masks)
  omitted — light mode only, consistent with the rest of this build.

## Verification
Rendered `index.html` standalone via Playwright at 1440×600: `.shaping`
bounding box = `{x:0, y:0, width:1440, height:348}`, exactly matching
`reference-crop.png`'s dimensions. Visual comparison (badge position,
headline wrap points, underline placement, blob shape/color/opacity, lead
paragraph line breaks) is close by eye; final pixel-diff verification is
the comparator's job per protocol.

## Fix pass 2 (comparator round: 93.15%, threshold 95%)

1. **Rotator word swap**: comparator's `reference-crop.png` froze the
   rotator on `"UAE"`, not the `"Dubai"` default I'd stubbed. Changed the
   static text in `.shaping__title-rotator` from `Dubai` to `UAE`
   (`data-words` list unchanged, still `Dubai,UAE,Qatar,Oman,GCC` for
   Step 11's cycling wire-up).
2. **Rotator text color bug (found during visual re-verification, not in
   the comparator's 3 listed items)**: pixel-sampled `reference-crop.png`
   directly on the rotating word's glyphs and got `rgb(~23,23,23)`, matching
   the headline's `#101828`, NOT the `#9b0058` maroon the word was
   previously colored. Only the hand-drawn underline stroke is maroon —
   the word itself inherits the headline's dark navy. Changed
   `.shaping__title-rotator { color: #9b0058 }` to `color: inherit`.
3. **Badge label font**: `.shaping-badge__label` had no `font-family`, so
   it fell back to Arial (visibly bolder/mis-kerned vs. the reference's
   Montserrat). Added `font-family: var(--font-primary)`.
4. **Badge ring/fill — structural fix, not just an opacity tweak**:
   pixel-sampled `reference-crop.png` at the pill's flat top/bottom edges
   AND at gaps between words in the interior — both landed on the *same*
   `rgb(228,228,231)`. That means the reference pill is a uniformly tinted
   glass fill across its whole interior, not a white pill with a hairline
   ring. The `.shaping-badge__label` (`background: var(--color-bg-2)`,
   white) and `.shaping-badge__mask` (white, `inset:2px`) were copied from
   `04-about`'s `.about-pill` pattern and painted white over almost the
   entire pill, leaving only a 1-2px sliver of `.shaping-badge__ring-wrap`'s
   tint visible — that sliver is what the comparator flagged as "nearly
   invisible ring". Fix: set both `.shaping-badge__label` and
   `.shaping-badge__mask` backgrounds to `transparent`, and recalibrated
   `.shaping-badge__ring-wrap`'s `background-color` from a guessed
   `rgba(0,0,0,0.2)` to `rgba(0,0,0,0.12)` default /
   `rgba(0,0,0,0.06)` hover, derived from the measured pixel (`228` over a
   local `~254` white background ⇒ alpha ≈0.10, bumped slightly for
   contrast). With the white overlays gone, `.shaping-badge__glow`
   (previously hidden under the white mask) became a dominant solid
   magenta blob, so its `opacity` was dropped to `0.2` to read as the
   faint warm tint the reference shows near the pill's top edge, not a
   solid color.
   **Flag for orchestrator**: this contradicts the "same gradient-ring-pill
   component as 04-about" assumption in the original build — worth
   spot-checking 04-about's `.about-pill` against ITS reference crop too,
   in case the same white-mask-over-tint mistake was made there (that one
   may genuinely have a white fill though; not verified here, out of scope
   for this section).
5. Verified all 4 fixes visually: rendered `index.html` via Playwright at
   1440×500, screenshotted `.shaping`, and eyeballed against
   `reference-crop.png` — badge fill/tone, label font, headline color, and
   rotator word now match closely.

## Fix pass 3 (comparator round 2: 93.52%, threshold 95%, only +0.37pp over
round 1 — three targeted fixes per
`comparisons/03b-shaping-future/comparison-report-section-3.5.md`)

1. **Badge pill still reads pink, not neutral gray**: the round-2 fix
   (`rgba(0,0,0,0.12)` flat tint) only darkens whatever is behind it, it
   doesn't remove hue — the maroon/blurred top blob still bled a pink cast
   through the pill. Reworked `.shaping-badge__ring-wrap` using the same
   frosted/backdrop-blur technique as `00-header`'s `.site-header`: a
   semi-opaque neutral fill (`rgba(228,228,231,0.55)`, the exact zinc-gray
   pixel value measured off the reference in the round-2 pass) plus
   `backdrop-filter: blur(6px) saturate(55%)`. The `saturate(55%)` is the
   key addition — it actively desaturates whatever's visible through the
   layer (the blob) before the tint is composited, so the fill reads gray
   regardless of what's behind it, not just "gray tinted with less pink."
   Hover state kept the same neutral hue at lower alpha
   (`rgba(228,228,231,0.35)`) instead of the old `rgba(0,0,0,0.06)`.
2. **Word-spacing "IN"→"UAE" too tight**: added `margin-left: 0.16em` to
   `.shaping__title-rotator` rather than loosening the headline's
   `-0.025em` tracking-tight globally (which would shift every other word
   pair in the title, not just this one gap).
3. **Underline stroke too thick/saturated**: thinned the inline SVG path's
   `stroke-width` from `3` to `2` and added `stroke-opacity="0.7"` (shape/
   curve unchanged) so it reads as a subtler swoosh closer to the
   reference's hand-drawn line weight.

Did NOT touch the top-right icon mismatch — confirmed (per orchestrator
note) to be a Google Translate browser-extension overlay in the reference
screenshot, not real site content; not reproducible/fixable and out of
scope.

## Fix pass 4 (comparator round 3: 94.08%, threshold 95%, up from 93.52% —
three targeted fixes per `comparisons/03b-shaping-future/report.md`)

1. **Global -4px vertical offset**: comparator measured every text element
   (badge, headline, paragraph) rendering ~4px too high across the whole
   section — a uniform offset, not per-element drift. Added
   `padding-top: 4px` to `.shaping__container` (left `.shaping`'s own
   `padding-top: 80px` untouched since that's the exact `pt-20` Tailwind
   value from the live DOM). Re-measured post-fix: badge label now sits at
   `y:85`, matching the reference checklist's `y:84-85` almost exactly
   (was ~4px higher before).

2. **Headline line 2 shifted +10.5px right (regression from round-3's
   `margin-left: 0.16em` hack)**: an asymmetric margin on the last inline
   element of a centered text line is the likely cause — the extra
   box-model width lands entirely on the rotator's left edge rather than
   as neutral inter-word spacing. Removed the margin entirely. Instead,
   inserted a new dedicated single-character span between "in" and the
   rotator (`<span class="shaping__title-gap"> </span>`, HTML) and applied
   `letter-spacing: 0.16em` to *that* span only — since letter-spacing adds
   trailing space after each character in its scope and this span's entire
   content is one space character, it widens exactly that one inter-word
   gap with zero box-model asymmetry on the rotator itself, and doesn't
   touch any other word gap in the title. Verified via a Playwright
   `getClientRects()` harness on the real rendered `index.html`: the
   rotator span ("UAE") now sits at `x:998.14`, matching the reference
   checklist's `x:998` for the same span almost exactly (previously would
   have been ~10px further right).

3. **Badge label 18px too wide (248px vs 230px reference)**: pixel-zoom
   comparison (`ref-badge-zoom4x.png` vs `clone-badge-zoom4x.png`) showed
   both renderings read as the same semibold stroke weight, ruling out a
   font-weight mismatch (600 was already correct, per that visual
   comparison — did not change it). Instead, measured text-width via a
   Playwright harness that renders `GROWTH • INNOVATION • TRUST` at various
   `font-weight`/`letter-spacing` combinations against the real Montserrat
   variable font from `build/styles/tokens.css`. `font-weight: 600` +
   `letter-spacing: -0.05em` produced a 231px content width — within ~1px
   of the 230px target — vs the unmodified 250px. Added
   `letter-spacing: -0.05em` to `.shaping-badge__label` (inherited by the
   `•` dot spans, matching the original DOM structure).

**Verification**: re-rendered `index.html` via Playwright (Chromium,
1440×600) and re-screenshotted `.shaping` in isolation
(`clone-round4-verify.png`, saved alongside this file). Confirmed via
`getBoundingClientRect()`/`getClientRects()` against the reference
checklist positions in `comparisons/03b-shaping-future/report.md`:
- `.shaping-badge__label` box: `y:85` (ref `y:84-85`) ✓
- `.shaping__title-rotator` ("UAE") box: `x:998.14, y:194` (ref `x:998,
  y:194`) ✓ exact match, confirms the centering fix
- `.shaping-badge__label` content width: ~231px (ref target 230px) ✓
Visually cross-checked crops of the badge and "IN UAE" region against
`ref-badge-zoom4x.png`/`ref-uae-zoom.png` — gap width, underline position,
and pill proportions now closely match. Did not re-touch the Google
Translate icon artifact (confirmed unfixable, out of scope) or the
underline stroke geometry (unchanged from round 3).

**Verification**: rendered `index.html` via Playwright (Chromium, from the
npx-cached `playwright@1.62.1` install since no local `node_modules`
existed) at 1440×600, screenshotted `.shaping` (bbox confirmed
`1440×348`, matching `reference-crop.png` exactly) plus zoomed crops of the
badge and the rotator/underline region. Saved to
`comparisons/03b-shaping-future/clone-round3.png`,
`clone-badge-round3.png`, `clone-underline-round3.png`. Visual comparison
against `reference-crop.png` / `ref-badge-zoom2.png` / `ref-uae-zoom.png`:
badge fill now reads as neutral gray with a visible thin ring, matching
the reference's tone; the "IN UAE" gap is now visibly wider; the underline
stroke is visibly thinner and less saturated. Per orchestrator's note,
this section has no DNA backing it (live-inspection sourced only) — any
remaining sub-pixel deltas after this pass should be treated as acceptable
rather than chased further.

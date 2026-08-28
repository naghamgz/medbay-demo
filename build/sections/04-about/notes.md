# Section 4 — "About" Video Intro — Reconstruction Notes

## Round 2 fixes (comparator @ 77.68%, threshold 95%)
1. **1280px width overflow (+144px).** DNA `sections[4]` confirms `maxWidth:1280px`,
   `margin:0 80px 0 80px`, `padding:32px 32px 80px 32px` on the `<section
   class="wrapper ...">` element itself. Round 1 wrongly put that cap on the
   child `.about-section__container` instead, leaving `.about-section`
   unconstrained (rendered 1424px). Moved the cap/margin/padding onto
   `.about-section` in `styles.css`; `.about-section__container` is now a
   plain `width:100%` pass-through node (kept only to mirror live DOM depth).
   Verified via Playwright: `.about-section` bounding box is now
   `{x:80, y:0, width:1280, height:872}` at 1440px viewport (was 1424 wide).
2. **Missing document wrapper → wrong font.** `index.html` was a bare
   fragment with no `<!DOCTYPE html><html><head>...<link>...</head><body
   class="section-preview-body">` wrapper, so `.section-preview-body{
   font-family:var(--font-primary)}` never applied and text fell back to
   Times New Roman. Wrapped `index.html` in the same structure as
   00-header/01-nav/03-hero, and added the matching `.section-preview-body`
   rule (margin:0, min-height:868px per DNA rect height, background
   `--color-bg-2`, `font-family:var(--font-primary)`) to `styles.css`.
   Verified via Playwright: computed `font-family` on `.about-copy__lead` is
   now `Montserrat, sans-serif`.

Both fixes verified visually against an isolated Playwright screenshot of
`.about-video` and the full section — video thumbnail, play button, YouTube
pill, lead copy, Read More, and the two gradient-ring pills all render
correctly at 1280px width with Montserrat applied. The blank header/nav band
in the top ~40-45px of a full-viewport isolated screenshot is a known
structural artifact shared with section 3 (sticky header overlap), deferred
to full-page assembly per orchestrator instruction — not addressed here.

## What this is
`site-dna.json` → `layout['1440px'].sections[4]` = `main > section:nth-child(2)`,
`class="wrapper pt-8 pb-12 sm:pb-16 md:pb-20 bg-white dark:bg-zinc-900"`, rect
1280x868. A centered video-thumbnail block (play button + "Watch on YouTube"
link) followed by an intro paragraph with an inline "Read More" expand toggle,
a collapsed accordion panel, and two gradient-ring pill links ("About Us",
"Events & News").

## CRITICAL — gap between section 3 and section 4 (flag for orchestrator)
I fetched the live SSR HTML directly (`curl https://www.dubaimed.com/`) to
resolve ordering ambiguity in the DNA typography table, and discovered that
`layout['1440px'].sections` **skips real content** between index 3 (hero
carousel) and index 4 (this section). Immediately after the carousel
`</section>` and before this section's `<section class="wrapper ...">`, the
live DOM has a plain `<div>` (not a `<section>` tag) containing:
- The "GROWTH • INNOVATION • TRUST" gradient-ring badge (same pill component
  reused here as "About Us"/"Events & News")
- `<h1 class="typo-h2">Shaping the Future of Aesthetic & Medicine in Dubai</h1>`
- A lead paragraph: "DUBIMED is the leading supplier and distributor of
  aesthetic medical devices and soft product supplies for aesthetic,
  regenerative and longevity medicine. We serve clinics and professionals
  across UAE, Qatar, Oman and the rest of the GCC."
- A large decorative blurred gradient blob (`clip-path: polygon(...)`,
  `#9b0058` to `#500b32`)

Because the extractor's section-scan only queries `header/nav/main/section/
footer` tags, this `<div>`-wrapped block was never assigned a `section_index`
and is entirely absent from `site-dna.json`. **It will be silently dropped
from the final page unless the orchestrator dispatches a corrective pass**
(e.g. a "section 3.5" or an extension of section 3) before final assembly.
I did not build it here since it is out of scope for `section_index: 4`.

## Content — fully backed by DNA + live HTML cross-check
Every text string, class-derived spacing value, and color in this section
came from `site-dna.json` (typography[18,19,20,21,23,24], `components['1440px']
.buttons[37]` "Play about video" 1024x576, `buttons[101]` "Expand Read More",
`media[10-13]`) cross-verified against the live DOM and the site's own
extracted CSS (`assets/css/0s__7n242xu4_-f76612.css`: `.wrapper`, `.typo-lead`,
`.btn-secondary`, `.text-maroon`, `--color-maroon`, `--color-gray-700`,
`--spacing`, `--container-7xl`) for exact px conversions. No copy was invented.

## Assets
- Image: `assets/images/image-8df08e` (no extension in the manifest) copied to
  `assets/images/about-video-thumbnail-8df08e.png` for a clean `<img src>`,
  following the naming convention set in `03-hero/notes.md`.
- SVGs inlined directly per the `01-nav`/`03-hero` convention (matched to
  `assets/svg/icon-wrapper-9.svg` play triangle, `icon-wrapper-10.svg`
  lucide-circle-play, `icon-wrapper-11.svg` lucide-chevron-right — confirmed
  by content, not just filename).

## Deviations / approximations
- `interactiveStates[41]` (play button) and `[42]` (YouTube link) both have
  `stateExtractionFailed: true`. Hover states used instead came from the real
  Tailwind classes in the live HTML (`hover:scale-105`, `hover:bg-white/15`,
  `hover:bg-black/10`, `hover:text-maroon`) — ground truth, not guesses.
- `ring-1 ring-black/10` on the play icon is implemented via `outline` (with
  `outline-offset:-1px`) rather than `box-shadow`, since `box-shadow` is
  already used for the `shadow-lg` drop shadow on the same element. Visually
  equivalent; flag if comparator diffs the ring width.
- The accordion panel (`.about-copy__expand`) is rendered in its collapsed
  `max-height:0` default state, matching the page's initial paint. Expand
  interaction is stubbed via `data-expand-trigger`/`data-expand-panel` for
  Step 11.
- Sub-1024px column widths (`max-w-[64rem]`, `md:max-w-[60rem]`, `md:h-15
  md:w-15`) are Tailwind-class-derived, not independently confirmed against
  DNA pixel data at 1024/768/375px breakpoints — DNA only confirms this
  section's outer rect at those widths, not internal column geometry.
- Dark-mode variants (`dark:bg-zinc-900`, `dark:hidden` gradient swap, etc.)
  are omitted; this build targets light mode only, consistent with prior
  sections.

# Comparison Report — Section 1 (nav)

**Match: 98.53%** — PASS (threshold 95%)
**Mismatched pixels:** 1,076 / 72,960
**Dimensions:** reference 1216×60, clone 1216×60 (exact match, no crop drift)

Reference: `references/screenshots/1440-section-1-flex.png`
Clone: `comparisons/01-nav/clone.png`
Diff: `diff-images/section-1.png`
Raw pixelmatch output: `comparisons/01-nav/report.json`, `comparisons/01-nav/report.md`

## Context (from reconstructor notes.md)

Reconstructor flagged that `sections[1]` (this nav) is DOM-nested inside `sections[0]`'s
(header) sole child, not a sibling page section — confirmed via matching `childLayout`
rect (1216×60) in `site-dna.json`. It reused the identical, already comparator-approved
markup/CSS from `00-header` (96.68% match) rather than re-deriving from scratch, wrapped
in a `.header-shell` placeholder to reproduce the header's translucent/blur background
(nav's own DNA background is transparent). This section-1 build/compare is a validation
artifact for the shared nav markup — at full-page assembly the orchestrator should use
only section 0's `<header>` (which already contains this nav) and skip inserting a
second standalone `<nav>`.

## Element-level checklist (13 elements captured, all within tolerance)

Section: Nav (98.53% pixel match)
  - nav-logo-link / nav-logo-img: position and size in line with reference crop, Montserrat font family correctly applied.
  - Dropdown buttons ("Medical Devices", "Soft Products", "Services"): Montserrat 14px weight-600, uppercase — matches DNA components[].navigation typography.
  - Plain links ("Media Center", "About", "Contact"): same 14px/600 Montserrat treatment as dropdown buttons — consistent.
  - Chevron SVGs (16×16) positioned immediately after each dropdown label — spacing matches gap-1 (4px) token.
  - theme-toggle button: 36×36, border-radius 10px — matches `--radius-0` token from site-dna.json. Font falls back to Arial (no text content, expected — icon-only button).

No element exceeded a positional or size delta worth flagging; the 1.47% pixel mismatch
(1,076 px) is consistent with font anti-aliasing / sub-pixel rendering noise, not a
structural or token deviation. No token-level fix is needed.

## Verdict

Section 1 passes at 98.53% (≥95% threshold). No re-dispatch to reconstructor needed for
this section. Orchestrator should note the DOM-duplicate relationship with section 0 when
assembling the full page (see reconstructor's `build/sections/01-nav/notes.md` for the
"do not insert a second nav" instruction) — this is an assembly-step concern, not a
comparator failure.

# Mermaid diagrams, on-brand

Brand-matched theme for rendering Mermaid diagrams (flowcharts, sequence
diagrams) as SVG/PNG for the blog, pulled 1:1 from `BRAND_GUIDE.md`.

Use this for anything that's fundamentally a graph — a request flow, a
sequence of calls, a hierarchy/tree. For an annotated info-card layout
(callout footnotes, ✓/✗ comparison columns, mixed typography) keep using the
custom HTML/CSS + Playwright approach instead (see
`docs/blog-assets/dvmchart-part-1/` and `dvmchart-part-2/` for examples) —
Mermaid doesn't have a good primitive for that.

## Setup (one-time)

```
npm install mermaid@11
```

Playwright is already a dependency of this repo, so no separate install
needed for that.

## Usage

1. Write a `.mmd` file in `diagrams/` (flowchart, sequence diagram, etc).
2. `node render-mermaid.js`
3. Pick up the matching `.svg` (vector, preferred) and `.png` (2x raster,
   for anywhere that needs a bitmap) from `out/`.

## The theme

`mermaid-theme.json` holds the `themeVariables` mapping (Mermaid's `base`
theme is what actually respects `themeVariables` — `default` ignores most of
them). Reference `_semanticAccentPalette` in that file for the `classDef`
colors to use per node when a diagram needs more than one accent:

- **blue** (`#2563EB` border / `#EFF6FF` fill) — primary / interactive / UI path
- **purple** (`#9333EA` / `#FAF5FF`) — secondary grouping
- **green** (`#16A34A` / `#F0FDF4`) — success / positive state
- **amber** (`#D97706` / `#FFFBEB`) — warning / AI or inference step
- **red** (`#DC2626` / `#FEF2F2`) — error / trust boundary / destructive
- **gray** (`#D1D5DB` / `#F9FAFB`) — neutral / infrastructure

Font is Inter (matches the site's type system); code-ish labels can use
`font-family: 'JetBrains Mono'` inline if a diagram needs to show a literal
field/table name.

## Multi-line / bold node labels — use markdown-string syntax, not raw HTML

To get a bold title + a lighter subtitle inside one node (see `tenancy.mmd`,
`pipeline-preview.mmd`), write the label as a Mermaid **markdown string** —
backticks inside the quotes:

```
A["`**Company**
practice group or independent owner`"]:::blue
```

**Do not** hand-write raw HTML tags into a label (`"<b>Company</b><br/>..."`).
Mermaid's default `securityLevel` is `'strict'`, which does not trust
arbitrary HTML you supply yourself — it renders literally as visible text
(`<b>Company</b>` shows up as those actual characters in the box). This bit
us on the first pass of `tenancy.mmd`. Mermaid's own markdown-string syntax
sidesteps this entirely: Mermaid parses the markdown itself and emits clean,
trusted HTML (`<strong>`, `<br>`), so it renders correctly regardless of
`securityLevel`.

Caveat worth knowing: any node label with formatting or a line break
(markdown-string or otherwise) renders internally via an SVG `foreignObject`
in this Mermaid version — that's true even with `flowchart.htmlLabels: false`
in the config. That's harmless for the `.png` (a flat raster screenshot of
the live-rendered page — what we actually upload to Contentful, same as
every other diagram in this series) but means the standalone `.svg` file is
**not** guaranteed to render correctly if it's ever embedded directly via
`<img src="...svg">` — several browsers don't paint `foreignObject` content
in that context. Treat the `.png` as the real deliverable; keep the `.svg`
as a nice-to-have, not something to upload to Contentful as-is.

## Included demo diagrams

- `tenancy.mmd` — company → clinic → doctor as a flowchart (Part 2 rebuilt
  as a comparison point; Part 2 itself shipped with the custom HTML version)
- `jwt-sequence.mmd` — the UI Worker / API Worker / Supabase JWKS check as a
  sequence diagram (this is the format that actually fits it)
- `pipeline-preview.mmd` — starting point for Part 3's extract → match →
  classify → miscode pipeline diagram

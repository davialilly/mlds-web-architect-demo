# Statewide Education Data Explorer (Technical Evaluation Demo)

Built for the MLDS Center Web Architect interview technical evaluation.
This is a static site: one HTML page, one stylesheet, one script, and one
mock JSON dataset, deployed with GitHub Pages.

**Live URL:** https://davialilly.github.io/mlds-web-architect-demo/
**Repository:** https://github.com/davialilly/mlds-web-architect-demo

## What this demonstrates

- A public-facing statewide education data page in the shape MLDS Center
  already publishes: an accessible data table, a supporting chart, and a
  space for an embedded Power BI dashboard.
- WCAG 2.1 AA-aligned markup and styling.
- FERPA-conscious data handling, using only synthetic, aggregate mock
  data, with the reasoning for that choice documented below.
- A documented (not live) Power BI embed pattern, since this environment
  has no Power BI workspace to publish a real report from. See
  `POWERBI-INTEGRATION.md`.

## File structure

```
.
├── index.html                 Main page
├── css/style.css               All styling, one stylesheet
├── js/app.js                   Loads the JSON data, renders table + chart
├── data/enrollment-trends.json Mock, aggregate-only dataset
├── README.md                   This file
└── POWERBI-INTEGRATION.md      Power BI embed documentation
```

## Build process

No build step or framework. This is intentionally plain HTML/CSS/JS so
the entire site can be served as static files with no compilation,
bundler, or Node dependency, which keeps the deployment surface small
and easy to audit.

1. `index.html` defines the page structure and semantic landmarks.
2. `css/style.css` holds all styling as CSS custom properties (design
   tokens) plus component-level rules, no framework.
3. `js/app.js` fetches `data/enrollment-trends.json` on page load and
   renders the data table and an inline SVG bar chart from it. Keeping
   the data in its own JSON file (rather than hardcoded in the HTML)
   mirrors how a real page would pull from an API or a data export, and
   keeps content changes out of the markup.
4. Fonts load from Google Fonts (Public Sans), the same typeface family
   used by the U.S. Web Design System (USWDS), which MLDS Center's public
   pages already follow.

## Deployment process (GitHub Pages)

1. Create a public GitHub repository and push these files to the `main`
   branch.
2. In the repository, go to **Settings > Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a
   branch**, branch **main**, folder **/ (root)**, then **Save**.
4. GitHub builds and publishes the site, typically at
   `https://<username>.github.io/<repository-name>/`. This can take a
   minute or two on first deploy.
5. Any future push to `main` redeploys automatically; no separate build
   or release step is required for a static site like this one.

## How this aligns with MLDS Center requirements

### FERPA considerations

- **No individually identifiable data anywhere in this repository.**
  `data/enrollment-trends.json` is synthetic and aggregate-only (total
  enrollment, graduation rate, chronic absenteeism, district count, by
  year). There are no student names, IDs, birthdates, or small-cell
  counts that could allow re-identification.
- **Public vs. restricted data is treated as an architectural decision,
  not just a display choice.** The pattern this demo follows: aggregate,
  district-level-or-higher data is safe for a public static page like
  this one; anything at the student level belongs behind authenticated,
  role-based access on internal tools, never on a publicly hosted static
  site. See the "Data & privacy" section of `index.html` and the closing
  note in `POWERBI-INTEGRATION.md`.
- **Minimum reporting thresholds:** in production, any aggregate figure
  built from a small underlying count should be suppressed rather than
  displayed, since small aggregates can still indirectly identify
  individuals. This demo's mock data is large enough statewide that this
  doesn't arise, but the principle is stated explicitly on the page so
  it's clear it was considered.

### WCAG 2.1 AA accessibility

- **Semantic structure:** one `<h1>`, proper heading order, and landmark
  elements (`header`, `nav`, `main`, `section`, `footer`) throughout
  `index.html`.
- **Skip link:** a "Skip to main content" link is the first focusable
  element on the page (`.skip-link` in `css/style.css`).
- **Text alternative for data, not just charts:** the data table is the
  primary, always-visible source of truth; the SVG chart is a visual
  supplement with an `aria-label` describing what it shows and an
  `aria-describedby` pointing back at the table's heading, rather than
  being the only way to get the numbers.
- **Color contrast:** the token palette in `css/style.css` was chosen to
  keep body text and interactive elements at or above a 4.5:1 contrast
  ratio against their backgrounds.
- **Keyboard access:** every link, and the iframe placeholder region, has
  a visible focus state (`:focus-visible` rules in `css/style.css`); no
  functionality depends on hover or mouse-only interaction.
- **Motion:** the page respects `prefers-reduced-motion` and uses only
  smooth-scroll for in-page navigation, no auto-playing animation.
- **No color-only meaning:** the chart pairs color with text labels
  (value and year) on every bar rather than relying on color alone.

### Power BI dashboard integration

Documented in full in `POWERBI-INTEGRATION.md`, including the iframe
markup, the difference between "publish to web" and "secure embed,"
token handling, and the accessibility requirements specific to embedding
an iframe. The live page shows a labeled placeholder in the exact
position a real report would occupy, since this environment has no
Power BI workspace to publish from.

## Known limitations of this demo

- The Power BI panel is a documented placeholder, not a live report (see
  above and `POWERBI-INTEGRATION.md` for why, and what the real
  integration requires).
- The dataset is synthetic and does not reflect real MLDS Center figures.
- No automated accessibility test report is included; the alignment
  above is based on following WCAG 2.1 AA and USWDS conventions directly
  in the markup and styling. Running an automated scanner (axe or WAVE)
  against the deployed URL would be a reasonable next step before this
  pattern is used in production.

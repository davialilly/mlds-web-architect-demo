# Power BI Integration Documentation

This document describes how a Power BI report is embedded in this site's
`#dashboard` section using the same iframe pattern used elsewhere on the
MLDS Center website, and what this demo substitutes given evaluation
constraints.

## Why this demo shows a placeholder instead of a live report

A working embed requires:

1. A Power BI **Pro or Premium** license and workspace.
2. A report published in that workspace, either:
   - **Publish to web**, which generates a public embed URL (not suitable
     for anything containing real or potentially sensitive data), or
   - **Secure embed / "app owns data"**, which requires a registered Azure
     AD app, a service principal or master user, and a token-generation
     step on the server side.

This evaluation environment does not include access to an MLDS Center
Power BI workspace, so the page ships a clearly labeled placeholder panel
in the exact position the report will occupy, with the real integration
steps documented here.

## Step-by-step integration process

1. **Publish the report** to the target Power BI workspace and confirm it
   renders correctly inside the Power BI service itself before embedding
   it anywhere.
2. **Generate the embed URL:**
   - For non-sensitive, public data: use **File > Publish to web** inside
     Power BI Desktop or the service, which returns an iframe snippet
     directly.
   - For anything involving restricted or FERPA-relevant data: use
     **secure embed** instead. This requires registering an app in Azure
     AD, granting it the `Report.Read.All` API permission, and generating
     a short-lived embed token server-side (via the Power BI REST API's
     `GenerateToken` endpoint) rather than exposing a permanent public URL.
3. **Add the iframe** to the page in the same responsive wrapper used
   elsewhere on the site:

   ```html
   <div class="dashboard-embed">
     <iframe
       title="Statewide Enrollment Dashboard"
       src="https://app.powerbi.com/view?r=REPLACE_WITH_REPORT_EMBED_TOKEN"
       width="100%"
       height="600"
       frameborder="0"
       allowfullscreen
       loading="lazy">
     </iframe>
   </div>
   ```

4. **Accessibility requirements for the iframe specifically:**
   - Always set a descriptive `title` attribute; screen readers announce
     this as the frame's name, and "Power BI" alone is not descriptive
     enough.
   - Keep the iframe inside a landmark (`<section>` with an
     `aria-labelledby` pointing at a real heading), exactly as this demo's
     `#dashboard` section does.
   - Confirm the report itself has accessibility features turned on
     inside Power BI (tab order, alt text on visuals, high-contrast
     theme option) since those carry through the embed; the surrounding
     page markup cannot fix an inaccessible report.
   - Provide a text/table alternative to the report's key figures outside
     the iframe when the data is central to the page's purpose, the same
     pattern this demo uses for the enrollment/graduation table above the
     chart.
5. **Responsive sizing:** set a fixed `height` (Power BI's own embeds do
   not reflow well with `height: auto`) and let `width: 100%` handle the
   horizontal fit; verify at mobile widths since some visuals inside the
   report may need "mobile layout" configured in Power BI itself.
6. **Token refresh (secure embed only):** since embed tokens expire
   (typically after about 60 minutes), the hosting page needs either a
   periodic client-side refresh call to a token-issuing endpoint, or the
   report needs to be re-requested on page load rather than cached
   indefinitely.
7. **Test in place:** once a real embed URL is available, replace the
   `.dashboard-embed` placeholder markup in `index.html` with the iframe
   above and confirm it renders inside the existing bordered panel styling
   already defined in `css/style.css` (`.dashboard-embed`).

## Data sensitivity note

Any report embedded here should show aggregate, district-level or
higher data only, consistent with this site's FERPA statement in
`index.html` and `README.md`. Student-level Power BI reports belong
behind MLDS Center's authenticated internal tools, not a public page.

# Design sources — not published

Files in this folder are **excluded from the live site**. GitHub Pages uses
Jekyll, which does not publish folders whose name starts with `_`, so nothing
here is reachable at shieldora.app.

- `dashboard.html` — the UI mock-up and the brand's design source (the app's
  `Theme.swift` tokens are lifted from its `:root`). Kept here so it stays the
  reference without being served as a public page.
- `og-preview.html` — an internal viewer for the Open Graph image.

Do not add `.nojekyll` to the repo root: it would disable Jekyll and start
serving this folder.

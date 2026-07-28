# Paper Reading Presentation: Memorization and Generalization

A responsive, browser-based paper presentation prototype built as a single `index.html` file.

## What is included

- Seven full-screen presentation slides
- Keyboard, button, hash-link, and touch navigation
- Responsive desktop and mobile layouts
- KaTeX rendering for inline and display mathematics
- Formula sizing that inherits the surrounding text size
- Horizontal overflow protection for long equations
- A spectral illustration and a three-regime training timeline

## Preview locally

From the repository directory, run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Navigation

- Next: `→`, `PageDown`, or space
- Previous: `←` or `PageUp`
- First/last: `Home` / `End`
- Direct slide link: append `#1`, `#2`, and so on to the URL

## Publish with GitHub Pages

In the repository settings, choose **Pages**, select **Deploy from a branch**, and use the root of the `main` branch. The site entry point is already `index.html`.

## Math rendering

KaTeX is loaded from jsDelivr. The key sizing rule is:

```css
.katex { font-size: 1em; }
```

This keeps inline equations visually matched to their surrounding paragraph or heading. Display equations receive their scale from the `.formula` container, which uses responsive `clamp(...)` values.

# GCK — Global Citizen Kit (Chrome extension)

A small Chrome extension / sidepanel that uses local AI-like helpers to generate cultural briefs, translations, summarization and a lightweight writer modal. Designed as a hackathon project to demo in-panel AI features and an on-demand writer modal.

---

## Features

- Discover short cultural briefs for random countries.
- Translate and display bilingual original + translation views.
- Summarize selected text from an active tab or the sidepanel.
- Writer modal (popup) to generate content (Country Brief, Poem, Travel list) and rewrite or copy generated text.
- Proofreader and language detector toolbar buttons.

## Quick install (Load unpacked extension)

1. Open Chrome 
2. Go to `chrome://extensions`
3. Enable "Developer mode" (top-right)
4. Click "Load unpacked" and select this project folder (the folder that contains `manifest.json`, e.g. `GCK`)
5. Pin the extension or open its side panel from the toolbar

Note: Some features reference experimental APIs (e.g., Chrome AI/Writer/Translator helpers). If those are not available in your browser, the extension will fall back to error handling in the console.

## Files of interest

- `manifest.json` — extension manifest
- `sidepanel.html` — main sidepanel markup and inlined CSS
- `sidepanel.js` — main sidepanel logic, toolbar handlers, and writer modal builder
- `content.js` — (if present) content script interactions
- `background.js` — background worker/script
- `writer.html`, `writer.js` — a standalone writer page (optional; the extension uses a modal built dynamically in `sidepanel.js`)
- `icons/` — icons used in the toolbar
- `sidepanel.css` — (if present) extra CSS

If you removed the inline writer UI from `sidepanel.html`, the writer appears only via the toolbar button which dynamically creates a modal inside the page root.

## Usage

- Click "New Country" to fetch a short cultural brief.
- Use the toolbar: Summarizer, Translator, Writer, Rewriter, Proofreader, Language Detector.
- Click the pencil icon (Writer) to open the modal, choose a language / type and press Generate.
- Copy or rewrite generated text using the modal controls.

## Customization

- Theme variables are in `sidepanel.html` (CSS variables at the top of the file). Edit `--bg1`, `--bg2`, `--accent` to switch colors.
- Modal styling is added dynamically in `sidepanel.js` — you can adjust sizes, colors or move styles into a dedicated CSS file.
- If you prefer not to keep `writer.html` and `writer.js`, you can remove them — the modal in `sidepanel.js` is standalone and provides the same functionality.

## Development notes

- The project was edited on Windows (PowerShell default shell). To reload the extension frequently while developing, use the `chrome://extensions` UI and click the reload button.
- To quickly inspect console logs: right-click the extension icon → Manage extensions → Service worker / Inspect views (or open the sidepanel and use DevTools).

## Known issues & troubleshooting

- If the Writer / Translator / Summarizer APIs rely on Chrome experimental features, those features may be unavailable in stable Chrome releases. Use Chrome Canary or enable relevant flags if you're testing browser-native AI APIs.
- If the modal or buttons do not appear, check that `sidepanel.js` is loaded (open DevTools and look for errors). A common error is an undefined DOM element if the HTML was edited — ensure `id` values in `sidepanel.html` match the selectors used in `sidepanel.js`.

## Suggestions / next steps

- Consolidate the writer code into a single module (move dynamic styles into a CSS file).
- Add unit tests for parsing AI responses and small smoke tests for modal flow.
- Add accessibility improvements (keyboard focus, ARIA attributes) for modal and toolbar buttons.

---

If you'd like, I can:
- Remove `writer.html` and `writer.js` to avoid duplication, or
- Add a small `Makefile`/PowerShell script to automate packing/reloading the extension for dev.

License: MIT (change as needed)

Author: Project repository

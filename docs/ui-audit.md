# Shotla Studio: UI and functionality audit

Audited on 25 September 2026. The repository was clean at the start. Unrelated nested projects were excluded from the changes and checks.

The follow-up [uploaded-image audit](uploaded-image-audit.md) records additional fixes and verification against the user's actual image, including border and annotation clipping, grain export, color editing, and all format/resolution combinations.

## Design research

Primary sources and rendered competitor pages were inspected. Shots' live editor was opened and visually reviewed; Pika and Xnapper's public pages supplied product workflow and feature references.

| Reference | Useful pattern | Shotla implementation |
| --- | --- | --- |
| [Shots](https://shots.so/) | Canvas-centered editing, visual styles, distinct frame/export controls, undo/redo | Large preview, persistent tool rail, focused inspectors, preset previews, independent history |
| [Pika](https://pika.style/) | Saved presets, frames, annotations, social output sizes | Named browser-local styles, window headers, editable text/magnifiers, social dimensions |
| [Xnapper](https://xnapper.com/) | Quick capture-to-share flow, padding, backgrounds and rounded corners | Demo onboarding, paste/drop/upload, natural-fit geometry, spacing and export controls |

The design uses a restrained green accent, neutral surfaces, Geist typography, consistent compact controls, focus outlines, reduced-motion support, and a responsive settings drawer. Competitor branding, assets, and proprietary code were not copied. The original fictional Forma dashboard demonstrates the editor without uploading personal data.

This is a screenshot editor, not full competitor parity. Video/animation, device asset libraries, automatic sensitive-data redaction, native screen capture, accounts, and cloud sync are outside this implementation.

## Confirmed original code issues and fixes

| Original issue | Result |
| --- | --- |
| Aspect ratio updated a state string without resizing the rendered canvas | Ratio and social-size choices now set actual dimensions |
| Canvas dimensions depended on browser dimensions | Natural image dimensions and padding determine export size; preview scales separately |
| Crop started in pixels but was applied as percentages, without synchronizing the initial selection | One percentage-based crop model, clamped pixel conversion, reversible crop and restore |
| Screenshot creation returned an ID from inside a state updater | Async imports create complete documents before one state update; each document has its own history |
| Text could be added but not edited or deleted | Text, placement, size, color, and deletion controls |
| “Magnifiers” were empty outlined shapes | Actual zoomed image content, focus X/Y, magnification, size, shape, style, and deletion |
| Spotlights embedded declarations inside a CSS value; several multi-layer backgrounds placed colors in invalid positions | Normalized background values and correct spotlight composition |
| “Background noise” changed contrast instead of adding noise | Independent grain overlay |
| Fixed 320 px sidebar and desktop-only canvas limits | Responsive tool rail, scrollable inspector, mobile drawer, and fit preview |
| Export only produced PNG at an opaque fixed scale | PNG/JPEG/WebP, named files, resolution controls, output dimensions, and clipboard copy |
| UI offered AI without reporting installation capability | Configuration endpoint and disabled state; explicit upload disclosure and controlled service errors |
| Template title, network-fetched font, unconfigured lint, and ignored TypeScript build errors | Shotla metadata/icon, bundled Geist font, pinned Biome, scoped source checks, and enforced typechecking |

## Sidebar coverage

All nine destinations open and expose working controls: Images, Presets, Background, Canvas, Frame, Crop, Annotate, Export, and Help. Imports, image selection/removal, demo loading, saved styles, history actions, and preview zoom are accessible from the sidebar as well as contextual shortcuts.

The ordinary workflow is local to the browser. Images are session-only; only named styles persist in local storage. The UI explains this behavior. AI styling is optional and sends a reduced screenshot to OpenAI only when explicitly invoked.

## Verification

- Installed the frozen Bun lockfile, started development and production servers, and verified the rendered interface.
- `bun run typecheck`, `bun run lint`, `bun run format:check`, and eleven geometry/history regression tests pass. Lint/format scope is the current editor implementation, rather than unused legacy UI scaffold files.
- `bun run build` passes with TypeScript validation enabled. Development and production use separate build directories.
- The main Playwright CLI audit passes 60 assertions, including all nine destinations at desktop and mobile sizes, ratio/canvas/frame controls, backgrounds, crop without initial dragging, restore and history, editable layers, saved styles, image isolation/removal, all three downloads, and real clipboard PNG output.
- Generated PNG, JPEG, and WebP files were decoded and verified at 900 × 650 px. PNG export was visually inspected, including window frame, caption, background, corners, and magnifier.
- Mobile previews and settings were inspected at 390 × 844 px, with no document-level horizontal overflow.
- An additional 19 checks passed for all 51 background values, sidebar preview zoom, style persistence, invalid/corrupt/oversized files, sidebar drop, paste, batch capacity, image removal, and 360 px layouts. A transparent 3× PNG was decoded at 900 × 600 px with a fully transparent corner.
- The optional AI provider call was not exercised because no API key is configured. This remains a documented external dependency, not a verified feature.

## Reproduce the browser check

```sh
bun run build
bun run start --hostname 127.0.0.1 --port 3101
```

In a separate terminal, use the installed Playwright CLI in a fresh named session:

```sh
playwright-cli --session shotla-audit open http://127.0.0.1:3101
playwright-cli --session shotla-audit run-code --filename scripts/browser-audit.js
```

The browser scenario starts a fresh in-memory workspace and uses fictional demo data. It checks the unconfigured-AI state, so run without `OPENAI_API_KEY`. Browser images and downloaded outputs are saved under ignored `output/playwright/`; they are local validation evidence, not application assets.

## Implementation map

- `app/page.tsx`: workspace shell, upload/drop target and mobile settings toggle.
- `components/sidebar.tsx`: tool rail and complete settings panels.
- `components/editor-controls.tsx`: consistent labelled controls.
- `components/canvas.tsx`: responsive preview, export surface, crop UI and image strip.
- `hooks/use-shotla-editor.ts`: per-image histories, import, crop, saved styles, export and optional AI.
- `lib/editor-model.ts`: dimensions, background normalization, presets and history helpers.
- `app/globals.css`: visual system and responsive rules.
- `tests/editor-model.test.ts`: regressions for export geometry, crop conversion and history.

# Uploaded-image verification

Verified the user's existing 720 × 372 WebP image in the Codex in-app browser on 25 September 2026. The original decoded image was compared before and after the production rebuild and matched exactly. Its initial Golden hour composition was saved as **Uploaded image original** and restored after testing.

## Fixes from the live session

- **Frame borders:** the border-box frame clipped 40 px from its image content at a 20 px border. Natural canvas sizing now includes the border; custom canvases reserve space for it; the frame uses content-box sizing. The repaired frame retains the full 720 × 372 image and 36 px header.
- **Annotations:** corner captions and large magnifiers extended outside the canvas. Positions now anchor the relevant edge inside an 8% margin. Magnifiers fit small canvases, and long captions shrink to keep their complete text inside the available area.
- **Grain export:** unescaped nested SVG filter URLs caused the export renderer to request `/%23n`. Embedded SVG quotes and parentheses are now escaped. Exported pixels contain the actual grain, and the same normalization covers the dark/light noise patterns.
- **Color controls:** native input events now update the preview immediately, and every color control also accepts a six-digit hex value. Invalid unfinished text reverts on blur without changing the artwork.
- **Export review:** the completed output remains visible with its actual dimensions, format, and a persistent **Download again** link. Object URLs remain alive until replaced or the editor unmounts.

## Observed coverage

| Area | Verification |
| --- | --- |
| Presets | All six built-in presets rendered correctly; saved starting style survived the rebuild |
| Backgrounds | All 51 background choices applied valid CSS; custom solid, two-color gradient, direction, transparency and grain exercised |
| Canvas | All five aspect choices, all five social sizes, custom dimensions, padding, corners, image transforms/reset and preview zoom |
| Frame | None/light/dark headers, thick border geometry and border color |
| Crop | Adjust selection, apply, undo, redo, restore original and Escape cancellation; cropped output was 575 × 297 and restored output 720 × 372 |
| Annotation | All seven positions for text and magnifiers; text editing, size and color; both lens shapes, three sizes, three outline treatments, zoom and focus controls; layer removal |
| Long captions | A 300-character caption and a large magnifier stayed inside a 300 × 200 canvas |
| Export | PNG, JPEG and WebP at every 1×/2×/3× scale; decoded files verified at 904 × 592, 1808 × 1184 and 2712 × 1776 |
| Transparency | PNG/WebP corner RGBA `[0,0,0,0]`; JPEG corner `[255,255,255,255]` |
| Clipboard | Actual PNG bytes read back at 904 × 592 |
| Mobile | All nine inspectors opened, settings could be hidden, preview remained accessible, and no document overflow at the observed 355 px viewport |

The in-app browser did not expose a download event or a verifiable filesystem destination. Therefore its native file-save handoff is not claimed as verified. All encoded output blobs were decoded and inspected; the final 1728 × 1104 PNG was separately saved to the local audit directory. Ordinary Chrome downloads had passed the earlier project audit.

AI styling remains unavailable without an API key and was not invoked with the uploaded image.

## Evidence and checks

Local artifacts, excluded from Git:

- `output/playwright/uploaded-image-audit/final.png`: final export with the original composition.
- `output/playwright/uploaded-image-audit/studio.png`: desktop screenshot.
- `output/playwright/uploaded-image-audit/results.json`: browser observations and decoded export metadata.

The production build, typecheck, lint, format check and 13 regression tests pass. New regressions cover thick-border geometry and embedded SVG filter escaping. Unrelated nested projects were left unchanged.

import { describe, expect, test } from "bun:test";
import {
  allBackgrounds,
  applyPreset,
  backgroundStyle,
  canvasDimensions,
  cropPixels,
  editHistory,
  freshSettings,
  type History,
  normalizeBackground,
  presets,
  redoHistory,
  undoHistory,
} from "../lib/editor-model";

describe("export geometry", () => {
  test("uses image pixels and padding rather than viewport dimensions", () => {
    expect(
      canvasDimensions(freshSettings(), { width: 1100, height: 740 }),
    ).toEqual({ width: 1260, height: 900 });
  });
  test("includes browser frame in fit dimensions", () => {
    const s = freshSettings();
    s.advancedSettings.windowHeader = "light";
    expect(canvasDimensions(s, { width: 1100, height: 740 })).toEqual({
      width: 1260,
      height: 936,
    });
  });
  test("thick borders preserve every image pixel and the requested padding", () => {
    const s = freshSettings();
    s.advancedSettings.windowHeader = "dark";
    s.advancedSettings.border = true;
    s.advancedSettings.borderWidth = 20;
    expect(canvasDimensions(s, { width: 720, height: 372 })).toEqual({
      width: 920,
      height: 608,
    });
    expect(canvasDimensions(s, { width: 12000, height: 12000 }).height).toBe(
      4096,
    );
  });
  test("keeps custom/social dimensions exact", () => {
    const s = {
      ...freshSettings(),
      fitToImage: false,
      canvasSize: { width: 1080, height: 1920 },
    };
    expect(canvasDimensions(s, { width: 4000, height: 2000 })).toEqual({
      width: 1080,
      height: 1920,
    });
  });
  test("fits oversized imports within the supported canvas limit", () => {
    const d = canvasDimensions(freshSettings(), { width: 12000, height: 8000 });
    expect(d.width).toBe(4096);
    expect(d.height).toBeLessThan(4096);
  });
  test("converts the initial crop correctly before dragging", () => {
    expect(
      cropPixels(
        { x: 10, y: 10, width: 80, height: 80 },
        { width: 1100, height: 740 },
      ),
    ).toEqual({ x: 110, y: 74, width: 880, height: 592 });
  });
  test("clamps crop to the image edges with nonzero output", () => {
    expect(
      cropPixels(
        { x: 90, y: 90, width: 80, height: 80 },
        { width: 100, height: 100 },
      ),
    ).toEqual({ x: 90, y: 90, width: 10, height: 10 });
    expect(
      cropPixels(
        { x: 0, y: 0, width: 0, height: 0 },
        { width: 100, height: 100 },
      ).width,
    ).toBe(1);
  });
});
describe("per-image history", () => {
  const create = (): History => ({
    past: [],
    future: [],
    present: {
      image: "original",
      original: "original",
      imageSize: { width: 1100, height: 740 },
      settings: freshSettings(),
    },
  });
  test("undo and redo restore both cropped pixels and styling", () => {
    const original = create();
    const edited = editHistory(original, {
      ...original.present,
      image: "cropped",
      imageSize: { width: 880, height: 592 },
      settings: applyPreset(original.present.settings, presets[3]),
    });
    expect(undoHistory(edited).present).toEqual(original.present);
    expect(redoHistory(undoHistory(edited)).present).toEqual(edited.present);
    expect(original.present.image).toBe("original");
  });
  test("a new edit clears redo, with bounded history", () => {
    let h = create();
    for (let i = 0; i < 80; i++)
      h = editHistory(h, {
        ...h.present,
        settings: { ...h.present.settings, padding: i },
      });
    expect(h.past).toHaveLength(60);
    const undo = undoHistory(h);
    expect(editHistory(undo, { ...undo.present, image: "new" }).future).toEqual(
      [],
    );
  });
  test("presets preserve annotations", () => {
    const s = freshSettings();
    s.textOverlays = [
      {
        id: "caption",
        text: "Ship it",
        position: "top",
        size: "small",
        color: "#ffffff",
      },
    ];
    expect(applyPreset(s, presets[1]).textOverlays).toEqual(s.textOverlays);
  });
});
test("spotlights use a valid background value, with no CSS declarations", () => {
  expect(backgroundStyle("spotlight-blue")).toContain("radial-gradient(");
  expect(backgroundStyle("spotlight-blue")).not.toContain(";");
  expect(backgroundStyle("blob-1").endsWith(", #1a1b26")).toBe(true);
  expect(backgroundStyle("transparent")).toBe("transparent");
});

test("each background can be selected independently", () => {
  expect(new Set(allBackgrounds.map((b) => b.value)).size).toBe(
    allBackgrounds.length,
  );
});
test("SVG grain filters stay embedded instead of becoming broken export requests", () => {
  const css = normalizeBackground(
    `url("data:image/svg+xml,%3Crect filter='url(%23noise)'/%3E")`,
  );
  expect(css).toContain("%27url%28%23noise%29%27");
  expect(css.match(/url\(/g)).toHaveLength(1);
  for (const name of ["tex-noise-dark", "tex-noise-light"]) {
    expect(backgroundStyle(name)).toContain("%27url%28%23noise%29%27");
    expect(backgroundStyle(name).match(/url\(/g)).toHaveLength(1);
  }
});

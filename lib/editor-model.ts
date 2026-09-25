import { backgroundThemes } from "@/constants/backgrounds";
import type { EditorState } from "@/types";

export const MAX_IMAGES = 10;
export const MAX_DIMENSION = 4096;
export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

export const freshSettings = (): EditorState => ({
  selectedBackground: "studio",
  backgroundCss: "",
  selectedShadow: "medium",
  textOverlays: [],
  magnifiers: [],
  advancedSettings: {
    backgroundNoise: false,
    windowShadow: 28,
    windowHeader: "none",
    frameCorners: 12,
    windowScale: 100,
    horizontalOffset: 0,
    verticalOffset: 0,
    border: false,
    borderWidth: 1,
    borderColor: "#ffffff",
  },
  isCropping: false,
  cropArea: null,
  fitToImage: true,
  canvasSize: { width: 1200, height: 900 },
  canvasScale: 100,
  aspectRatio: "Auto",
  padding: 80,
  canvasCorners: 0,
  imageScale: 100,
  imageHorizontalOffset: 0,
  imageVerticalOffset: 0,
  imageCornerRadius: 0,
});

export const curatedBackgrounds = [
  {
    name: "Studio",
    value: "studio",
    css: "radial-gradient(ellipse at 18% 10%, #f4f2df 0%, transparent 55%), linear-gradient(135deg, #d5e6db, #94bab1)",
  },
  {
    name: "Dune",
    value: "dune",
    css: "radial-gradient(at 80% 20%, #f6e4d1, transparent 60%), linear-gradient(135deg, #e9d4bd, #c59d86)",
  },
  {
    name: "Ice",
    value: "ice",
    css: "linear-gradient(135deg, #edf4fa, #a6bdd6)",
  },
  {
    name: "Lavender",
    value: "lavender",
    css: "radial-gradient(at 20% 10%, #f0e8f5, transparent 60%), linear-gradient(140deg, #ded2ee, #a29bbb)",
  },
  {
    name: "Ink",
    value: "studio-midnight",
    css: "radial-gradient(ellipse at 60% 0%, #425760, #182a31 75%)",
  },
  {
    name: "Peach",
    value: "peach",
    css: "linear-gradient(130deg, #f5dbb8, #dfa398)",
  },
];
export const allBackgrounds = [
  ...curatedBackgrounds,
  ...Object.values(backgroundThemes).flat(),
];

// In a CSS background shorthand, a color may only appear in the final layer.
export function normalizeBackground(css: string) {
  // Encoding SVG quotes and parentheses keeps nested filter URLs from being
  // mistaken for external resources by the export renderer.
  const escaped = css.replace(
    /url\("(data:image\/svg\+xml,[\s\S]*?)"\)/g,
    (_, url: string) =>
      `url("${url.replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29")}")`,
  );
  const leadingColor = escaped.trim().match(/^(#[a-f\d]{3,8})\s+(.+)$/i);
  return leadingColor ? `${leadingColor[2]}, ${leadingColor[1]}` : escaped;
}
export function backgroundStyle(key: string, custom = "") {
  if (key === "custom") return custom || "#e6ece7";
  if (key === "transparent") return "transparent";
  const theme = allBackgrounds.find((t) => t.value === key);
  if (!theme) return "#e6ece7";
  if ("glowColor" in theme)
    return `radial-gradient(ellipse at 50% 30%, ${theme.glowColor}66, transparent 70%), ${theme.css}`;
  return normalizeBackground(theme.css);
}

export function canvasDimensions(
  settings: EditorState,
  image: { width: number; height: number },
) {
  if (!settings.fitToImage) return settings.canvasSize;
  const header = settings.advancedSettings.windowHeader === "none" ? 0 : 36;
  const border = settings.advancedSettings.border
    ? settings.advancedSettings.borderWidth * 2
    : 0;
  const scale = Math.min(
    1,
    (MAX_DIMENSION - settings.padding * 2 - border) / image.width,
    (MAX_DIMENSION - settings.padding * 2 - border - header) / image.height,
  );
  return {
    width: Math.round(image.width * scale + settings.padding * 2 + border),
    height: Math.round(
      image.height * scale + header + settings.padding * 2 + border,
    ),
  };
}

export const presets = [
  {
    name: "Studio",
    description: "A little room to breathe",
    background: "studio",
    padding: 80,
    radius: 12,
    header: "none" as const,
    shadow: 28,
  },
  {
    name: "Warm editorial",
    description: "Soft light, warm tones",
    background: "dune",
    padding: 100,
    radius: 6,
    header: "none" as const,
    shadow: 20,
  },
  {
    name: "Product launch",
    description: "Made for your next release",
    background: "ice",
    padding: 72,
    radius: 12,
    header: "light" as const,
    shadow: 32,
  },
  {
    name: "After hours",
    description: "A darker point of view",
    background: "studio-midnight",
    padding: 80,
    radius: 14,
    header: "dark" as const,
    shadow: 38,
  },
  {
    name: "Soft focus",
    description: "Quiet color, sharp details",
    background: "lavender",
    padding: 96,
    radius: 18,
    header: "none" as const,
    shadow: 24,
  },
  {
    name: "Golden hour",
    description: "A warmer first impression",
    background: "peach",
    padding: 72,
    radius: 8,
    header: "light" as const,
    shadow: 24,
  },
];

export function applyPreset(
  settings: EditorState,
  preset: (typeof presets)[number],
): EditorState {
  return {
    ...settings,
    selectedBackground: preset.background,
    backgroundCss: "",
    padding: preset.padding,
    advancedSettings: {
      ...settings.advancedSettings,
      frameCorners: preset.radius,
      windowHeader: preset.header,
      windowShadow: preset.shadow,
    },
  };
}

export type Snapshot = {
  image: string;
  original: string;
  imageSize: { width: number; height: number };
  settings: EditorState;
};
export type History = {
  past: Snapshot[];
  present: Snapshot;
  future: Snapshot[];
};
export function editHistory(history: History, present: Snapshot): History {
  return {
    past: [...history.past.slice(-59), history.present],
    present,
    future: [],
  };
}
export function undoHistory(h: History): History {
  if (!h.past.length) return h;
  return {
    past: h.past.slice(0, -1),
    present: h.past[h.past.length - 1],
    future: [h.present, ...h.future],
  };
}
export function redoHistory(h: History): History {
  if (!h.future.length) return h;
  return {
    past: [...h.past, h.present],
    present: h.future[0],
    future: h.future.slice(1),
  };
}
export function cropPixels(
  crop: { x: number; y: number; width: number; height: number },
  image: { width: number; height: number },
) {
  const x = Math.round((clamp(crop.x, 0, 99) * image.width) / 100);
  const y = Math.round((clamp(crop.y, 0, 99) * image.height) / 100);
  return {
    x,
    y,
    width: Math.max(
      1,
      Math.min(image.width - x, Math.round((crop.width * image.width) / 100)),
    ),
    height: Math.max(
      1,
      Math.min(
        image.height - y,
        Math.round((crop.height * image.height) / 100),
      ),
    ),
  };
}

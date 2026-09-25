"use client";
import {
  AppWindow,
  ArrowUpRight,
  Check,
  Copy,
  Crop,
  Download,
  HelpCircle,
  ImagePlus,
  Images,
  LayoutTemplate,
  Palette,
  Plus,
  Redo2,
  RotateCcw,
  Save,
  Scan,
  Search,
  Sparkles,
  Trash2,
  Type,
  Undo2,
  Wand2,
} from "lucide-react";
import { useState } from "react";
import { backgroundThemes } from "@/constants/backgrounds";
import type { ShotlaEditor } from "@/hooks/use-shotla-editor";
import {
  allBackgrounds,
  backgroundStyle,
  curatedBackgrounds,
  presets,
} from "@/lib/editor-model";
import {
  Color,
  Section,
  Segments,
  Select,
  Slider,
  Toggle,
} from "./editor-controls";

export const tools = [
  {
    id: "images",
    name: "Images",
    icon: Images,
    description: "All your screenshots, in one place.",
  },
  {
    id: "presets",
    name: "Presets",
    icon: LayoutTemplate,
    description: "A good starting point. Make it yours.",
  },
  {
    id: "background",
    name: "Background",
    icon: Palette,
    description: "Set the scene for your screenshot.",
  },
  {
    id: "canvas",
    name: "Canvas",
    icon: Scan,
    description: "The right fit for every platform.",
  },
  {
    id: "frame",
    name: "Frame",
    icon: AppWindow,
    description: "Give your screenshot a little structure.",
  },
  {
    id: "crop",
    name: "Crop",
    icon: Crop,
    description: "Keep the part that tells the story.",
  },
  {
    id: "annotations",
    name: "Annotate",
    icon: Type,
    description: "Bring attention to what matters.",
  },
  {
    id: "export",
    name: "Export",
    icon: Download,
    description: "Ready for wherever you share it.",
  },
  {
    id: "help",
    name: "Help",
    icon: HelpCircle,
    description: "A few shortcuts to your next great shot.",
  },
];
const positions = [
  "top-left",
  "top",
  "top-right",
  "center",
  "bottom-left",
  "bottom",
  "bottom-right",
].map((value) => ({ value, label: value.replaceAll("-", " ") }));
const sizes = ["small", "medium", "large"].map((value) => ({
  value,
  label: value,
}));

export function Sidebar({
  editor: e,
  activeTool,
  setActiveTool,
}: {
  editor: ShotlaEditor;
  activeTool: string;
  setActiveTool: (value: string) => void;
}) {
  const [backgroundTab, setBackgroundTab] = useState("Curated");
  const [search, setSearch] = useState("");
  const [styleName, setStyleName] = useState("");
  const [gradientStart, setGradientStart] = useState("#d5e6db");
  const [gradientEnd, setGradientEnd] = useState("#94bab1");
  const [gradientAngle, setGradientAngle] = useState(135);
  const tool = tools.find((t) => t.id === activeTool) ?? tools[0];
  const categoryBackgrounds =
    backgroundTab === "Curated"
      ? curatedBackgrounds
      : backgroundTab === "Gradients"
        ? [
            ...backgroundThemes.minimalGradients,
            ...backgroundThemes.spotlightDark,
            ...backgroundThemes.meshBlobs,
            ...backgroundThemes.abstractBubbles,
          ]
        : [
            ...backgroundThemes.shapePatterns,
            ...backgroundThemes.geometricPatterns,
            ...backgroundThemes.textures,
          ];
  const backgrounds = (search ? allBackgrounds : categoryBackgrounds).filter(
    (b) => b.name.toLowerCase().includes(search.toLowerCase()),
  );
  const disabled = !e.uploadedImage || e.isExporting || e.isCropping;
  return (
    <>
      <nav className="tool-rail" aria-label="Editor tools">
        <div className="rail-tools">
          {tools.slice(0, -1).map((t) => (
            <button
              key={t.id}
              className={`tool-button ${activeTool === t.id ? "active" : ""}`}
              aria-label={t.name}
              aria-current={activeTool === t.id ? "page" : undefined}
              onClick={() => setActiveTool(t.id)}
            >
              <t.icon size={20} strokeWidth={1.7} />
              <span>{t.name}</span>
            </button>
          ))}
        </div>
        <button
          className={`tool-button help-tool ${activeTool === "help" ? "active" : ""}`}
          aria-label="Help"
          onClick={() => setActiveTool("help")}
        >
          <HelpCircle size={20} />
          <span>Help</span>
        </button>
      </nav>
      <aside className="inspector" aria-label={`${tool.name} settings`}>
        <div className="inspector-heading">
          <div className="eyebrow">YOUR WORKSPACE</div>
          <h1>{tool.name}</h1>
          <p>{tool.description}</p>
        </div>
        <div className="inspector-content" key={activeTool}>
          {activeTool === "images" && (
            <>
              <Section
                title="Your images"
                action={
                  <span className="count-label">
                    {e.screenshots.length} / 10
                  </span>
                }
              >
                <button
                  className="primary-button full-width"
                  onClick={e.addMoreScreenshots}
                  disabled={!e.canAddMore || e.isImporting}
                >
                  <ImagePlus size={16} />
                  {e.isImporting ? "Opening images…" : "Upload screenshots"}
                </button>
                <p className="hint media-hint">
                  Drop images anywhere, or paste from your clipboard. Each image
                  keeps its own edits.
                </p>
                <div className="media-list">
                  {e.screenshots.map((shot) => (
                    <div
                      className={
                        shot.id === e.activeScreenshot
                          ? "media-item selected"
                          : "media-item"
                      }
                      key={shot.id}
                    >
                      <button
                        onClick={() => e.switchToScreenshot(shot.id)}
                        aria-label={`Open ${shot.name}`}
                        aria-pressed={shot.id === e.activeScreenshot}
                      >
                        <img src={shot.image} alt="" />
                        <span>{shot.name}</span>
                      </button>
                      <button
                        className="icon-button"
                        aria-label={`Delete ${shot.name}`}
                        onClick={() => e.removeScreenshot(shot.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                {!e.screenshots.length && (
                  <p className="hint">
                    Your workspace is ready for its first image.
                  </p>
                )}
              </Section>
              <Section title="Just exploring?">
                <p className="hint">
                  Get a feel for the tools with our sample screenshot.
                </p>
                <button
                  className="secondary-button full-width"
                  disabled={!e.canAddMore || e.isImporting}
                  onClick={e.loadDemo}
                >
                  Try the demo image <ArrowUpRight size={14} />
                </button>
              </Section>
              <p className="hint">
                Images stay in this tab. Export your work before refreshing or
                closing it.
              </p>
            </>
          )}
          {activeTool === "presets" && (
            <>
              <Section
                title="Studio collection"
                action={<span className="count-label">06 styles</span>}
              >
                <div className="preset-grid">
                  {presets.map((p) => (
                    <button
                      key={p.name}
                      className={`preset-card ${e.selectedBackground === p.background ? "selected" : ""}`}
                      onClick={() => e.applyPreset(p)}
                      aria-label={`Apply ${p.name} preset`}
                      aria-pressed={e.selectedBackground === p.background}
                    >
                      <div
                        className="preset-preview"
                        style={{ background: backgroundStyle(p.background) }}
                      >
                        <div
                          className={`mini-window ${p.header === "dark" ? "dark-window" : ""}`}
                        >
                          <div className="mini-dots">
                            <i />
                            <i />
                            <i />
                          </div>
                          <div className="mini-body">
                            <span />
                            <span />
                            <span />
                            <b />
                          </div>
                        </div>
                        {e.selectedBackground === p.background && (
                          <span className="preset-check">
                            <Check size={11} />
                          </span>
                        )}
                      </div>
                      <strong>{p.name}</strong>
                    </button>
                  ))}
                </div>
              </Section>
              <Section title="Your styles" action={<Save size={14} />}>
                <p className="hint">
                  Keep your signature look, ready for next time.
                </p>
                <form
                  className="save-style"
                  onSubmit={(event) => {
                    event.preventDefault();
                    e.saveStyle(styleName);
                    setStyleName("");
                  }}
                >
                  <input
                    aria-label="Style name"
                    placeholder="Name this style…"
                    maxLength={32}
                    value={styleName}
                    onChange={(event) => setStyleName(event.target.value)}
                  />
                  <button
                    className="icon-button"
                    aria-label="Save style"
                    disabled={!styleName.trim()}
                  >
                    <Plus size={18} />
                  </button>
                </form>
                {e.savedStyles.map((style, index) => (
                  <div className="saved-style" key={style.id}>
                    <button onClick={() => e.applySavedStyle(style)}>
                      <span
                        style={{
                          background: backgroundStyle(
                            style.settings.selectedBackground,
                            style.settings.backgroundCss,
                          ),
                        }}
                      />
                      {style.name}
                    </button>
                    <button
                      className="icon-button"
                      aria-label={`Delete ${style.name} style`}
                      onClick={() => e.deleteSavedStyle(index)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </Section>
              <div className="tip-card">
                <Wand2 size={20} />
                <strong>A starting point, not a limit.</strong>
                <p>
                  Choose a style, then fine-tune every detail with the tools on
                  the left.
                </p>
                <button onClick={() => setActiveTool("background")}>
                  Make it your own <ArrowUpRight size={14} />
                </button>
              </div>
              <button
                className="text-button reset-style"
                onClick={e.resetStyle}
              >
                <RotateCcw size={14} /> Reset all styling
              </button>
            </>
          )}
          {activeTool === "background" && (
            <>
              <div className="search-field">
                <Search size={15} />
                <input
                  aria-label="Search backgrounds"
                  placeholder="Find a background…"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <Segments
                label="Collection"
                value={backgroundTab}
                onChange={setBackgroundTab}
                options={["Curated", "Gradients", "Patterns"]}
              />
              <div className="background-grid">
                {backgrounds.map((b) => (
                  <button
                    key={b.value}
                    aria-label={`Use ${b.name} background`}
                    aria-pressed={e.selectedBackground === b.value}
                    className={
                      e.selectedBackground === b.value ? "selected" : ""
                    }
                    onClick={() => e.setSelectedBackground(b.value)}
                  >
                    <span style={{ background: backgroundStyle(b.value) }}>
                      {e.selectedBackground === b.value && <Check size={17} />}
                    </span>
                    <small>{b.name}</small>
                  </button>
                ))}
              </div>
              {!backgrounds.length && (
                <p className="hint">No backgrounds match “{search}”.</p>
              )}
              <Section title="Make it yours">
                <Color
                  label="Solid color"
                  value={
                    /^#[a-f\d]{6}$/i.test(e.backgroundCss || "")
                      ? e.backgroundCss!
                      : "#e6ece7"
                  }
                  onChange={e.setCustomBackground}
                />
                <Toggle
                  label="Transparent background"
                  checked={e.selectedBackground === "transparent"}
                  onChange={(v) =>
                    e.setSelectedBackground(v ? "transparent" : "studio")
                  }
                />
                <Toggle
                  label="Subtle grain"
                  checked={e.advancedSettings.backgroundNoise}
                  onChange={(v) =>
                    e.updateAdvancedSetting("backgroundNoise", v)
                  }
                />
              </Section>
              <Section title="Custom gradient">
                <div className="two-columns">
                  <Color
                    label="Start"
                    value={gradientStart}
                    onChange={(v) => {
                      setGradientStart(v);
                      e.setCustomBackground(
                        `linear-gradient(${gradientAngle}deg, ${v}, ${gradientEnd})`,
                      );
                    }}
                  />
                  <Color
                    label="End"
                    value={gradientEnd}
                    onChange={(v) => {
                      setGradientEnd(v);
                      e.setCustomBackground(
                        `linear-gradient(${gradientAngle}deg, ${gradientStart}, ${v})`,
                      );
                    }}
                  />
                </div>
                <Slider
                  label="Direction"
                  value={gradientAngle}
                  min={0}
                  max={360}
                  unit="°"
                  onChange={(v) => {
                    setGradientAngle(v);
                    e.setCustomBackground(
                      `linear-gradient(${v}deg, ${gradientStart}, ${gradientEnd})`,
                    );
                  }}
                />
              </Section>
              <Section title="AI styling">
                <p className="hint">
                  {e.aiAvailable
                    ? "Sends this screenshot to OpenAI to suggest a matching style."
                    : "AI styling isn't configured on this installation. All studio presets work without it."}
                </p>
                <button
                  className="secondary-button full-width"
                  disabled={
                    !e.aiAvailable || !e.uploadedImage || e.isAutoStyling
                  }
                  onClick={e.autoStyleWithAI}
                >
                  <Sparkles size={16} />
                  {e.isAutoStyling ? "Finding your style…" : "Suggest a style"}
                </button>
              </Section>
            </>
          )}
          {activeTool === "canvas" && (
            <>
              <Section title="Dimensions">
                <Toggle
                  label="Fit to image"
                  checked={e.fitToImage}
                  onChange={e.setFitToImage}
                />
                <div className="two-columns">
                  {(["width", "height"] as const).map((key) => (
                    <label className="control" key={key}>
                      <span>{key === "width" ? "Width" : "Height"}</span>
                      <div className="unit-input">
                        <input
                          aria-label={`Canvas ${key}`}
                          type="number"
                          min={100}
                          max={4096}
                          value={e.canvasSize[key]}
                          onChange={(event) =>
                            e.setCanvasSize({
                              ...e.canvasSize,
                              [key]: Number(event.target.value),
                            })
                          }
                        />
                        <span>px</span>
                      </div>
                    </label>
                  ))}
                </div>
                <Segments
                  label="Aspect ratio"
                  value={e.aspectRatio}
                  onChange={e.setAspectRatio}
                  options={["Auto", "16:9", "4:3", "1:1", "9:16"]}
                />
                <Select
                  label="Social size"
                  value=""
                  onChange={(value) => {
                    if (value) {
                      const [width, height] = value.split("x").map(Number);
                      e.setCanvasSize({ width, height });
                    }
                  }}
                  options={[
                    { value: "", label: "Choose a format…" },
                    { value: "1200x630", label: "Social preview · 1200 × 630" },
                    { value: "1080x1080", label: "Square post · 1080 × 1080" },
                    {
                      value: "1080x1350",
                      label: "Portrait post · 1080 × 1350",
                    },
                    { value: "1080x1920", label: "Story · 1080 × 1920" },
                    { value: "1920x1080", label: "Presentation · 1920 × 1080" },
                  ]}
                />
              </Section>
              <Section title="Spacing">
                <Slider
                  label="Padding"
                  value={e.padding}
                  onChange={e.setPadding}
                  max={200}
                  unit="px"
                />
                <Slider
                  label="Canvas corners"
                  value={e.canvasCorners}
                  onChange={e.setCanvasCorners}
                  max={80}
                  unit="px"
                />
              </Section>
              <Section
                title="Image position"
                action={
                  <button
                    className="icon-button"
                    aria-label="Reset image position"
                    onClick={e.onResetImageControls}
                  >
                    <RotateCcw size={14} />
                  </button>
                }
              >
                <Slider
                  label="Image scale"
                  value={e.imageScale}
                  onChange={e.setImageScale}
                  min={25}
                  max={150}
                  unit="%"
                />
                <Slider
                  label="Horizontal position"
                  value={e.imageHorizontalOffset}
                  onChange={e.setImageHorizontalOffset}
                  min={-100}
                  max={100}
                  unit="px"
                />
                <Slider
                  label="Vertical position"
                  value={e.imageVerticalOffset}
                  onChange={e.setImageVerticalOffset}
                  min={-100}
                  max={100}
                  unit="px"
                />
                <Slider
                  label="Image corners"
                  value={e.imageCornerRadius}
                  onChange={e.setImageCornerRadius}
                  max={80}
                  unit="px"
                />
              </Section>
              <Section title="Preview">
                <Slider
                  label="Preview zoom"
                  value={e.previewZoom}
                  min={25}
                  max={200}
                  step={25}
                  unit="%"
                  onChange={e.setPreviewZoom}
                />
                <button
                  className="secondary-button full-width"
                  onClick={() => e.setPreviewZoom(100)}
                >
                  <Scan size={14} /> Fit canvas preview
                </button>
                <p className="hint media-hint">
                  Preview zoom never changes your export size.
                </p>
              </Section>
            </>
          )}
          {activeTool === "frame" && (
            <>
              <Section title="Window style">
                <Segments
                  label="Window header"
                  value={e.advancedSettings.windowHeader}
                  onChange={(v) =>
                    e.updateAdvancedSetting(
                      "windowHeader",
                      v as "none" | "light" | "dark",
                    )
                  }
                  options={["none", "light", "dark"]}
                />
                <Slider
                  label="Frame corners"
                  value={e.advancedSettings.frameCorners}
                  onChange={(v) => e.updateAdvancedSetting("frameCorners", v)}
                  max={60}
                  unit="px"
                />
                <Slider
                  label="Shadow"
                  value={e.advancedSettings.windowShadow}
                  onChange={(v) => e.updateAdvancedSetting("windowShadow", v)}
                  max={100}
                />
              </Section>
              <Section title="Border">
                <Toggle
                  label="Show border"
                  checked={e.advancedSettings.border}
                  onChange={(v) => e.updateAdvancedSetting("border", v)}
                />
                {e.advancedSettings.border && (
                  <>
                    <Slider
                      label="Border width"
                      value={e.advancedSettings.borderWidth}
                      onChange={(v) =>
                        e.updateAdvancedSetting("borderWidth", v)
                      }
                      min={1}
                      max={20}
                      unit="px"
                    />
                    <Color
                      label="Border color"
                      value={e.advancedSettings.borderColor}
                      onChange={(v) =>
                        e.updateAdvancedSetting("borderColor", v)
                      }
                    />
                  </>
                )}
              </Section>
              <Section title="Frame position">
                <Slider
                  label="Window scale"
                  value={e.advancedSettings.windowScale}
                  min={50}
                  max={150}
                  unit="%"
                  onChange={(v) => e.updateAdvancedSetting("windowScale", v)}
                />
                <Slider
                  label="Horizontal offset"
                  value={e.advancedSettings.horizontalOffset}
                  min={-50}
                  max={50}
                  unit="%"
                  onChange={(v) =>
                    e.updateAdvancedSetting("horizontalOffset", v)
                  }
                />
                <Slider
                  label="Vertical offset"
                  value={e.advancedSettings.verticalOffset}
                  min={-50}
                  max={50}
                  unit="%"
                  onChange={(v) => e.updateAdvancedSetting("verticalOffset", v)}
                />
              </Section>
            </>
          )}
          {activeTool === "crop" && (
            <>
              <div className="instruction-illustration">
                <Crop size={36} strokeWidth={1} />
              </div>
              <Section title="A closer look">
                <p className="hint">
                  Drag the corners of the selection to crop your image. Your
                  original is always one click away.
                </p>
                {e.isCropping ? (
                  <div className="button-stack">
                    <button
                      className="primary-button full-width"
                      onClick={e.onApplyCrop}
                    >
                      <Check size={16} /> Apply crop
                    </button>
                    <button
                      className="secondary-button full-width"
                      onClick={e.onCancelCrop}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="primary-button full-width"
                    disabled={!e.uploadedImage}
                    onClick={e.onStartCrop}
                  >
                    <Crop size={16} /> Start cropping
                  </button>
                )}
                <button
                  className="text-button"
                  disabled={!e.uploadedImage}
                  onClick={e.restoreOriginal}
                >
                  <RotateCcw size={14} /> Restore original image
                </button>
              </Section>
              <p className="hint keyboard-hint">
                <kbd>Esc</kbd> to cancel · <kbd>⌘ Z</kbd> to undo
              </p>
            </>
          )}
          {activeTool === "annotations" && (
            <>
              <Section
                title="Text layers"
                action={
                  <span className="count-label">{e.textOverlays.length}</span>
                }
              >
                <button
                  className="secondary-button full-width"
                  disabled={!e.uploadedImage}
                  onClick={e.addTextLayer}
                >
                  <Plus size={16} /> Add text
                </button>
                {e.textOverlays.map((t, i) => (
                  <div className="layer-card" key={t.id}>
                    <div className="section-heading">
                      <strong>Text {i + 1}</strong>
                      <button
                        className="icon-button"
                        aria-label={`Delete text ${i + 1}`}
                        onClick={() => e.removeText(t.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <textarea
                      aria-label={`Text ${i + 1} content`}
                      maxLength={300}
                      value={t.text}
                      onChange={(event) =>
                        e.updateText(t.id, { text: event.target.value })
                      }
                    />
                    <Select
                      label={`Text ${i + 1} position`}
                      value={t.position}
                      options={positions}
                      onChange={(position) => e.updateText(t.id, { position })}
                    />
                    <Select
                      label={`Text ${i + 1} size`}
                      value={t.size}
                      options={sizes}
                      onChange={(size) => e.updateText(t.id, { size })}
                    />
                    <Color
                      label={`Text ${i + 1} color`}
                      value={t.color}
                      onChange={(color) => e.updateText(t.id, { color })}
                    />
                  </div>
                ))}
              </Section>
              <Section title="Magnifiers">
                <p className="hint">
                  Show a closer view of a detail in your image.
                </p>
                <button
                  className="secondary-button full-width"
                  disabled={!e.uploadedImage}
                  onClick={e.addMagnifier}
                >
                  <Plus size={16} /> Add magnifier
                </button>
                {e.magnifiers.map((m, i) => (
                  <div className="layer-card" key={m.id}>
                    <div className="section-heading">
                      <strong>Magnifier {i + 1}</strong>
                      <button
                        className="icon-button"
                        aria-label={`Delete magnifier ${i + 1}`}
                        onClick={() => e.removeMagnifier(m.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <Select
                      label={`Magnifier ${i + 1} position`}
                      value={m.position}
                      options={positions}
                      onChange={(position) =>
                        e.updateMagnifier(m.id, { position })
                      }
                    />
                    <Select
                      label="Shape"
                      value={m.shape}
                      options={[
                        { label: "Circle", value: "circle" },
                        { label: "Rectangle", value: "rectangle" },
                      ]}
                      onChange={(shape) => e.updateMagnifier(m.id, { shape })}
                    />
                    <Select
                      label="Size"
                      value={m.size}
                      options={sizes}
                      onChange={(size) => e.updateMagnifier(m.id, { size })}
                    />
                    <Select
                      label="Outline style"
                      value={m.style}
                      options={[
                        { value: "outline", label: "Solid" },
                        { value: "dashed", label: "Dashed" },
                        { value: "filled", label: "Tinted" },
                      ]}
                      onChange={(style) => e.updateMagnifier(m.id, { style })}
                    />
                    <Slider
                      label="Magnification"
                      value={m.zoom ?? 2}
                      min={1.5}
                      max={4}
                      step={0.5}
                      unit="×"
                      onChange={(zoom) => e.updateMagnifier(m.id, { zoom })}
                    />
                    <Slider
                      label="Focus X"
                      value={m.x ?? 50}
                      max={100}
                      unit="%"
                      onChange={(x) => e.updateMagnifier(m.id, { x })}
                    />
                    <Slider
                      label="Focus Y"
                      value={m.y ?? 50}
                      max={100}
                      unit="%"
                      onChange={(y) => e.updateMagnifier(m.id, { y })}
                    />
                    <Color
                      label="Outline color"
                      value={m.color}
                      onChange={(color) => e.updateMagnifier(m.id, { color })}
                    />
                  </div>
                ))}
              </Section>
            </>
          )}
          {activeTool === "export" && (
            <>
              <div
                className="export-preview"
                style={{ background: e.getBackgroundStyle() }}
              >
                {e.uploadedImage ? (
                  <img src={e.uploadedImage} alt="Current screenshot" />
                ) : (
                  <ImagePlus size={32} />
                )}
              </div>
              <Section title="The final details">
                <label className="control">
                  File name
                  <input
                    aria-label="File name"
                    value={e.exportName}
                    onChange={(event) => e.setExportName(event.target.value)}
                    maxLength={80}
                  />
                </label>
                <Segments
                  label="File format"
                  value={e.exportFormat.toUpperCase()}
                  options={["PNG", "JPEG", "WEBP"]}
                  onChange={(v) => e.setExportFormat(v.toLowerCase())}
                />
                <Segments
                  label="Resolution"
                  value={`${e.exportScale}×`}
                  options={["1×", "2×", "3×"]}
                  onChange={(v) => e.setExportScale(Number(v[0]))}
                />
                <div className="export-dimensions">
                  <Scan size={16} />
                  <span>
                    {Math.round(
                      e.canvasSize.width *
                        Math.min(
                          e.exportScale,
                          8192 /
                            Math.max(e.canvasSize.width, e.canvasSize.height),
                        ),
                    )}{" "}
                    ×{" "}
                    {Math.round(
                      e.canvasSize.height *
                        Math.min(
                          e.exportScale,
                          8192 /
                            Math.max(e.canvasSize.width, e.canvasSize.height),
                        ),
                    )}{" "}
                    px
                  </span>
                  <span className="count-label">
                    {e.exportFormat.toUpperCase()}
                  </span>
                </div>
                <p className="hint">
                  {e.exportFormat === "jpeg"
                    ? "A smaller file for sharing. Transparent areas become white."
                    : "Full detail, including transparent backgrounds."}
                </p>
              </Section>
              <div className="button-stack">
                <button
                  className="primary-button full-width"
                  disabled={disabled}
                  onClick={() => e.exportImage()}
                >
                  <Download size={16} />
                  {e.isExporting ? "Preparing image…" : "Download image"}
                </button>
                <button
                  className="secondary-button full-width"
                  disabled={disabled}
                  onClick={() => e.exportImage(true)}
                >
                  <Copy size={16} /> Copy as PNG
                </button>
              </div>
              {e.lastExport && (
                <Section title="Last export">
                  <div className="export-result">
                    <img
                      data-testid="exported-image"
                      src={e.lastExport.url}
                      alt="Your rendered export"
                    />
                    <span>
                      {e.lastExport.width} × {e.lastExport.height} px ·{" "}
                      {e.lastExport.format.toUpperCase()}
                    </span>
                    <a
                      className="secondary-button full-width"
                      href={e.lastExport.url}
                      download={e.lastExport.name}
                    >
                      <Download size={15} /> Download again
                    </a>
                  </div>
                </Section>
              )}
              {e.isCropping && (
                <p className="hint">
                  Apply or cancel the crop before exporting.
                </p>
              )}
              <p className="hint export-note">No watermark. Just your work.</p>
            </>
          )}
          {activeTool === "help" && (
            <>
              <Section title="From screenshot to share">
                <ol className="help-steps">
                  <li>
                    Upload an image, drop it anywhere, or paste from your
                    clipboard.
                  </li>
                  <li>
                    Choose a preset and adjust your background, canvas, and
                    frame.
                  </li>
                  <li>Add a caption or a magnifier to highlight a detail.</li>
                  <li>Export in PNG, JPEG, or WebP, at up to 3× resolution.</li>
                </ol>
              </Section>
              <Section title="Keyboard shortcuts">
                <div className="shortcut">
                  <span>Paste image</span>
                  <kbd>⌘ / Ctrl V</kbd>
                </div>
                <div className="shortcut">
                  <span>Undo</span>
                  <kbd>⌘ / Ctrl Z</kbd>
                </div>
                <div className="shortcut">
                  <span>Redo</span>
                  <kbd>⇧ ⌘ / Ctrl Z</kbd>
                </div>
                <div className="shortcut">
                  <span>Cancel crop</span>
                  <kbd>Esc</kbd>
                </div>
              </Section>
              <Section title="Your work, your browser">
                <p className="hint">
                  Images stay in this browser tab unless you choose AI styling.
                  Export before closing or refreshing. Saved styles stay in this
                  browser, but images don't.
                </p>
                <p className="hint">
                  Up to 10 images. PNG, JPG, WebP, GIF, and AVIF. 20 MB per
                  file. Animated files use their first frame.
                </p>
                <button
                  className="secondary-button full-width"
                  onClick={e.loadDemo}
                  disabled={!e.canAddMore || e.isImporting}
                >
                  Try the demo image <ArrowUpRight size={14} />
                </button>
              </Section>
            </>
          )}
        </div>
        <div className="inspector-footer">
          <button
            className="icon-button"
            aria-label="Undo edit"
            title="Undo"
            disabled={!e.canUndo}
            onClick={e.undo}
          >
            <Undo2 size={15} />
          </button>
          <span>Make room to experiment.</span>
          <button
            className="icon-button"
            aria-label="Redo edit"
            title="Redo"
            disabled={!e.canRedo}
            onClick={e.redo}
          >
            <Redo2 size={15} />
          </button>
        </div>
      </aside>
    </>
  );
}

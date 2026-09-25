"use client";
import {
  ArrowUpRight,
  Check,
  ImagePlus,
  Minus,
  Plus,
  Scan,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import type { ShotlaEditor } from "@/hooks/use-shotla-editor";
import { normalizeBackground } from "@/lib/editor-model";
import type { TextOverlay } from "@/types";

const noise = normalizeBackground(
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' opacity='.25' filter='url(%23n)'/%3E%3C/svg%3E")`,
);
function layerPosition(position: string): React.CSSProperties {
  const left = position.includes("left");
  const right = position.includes("right");
  const top = position.includes("top");
  const bottom = position.includes("bottom");
  return {
    position: "absolute",
    left: right ? undefined : left ? "8%" : "50%",
    right: right ? "8%" : undefined,
    top: bottom ? undefined : top ? "8%" : "50%",
    bottom: bottom ? "8%" : undefined,
    transform: `translate(${left || right ? "0" : "-50%"}, ${top || bottom ? "0" : "-50%"})`,
  };
}

function TextLayer({
  layer,
  canvas,
}: {
  layer: TextOverlay;
  canvas: { width: number; height: number };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const requestedSize = { small: 22, medium: 34, large: 52 }[layer.size] ?? 34;
  // biome-ignore lint/correctness/useExhaustiveDependencies: Caption changes alter measured text height.
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    // Fit complete captions inside the safe area, even on a small artboard.
    let size = requestedSize;
    node.style.fontSize = `${size}px`;
    while (
      (node.scrollHeight > canvas.height * 0.84 ||
        node.scrollWidth > canvas.width * 0.84) &&
      size > 1
    ) {
      size -= 1;
      node.style.fontSize = `${size}px`;
    }
  }, [requestedSize, layer.text, canvas.width, canvas.height]);
  return (
    <div
      ref={ref}
      data-testid="text-layer"
      style={{
        ...layerPosition(layer.position),
        maxWidth: "84%",
        width: "max-content",
        fontFamily: "Arial, sans-serif",
        fontSize: requestedSize,
        fontWeight: 600,
        lineHeight: 1.25,
        color: layer.color,
        textAlign: layer.position.includes("left")
          ? "left"
          : layer.position.includes("right")
            ? "right"
            : "center",
        whiteSpace: "pre-wrap",
        overflowWrap: "anywhere",
        textShadow: "0 2px 10px #182b3050",
      }}
    >
      {layer.text}
    </div>
  );
}

export function Canvas({ editor: e }: { editor: ShotlaEditor }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ width: 900, height: 600 });
  const zoom = e.previewZoom;
  const setZoom = e.setPreviewZoom;
  useEffect(() => {
    if (!viewportRef.current) return;
    const observer = new ResizeObserver(([entry]) =>
      setViewport({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      }),
    );
    observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, []);
  const fitScale = Math.min(
    (viewport.width - 88) / e.canvasSize.width,
    (viewport.height - 104) / e.canvasSize.height,
    1,
  );
  const scale = (Math.max(0.02, fitScale) * zoom) / 100;
  const header = e.advancedSettings.windowHeader === "none" ? 0 : 36;
  const border = e.advancedSettings.border
    ? e.advancedSettings.borderWidth * 2
    : 0;
  const availableWidth = Math.max(
    1,
    e.canvasSize.width - e.padding * 2 - border,
  );
  const availableHeight = Math.max(
    1,
    e.canvasSize.height - e.padding * 2 - header - border,
  );
  const imageFit = Math.min(
    availableWidth / e.imageSize.width,
    availableHeight / e.imageSize.height,
  );
  const imageWidth = e.imageSize.width * imageFit;
  const imageHeight = e.imageSize.height * imageFit;

  return (
    <main
      id="workspace"
      tabIndex={-1}
      className={`workspace ${e.isDragging ? "dragging" : ""}`}
    >
      <div className="workspace-bar">
        <div>
          <span className="status-dot" />
          <span>
            {e.uploadedImage ? "Live preview" : "Your creative space"}
          </span>
        </div>
        <span>
          {e.uploadedImage
            ? `${e.canvasSize.width} × ${e.canvasSize.height} px`
            : "A little polish goes a long way."}
        </span>
      </div>
      <div className="canvas-viewport" ref={viewportRef}>
        {!e.uploadedImage ? (
          <div className="empty-state">
            <div className="empty-composition" aria-hidden="true">
              <div className="empty-swatch swatch-back" />
              <div className="empty-swatch swatch-front">
                <div className="sample-browser">
                  <div className="sample-browser-top">
                    <i />
                    <i />
                    <i />
                  </div>
                  <img src="/demo-screenshot.svg" alt="" />
                </div>
              </div>
              <div className="composition-label">
                <Sparkle /> A better first impression
              </div>
            </div>
            <span className="eyebrow">SMALL DETAILS. BIG DIFFERENCE.</span>
            <h2>
              Your screenshot.
              <br />
              <span>Ready for the spotlight.</span>
            </h2>
            <p>
              Turn everyday screenshots into something
              <br className="desktop-break" /> worth sharing. Drop an image to
              get started.
            </p>
            <div className="empty-actions">
              <button
                className="primary-button"
                disabled={e.isImporting}
                onClick={e.addMoreScreenshots}
              >
                <Upload size={16} />
                {e.isImporting ? "Opening image…" : "Upload screenshot"}
              </button>
              <button
                className="text-button"
                disabled={e.isImporting}
                onClick={e.loadDemo}
              >
                Try a demo <ArrowUpRight size={15} />
              </button>
            </div>
            <div className="upload-note">
              PNG, JPG, WebP & more <span>·</span> or paste with <kbd>⌘ V</kbd>
            </div>
          </div>
        ) : e.isCropping ? (
          <div className="crop-workspace">
            <div className="crop-instructions">
              <CropIcon /> Drag to adjust your selection
            </div>
            <ReactCrop
              crop={e.cropArea}
              onChange={(_, percent) => e.onCropChange(percent)}
              minWidth={1}
              minHeight={1}
              keepSelection
            >
              <img
                src={e.uploadedImage}
                alt="Crop selection"
                style={{
                  maxWidth: Math.max(180, viewport.width - 80),
                  maxHeight: Math.max(160, viewport.height - 160),
                  objectFit: "contain",
                }}
              />
            </ReactCrop>
            <div className="crop-actions">
              <button className="secondary-button" onClick={e.onCancelCrop}>
                <X size={15} /> Cancel
              </button>
              <button className="primary-button" onClick={e.onApplyCrop}>
                <Check size={15} /> Apply crop
              </button>
            </div>
          </div>
        ) : (
          <div className="canvas-scroll">
            <div
              className="scaled-canvas"
              style={{
                width: e.canvasSize.width * scale,
                height: e.canvasSize.height * scale,
              }}
            >
              <div
                ref={e.canvasContainerRef}
                data-testid="export-canvas"
                className="artboard"
                style={{
                  width: e.canvasSize.width,
                  height: e.canvasSize.height,
                  borderRadius: e.canvasCorners,
                  background: e.getBackgroundStyle(),
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {e.advancedSettings.backgroundNoise && (
                  <div
                    data-testid="grain-overlay"
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: noise,
                      opacity: 0.3,
                      pointerEvents: "none",
                    }}
                  />
                )}
                <div
                  data-testid="image-frame"
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: imageWidth,
                    height: imageHeight + header,
                    boxSizing: "content-box",
                    transform: `translate(-50%, -50%) translate(${(e.advancedSettings.horizontalOffset * e.canvasSize.width) / 100}px, ${(e.advancedSettings.verticalOffset * e.canvasSize.height) / 100}px) scale(${e.advancedSettings.windowScale / 100})`,
                    borderRadius: e.advancedSettings.frameCorners,
                    boxShadow: `0 ${e.advancedSettings.windowShadow / 2}px ${e.advancedSettings.windowShadow * 1.5}px -${e.advancedSettings.windowShadow / 6}px rgba(25,35,30,0.35)`,
                    border: e.advancedSettings.border
                      ? `${e.advancedSettings.borderWidth}px solid ${e.advancedSettings.borderColor}`
                      : undefined,
                    overflow: "hidden",
                  }}
                >
                  {header > 0 && (
                    <div
                      data-testid="window-header"
                      style={{
                        height: header,
                        background:
                          e.advancedSettings.windowHeader === "dark"
                            ? "#252c2a"
                            : "#fafbf9",
                        display: "flex",
                        alignItems: "center",
                        padding: "0 14px",
                        gap: 7,
                      }}
                    >
                      {["#ed7970", "#e7c067", "#87bf8d"].map((color) => (
                        <i
                          key={color}
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: color,
                          }}
                        />
                      ))}
                    </div>
                  )}
                  <img
                    data-testid="canvas-image"
                    src={e.uploadedImage}
                    alt="Your styled screenshot"
                    width={imageWidth}
                    height={imageHeight}
                    style={{
                      display: "block",
                      width: imageWidth,
                      height: imageHeight,
                      maxWidth: "none",
                      objectFit: "contain",
                      borderRadius: e.imageCornerRadius,
                      transform: `translate(${e.imageHorizontalOffset}px, ${e.imageVerticalOffset}px) scale(${e.imageScale / 100})`,
                    }}
                  />
                </div>
                {e.magnifiers.map((m) => {
                  const size = Math.min(
                    { small: 120, medium: 180, large: 260 }[m.size] ?? 180,
                    e.canvasSize.width * 0.84,
                    e.canvasSize.height * 0.84,
                  );
                  return (
                    <div
                      key={m.id}
                      data-testid="magnifier"
                      style={{
                        ...layerPosition(m.position),
                        width: size,
                        height: size,
                        borderRadius: m.shape === "circle" ? "50%" : 16,
                        border: `4px ${m.style === "dashed" ? "dashed" : "solid"} ${m.color}`,
                        backgroundColor: "white",
                        backgroundImage: `url("${e.uploadedImage}")`,
                        backgroundSize: `${imageWidth * (m.zoom ?? 2)}px ${imageHeight * (m.zoom ?? 2)}px`,
                        backgroundPosition: `${m.x ?? 50}% ${m.y ?? 50}%`,
                        backgroundRepeat: "no-repeat",
                        boxShadow: "0 8px 24px #182b3040",
                        overflow: "hidden",
                      }}
                    >
                      {m.style === "filled" && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: m.color,
                            opacity: 0.16,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
                {e.textOverlays.map((t) => (
                  <TextLayer key={t.id} layer={t} canvas={e.canvasSize} />
                ))}
              </div>
              <div className="artboard-label">
                <span>{e.activeName}</span>
                <span>
                  {e.aspectRatio === "Auto" ? "Original ratio" : e.aspectRatio}
                </span>
              </div>
            </div>
          </div>
        )}
        {e.uploadedImage && !e.isCropping && (
          <div className="zoom-toolbar">
            <button
              aria-label="Zoom out"
              disabled={zoom <= 25}
              onClick={() => setZoom(Math.max(25, zoom - 25))}
            >
              <Minus size={15} />
            </button>
            <span>{Math.round(scale * 100)}%</span>
            <button
              aria-label="Zoom in"
              disabled={zoom >= 200}
              onClick={() => setZoom(Math.min(200, zoom + 25))}
            >
              <Plus size={15} />
            </button>
            <i />
            <button
              className="fit-button"
              onClick={() => setZoom(100)}
              aria-label="Fit preview"
            >
              <Scan size={14} /> Fit
            </button>
          </div>
        )}
        {e.isDragging && (
          <div className="drop-overlay">
            <ImagePlus size={38} />
            <strong>Drop your next screenshot here</strong>
          </div>
        )}
      </div>
      <footer className="filmstrip">
        <div className="filmstrip-label">
          <span>SCREENSHOTS</span>
          <small>{e.screenshots.length} / 10</small>
        </div>
        <div className="filmstrip-items">
          {e.screenshots.map((shot, i) => (
            <div
              className={`filmstrip-item ${shot.id === e.activeScreenshot ? "active" : ""}`}
              key={shot.id}
            >
              <button
                className="screenshot-button"
                aria-label={`Select ${shot.name}`}
                aria-pressed={shot.id === e.activeScreenshot}
                onClick={() => e.switchToScreenshot(shot.id)}
              >
                <img src={shot.image} alt="" />
                <span>{String(i + 1).padStart(2, "0")}</span>
              </button>
              <button
                className="remove-screenshot"
                aria-label={`Remove ${shot.name}`}
                onClick={() => e.removeScreenshot(shot.id)}
              >
                <X size={11} />
              </button>
            </div>
          ))}
          <button
            className="add-screenshot"
            aria-label="Add screenshots"
            disabled={!e.canAddMore || e.isImporting}
            onClick={e.addMoreScreenshots}
          >
            <Plus size={20} />
          </button>
          {!e.screenshots.length && (
            <p>
              Your images live here.
              <br />
              <span>Keep up to 10 in your workspace.</span>
            </p>
          )}
        </div>
        <span className="session-note">This session only</span>
      </footer>
    </main>
  );
}
function Sparkle() {
  return <span>✧</span>;
}
function CropIcon() {
  return <Scan size={15} />;
}

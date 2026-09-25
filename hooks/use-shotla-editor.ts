"use client";

import { toCanvas } from "html-to-image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  applyPreset,
  backgroundStyle,
  canvasDimensions,
  clamp,
  cropPixels,
  editHistory,
  freshSettings,
  type History,
  MAX_DIMENSION,
  MAX_IMAGES,
  type presets,
  redoHistory,
  type Snapshot,
  undoHistory,
} from "@/lib/editor-model";
import type {
  AdvancedSettings,
  AutoStyleResponse,
  CropArea,
  EditorState,
  Magnifier,
  TextOverlay,
} from "@/types";

type Document = { id: string; name: string; history: History };
type SavedStyle = { id: string; name: string; settings: EditorState };
const readImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("This image could not be opened."));
    img.src = src;
  });
const readFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("This file could not be read."));
    reader.readAsDataURL(file);
  });

export function useShotlaEditor() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);
  const [emptySettings, setEmptySettings] = useState(freshSettings);
  const [isDragging, setIsDragging] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [cropArea, setCropArea] = useState<CropArea>({
    unit: "%",
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [isAutoStyling, setIsAutoStyling] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(100);
  const [exportFormat, setExportFormat] = useState("png");
  const [exportScale, setExportScale] = useState(2);
  const [exportName, setExportName] = useState("shotla-export");
  const [lastExport, setLastExport] = useState<{
    url: string;
    name: string;
    width: number;
    height: number;
    format: string;
  } | null>(null);
  const [savedStyles, setSavedStyles] = useState<SavedStyle[]>([]);
  const [aiAvailable, setAiAvailable] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const importLock = useRef(false);
  const active = documents.find((d) => d.id === activeScreenshot);
  const snapshot = active?.history.present;
  const settings = snapshot?.settings ?? emptySettings;
  const uploadedImage = snapshot?.image ?? null;
  const imageSize = snapshot?.imageSize ?? { width: 1000, height: 660 };
  const canvasSize = canvasDimensions(settings, imageSize);
  useEffect(
    () => () => {
      if (lastExport) URL.revokeObjectURL(lastExport.url);
    },
    [lastExport],
  );

  const notice = useCallback(
    (title: string, description?: string, error = false) =>
      toast({ title, description, variant: error ? "destructive" : "default" }),
    [toast],
  );
  const changeSnapshot = useCallback(
    (change: (s: Snapshot) => Snapshot) => {
      setDocuments((docs) =>
        docs.map((d) =>
          d.id === activeScreenshot
            ? {
                ...d,
                history: editHistory(d.history, change(d.history.present)),
              }
            : d,
        ),
      );
    },
    [activeScreenshot],
  );
  const change = useCallback(
    (update: Partial<EditorState> | ((s: EditorState) => EditorState)) => {
      const run = (s: EditorState) =>
        typeof update === "function" ? update(s) : { ...s, ...update };
      if (!activeScreenshot) setEmptySettings(run);
      else changeSnapshot((s) => ({ ...s, settings: run(s.settings) }));
    },
    [activeScreenshot, changeSnapshot],
  );
  const undo = useCallback(() => {
    setIsCropping(false);
    setDocuments((docs) =>
      docs.map((d) =>
        d.id === activeScreenshot
          ? { ...d, history: undoHistory(d.history) }
          : d,
      ),
    );
  }, [activeScreenshot]);
  const redo = useCallback(() => {
    setIsCropping(false);
    setDocuments((docs) =>
      docs.map((d) =>
        d.id === activeScreenshot
          ? { ...d, history: redoHistory(d.history) }
          : d,
      ),
    );
  }, [activeScreenshot]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("shotla-styles") || "[]");
      if (Array.isArray(stored))
        setSavedStyles(
          stored
            .filter(
              (s) => typeof s.name === "string" && s.settings?.advancedSettings,
            )
            .slice(0, 8)
            .map((s) => ({ ...s, id: s.id || crypto.randomUUID() })),
        );
    } catch {
      /* Storage is optional. */
    }
    fetch("/api/auto-style")
      .then((r) => r.json())
      .then((d) => setAiAvailable(d.available === true))
      .catch(() => {});
  }, []);

  const importFiles = useCallback(
    async (files: File[]) => {
      if (importLock.current) return;
      importLock.current = true;
      setIsImporting(true);
      try {
        const available = MAX_IMAGES - documents.length;
        if (!available) {
          notice(
            "Your workspace is full",
            "Remove an image to add another. You can keep up to 10 images.",
          );
          return;
        }
        const added: Document[] = [];
        for (const file of files.slice(0, available)) {
          try {
            if (!/^image\/(png|jpeg|webp|gif|avif)$/.test(file.type))
              throw new Error("Use a PNG, JPG, WebP, GIF, or AVIF image.");
            if (file.size > 20 * 1024 * 1024)
              throw new Error("Choose an image smaller than 20 MB.");
            const src = await readFile(file);
            const img = await readImage(src);
            if (img.naturalWidth * img.naturalHeight > 40_000_000)
              throw new Error(
                "Choose an image with fewer than 40 million pixels.",
              );
            // Normalize formats (including animated images) into a single, exportable frame.
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            canvas.getContext("2d")!.drawImage(img, 0, 0);
            const image = canvas.toDataURL("image/png");
            const present: Snapshot = {
              image,
              original: image,
              imageSize: { width: img.naturalWidth, height: img.naturalHeight },
              settings: structuredClone(emptySettings),
            };
            added.push({
              id: crypto.randomUUID(),
              name: file.name,
              history: { past: [], present, future: [] },
            });
          } catch (error) {
            notice(
              `Couldn't open ${file.name}`,
              error instanceof Error ? error.message : "Try another image.",
              true,
            );
          }
        }
        if (added.length) {
          setDocuments((docs) => [...docs, ...added].slice(0, MAX_IMAGES));
          setActiveScreenshot(added[0].id);
          setIsCropping(false);
        }
        if (files.length > available)
          notice(
            "Image limit reached",
            `Only the first ${available} files were considered. The workspace holds 10 images.`,
          );
      } finally {
        importLock.current = false;
        setIsImporting(false);
      }
    },
    [documents.length, emptySettings, notice],
  );

  const loadDemo = async () => {
    try {
      const response = await fetch("/demo-screenshot.svg");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      try {
        const img = await readImage(url);
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d")!.drawImage(img, 0, 0);
        const png = await new Promise<Blob | null>((r) => canvas.toBlob(r));
        if (png)
          await importFiles([
            new File([png], "Studio overview.png", { type: "image/png" }),
          ]);
      } finally {
        URL.revokeObjectURL(url);
      }
    } catch {
      notice(
        "Demo could not load",
        "You can still upload your own image.",
        true,
      );
    }
  };

  useEffect(() => {
    const isInput = (target: EventTarget | null) =>
      target instanceof HTMLElement &&
      (target.matches("input, textarea, select") || target.isContentEditable);
    const paste = (e: ClipboardEvent) => {
      if (isInput(e.target)) return;
      const files = Array.from(e.clipboardData?.files || []);
      if (files.length) {
        e.preventDefault();
        void importFiles(files);
      }
    };
    const keydown = (e: KeyboardEvent) => {
      if (isInput(e.target)) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        e.shiftKey ? redo() : undo();
      }
      if (e.key === "Escape") setIsCropping(false);
    };
    window.addEventListener("paste", paste);
    window.addEventListener("keydown", keydown);
    return () => {
      window.removeEventListener("paste", paste);
      window.removeEventListener("keydown", keydown);
    };
  }, [importFiles, undo, redo]);

  const updateAdvancedSetting = <K extends keyof AdvancedSettings>(
    key: K,
    value: AdvancedSettings[K],
  ) =>
    change((s) => ({
      ...s,
      advancedSettings: { ...s.advancedSettings, [key]: value },
    }));
  const setAspectRatio = (ratio: string) => {
    if (ratio === "Auto") {
      change({ aspectRatio: ratio, fitToImage: true });
      return;
    }
    const [w, h] = ratio.split(":").map(Number);
    change({
      aspectRatio: ratio,
      fitToImage: false,
      canvasSize: { width: 1200, height: Math.round((1200 * h) / w) },
    });
  };
  const onApplyCrop = async () => {
    if (!snapshot || cropArea.width <= 0 || cropArea.height <= 0) return;
    try {
      const img = await readImage(snapshot.image);
      const crop = cropPixels(cropArea, snapshot.imageSize);
      const canvas = document.createElement("canvas");
      canvas.width = crop.width;
      canvas.height = crop.height;
      canvas
        .getContext("2d")!
        .drawImage(
          img,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height,
        );
      const image = canvas.toDataURL("image/png");
      changeSnapshot((s) => ({
        ...s,
        image,
        imageSize: { width: crop.width, height: crop.height },
      }));
      setIsCropping(false);
    } catch {
      notice("Crop failed", "Try selecting the crop area again.", true);
    }
  };
  const restoreOriginal = async () => {
    if (!snapshot) return;
    const img = await readImage(snapshot.original);
    changeSnapshot((s) => ({
      ...s,
      image: s.original,
      imageSize: { width: img.width, height: img.height },
    }));
    setIsCropping(false);
  };

  const exportImage = async (clipboard = false) => {
    if (
      !uploadedImage ||
      !canvasContainerRef.current ||
      isExporting ||
      isCropping
    )
      return;
    setIsExporting(true);
    try {
      await document.fonts.ready;
      const scale = Math.min(
        exportScale,
        8192 / Math.max(canvasSize.width, canvasSize.height),
      );
      const canvas = await toCanvas(canvasContainerRef.current, {
        pixelRatio: scale,
        width: canvasSize.width,
        height: canvasSize.height,
        skipFonts: true,
        backgroundColor:
          !clipboard && exportFormat === "jpeg" ? "#ffffff" : undefined,
        style: { transform: "none" },
        filter: (node) =>
          !(
            node instanceof Element && node.hasAttribute("data-export-exclude")
          ),
      });
      const format = clipboard ? "png" : exportFormat;
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, `image/${format}`, 0.95),
      );
      if (!blob) throw new Error("The browser could not render this image.");
      if (clipboard) {
        if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined")
          throw new Error(
            "Clipboard is unavailable in this browser. Download your image instead.",
          );
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        notice("Copied to clipboard", "Your image is ready to paste.");
      } else {
        const url = URL.createObjectURL(blob);
        const name = `${exportName.trim().replace(/[^\w .-]/g, "") || "shotla-export"}.${format === "jpeg" ? "jpg" : format}`;
        setLastExport({
          url,
          name,
          width: canvas.width,
          height: canvas.height,
          format,
        });
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        notice(
          "Your export is ready",
          `${canvas.width} × ${canvas.height} px · ${format.toUpperCase()}`,
        );
      }
    } catch (error) {
      notice(
        "Export could not finish",
        error instanceof Error
          ? error.message
          : "Try again at a smaller export size.",
        true,
      );
    } finally {
      setIsExporting(false);
    }
  };

  const autoStyleWithAI = async () => {
    if (!snapshot || !aiAvailable || isAutoStyling) return;
    setIsAutoStyling(true);
    try {
      const img = await readImage(snapshot.image);
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, 1024 / Math.max(img.width, img.height));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas
        .getContext("2d")!
        .drawImage(img, 0, 0, canvas.width, canvas.height);
      const response = await fetch("/api/auto-style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: {
            inlineData: {
              mimeType: "image/png",
              data: canvas.toDataURL("image/png").split(",")[1],
            },
          },
        }),
      });
      const data: AutoStyleResponse = await response.json();
      if (!response.ok || !data.style)
        throw new Error(data.error || "Styling is temporarily unavailable.");
      const style = data.style;
      if (
        !CSS.supports("background", style.backgroundCss) ||
        /url\s*\(/i.test(style.backgroundCss)
      )
        throw new Error("The suggested background was invalid. Try again.");
      change((s) => ({
        ...s,
        selectedBackground: "custom",
        backgroundCss: style.backgroundCss,
        padding: style.padding ?? s.padding,
        canvasCorners: style.canvasRadius ?? s.canvasCorners,
        advancedSettings: {
          ...s.advancedSettings,
          frameCorners: style.frameBorderRadius ?? 12,
          windowShadow: style.shadow ?? 28,
          windowHeader: style.windowHeaderStyle ?? "none",
          backgroundNoise: style.noise ?? false,
        },
      }));
      notice("AI style applied", style.description);
    } catch (error) {
      notice(
        "AI styling unavailable",
        error instanceof Error ? error.message : "Try a studio preset instead.",
        true,
      );
    } finally {
      setIsAutoStyling(false);
    }
  };

  const saveStyle = (name: string) => {
    if (!name.trim()) return;
    const style = {
      ...settings,
      textOverlays: [],
      magnifiers: [],
      isCropping: false,
      cropArea: null,
    };
    const next = [
      { id: crypto.randomUUID(), name: name.trim(), settings: style },
      ...savedStyles,
    ].slice(0, 8);
    try {
      localStorage.setItem("shotla-styles", JSON.stringify(next));
      setSavedStyles(next);
      notice(
        "Style saved",
        "Available in this browser for your next screenshot.",
      );
    } catch {
      notice(
        "Style could not be saved",
        "Browser storage is unavailable.",
        true,
      );
    }
  };

  return {
    ...settings,
    canvasSize,
    uploadedImage,
    imageSize,
    isDragging,
    isCropping,
    cropArea,
    isExporting,
    isAutoStyling,
    isImporting,
    aiAvailable,
    screenshots: documents.map((d) => ({
      id: d.id,
      name: d.name,
      image: d.history.present.image,
    })),
    activeScreenshot,
    activeName: active?.name ?? "Untitled screenshot",
    canAddMore: documents.length < MAX_IMAGES,
    canUndo: !!active?.history.past.length,
    canRedo: !!active?.history.future.length,
    undo,
    redo,
    fileInputRef,
    canvasContainerRef,
    previewZoom,
    setPreviewZoom,
    exportFormat,
    setExportFormat,
    exportScale,
    setExportScale,
    exportName,
    setExportName,
    lastExport,
    savedStyles,
    saveStyle,
    applySavedStyle: (style: SavedStyle) =>
      change((s) => ({
        ...style.settings,
        textOverlays: s.textOverlays,
        magnifiers: s.magnifiers,
      })),
    deleteSavedStyle: (index: number) => {
      const next = savedStyles.filter((_, i) => i !== index);
      try {
        localStorage.setItem("shotla-styles", JSON.stringify(next));
        setSavedStyles(next);
      } catch {
        notice(
          "Style could not be removed",
          "Browser storage is unavailable.",
          true,
        );
      }
    },
    applyPreset: (preset: (typeof presets)[number]) =>
      change((s) => applyPreset(s, preset)),
    setSelectedBackground: (selectedBackground: string) =>
      change({ selectedBackground }),
    setCustomBackground: (backgroundCss: string) =>
      change({ selectedBackground: "custom", backgroundCss }),
    getBackgroundStyle: () =>
      backgroundStyle(settings.selectedBackground, settings.backgroundCss),
    updateAdvancedSetting,
    setAspectRatio,
    setFitToImage: (fitToImage: boolean) =>
      change({ fitToImage, aspectRatio: "Auto", canvasSize }),
    setCanvasSize: (size: { width: number; height: number }) =>
      change({
        fitToImage: false,
        aspectRatio: "Custom",
        canvasSize: {
          width: clamp(size.width, 100, MAX_DIMENSION),
          height: clamp(size.height, 100, MAX_DIMENSION),
        },
      }),
    setPadding: (padding: number) => change({ padding }),
    setCanvasCorners: (canvasCorners: number) => change({ canvasCorners }),
    setImageScale: (imageScale: number) => change({ imageScale }),
    setImageHorizontalOffset: (imageHorizontalOffset: number) =>
      change({ imageHorizontalOffset }),
    setImageVerticalOffset: (imageVerticalOffset: number) =>
      change({ imageVerticalOffset }),
    setImageCornerRadius: (imageCornerRadius: number) =>
      change({ imageCornerRadius }),
    onResetImageControls: () =>
      change({
        imageScale: 100,
        imageHorizontalOffset: 0,
        imageVerticalOffset: 0,
        imageCornerRadius: 0,
      }),
    resetStyle: () => change(freshSettings()),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      void importFiles(Array.from(e.dataTransfer.files));
    },
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.types.includes("Files")) setIsDragging(true);
    },
    onDragLeave: (e: React.DragEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node))
        setIsDragging(false);
    },
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => {
      void importFiles(Array.from(e.target.files || []));
      e.target.value = "";
    },
    addMoreScreenshots: () => fileInputRef.current?.click(),
    loadDemo,
    switchToScreenshot: (id: string) => {
      setActiveScreenshot(id);
      setIsCropping(false);
    },
    removeScreenshot: (id: string) => {
      setDocuments((docs) => docs.filter((d) => d.id !== id));
      if (id === activeScreenshot) {
        setActiveScreenshot(documents.find((d) => d.id !== id)?.id ?? null);
        setIsCropping(false);
      }
    },
    onStartCrop: () => {
      if (uploadedImage) {
        setCropArea({ unit: "%", x: 10, y: 10, width: 80, height: 80 });
        setIsCropping(true);
      }
    },
    onApplyCrop,
    onCancelCrop: () => setIsCropping(false),
    onCropChange: setCropArea,
    restoreOriginal,
    addTextLayer: () =>
      change((s) => ({
        ...s,
        textOverlays: [
          ...s.textOverlays,
          {
            id: crypto.randomUUID(),
            text: "Your next big idea.",
            position: "bottom",
            size: "medium",
            color: "#ffffff",
          },
        ],
      })),
    updateText: (id: string, patch: Partial<TextOverlay>) =>
      change((s) => ({
        ...s,
        textOverlays: s.textOverlays.map((t) =>
          t.id === id ? { ...t, ...patch } : t,
        ),
      })),
    removeText: (id: string) =>
      change((s) => ({
        ...s,
        textOverlays: s.textOverlays.filter((t) => t.id !== id),
      })),
    addMagnifier: () =>
      change((s) => ({
        ...s,
        magnifiers: [
          ...s.magnifiers,
          {
            id: crypto.randomUUID(),
            shape: "circle",
            style: "outline",
            position: "center",
            size: "medium",
            color: "#ffffff",
            zoom: 2,
            x: 50,
            y: 50,
          },
        ],
      })),
    updateMagnifier: (id: string, patch: Partial<Magnifier>) =>
      change((s) => ({
        ...s,
        magnifiers: s.magnifiers.map((m) =>
          m.id === id ? { ...m, ...patch } : m,
        ),
      })),
    removeMagnifier: (id: string) =>
      change((s) => ({
        ...s,
        magnifiers: s.magnifiers.filter((m) => m.id !== id),
      })),
    exportImage,
    autoStyleWithAI,
  };
}
export type ShotlaEditor = ReturnType<typeof useShotlaEditor>;

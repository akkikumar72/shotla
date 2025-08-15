import { useCallback, useRef, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { backgroundThemes } from "@/constants/backgrounds";
import { toPng } from "html-to-image";
import type {
  AdvancedSettings,
  CropArea,
  Magnifier,
  Screenshot,
  TextOverlay,
  EditorState,
  AutoStyleResponse,
} from "@/types";

export function useShotlaEditor() {
  const { toast } = useToast();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState("sunshine");
  const [selectedShadow, setSelectedShadow] = useState("none");
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [magnifiers, setMagnifiers] = useState<Magnifier[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);
  const [isAutoStyling, setIsAutoStyling] = useState(false);

  const [isCropping, setIsCropping] = useState(false);
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({
    backgroundNoise: false,
    windowShadow: 50,
    windowHeader: "dark",
    frameCorners: 20,
    windowScale: 100,
    horizontalOffset: 0,
    verticalOffset: 0,
    border: false,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  });

  // Canvas controls state
  const [fitToImage, setFitToImage] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 918, height: 328 });
  const [canvasScale, setCanvasScale] = useState(100);
  const [aspectRatio, setAspectRatio] = useState("Auto");
  const [padding, setPadding] = useState(64);
  const [canvasCorners, setCanvasCorners] = useState(8);

  const [imageScale, setImageScale] = useState(100);
  const [imageHorizontalOffset, setImageHorizontalOffset] = useState(0);
  const [imageVerticalOffset, setImageVerticalOffset] = useState(0);
  const [imageCornerRadius, setImageCornerRadius] = useState(0);
  const [dynamicStyles, setDynamicStyles] = useState<Record<string, string>>(
    {}
  );

  const MAX_SCREENSHOTS = 10;
  const canAddMore = screenshots.length < MAX_SCREENSHOTS;

  const computeFitCanvasSize = useCallback((imgW: number, imgH: number) => {
    const SIDEBAR_WIDTH = 320; // w-80
    const VERTICAL_CHROME = 200; // header/footer breathing room
    const HORIZONTAL_GUTTER = 80; // padding around canvas area

    const maxW = Math.max(
      320,
      (typeof window !== "undefined" ? window.innerWidth : 1280) -
        SIDEBAR_WIDTH -
        HORIZONTAL_GUTTER
    );
    const maxH = Math.max(
      200,
      (typeof window !== "undefined" ? window.innerHeight : 800) -
        VERTICAL_CHROME
    );

    const imgAspect = imgW / imgH;
    const boxAspect = maxW / maxH;

    if (imgAspect > boxAspect) {
      // limit by width
      const width = Math.floor(maxW);
      const height = Math.floor(width / imgAspect);
      return { width, height };
    } else {
      // limit by height
      const height = Math.floor(maxH);
      const width = Math.floor(height * imgAspect);
      return { width, height };
    }
  }, []);

  // Recompute canvas size when image changes or window resizes if fitToImage is enabled
  useEffect(() => {
    if (!uploadedImage || !fitToImage) return;

    let isCancelled = false;
    const img = new Image();
    img.onload = () => {
      if (isCancelled) return;
      const { width, height } = computeFitCanvasSize(
        img.naturalWidth,
        img.naturalHeight
      );
      setCanvasSize({ width, height });
    };
    img.src = uploadedImage;

    const onResize = () => {
      if (!uploadedImage || !fitToImage) return;
      const recompute = () => {
        const { width, height } = computeFitCanvasSize(
          img.naturalWidth,
          img.naturalHeight
        );
        setCanvasSize({ width, height });
      };
      // If natural sizes not yet ready, re-create image
      if (!img.naturalWidth || !img.naturalHeight) {
        const probe = new Image();
        probe.onload = () => {
          const { width, height } = computeFitCanvasSize(
            probe.naturalWidth,
            probe.naturalHeight
          );
          setCanvasSize({ width, height });
        };
        probe.src = uploadedImage;
      } else {
        recompute();
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("resize", onResize);
    }

    return () => {
      isCancelled = true;
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", onResize);
      }
    };
  }, [uploadedImage, fitToImage, computeFitCanvasSize]);

  const captureEditorState = useCallback(
    (): EditorState => ({
      selectedBackground,
      selectedShadow,
      textOverlays,
      magnifiers,
      advancedSettings,
      isCropping,
      cropArea,
      fitToImage,
      canvasSize,
      canvasScale,
      aspectRatio,
      padding,
      canvasCorners,
      imageScale,
      imageHorizontalOffset,
      imageVerticalOffset,
      imageCornerRadius,
    }),
    [
      selectedBackground,
      selectedShadow,
      textOverlays,
      magnifiers,
      advancedSettings,
      isCropping,
      cropArea,
      fitToImage,
      canvasSize,
      canvasScale,
      aspectRatio,
      padding,
      canvasCorners,
      imageScale,
      imageHorizontalOffset,
      imageVerticalOffset,
      imageCornerRadius,
    ]
  );

  const applyEditorState = useCallback((state: EditorState | undefined) => {
    if (!state) return;
    setSelectedBackground(state.selectedBackground);
    setSelectedShadow(state.selectedShadow);
    setTextOverlays(state.textOverlays);
    setMagnifiers(state.magnifiers);
    setAdvancedSettings(state.advancedSettings);
    setIsCropping(state.isCropping);
    setCropArea(state.cropArea);
    setFitToImage(state.fitToImage);
    setCanvasSize(state.canvasSize);
    setCanvasScale(state.canvasScale);
    setAspectRatio(state.aspectRatio);
    setPadding(state.padding);
    setCanvasCorners(state.canvasCorners);
    setImageScale(state.imageScale);
    setImageHorizontalOffset(state.imageHorizontalOffset);
    setImageVerticalOffset(state.imageVerticalOffset);
    setImageCornerRadius(state.imageCornerRadius);
  }, []);

  const updateAdvancedSetting = useCallback(
    (key: keyof AdvancedSettings, value: any) => {
      setAdvancedSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetImageControls = useCallback(() => {
    setImageScale(100);
    setImageHorizontalOffset(0);
    setImageVerticalOffset(0);
    setImageCornerRadius(0);
  }, []);

  const getBackgroundStyle = useCallback(
    (background: string): { type: "css" | "tailwind"; value: string } => {
      // Check for dynamic AI-generated styles first
      if (dynamicStyles[background]) {
        return {
          type: "css",
          value: dynamicStyles[background],
        };
      }

      // Search through all background theme categories for the selected background
      const allThemes = [
        ...backgroundThemes.shapePatterns,
        ...backgroundThemes.minimalGradients,
        ...backgroundThemes.spotlightDark,
        ...backgroundThemes.geometricPatterns,
        ...backgroundThemes.meshBlobs,
        ...backgroundThemes.abstractBubbles,
        ...backgroundThemes.textures,
      ];

      const theme = allThemes.find((t) => t.value === background);

      if (theme && theme.css) {
        // Handle special spotlight backgrounds
        if (
          "type" in theme &&
          theme.type === "spotlight" &&
          "glowColor" in theme &&
          theme.glowColor
        ) {
          return {
            type: "css",
            value: `${theme.css}; background-image: radial-gradient(circle at 50% 50%, ${theme.glowColor}33 0%, transparent 50%)`,
          };
        }

        return {
          type: "css",
          value: theme.css,
        };
      }

      // Fallback to legacy styles for backward compatibility
      const legacyStyles: Record<string, string> = {
        "abstract-teal": "bg-gradient-to-br from-teal-400 to-cyan-600",
        "abstract-orange": "bg-gradient-to-br from-orange-500 to-red-600",
        "alternative-white": "bg-white",
        "bermuda-red": "bg-gradient-to-br from-red-500 to-pink-600",
        "bermuda-green": "bg-gradient-to-br from-green-500 to-emerald-600",
        "bermuda-purple": "bg-gradient-to-br from-purple-600 to-pink-600",
        none: "bg-gradient-to-br from-yellow-300 to-orange-400",
      };

      return {
        type: "tailwind",
        value: legacyStyles[background] || "bg-gray-100",
      };
    },
    [dynamicStyles]
  );

  const getShadowStyle = useCallback((shadow: string) => {
    const styles: Record<string, string> = {
      none: "",
      subtle: "drop-shadow-sm",
      medium: "drop-shadow-lg",
      strong: "drop-shadow-2xl",
    };
    return styles[shadow] || "";
  }, []);

  const pushScreenshot = useCallback(
    (imageData: string, name: string): string | null => {
      let createdId: string | null = null;
      setScreenshots((prev) => {
        if (prev.length >= MAX_SCREENSHOTS) return prev;
        const newId =
          Date.now().toString() + Math.random().toString(36).substr(2, 9);
        createdId = newId;
        const freshState: EditorState = {
          selectedBackground: "sunshine",
          selectedShadow: "none",
          textOverlays: [],
          magnifiers: [],
          advancedSettings: {
            backgroundNoise: false,
            windowShadow: 50,
            windowHeader: "dark",
            frameCorners: 20,
            windowScale: 100,
            horizontalOffset: 0,
            verticalOffset: 0,
            border: false,
            borderWidth: 2,
            borderColor: "#FFFFFF",
          },
          isCropping: false,
          cropArea: null,
          fitToImage: true,
          canvasSize: { width: 918, height: 328 },
          canvasScale: 100,
          aspectRatio: "Auto",
          padding: 64,
          canvasCorners: 8,
          imageScale: 100,
          imageHorizontalOffset: 0,
          imageVerticalOffset: 0,
          imageCornerRadius: 0,
        };
        const next = [
          ...prev,
          {
            id: newId,
            image: imageData,
            name,
            createdAt: new Date(),
            state: freshState,
          },
        ];
        return next;
      });
      return createdId;
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files).slice(
        0,
        MAX_SCREENSHOTS - screenshots.length
      );

      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageData = e.target?.result as string;
            const newId = pushScreenshot(imageData, file.name);
            if (!activeScreenshot && newId) {
              setActiveScreenshot(newId);
              setUploadedImage(imageData);
              setOriginalImage(imageData);
              // Ensure new images get the default background
              setSelectedBackground("sunshine");
            }
          };
          reader.readAsDataURL(file);
        }
      });
    },
    [screenshots.length, activeScreenshot, pushScreenshot]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).slice(
        0,
        MAX_SCREENSHOTS - screenshots.length
      );

      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageData = e.target?.result as string;
            const newId = pushScreenshot(imageData, file.name);
            if (!activeScreenshot && newId) {
              setActiveScreenshot(newId);
              setUploadedImage(imageData);
              setOriginalImage(imageData);
              // Ensure new images get the default background
              setSelectedBackground("sunshine");
            }
          };
          reader.readAsDataURL(file);
        }
      });

      if (e.target) {
        e.target.value = "";
      }
    },
    [screenshots.length, activeScreenshot, pushScreenshot]
  );

  const selectScreenshot = useCallback(
    (id: string) => {
      // Save current state into active screenshot
      setScreenshots((prev) => {
        const currentId = activeScreenshot;
        if (!currentId) return prev;
        const snapshot = captureEditorState();
        return prev.map((s) =>
          s.id === currentId ? { ...s, state: snapshot } : s
        );
      });

      setActiveScreenshot(id);

      // Load selected state
      const selected = screenshots.find((s) => s.id === id);
      if (selected) {
        setUploadedImage(selected.image);
        setOriginalImage(selected.image);
        applyEditorState(selected.state);
      }
    },
    [activeScreenshot, screenshots, captureEditorState, applyEditorState]
  );

  const removeScreenshot = useCallback(
    (id: string) => {
      setScreenshots((prev) => {
        const updated = prev.filter((s) => s.id !== id);
        if (activeScreenshot === id) {
          if (updated.length > 0) {
            const next = updated[0];
            setActiveScreenshot(next.id);
            setUploadedImage(next.image);
            setOriginalImage(next.image);
            applyEditorState(next.state);
          } else {
            setActiveScreenshot(null);
            setUploadedImage(null);
            setOriginalImage(null);
            // reset editor state to defaults
            applyEditorState(undefined);
          }
        }
        return updated;
      });
    },
    [activeScreenshot, applyEditorState]
  );

  const addMoreScreenshots = useCallback(() => {
    if (!canAddMore) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [canAddMore]);

  const switchToScreenshot = useCallback(
    (id: string) => {
      selectScreenshot(id);
    },
    [selectScreenshot]
  );

  const updateActiveScreenshotImage = useCallback(
    (newImage: string) => {
      if (!activeScreenshot) return;
      setScreenshots((prev) =>
        prev.map((s) =>
          s.id === activeScreenshot ? { ...s, image: newImage } : s
        )
      );
    },
    [activeScreenshot]
  );

  const handleApplyCrop = useCallback(() => {
    if (!uploadedImage || !cropArea || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const scaleX = img.naturalWidth / 100;
      const scaleY = img.naturalHeight / 100;

      const actualCrop = {
        x: cropArea.x * scaleX,
        y: cropArea.y * scaleY,
        width: cropArea.width * scaleX,
        height: cropArea.height * scaleY,
      };

      canvas.width = actualCrop.width;
      canvas.height = actualCrop.height;

      ctx.drawImage(
        img,
        actualCrop.x,
        actualCrop.y,
        actualCrop.width,
        actualCrop.height,
        0,
        0,
        actualCrop.width,
        actualCrop.height
      );

      const croppedImageData = canvas.toDataURL("image/png", 1.0);
      setUploadedImage(croppedImageData);
      updateActiveScreenshotImage(croppedImageData);

      setIsCropping(false);
      setCropArea(null);

      if (fitToImage) {
        setCanvasSize({ width: actualCrop.width, height: actualCrop.height });
      }
    };
    img.src = uploadedImage;
  }, [uploadedImage, cropArea, fitToImage, updateActiveScreenshotImage]);

  const handleStartCrop = useCallback(() => {
    setIsCropping(true);
    setCropArea({ unit: "px", x: 20, y: 20, width: 200, height: 150 });
  }, []);

  const handleCropChange = useCallback((crop: CropArea) => {
    setCropArea(crop);
  }, []);

  const handleCancelCrop = useCallback(() => {
    setIsCropping(false);
    setCropArea(null);
  }, []);

  const handleCropDoubleClick = useCallback(() => {
    handleApplyCrop();
  }, [handleApplyCrop]);

  const addMagnifier = useCallback(() => {
    const magnifier: Magnifier = {
      id: Date.now().toString(),
      shape: "circle",
      style: "outline",
      position: "center",
      size: "medium",
      color: "blue",
    };
    setMagnifiers((prev) => [...prev, magnifier]);
  }, []);

  const addTextLayer = useCallback(() => {
    const overlay: TextOverlay = {
      id: Date.now().toString(),
      text: "Sample Text",
      position: "center",
      size: "medium",
      color: "white",
    };
    setTextOverlays((prev) => [...prev, overlay]);
  }, []);

  const exportImage = useCallback(async () => {
    if (!uploadedImage || !canvasContainerRef.current) {
      toast({
        title: "Export Failed",
        description: "No image or canvas found to export",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "🎨 Generating Export...",
        description: "Capturing your styled screenshot",
      });

      // Use html-to-image to capture the entire styled canvas including CSS backgrounds, shadows, frames
      const dataUrl = await toPng(canvasContainerRef.current, {
        cacheBust: true,
        quality: 1.0,
        pixelRatio: 2, // High DPI for crisp output
        style: {
          // Ensure the export captures the element properly
          transform: "scale(1)",
          transformOrigin: "top left",
        },
        filter: (node) => {
          // Filter out any drag overlay or crop tools that shouldn't be in the export
          const excludeClasses = [
            "crop-overlay",
            "drag-overlay",
            "magnifier-tooltip",
          ];
          return !excludeClasses.some(
            (className) => node.classList && node.classList.contains(className)
          );
        },
      });

      // Create download link
      const link = document.createElement("a");
      link.download = `shotla-export-${new Date()
        .toISOString()
        .slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();

      toast({
        title: "✨ Export Complete!",
        description: "Your styled screenshot has been downloaded",
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: "Failed to generate the image. Please try again.",
        variant: "destructive",
      });
    }
  }, [uploadedImage, toast]);

  const autoStyleWithAI = useCallback(async () => {
    if (!uploadedImage) {
      toast({
        title: "No Image",
        description: "Please upload an image first to use Auto-Style with AI.",
        variant: "destructive",
      });
      return;
    }

    setIsAutoStyling(true);

    try {
      // Create comprehensive system prompt with current editor context
      const systemPrompt = `You are a world-class visual designer, known for creating vibrant, exciting, and colorful digital art. Your task is to analyze the provided screenshot and devise a visually stunning and dynamic style for it.

Generate a complex, multi-layered CSS background property that incorporates:
- Multiple gradient types: linear-gradient, radial-gradient, and conic-gradient
- Vibrant and complementary color palettes
- Creative positioning and blending
- Modern, energetic, and artistic feel

IMPORTANT: Return ONLY the CSS value for the background property, without the "background:" prefix. For example:
"radial-gradient(circle at 30% 30%, #ffcc00, transparent 25%), linear-gradient(135deg, #ff6699, #6699ff)"

CURRENT EDITOR STATE:
- Background: ${selectedBackground}
- Shadow: ${selectedShadow}
- Padding: ${padding}px
- Canvas corners: ${canvasCorners}px
- Frame corners: ${advancedSettings.frameCorners}px
- Window shadow: ${advancedSettings.windowShadow}
- Window header: ${advancedSettings.windowHeader}
- Border: ${
        advancedSettings.border
          ? `enabled (${advancedSettings.borderColor})`
          : "disabled"
      }
- Background noise: ${advancedSettings.backgroundNoise ? "enabled" : "disabled"}
- Image scale: ${imageScale}%
- Image positioning: ${imageHorizontalOffset}px horizontal, ${imageVerticalOffset}px vertical
- Image corners: ${imageCornerRadius}px
- Text overlays: ${textOverlays.length} active
- Magnifiers: ${magnifiers.length} active

Create something completely different and more dynamic than the current style. Focus on:
- Complex gradient combinations (3-5 layers)
- Vibrant color palettes that complement the screenshot
- Artistic patterns and visual interest
- Modern, energetic aesthetic
- Colors that work well with the screenshot content
- Consider the existing visual elements and styling choices

Avoid simple two-color gradients. Create something truly spectacular and unique that enhances the overall composition.

Respond with a JSON object matching the schema.`;

      // Create the comprehensive payload
      const payload = {
        contents: {
          inlineData: {
            mimeType: "image/jpeg",
            data: uploadedImage.replace(/^data:image\/[a-z]+;base64,/, ""), // Remove data URL prefix
          },
          text: systemPrompt,
        },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                backgroundCss: {
                  type: "STRING",
                  description:
                    "A complex, multi-layered CSS background property using linear-gradient, radial-gradient, and conic-gradient",
                },
                backgroundName: {
                  type: "STRING",
                  description: "A creative name for this background style",
                },
                description: {
                  type: "STRING",
                  description: "A brief description of the visual style",
                },
                canvasRadius: {
                  type: "INTEGER",
                  description: "Canvas corner radius (0-64)",
                },
                frameBorderRadius: {
                  type: "INTEGER",
                  description: "Window frame corner radius (0-64)",
                },
                padding: {
                  type: "INTEGER",
                  description: "Canvas padding (16-128)",
                },
                shadow: {
                  type: "INTEGER",
                  description: "Frame shadow intensity (0-100)",
                },
                windowHeaderStyle: {
                  type: "STRING",
                  enum: ["dark", "light", "none"],
                  description: "Style of the macOS window header",
                },
                noise: {
                  type: "BOOLEAN",
                  description: "Apply a noise overlay",
                },
              },
              required: [
                "backgroundCss",
                "backgroundName",
                "description",
                "canvasRadius",
                "frameBorderRadius",
                "padding",
                "shadow",
                "windowHeaderStyle",
                "noise",
              ],
            },
          },
        },
      };

      const response = await fetch("/api/auto-style", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: AutoStyleResponse = await response.json();

      if (data.success && data.style) {
        // Create a new dynamic background entry
        const dynamicBackgroundKey = `ai-generated-${Date.now()}`;

        // Store the AI-generated CSS style
        setDynamicStyles((prev) => ({
          ...prev,
          [dynamicBackgroundKey]: data.style!.backgroundCss,
        }));

        // Update the selected background to use this new AI-generated style
        setSelectedBackground(dynamicBackgroundKey);

        // Apply additional AI-generated settings if provided
        if (data.style.canvasRadius !== undefined) {
          console.log(
            `🎨 AI: Applying canvas radius: ${data.style.canvasRadius}`
          );
          setCanvasCorners(data.style.canvasRadius);
        }
        if (data.style.frameBorderRadius !== undefined) {
          console.log(
            `🎨 AI: Applying frame border radius: ${data.style.frameBorderRadius}`
          );
          updateAdvancedSetting("frameCorners", data.style.frameBorderRadius);
        }
        if (data.style.padding !== undefined) {
          console.log(`🎨 AI: Applying padding: ${data.style.padding}`);
          setPadding(data.style.padding);
        }
        if (data.style.shadow !== undefined) {
          console.log(`🎨 AI: Applying shadow: ${data.style.shadow}`);
          updateAdvancedSetting("windowShadow", data.style.shadow);
        }
        if (data.style.windowHeaderStyle !== undefined) {
          console.log(
            `🎨 AI: Applying window header style: ${data.style.windowHeaderStyle}`
          );
          updateAdvancedSetting("windowHeader", data.style.windowHeaderStyle);
        }
        if (data.style.noise !== undefined) {
          console.log(`🎨 AI: Applying noise: ${data.style.noise}`);
          updateAdvancedSetting("backgroundNoise", data.style.noise);
        }

        // Log the complete AI response for debugging
        console.log("🎨 Complete AI Style Response:", data.style);

        toast({
          title: "🎨 AI Style Generated!",
          description: `Applied "${data.style.backgroundName}": ${data.style.description}`,
        });
      } else {
        toast({
          title: "Style Generation Failed",
          description:
            data.error || "Failed to generate AI style. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description:
          "Failed to connect to AI service. Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsAutoStyling(false);
    }
  }, [
    uploadedImage,
    selectedBackground,
    selectedShadow,
    padding,
    canvasCorners,
    advancedSettings,
    imageScale,
    imageHorizontalOffset,
    imageVerticalOffset,
    imageCornerRadius,
    textOverlays,
    magnifiers,
    setCanvasCorners,
    updateAdvancedSetting,
    setPadding,
    toast,
  ]);

  return {
    // state
    uploadedImage,
    selectedBackground,
    selectedShadow,
    textOverlays,
    magnifiers,
    advancedSettings,
    isDragging,
    isCropping,
    cropArea,
    fitToImage,
    canvasSize,
    canvasScale,
    aspectRatio,
    padding,
    canvasCorners,
    imageScale,
    imageHorizontalOffset,
    imageVerticalOffset,
    imageCornerRadius,
    screenshots,
    activeScreenshot,
    canAddMore,
    isAutoStyling,

    // refs
    fileInputRef,
    canvasRef,
    canvasContainerRef,

    // updaters
    setSelectedBackground,
    updateAdvancedSetting,
    setFitToImage,
    setCanvasSize,
    setCanvasScale: (s: number) => setCanvasScale(s),
    setAspectRatio: (r: string) => setAspectRatio(r),
    setPadding,
    setCanvasCorners,
    setImageScale,
    setImageHorizontalOffset,
    setImageVerticalOffset,
    setImageCornerRadius,
    setIsAutoStyling,

    // actions
    onDrop: handleDrop,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onFileSelect: handleFileSelect,

    onStartCrop: handleStartCrop,
    onApplyCrop: handleApplyCrop,
    onCancelCrop: handleCancelCrop,
    onCropChange: handleCropChange,
    onCropDoubleClick: handleCropDoubleClick,

    addMagnifier,
    addTextLayer,
    exportImage,
    autoStyleWithAI,

    addMoreScreenshots,
    switchToScreenshot,
    removeScreenshot,
    onResetImageControls: resetImageControls,

    // helpers
    getBackgroundStyle,
    getShadowStyle,
  };
}

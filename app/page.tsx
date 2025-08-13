"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { Canvas } from "@/components/canvas";
import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";
import type {
  TextOverlay,
  Magnifier,
  AdvancedSettings,
  Screenshot,
  CropArea,
} from "@/types";

export default function ShotlaEditor() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState("none");
  const [selectedShadow, setSelectedShadow] = useState("none");
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [magnifiers, setMagnifiers] = useState<Magnifier[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);

  const [isCropping, setIsCropping] = useState(false);
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
  const [canvasScale, setCanvasScale] = useState(100); // Added canvas scale state
  const [aspectRatio, setAspectRatio] = useState("Auto");
  const [padding, setPadding] = useState(64);
  const [canvasCorners, setCanvasCorners] = useState(8);

  const [imageScale, setImageScale] = useState(100);
  const [imageHorizontalOffset, setImageHorizontalOffset] = useState(0);
  const [imageVerticalOffset, setImageVerticalOffset] = useState(0);
  const [imageCornerRadius, setImageCornerRadius] = useState(0);

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

  const getBackgroundStyle = useCallback((background: string) => {
    const styles: Record<string, string> = {
      "abstract-teal": "bg-gradient-to-br from-teal-400 to-cyan-600",
      "abstract-orange": "bg-gradient-to-br from-orange-500 to-red-600",
      "alternative-white": "bg-white",
      "bermuda-red": "bg-gradient-to-br from-red-500 to-pink-600",
      "bermuda-green": "bg-gradient-to-br from-green-500 to-emerald-600",
      "bermuda-purple": "bg-gradient-to-br from-purple-600 to-pink-600",
      "soft-dawn": "bg-gradient-to-br from-rose-100 to-orange-100",
      "ocean-breeze": "bg-gradient-to-br from-blue-50 to-cyan-100",
      "forest-mist": "bg-gradient-to-br from-green-50 to-emerald-100",
      "lavender-dream": "bg-gradient-to-br from-purple-50 to-pink-100",
      "warm-sand": "bg-gradient-to-br from-amber-50 to-orange-100",
      "cool-gray": "bg-gradient-to-br from-gray-50 to-slate-100",
      "dark-spotlight":
        "bg-gradient-radial from-gray-800 via-gray-900 to-black",
      "purple-spotlight":
        "bg-gradient-radial from-purple-900 via-gray-900 to-black",
      "blue-spotlight":
        "bg-gradient-radial from-blue-900 via-gray-900 to-black",
      "green-spotlight":
        "bg-gradient-radial from-green-900 via-gray-900 to-black",
      "red-spotlight": "bg-gradient-radial from-red-900 via-gray-900 to-black",
      "amber-spotlight":
        "bg-gradient-radial from-amber-900 via-gray-900 to-black",
      "diagonal-lines": "bg-gradient-to-br from-blue-600 to-purple-600",
      "grid-pattern": "bg-gradient-to-br from-gray-600 to-gray-800",
      hexagon: "bg-gradient-to-br from-teal-600 to-blue-600",
      triangle: "bg-gradient-to-br from-orange-600 to-red-600",
      diamond: "bg-gradient-to-br from-purple-600 to-pink-600",
      chevron: "bg-gradient-to-br from-green-600 to-teal-600",
      "fluid-purple":
        "bg-gradient-to-br from-purple-400 via-pink-500 to-red-500",
      "ocean-wave": "bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-500",
      "sunset-blob":
        "bg-gradient-to-br from-orange-400 via-red-500 to-pink-500",
      "forest-flow":
        "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500",
      "aurora-mesh":
        "bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500",
      "cosmic-blob":
        "bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-500",
      "bubble-dream":
        "bg-gradient-radial from-blue-300 via-purple-400 to-pink-500",
      "soap-bubbles":
        "bg-gradient-radial from-cyan-200 via-blue-300 to-purple-400",
      "rainbow-bubbles":
        "bg-gradient-radial from-yellow-300 via-pink-400 to-purple-500",
      "ocean-bubbles":
        "bg-gradient-radial from-teal-300 via-blue-400 to-indigo-500",
      "sunset-bubbles":
        "bg-gradient-radial from-orange-300 via-red-400 to-purple-500",
      "mint-bubbles":
        "bg-gradient-radial from-green-300 via-teal-400 to-blue-500",
      "paper-texture": "bg-gray-100",
      "noise-pattern": "bg-gray-200",
      "fabric-weave": "bg-stone-200",
      concrete: "bg-slate-300",
      "wood-grain": "bg-amber-100",
      "metal-brush": "bg-zinc-300",
    };
    return styles[background] || "bg-gray-100";
  }, []);

  const getShadowStyle = useCallback((shadow: string) => {
    const styles: Record<string, string> = {
      none: "",
      subtle: "drop-shadow-sm",
      medium: "drop-shadow-lg",
      strong: "drop-shadow-2xl",
    };
    return styles[shadow] || "";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);

      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageData = e.target?.result as string;
            const newScreenshot: Screenshot = {
              id:
                Date.now().toString() + Math.random().toString(36).substr(2, 9),
              image: imageData,
              name: file.name,
              createdAt: new Date(),
            };

            setScreenshots((prev) => [...prev, newScreenshot]);

            // If this is the first screenshot or no active screenshot, make it active
            if (screenshots.length === 0 || !activeScreenshot) {
              setActiveScreenshot(newScreenshot.id);
              setUploadedImage(imageData);
              setOriginalImage(imageData);

              // Auto-fit image to canvas when uploaded
              if (fitToImage) {
                const img = new Image();
                img.onload = () => {
                  setCanvasSize({ width: img.width, height: img.height });
                };
                img.src = imageData;
              }
            }
          };
          reader.readAsDataURL(file);
        }
      });
    },
    [fitToImage, screenshots.length, activeScreenshot]
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
      const files = Array.from(e.target.files || []);

      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageData = e.target?.result as string;
            const newScreenshot: Screenshot = {
              id:
                Date.now().toString() + Math.random().toString(36).substr(2, 9),
              image: imageData,
              name: file.name,
              createdAt: new Date(),
            };

            setScreenshots((prev) => [...prev, newScreenshot]);

            // If this is the first screenshot or no active screenshot, make it active
            if (screenshots.length === 0 || !activeScreenshot) {
              setActiveScreenshot(newScreenshot.id);
              setUploadedImage(imageData);
              setOriginalImage(imageData);

              // Auto-fit image to canvas when uploaded
              if (fitToImage) {
                const img = new Image();
                img.onload = () => {
                  setCanvasSize({ width: img.width, height: img.height });
                };
                img.src = imageData;
              }
            }
          };
          reader.readAsDataURL(file);
        }
      });

      // Reset the input value to allow selecting the same file again
      if (e.target) {
        e.target.value = "";
      }
    },
    [fitToImage, screenshots.length, activeScreenshot]
  );

  const handleStartCrop = useCallback(() => {
    setIsCropping(true);
    setCropArea({ x: 20, y: 20, width: 200, height: 150 });
  }, []);

  const handleCropChange = useCallback((crop: CropArea) => {
    setCropArea(crop);
  }, []);

  const handleApplyCrop = useCallback(() => {
    if (!uploadedImage || !cropArea || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Calculate actual crop dimensions based on image size
      const scaleX = img.width / 300; // Assuming display width of 300px
      const scaleY = img.height / 200; // Assuming display height of 200px

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

      const croppedImageData = canvas.toDataURL();
      setUploadedImage(croppedImageData);
      setIsCropping(false);
      setCropArea(null);
    };
    img.src = uploadedImage;
  }, [uploadedImage, cropArea]);

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

  const exportImage = useCallback(() => {
    if (!uploadedImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Draw background
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    if (selectedBackground.includes("gradient")) {
      gradient.addColorStop(0, "#8B5CF6");
      gradient.addColorStop(1, "#EC4899");
    } else {
      gradient.addColorStop(0, "#FFFFFF");
      gradient.addColorStop(1, "#FFFFFF");
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const imgWidth = canvas.width - 2 * padding;
      const imgHeight = (img.height / img.width) * imgWidth;
      const x = padding;
      const y = (canvas.height - imgHeight) / 2;

      ctx.drawImage(img, x, y, imgWidth, imgHeight);

      // Export
      const link = document.createElement("a");
      link.download = "shotla-export.png";
      link.href = canvas.toDataURL();
      link.click();
    };
    img.src = uploadedImage;
  }, [selectedBackground, uploadedImage, fitToImage, canvasSize, padding]);

  const addMoreScreenshots = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.multiple = true;
      fileInputRef.current.click();
    }
  }, []);

  const switchToScreenshot = useCallback(
    (id: string) => {
      setActiveScreenshot(id);
      const screenshot = screenshots.find((s) => s.id === id);
      if (screenshot) {
        setUploadedImage(screenshot.image);
      }
    },
    [screenshots]
  );

  const removeScreenshot = useCallback(
    (id: string) => {
      setScreenshots((prev) => {
        const updated = prev.filter((s) => s.id !== id);

        // If we removed the active screenshot, switch to another one or clear
        if (activeScreenshot === id) {
          if (updated.length > 0) {
            const newActive = updated[0];
            setActiveScreenshot(newActive.id);
            setUploadedImage(newActive.image);
            setOriginalImage(newActive.image);
          } else {
            setActiveScreenshot(null);
            setUploadedImage(null);
            setOriginalImage(null);
          }
        }

        return updated;
      });
    },
    [activeScreenshot]
  );

  const handleCanvasScaleChange = useCallback((scale: number) => {
    setCanvasScale(scale);
    const baseWidth = 918;
    const baseHeight = 328;
    const scaleFactor = scale / 100;
    setCanvasSize({
      width: Math.round(baseWidth * scaleFactor),
      height: Math.round(baseHeight * scaleFactor),
    });
  }, []);

  const handleAspectRatioChange = useCallback(
    (ratio: string) => {
      setAspectRatio(ratio);

      if (ratio === "Auto") {
        // Keep current dimensions for Auto
        return;
      }

      // Calculate new dimensions based on aspect ratio
      const currentWidth = canvasSize.width;
      const newWidth = currentWidth;
      let newHeight = currentWidth;

      switch (ratio) {
        case "16:9":
          newHeight = Math.round(currentWidth * (9 / 16));
          break;
        case "4:3":
          newHeight = Math.round(currentWidth * (3 / 4));
          break;
        case "1:1":
          newHeight = currentWidth;
          break;
        case "9:16":
          newHeight = Math.round(currentWidth * (16 / 9));
          break;
      }

      setCanvasSize({ width: newWidth, height: newHeight });
    },
    [canvasSize.width]
  );

  return (
    <div className="h-screen bg-gray-950 flex flex-col font-sans">
      <div className="flex-1 flex overflow-hidden min-h-0">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-auto min-h-0">
            <Canvas
              uploadedImage={uploadedImage}
              selectedBackground={selectedBackground}
              selectedShadow={selectedShadow}
              textOverlays={textOverlays}
              magnifiers={magnifiers}
              advancedSettings={advancedSettings}
              isDragging={isDragging}
              isCropping={isCropping}
              cropArea={cropArea}
              fitToImage={fitToImage}
              canvasSize={canvasSize}
              padding={padding}
              canvasCorners={canvasCorners}
              imageScale={imageScale}
              imageHorizontalOffset={imageHorizontalOffset}
              imageVerticalOffset={imageVerticalOffset}
              imageCornerRadius={imageCornerRadius}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onFileSelect={handleFileSelect}
              onCropChange={handleCropChange}
              onCropDoubleClick={handleCropDoubleClick}
              fileInputRef={fileInputRef}
              getBackgroundStyle={getBackgroundStyle}
              getShadowStyle={getShadowStyle}
            />
          </div>

          <Footer
            screenshots={screenshots}
            activeScreenshot={activeScreenshot}
            onAddScreenshots={addMoreScreenshots}
            onSwitchScreenshot={switchToScreenshot}
            onRemoveScreenshot={removeScreenshot}
          />
        </div>

        <Sidebar
          uploadedImage={uploadedImage}
          selectedBackground={selectedBackground}
          setSelectedBackground={setSelectedBackground}
          advancedSettings={advancedSettings}
          updateAdvancedSetting={updateAdvancedSetting}
          isCropping={isCropping}
          onStartCrop={handleStartCrop}
          onApplyCrop={handleApplyCrop}
          onCancelCrop={handleCancelCrop}
          addMagnifier={addMagnifier}
          addTextLayer={addTextLayer}
          exportImage={exportImage}
          fitToImage={fitToImage}
          setFitToImage={setFitToImage}
          canvasSize={canvasSize}
          setCanvasSize={setCanvasSize}
          canvasScale={canvasScale}
          setCanvasScale={handleCanvasScaleChange}
          aspectRatio={aspectRatio}
          setAspectRatio={handleAspectRatioChange}
          padding={padding}
          setPadding={setPadding}
          canvasCorners={canvasCorners}
          setCanvasCorners={setCanvasCorners}
          imageScale={imageScale}
          setImageScale={setImageScale}
          imageHorizontalOffset={imageHorizontalOffset}
          setImageHorizontalOffset={setImageHorizontalOffset}
          imageVerticalOffset={imageVerticalOffset}
          setImageVerticalOffset={setImageVerticalOffset}
          imageCornerRadius={imageCornerRadius}
          setImageCornerRadius={setImageCornerRadius}
          onResetImageControls={resetImageControls}
        />
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

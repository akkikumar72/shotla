"use client"

import type React from "react"
import { Upload } from "lucide-react"
import { CropOverlay } from "./crop-overlay"
import type { TextOverlay, Magnifier, AdvancedSettings, CropArea } from "@/types"

interface CanvasProps {
  uploadedImage: string | null
  selectedBackground: string
  selectedShadow: string
  textOverlays: TextOverlay[]
  magnifiers: Magnifier[]
  advancedSettings: AdvancedSettings
  isDragging: boolean
  isCropping: boolean
  cropArea: CropArea | null
  fitToImage: boolean
  canvasSize: { width: number; height: number }
  padding: number // Added padding prop
  canvasCorners: number // Added canvas corners prop
  imageScale: number
  imageHorizontalOffset: number
  imageVerticalOffset: number
  imageCornerRadius: number
  onDrop: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCropChange: (crop: CropArea) => void
  onCropDoubleClick: () => void
  fileInputRef: React.RefObject<HTMLInputElement>
  getBackgroundStyle: (background: string) => string
  getShadowStyle: (shadow: string) => string
}

export const Canvas = ({
  uploadedImage,
  selectedBackground,
  textOverlays,
  magnifiers,
  advancedSettings,
  isDragging,
  isCropping,
  cropArea,
  fitToImage,
  canvasSize,
  padding, // Added padding prop
  canvasCorners, // Added canvas corners prop
  imageScale,
  imageHorizontalOffset,
  imageVerticalOffset,
  imageCornerRadius,
  onDrop,
  onDragOver,
  onDragLeave,
  onFileSelect,
  onCropChange,
  onCropDoubleClick,
  fileInputRef,
  getBackgroundStyle,
  getShadowStyle,
}: CanvasProps) => (
  <div className="w-full h-full flex items-center justify-center p-8">
    <div
      className="rounded-lg relative flex-shrink-0"
      style={{
        width: `${canvasSize.width}px`,
        height: `${canvasSize.height}px`,
        maxWidth: "calc(100vw - 400px)", // Account for sidebar width
        maxHeight: "calc(100vh - 200px)", // Account for header and footer
        borderRadius: `${canvasCorners}px`,
        background: `
          radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0),
          #1a1a1a
        `,
        backgroundSize: "20px 20px",
        filter: advancedSettings.backgroundNoise ? "contrast(1.1) brightness(0.95)" : "none",
        overflow: "hidden",
      }}
    >
      {!uploadedImage ? (
        <div
          className={`w-full h-full flex flex-col items-center justify-center border-2 border-dashed transition-all duration-200 cursor-pointer ${
            isDragging ? "border-white/40 bg-white/5" : "border-white/20 hover:border-white/30 hover:bg-white/5"
          }`}
          style={{
            borderRadius: `${canvasCorners}px`, // Applied canvas corners to upload area
            margin: `${padding}px`, // Applied padding to upload area
            width: `calc(100% - ${padding * 2}px)`,
            height: `calc(100% - ${padding * 2}px)`,
          }}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 text-white/60 mb-4" />
          <p className="text-white/80 text-lg font-medium">Click to upload or drag and drop screenshots</p>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileSelect} className="hidden" />
        </div>
      ) : (
        <div
          className={`rounded-lg flex items-center justify-center relative overflow-hidden ${getBackgroundStyle(selectedBackground)}`}
          style={{
            margin: `${padding}px`, // Applied padding around content
            width: `calc(100% - ${padding * 2}px)`,
            height: `calc(100% - ${padding * 2}px)`,
            borderRadius: `${Math.max(0, canvasCorners - padding)}px`, // Adjusted inner radius
          }}
        >
          {isCropping && (
            <div className="absolute inset-0 z-50">
              <CropOverlay
                imageElement={null}
                imageSrc={uploadedImage}
                onCropChange={onCropChange}
                onDoubleClick={onCropDoubleClick}
              />
            </div>
          )}

          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{
              transform: `scale(${advancedSettings.windowScale / 100}) translate(${advancedSettings.horizontalOffset}%, ${advancedSettings.verticalOffset}%)`,
            }}
          >
            <div
              className={`relative ${getShadowStyle("medium")}`}
              style={{
                borderRadius: `${advancedSettings.frameCorners}px`,
                border: advancedSettings.border
                  ? `${advancedSettings.borderWidth}px solid ${advancedSettings.borderColor}`
                  : "none",
                boxShadow: `0 ${advancedSettings.windowShadow}px ${advancedSettings.windowShadow * 2}px rgba(0,0,0,0.3)`,
              }}
            >
              {advancedSettings.windowHeader !== "none" && (
                <div
                  className={`h-8 flex items-center px-4 ${
                    advancedSettings.windowHeader === "dark" ? "bg-gray-800" : "bg-gray-100"
                  }`}
                  style={{
                    borderTopLeftRadius: `${advancedSettings.frameCorners}px`,
                    borderTopRightRadius: `${advancedSettings.frameCorners}px`,
                  }}
                >
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
              )}

              <div className="relative overflow-hidden">
                {!isCropping && (
                  <div
                    className="flex items-center justify-center"
                    style={{
                      transform: fitToImage
                        ? "none"
                        : `scale(${imageScale / 100}) translate(${imageHorizontalOffset}%, ${imageVerticalOffset}%)`,
                      transition: "transform 0.2s ease-out",
                    }}
                  >
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Uploaded screenshot"
                      className={fitToImage ? "w-full h-full object-contain" : "max-w-full max-h-full"}
                      style={{
                        borderRadius: fitToImage
                          ? advancedSettings.windowHeader !== "none"
                            ? `0 0 ${advancedSettings.frameCorners}px ${advancedSettings.frameCorners}px`
                            : `${advancedSettings.frameCorners}px`
                          : `${imageCornerRadius}px`,
                        transition: "all 0.2s ease-out",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {!isCropping &&
              textOverlays.map((overlay) => (
                <div
                  key={overlay.id}
                  className={`absolute text-${overlay.color} font-bold drop-shadow-lg ${
                    overlay.size === "small" ? "text-sm" : overlay.size === "large" ? "text-2xl" : "text-lg"
                  } ${
                    overlay.position === "top"
                      ? "top-4"
                      : overlay.position === "bottom"
                        ? "bottom-4"
                        : "top-1/2 -translate-y-1/2"
                  } ${
                    overlay.position.includes("left")
                      ? "left-4"
                      : overlay.position.includes("right")
                        ? "right-4"
                        : "left-1/2 -translate-x-1/2"
                  }`}
                >
                  {overlay.text}
                </div>
              ))}

            {!isCropping &&
              magnifiers.map((magnifier) => (
                <div
                  key={magnifier.id}
                  className={`absolute border-4 ${
                    magnifier.color === "blue"
                      ? "border-blue-500"
                      : magnifier.color === "red"
                        ? "border-red-500"
                        : magnifier.color === "green"
                          ? "border-green-500"
                          : "border-yellow-500"
                  } ${magnifier.shape === "circle" ? "rounded-full" : "rounded-lg"} ${
                    magnifier.style === "filled" ? "bg-white/20" : magnifier.style === "dashed" ? "border-dashed" : ""
                  } ${magnifier.size === "small" ? "w-16 h-16" : magnifier.size === "large" ? "w-32 h-32" : "w-24 h-24"} ${
                    magnifier.position === "top-left"
                      ? "top-4 left-4"
                      : magnifier.position === "top-right"
                        ? "top-4 right-4"
                        : magnifier.position === "bottom-left"
                          ? "bottom-4 left-4"
                          : magnifier.position === "bottom-right"
                            ? "bottom-4 right-4"
                            : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  }`}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  </div>
)

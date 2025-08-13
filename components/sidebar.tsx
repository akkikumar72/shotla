"use client"

import { Header } from "./header"
import { CropControls } from "./crop-controls"
import { BackgroundThemeSelector } from "./background-theme-selector"
import { WindowControls } from "./window-controls"
import { BorderControls } from "./border-controls"
import { CanvasControls } from "./canvas-controls"
import { EnhancementControls } from "./enhancement-controls"
import { ExportControls } from "./export-controls"
import { CustomToggle } from "./ui/custom-toggle"
import { Button } from "@/components/ui/button"
import type { AdvancedSettings } from "@/types"

interface SidebarProps {
  uploadedImage: string | null
  selectedBackground: string
  setSelectedBackground: (background: string) => void
  advancedSettings: AdvancedSettings
  updateAdvancedSetting: (key: keyof AdvancedSettings, value: any) => void
  isCropping: boolean
  onStartCrop: () => void
  onApplyCrop: () => void
  onCancelCrop: () => void
  addMagnifier: () => void
  addTextLayer: () => void
  exportImage: () => void
  fitToImage: boolean
  setFitToImage: (value: boolean) => void
  canvasSize: { width: number; height: number }
  setCanvasSize: (size: { width: number; height: number }) => void
  canvasScale: number // Added canvas scale prop
  setCanvasScale: (scale: number) => void // Added canvas scale setter prop
  aspectRatio: string
  setAspectRatio: (ratio: string) => void
  padding: number
  setPadding: (value: number) => void
  canvasCorners: number
  setCanvasCorners: (value: number) => void
  imageScale: number
  setImageScale: (value: number) => void
  imageHorizontalOffset: number
  setImageHorizontalOffset: (value: number) => void
  imageVerticalOffset: number
  setImageVerticalOffset: (value: number) => void
  imageCornerRadius: number
  setImageCornerRadius: (value: number) => void
  onResetImageControls: () => void
}

export const Sidebar = ({
  uploadedImage,
  selectedBackground,
  setSelectedBackground,
  advancedSettings,
  updateAdvancedSetting,
  isCropping,
  onStartCrop,
  onApplyCrop,
  onCancelCrop,
  addMagnifier,
  addTextLayer,
  exportImage,
  fitToImage,
  setFitToImage,
  canvasSize,
  setCanvasSize,
  canvasScale, // Added canvas scale prop
  setCanvasScale, // Added canvas scale setter prop
  aspectRatio,
  setAspectRatio,
  padding,
  setPadding,
  canvasCorners,
  setCanvasCorners,
  imageScale,
  setImageScale,
  imageHorizontalOffset,
  setImageHorizontalOffset,
  imageVerticalOffset,
  setImageVerticalOffset,
  imageCornerRadius,
  setImageCornerRadius,
  onResetImageControls,
}: SidebarProps) => (
  <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col h-full">
    <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
      <Header />

      <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
        <Button className="flex-1 bg-gray-700 text-white text-sm py-2">Editor</Button>
        <Button variant="ghost" className="flex-1 text-gray-400 text-sm py-2">
          Advertising
        </Button>
      </div>

      <Button className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-medium">
        ✨ Auto-Style with AI
      </Button>

      <CropControls
        hasImage={!!uploadedImage}
        isCropping={isCropping}
        onStartCrop={onStartCrop}
        onApplyCrop={onApplyCrop}
        onCancelCrop={onCancelCrop}
      />

      <CanvasControls
        fitToImage={fitToImage}
        setFitToImage={setFitToImage}
        canvasSize={canvasSize}
        setCanvasSize={setCanvasSize}
        canvasScale={canvasScale} // Added canvas scale prop
        setCanvasScale={setCanvasScale} // Added canvas scale setter prop
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
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
        onResetImageControls={onResetImageControls}
      />

      <CustomToggle
        label="Background Noise"
        checked={advancedSettings.backgroundNoise}
        onChange={(checked) => updateAdvancedSetting("backgroundNoise", checked)}
      />

      <WindowControls advancedSettings={advancedSettings} updateAdvancedSetting={updateAdvancedSetting} />

      <BorderControls advancedSettings={advancedSettings} updateAdvancedSetting={updateAdvancedSetting} />

      <BackgroundThemeSelector selectedBackground={selectedBackground} setSelectedBackground={setSelectedBackground} />

      <EnhancementControls addMagnifier={addMagnifier} addTextLayer={addTextLayer} />

      <ExportControls exportImage={exportImage} />
    </div>
  </div>
)

"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CustomToggle } from "./ui/custom-toggle"
import { CustomSlider } from "./ui/custom-slider"
import { RotateCcw } from "lucide-react"

interface CanvasControlsProps {
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

export const CanvasControls = ({
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
}: CanvasControlsProps) => (
  <div>
    <Label className="text-sm font-medium text-gray-300 mb-3 block">Canvas</Label>
    <div className="space-y-4">
      <CustomToggle label="Fit to Image" checked={fitToImage} onChange={setFitToImage} />

      {!fitToImage && (
        <div className="space-y-4">
          <CustomSlider label="Image Scale" value={imageScale} onChange={setImageScale} min={10} max={200} unit="%" />

          <CustomSlider
            label="Horizontal Offset"
            value={imageHorizontalOffset}
            onChange={setImageHorizontalOffset}
            min={-100}
            max={100}
            unit="px"
          />

          <CustomSlider
            label="Vertical Offset"
            value={imageVerticalOffset}
            onChange={setImageVerticalOffset}
            min={-100}
            max={100}
            unit="px"
          />

          <CustomSlider
            label="Corner Radius"
            value={imageCornerRadius}
            onChange={setImageCornerRadius}
            max={50}
            unit="px"
          />

          <Button
            onClick={onResetImageControls}
            styleType="ghost"
            size="sm"
            className="w-full flex items-center justify-center gap-2 px-3 py-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      )}

      <div className={fitToImage ? "opacity-50 pointer-events-none" : ""}>
        <Label className="text-xs text-gray-500 mb-2 block">Canvas Size</Label>
        <div className="flex space-x-2">
          <Input
            placeholder="W 918"
            value={canvasSize.width}
            onChange={(e) => setCanvasSize({ ...canvasSize, width: Number.parseInt(e.target.value) || 0 })}
            className="bg-gray-800 border-gray-700 text-gray-300 text-sm"
            disabled={fitToImage}
          />
          <Input
            placeholder="H 328"
            value={canvasSize.height}
            onChange={(e) => setCanvasSize({ ...canvasSize, height: Number.parseInt(e.target.value) || 0 })}
            className="bg-gray-800 border-gray-700 text-gray-300 text-sm"
            disabled={fitToImage}
          />
        </div>
      </div>

      <div className={fitToImage ? "opacity-50 pointer-events-none" : ""}>
        <CustomSlider
          label="Scale"
          value={canvasScale}
          onChange={setCanvasScale}
          min={25}
          max={300}
          unit="%"
          displayValue={`${canvasSize.width}px width`}
        />
      </div>

      <div>
        <Label className="text-xs text-gray-500 mb-2 block">Aspect Ratio</Label>
        <div className="flex space-x-2 text-xs">
          {["Auto", "16:9", "4:3", "1:1", "9:16"].map((ratio) => (
            <Button
              key={ratio}
              styleType={aspectRatio === ratio ? "secondary" : "ghost"}
              size="sm"
              className="px-2 py-1 h-auto text-xs"
              onClick={() => setAspectRatio(ratio)}
            >
              {ratio}
            </Button>
          ))}
        </div>
      </div>

      <CustomSlider label="Padding" value={padding} onChange={setPadding} max={200} unit="px" />
      <CustomSlider label="Canvas Corners" value={canvasCorners} onChange={setCanvasCorners} max={50} unit="px" />
    </div>
  </div>
)

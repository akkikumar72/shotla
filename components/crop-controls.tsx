"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Check, X, Crop } from "lucide-react"

interface CropControlsProps {
  hasImage: boolean
  isCropping: boolean
  onStartCrop: () => void
  onApplyCrop: () => void
  onCancelCrop: () => void
}

export const CropControls = ({ hasImage, isCropping, onStartCrop, onApplyCrop, onCancelCrop }: CropControlsProps) => (
  <div>
    <Label className="text-sm font-medium text-gray-300 mb-3 block">Image Crop</Label>

    {!isCropping ? (
      <Button
        styleType="ghost"
        className="w-full flex items-center justify-center gap-2 px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onStartCrop}
        disabled={!hasImage}
      >
        <Crop className="w-4 h-4" />
        Crop
      </Button>
    ) : (
      <div className="space-y-2">
        <p className="text-xs text-gray-400 mb-3">
          Drag the crop area and resize using the corner handles. Double-click to apply.
        </p>

        <Button 
          styleType="success"
          className="w-full flex items-center justify-center gap-2 px-4 py-3" 
          onClick={onApplyCrop}
        >
          <Check className="w-4 h-4" />
          Apply
        </Button>

        <Button
          styleType="ghost"
          className="w-full flex items-center justify-center gap-2 px-4 py-3"
          onClick={onCancelCrop}
        >
          <X className="w-4 h-4" />
          Cancel
        </Button>
      </div>
    )}
  </div>
)

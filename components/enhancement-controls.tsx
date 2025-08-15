"use client"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Type } from "lucide-react"

interface EnhancementControlsProps {
  addMagnifier: () => void
  addTextLayer: () => void
}

export const EnhancementControls = ({ addMagnifier, addTextLayer }: EnhancementControlsProps) => (
  <>
    <div>
      <Label className="text-sm font-medium text-gray-300 mb-3 block">Enhancements</Label>
      <Button
        onClick={addMagnifier}
        styleType="ghost"
        className="w-full flex items-center justify-center gap-2 px-4 py-3"
      >
        <Plus className="w-4 h-4" />
        Add Magnifier
      </Button>
    </div>

    <div>
      <Label className="text-sm font-medium text-gray-300 mb-3 block">Text Layers</Label>
      <Button
        onClick={addTextLayer}
        styleType="ghost"
        className="w-full flex items-center justify-center gap-2 px-4 py-3"
      >
        <Type className="w-4 h-4" />
        Add Text Layer
      </Button>
    </div>
  </>
)

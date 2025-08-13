"use client"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

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
        variant="outline"
        className="w-full text-gray-300 border-gray-700 hover:bg-gray-800 bg-transparent"
      >
        Add Magnifier
      </Button>
    </div>

    <div>
      <Label className="text-sm font-medium text-gray-300 mb-3 block">Text Layers</Label>
      <Button
        onClick={addTextLayer}
        variant="outline"
        className="w-full text-gray-300 border-gray-700 hover:bg-gray-800 bg-transparent"
      >
        Add Text Layer
      </Button>
    </div>
  </>
)

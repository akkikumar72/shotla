"use client"

import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import type { Screenshot } from "@/types"
import { useState } from "react"

interface FooterProps {
  screenshots: Screenshot[]
  activeScreenshot: string | null
  onAddScreenshots: () => void
  onSwitchScreenshot: (id: string) => void
  onRemoveScreenshot: (id: string) => void
}

export const Footer = ({
  screenshots,
  activeScreenshot,
  onAddScreenshots,
  onSwitchScreenshot,
  onRemoveScreenshot,
}: FooterProps) => {
  const [hoveredScreenshot, setHoveredScreenshot] = useState<string | null>(null)

  return (
    <div className="h-24 bg-gray-900 border-t border-gray-800 flex items-center px-8">
      <div className="flex items-center space-x-4">
        <Button
          onClick={onAddScreenshots}
          variant="outline"
          size="sm"
          className="h-16 w-16 border-2 border-dashed border-gray-600 hover:border-gray-500 bg-transparent text-gray-400 hover:text-gray-300"
        >
          <Plus className="w-6 h-6" />
        </Button>

        {screenshots.map((screenshot, index) => (
          <div
            key={screenshot.id}
            className={`relative h-16 w-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
              activeScreenshot === screenshot.id ? "border-blue-500" : "border-gray-600 hover:border-gray-500"
            }`}
            onClick={() => onSwitchScreenshot(screenshot.id)}
            onMouseEnter={() => setHoveredScreenshot(screenshot.id)}
            onMouseLeave={() => setHoveredScreenshot(null)}
          >
            <img
              src={screenshot.image || "/placeholder.svg"}
              alt={`Screenshot ${index + 1}`}
              className="w-full h-full object-cover"
            />

            {hoveredScreenshot === screenshot.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveScreenshot(screenshot.id)
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors z-10"
              >
                <X className="w-3 h-3" />
              </button>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-1 py-0.5 truncate">
              Screenshot {index + 1}
            </div>
          </div>
        ))}
      </div>

      {screenshots.length > 0 && (
        <div className="ml-auto text-sm text-gray-400">
          {screenshots.length} screenshot{screenshots.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Upload, Download } from "lucide-react"

interface ExportControlsProps {
  exportImage: () => void
}

export const ExportControls = ({ exportImage }: ExportControlsProps) => (
  <div className="pt-4 border-t border-gray-800 space-y-3">
    <Button 
      styleType="primary"
      className="w-full flex items-center justify-center gap-2 px-4 py-3"
    >
      <Upload className="w-4 h-4" />
      Host on Picstatic
    </Button>
    <Button 
      onClick={exportImage} 
      styleType="secondary"
      className="w-full flex items-center justify-center gap-2 px-4 py-3"
    >
      <Download className="w-4 h-4" />
      Export Image
    </Button>
  </div>
)

"use client"

import { Button } from "@/components/ui/button"
import { Upload, Download } from "lucide-react"

interface ExportControlsProps {
  exportImage: () => void
}

export const ExportControls = ({ exportImage }: ExportControlsProps) => (
  <div className="pt-4 border-t border-gray-800 space-y-3">
    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium">
      <Upload className="w-4 h-4 mr-2" />
      Host on Picstatic
    </Button>
    <Button onClick={exportImage} className="w-full bg-white text-black hover:bg-gray-100 font-medium">
      <Download className="w-4 h-4 mr-2" />
      Export Image
    </Button>
  </div>
)

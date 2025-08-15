"use client";

import { ProfessionalButton } from "@/components/ui/professional-button";
import { Upload, Download } from "lucide-react";

interface ExportControlsProps {
  exportImage: () => void;
}

export const ExportControls = ({ exportImage }: ExportControlsProps) => (
  <div className="pt-4 border-t border-gray-800 space-y-3">
    <ProfessionalButton
      variant="primary"
      size="md"
      className="w-full"
      leftIcon={<Upload className="w-4 h-4" />}
    >
      Host on Picstatic
    </ProfessionalButton>
    <ProfessionalButton
      variant="secondary"
      size="md"
      className="w-full"
      onClick={exportImage}
      leftIcon={<Download className="w-4 h-4" />}
    >
      Export Image
    </ProfessionalButton>
  </div>
);

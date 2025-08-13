"use client"

import { Label } from "@/components/ui/label"
import { CustomToggle } from "./ui/custom-toggle"
import { CustomSlider } from "./ui/custom-slider"
import type { AdvancedSettings } from "@/types"

interface BorderControlsProps {
  advancedSettings: AdvancedSettings
  updateAdvancedSetting: (key: keyof AdvancedSettings, value: any) => void
}

export const BorderControls = ({ advancedSettings, updateAdvancedSetting }: BorderControlsProps) => (
  <div>
    <CustomToggle
      label="Border"
      checked={advancedSettings.border}
      onChange={(checked) => updateAdvancedSetting("border", checked)}
    />

    {advancedSettings.border && (
      <div className="mt-4 space-y-4">
        <CustomSlider
          label="Border Width"
          value={advancedSettings.borderWidth}
          onChange={(value) => updateAdvancedSetting("borderWidth", value)}
          min={1}
          max={20}
          unit="px"
        />

        <div>
          <Label className="text-sm text-gray-300 mb-2 block">Border Color</Label>
          <div className="flex items-center space-x-3">
            <div
              className="w-8 h-8 rounded border-2 border-gray-600 cursor-pointer"
              style={{ backgroundColor: advancedSettings.borderColor }}
              onClick={() => {
                const input = document.createElement("input")
                input.type = "color"
                input.value = advancedSettings.borderColor
                input.onchange = (e) => updateAdvancedSetting("borderColor", (e.target as HTMLInputElement).value)
                input.click()
              }}
            />
            <span className="text-sm text-gray-400 font-mono">{advancedSettings.borderColor}</span>
          </div>
        </div>
      </div>
    )}
  </div>
)

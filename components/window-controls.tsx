"use client"

import { Label } from "@/components/ui/label"
import { CustomSlider } from "./ui/custom-slider"
import { ButtonGroup } from "./ui/button-group"
import type { AdvancedSettings } from "@/types"

interface WindowControlsProps {
  advancedSettings: AdvancedSettings
  updateAdvancedSetting: (key: keyof AdvancedSettings, value: any) => void
}

export const WindowControls = ({ advancedSettings, updateAdvancedSetting }: WindowControlsProps) => (
  <div>
    <Label className="text-sm font-medium text-gray-300 mb-3 block">Window</Label>
    <div className="space-y-4">
      <CustomSlider
        label="Shadow"
        value={advancedSettings.windowShadow}
        onChange={(value) => updateAdvancedSetting("windowShadow", value)}
        max={100}
      />

      <div>
        <Label className="text-sm text-gray-300 mb-2 block">Window Header</Label>
        <ButtonGroup
          options={[
            { label: "Dark", value: "dark" },
            { label: "Light", value: "light" },
            { label: "None", value: "none" },
          ]}
          value={advancedSettings.windowHeader}
          onChange={(value) => updateAdvancedSetting("windowHeader", value as "dark" | "light" | "none")}
        />
      </div>

      <CustomSlider
        label="Frame Corners"
        value={advancedSettings.frameCorners}
        onChange={(value) => updateAdvancedSetting("frameCorners", value)}
        max={50}
        unit="px"
      />

      <CustomSlider
        label="Window Scale"
        value={advancedSettings.windowScale}
        onChange={(value) => updateAdvancedSetting("windowScale", value)}
        min={50}
        max={150}
        unit="%"
      />

      <CustomSlider
        label="Horizontal Offset"
        value={advancedSettings.horizontalOffset}
        onChange={(value) => updateAdvancedSetting("horizontalOffset", value)}
        min={-50}
        max={50}
        unit="%"
      />

      <CustomSlider
        label="Vertical Offset"
        value={advancedSettings.verticalOffset}
        onChange={(value) => updateAdvancedSetting("verticalOffset", value)}
        min={-50}
        max={50}
        unit="%"
      />
    </div>
  </div>
)

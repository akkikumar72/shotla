"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface CustomSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
  showValue?: boolean
  displayValue?: string // Added displayValue prop to override default value display
}

export const CustomSlider = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
  showValue = true,
  displayValue, // Added displayValue prop
}: CustomSliderProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <Label className="text-sm text-gray-300">{label}</Label>
      {showValue && (
        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">{displayValue || `${value}${unit}`}</span>
      )}
    </div>
    <Slider
      value={[value]}
      onValueChange={(values) => onChange(values[0])}
      min={min}
      max={max}
      step={step}
      className="w-full"
    />
  </div>
)

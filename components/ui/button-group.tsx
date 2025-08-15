"use client"

import { Button } from "@/components/ui/button"

interface ButtonGroupProps {
  options: Array<{ label: string; value: string }>
  value: string
  onChange: (value: string) => void
}

export const ButtonGroup = ({ options, value, onChange }: ButtonGroupProps) => (
  <div className="flex rounded-lg bg-gray-800 p-1 gap-1">
    {options.map((option) => (
      <Button
        key={option.value}
        styleType={value === option.value ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onChange(option.value)}
        className="flex-1 text-xs px-2 py-1"
      >
        {option.label}
      </Button>
    ))}
  </div>
)

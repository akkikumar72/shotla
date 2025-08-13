"use client"

import { Button } from "@/components/ui/button"

interface ButtonGroupProps {
  options: Array<{ label: string; value: string }>
  value: string
  onChange: (value: string) => void
}

export const ButtonGroup = ({ options, value, onChange }: ButtonGroupProps) => (
  <div className="flex rounded-lg bg-gray-800 p-1">
    {options.map((option) => (
      <Button
        key={option.value}
        variant={value === option.value ? "default" : "ghost"}
        size="sm"
        onClick={() => onChange(option.value)}
        className={`flex-1 text-xs ${
          value === option.value ? "bg-gray-700 text-white" : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
        }`}
      >
        {option.label}
      </Button>
    ))}
  </div>
)

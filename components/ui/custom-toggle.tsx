import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface CustomToggleProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export const CustomToggle = ({ label, checked, onChange }: CustomToggleProps) => (
  <div className="flex items-center justify-between">
    <Label className="text-sm text-gray-300">{label}</Label>
    <Switch checked={checked} onCheckedChange={onChange} className="data-[state=checked]:bg-blue-600" />
  </div>
)

import { Button } from "@/components/ui/button"
import { Sun } from "lucide-react"

export const Header = () => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-2">
      <div className="w-6 h-6 bg-white rounded border-2 border-gray-700 flex items-center justify-center">
        <div className="w-3 h-3 bg-gray-900 rounded-sm"></div>
      </div>
      <span className="text-white font-semibold font-outfit">Shotva</span>
    </div>
    {/* <Button variant="ghost" size="sm" className="text-gray-400">
      <Sun className="w-5 h-5" />
    </Button> */}
  </div>
)

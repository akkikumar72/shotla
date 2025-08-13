export interface TextOverlay {
  id: string
  text: string
  position: string
  size: string
  color: string
}

export interface Magnifier {
  id: string
  shape: string
  style: string
  position: string
  size: string
  color: string
}

export interface AdvancedSettings {
  backgroundNoise: boolean
  windowShadow: number
  windowHeader: "dark" | "light" | "none"
  frameCorners: number
  windowScale: number
  horizontalOffset: number
  verticalOffset: number
  border: boolean
  borderWidth: number
  borderColor: string
}

export interface Screenshot {
  id: string
  image: string
  name: string
}

export interface CropArea {
  unit: "%" | "px"
  x: number
  y: number
  width: number
  height: number
}

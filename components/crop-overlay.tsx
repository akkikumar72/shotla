"use client"
import { useRef, useCallback, useState } from "react"
import ReactCrop, { type Crop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import type { CropArea } from "@/types"

interface CropOverlayProps {
  imageElement: HTMLImageElement | null
  imageSrc: string
  onCropChange: (crop: CropArea) => void
  onDoubleClick: () => void
}

export const CropOverlay = ({ imageSrc, onCropChange, onDoubleClick }: CropOverlayProps) => {
  const imgRef = useRef<HTMLImageElement>(null)

  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  })

  const onCropChangeHandler = useCallback(
    (crop: Crop) => {
      setCrop(crop)
      onCropChange({
        unit: crop.unit,
        x: crop.x,
        y: crop.y,
        width: crop.width,
        height: crop.height,
      })
    },
    [onCropChange],
  )

  return (
    <div className="w-full h-full">
      <ReactCrop
        crop={crop}
        onChange={onCropChangeHandler}
        onDoubleClick={onDoubleClick}
        aspect={undefined}
        minWidth={50}
        minHeight={50}
        className="w-full h-full"
        style={{ width: "100%", height: "100%" }}
      >
        <img
          ref={imgRef}
          src={imageSrc || "/placeholder.svg"}
          alt="Crop preview"
          className="w-full h-full object-contain"
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "none",
            maxHeight: "none",
          }}
        />
      </ReactCrop>
    </div>
  )
}

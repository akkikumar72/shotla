"use client";
import { useRef, useCallback, useState, useEffect } from "react";
import ReactCrop, {
  type Crop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import type { CropArea } from "@/types";

interface CropOverlayProps {
  imageElement: HTMLImageElement | null;
  imageSrc: string;
  onCropChange: (crop: CropArea) => void;
  onDoubleClick: () => void;
}

export const CropOverlay = ({
  imageSrc,
  onCropChange,
  onDoubleClick,
}: CropOverlayProps) => {
  const imgRef = useRef<HTMLImageElement>(null);

  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });

  const [completedCrop, setCompletedCrop] = useState<Crop>();

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { naturalWidth: width, naturalHeight: height } = e.currentTarget;

      // Create a centered crop
      const crop = centerCrop(
        makeAspectCrop(
          {
            unit: "%",
            width: 50,
          },
          1, // 1:1 aspect ratio (square)
          width,
          height
        ),
        width,
        height
      );

      setCrop(crop);
      setCompletedCrop(crop);
    },
    []
  );

  const onCropChangeHandler = useCallback((crop: Crop, percentCrop: Crop) => {
    setCrop(percentCrop);
  }, []);

  const onCropComplete = useCallback(
    (crop: Crop, percentCrop: Crop) => {
      setCompletedCrop(percentCrop);
      // Convert to our CropArea type and notify parent
      onCropChange({
        unit: percentCrop.unit as "%" | "px",
        x: percentCrop.x,
        y: percentCrop.y,
        width: percentCrop.width,
        height: percentCrop.height,
      });
    },
    [onCropChange]
  );

  return (
    <div
      className="w-full h-full relative"
      onDoubleClick={onDoubleClick}
      style={{
        background: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="max-w-full max-h-full">
        <ReactCrop
          crop={crop}
          onChange={onCropChangeHandler}
          onComplete={onCropComplete}
          aspect={undefined} // Allow free-form cropping
          minWidth={50}
          minHeight={50}
          keepSelection={true}
          className="max-w-full max-h-full"
        >
          <img
            ref={imgRef}
            src={imageSrc || "/placeholder.svg"}
            alt="Crop preview"
            onLoad={onImageLoad}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </ReactCrop>
      </div>
    </div>
  );
};

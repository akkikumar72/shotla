"use client";

import type React from "react";
import { Canvas } from "@/components/canvas";
import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";
import { useShotlaEditor } from "@/hooks/use-shotla-editor";

export default function ShotlaEditor() {
  const editor = useShotlaEditor();

  return (
    <div className="h-screen bg-gray-950 flex flex-col font-sans">
      <div className="flex-1 flex overflow-hidden min-h-0">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-auto min-h-0">
            <Canvas
              uploadedImage={editor.uploadedImage}
              selectedBackground={editor.selectedBackground}
              selectedShadow={editor.selectedShadow}
              textOverlays={editor.textOverlays}
              magnifiers={editor.magnifiers}
              advancedSettings={editor.advancedSettings}
              isDragging={editor.isDragging}
              isCropping={editor.isCropping}
              cropArea={editor.cropArea}
              fitToImage={editor.fitToImage}
              canvasSize={editor.canvasSize}
              padding={editor.padding}
              canvasCorners={editor.canvasCorners}
              imageScale={editor.imageScale}
              imageHorizontalOffset={editor.imageHorizontalOffset}
              imageVerticalOffset={editor.imageVerticalOffset}
              imageCornerRadius={editor.imageCornerRadius}
              onDrop={editor.onDrop}
              onDragOver={editor.onDragOver}
              onDragLeave={editor.onDragLeave}
              onFileSelect={editor.onFileSelect}
              onCropChange={editor.onCropChange}
              onCropDoubleClick={editor.onCropDoubleClick}
              fileInputRef={editor.fileInputRef}
              getBackgroundStyle={editor.getBackgroundStyle}
              getShadowStyle={editor.getShadowStyle}
            />
          </div>

          <Footer
            screenshots={editor.screenshots}
            activeScreenshot={editor.activeScreenshot}
            onAddScreenshots={editor.addMoreScreenshots}
            onSwitchScreenshot={editor.switchToScreenshot}
            onRemoveScreenshot={editor.removeScreenshot}
          />
        </div>

        <Sidebar
          uploadedImage={editor.uploadedImage}
          selectedBackground={editor.selectedBackground}
          setSelectedBackground={editor.setSelectedBackground}
          advancedSettings={editor.advancedSettings}
          updateAdvancedSetting={editor.updateAdvancedSetting}
          isCropping={editor.isCropping}
          onStartCrop={editor.onStartCrop}
          onApplyCrop={editor.onApplyCrop}
          onCancelCrop={editor.onCancelCrop}
          addMagnifier={editor.addMagnifier}
          addTextLayer={editor.addTextLayer}
          exportImage={editor.exportImage}
          fitToImage={editor.fitToImage}
          setFitToImage={editor.setFitToImage}
          canvasSize={editor.canvasSize}
          setCanvasSize={editor.setCanvasSize}
          canvasScale={editor.canvasScale}
          setCanvasScale={editor.setCanvasScale}
          aspectRatio={editor.aspectRatio}
          setAspectRatio={editor.setAspectRatio}
          padding={editor.padding}
          setPadding={editor.setPadding}
          canvasCorners={editor.canvasCorners}
          setCanvasCorners={editor.setCanvasCorners}
          imageScale={editor.imageScale}
          setImageScale={editor.setImageScale}
          imageHorizontalOffset={editor.imageHorizontalOffset}
          setImageHorizontalOffset={editor.setImageHorizontalOffset}
          imageVerticalOffset={editor.imageVerticalOffset}
          setImageVerticalOffset={editor.setImageVerticalOffset}
          imageCornerRadius={editor.imageCornerRadius}
          setImageCornerRadius={editor.setImageCornerRadius}
          onResetImageControls={editor.onResetImageControls}
        />
      </div>

      <canvas ref={editor.canvasRef} className="hidden" />
    </div>
  );
}

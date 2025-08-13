"use client"

import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { backgroundThemes } from "@/constants/backgrounds"

interface BackgroundThemeSelectorProps {
  selectedBackground: string
  setSelectedBackground: (background: string) => void
}

export const BackgroundThemeSelector = ({
  selectedBackground,
  setSelectedBackground,
}: BackgroundThemeSelectorProps) => {
  const [collapsedSections, setCollapsedSections] = useState({
    shapePatterns: false,
    minimalGradients: true,
    spotlightDark: true,
    geometricPatterns: true,
    meshBlobs: true,
    abstractBubbles: true,
    textures: true,
  })

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div>
      <Label className="text-sm font-medium text-gray-300 mb-3 block">Background Theme</Label>
      <div className="space-y-2">
        {/* Shape Patterns */}
        <Collapsible open={!collapsedSections.shapePatterns} onOpenChange={() => toggleSection("shapePatterns")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left text-sm text-gray-300 hover:text-white">
            <span>Shape Patterns</span>
            {collapsedSections.shapePatterns ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="grid grid-cols-3 gap-2">
              {backgroundThemes.shapePatterns.map((pattern) => (
                <button
                  key={pattern.value}
                  onClick={() => setSelectedBackground(pattern.value)}
                  className={`aspect-square rounded-lg border-2 ${pattern.preview} ${
                    selectedBackground === pattern.value ? "border-blue-500" : "border-gray-700 hover:border-gray-600"
                  }`}
                  title={pattern.name}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Minimal Gradients */}
        <Collapsible open={!collapsedSections.minimalGradients} onOpenChange={() => toggleSection("minimalGradients")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left text-sm text-gray-300 hover:text-white">
            <span>Minimal Gradients</span>
            {collapsedSections.minimalGradients ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="grid grid-cols-3 gap-2">
              {backgroundThemes.minimalGradients.map((pattern) => (
                <button
                  key={pattern.value}
                  onClick={() => setSelectedBackground(pattern.value)}
                  className={`aspect-square rounded-lg border-2 ${pattern.preview} ${
                    selectedBackground === pattern.value ? "border-blue-500" : "border-gray-700 hover:border-gray-600"
                  }`}
                  title={pattern.name}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Spotlight & Dark */}
        <Collapsible open={!collapsedSections.spotlightDark} onOpenChange={() => toggleSection("spotlightDark")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left text-sm text-gray-300 hover:text-white">
            <span>Spotlight & Dark</span>
            {collapsedSections.spotlightDark ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="grid grid-cols-3 gap-2">
              {backgroundThemes.spotlightDark.map((pattern) => (
                <button
                  key={pattern.value}
                  onClick={() => setSelectedBackground(pattern.value)}
                  className={`aspect-square rounded-lg border-2 ${pattern.preview} ${
                    selectedBackground === pattern.value ? "border-blue-500" : "border-gray-700 hover:border-gray-600"
                  }`}
                  title={pattern.name}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Geometric Patterns */}
        <Collapsible
          open={!collapsedSections.geometricPatterns}
          onOpenChange={() => toggleSection("geometricPatterns")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left text-sm text-gray-300 hover:text-white">
            <span>Geometric Patterns</span>
            {collapsedSections.geometricPatterns ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="grid grid-cols-3 gap-2">
              {backgroundThemes.geometricPatterns.map((pattern) => (
                <button
                  key={pattern.value}
                  onClick={() => setSelectedBackground(pattern.value)}
                  className={`aspect-square rounded-lg border-2 ${pattern.preview} ${
                    selectedBackground === pattern.value ? "border-blue-500" : "border-gray-700 hover:border-gray-600"
                  }`}
                  title={pattern.name}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Mesh & Blobs */}
        <Collapsible open={!collapsedSections.meshBlobs} onOpenChange={() => toggleSection("meshBlobs")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left text-sm text-gray-300 hover:text-white">
            <span>Mesh & Blobs</span>
            {collapsedSections.meshBlobs ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="grid grid-cols-3 gap-2">
              {backgroundThemes.meshBlobs.map((pattern) => (
                <button
                  key={pattern.value}
                  onClick={() => setSelectedBackground(pattern.value)}
                  className={`aspect-square rounded-lg border-2 ${pattern.preview} ${
                    selectedBackground === pattern.value ? "border-blue-500" : "border-gray-700 hover:border-gray-600"
                  }`}
                  title={pattern.name}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Abstract Bubbles */}
        <Collapsible open={!collapsedSections.abstractBubbles} onOpenChange={() => toggleSection("abstractBubbles")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left text-sm text-gray-300 hover:text-white">
            <span>Abstract Bubbles</span>
            {collapsedSections.abstractBubbles ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="grid grid-cols-3 gap-2">
              {backgroundThemes.abstractBubbles.map((pattern) => (
                <button
                  key={pattern.value}
                  onClick={() => setSelectedBackground(pattern.value)}
                  className={`aspect-square rounded-lg border-2 ${pattern.preview} ${
                    selectedBackground === pattern.value ? "border-blue-500" : "border-gray-700 hover:border-gray-600"
                  }`}
                  title={pattern.name}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Textures */}
        <Collapsible open={!collapsedSections.textures} onOpenChange={() => toggleSection("textures")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left text-sm text-gray-300 hover:text-white">
            <span>Textures</span>
            {collapsedSections.textures ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="grid grid-cols-3 gap-2">
              {backgroundThemes.textures.map((pattern) => (
                <button
                  key={pattern.value}
                  onClick={() => setSelectedBackground(pattern.value)}
                  className={`aspect-square rounded-lg border-2 ${pattern.preview} ${
                    selectedBackground === pattern.value ? "border-blue-500" : "border-gray-700 hover:border-gray-600"
                  }`}
                  title={pattern.name}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}

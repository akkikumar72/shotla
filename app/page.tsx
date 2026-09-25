"use client";
import {
  ArrowDownToLine,
  ChevronRight,
  ImagePlus,
  Redo2,
  SlidersHorizontal,
  Undo2,
} from "lucide-react";
import { useState } from "react";
import { Canvas } from "@/components/canvas";
import { Sidebar } from "@/components/sidebar";
import { useShotlaEditor } from "@/hooks/use-shotla-editor";

export default function ShotlaEditor() {
  const editor = useShotlaEditor();
  const [activeTool, setActiveTool] = useState("presets");
  const [mobilePanel, setMobilePanel] = useState(false);
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Drop target supplements keyboard-accessible upload buttons and paste.
    <div
      className={`editor-shell ${mobilePanel ? "panel-open" : ""}`}
      onDrop={editor.onDrop}
      onDragOver={editor.onDragOver}
      onDragLeave={editor.onDragLeave}
    >
      <a className="skip-link" href="#workspace">
        Skip to preview
      </a>
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">
            <i />
            <i />
          </span>
          <span>
            shotla<span className="brand-period">.</span>
          </span>
          <span className="studio-label">STUDIO</span>
        </div>
        <div className="document-breadcrumb">
          <span>Workspace</span>
          <ChevronRight size={13} />
          <strong>{editor.activeName}</strong>
        </div>
        <div className="header-actions">
          <div className="history-actions">
            <button
              className="icon-button"
              aria-label="Undo"
              title="Undo (⌘/Ctrl Z)"
              disabled={!editor.canUndo}
              onClick={editor.undo}
            >
              <Undo2 size={17} />
            </button>
            <button
              className="icon-button"
              aria-label="Redo"
              title="Redo (⇧ ⌘/Ctrl Z)"
              disabled={!editor.canRedo}
              onClick={editor.redo}
            >
              <Redo2 size={17} />
            </button>
          </div>
          <button
            className="secondary-button import-button"
            disabled={!editor.canAddMore || editor.isImporting}
            onClick={editor.addMoreScreenshots}
          >
            <ImagePlus size={16} />
            <span>Upload image</span>
          </button>
          <button
            className="primary-button header-export"
            disabled={!editor.uploadedImage}
            onClick={() => {
              setActiveTool("export");
              setMobilePanel(true);
            }}
          >
            <ArrowDownToLine size={16} />
            <span>Export image</span>
          </button>
          <button
            className="icon-button mobile-panel-toggle"
            aria-label={mobilePanel ? "Hide settings" : "Show settings"}
            aria-expanded={mobilePanel}
            onClick={() => setMobilePanel(!mobilePanel)}
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </header>
      <div className="editor-body">
        <Sidebar
          editor={editor}
          activeTool={activeTool}
          setActiveTool={(tool) => {
            setActiveTool(tool);
            setMobilePanel(true);
          }}
        />
        <Canvas editor={editor} />
      </div>
      <input
        ref={editor.fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
        multiple
        onChange={editor.onFileSelect}
        className="hidden"
        aria-label="Upload screenshots"
      />
    </div>
  );
}

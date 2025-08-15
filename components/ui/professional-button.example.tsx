// Example usage of ProfessionalButton component

import { ProfessionalButton } from "./professional-button";
import { Plus, Download, Upload, Trash2, Settings } from "lucide-react";

export const ProfessionalButtonExamples = () => {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold mb-4">Professional Button Examples</h2>

      {/* Primary Buttons - Main actions */}
      <section>
        <h3 className="text-lg font-semibold mb-3">
          Primary Buttons (Main Actions)
        </h3>
        <div className="flex flex-wrap gap-3">
          <ProfessionalButton variant="primary" size="sm">
            Small Primary
          </ProfessionalButton>
          <ProfessionalButton variant="primary" size="md">
            Medium Primary
          </ProfessionalButton>
          <ProfessionalButton variant="primary" size="lg">
            Large Primary
          </ProfessionalButton>
          <ProfessionalButton
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Item
          </ProfessionalButton>
        </div>
      </section>

      {/* Success Buttons - Confirmation actions */}
      <section>
        <h3 className="text-lg font-semibold mb-3">
          Success Buttons (Confirmation Actions)
        </h3>
        <div className="flex flex-wrap gap-3">
          <ProfessionalButton variant="success" size="md">
            Save Changes
          </ProfessionalButton>
          <ProfessionalButton
            variant="success"
            size="md"
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export Image
          </ProfessionalButton>
          <ProfessionalButton variant="success" size="md" loading={true}>
            Processing...
          </ProfessionalButton>
        </div>
      </section>

      {/* Warning Buttons - Important actions */}
      <section>
        <h3 className="text-lg font-semibold mb-3">
          Warning Buttons (Important Actions)
        </h3>
        <div className="flex flex-wrap gap-3">
          <ProfessionalButton variant="warning" size="md">
            ✨ Auto-Style with AI
          </ProfessionalButton>
          <ProfessionalButton
            variant="warning"
            size="md"
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Host on Picstatic
          </ProfessionalButton>
        </div>
      </section>

      {/* Danger Buttons - Destructive actions */}
      <section>
        <h3 className="text-lg font-semibold mb-3">
          Danger Buttons (Destructive Actions)
        </h3>
        <div className="flex flex-wrap gap-3">
          <ProfessionalButton variant="danger" size="md">
            Delete Forever
          </ProfessionalButton>
          <ProfessionalButton
            variant="danger"
            size="md"
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Remove Screenshot
          </ProfessionalButton>
        </div>
      </section>

      {/* Secondary Buttons - Less important actions */}
      <section>
        <h3 className="text-lg font-semibold mb-3">
          Secondary Buttons (Less Important Actions)
        </h3>
        <div className="flex flex-wrap gap-3">
          <ProfessionalButton variant="secondary" size="md">
            Cancel
          </ProfessionalButton>
          <ProfessionalButton
            variant="secondary"
            size="md"
            leftIcon={<Settings className="w-4 h-4" />}
          >
            Settings
          </ProfessionalButton>
          <ProfessionalButton variant="secondary" size="md" disabled={true}>
            Disabled Button
          </ProfessionalButton>
        </div>
      </section>

      {/* Ghost Buttons - Minimal actions */}
      <section>
        <h3 className="text-lg font-semibold mb-3">
          Ghost Buttons (Minimal Actions)
        </h3>
        <div className="flex flex-wrap gap-3">
          <ProfessionalButton variant="ghost" size="md">
            Ghost Button
          </ProfessionalButton>
          <ProfessionalButton
            variant="ghost"
            size="md"
            rightIcon={<Settings className="w-4 h-4" />}
          >
            Advanced Options
          </ProfessionalButton>
        </div>
      </section>

      {/* Full Width Examples */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Full Width Examples</h3>
        <div className="space-y-3 max-w-md">
          <ProfessionalButton
            variant="primary"
            size="md"
            className="w-full"
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Host on Picstatic
          </ProfessionalButton>
          <ProfessionalButton
            variant="secondary"
            size="md"
            className="w-full"
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export Image
          </ProfessionalButton>
        </div>
      </section>
    </div>
  );
};

"use client"

import { Button, buttonStyles } from "@/components/ui/button"
import { Plus, Download, Trash, AlertTriangle, Edit, Eye } from "lucide-react"

/**
 * Button Demo Component - Showcases all professional button styles
 * 
 * Usage Examples:
 * 
 * 1. Using styleType prop (recommended):
 *    <Button styleType="primary" className="px-4 py-3">Primary Action</Button>
 * 
 * 2. Using buttonStyles directly:
 *    <Button className={`${buttonStyles.success} px-4 py-3`}>Success Action</Button>
 * 
 * 3. Using professional variants:
 *    <Button variant="pro-danger" className="px-4 py-3">Danger Action</Button>
 */
export const ButtonDemo = () => (
  <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Professional Button Styles</h1>
      <p className="text-gray-600 mb-8">Choose the right button style for the action type</p>

      {/* Primary Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Primary - Main Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button 
            styleType="primary"
            className="flex items-center gap-2 px-4 py-3"
          >
            <Plus className="w-4 h-4" />
            Create New
          </Button>
          
          <Button 
            className={`${buttonStyles.primary} flex items-center gap-2 px-4 py-3`}
          >
            <Download className="w-4 h-4" />
            Save Changes
          </Button>
          
          <Button variant="pro-primary" className="px-6 py-3">
            Get Started
          </Button>
        </div>
      </section>

      {/* Success Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Success - Confirmation Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button 
            styleType="success"
            className="flex items-center gap-2 px-4 py-3"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
          
          <Button className={`${buttonStyles.success} px-4 py-3`}>
            Confirm
          </Button>
          
          <Button variant="pro-success" className="px-6 py-3">
            Publish
          </Button>
        </div>
      </section>

      {/* Warning Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Warning - Important Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button 
            styleType="warning"
            className="flex items-center gap-2 px-4 py-3"
          >
            <AlertTriangle className="w-4 h-4" />
            Auto-Style with AI
          </Button>
          
          <Button className={`${buttonStyles.warning} px-4 py-3`}>
            Update
          </Button>
          
          <Button variant="pro-warning" className="px-6 py-3">
            Review Changes
          </Button>
        </div>
      </section>

      {/* Danger Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Danger - Destructive Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button 
            styleType="danger"
            className="flex items-center gap-2 px-4 py-3"
          >
            <Trash className="w-4 h-4" />
            Delete
          </Button>
          
          <Button className={`${buttonStyles.danger} px-4 py-3`}>
            Remove All
          </Button>
          
          <Button variant="pro-danger" className="px-6 py-3">
            Reset Settings
          </Button>
        </div>
      </section>

      {/* Secondary Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Secondary - Less Important Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button 
            styleType="secondary"
            className="flex items-center gap-2 px-4 py-3"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          
          <Button className={`${buttonStyles.secondary} px-4 py-3`}>
            Export Image
          </Button>
          
          <Button variant="pro-secondary" className="px-6 py-3">
            Learn More
          </Button>
        </div>
      </section>

      {/* Ghost Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Ghost - Minimal Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button 
            styleType="ghost"
            className="flex items-center gap-2 px-4 py-3"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          
          <Button className={`${buttonStyles.ghost} px-4 py-3`}>
            Cancel
          </Button>
          
          <Button variant="pro-ghost" className="px-6 py-3">
            Maybe Later
          </Button>
        </div>
      </section>

      {/* Button Sizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Button Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button styleType="primary" size="sm" className="px-3 py-2">
            Small
          </Button>
          
          <Button styleType="primary" size="default" className="px-4 py-3">
            Default
          </Button>
          
          <Button styleType="primary" size="lg" className="px-6 py-4">
            Large
          </Button>
          
          <Button styleType="primary" size="xl" className="px-8 py-5">
            Extra Large
          </Button>
        </div>
      </section>

      {/* Code Examples */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Usage Examples</h2>
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm space-y-2">
          <div>// Method 1: Using styleType prop (recommended)</div>
          <div>&lt;Button styleType="success" className="px-4 py-3"&gt;Add Font&lt;/Button&gt;</div>
          
          <div className="mt-4">// Method 2: Using buttonStyles directly</div>
          <div>&lt;Button className={`$&#123;buttonStyles.primary&#125; px-4 py-3`}&gt;Save&lt;/Button&gt;</div>
          
          <div className="mt-4">// Method 3: Using professional variants</div>
          <div>&lt;Button variant="pro-danger" className="px-4 py-3"&gt;Delete&lt;/Button&gt;</div>
          
          <div className="mt-4">// With icons</div>
          <div>&lt;Button styleType="success" className="flex items-center gap-2 px-4 py-3"&gt;</div>
          <div>  &lt;PlusIcon className="w-4 h-4" /&gt;</div>
          <div>  &lt;span&gt;Add Font&lt;/span&gt;</div>
          <div>&lt;/Button&gt;</div>
        </div>
      </section>
    </div>
  </div>
)

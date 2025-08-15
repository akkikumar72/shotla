import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Professional Button Styles
export const buttonStyles = {
  // Primary buttons - Main actions
  primary:
    "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-full border-0 transform hover:scale-105",

  // Success buttons - Confirmation actions
  success:
    "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-full border-0 transform hover:scale-105",

  // Warning buttons - Important actions
  warning:
    "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-full border-0 transform hover:scale-105",

  // Danger buttons - Destructive actions
  danger:
    "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-full border-0 transform hover:scale-105",

  // Secondary buttons - Less important actions
  secondary:
    "bg-gradient-to-r from-gray-100 to-white hover:from-white hover:to-gray-50 text-gray-900 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-full border border-gray-200 hover:border-gray-300 transform hover:scale-105",

  // Ghost buttons - Minimal actions
  ghost:
    "bg-white/10 hover:bg-white/20 text-gray-600 hover:text-gray-800 font-medium shadow-sm hover:shadow-md transition-all duration-300 rounded-full border border-gray-200 hover:border-gray-300 backdrop-blur-sm",
};

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        // Legacy variants for backward compatibility
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 rounded-md",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 rounded-md",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-md",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 rounded-md",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-md",
        link: "text-primary underline-offset-4 hover:underline",
        
        // New professional variants
        "pro-primary": buttonStyles.primary,
        "pro-success": buttonStyles.success,
        "pro-warning": buttonStyles.warning,
        "pro-danger": buttonStyles.danger,
        "pro-secondary": buttonStyles.secondary,
        "pro-ghost": buttonStyles.ghost,
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4",
        xl: "h-12 px-8 has-[>svg]:px-6 text-base",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  styleType?: keyof typeof buttonStyles
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  styleType,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  // If styleType is provided, use the professional styles directly
  const buttonClass = styleType 
    ? cn(buttonStyles[styleType], className)
    : cn(buttonVariants({ variant, size, className }))

  return (
    <Comp
      data-slot="button"
      className={buttonClass}
      {...props}
    />
  )
}

export { Button, buttonVariants }
export type { ButtonProps }

"use client";

import React from "react";
import { cn } from "@/lib/utils";

// Professional Button Styles
const buttonStyles = {
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

const sizeStyles = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-base",
  lg: "px-6 py-4 text-lg",
};

export type ButtonVariant = keyof typeof buttonStyles;
export type ButtonSize = keyof typeof sizeStyles;

interface ProfessionalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const ProfessionalButton = React.forwardRef<
  HTMLButtonElement,
  ProfessionalButtonProps
>(
  (
    {
      variant = "primary",
      size = "md",
      children,
      className,
      disabled,
      loading = false,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-2 font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
          buttonStyles[variant],
          sizeStyles[size],
          isDisabled && "hover:scale-100 hover:shadow-lg",
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading...</span>
          </div>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

ProfessionalButton.displayName = "ProfessionalButton";

// Export the button styles for standalone usage
export { buttonStyles };

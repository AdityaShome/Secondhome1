"use client"

import { motion } from "framer-motion"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  color?: "primary" | "white"
  className?: string
}

export function LoadingSpinner({ size = "md", color = "primary", className = "" }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const colorMap = {
    primary: "border-primary",
    white: "border-white",
  }

  return (
    <div className={`relative ${sizeMap[size]} ${className}`}>
      <motion.div
        className={`absolute inset-0 rounded-full border-2 border-t-transparent ${colorMap[color]}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <motion.div
        className={`absolute inset-0 rounded-full border-2 border-t-transparent border-r-transparent opacity-70 ${colorMap[color]}`}
        animate={{ rotate: -180 }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
    </div>
  )
}

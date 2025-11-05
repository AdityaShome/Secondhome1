"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface AnimatedButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: "default" | "outline" | "ghost"
  className?: string
  disabled?: boolean
}

export function AnimatedButton({
  children,
  onClick,
  variant = "default",
  className = "",
  disabled = false,
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <Button
        variant={variant}
        onClick={onClick}
        disabled={disabled}
        className={`${className} transition-all duration-300`}
      >
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          {children}
        </motion.span>
      </Button>
    </motion.div>
  )
}

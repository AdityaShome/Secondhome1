"use client"

import { motion } from "framer-motion"

export function SkeletonLoader({ count = 3, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="h-64 bg-gradient-to-r from-muted via-background to-muted rounded-xl overflow-hidden"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: i * 0.2,
          }}
        >
          <motion.div
            className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["100%", "-100%"] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
        </motion.div>
      ))}
    </div>
  )
}

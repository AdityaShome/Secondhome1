"use client"

import { useEffect, useState, useRef } from "react"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"

interface StatCounterProps {
  value: number
  duration?: number
  suffix?: string
}

export function StatCounter({ value, duration = 2, suffix = "" }: StatCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)
      const current = Math.floor(progress * value)
      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, value, duration])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
    >
      <span className="text-4xl font-bold text-primary">
        {displayValue.toLocaleString()}
        {suffix}
      </span>
    </motion.div>
  )
}

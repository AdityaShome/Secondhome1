"use client"

import { useState, useEffect } from "react"

export function useSmoothTransition(
  initialState: boolean,
  duration = 300,
): [boolean, boolean, (state: boolean) => void] {
  const [isActive, setIsActive] = useState(initialState)
  const [isVisible, setIsVisible] = useState(initialState)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (isActive) {
      setIsVisible(true)
    } else {
      timeoutId = setTimeout(() => {
        setIsVisible(false)
      }, duration)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [isActive, duration])

  const toggle = (state: boolean) => {
    setIsActive(state)
  }

  return [isActive, isVisible, toggle]
}

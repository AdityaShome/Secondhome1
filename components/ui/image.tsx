"use client"

import { useState, useEffect } from "react"
import NextImage, { type ImageProps as NextImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface ImageProps extends Omit<NextImageProps, "onLoad" | "onError"> {
  fallback?: string
  aspectRatio?: "auto" | "square" | "video" | "portrait" | "custom"
  customAspectRatio?: string
}

export function Image({
  src,
  alt,
  className,
  fallback = "/placeholder.svg",
  aspectRatio = "auto",
  customAspectRatio,
  ...props
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [blurDataURL, setBlurDataURL] = useState<string | undefined>(undefined)

  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true)
    setError(false)

    // Generate a simple blur placeholder
    const canvas = document.createElement("canvas")
    canvas.width = 10
    canvas.height = 10
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.fillStyle = "#f3f4f6"
      ctx.fillRect(0, 0, 10, 10)
      setBlurDataURL(canvas.toDataURL())
    }
  }, [src])

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setError(true)
  }

  const aspectRatioClass = {
    auto: "",
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    custom: customAspectRatio,
  }[aspectRatio]

  return (
    <div className={cn("relative overflow-hidden", aspectRatioClass, className)}>
      {isLoading && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}
      <NextImage
        src={error ? fallback : src}
        alt={alt}
        className={cn("object-cover transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100")}
        placeholder={blurDataURL ? "blur" : "empty"}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  )
}

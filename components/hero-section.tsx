"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Find Your Perfect Second Home",
      description: "Discover comfortable and affordable PGs, hostels, and flats near your college.",
      image: "/placeholder.svg?height=600&width=1200",
      cta: "Browse Listings",
      link: "/listings",
    },
    {
      title: "Delicious Mess Options",
      description: "Explore mess facilities with home-cooked meals at affordable monthly rates.",
      image: "/placeholder.svg?height=600&width=1200",
      cta: "View Messes",
      link: "/messes",
    },
    {
      title: "Find Places Near Your College",
      description: "Locate accommodations within walking distance of your educational institution.",
      image: "/placeholder.svg?height=600&width=1200",
      cta: "Open Map",
      link: "/map",
    },
  ]

  return (
    <div className="relative h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentSlide ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-black/50 z-10" />
          <Image
            src={slide.image || "/placeholder.svg"}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="relative z-20 h-full flex items-center">
            <div className="container px-4 mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: index === currentSlide ? 1 : 0, y: index === currentSlide ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-2xl"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">{slide.title}</h1>
                <p className="text-xl text-white/90 mb-8">{slide.description}</p>
                <Button size="lg" asChild>
                  <Link href={slide.link}>
                    {slide.cta}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ))}

      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            } transition-all duration-300`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

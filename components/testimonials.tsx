"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Testimonial {
  id: number
  name: string
  college: string
  image: string
  rating: number
  text: string
}

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 1,
      name: "Priya Sharma",
      college: "Dayananda Sagar College of Engineering",
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: "Second Home helped me find a PG that's just 5 minutes away from my college. The booking process was smooth, and I love my new accommodation!",
    },
    {
      id: 2,
      name: "Rahul Patel",
      college: "RV College of Engineering",
      image: "/placeholder.svg?height=100&width=100",
      rating: 4,
      text: "I was struggling to find a good hostel near my college. Thanks to Second Home, I found a comfortable place with all the amenities I needed.",
    },
    {
      id: 3,
      name: "Ananya Singh",
      college: "Christ University",
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: "The mess options available through Second Home are amazing! I get home-cooked food at affordable rates, which is exactly what I was looking for.",
    },
  ])

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial()
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <section className="py-20 bg-white">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our <span className="text-orange-500">Students</span> Say
          </h2>
          <p className="text-xl text-gray-600">
            Hear from students who found their perfect second home through our platform
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white border-2 border-gray-300 hover:border-orange-500 hover:bg-orange-50 shadow-md"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
            <span className="sr-only">Previous testimonial</span>
          </Button>

          <div className="overflow-hidden px-12">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <Card className="border-2 border-gray-200 shadow-lg">
                    <CardContent className="p-10 relative">
                      {/* Quote Icon */}
                      <div className="absolute top-6 right-6 opacity-10">
                        <Quote className="w-16 h-16 text-orange-500" />
                      </div>

                      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="flex-shrink-0">
                          <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-orange-100">
                            <Image
                              src={testimonial.image || "/placeholder.svg"}
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <div className="flex justify-center md:justify-start mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${
                                  i < testimonial.rating 
                                    ? "fill-orange-400 text-orange-400" 
                                    : "fill-gray-200 text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-lg text-gray-700 mb-6 leading-relaxed italic">
                            "{testimonial.text}"
                          </p>
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                            <p className="text-sm text-gray-600">{testimonial.college}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white border-2 border-gray-300 hover:border-orange-500 hover:bg-orange-50 shadow-md"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
            <span className="sr-only">Next testimonial</span>
          </Button>

          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeIndex 
                    ? "bg-orange-500 w-8" 
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

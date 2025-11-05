"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(500, "Comment must be less than 500 characters"),
})

interface ReviewFormProps {
  itemType: "property" | "mess"
  itemId: string
  onSuccess?: () => void
}

export function ReviewForm({ itemType, itemId, onSuccess }: ReviewFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)
  const [characterCount, setCharacterCount] = useState(0)
  const [showRatingTooltip, setShowRatingTooltip] = useState(false)
  const [ratingTooltipText, setRatingTooltipText] = useState("")

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  })

  const rating = form.watch("rating")
  const comment = form.watch("comment")

  const ratingTexts = [
    "",
    "Poor - Major issues, would not recommend",
    "Fair - Several issues, below expectations",
    "Good - Decent experience with minor issues",
    "Very Good - Enjoyable experience overall",
    "Excellent - Outstanding in every way",
  ]

  const handleSubmit = async (values: z.infer<typeof reviewSchema>) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to submit a review",
        variant: "destructive",
      })
      router.push(`/login?redirect=${router.asPath}`)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemType,
          itemId,
          rating: values.rating,
          comment: values.comment,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit review")

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      })

      form.reset()
      setCharacterCount(0)

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Error",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStarHover = (star: number) => {
    setHoverRating(star)
    setShowRatingTooltip(true)
    setRatingTooltipText(ratingTexts[star])
  }

  const handleStarLeave = () => {
    setHoverRating(0)
    setShowRatingTooltip(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Rating</FormLabel>
              <FormControl>
                <div className="flex items-center relative">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        className="focus:outline-none p-1"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => handleStarHover(star)}
                        onMouseLeave={handleStarLeave}
                        onClick={() => field.onChange(star)}
                      >
                        <Star
                          className={`h-8 w-8 ${
                            (hoverRating ? star <= hoverRating : star <= rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          } transition-colors duration-200`}
                        />
                      </motion.button>
                    ))}
                  </div>
                  <AnimatePresence>
                    {showRatingTooltip && ratingTooltipText && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full mt-2 bg-black text-white text-xs px-2 py-1 rounded z-10 whitespace-nowrap"
                      >
                        {ratingTooltipText}
                        <div className="absolute -top-1 left-6 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel className="text-base font-medium">Your Review</FormLabel>
                <span
                  className={`text-xs ${characterCount > 450 ? (characterCount > 500 ? "text-red-500" : "text-amber-500") : "text-muted-foreground"}`}
                >
                  {characterCount}/500
                </span>
              </div>
              <FormControl>
                <Textarea
                  placeholder="Share your experience... What did you like? What could be improved?"
                  className="min-h-[120px] resize-none"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    setCharacterCount(e.target.value.length)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            disabled={isSubmitting || !rating || !comment || comment.length < 10 || comment.length > 500}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Submitting</span>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        </motion.div>
      </form>
    </Form>
  )
}

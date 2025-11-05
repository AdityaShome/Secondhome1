"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Star, ChevronLeft, ChevronRight, ThumbsUp, Flag } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { format, formatDistanceToNow } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { Skeleton } from "@/components/ui/skeleton"

interface Review {
  _id: string
  user: {
    _id: string
    name: string
    image?: string
  }
  rating: number
  comment: string
  createdAt: string
  updatedAt?: string
  helpfulCount?: number
}

interface ReviewsListProps {
  itemType: "property" | "mess"
  itemId: string
  onRatingChange?: (rating: number, count: number) => void
}

export function ReviewsList({ itemType, itemId, onRatingChange }: ReviewsListProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [ratingDistribution, setRatingDistribution] = useState<number[]>([0, 0, 0, 0, 0])
  const [helpfulMarked, setHelpfulMarked] = useState<Record<string, boolean>>({})
  const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest" | "helpful">("newest")

  useEffect(() => {
    fetchReviews()
  }, [itemType, itemId, currentPage, sortBy])

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/reviews?itemType=${itemType}&itemId=${itemId}&page=${currentPage}&sort=${sortBy}`,
      )

      if (!response.ok) throw new Error("Failed to fetch reviews")

      const data = await response.json()
      setReviews(data.reviews)
      setAverageRating(data.averageRating)
      setTotalReviews(data.pagination.total)
      setTotalPages(data.pagination.pages)
      setRatingDistribution(data.ratingDistribution || [0, 0, 0, 0, 0])

      if (onRatingChange) {
        onRatingChange(data.averageRating, data.pagination.total)
      }

      // Initialize helpful marked state
      const helpfulState: Record<string, boolean> = {}
      if (user) {
        data.reviews.forEach((review: Review) => {
          helpfulState[review._id] = false
        })
      }
      setHelpfulMarked(helpfulState)
    } catch (error) {
      console.error("Error fetching reviews:", error)
      toast({
        title: "Error",
        description: "Failed to load reviews. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const markHelpful = async (reviewId: string) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to mark reviews as helpful",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to mark review as helpful")

      const updatedReviews = reviews.map((review) => {
        if (review._id === reviewId) {
          return {
            ...review,
            helpfulCount: (review.helpfulCount || 0) + 1,
          }
        }
        return review
      })

      setReviews(updatedReviews)
      setHelpfulMarked({
        ...helpfulMarked,
        [reviewId]: true,
      })

      toast({
        title: "Marked as helpful",
        description: "Thank you for your feedback!",
      })
    } catch (error) {
      console.error("Error marking review as helpful:", error)
      toast({
        title: "Error",
        description: "Failed to mark review as helpful. Please try again.",
        variant: "destructive",
      })
    }
  }

  const reportReview = (reviewId: string) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to report reviews",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Review reported",
      description: "Thank you for helping us maintain quality content.",
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full mr-3" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 border rounded-lg"
      >
        <Star className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <p className="text-muted-foreground mb-2">No reviews yet.</p>
        <p className="text-muted-foreground">Be the first to leave a review!</p>
      </motion.div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
            <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
            <div className="flex my-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{totalReviews} reviews</span>
          </div>

          <div className="w-full md:w-48 space-y-1.5">
            {[5, 4, 3, 2, 1].map((rating) => {
              const percentage =
                totalReviews > 0 ? Math.round((ratingDistribution[5 - rating] / totalReviews) * 100) : 0

              return (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <div className="flex items-center w-12">
                    <span>{rating}</span>
                    <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-yellow-400 rounded-full"
                    />
                  </div>
                  <span className="w-8 text-right text-muted-foreground">{percentage}%</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="w-full md:w-auto">
          <select
            className="w-full md:w-auto px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="newest">Newest first</option>
            <option value="highest">Highest rated</option>
            <option value="lowest">Lowest rated</option>
            <option value="helpful">Most helpful</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {reviews.map((review, index) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3 border">
                    <AvatarImage src={review.user.image || ""} alt={review.user.name} />
                    <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{review.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {review.updatedAt
                        ? `Updated ${formatDistanceToNow(new Date(review.updatedAt), { addSuffix: true })}`
                        : formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-muted-foreground whitespace-pre-line">{review.comment}</p>

              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                    onClick={() => markHelpful(review._id)}
                    disabled={helpfulMarked[review._id]}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{helpfulMarked[review._id] ? "Helpful" : "Mark as helpful"}</span>
                    {review.helpfulCount && review.helpfulCount > 0 && (
                      <span className="ml-1 text-xs bg-primary/10 px-1.5 py-0.5 rounded-full">
                        {review.helpfulCount}
                      </span>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-muted-foreground hover:text-destructive"
                    onClick={() => reportReview(review._id)}
                  >
                    <Flag className="h-4 w-4" />
                    <span>Report</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">{format(new Date(review.createdAt), "MMM d, yyyy")}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current page
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-8 h-8"
                      aria-label={`Page ${page}`}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </Button>
                  )
                } else if (
                  (page === 2 && currentPage > 3) ||
                  (page === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return (
                    <span key={page} className="px-1">
                      ...
                    </span>
                  )
                }
                return null
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

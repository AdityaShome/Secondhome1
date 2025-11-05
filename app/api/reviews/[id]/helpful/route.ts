import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { connectToDatabase } from "@/lib/mongodb"
import mongoose from "mongoose"

// Mark a review as helpful
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login to mark reviews as helpful" },
        { status: 401 }
      )
    }

    const { id: reviewId } = await params

    if (!reviewId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json(
        { error: "Invalid review ID" },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Import the Review model
    const { Review } = await import("@/models/review")

    // Find the review
    const review = await Review.findById(reviewId)

    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      )
    }

    // Check if user already marked this review as helpful
    const userId = new mongoose.Types.ObjectId(session.user.id)
    const alreadyMarked = review.helpfulUsers?.some(
      (id: mongoose.Types.ObjectId) => id.toString() === userId.toString()
    )

    if (alreadyMarked) {
      return NextResponse.json(
        { message: "You already marked this review as helpful", alreadyMarked: true },
        { status: 200 }
      )
    }

    // Update the review
    review.helpfulCount = (review.helpfulCount || 0) + 1
    review.helpfulUsers = review.helpfulUsers || []
    review.helpfulUsers.push(userId)
    review.updatedAt = new Date()

    await review.save()

    console.log(`✅ User ${session.user.email} marked review ${reviewId} as helpful`)

    return NextResponse.json({
      success: true,
      message: "Review marked as helpful",
      helpfulCount: review.helpfulCount,
    })
  } catch (error) {
    console.error("❌ Error marking review as helpful:", error)
    return NextResponse.json(
      { error: "Failed to mark review as helpful" },
      { status: 500 }
    )
  }
}

// Remove helpful mark (optional - for undo functionality)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id: reviewId } = await params

    if (!reviewId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json(
        { error: "Invalid review ID" },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Import the Review model
    const { Review } = await import("@/models/review")

    const review = await Review.findById(reviewId)

    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      )
    }

    // Remove user from helpfulUsers array
    const userId = new mongoose.Types.ObjectId(session.user.id)
    review.helpfulUsers = review.helpfulUsers?.filter(
      (id: mongoose.Types.ObjectId) => id.toString() !== userId.toString()
    ) || []
    review.helpfulCount = Math.max((review.helpfulCount || 0) - 1, 0)
    review.updatedAt = new Date()

    await review.save()

    return NextResponse.json({
      success: true,
      message: "Helpful mark removed",
      helpfulCount: review.helpfulCount,
    })
  } catch (error) {
    console.error("❌ Error removing helpful mark:", error)
    return NextResponse.json(
      { error: "Failed to remove helpful mark" },
      { status: 500 }
    )
  }
}


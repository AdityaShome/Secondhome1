import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Review } from "@/models/review"
import { Property } from "@/models/property"
import { Mess } from "@/models/mess"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { itemType, itemId, rating, comment } = body

    if (!itemType || !itemId || !rating || !comment) {
      return NextResponse.json({ error: "Item type, ID, rating, and comment are required" }, { status: 400 })
    }

    if (itemType !== "property" && itemType !== "mess") {
      return NextResponse.json({ error: "Invalid item type" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    await connectToDatabase()

    // Check if the item exists
    let item
    if (itemType === "property") {
      item = await Property.findById(itemId)
    } else {
      item = await Mess.findById(itemId)
    }

    if (!item) {
      return NextResponse.json({ error: `${itemType} not found` }, { status: 404 })
    }

    // Check if the user has already reviewed this item
    const existingReview = await Review.findOne({
      user: session.user.id,
      itemType,
      itemId,
    })

    if (existingReview) {
      // Update the existing review
      existingReview.rating = rating
      existingReview.comment = comment
      existingReview.updatedAt = new Date()

      await existingReview.save()

      // Update the item's rating and review count
      await updateItemRating(itemType, itemId)

      return NextResponse.json({
        message: "Review updated successfully",
        review: existingReview,
      })
    }

    // Create a new review
    const newReview = new Review({
      user: session.user.id,
      itemType,
      itemId,
      rating,
      comment,
      createdAt: new Date(),
    })

    await newReview.save()

    // Update the item's rating and review count
    await updateItemRating(itemType, itemId)

    return NextResponse.json({
      message: "Review submitted successfully",
      review: newReview,
    })
  } catch (error) {
    console.error("Error submitting review:", error)
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const itemType = url.searchParams.get("itemType")
    const itemId = url.searchParams.get("itemId")
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    if (!itemType || !itemId) {
      return NextResponse.json({ error: "Item type and ID are required" }, { status: 400 })
    }

    if (itemType !== "property" && itemType !== "mess") {
      return NextResponse.json({ error: "Invalid item type" }, { status: 400 })
    }

    await connectToDatabase()

    // Get the total count of reviews
    const total = await Review.countDocuments({ itemType, itemId })

    // Get the reviews for the item
    const reviews = await Review.find({ itemType, itemId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name image")

    // Calculate the average rating
    const ratings = await Review.find({ itemType, itemId }).select("rating")
    const averageRating =
      ratings.length > 0 ? ratings.reduce((sum, review) => sum + review.rating, 0) / ratings.length : 0

    return NextResponse.json({
      reviews,
      averageRating,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error getting reviews:", error)
    return NextResponse.json({ error: "An error occurred while fetching reviews" }, { status: 500 })
  }
}

// Helper function to update the item's rating and review count
async function updateItemRating(itemType: string, itemId: string) {
  // Get all reviews for the item
  const reviews = await Review.find({ itemType, itemId })

  // Calculate the average rating
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  // Update the item's rating and review count
  if (itemType === "property") {
    await Property.findByIdAndUpdate(itemId, {
      rating: averageRating,
      reviews: reviews.length,
    })
  } else {
    await Mess.findByIdAndUpdate(itemId, {
      rating: averageRating,
      reviews: reviews.length,
    })
  }
}

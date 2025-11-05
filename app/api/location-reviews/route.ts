import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Review } from "@/models/review"
import { User } from "@/models/user"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = parseFloat(searchParams.get("lat") || "0")
    const lon = parseFloat(searchParams.get("lon") || "0")
    const radius = parseFloat(searchParams.get("radius") || "5000") // 5km default

    await connectToDatabase()

    // Simplified approach: Get recent reviews from all properties
    // Calculate distance manually after fetching
    const reviews = await Review.aggregate([
      {
        $lookup: {
          from: "properties",
          localField: "propertyId",
          foreignField: "_id",
          as: "property",
        },
      },
      {
        $unwind: {
          path: "$property",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $limit: 50, // Get more reviews to filter
      },
      {
        $project: {
          _id: 1,
          rating: 1,
          comment: 1,
          createdAt: 1,
          "user.name": 1,
          "user.image": 1,
          "property.title": 1,
          "property.location": 1,
          "property.coordinates": 1,
        },
      },
    ])

    // Filter reviews by distance (simple calculation)
    const radiusInKm = radius / 1000
    const filteredReviews = reviews
      .filter((review: any) => {
        if (!review.property?.coordinates?.coordinates) return true // Include if no coords
        
        const [propLon, propLat] = review.property.coordinates.coordinates
        const distance = Math.sqrt(
          Math.pow(propLat - lat, 2) + Math.pow(propLon - lon, 2)
        ) * 111 // Approximate km
        
        return distance <= radiusInKm
      })
      .slice(0, 10) // Limit to 10 after filtering

    // Clean up the response
    const cleanedReviews = filteredReviews.map((review: any) => ({
      _id: review._id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      user: {
        name: review.user?.name || "Anonymous",
        image: review.user?.image || null,
      },
      property: {
        title: review.property?.title || "Unknown Property",
        location: review.property?.location || "",
      },
    }))

    return NextResponse.json({
      reviews: cleanedReviews,
      total: cleanedReviews.length,
      averageRating:
        cleanedReviews.length > 0
          ? cleanedReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / cleanedReviews.length
          : 0,
    })
  } catch (error) {
    console.error("Error fetching location reviews:", error)
    return NextResponse.json(
      {
        reviews: [],
        total: 0,
        averageRating: 0,
        error: "Failed to fetch reviews",
      },
      { status: 200 } // Return 200 with empty data for graceful degradation
    )
  }
}


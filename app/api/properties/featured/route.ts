import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Property } from "@/models/property"

export async function GET() {
  try {
    await connectToDatabase()

    // Fetch featured properties - approved, with good ratings, limit to 6
    const properties = await Property.find({
      isApproved: true,
      isRejected: false,
      rating: { $gte: 4 }, // Properties with 4+ rating
    })
      .sort({ rating: -1, reviews: -1, createdAt: -1 }) // Sort by rating, then reviews, then newest
      .limit(6)
      .lean()
      .select("_id title location rating reviews price images type")

    // Transform data to match expected format
    const featuredProperties = properties.map((property) => ({
      _id: property._id.toString(),
      title: property.title || "Untitled Property",
      location: property.location || "Location not specified",
      rating: property.rating || 0,
      reviews: property.reviews || 0,
      price: property.price || 0,
      image: Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : "/placeholder.jpg",
      type: property.type || "PG",
    }))

    return NextResponse.json({ properties: featuredProperties })
  } catch (error) {
    console.error("Error fetching featured properties:", error)
    // Return empty array on error
    return NextResponse.json({ properties: [] }, { status: 200 })
  }
}

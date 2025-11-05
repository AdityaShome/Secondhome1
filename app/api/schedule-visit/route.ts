import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { connectToDatabase } from "@/lib/mongodb"
import { Property } from "@/models/property"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { propertyId, date, time, notes } = body

    if (!propertyId || !date || !time) {
      return NextResponse.json({ error: "Property ID, date, and time are required" }, { status: 400 })
    }

    // Skip DB connection if MONGODB_URI is not defined (during build)
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: "Database connection not available" }, { status: 503 })
    }

    await connectToDatabase()

    // Find the property
    const property = await Property.findById(propertyId)

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Create a visit request
    // In a real application, you would have a Visit model
    // For now, we'll just simulate success

    return NextResponse.json({
      success: true,
      message: "Visit scheduled successfully",
      visitId: `VISIT_${Math.random().toString(36).substring(2, 15)}`,
      property: {
        id: property._id,
        title: property.title,
      },
      date,
      time,
    })
  } catch (error) {
    console.error("Schedule visit error:", error)
    return NextResponse.json({ error: "An error occurred while scheduling the visit" }, { status: 500 })
  }
}

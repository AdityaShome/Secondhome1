import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Property } from "@/models/property"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase()

    const { id } = await params
    const property = await Property.findById(id)

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      property,
    })
  } catch (error) {
    console.error("❌ Error fetching property:", error)
    return NextResponse.json(
      { error: "Failed to fetch property" },
      { status: 500 }
    )
  }
}

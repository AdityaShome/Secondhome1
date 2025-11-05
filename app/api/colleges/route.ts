import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { College } from "@/models/college"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const query = url.searchParams.get("query") || url.searchParams.get("search") || ""
    const city = url.searchParams.get("city") || ""

    await connectToDatabase()

    // Build filter
    const filter: any = {}

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { city: { $regex: query, $options: "i" } },
      ]
    }

    if (city) {
      filter.city = { $regex: city, $options: "i" }
    }

    const colleges = await College.find(filter).limit(10).sort({ name: 1 })

    return NextResponse.json({ colleges })
  } catch (error) {
    console.error("Error fetching colleges:", error)
    return NextResponse.json({ error: "An error occurred while fetching colleges" }, { status: 500 })
  }
}

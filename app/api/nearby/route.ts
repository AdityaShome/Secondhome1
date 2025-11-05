import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Property } from "@/models/property"
import { Mess } from "@/models/mess"
import { Place } from "@/models/place"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const lat = Number.parseFloat(url.searchParams.get("lat") || "0")
    const lng = Number.parseFloat(url.searchParams.get("lng") || "0")
    const radius = Number.parseInt(url.searchParams.get("radius") || "5000") // Default 5km
    const type = url.searchParams.get("type") || "all"

    if (!lat || !lng) {
      return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
    }

    await connectToDatabase()

    // Define the geospatial query (using coordinates field as per schema)
    const geoQuery = {
      coordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: radius,
        },
      },
    }

    let results = {}

    // Get nearby places based on type
    if (type === "all" || type === "property") {
      const properties = await Property.find(geoQuery).limit(20)
      results = { ...results, properties }
    }

    if (type === "all" || type === "mess") {
      const messes = await Mess.find(geoQuery).limit(20)
      results = { ...results, messes }
    }

    if (type === "all" || type === "restaurant") {
      const restaurants = await Place.find({ ...geoQuery, type: "restaurant" }).limit(20)
      results = { ...results, restaurants }
    }

    if (type === "all" || type === "hospital") {
      const hospitals = await Place.find({ ...geoQuery, type: "hospital" }).limit(20)
      results = { ...results, hospitals }
    }

    if (type === "all" || type === "transport") {
      const transport = await Place.find({
        ...geoQuery,
        type: { $in: ["bus_stop", "metro_station"] },
      }).limit(20)
      results = { ...results, transport }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error fetching nearby places:", error)
    return NextResponse.json({ error: "An error occurred while fetching nearby places" }, { status: 500 })
  }
}

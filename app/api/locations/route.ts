import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Property } from "@/models/property"
import { Mess } from "@/models/mess"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || ""

    await connectToDatabase()

    // Get all approved properties and their locations
    const properties = await Property.find({
      isApproved: true,
      isRejected: false,
    })
      .select("location city state nearbyColleges")
      .lean()

    const messes = await Mess.find({
      isApproved: true,
      isRejected: false,
    })
      .select("location city state")
      .lean()

    // Extract unique locations, cities, and colleges
    const locationSet = new Set<string>()
    const citySet = new Set<string>()
    const collegeSet = new Set<string>()
    const areaSet = new Set<string>()

    // Process properties
    properties.forEach((property: any) => {
      if (property.location) {
        locationSet.add(property.location.trim())
        
        // Extract area from location (usually first part before comma)
        const parts = property.location.split(",")
        if (parts.length > 0) {
          const area = parts[0].trim()
          if (area) areaSet.add(area)
        }
      }
      if (property.city) citySet.add(property.city.trim())
      if (property.state) {
        citySet.add(`${property.city}, ${property.state}`.trim())
      }
      if (property.nearbyColleges && Array.isArray(property.nearbyColleges)) {
        property.nearbyColleges.forEach((college: any) => {
          if (college && college.name) collegeSet.add(college.name.trim())
        })
      }
    })

    // Process messes
    messes.forEach((mess: any) => {
      if (mess.location) {
        locationSet.add(mess.location.trim())
        
        const parts = mess.location.split(",")
        if (parts.length > 0) {
          const area = parts[0].trim()
          if (area) areaSet.add(area)
        }
      }
      if (mess.city) citySet.add(mess.city.trim())
      if (mess.state) {
        citySet.add(`${mess.city}, ${mess.state}`.trim())
      }
    })

    // Create suggestions with types
    const suggestions = [
      ...Array.from(citySet).map((city) => ({
        value: city,
        label: city,
        type: "city",
        count: properties.filter((p: any) => 
          p.city && city.toLowerCase().includes(p.city.toLowerCase())
        ).length + messes.filter((m: any) => 
          m.city && city.toLowerCase().includes(m.city.toLowerCase())
        ).length,
      })),
      ...Array.from(areaSet).map((area) => ({
        value: area,
        label: area,
        type: "area",
        count: properties.filter((p: any) => 
          p.location && p.location.toLowerCase().includes(area.toLowerCase())
        ).length + messes.filter((m: any) => 
          m.location && m.location.toLowerCase().includes(area.toLowerCase())
        ).length,
      })),
      ...Array.from(collegeSet).map((college) => ({
        value: college,
        label: `Near ${college}`,
        type: "college",
        count: properties.filter((p: any) => 
          p.nearbyColleges && p.nearbyColleges.some((c: any) => 
            c.name && c.name.toLowerCase().includes(college.toLowerCase())
          )
        ).length,
      })),
    ]

    // Filter suggestions based on query
    let filteredSuggestions = suggestions
    if (query.trim()) {
      const queryLower = query.toLowerCase()
      filteredSuggestions = suggestions.filter(
        (s) =>
          s.value.toLowerCase().includes(queryLower) ||
          s.label.toLowerCase().includes(queryLower)
      )
    }

    // Sort by count (most properties first) and limit to 10
    filteredSuggestions.sort((a, b) => b.count - a.count)
    filteredSuggestions = filteredSuggestions.slice(0, 10)

    return NextResponse.json({
      suggestions: filteredSuggestions,
      total: filteredSuggestions.length,
    })
  } catch (error) {
    console.error("Error fetching locations:", error)
    return NextResponse.json(
      { error: "Failed to fetch locations", suggestions: [] },
      { status: 500 }
    )
  }
}


import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        suggestions: [],
        message: "AI features are currently unavailable"
      })
    }

    const { context, data } = await req.json()

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    let prompt = ""

    switch (context) {
      case "beautify":
        prompt = `Transform this simple property description into a professional, attractive listing (100-150 words):

"${data.userDescription}"

Property: ${data.propertyType} - ${data.propertySubtype}
Location: ${data.city || "city"}

Make it:
- Professional & engaging
- Highlight key features
- Appeal to students
- SEO-friendly

Return ONLY the beautified description text, no quotes or formatting.`
        break

      case "pricing":
        prompt = `Suggest pricing for ${data.propertySubtype} in ${data.city}. Return JSON only:
        {
          "monthlyRent": {"min": 0, "max": 0, "recommended": 0},
          "securityDeposit": 0,
          "maintenance": 0
        }`
        break

      case "amenities":
        prompt = `Top 4 amenities for ${data.propertySubtype}. Return JSON array from: wifi, parking, ac, tv, kitchen, gym, laundry, powerbackup. Example: ["wifi", "parking"]`
        break

      default:
        return NextResponse.json({ suggestions: [], message: "Invalid context" })
    }

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Try to parse JSON if applicable
    let suggestions
    try {
      suggestions = JSON.parse(text)
    } catch {
      suggestions = text
    }

    return NextResponse.json({
      success: true,
      suggestions,
      context
    })

  } catch (error: any) {
    console.error("AI suggestions error:", error)
    return NextResponse.json({
      success: false,
      suggestions: [],
      message: "Failed to generate suggestions",
      error: error.message
    })
  }
}


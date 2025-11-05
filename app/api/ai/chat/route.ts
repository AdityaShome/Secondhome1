import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not set" }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    // Build context-aware prompt
    let contextInfo = `You are SecondHome AI, a helpful assistant for students looking for accommodation in India.

Current Location: ${context.location}
Available Properties: ${context.properties}
Nearby Colleges: ${context.colleges}${context.nearestCollege ? ` (Nearest: ${context.nearestCollege})` : ''}`

    if (context.insights) {
      contextInfo += `
Area Insights:
- Restaurants: ${context.insights.restaurants}
- Transport Options: ${context.insights.transport}
- Safety (Police Stations): ${context.insights.safety}
- Overall Score: ${context.insights.scores?.overall || 'N/A'}/100
- Food Score: ${context.insights.scores?.food || 'N/A'}/100
- Transport Score: ${context.insights.scores?.connectivity || 'N/A'}/100
- Safety Score: ${context.insights.scores?.safety || 'N/A'}/100`
    }

    const prompt = `${contextInfo}

User Question: ${message}

Provide a helpful, concise, and friendly response (2-3 sentences max). Focus on student needs like safety, budget, proximity to colleges, food options, and lifestyle. Be specific about numbers when available.`

    const result = await model.generateContent(prompt)
    const response = result.response
    const reply = response.text()

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("AI Chat error:", error)
    return NextResponse.json({ 
      error: "Failed to get AI response",
      reply: "Sorry, I'm having trouble right now. Please try asking again!" 
    }, { status: 500 })
  }
}


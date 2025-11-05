import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        verified: false,
        confidence: 0,
        score: 0,
        recommendation: "MANUAL_REVIEW",
        reason: "AI verification unavailable - requires manual review",
        redFlags: ["AI service unavailable"]
      })
    }

    const propertyData = await req.json()

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.3, // Lower temperature for more consistent analysis
      }
    })

    // Compact verification prompt focusing on key legitimacy indicators
    const prompt = `Analyze this property listing for legitimacy. Score 0-100.

Property: ${propertyData.propertyType || "N/A"} - ${propertyData.propertySubtype || "N/A"}
Title: ${propertyData.title || "N/A"}
Location: ${propertyData.city || "N/A"}, ${propertyData.address?.substring(0, 50) || "N/A"}
Price: ₹${propertyData.monthlyRent || 0}/month
Deposit: ₹${propertyData.securityDeposit || 0}
Description: ${propertyData.description?.substring(0, 200) || "N/A"}...
Amenities: ${propertyData.amenities?.join(", ") || "None"}

Check for:
1. Price realism (market rates)
2. Description quality & authenticity
3. Contact info spam/scam patterns
4. Incomplete/suspicious details
5. Title legitimacy

Return ONLY this JSON:
{
  "score": 0-100,
  "recommendation": "APPROVE"|"REVIEW"|"REJECT",
  "confidence": 0-100,
  "redFlags": ["issue1", "issue2"],
  "reason": "brief explanation"
}`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Parse AI response
    let aiAnalysis
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      aiAnalysis = JSON.parse(jsonMatch ? jsonMatch[0] : text)
    } catch (parseError) {
      console.error("Failed to parse AI response:", text)
      return NextResponse.json({
        verified: false,
        confidence: 0,
        score: 0,
        recommendation: "MANUAL_REVIEW",
        reason: "AI analysis format error - requires manual review",
        redFlags: ["Unable to parse AI response"],
        analysis: { rawResponse: text }
      })
    }

    // Determine verification status based on AI recommendation
    const verified = aiAnalysis.recommendation === "APPROVE" && aiAnalysis.score >= 70
    const needsReview = aiAnalysis.recommendation === "REVIEW" || (aiAnalysis.score >= 50 && aiAnalysis.score < 70)

    return NextResponse.json({
      verified,
      needsReview,
      confidence: aiAnalysis.confidence || 0,
      score: aiAnalysis.score || 0,
      recommendation: aiAnalysis.recommendation || "REVIEW",
      reason: aiAnalysis.reason || "Analysis completed",
      redFlags: aiAnalysis.redFlags || [],
      analysis: aiAnalysis,
      reviewedAt: new Date().toISOString()
    })

  } catch (error: any) {
    console.error("AI verification error:", error)
    
    // Handle rate limiting gracefully
    if (error.status === 429) {
      return NextResponse.json({
        verified: false,
        confidence: 0,
        score: 0,
        recommendation: "MANUAL_REVIEW",
        reason: "AI service temporarily unavailable - property queued for manual review",
        redFlags: ["Rate limit reached"],
        error: "Rate limit exceeded"
      })
    }

    return NextResponse.json({
      verified: false,
      confidence: 0,
      score: 0,
      recommendation: "MANUAL_REVIEW",
      reason: "AI verification failed - requires manual review",
      redFlags: ["Verification error"],
      error: error.message
    })
  }
}


import { NextResponse } from "next/server"

export async function GET() {
  // Test Open-Meteo API (No API key needed!)
  try {
    const testResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
    )

    if (testResponse.ok) {
      const data = await testResponse.json()
      const current = data.current
      
      return NextResponse.json({
        status: "✅ WORKING PERFECTLY",
        message: "Open-Meteo API is working! (FREE & UNLIMITED)",
        testLocation: "London, UK",
        temperature: `${Math.round(current.temperature_2m)}°C`,
        humidity: `${Math.round(current.relative_humidity_2m)}%`,
        windSpeed: `${current.wind_speed_10m} km/h`,
        apiInfo: {
          provider: "Open-Meteo",
          cost: "FREE",
          apiKeyRequired: "NO",
          rateLimit: "UNLIMITED",
          documentation: "https://open-meteo.com/en/docs",
        }
      })
    } else {
      return NextResponse.json({
        status: "❌ API ERROR",
        message: `Open-Meteo API returned ${testResponse.status}`,
        error: testResponse.statusText,
      })
    }
  } catch (error: any) {
    return NextResponse.json({
      status: "❌ NETWORK ERROR",
      message: "Failed to connect to Open-Meteo API",
      error: error.message,
    })
  }
}


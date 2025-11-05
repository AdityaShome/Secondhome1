import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")

    if (!lat || !lon) {
      return NextResponse.json(
        { error: "Latitude and longitude are required" },
        { status: 400 }
      )
    }

    // Use Open-Meteo API - Completely FREE, No API key required!
    // Docs: https://open-meteo.com/en/docs
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
    )

    if (!weatherResponse.ok) {
      console.error("Open-Meteo API Error:", {
        status: weatherResponse.status,
        statusText: weatherResponse.statusText,
      })
      
      return NextResponse.json(
        { 
          error: `Weather API error: ${weatherResponse.status}`,
        },
        { status: weatherResponse.status }
      )
    }

    const weatherData = await weatherResponse.json()
    
    // Map WMO weather codes to descriptions
    const weatherCodeToDescription = (code: number): { main: string, description: string, icon: string } => {
      const codes: Record<number, { main: string, description: string, icon: string }> = {
        0: { main: "Clear", description: "clear sky", icon: "01d" },
        1: { main: "Clear", description: "mainly clear", icon: "01d" },
        2: { main: "Clouds", description: "partly cloudy", icon: "02d" },
        3: { main: "Clouds", description: "overcast", icon: "03d" },
        45: { main: "Fog", description: "foggy", icon: "50d" },
        48: { main: "Fog", description: "depositing rime fog", icon: "50d" },
        51: { main: "Drizzle", description: "light drizzle", icon: "09d" },
        53: { main: "Drizzle", description: "moderate drizzle", icon: "09d" },
        55: { main: "Drizzle", description: "dense drizzle", icon: "09d" },
        61: { main: "Rain", description: "slight rain", icon: "10d" },
        63: { main: "Rain", description: "moderate rain", icon: "10d" },
        65: { main: "Rain", description: "heavy rain", icon: "10d" },
        71: { main: "Snow", description: "slight snow", icon: "13d" },
        73: { main: "Snow", description: "moderate snow", icon: "13d" },
        75: { main: "Snow", description: "heavy snow", icon: "13d" },
        77: { main: "Snow", description: "snow grains", icon: "13d" },
        80: { main: "Rain", description: "slight rain showers", icon: "09d" },
        81: { main: "Rain", description: "moderate rain showers", icon: "09d" },
        82: { main: "Rain", description: "violent rain showers", icon: "09d" },
        85: { main: "Snow", description: "slight snow showers", icon: "13d" },
        86: { main: "Snow", description: "heavy snow showers", icon: "13d" },
        95: { main: "Thunderstorm", description: "thunderstorm", icon: "11d" },
        96: { main: "Thunderstorm", description: "thunderstorm with slight hail", icon: "11d" },
        99: { main: "Thunderstorm", description: "thunderstorm with heavy hail", icon: "11d" },
      }
      return codes[code] || { main: "Unknown", description: "unknown", icon: "01d" }
    }

    const current = weatherData.current
    const weatherInfo = weatherCodeToDescription(current.weather_code)

    return NextResponse.json({
      main: {
        temp: Math.round(current.temperature_2m),
        feels_like: Math.round(current.apparent_temperature),
        humidity: Math.round(current.relative_humidity_2m),
      },
      weather: [
        {
          main: weatherInfo.main,
          description: weatherInfo.description,
          icon: weatherInfo.icon,
        }
      ],
      wind: {
        speed: current.wind_speed_10m,
      },
      source: "Open-Meteo (Free & Unlimited)",
    })
  } catch (error: any) {
    console.error("Error fetching weather:", error)
    return NextResponse.json(
      { 
        error: error.message || "Failed to fetch weather data"
      },
      { status: 500 }
    )
  }
}


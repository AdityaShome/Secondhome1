import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { connectToDatabase } from "@/lib/mongodb"
import { Booking } from "@/models/booking"
import mongoose from "mongoose"

// PayPal REST API configuration (Direct API calls - no SDK)
const PAYPAL_API_URL = process.env.PAYPAL_MODE === "live" 
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com"

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!

// Get PayPal access token
async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64")
  
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })
  
  const data = await response.json()
  return data.access_token
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { bookingId, action, orderId } = body

    // Handle PayPal order creation
    if (action === "create") {
      if (!bookingId) {
        return NextResponse.json({ error: "Booking ID is required" }, { status: 400 })
    }

      // Validate booking ID format
      if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        return NextResponse.json({ error: "Invalid booking ID format" }, { status: 400 })
    }

    await connectToDatabase()

    // Find the booking
    const booking = await Booking.findById(bookingId).populate("property")

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Check if user is the booking owner
    if (booking.user.toString() !== session.user.id) {
      return NextResponse.json({ error: "You don't have permission to pay for this booking" }, { status: 403 })
    }

      // Check if already paid
      if (booking.paymentStatus === "paid") {
        return NextResponse.json({ error: "This booking is already paid" }, { status: 400 })
      }

      // Create PayPal order via REST API
      const accessToken = await getPayPalAccessToken()
      
      const orderPayload = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: (booking.totalAmount / 80).toFixed(2), // Convert INR to USD (approx rate)
            },
            description: `Booking for ${booking.property.title}`,
            custom_id: bookingId,
          },
        ],
      }

      const orderResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(orderPayload),
      })

      const order = await orderResponse.json()

      if (!orderResponse.ok) {
        console.error("PayPal order creation failed:", order)
        return NextResponse.json({ error: order.message || "Failed to create PayPal order" }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        orderId: order.id,
      })
    }

    // Handle PayPal order capture
    if (action === "capture") {
      if (!orderId) {
        return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
      }

      // Capture the payment via REST API
      const accessToken = await getPayPalAccessToken()
      
      const captureResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      })

      const capture = await captureResponse.json()

      if (!captureResponse.ok) {
        console.error("PayPal capture failed:", capture)
        return NextResponse.json({ error: capture.message || "Payment capture failed" }, { status: 500 })
      }

      if (capture.status === "COMPLETED") {
        await connectToDatabase()

        // Find booking from PayPal custom ID
        const bookingId = capture.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id ||
                         capture.purchase_units?.[0]?.custom_id

        if (bookingId && mongoose.Types.ObjectId.isValid(bookingId)) {
          const booking = await Booking.findById(bookingId)

          if (booking) {
    // Update booking with payment information
    booking.paymentStatus = "paid"
    booking.status = "confirmed"
            booking.paymentId = capture.id
            booking.paymentMethod = "paypal"
    booking.updatedAt = new Date()

    await booking.save()

    return NextResponse.json({
      success: true,
      message: "Payment successful",
      booking,
              paymentId: capture.id,
            })
          }
        }

        return NextResponse.json({
          success: true,
          message: "Payment captured successfully",
          captureId: capture.id,
    })
      }

      return NextResponse.json({ error: "Payment capture failed" }, { status: 400 })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Payment error:", error)
    return NextResponse.json({ 
      error: "An error occurred during payment processing",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

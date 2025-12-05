import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Booking } from "@/models/booking"
import { Property } from "@/models/property"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Get user's bookings
    const bookings = await Booking.find({ user: session.user.id })
      .populate("property", "title location image price type")
      .sort({ createdAt: -1 })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "An error occurred while fetching bookings" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    // Support both field names for flexibility
    const propertyId = body.propertyId || body.property
    const checkInDate = body.checkInDate || body.checkIn
    const checkOutDate = body.checkOutDate || body.checkOut
    const roomType = body.roomType
    const totalAmount = body.totalAmount
    const guests = body.guests || 1
    // Business Model - Revenue Stream 4: Settling In Kits
    const settlingInKit = body.settlingInKit || null

    if (!propertyId || !checkInDate) {
      return NextResponse.json({ error: "Missing required fields (property and checkIn)" }, { status: 400 })
    }

    await connectToDatabase()

    // Check if property exists
    const property = await Property.findById(propertyId)
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    let price = totalAmount || property.price || 0
    let roomTypeInfo = null

    // If roomType is provided, validate it
    if (roomType) {
      roomTypeInfo = property.roomTypes?.find((room: any) => room.type === roomType)
      if (!roomTypeInfo) {
        return NextResponse.json({ error: "Room type not found" }, { status: 404 })
      }

      if (roomTypeInfo.available <= 0) {
        return NextResponse.json({ error: "No rooms available for this type" }, { status: 400 })
      }

      price = roomTypeInfo.price
    }

    // Business Model - Revenue Stream 2: Calculate Booking Commission (5-10% of first month rent)
    const firstMonthRent = price
    const commissionRate = body.commissionRate || 7.5 // Default 7.5% (middle of 5-10% range)
    const commissionAmount = Math.round((firstMonthRent * commissionRate) / 100)

    // Calculate total amount: first month rent + commission + settling in kit (if selected)
    let totalBookingAmount = firstMonthRent + commissionAmount
    if (settlingInKit && settlingInKit.price) {
      totalBookingAmount += settlingInKit.price
    }

    // Create booking
    const newBooking = new Booking({
      user: session.user.id,
      property: propertyId,
      roomType: roomType || "Standard",
      price,
      totalAmount: totalBookingAmount,
      checkInDate: new Date(checkInDate),
      checkOutDate: checkOutDate ? new Date(checkOutDate) : null,
      guests,
      status: "pending",
      paymentStatus: "pending",
      // Business Model - Revenue Stream 2: Booking Commission
      firstMonthRent,
      commissionRate,
      commissionAmount,
      // Business Model - Revenue Stream 4: Settling In Kits
      settlingInKit: settlingInKit || undefined,
      createdAt: new Date(),
    })

    await newBooking.save()

    // Update room availability if roomType was specified
    if (roomType && roomTypeInfo) {
      await Property.findByIdAndUpdate(
        propertyId,
        { $inc: { "roomTypes.$[elem].available": -1 } },
        { arrayFilters: [{ "elem.type": roomType }] },
      )
    }

    return NextResponse.json(newBooking, { status: 201 })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "An error occurred while creating the booking" }, { status: 500 })
  }
}

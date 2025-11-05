import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Booking } from "@/models/booking"
import { Property } from "@/models/property"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import mongoose from "mongoose"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 })
    }

    await connectToDatabase()

    const booking = await Booking.findById(id).populate("property", "title location image price type")

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Check if user is the booking owner or property owner
    if (
      booking.user.toString() !== session.user.id &&
      booking.property.owner.toString() !== session.user.id &&
      session.user.role !== "admin"
    ) {
      return NextResponse.json({ error: "You don't have permission to view this booking" }, { status: 403 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("Error fetching booking:", error)
    return NextResponse.json({ error: "An error occurred while fetching the booking" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const body = await req.json()

    await connectToDatabase()

    const booking = await Booking.findById(id)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Check permissions based on the update being made
    const isPropertyOwner = await Property.findOne({
      _id: booking.property,
      owner: session.user.id,
    })

    const isBookingOwner = booking.user.toString() === session.user.id
    const isAdmin = session.user.role === "admin"

    // Only property owner or admin can change status
    if (body.status && !isPropertyOwner && !isAdmin) {
      return NextResponse.json({ error: "You don't have permission to update the booking status" }, { status: 403 })
    }

    // Only booking owner can change dates
    if ((body.checkInDate || body.checkOutDate) && !isBookingOwner && !isAdmin) {
      return NextResponse.json({ error: "You don't have permission to update the booking dates" }, { status: 403 })
    }

    const updatedBooking = await Booking.findByIdAndUpdate(id, { ...body, updatedAt: new Date() }, { new: true })

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json({ error: "An error occurred while updating the booking" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    await connectToDatabase()

    const booking = await Booking.findById(id)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Only booking owner or admin can cancel/delete booking
    if (booking.user.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "You don't have permission to cancel this booking" }, { status: 403 })
    }

    // If cancelling a confirmed booking, increase room availability
    if (booking.status === "confirmed") {
      await Property.findByIdAndUpdate(
        booking.property,
        { $inc: { "roomTypes.$[elem].available": 1 } },
        { arrayFilters: [{ "elem.type": booking.roomType }] },
      )
    }

    await Booking.findByIdAndDelete(id)

    return NextResponse.json({ message: "Booking cancelled successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error cancelling booking:", error)
    return NextResponse.json({ error: "An error occurred while cancelling the booking" }, { status: 500 })
  }
}

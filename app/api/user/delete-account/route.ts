import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { connectToDatabase } from "@/lib/mongodb"
import { getUserModel } from "@/models/user"
import { Booking } from "@/models/booking"
import { Property } from "@/models/property"
import { Like } from "@/models/like"

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const User = await getUserModel()
    const userId = session.user.id

    // Delete all user's bookings
    await Booking.deleteMany({ user: userId })

    // Delete all user's likes
    await Like.deleteMany({ user: userId })

    // Delete all properties owned by user
    await Property.deleteMany({ owner: userId })

    // Finally, delete the user account
    await User.findByIdAndDelete(userId)

    return NextResponse.json({ message: "Account deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting account:", error)
    return NextResponse.json({ error: "An error occurred while deleting your account" }, { status: 500 })
  }
}


import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { connectToDatabase } from "@/lib/mongodb"
import { getUserModel } from "@/models/user"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    const User = await getUserModel()

    const user = await User.findById(session.user.id).select("preferences")

    return NextResponse.json({ 
      preferences: user?.preferences || {
        emailNotifications: false,
        smsNotifications: false,
        showProfile: true,
      }
    }, { status: 200 })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "An error occurred while fetching settings" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    await connectToDatabase()
    const User = await getUserModel()

    // Update user preferences
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { 
        preferences: {
          emailNotifications: body.emailNotifications ?? false,
          smsNotifications: body.smsNotifications ?? false,
          showProfile: body.showProfile ?? true,
        },
        updatedAt: new Date()
      },
      { new: true }
    ).select("-password")

    return NextResponse.json({ 
      message: "Settings updated successfully",
      preferences: updatedUser.preferences
    }, { status: 200 })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "An error occurred while updating settings" }, { status: 500 })
  }
}


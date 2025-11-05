import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Notification } from "@/models/notification"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

// PATCH - Mark a single notification as read
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const { id } = await params

    const { User } = await import("@/models/user")
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: user._id },
      { read: true, readAt: new Date() },
      { new: true }
    )

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    const unreadCount = await Notification.countDocuments({ user: user._id, read: false })

    return NextResponse.json({
      success: true,
      notification,
      unreadCount,
    })
  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
  }
}

// DELETE - Delete a notification
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const { id } = await params

    const { User } = await import("@/models/user")
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    await Notification.findOneAndDelete({ _id: id, user: user._id })

    const unreadCount = await Notification.countDocuments({ user: user._id, read: false })

    return NextResponse.json({
      success: true,
      unreadCount,
    })
  } catch (error) {
    console.error("Error deleting notification:", error)
    return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 })
  }
}


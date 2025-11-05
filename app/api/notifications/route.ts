import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Notification } from "@/models/notification"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

// GET - Fetch all notifications for the current user
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Try to connect to database with error handling
    try {
      await connectToDatabase()
    } catch (dbError: any) {
      // If database connection fails, return empty results instead of error
      console.error("Database connection error:", dbError?.message || "Connection failed")
      return NextResponse.json({
        notifications: [],
        unreadCount: 0,
      }, { status: 200 })
    }

    const { searchParams } = new URL(req.url)
    const filter = searchParams.get("filter") // "all", "unread", "read"
    const type = searchParams.get("type") // notification type filter
    const limit = parseInt(searchParams.get("limit") || "50")

    try {
      // Get user from session
      const { User } = await import("@/models/user")
      const user = await User.findOne({ email: session.user.email })

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      // Build query
      const query: any = { user: user._id }

      if (filter === "unread") {
        query.read = false
      } else if (filter === "read") {
        query.read = true
      }

      if (type) {
        query.type = type
      }

      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()

      const unreadCount = await Notification.countDocuments({ user: user._id, read: false })

      return NextResponse.json({
        notifications,
        unreadCount,
      })
    } catch (dbError: any) {
      // Handle MongoDB query errors gracefully
      if (dbError?.name === "MongoServerSelectionError" || dbError?.name === "MongoNetworkError") {
        console.error("MongoDB connection error:", dbError?.message || "Connection failed")
        return NextResponse.json({
          notifications: [],
          unreadCount: 0,
        }, { status: 200 })
      }
      throw dbError
    }
  } catch (error: any) {
    console.error("Error fetching notifications:", error?.message || error)
    // Return empty results instead of error to prevent UI crashes
    return NextResponse.json({
      notifications: [],
      unreadCount: 0,
    }, { status: 200 })
  }
}

// POST - Mark notifications as read
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Try to connect to database with error handling
    try {
      await connectToDatabase()
    } catch (dbError: any) {
      console.error("Database connection error:", dbError?.message || "Connection failed")
      return NextResponse.json({
        success: false,
        error: "Database connection unavailable",
        unreadCount: 0,
      }, { status: 503 })
    }

    try {
      const { User } = await import("@/models/user")
      const user = await User.findOne({ email: session.user.email })

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      const body = await req.json()
      const { notificationIds, markAllAsRead } = body

      if (markAllAsRead) {
        await Notification.updateMany({ user: user._id, read: false }, { read: true, readAt: new Date() })
      } else if (notificationIds && Array.isArray(notificationIds)) {
        await Notification.updateMany(
          { _id: { $in: notificationIds }, user: user._id },
          { read: true, readAt: new Date() }
        )
      } else {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 })
      }

      const unreadCount = await Notification.countDocuments({ user: user._id, read: false })

      return NextResponse.json({
        success: true,
        unreadCount,
      })
    } catch (dbError: any) {
      // Handle MongoDB query errors gracefully
      if (dbError?.name === "MongoServerSelectionError" || dbError?.name === "MongoNetworkError") {
        console.error("MongoDB connection error:", dbError?.message || "Connection failed")
        return NextResponse.json({
          success: false,
          error: "Database connection unavailable",
          unreadCount: 0,
        }, { status: 503 })
      }
      throw dbError
    }
  } catch (error: any) {
    console.error("Error updating notifications:", error?.message || error)
    return NextResponse.json({
      success: false,
      error: "Failed to update notifications",
      unreadCount: 0,
    }, { status: 500 })
  }
}


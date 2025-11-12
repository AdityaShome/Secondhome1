import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

/**
 * Get the current session in App Router API routes
 * This properly handles cookies in Next.js 13+ App Router
 * 
 * Note: getServerSession automatically reads cookies from the request
 * when called in API routes, so we don't need to pass headers explicitly
 */
export async function getSession() {
  try {
    // In App Router, getServerSession reads cookies automatically
    const session = await getServerSession(authOptions)
    
    if (!session) {
      console.log("⚠️ No session found - user not authenticated")
      return null
    }
    
    if (!session.user) {
      console.log("⚠️ Session found but missing user object")
      return null
    }
    
    if (!session.user.id) {
      console.log("⚠️ Session found but missing user.id", {
        user: session.user,
        email: session.user.email,
      })
      return null
    }
    
    console.log("✅ Session found:", {
      userId: session.user.id,
      email: session.user.email,
      role: (session.user as any).role,
    })
    
    return session
  } catch (error: any) {
    console.error("❌ Error getting session:", {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    })
    return null
  }
}


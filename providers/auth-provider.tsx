"use client"

import type React from "react"
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

type User = {
  id: string
  name: string
  email: string
  image?: string
  role: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderContent>{children}</AuthProviderContent>
    </SessionProvider>
  )
}

function AuthProviderContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (status === "loading") {
      setLoading(true)
      return
    }

    if (session?.user) {
      setUser({
        id: session.user.id as string,
        name: session.user.name as string,
        email: session.user.email as string,
        image: session.user.image as string | undefined,
        role: (session.user as any).role || "user",
      })
    } else {
      setUser(null)
    }

    setLoading(false)
  }, [session, status])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      // Prevent Next.js error overlay by catching all errors
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      }).catch((error) => {
        // Silently catch and handle all errors
        console.error("Login error caught:", error)
        return { error: "Invalid login credentials", ok: false }
      })

      // Always show user-friendly message, never show technical errors
      if (result?.error || !result?.ok) {
        toast({
          title: "Login failed",
          description: "Invalid login credentials. Please check your email and password.",
          variant: "destructive",
        })
        return
      }

      if (result?.ok) {
        toast({
          title: "Login successful",
          description: "Welcome back to Second Home!",
        })
        
        // Small delay to ensure session is updated
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 100)
      }
    } catch (error) {
      // Catch any unexpected errors and show user-friendly message
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: "Invalid login credentials. Please check your email and password.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true)
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "Registration failed",
          description: data.error || "An error occurred during registration",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Registration successful",
        description: "You can now log in with your credentials",
      })

      router.push("/login")
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await signOut({ redirect: false })
      router.push("/")
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

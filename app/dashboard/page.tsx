"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tab = searchParams.get("tab") || "overview"
    router.replace(`/profile?tab=${tab}`)
  }, [router, searchParams])

  return null
}

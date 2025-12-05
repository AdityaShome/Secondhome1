"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Send } from "lucide-react"

interface Msg { role: "user" | "agent" | "system"; content: string; ts: string }

export default function AgentJoinPage() {
  const search = useSearchParams()
  const router = useRouter()
  const conversationId = search.get("c") || ""
  const agentToken = search.get("t") || ""

  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Msg[]>([])
  const [status, setStatus] = useState<"pending" | "connected" | "closed">("pending")
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight })
  }, [messages])

  // Initial join
  useEffect(() => {
    if (!conversationId || !agentToken) return
    const join = async () => {
      try {
        setJoining(true)
        await fetch(`/api/contact/chat/${conversationId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agentToken, agentName: "Executive" }),
        })
      } finally {
        setJoining(false)
      }
    }
    join()
  }, [conversationId, agentToken])

  // Poll conversation as agent
  useEffect(() => {
    if (!conversationId || !agentToken) return
    let stop = false
    const poll = async () => {
      try {
        const res = await fetch(`/api/contact/chat/${conversationId}?token=${agentToken}`)
        const data = await res.json()
        if (res.ok && data.success) {
          setMessages(data.messages || [])
          setStatus(data.status)
        }
      } finally {
        setLoading(false)
      }
    }
    const id = setInterval(() => { if (!stop) poll() }, 1500)
    poll()
    return () => { stop = true; clearInterval(id) }
  }, [conversationId, agentToken])

  const disabledSend = useMemo(() => !input.trim() || !conversationId || !agentToken, [input, conversationId, agentToken])

  const send = async () => {
    const content = input.trim()
    if (!content) return
    setInput("")
    // Optimistic
    setMessages((prev) => [...prev, { role: "agent", content, ts: new Date().toISOString() }])
    try {
      await fetch(`/api/contact/chat/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: agentToken, content }),
      })
    } catch {}
  }

  if (!conversationId || !agentToken) {
    return (
      <div className="container mx-auto p-6">
        <Card><CardContent className="p-6">Missing conversation parameters.</CardContent></Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Executive Console</h1>
      <p className="text-sm text-muted-foreground mb-4">Conversation: {conversationId}</p>

      <Card className="border-t-4 border-t-primary">
        <CardContent className="p-0">
          <div className="h-[540px] flex flex-col">
            <div ref={scrollerRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
              {loading ? (
                <div className="p-4 text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading chat…</div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "agent" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow ${m.role === "agent" ? "bg-primary text-primary-foreground" : m.role === "system" ? "bg-amber-100" : "bg-white"}`}>
                      {m.content}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t p-3 flex items-center gap-2">
              <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a reply…" className="min-h-[44px] max-h-[120px] resize-y" />
              <Button onClick={send} disabled={disabledSend} className="h-10">{joining ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

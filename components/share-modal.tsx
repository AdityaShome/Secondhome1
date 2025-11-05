"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Facebook, Twitter, Linkedin, Mail, LinkIcon, Check } from "lucide-react"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  url: string
}

export function ShareModal({ isOpen, onClose, title, url }: ShareModalProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [shareCount, setShareCount] = useState(0)
  const isInitialMount = useRef(true)

  const shareUrl = typeof window !== "undefined" ? url : ""
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)

  useEffect(() => {
    // Only run this effect on client-side after initial render
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    if (isOpen) {
      // Use a fixed number instead of random to avoid hydration mismatch
      setShareCount(42)
    }
  }, [isOpen])

  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "bg-[#1877F2] hover:bg-[#1877F2]/90",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "bg-[#1DA1F2] hover:bg-[#1DA1F2]/90",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "bg-[#0A66C2] hover:bg-[#0A66C2]/90",
    },
    {
      name: "Email",
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      color: "bg-gray-600 hover:bg-gray-600/90",
    },
  ]

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        setCopied(true)
        toast({
          title: "Link copied",
          description: "The link has been copied to your clipboard",
        })

        setTimeout(() => {
          setCopied(false)
        }, 2000)
      },
      (err) => {
        console.error("Could not copy text: ", err)
        toast({
          title: "Failed to copy",
          description: "Please try again or copy the link manually",
          variant: "destructive",
        })
      },
    )
  }

  const handleShare = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer")
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
          <DialogDescription>Share this {title} with others</DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Input value={shareUrl} readOnly className="pr-12" />
          </div>
          <Button type="button" size="sm" className="px-3" onClick={copyToClipboard}>
            {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
            <span className="sr-only">Copy</span>
          </Button>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          {shareLinks.map((link) => (
            <Button
              key={link.name}
              variant="outline"
              size="icon"
              className={`rounded-full h-12 w-12 text-white ${link.color}`}
              onClick={() => handleShare(link.url)}
            >
              <link.icon className="h-5 w-5" />
              <span className="sr-only">Share on {link.name}</span>
            </Button>
          ))}
        </div>

        {shareCount > 0 && (
          <div className="mt-4 text-center text-sm text-muted-foreground">Shared {shareCount} times</div>
        )}
      </DialogContent>
    </Dialog>
  )
}

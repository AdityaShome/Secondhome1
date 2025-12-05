"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"
import { Shield, CheckCircle2, IndianRupee, Loader2, TrendingUp } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface VerifyPropertyButtonProps {
  propertyId: string
  verificationStatus?: "pending" | "verified" | "rejected" | null
  isApproved: boolean
  onVerified?: () => void
}

const VERIFICATION_FEE = 500

export function VerifyPropertyButton({
  propertyId,
  verificationStatus,
  isApproved,
  onVerified,
}: VerifyPropertyButtonProps) {
  const isVerified = verificationStatus === "verified"
  const isPending = verificationStatus === "pending"
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const { data: session } = useSession()

  const handleVerify = async () => {
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please log in to verify your property",
        variant: "destructive",
      })
      return
    }

    if (!isApproved) {
      toast({
        title: "Property Not Approved",
        description: "Your property must be approved before it can be verified",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // In a real implementation, you would initiate payment here
      // For now, we'll show the payment flow
      toast({
        title: "Payment Required",
        description: `Please pay ₹${VERIFICATION_FEE} to verify your property`,
      })

      // After payment is processed, call the verify API
      const response = await fetch(`/api/properties/${propertyId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: `payment_${Date.now()}`, // This would come from payment gateway
          paymentMethod: "upi", // or card, etc.
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Verification failed")
      }

      const data = await response.json()
      toast({
        title: "Payment Successful! ✅",
        description: "Our executive will visit your property soon for verification checks (WiFi test, video check, etc.)",
      })

      setOpen(false)
      if (onVerified) {
        onVerified()
      }
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Could not verify property. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (isVerified) {
    return (
      <Badge className="bg-green-600 text-white border-none">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Verified
      </Badge>
    )
  }

  if (isPending) {
    return (
      <Badge className="bg-yellow-500 text-white border-none">
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        Verification Pending
      </Badge>
    )
  }

  if (!isApproved) {
    return (
      <Badge variant="secondary" className="opacity-60">
        Pending Approval
      </Badge>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Shield className="h-4 w-4" />
          Get Verified Badge
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Verify Your Property
          </DialogTitle>
          <DialogDescription>
            Get a verified badge and increase your leads by 3x!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Benefits */}
          <div className="bg-primary/5 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Benefits of Verification:
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Verified badge displayed on your listing</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>3x more leads and inquiries</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Priority placement in search results</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Higher trust and credibility</span>
              </li>
            </ul>
          </div>

          {/* Pricing */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Verification Fee:</span>
              <div className="flex items-center gap-1">
                <IndianRupee className="h-4 w-4" />
                <span className="text-2xl font-bold">{VERIFICATION_FEE.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              One-time payment. Valid for the lifetime of your listing.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleVerify} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <IndianRupee className="h-4 w-4 mr-1" />
                Pay ₹{VERIFICATION_FEE} & Verify
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


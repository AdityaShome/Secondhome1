"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CreditCard, Wallet, BanknoteIcon as Bank } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

declare global {
  interface Window {
    paypal?: any
  }
}

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  bookingId: string
  amount: number
  propertyName: string
}

export function PaymentModal({ isOpen, onClose, bookingId, amount, propertyName }: PaymentModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState("paypal")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [paypalLoaded, setPaypalLoaded] = useState(false)
  const [paypalButtonsRendered, setPaypalButtonsRendered] = useState(false)

  // Reset PayPal state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPaypalButtonsRendered(false)
      setPaypalLoaded(false)
      return
    }
  }, [isOpen])

  // Load PayPal SDK when user selects PayPal
  useEffect(() => {
    console.log("🚀 PayPal useEffect triggered!", { isOpen, paymentMethod, currentStep })
    
    // Only load PayPal when modal is open AND PayPal is selected
    if (!isOpen || paymentMethod !== "paypal") {
      console.log("❌ Skipping PayPal load:", { isOpen, paymentMethod })
      return
    }

    console.log("✅ Modal is open AND PayPal selected, proceeding with load...")

    // Already loaded
    if (window.paypal) {
      console.log("✅ PayPal already in window")
      setPaypalLoaded(true)
      return
    }

    // Check if script exists but didn't load (zombie script)
    const existingScript = document.querySelector('script[src*="paypal.com/sdk"]')
    if (existingScript) {
      console.log("⏳ Found existing PayPal script tag...")
      
      // If window.paypal exists, we're good
      if (window.paypal && window.paypal.Buttons) {
        console.log("✅ PayPal already fully loaded!")
        setPaypalLoaded(true)
        return
      }
      
      // Script exists but didn't load - remove it and start fresh
      console.log("🗑️ Removing failed/incomplete script tag")
      existingScript.remove()
      // Fall through to create new script below
    }

    // Create script
    const CLIENT_ID = "AeNGuqcpFpzrOUtho49tMU3vs1el4uvTccOO3z5RXyfte2JbkAT-2sY3Zq-cwiaAstq9FZ6XadxWhFdx"
    
    console.log("🔵 Creating PayPal script...")
    console.log("Client ID (full):", CLIENT_ID)
    console.log("Client ID (first 20 chars):", CLIENT_ID.substring(0, 20))
    console.log("Client ID length:", CLIENT_ID.length)
    
    const script = document.createElement('script')
    const scriptUrl = `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&currency=USD`
    script.src = scriptUrl
    script.async = true
    
    console.log("📡 Loading PayPal from URL:")
    console.log(scriptUrl)
    
    script.onload = () => {
      console.log("✅ PayPal script tag loaded!")
      console.log("Checking what's in window.paypal:", window.paypal)
      console.log("Checking window object keys containing 'paypal':", Object.keys(window).filter(k => k.toLowerCase().includes('paypal')))
      
      // Wait for PayPal SDK to actually initialize
      let attempts = 0
      const checkPayPal = setInterval(() => {
        attempts++
        
        if (attempts % 10 === 0) {
          console.log(`🔍 Still checking... attempt ${attempts}`)
          console.log("window.paypal:", window.paypal)
          console.log("typeof window.paypal:", typeof window.paypal)
        }
        
        if (window.paypal) {
          console.log("✅ window.paypal found!")
          console.log("window.paypal keys:", Object.keys(window.paypal))
          console.log("window.paypal.Buttons?", window.paypal.Buttons)
          
          if (window.paypal.Buttons) {
            console.log("✅ window.paypal.Buttons available!")
            clearInterval(checkPayPal)
            setPaypalLoaded(true)
          } else {
            console.log("⚠️ window.paypal exists but no Buttons yet")
          }
        }
        
        if (attempts > 50) { // 5 seconds
          console.error("❌ PayPal SDK never initialized after 5 seconds!")
          console.error("Final window.paypal state:", window.paypal)
          console.error("Check Network tab for failed PayPal script load")
          console.error("Check browser console for PayPal-specific errors")
          clearInterval(checkPayPal)
          toast({
            title: "PayPal Load Failed",
            description: "Check console for details. May be blocked by ad blocker.",
            variant: "destructive",
          })
        }
      }, 100)
    }
    
    script.onerror = (e) => {
      console.error("❌ PayPal script error:", e)
      toast({
        title: "Payment Error",
        description: "Failed to load PayPal SDK. Check your internet connection.",
        variant: "destructive",
      })
    }
    
    document.head.appendChild(script)
    console.log("📄 PayPal script added to <head>")
    console.log("📄 Script element:", script)
    console.log("📄 Script src:", script.src)
    console.log("📄 Script in DOM?", document.head.contains(script))
    console.log("📄 All PayPal scripts in DOM:", document.querySelectorAll('script[src*="paypal"]').length)
  }, [isOpen, paymentMethod, toast])  // Re-run when paymentMethod changes!

  // Render PayPal buttons when ready
  useEffect(() => {
    if (paymentMethod === "paypal" && currentStep === 2 && paypalLoaded && window.paypal && !paypalButtonsRendered) {
      console.log("🔵 All conditions met for PayPal buttons!")
      console.log("- Payment method:", paymentMethod)
      console.log("- Step:", currentStep)
      console.log("- PayPal loaded:", paypalLoaded)
      console.log("- window.paypal:", !!window.paypal)
      console.log("- Buttons rendered:", paypalButtonsRendered)
      
      const timer = setTimeout(() => {
        console.log("⏰ Timer fired - rendering buttons now...")
        renderPayPalButtons()
      }, 500)
      
      return () => {
        console.log("🧹 Cleanup timer")
        clearTimeout(timer)
      }
    } else {
      console.log("⚠️ Waiting for PayPal conditions:", {
        paymentMethod,
        currentStep,
        paypalLoaded,
        hasPayPal: !!window.paypal,
        paypalButtonsRendered
      })
    }
  }, [paymentMethod, currentStep, paypalLoaded, paypalButtonsRendered])

  const renderPayPalButtons = () => {
    console.log("🎯 renderPayPalButtons called")
    
    if (!window.paypal) {
      console.error("❌ window.paypal is not available!")
      toast({
        title: "PayPal Error",
        description: "PayPal SDK not loaded",
        variant: "destructive",
      })
      return
    }
    
    if (!window.paypal.Buttons) {
      console.error("❌ window.paypal.Buttons is not available!")
      toast({
        title: "PayPal Error",
        description: "PayPal Buttons not initialized",
        variant: "destructive",
      })
      return
    }
    
    console.log("✅ window.paypal.Buttons confirmed available!")
    
    if (paypalButtonsRendered) {
      console.log("⚠️ Buttons already rendered, skipping")
      return
    }

    const container = document.getElementById("paypal-button-container")
    if (!container) {
      console.error("❌ Container #paypal-button-container not found!")
      toast({
        title: "Container Error",
        description: "PayPal container not found",
        variant: "destructive",
      })
      return
    }

    console.log("✅ Container found, rendering buttons...")
    // Container is empty by default (hidden), PayPal SDK will populate it

    window.paypal
      .Buttons({
        createOrder: async () => {
          try {
            const response = await fetch("/api/payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                bookingId,
                action: "create",
              }),
            })

            const data = await response.json()

            if (!response.ok) {
              throw new Error(data.error || "Failed to create PayPal order")
            }

            return data.orderId
          } catch (error) {
            console.error("Error creating PayPal order:", error)
            toast({
              title: "Error",
              description: error instanceof Error ? error.message : "Failed to create payment order",
              variant: "destructive",
            })
            throw error
          }
        },
        onApprove: async (data: any) => {
          try {
            setIsProcessing(true)

            const response = await fetch("/api/payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data.orderID,
                action: "capture",
              }),
            })

            const result = await response.json()

            if (!response.ok) {
              throw new Error(result.error || "Payment capture failed")
            }

            // Move to success step
            setCurrentStep(3)

            toast({
              title: "Payment successful",
              description: "Your booking has been confirmed",
            })

            // Redirect to dashboard after 3 seconds
            setTimeout(() => {
              router.push("/dashboard")
              onClose()
            }, 3000)
          } catch (error) {
            console.error("Error capturing payment:", error)
            toast({
              title: "Payment failed",
              description: error instanceof Error ? error.message : "Failed to process payment",
              variant: "destructive",
            })
            setIsProcessing(false)
          }
        },
        onError: (err: any) => {
          console.error("PayPal error:", err)
          toast({
            title: "Payment error",
            description: "An error occurred with PayPal. Please try again.",
            variant: "destructive",
          })
        },
        onCancel: () => {
          toast({
            title: "Payment cancelled",
            description: "You cancelled the payment",
          })
        },
      })
      .render("#paypal-button-container")
      .then(() => {
        console.log("✅ PayPal buttons rendered successfully!")
        setPaypalButtonsRendered(true)
      })
      .catch((error: any) => {
        console.error("❌ PayPal button render error:", error)
        toast({
          title: "Render Error",
          description: "Failed to render PayPal buttons. Please refresh the page.",
          variant: "destructive",
        })
      })
  }

  const handlePayment = async () => {
    if (paymentMethod === "card" && (!cardNumber || !cardName || !cardExpiry || !cardCvv)) {
      toast({
        title: "Missing information",
        description: "Please fill in all card details",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
          paymentMethod,
        }),
      })

      if (!response.ok) {
        throw new Error("Payment failed")
      }

      const data = await response.json()

      // Move to success step
      setCurrentStep(3)

      toast({
        title: "Payment successful",
        description: "Your booking has been confirmed",
      })

      // Redirect to bookings page after 3 seconds
      setTimeout(() => {
        router.push(`/bookings/${bookingId}`)
        onClose()
      }, 3000)
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Pay ₹{amount} to confirm your booking at {propertyName}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="py-4">
                <RadioGroup value={paymentMethod} onValueChange={(value) => {
                  setPaymentMethod(value)
                  setPaypalButtonsRendered(false)
                }} className="space-y-4">
                  <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors bg-blue-50 border-blue-200">
                    <RadioGroupItem value="paypal" id="payment-method-paypal" />
                    <Label htmlFor="payment-method-paypal" className="flex items-center cursor-pointer">
                      <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="#003087">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .759-.653h8.63c2.964 0 4.996 1.242 5.429 3.317.433 2.076-.409 4.515-3.308 5.707l1.846-2.98c1.527-2.466.863-4.86-1.771-6.393C14.894 1.446 12.396.767 9.43.767H3.667a.77.77 0 0 0-.759.653L0 18.336a.641.641 0 0 0 .633.74h4.606a.77.77 0 0 0 .759-.653l1.078-5.086z"/>
                      </svg>
                      PayPal (Recommended)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center cursor-pointer">
                      <CreditCard className="mr-2 h-5 w-5 text-primary" />
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center cursor-pointer">
                      <Wallet className="mr-2 h-5 w-5 text-primary" />
                      UPI
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="netbanking" id="netbanking" />
                    <Label htmlFor="netbanking" className="flex items-center cursor-pointer">
                      <Bank className="mr-2 h-5 w-5 text-primary" />
                      Net Banking
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <DialogFooter>
                <Button onClick={() => setCurrentStep(2)}>Continue</Button>
              </DialogFooter>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="py-4 space-y-4">
                {paymentMethod === "paypal" && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Click the PayPal button below to complete your payment securely.
                    </p>
                    
                    {/* Loading state - OUTSIDE the PayPal container */}
                    {!paypalButtonsRendered && (
                      <div className="flex flex-col items-center gap-3 py-8 mb-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900">Loading PayPal...</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {!paypalLoaded ? "Connecting to PayPal..." : "Preparing payment buttons..."}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">This should take just a moment</p>
                      </div>
                    )}
                    
                    {/* PayPal container - React won't manage this, PayPal SDK will */}
                    <div 
                      id="paypal-button-container" 
                      className="min-h-[150px]"
                      style={{ display: paypalButtonsRendered ? 'block' : 'none' }}
                    ></div>
                  </div>
                )}

                {paymentMethod === "card" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry">Expiry Date</Label>
                        <Input
                          id="cardExpiry"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          maxLength={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardCvv">CVV</Label>
                        <Input
                          id="cardCvv"
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ""))}
                          maxLength={3}
                          type="password"
                        />
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === "upi" && (
                  <div className="space-y-2">
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input id="upiId" placeholder="yourname@upi" />
                  </div>
                )}

                {paymentMethod === "netbanking" && (
                  <div className="space-y-2">
                    <Label htmlFor="bank">Select Bank</Label>
                    <select
                      id="bank"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select your bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="kotak">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                {paymentMethod !== "paypal" && (
                  <Button onClick={handlePayment} disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay ₹${amount}`
                    )}
                  </Button>
                )}
              </DialogFooter>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="py-8 text-center"
            >
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
              <p className="text-muted-foreground mb-6">
                Your booking has been confirmed. You will be redirected to your bookings page shortly.
              </p>
              <div className="animate-pulse">
                <Loader2 className="mx-auto h-6 w-6 text-primary animate-spin" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

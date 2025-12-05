"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Home, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Linkedin, ArrowRight, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export default function Footer() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  // Socials from env so links always work or are hidden if not set
  const socials = useMemo(() => {
    return [
      { Icon: Instagram, label: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL },
      { Icon: Facebook, label: "Facebook", href: process.env.NEXT_PUBLIC_FACEBOOK_URL },
      { Icon: Twitter, label: "Twitter", href: process.env.NEXT_PUBLIC_TWITTER_URL },
      { Icon: Linkedin, label: "LinkedIn", href: process.env.NEXT_PUBLIC_LINKEDIN_URL },
    ].filter((s) => !!s.href)
  }, [])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubscribed(true)
        toast({
          title: "🎉 Successfully Subscribed!",
          description: data.message || "Check your email for confirmation",
        })
        setEmail("")
        
        // Reset after 3 seconds
        setTimeout(() => setIsSubscribed(false), 3000)
      } else {
        toast({
          title: "Subscription Failed",
          description: data.error || "Please try again later",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container px-4 py-16 mx-auto">
        {/* Newsletter Section - Clean & Professional */}
        <div className="max-w-4xl mx-auto mb-16 p-8 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
          <div className="text-center mb-6 space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">Stay Updated</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Get exclusive deals and new property listings directly to your inbox
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 rounded-lg border-gray-300 bg-white focus:border-orange-500 focus:ring-orange-500"
              required
              disabled={isLoading || isSubscribed}
            />
            <Button
              type="submit"
              disabled={isLoading || isSubscribed}
              className="h-12 px-8 rounded-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white gap-2 hover:from-orange-600 hover:to-orange-700 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : isSubscribed ? (
                <>
                  <Check className="h-4 w-4" />
                  Subscribed!
                </>
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <Home className="h-6 w-6 text-orange-500 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-lg font-bold text-gray-900">
                Second Home
              </span>
            </Link>
            <p className="text-gray-600 leading-relaxed">
              Simplifying student accommodation across India. Find your perfect place near campus.
            </p>
            {socials.length > 0 && (
              <div className="flex gap-3 pt-2">
                {socials.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-orange-100 flex items-center justify-center text-orange-500 transition-all duration-300 hover:scale-110 border border-gray-200"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">Explore</h3>
            <ul className="space-y-3">
              {[
                { href: "/listings", label: "PGs & Flats" },
                { href: "/messes", label: "Messes" },
                { href: "/map", label: "Map View" },
                { href: "/register-property", label: "List Property" },
                { href: "/blog", label: "Blog" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-gray-600 hover:text-orange-500 transition-all duration-300 flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-orange-500" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">Popular Colleges</h3>
            <ul className="space-y-3">
              {[
                "Dayananda Sagar College",
                "RV College of Engineering",
                "PES University",
                "BMS College of Engineering",
                "Christ University",
              ].map((college) => (
                <li key={college}>
                  <Link
                    href={`/colleges/${college.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-gray-600 hover:text-orange-500 transition-all duration-300 flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-orange-500" />
                    {college}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group cursor-pointer">
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                  123 Startup Hub, Koramangala
                  <br />
                  Bangalore, India - 560034
                </span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer hover:text-orange-500 transition-colors">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <a href="tel:+917384662005" className="text-gray-600 group-hover:text-gray-900 transition-colors">
                  +91 73846 62005
                </a>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer hover:text-orange-500 transition-colors">
                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <a href="mailto:second.home2k25@gmail.com" className="text-gray-600 group-hover:text-gray-900 transition-colors">
                  second.home2k25@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Second Home. All rights reserved.
            </p>
            <div className="flex gap-6">
              {[
                { href: "/terms", label: "Terms of Service" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/faq", label: "FAQ" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-gray-600 hover:text-orange-500 transition-all duration-300"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

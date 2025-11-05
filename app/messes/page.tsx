"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MapPin, Star, Clock, IndianRupee, Truck, Plus, Loader2, 
  UtensilsCrossed, Search, Filter, Heart
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function MessesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  
  const [messes, setMesses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchMesses()
  }, [])

  const fetchMesses = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/messes")
      if (!res.ok) throw new Error("Failed to fetch messes")
      
      const data = await res.json()
      // Only show approved messes
      const approvedMesses = (data.messes || []).filter((m: any) => m.isApproved && !m.isRejected)
      setMesses(approvedMesses)
    } catch (error) {
      console.error("❌ Error fetching messes:", error)
      toast({
        title: "Error",
        description: "Failed to load messes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredMesses = messes.filter(mess => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      mess.name?.toLowerCase().includes(query) ||
      mess.location?.toLowerCase().includes(query) ||
      mess.city?.toLowerCase().includes(query) ||
      mess.cuisineTypes?.some((c: string) => c.toLowerCase().includes(query))
    )
  })

  const handleListYourMess = () => {
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please login to list your mess service",
        variant: "destructive",
      })
      router.push("/login")
      return
    }
    router.push("/list-mess")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        
        <div className="relative container mx-auto px-4 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Messes Near Your College
            </h1>
            <p className="text-lg md:text-xl text-orange-100 mb-8">
              {filteredMesses.length} {filteredMesses.length === 1 ? 'mess' : 'messes'} available
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-2xl p-2 flex gap-2">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by name, location, or cuisine..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-none focus-visible:ring-0 text-gray-900 placeholder:text-gray-500"
                />
              </div>
              <Button 
                className="bg-orange-500 hover:bg-orange-600 px-8"
              >
                Search
              </Button>
            </div>
          </motion.div>

          {/* List Your Mess Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center"
          >
            <Button
              size="lg"
              onClick={handleListYourMess}
              className="bg-white text-orange-600 hover:bg-white/90 shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              List Your Mess Service
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Browse Available Messes</h2>
            <p className="text-gray-600 mt-1">Delicious homemade food for students</p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-5">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredMesses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-2xl mx-auto"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <UtensilsCrossed className="w-12 h-12 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {searchQuery ? "No Messes Found" : "No Messes Available Yet"}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchQuery 
                ? "Try adjusting your search or filters to find what you're looking for." 
                : "Be the first to list your mess service on our platform!"}
            </p>
            {searchQuery ? (
              <Button onClick={() => setSearchQuery("")} variant="outline">
                Clear Search
              </Button>
            ) : (
              <Button onClick={handleListYourMess} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                <Plus className="w-4 h-4 mr-2" />
                List Your Mess Service
              </Button>
            )}
          </motion.div>
        )}

        {/* Mess Cards */}
        {!loading && filteredMesses.length > 0 && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredMesses.map((mess, index) => (
                <MessCard key={mess._id} mess={mess} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

// Mess Card Component
function MessCard({ mess, index }: { mess: any; index: number }) {
  const router = useRouter()
  const [imageError, setImageError] = useState(false)

  const formatPrice = (price: number) => {
    if (price >= 100000) return `${(price / 100000).toFixed(1)}L`
    if (price >= 1000) return `${(price / 1000).toFixed(0)}K`
    return price.toString()
  }

  const getMessImage = () => {
    if (mess.images && mess.images.length > 0) {
      return mess.images[0]
    }
    return "/placeholder-mess.jpg"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className="group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white"
        onClick={() => router.push(`/messes/${mess._id}`)}
      >
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imageError ? "/placeholder-mess.jpg" : getMessImage()}
            alt={mess.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <Badge className="bg-orange-500/90 text-white backdrop-blur">
              Mess
            </Badge>
            {mess.homeDeliveryAvailable && (
              <Badge className="bg-green-500/90 text-white backdrop-blur flex items-center gap-1">
                <Truck className="w-3 h-3" />
                Home Delivery
              </Badge>
            )}
          </div>

          {/* Price */}
          <div className="absolute bottom-4 right-4">
            <div className="bg-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
              ₹{formatPrice(mess.monthlyPrice)}/mo
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-orange-500 transition-colors">
            {mess.name}
          </h3>

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-2 text-orange-500" />
            <span className="text-sm line-clamp-1">
              {mess.location || mess.city || "Location not specified"}
            </span>
          </div>

          {/* Rating */}
          {mess.rating > 0 && (
            <div className="flex items-center mb-4">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
              <span className="font-semibold text-gray-900">{mess.rating}</span>
              <span className="text-gray-500 text-sm ml-2">
                ({mess.reviews || 0} reviews)
              </span>
            </div>
          )}

          {/* Meal Times */}
          {mess.openingHours && (
            <div className="mb-4 space-y-1">
              {mess.openingHours.breakfast && (
                <div className="flex items-center text-xs text-gray-600">
                  <Clock className="w-3 h-3 mr-2" />
                  <span>Breakfast: {mess.openingHours.breakfast}</span>
                </div>
              )}
            </div>
          )}

          {/* Diet Types */}
          {mess.dietTypes && mess.dietTypes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {mess.dietTypes.slice(0, 3).map((diet: string, idx: number) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {diet}
                </Badge>
              ))}
            </div>
          )}

          {/* Daily Price */}
          {mess.dailyPrice && (
            <div className="text-sm text-blue-600 font-medium">
              ₹{mess.dailyPrice}/day
            </div>
          )}

          {/* View Details Button */}
          <Button 
            className="w-full mt-4 bg-orange-500 hover:bg-orange-600"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/messes/${mess._id}`)
            }}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

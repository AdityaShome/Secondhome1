"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  X,
  MapPin,
  TrendingUp,
  Clock,
  Mic,
  MicOff,
  Sparkles,
  GraduationCap,
  ArrowRight,
  Loader2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useDebounce } from "@/hooks/use-debounce"

interface SmartSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SearchSuggestion {
  id: string
  text: string
  type: "location" | "college" | "property" | "area"
  icon: any
  count?: number
}

export function SmartSearchModal({ isOpen, onClose }: SmartSearchModalProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)

  const debouncedQuery = useDebounce(query, 300)

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("recentSearches")
    if (stored) {
      setRecentSearches(JSON.parse(stored))
    }
  }, [])

  // Initialize voice recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "en-IN"

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setQuery(transcript)
        setIsListening(false)
        handleSearch(transcript)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery("")
      setSuggestions([])
      setSelectedIndex(-1)
    }
  }, [isOpen])

  // Fetch search suggestions
  useEffect(() => {
    if (debouncedQuery.trim().length > 0) {
      fetchSuggestions(debouncedQuery)
    } else {
      setSuggestions([])
    }
  }, [debouncedQuery])

  const fetchSuggestions = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      // Fetch from multiple sources
      const [propertiesRes, collegesRes] = await Promise.all([
        fetch(`/api/properties?location=${encodeURIComponent(searchQuery)}&limit=5`),
        fetch(`/api/colleges?search=${encodeURIComponent(searchQuery)}`),
      ])

      const suggestionsList: SearchSuggestion[] = []

      // Properties/Locations
      if (propertiesRes.ok) {
        const propertiesData = await propertiesRes.json()
        const properties = propertiesData.properties || []
        
        // Extract unique locations
        const uniqueLocations = new Set<string>()
        properties.forEach((p: any) => {
          if (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase())) {
            uniqueLocations.add(p.location)
          }
        })

        Array.from(uniqueLocations).slice(0, 3).forEach((location) => {
          suggestionsList.push({
            id: `location-${location}`,
            text: location,
            type: "location",
            icon: MapPin,
            count: properties.filter((p: any) => p.location === location).length,
          })
        })
      }

      // Colleges
      if (collegesRes.ok) {
        const collegesData = await collegesRes.json()
        const colleges = collegesData.colleges || collegesData || []
        
        colleges.slice(0, 3).forEach((college: any) => {
          suggestionsList.push({
            id: `college-${college._id || college.name}`,
            text: college.name,
            type: "college",
            icon: GraduationCap,
          })
        })
      }

      // Popular areas if query is short
      if (searchQuery.length < 4) {
        const popularAreas = [
          "Indiranagar",
          "Koramangala",
          "HSR Layout",
          "Whitefield",
          "Marathahalli",
          "BTM Layout",
          "Jayanagar",
          "Rajajinagar",
        ]
        
        popularAreas
          .filter((area) => area.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 2)
          .forEach((area) => {
            suggestionsList.push({
              id: `area-${area}`,
              text: area,
              type: "area",
              icon: MapPin,
            })
          })
      }

      setSuggestions(suggestionsList)
    } catch (error) {
      console.error("Error fetching suggestions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert("Voice search is not supported in your browser")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const handleSearch = useCallback(
    (searchQuery?: string) => {
      const finalQuery = searchQuery || query.trim()
      if (!finalQuery) return

      // Save to recent searches
      const newRecent = [finalQuery, ...recentSearches.filter((s) => s !== finalQuery)].slice(0, 5)
      setRecentSearches(newRecent)
      localStorage.setItem("recentSearches", JSON.stringify(newRecent))

      // Navigate to listings with search query
      router.push(`/listings?query=${encodeURIComponent(finalQuery)}`)
      onClose()
    },
    [query, recentSearches, router, onClose]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSuggestionClick(suggestions[selectedIndex])
      } else {
        handleSearch()
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1))
    } else if (e.key === "Escape") {
      onClose()
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text)
    handleSearch(suggestion.text)
  }

  const popularSearches = [
    "PG near college",
    "Girls PG",
    "Boys hostel",
    "Furnished flats",
    "Near metro",
    "Budget accommodation",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 gap-0 max-h-[90vh] overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Smart Search</DialogTitle>
        </DialogHeader>
        
        {/* Search Input */}
        <div className="p-6 border-b bg-white sticky top-0 z-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search by location, college, area, or property..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelectedIndex(-1)
              }}
              onKeyDown={handleKeyDown}
              className="pl-12 pr-24 h-14 text-lg border-2 focus:border-purple-500 rounded-xl"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {query && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuery("")}
                  className="h-10 w-10 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleVoiceSearch}
                className={`h-10 w-10 rounded-full ${isListening ? "bg-red-100 text-red-600" : ""}`}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5 animate-pulse" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center gap-2 text-red-600 text-sm"
            >
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              Listening... Say your search query
            </motion.div>
          )}
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {query.trim().length === 0 ? (
            <div className="p-6 space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <h3 className="font-semibold text-gray-700">Recent Searches</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick({ id: `recent-${idx}`, text: search, type: "location", icon: MapPin })}
                        className="rounded-full"
                      >
                        {search}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <h3 className="font-semibold text-gray-700">Popular Searches</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {popularSearches.map((search, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      onClick={() => {
                        setQuery(search)
                        handleSearch(search)
                      }}
                      className="justify-start text-left h-auto py-3 px-4 hover:bg-purple-50 hover:border-purple-300"
                    >
                      <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                      {search}
                    </Button>
                  ))}
                </div>
              </div>

            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            </div>
          ) : suggestions.length > 0 ? (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3 px-2">
                <Search className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Search Suggestions</span>
              </div>
              <div className="space-y-1">
                <AnimatePresence>
                  {suggestions.map((suggestion, idx) => {
                    const Icon = suggestion.icon
                    const isSelected = selectedIndex === idx
                    return (
                      <motion.button
                        key={suggestion.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        ref={(el) => {
                          if (isSelected && el) {
                            el.scrollIntoView({ behavior: "smooth", block: "nearest" })
                          }
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                          isSelected
                            ? "bg-purple-50 border border-purple-200"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          suggestion.type === "college"
                            ? "bg-blue-100 text-blue-600"
                            : suggestion.type === "area"
                            ? "bg-green-100 text-green-600"
                            : "bg-purple-100 text-purple-600"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{suggestion.text}</div>
                          <div className="text-xs text-gray-500 capitalize">{suggestion.type}</div>
                        </div>
                        {suggestion.count !== undefined && (
                          <Badge variant="secondary" className="text-xs">
                            {suggestion.count} properties
                          </Badge>
                        )}
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </motion.button>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No results found for &quot;{query}&quot;</p>
              <p className="text-sm text-gray-400 mt-2">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {query.trim().length > 0 && (
          <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Press <kbd className="px-2 py-1 bg-white border rounded">Enter</kbd> to search
            </div>
            <Button onClick={() => handleSearch()} className="bg-purple-600 hover:bg-purple-700">
              Search
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}


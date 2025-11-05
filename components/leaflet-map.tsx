"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LeafletMapProps {
  latitude?: number
  longitude?: number
  title?: string
  height?: string
  markers?: Array<{
    lat: number
    lng: number
    title: string
    type?: "property" | "amenity" | "transport"
  }>
  zoom?: number
}

export function LeafletMap({
  latitude = 12.9716,
  longitude = 77.5946,
  title = "Location",
  height = "h-96",
  markers = [],
  zoom = 13,
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Create map
    const map = L.map(mapRef.current).setView([latitude, longitude], zoom)

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map)

    // Add main marker
    const mainIcon = L.divIcon({
      html: `<div class="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full border-4 border-white shadow-lg">
        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      </div>`,
      className: "",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    })

    L.marker([latitude, longitude], { icon: mainIcon }).addTo(map).bindPopup(title)

    // Add custom markers
    const propertyIcon = L.divIcon({
      html: `<div class="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-accent to-accent/80 rounded-full border-2 border-white shadow-md">
        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      </div>`,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    })

    const amenityIcon = L.divIcon({
      html: `<div class="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-secondary to-secondary/80 rounded-full border-2 border-white shadow-md">
        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 4a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2H6zm3 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </div>`,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    })

    markers.forEach((marker) => {
      let icon = propertyIcon
      if (marker.type === "amenity") icon = amenityIcon
      else if (marker.type === "transport") icon = amenityIcon

      L.marker([marker.lat, marker.lng], { icon }).addTo(map).bindPopup(marker.title)
    })

    mapInstanceRef.current = map
    setLoading(false)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [latitude, longitude, markers, zoom])

  const handleCurrentLocation = () => {
    if (navigator.geolocation && mapInstanceRef.current) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        mapInstanceRef.current?.setView([latitude, longitude], 15)
      })
    }
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg">
      <div ref={mapRef} className={`w-full ${height} bg-gray-100`} />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="animate-spin">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
        </div>
      )}
      <Button
        size="sm"
        className="absolute top-4 right-4 z-10 rounded-full bg-white text-foreground hover:bg-gray-100 shadow-lg"
        onClick={handleCurrentLocation}
      >
        <Navigation className="w-4 h-4" />
      </Button>
    </div>
  )
}

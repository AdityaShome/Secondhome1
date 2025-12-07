"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, CheckCircle2, IndianRupee, Sparkles, Clock, ShieldCheck } from "lucide-react"

export interface SettlingInKit {
  packageId: string
  packageName: string
  description: string
  price: number
  items: string[]
  popular?: boolean
  valueProp?: string
}

const SETTLING_IN_KITS: SettlingInKit[] = [
  {
    packageId: "starter",
    packageName: "Day Zero Starter",
    description: "Bare essentials ready before you walk in",
    price: 1299,
    items: ["Mattress (single)", "Bucket + mug", "Hangers (6)", "Extension cord (5m)", "Torch"],
    valueProp: "Fastest drop",
  },
  {
    packageId: "comfort",
    packageName: "Comfort Pack",
    description: "Delivered and placed in your room ~2h before check-in",
    price: 1999,
    items: [
      "Mattress (single)",
      "Pillow",
      "Bed sheet + cover",
      "Bucket + mug set",
      "Extension cord (10m)",
      "Door mat",
      "Dustbin + liners",
      "20L water can",
    ],
    popular: true,
    valueProp: "Best value",
  },
  {
    packageId: "premium",
    packageName: "Premium Pack",
    description: "Full setup with quality upgrades and extras",
    price: 2599,
    items: [
      "Premium mattress (single)",
      "Pillows (2)",
      "Premium bed sheet set",
      "Bucket + mug set",
      "Extension cord (15m)",
      "Door mat",
      "Study lamp",
      "Storage box",
      "Cleaning wipes + repellent",
      "Dustbin + liners",
    ],
    valueProp: "Everything covered",
  },
]

interface SettlingInKitsProps {
  selectedKit: SettlingInKit | null
  onKitSelect: (kit: SettlingInKit | null) => void
  orientation?: "grid" | "stacked"
}

export function SettlingInKits({ selectedKit, onKitSelect, orientation = "grid" }: SettlingInKitsProps) {
  const gridClass =
    orientation === "stacked" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Package className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">Settling In Kits</h3>
        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
          Optional
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Delivered and placed in your room ~2 hours before check-in (or as soon as you arrive if you book last-minute). No runs to the store, no carrying bulky basics.
      </p>

      <div className={`grid ${gridClass} gap-4`}>
        {SETTLING_IN_KITS.map((kit) => {
          const isSelected = selectedKit?.packageId === kit.packageId

          return (
            <Card
              key={kit.packageId}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "ring-2 ring-primary shadow-lg"
                  : "hover:shadow-md hover:border-primary/50"
              } ${kit.popular ? "border-orange-300" : ""}`}
              onClick={() => onKitSelect(isSelected ? null : kit)}
            >
              {kit.popular && (
                <div className="bg-orange-500 text-white text-xs font-semibold text-center py-1">
                  ⭐ MOST POPULAR
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{kit.packageName}</CardTitle>
                    <CardDescription className="text-xs mt-1">{kit.description}</CardDescription>
                  </div>
                  {isSelected && <CheckCircle2 className="h-5 w-5 text-primary" />}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Price */}
                  <div className="flex items-baseline gap-1">
                    <IndianRupee className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">{kit.price.toLocaleString()}</span>
                  </div>

                  {kit.valueProp && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 w-fit">
                      <ShieldCheck className="h-4 w-4" />
                      {kit.valueProp}
                    </div>
                  )}

                  {/* Items List */}
                  <ul className="space-y-1.5">
                    {kit.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Select Button */}
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className="w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation()
                      onKitSelect(isSelected ? null : kit)
                    }}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Selected
                      </>
                    ) : (
                      "Select Package"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Info Banner */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 mb-1">Day Zero delivery guarantee</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                We schedule delivery ~2 hours before your chosen check-in. If you book inside the 2-hour window, we auto-upgrade to fastest dispatch and target your arrival time. Photo proof on drop + warden handoff.
              </p>
            </div>
            <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

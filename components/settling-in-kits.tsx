"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Package, CheckCircle2, IndianRupee, Sparkles } from "lucide-react"

interface SettlingInKit {
  packageId: string
  packageName: string
  description: string
  price: number
  items: string[]
  popular?: boolean
}

const SETTLING_IN_KITS: SettlingInKit[] = [
  {
    packageId: "starter",
    packageName: "Starter Pack",
    description: "Essential items to get you started",
    price: 899,
    items: ["Mattress (Single)", "Bucket", "Mug", "Extension Cord (5m)", "Torch"],
  },
  {
    packageId: "comfort",
    packageName: "Comfort Pack",
    description: "Everything you need for a comfortable stay",
    price: 1499,
    items: ["Mattress (Single)", "Pillow", "Bed Sheet Set", "Bucket", "Mug", "Extension Cord (10m)", "Torch", "Door Mat"],
    popular: true,
  },
  {
    packageId: "premium",
    packageName: "Premium Pack",
    description: "Complete setup with premium quality items",
    price: 2499,
    items: [
      "Premium Mattress (Single)",
      "Pillows (2)",
      "Premium Bed Sheet Set",
      "Bucket + Mug Set",
      "Extension Cord (15m)",
      "Torch",
      "Door Mat",
      "Study Lamp",
      "Wall Hooks Set",
      "Storage Box",
    ],
  },
]

interface SettlingInKitsProps {
  selectedKit: SettlingInKit | null
  onKitSelect: (kit: SettlingInKit | null) => void
}

export function SettlingInKits({ selectedKit, onKitSelect }: SettlingInKitsProps) {
  const [hoveredKit, setHoveredKit] = useState<string | null>(null)

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
        Get everything delivered to your room on Day 1. Skip the hassle of buying essentials separately!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SETTLING_IN_KITS.map((kit) => {
          const isSelected = selectedKit?.packageId === kit.packageId
          const isHovered = hoveredKit === kit.packageId

          return (
            <Card
              key={kit.packageId}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "ring-2 ring-primary shadow-lg"
                  : "hover:shadow-md hover:border-primary/50"
              } ${kit.popular ? "border-orange-300" : ""}`}
              onMouseEnter={() => setHoveredKit(kit.packageId)}
              onMouseLeave={() => setHoveredKit(null)}
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
              <p className="text-sm font-medium text-blue-900 mb-1">
                Delivered to Your Room on Day 1
              </p>
              <p className="text-xs text-blue-700">
                All items will be delivered to your accommodation on the day you move in. 
                No need to carry heavy items or search for stores!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


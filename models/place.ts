import mongoose, { Schema, type Document } from "mongoose"

export interface IPlace extends Document {
  name: string
  type: "restaurant" | "hospital" | "bus_stop" | "metro_station" | "college"
  address: string
  location: string
  coordinates: {
    type: string
    coordinates: [number, number]
  }
  rating?: number
  contact?: string
  website?: string
  openingHours?: string
  createdAt: Date
  updatedAt?: Date
}

const PlaceSchema = new Schema<IPlace>({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["restaurant", "hospital", "bus_stop", "metro_station", "college"],
    required: true,
  },
  address: { type: String, required: true },
  location: { type: String, required: true },
  coordinates: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true },
  },
  rating: { type: Number },
  contact: { type: String },
  website: { type: String },
  openingHours: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
})

// Create geospatial index for location-based queries
PlaceSchema.index({ coordinates: "2dsphere" })

export const Place = mongoose.models.Place || mongoose.model<IPlace>("Place", PlaceSchema)

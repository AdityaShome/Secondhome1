import mongoose, { Schema, type Document } from "mongoose"

export interface ICollege extends Document {
  name: string
  shortName?: string
  description?: string
  address: string
  city: string
  state: string
  coordinates: {
    type: string
    coordinates: [number, number]
  }
  website?: string
  contact?: string
  image?: string
  courses?: string[]
  createdAt: Date
  updatedAt?: Date
}

const CollegeSchema = new Schema<ICollege>({
  name: { type: String, required: true },
  shortName: { type: String },
  description: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  coordinates: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true },
  },
  website: { type: String },
  contact: { type: String },
  image: { type: String },
  courses: { type: [String] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
})

// Create geospatial index for location-based queries
CollegeSchema.index({ coordinates: "2dsphere" })

export const College = mongoose.models.College || mongoose.model<ICollege>("College", CollegeSchema)

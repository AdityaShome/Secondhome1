import mongoose, { Schema, type Document } from "mongoose"

interface IRoomType {
  type: string
  price: number
  available: number
}

interface IDistance {
  college: number
  hospital: number
  busStop: number
  metro: number
}

interface INearbyPlace {
  name: string
  distance: number
  rating?: number
  type: string
}

interface INearbyCollege {
  name: string
  distance: number
}

export interface IProperty extends Document {
  title: string
  description: string
  type: "PG" | "Flat"
  gender: "Male" | "Female" | "Unisex"
  address: string
  location: string
  coordinates: {
    type: string
    coordinates: [number, number]
  }
  price: number
  deposit: number
  images: string[]
  amenities: string[]
  rules: string[]
  roomTypes: IRoomType[]
  distance: IDistance
  nearbyPlaces: {
    messes: INearbyPlace[]
    restaurants: INearbyPlace[]
    hospitals: INearbyPlace[]
    transport: INearbyPlace[]
  }
  nearbyColleges: INearbyCollege[]
  owner: mongoose.Types.ObjectId
  rating: number
  reviews: number
  isApproved: boolean
  isRejected?: boolean
  approvedAt?: Date
  approvedBy?: mongoose.Types.ObjectId
  rejectedAt?: Date
  rejectedBy?: mongoose.Types.ObjectId
  rejectionReason?: string
  approvalMethod?: "manual" | "AI"
  aiReview?: {
    reviewed: boolean
    reviewedAt: Date
    confidence: number
    score: number
    recommendation: string
    analysis: any
    redFlags: string[]
    reason: string
  }
  createdAt: Date
  updatedAt?: Date
}

const PropertySchema = new Schema<IProperty>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ["PG", "Flat"], required: true },
  gender: { type: String, enum: ["Male", "Female", "Unisex"], required: true },
  address: { type: String, required: true },
  location: { type: String, required: true },
  coordinates: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true },
  },
  price: { type: Number, required: true },
  deposit: { type: Number, required: true },
  images: { type: [String], required: true },
  amenities: { type: [String], required: true },
  rules: { type: [String] },
  roomTypes: [
    {
      type: { type: String, required: true },
      price: { type: Number, required: true },
      available: { type: Number, required: true },
    },
  ],
  distance: {
    college: { type: Number },
    hospital: { type: Number },
    busStop: { type: Number },
    metro: { type: Number },
  },
  nearbyPlaces: {
    messes: [
      {
        name: { type: String },
        distance: { type: Number },
        rating: { type: Number },
        type: { type: String, default: "mess" },
      },
    ],
    restaurants: [
      {
        name: { type: String },
        distance: { type: Number },
        rating: { type: Number },
        type: { type: String, default: "restaurant" },
      },
    ],
    hospitals: [
      {
        name: { type: String },
        distance: { type: Number },
        rating: { type: Number },
        type: { type: String, default: "hospital" },
      },
    ],
    transport: [
      {
        name: { type: String },
        distance: { type: Number },
        type: { type: String, enum: ["bus_stop", "metro_station"] },
      },
    ],
  },
  nearbyColleges: [
    {
      name: { type: String },
      distance: { type: Number },
    },
  ],
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: false },
  isRejected: { type: Boolean, default: false },
  approvedAt: { type: Date },
  approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
  rejectedAt: { type: Date },
  rejectedBy: { type: Schema.Types.ObjectId, ref: "User" },
  rejectionReason: { type: String },
  approvalMethod: { type: String, enum: ["manual", "AI"] },
  aiReview: {
    reviewed: { type: Boolean, default: false },
    reviewedAt: { type: Date },
    confidence: { type: Number },
    score: { type: Number },
    recommendation: { type: String },
    analysis: { type: Schema.Types.Mixed },
    redFlags: [{ type: String }],
    reason: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
})

// Create geospatial index for location-based queries
PropertySchema.index({ coordinates: "2dsphere" })

export const Property = mongoose.models.Property || mongoose.model<IProperty>("Property", PropertySchema)

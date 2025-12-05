import mongoose, { Schema, type Document } from "mongoose"

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId
  property: mongoose.Types.ObjectId
  roomType: string
  price: number
  totalAmount: number
  guests?: number
  checkInDate: Date
  checkOutDate?: Date
  status: "pending" | "confirmed" | "cancelled" | "completed"
  paymentStatus: "pending" | "paid" | "refunded"
  paymentMethod?: "paypal" | "card" | "upi" | "fintech"
  paymentId?: string
  // Business Model - Revenue Stream 2: Booking Commission
  firstMonthRent: number
  commissionRate: number // 5-10%
  commissionAmount: number
  // Business Model - Revenue Stream 4: Settling In Kits
  settlingInKit?: {
    packageId: string
    packageName: string
    price: number
    items: string[]
  }
  createdAt: Date
  updatedAt?: Date
}

const BookingSchema = new Schema<IBooking>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  property: { type: Schema.Types.ObjectId, ref: "Property", required: true },
  roomType: { type: String, required: true },
  price: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  guests: { type: Number, default: 1 },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "refunded"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["paypal", "card", "upi", "fintech"],
  },
  paymentId: { type: String },
  // Business Model - Revenue Stream 2: Booking Commission
  firstMonthRent: { type: Number },
  commissionRate: { type: Number, default: 7.5 }, // Default 7.5% (middle of 5-10%)
  commissionAmount: { type: Number },
  // Business Model - Revenue Stream 4: Settling In Kits
  settlingInKit: {
    packageId: { type: String },
    packageName: { type: String },
    price: { type: Number },
    items: [{ type: String }],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
})

export const Booking = mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema)

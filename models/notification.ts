import mongoose, { Schema, type Document } from "mongoose"

export interface INotification extends Document {
  user: mongoose.Types.ObjectId
  type: "booking" | "property" | "offer" | "review" | "system" | "payment" | "message"
  title: string
  message: string
  link?: string
  icon?: string
  image?: string
  read: boolean
  priority: "low" | "medium" | "high"
  metadata?: {
    bookingId?: string
    propertyId?: string
    amount?: number
    [key: string]: any
  }
  createdAt: Date
  readAt?: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["booking", "property", "offer", "review", "system", "payment", "message"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    icon: { type: String },
    image: { type: String },
    read: { type: Boolean, default: false, index: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    metadata: { type: Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now, index: true },
    readAt: { type: Date },
  },
  { timestamps: true }
)

// Compound index for efficient queries
NotificationSchema.index({ user: 1, read: 1, createdAt: -1 })
NotificationSchema.index({ user: 1, createdAt: -1 })

export const Notification =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema)


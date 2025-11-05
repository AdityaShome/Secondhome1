import mongoose, { Schema, type Document } from "mongoose"

export interface IReview extends Document {
  user: mongoose.Types.ObjectId
  itemType: "property" | "mess"
  itemId: mongoose.Types.ObjectId
  rating: number
  comment: string
  helpfulCount: number
  helpfulUsers: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt?: Date
}

const ReviewSchema = new Schema<IReview>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  itemType: { type: String, enum: ["property", "mess"], required: true },
  itemId: { type: Schema.Types.ObjectId, required: true, refPath: "itemType" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  helpfulCount: { type: Number, default: 0 },
  helpfulUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
})

// Create a compound index to ensure a user can only review an item once
ReviewSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true })

export const Review = mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema)

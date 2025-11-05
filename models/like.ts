import mongoose, { Schema, type Document } from "mongoose"

export interface ILike extends Document {
  user: mongoose.Types.ObjectId
  itemType: "property" | "mess"
  itemId: mongoose.Types.ObjectId
  createdAt: Date
}

const LikeSchema = new Schema<ILike>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  itemType: { type: String, enum: ["property", "mess"], required: true },
  itemId: { type: Schema.Types.ObjectId, required: true, refPath: "itemType" },
  createdAt: { type: Date, default: Date.now },
})

// Create a compound index to ensure a user can only like an item once
LikeSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true, name: "user_itemType_itemId_unique" })

export const Like = mongoose.models.Like || mongoose.model<ILike>("Like", LikeSchema)

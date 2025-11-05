import mongoose, { Schema, Document } from "mongoose"

export interface IFavorite extends Document {
  user: mongoose.Types.ObjectId
  property: mongoose.Types.ObjectId
  createdAt: Date
}

const FavoriteSchema = new Schema<IFavorite>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Create compound index to ensure user can't favorite same property twice
FavoriteSchema.index({ user: 1, property: 1 }, { unique: true })

export const Favorite = mongoose.models.Favorite || mongoose.model<IFavorite>("Favorite", FavoriteSchema)


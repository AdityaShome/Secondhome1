import mongoose, { Schema, Document, models, model } from "mongoose"

export interface IContactMessage {
  role: "user" | "agent" | "system"
  content: string
  ts: Date
}

export interface IContactConversation extends Document {
  userName?: string
  userEmail: string
  userPhone?: string
  status: "pending" | "connected" | "closed"
  messages: IContactMessage[]
  agentName?: string
  agentJoinedAt?: Date
  userToken: string
  agentToken: string
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<IContactMessage>({
  role: { type: String, enum: ["user", "agent", "system"], required: true },
  content: { type: String, required: true },
  ts: { type: Date, default: Date.now },
})

const ContactConversationSchema = new Schema<IContactConversation>({
  userName: String,
  userEmail: { type: String, required: true },
  userPhone: String,
  status: { type: String, enum: ["pending", "connected", "closed"], default: "pending" },
  messages: { type: [MessageSchema], default: [] },
  agentName: String,
  agentJoinedAt: Date,
  userToken: { type: String, required: true },
  agentToken: { type: String, required: true },
}, { timestamps: true })

export const ContactConversation = models.ContactConversation || model<IContactConversation>("ContactConversation", ContactConversationSchema)

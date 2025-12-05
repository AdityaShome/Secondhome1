import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { connectToDatabase } from "@/lib/mongodb"
import { Property } from "@/models/property"
import mongoose from "mongoose"

// Verification fee: ₹500 one-time (Business Model - Revenue Stream 1)
const VERIFICATION_FEE = 500

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { paymentId, paymentMethod } = await req.json()
    const propertyId = params.id

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return NextResponse.json({ error: "Invalid property ID" }, { status: 400 })
    }

    await connectToDatabase()

    // Find property and verify ownership
    const property = await Property.findById(propertyId)

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Check if property belongs to the user
    if (property.owner.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "You don't own this property" },
        { status: 403 }
      )
    }

    // Check if already verified or pending
    if (property.verificationStatus === "verified") {
      return NextResponse.json(
        { error: "Property is already verified", property },
        { status: 400 }
      )
    }

    if (property.verificationStatus === "pending") {
      return NextResponse.json(
        { error: "Verification is already pending. Executive visit scheduled.", property },
        { status: 400 }
      )
    }

    // Check if property is approved first
    if (!property.isApproved) {
      return NextResponse.json(
        { error: "Property must be approved before verification" },
        { status: 400 }
      )
    }

    // Update property: Payment done → Status = "pending" (awaiting executive visit)
    property.verificationStatus = "pending"
    property.verificationFee = VERIFICATION_FEE
    property.verificationPaymentId = paymentId
    property.verificationPaidAt = new Date()
    property.updatedAt = new Date()

    await property.save()

    return NextResponse.json({
      success: true,
      message: "Payment successful! Our executive will visit your property soon for verification checks.",
      verificationStatus: "pending",
      property: {
        _id: property._id,
        title: property.title,
        verificationStatus: property.verificationStatus,
        verificationPaidAt: property.verificationPaidAt,
      },
    })
  } catch (error: any) {
    console.error("Verification error:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to verify property",
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check verification status and initiate payment
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const propertyId = params.id

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return NextResponse.json({ error: "Invalid property ID" }, { status: 400 })
    }

    await connectToDatabase()

    const property = await Property.findById(propertyId)
      .select("title isVerified verificationFee owner isApproved")

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    if (property.owner.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "You don't own this property" },
        { status: 403 }
      )
    }

    return NextResponse.json({
      verificationStatus: property.verificationStatus || null,
      isVerified: property.verificationStatus === "verified",
      verificationFee: VERIFICATION_FEE,
      canVerify: property.isApproved && !property.verificationStatus,
      property: {
        _id: property._id,
        title: property.title,
      },
    })
  } catch (error: any) {
    console.error("Error fetching verification status:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch verification status",
      },
      { status: 500 }
    )
  }
}


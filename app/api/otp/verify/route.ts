import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { OTP } from "@/models/otp"

export async function POST(req: Request) {
  try {
    const { email, otp, type = "registration" } = await req.json()

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
    }

    await connectToDatabase()

    // Find OTP
    const otpRecord = await OTP.findOne({
      email,
      otp,
      type,
    })

    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id })
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 })
    }

    // Delete OTP after successful verification
    await OTP.deleteOne({ _id: otpRecord._id })

    return NextResponse.json({ 
      message: "OTP verified successfully",
      verified: true
    })
  } catch (error) {
    console.error("❌ Error verifying OTP:", error)
    return NextResponse.json(
      { 
        error: "Failed to verify OTP",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}


import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function GET() {
  try {
    // Check if credentials exist (support both naming conventions)
    const emailUser = process.env.EMAIL_USER || process.env.HOST_EMAIL
    const emailPassword = process.env.EMAIL_PASSWORD || process.env.HOST_EMAIL_PASSWORD
    
    if (!emailUser || !emailPassword) {
      return NextResponse.json({
        success: false,
        error: "SMTP credentials not configured",
        help: "Add EMAIL_USER/HOST_EMAIL and EMAIL_PASSWORD/HOST_EMAIL_PASSWORD to .env.local",
        emailUser: emailUser ? "✅ Set" : "❌ Missing",
        emailPassword: emailPassword ? "✅ Set" : "❌ Missing",
        checking: [
          `EMAIL_USER: ${process.env.EMAIL_USER ? "✅" : "❌"}`,
          `HOST_EMAIL: ${process.env.HOST_EMAIL ? "✅" : "❌"}`,
          `EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? "✅" : "❌"}`,
          `HOST_EMAIL_PASSWORD: ${process.env.HOST_EMAIL_PASSWORD ? "✅" : "❌"}`,
        ]
      })
    }

    // Try to create transporter
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPassword.replace(/\s/g, ''), // Remove spaces
      },
    })

    // Verify connection
    await transporter.verify()

    return NextResponse.json({
      success: true,
      message: "✅ SMTP configuration is working!",
      emailUser: emailUser,
      configured: true,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      help: [
        "1. Make sure 2-Step Verification is enabled on Gmail",
        "2. Generate App Password at: https://myaccount.google.com/apppasswords",
        "3. Use the 16-character app password (no spaces)",
        "4. Add credentials to .env.local",
        "5. Restart the development server",
      ],
      emailUser: emailUser || "Not set",
    })
  }
}

export async function POST() {
  return GET()
}


import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/mongodb"
import { User } from "@/models/user"

/**
 * POST /api/admin/bootstrap
 * Creates or updates the default admin account:
 *   email: second.home2k25@gmail.com
 *   password: Secondhome@2028
 *
 * Secured by ADMIN_SEED_TOKEN env. Call with header:
 *   x-admin-seed-token: <ADMIN_SEED_TOKEN>
 */
export async function POST(req: Request) {
  const token = req.headers.get("x-admin-seed-token")
  const expected = process.env.ADMIN_SEED_TOKEN

  // If ADMIN_SEED_TOKEN is set, enforce it. If not set, allow open bootstrap.
  if (expected && token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await connectToDatabase()

  const email = "second.home2k25@gmail.com"
  const plainPassword = "Secondhome@2028"
  const hashed = await bcrypt.hash(plainPassword, 10)

  const updated = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        name: "SecondHome Admin",
        email,
        password: hashed,
        role: "admin",
      },
    },
    { upsert: true, new: true },
  )

  return NextResponse.json({
    message: "Admin account bootstrapped",
    email,
    password: plainPassword,
    role: updated.role,
  })
}


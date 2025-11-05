import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const files = formData.getAll("images") as File[]

    if (files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 })
    }

    const uploadedUrls: string[] = []

    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Generate a unique filename
      const uniqueId = uuidv4()
      const originalName = file.name
      const extension = originalName.split(".").pop()
      const filename = `${uniqueId}.${extension}`

      // Create path to public directory
      const path = join(process.cwd(), "public/uploads", filename)

      // Write the file
      await writeFile(path, buffer)

      // Generate URL for the file
      const url = `/uploads/${filename}`
      uploadedUrls.push(url)
    }

    return NextResponse.json({
      message: "Files uploaded successfully",
      imageUrls: uploadedUrls,
    })
  } catch (error) {
    console.error("Error uploading files:", error)
    return NextResponse.json({ error: "Failed to upload files" }, { status: 500 })
  }
}

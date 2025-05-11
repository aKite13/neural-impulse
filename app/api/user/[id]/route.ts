import { NextRequest, NextResponse } from "next/server"
import { connect } from "../../../lib/db"
import User from "../../../models/User"
import { uploadPhoto, deletePhoto } from "../../../lib/cloudinary"

// Добавляем middleware для обработки CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Добавляем проверку метода
    if (req.method !== "PUT") {
      return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
    }

    await connect()
    const { id } = await context.params

    console.log("Received PUT request for user ID:", id)

    if (!id || typeof id !== "string") {
      console.log("Invalid ID:", id)
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    // Улучшаем проверку токена
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized: Missing token" },
        { status: 401 }
      )
    }

    const accessToken = authHeader.split(" ")[1]
    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token format" },
        { status: 401 }
      )
    }

    // Проверяем соответствие токена и ID
    if (accessToken !== id) {
      console.log("Token mismatch. Expected:", id, "Received:", accessToken)
      return NextResponse.json(
        { error: "Forbidden: Token does not match user ID" },
        { status: 403 }
      )
    }

    const user = await User.findById(id)
    if (!user) {
      console.log("User not found for ID:", id)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const formData = await req.formData()
    const file = formData.get("avatar") as File | null
    const name = formData.get("name") as string
    const designation = formData.get("designation") as string
    const deleteAvatar = formData.get("deleteAvatar") === "true"

    console.log("Form data:", {
      name,
      designation,
      deleteAvatar,
      hasFile: !!file,
      currentAvatar: user.avatar,
    })

    if (!name) {
      console.log("Name is required but missing")
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    if (deleteAvatar && user.avatar?.public_id) {
      console.log(
        "Attempting to delete avatar with public_id:",
        user.avatar.public_id
      )
      const deleteResult = await deletePhoto(user.avatar.public_id)
      console.log("Delete result:", deleteResult)
      if (deleteResult.errMessage) {
        console.error("Failed to delete avatar:", deleteResult.errMessage)
        return NextResponse.json(
          { error: `Failed to delete avatar: ${deleteResult.errMessage}` },
          { status: 500 }
        )
      }
      user.avatar = null
      console.log("Avatar deleted from Cloudinary and set to null")
    }

    if (file) {
      if (user.avatar?.public_id) {
        console.log(
          "Replacing avatar, deleting old public_id:",
          user.avatar.public_id
        )
        const deleteResult = await deletePhoto(user.avatar.public_id)
        console.log("Delete result for old avatar:", deleteResult)
        if (deleteResult.errMessage) {
          console.error("Failed to delete old avatar:", deleteResult.errMessage)
        }
      }
      const uploadResult = await uploadPhoto(file)
      console.log("Upload result:", uploadResult)
      if (uploadResult.errMessage) {
        console.error("Failed to upload new avatar:", uploadResult.errMessage)
        return NextResponse.json(
          { error: `Failed to upload avatar: ${uploadResult.errMessage}` },
          { status: 500 }
        )
      }
      user.avatar = { url: uploadResult.url, public_id: uploadResult.public_id }
      console.log("New avatar set:", user.avatar)
    }

    user.name = name
    user.designation = designation || ""
    await user.save()

    console.log("Profile updated successfully for user:", id)
    return NextResponse.json(
      { message: "Profile updated successfully", user },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      {
        error: "Failed to update profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Добавляем проверку метода
    if (req.method !== "DELETE") {
      return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
    }

    await connect()
    const { id } = await context.params

    console.log("Received DELETE request for user ID:", id)

    if (!id || typeof id !== "string") {
      console.log("Invalid ID:", id)
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const accessToken = req.headers.get("authorization")?.split(" ")[1]
    console.log("Access token:", accessToken)
    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized: Missing token" },
        { status: 401 }
      )
    }

    if (accessToken !== id) {
      console.log("Token mismatch. Expected:", id, "Received:", accessToken)
      return NextResponse.json(
        { error: "Forbidden: Token does not match user ID" },
        { status: 403 }
      )
    }

    const user = await User.findById(id)
    if (!user) {
      console.log("User not found for ID:", id)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("User found:", user._id.toString(), "Avatar:", user.avatar)

    if (user.avatar?.public_id) {
      console.log(
        "Attempting to delete avatar with public_id:",
        user.avatar.public_id
      )
      const deleteResult = await deletePhoto(user.avatar.public_id)
      console.log("Delete result:", deleteResult)
      if (deleteResult.errMessage) {
        console.error("Failed to delete avatar:", deleteResult.errMessage)
        return NextResponse.json(
          { error: `Failed to delete avatar: ${deleteResult.errMessage}` },
          { status: 500 }
        )
      }
    }

    await User.findByIdAndDelete(id)
    console.log("User deleted successfully:", id)
    return NextResponse.json(
      { message: "Profile deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting profile:", error)
    return NextResponse.json(
      {
        error: "Failed to delete profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

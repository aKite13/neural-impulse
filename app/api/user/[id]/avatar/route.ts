
import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../lib/db";
import User from "../../../../models/User";
import { deletePhoto } from "../../../../lib/cloudinary";

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connect();
    const { id } = await context.params;

    console.log("Received DELETE request for user ID:", id);

    if (!id || typeof id !== "string") {
      console.log("Invalid ID:", id);
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const accessToken = req.headers.get("authorization")?.split(" ")[1];
    console.log("Access token:", accessToken);
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
    }

    if (accessToken !== id) {
      console.log("Token mismatch. Expected:", id, "Received:", accessToken);
      return NextResponse.json({ error: "Forbidden: Token does not match user ID" }, { status: 403 });
    }

    const user = await User.findById(id);
    if (!user) {
      console.log("User not found for ID:", id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User found:", user._id, "Avatar:", user.avatar);
    if (!user.avatar?.public_id) {
      console.log("No avatar to delete for user:", id);
      return NextResponse.json({ error: "No avatar to delete" }, { status: 400 });
    }

    const deleteResult = await deletePhoto(user.avatar.public_id);
    if (deleteResult.errMessage) {
      console.log("Failed to delete avatar from Cloudinary:", deleteResult.errMessage);
      return NextResponse.json({ error: "Failed to delete avatar from Cloudinary" }, { status: 500 });
    }

    user.avatar = null;
    await user.save();

    console.log("Avatar deleted successfully for user:", id);
    return NextResponse.json({ message: "Avatar deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting avatar:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


// /app/api/blog/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../lib/db";
import Blog from "../../../models/Blog";
import mongoose from "mongoose";
import { deletePhoto } from "../../../lib/cloudinary";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connect();
    const { id } = await context.params;
    console.log("GET request - Fetching blog with ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const blog = await Blog.findById(id)
      .populate("authorId", "name avatar designation")
      .lean();

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connect();
    const { id } = await context.params;
    console.log("DELETE request - Deleting blog with ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
    }

    const userId = token;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Unauthorized: Invalid user ID" }, { status: 403 });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    if (blog.authorId.toString() !== userId) {
      return NextResponse.json({ error: "Forbidden: Only the author can delete this blog" }, { status: 403 });
    }

    // Удаляем изображение из Cloudinary, если оно есть
    if (blog.image?.id) {
      const deleteResult = await deletePhoto(blog.image.id);
      if (deleteResult.errMessage) {
        console.error(`Failed to delete image ${blog.image.id}: ${deleteResult.errMessage}`);
        // Можно добавить строгую проверку, если требуется
      }
    }

    // Удаляем блог из базы
    await Blog.findByIdAndDelete(id);
    console.log("Blog deleted successfully:", id);
    return NextResponse.json({ message: "Blog successfully deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../lib/db";
import Blog, { IComment } from "../../../../models/Blog";
import mongoose from "mongoose";

interface CommentParams {
  id: string; // ID блога
  commentId?: string; // ID комментария (для DELETE)
}

// POST: Добавление комментария
export async function POST(req: NextRequest, { params }: { params: Promise<CommentParams> }) {
  try {
    await connect();
    const { id } = await params; // Исправлено: await для params

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });

    // Используем токен как ID пользователя напрямую, без проверки JWT
    const userId = token;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Unauthorized: Invalid user ID" }, { status: 403 });
    }

    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: "Comment text is required" }, { status: 400 });

    const blog = await Blog.findById(id);
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    blog.comments.push({ user: new mongoose.Types.ObjectId(userId), text, date: new Date() });
    await blog.save();

    // Популяризируем поле user для всех комментариев
    const populatedBlog = await Blog.findById(id).populate("comments.user", "name avatar");
    return NextResponse.json(populatedBlog, { status: 201 });
  } catch (error: unknown) {
    console.error("Error adding comment:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: `Failed to add comment: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}

// DELETE: Удаление комментария
export async function DELETE(req: NextRequest, { params }: { params: Promise<CommentParams> }) {
  try {
    await connect();
    const { id, commentId } = await params; // Исправлено: await для params

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });

    // Используем токен как ID пользователя напрямую
    const userId = token;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Unauthorized: Invalid user ID" }, { status: 403 });
    }

    const blog = await Blog.findById(id);
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    if (!commentId) return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });

    blog.comments = blog.comments.filter((comment: IComment) => {
      return comment._id ? comment._id.toString() !== commentId : false;
    });
    await blog.save();

    // Популяризируем поле user для всех оставшихся комментариев
    const populatedBlog = await Blog.findById(id).populate("comments.user", "name avatar");
    return NextResponse.json({ message: "Comment deleted", blog: populatedBlog }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error deleting comment:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: `Failed to delete comment: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
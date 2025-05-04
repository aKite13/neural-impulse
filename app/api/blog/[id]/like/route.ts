import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../lib/db";
import { verifyJwtToken } from "../../../../lib/jwt";
import Blog from "../../../../models/Blog";
import mongoose from "mongoose";

// Типизация параметров
interface LikeParams {
  id: string; // ID блога
}

// PUT: Добавление или удаление лайка
export async function PUT(req: NextRequest, context: { params: Promise<LikeParams> }) {
  try {
    await connect();

    // Распаковываем params с помощью await
    const params = await context.params;
    const { id } = params;

    // Проверка авторизации
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
    }

    const decoded = verifyJwtToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized: Invalid or expired token" }, { status: 403 });
    }

    // Поиск блога
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Преобразование userId в ObjectId
    const userId = new mongoose.Types.ObjectId(decoded._id);

    // Проверка, лайкнул ли пользователь блог
    const isLiked = blog.likes.some((like: mongoose.Types.ObjectId) => like.equals(userId));

    if (isLiked) {
      // Удаление лайка
      blog.likes = blog.likes.filter((like: mongoose.Types.ObjectId) => !like.equals(userId));
    } else {
      // Добавление лайка
      blog.likes.push(userId);
    }

    await blog.save();

    return NextResponse.json(blog, { status: 200 });
  } catch (error: unknown) {
    console.error("Error updating like:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: `Failed to update like: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to update like" }, { status: 500 });
  }
}
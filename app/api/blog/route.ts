import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import Blog from "../../models/Blog";
import { connect } from "../../lib/db";
import User from "../../models/User";

interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  [key: string]: unknown;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    await connect();
    const blogs = await Blog.find()
      .populate("authorId", "name avatar designation")
      .lean();
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connect();

    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    console.log("Received token:", token);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
    }

    const user = await User.findById(token);
    console.log("User lookup result:", user ? user._id : "User not found");
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Invalid token or user not found" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("photo") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const excerpt = formData.get("excerpt") as string;
    const quote = formData.get("quote") as string;
    const category = formData.get("category") as string;

    let image: { id: string; url: string } | undefined;
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { upload_preset: "next_blog_images" },
          (error, result) => (error ? reject(error) : resolve(result as CloudinaryUploadResult))
        ).end(buffer);
      });

      image = {
        id: result.public_id,
        url: result.secure_url,
      };
    }

    const blog = new Blog({
      title,
      description,
      excerpt,
      quote,
      category,
      image,
      authorId: user._id,
    });
    await blog.save();

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
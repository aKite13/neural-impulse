
"use server";

import { v2 as cloudinary } from "cloudinary";

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error("Cloudinary configuration is missing in environment variables");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: unknown;
}

interface UploadResult {
  url?: string;
  public_id?: string;
  errMessage?: string;
}

interface DeleteResult {
  result?: string;
  public_id?: string;
  errMessage?: string;
}

export async function uploadPhoto(file: File): Promise<UploadResult> {
  try {
    if (!file.type.startsWith("image/")) {
      return { errMessage: "File must be an image" };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { errMessage: "File size exceeds 5MB" };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryUploadResult);
        }
      );
      uploadStream.end(buffer);
    });
    return { url: result.secure_url, public_id: result.public_id };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to upload image";
    console.error("Error uploading to Cloudinary:", errMessage);
    return { errMessage };
  }
}

export async function deletePhoto(public_id: string): Promise<DeleteResult> {
  if (!public_id) return { errMessage: "Public ID is required", public_id: "" };
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    if (result.result === "ok") {
      console.log(`Successfully deleted photo with public_id: ${public_id}`);
      return { result: "ok", public_id };
    }
    console.error(`Failed to delete photo ${public_id}: ${result.result || "unknown reason"}`);
    return { errMessage: `Failed to delete photo: ${result.result || "unknown reason"}`, public_id };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to delete image";
    console.error(`Error deleting from Cloudinary ${public_id}:`, errMessage);
    return { errMessage, public_id };
  }
}




"use server";

import { v2 as cloudinary } from "cloudinary";

// Типизация результата
interface DeleteResult {
  result?: string; // "ok" при успехе
  public_id?: string;
  errMessage?: string;
}

// Конфигурация Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Удаление одного изображения
export async function deletePhoto(public_id: string): Promise<DeleteResult> {
  if (!public_id) {
    return { errMessage: "Public ID is required" };
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    if (result.result === "ok") {
      return { result: "ok", public_id };
    } else {
      console.error(`Failed to delete photo ${public_id}:`, result);
      return { errMessage: "Failed to delete photo" };
    }
  } catch (error: unknown) { // Используем unknown
    console.error(`Error deleting photo ${public_id}:`, error);
    if (error instanceof Error) {
      return { errMessage: error.message || "Unknown error" };
    }
    return { errMessage: "An unexpected error occurred" };
  }
}

// Удаление нескольких изображений
export async function deleteManyPhotos(
  publicIdsToDelete: { id: string }[]
): Promise<DeleteResult[]> {
  if (!publicIdsToDelete || publicIdsToDelete.length === 0) {
    return [{ errMessage: "No public IDs provided" }];
  }

  try {
    const deleteResponses = await Promise.all(
      publicIdsToDelete.map(async ({ id: public_id }) => {
        try {
          const result = await cloudinary.uploader.destroy(public_id);
          if (result.result === "ok") {
            return { result: "ok", public_id };
          } else {
            console.error(`Failed to delete photo ${public_id}:`, result);
            return { errMessage: "Failed to delete photo", public_id };
          }
        } catch (error: unknown) { // Используем unknown
          console.error(`Error deleting photo ${public_id}:`, error);
          if (error instanceof Error) {
            return { errMessage: error.message || "Unknown error", public_id };
          }
          return { errMessage: "An unexpected error occurred", public_id };
        }
      })
    );

    return deleteResponses;
  } catch (error: unknown) { // Используем unknown
    console.error("Error in deleteManyPhotos:", error);
    if (error instanceof Error) {
      return [{ errMessage: error.message || "Unknown error" }];
    }
    return [{ errMessage: "An unexpected error occurred" }];
  }
}
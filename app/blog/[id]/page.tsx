
import React from "react";
import { IBlogClient } from "../../models/Blog";
import ClientBlogDetails from "../../components/ClientBlogDetails";

interface BlogDetailsProps {
  params: Promise<{ id: string }>;
}

async function fetchBlogData(id: string): Promise<IBlogClient> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"; // Замените на ваш порт, если нужно
  const url = `${baseUrl}/api/blog/${id}`;
  console.log("Fetching blog from URL:", url);

  try {
    const response = await fetch(url, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch blog: ${response.status} - ${await response.text()}`);
    }
    return response.json();
  } catch (error) {
    throw error;
  }
}

const BlogDetails: React.FC<BlogDetailsProps> = async ({ params }) => {
  const { id } = await params;
  let blogDetails: IBlogClient | null = null;
  let error: string | null = null;

  try {
    blogDetails = await fetchBlogData(id);
  } catch (err) {
    console.error("Error fetching blog:", err);
    error = err instanceof Error ? err.message : "Failed to load blog details.";
  }

  if (!blogDetails) {
    return (
      <section className="container max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-gray-500 py-10">
          {error || "Blog not found."}
        </p>
      </section>
    );
  }

  return (
    <section className="container max-w-4xl mx-auto px-4 py-8">
      <ClientBlogDetails blogDetails={blogDetails} blogId={id} />
    </section>
  );
};

export default BlogDetails;











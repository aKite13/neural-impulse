
// app/blog/page.tsx
import React from "react";
import FirstBlog from "../components/FirstBlog";
import OtherBlogs from "../components/OtherBlogs";
import { getApiUrl } from './../lib/api';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  createdAt: string;
  image?: { url: string };
  authorId: {
    _id: string;
    name: string;
    avatar?: { url: string };
    designation?: string;
  };
}


async function fetchBlogs(): Promise<Blog[]> {
  try {
    const res = await fetch(getApiUrl('/api/blog'), {
      method: "GET",
      cache: "no-store",
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error('Failed to load blogs. Please try again later.');
  }
}
export const dynamic = "force-dynamic"; // Указываем, что страница динамическая

const BlogPage = async () => {
  const blogs = await fetchBlogs();

  if (blogs.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <h3 className="text-center text-xl text-gray-600">No Blogs Available</h3>
      </div>
    );
  }

  const firstBlog = blogs[0];
  const otherBlogs = blogs.slice(1);

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-center my-10 text-3xl font-bold">
        <span className="special-word text-indigo-600">Trending</span>{" "}
        <span className="special-word-1 text-fuchsia-800">Blog</span>
      </h2>
      <FirstBlog firstBlog={firstBlog} />
      {otherBlogs.length > 0 && <OtherBlogs otherBlogs={otherBlogs} />}
    </div>
  );
};

export default BlogPage;
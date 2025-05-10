
// app/blog/page.tsx
import React from "react";
import FirstBlog from "../components/FirstBlog";
import OtherBlogs from "../components/OtherBlogs";

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





// async function fetchBlogs(): Promise<Blog[]> {
//   try {
//     const url = `${process.env.NEXTAUTH_URL}/api/blog`;
//     console.log("Fetching blogs from:", url);
//     const res = await fetch(url, {
//       method: "GET",
//       cache: "no-store",
//       next: { revalidate: 0 },
//     });

//     if (!res.ok) {
//       throw new Error(`Failed to fetch blogs: ${res.status} ${res.statusText}`);
//     }

//     const data: Blog[] = await res.json();
//     console.log("Fetched blogs:", data);
//     return data;
//   } catch (error) {
//     console.error("Error fetching blogs:", error);
//     return [];
//   }
// }

async function fetchBlogs(): Promise<Blog[]> {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog`;
    console.log("Fetching blogs from:", url);
    
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("API Error:", errorData);
      throw new Error(errorData.message || 'Failed to fetch blogs');
    }

    return await res.json();
  } catch (error) {
    console.error("Network Error:", error);
    throw error; // Перебрасываем ошибку для обработки в компоненте
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
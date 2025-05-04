
"use client"; // Добавляем для использования useTheme
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AiTwotoneCalendar } from "react-icons/ai";
import demoImage from "../../public/img/wait.jpg";
import { useTheme } from "next-themes";

// Типизация данных блога
interface Author {
  _id: string;
  name: string;
  avatar?: { url: string };
  designation?: string;
}

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  createdAt: string;
  image?: { url: string };
  authorId: Author;
}

interface OtherBlogsProps {
  otherBlogs: Blog[];
}

const OtherBlogs: React.FC<OtherBlogsProps> = ({ otherBlogs }) => {
  const { theme } = useTheme(); // Добавляем хук для определения темы
  const isDarkTheme = theme === "dark";

  if (!otherBlogs || otherBlogs.length === 0) {
    return null; // Ничего не рендерим, если блогов нет
  }

  return (
    <section className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {otherBlogs.map((blog) => {
          const formattedTime = new Date(blog.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          return (
            <div key={blog._id} className="flex flex-col">
              <Link href={`/blog/${blog._id}`} className="block">
                <Image
                  src={blog.image?.url || demoImage}
                  alt={blog.title || "Blog image"}
                  width={300}
                  height={200}
									priority
                  className="w-full h-auto rounded-lg mb-4 object-cover"
                  placeholder="blur"
                  blurDataURL="/img/placeholder.png" // Оставляем как есть
                />
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <p
                      className="text-primaryColor font-medium"
                      style={isDarkTheme ? { color: "#818cf8" } : undefined} // Тёмная: indigo-400
                    >
                      {blog.category}
                    </p>
                    <p className="flex items-center gap-1">
                      <AiTwotoneCalendar
                        className="text-gray-950"
                        style={isDarkTheme ? { color: "#d1d5db" } : undefined} // Тёмная: gray-300
                      />
                      <span
                        className="text-gray-950"
                        style={isDarkTheme ? { color: "#d1d5db" } : undefined} // Тёмная: gray-300
                      >
                        {formattedTime}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h2
                      className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors dark:hover:text-indigo-300"
                      style={isDarkTheme ? { color: "#e5e7eb" } : undefined} // Тёмная: gray-200
                    >
                      {blog.title}
                    </h2>
                    <p
                      className="text-sm text-gray-600 line-clamp-2"
                      style={isDarkTheme ? { color: "#9ca3af" } : undefined} // Тёмная: gray-400
                    >
                      {blog.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Image
                      src={blog.authorId.avatar?.url || demoImage}
                      alt={`${blog.authorId.name}'s avatar`}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="text-xs">
                      <h6
                        className="font-semibold text-gray-900"
                        style={isDarkTheme ? { color: "#e5e7eb" } : undefined} // Тёмная: gray-200
                      >
                        {blog.authorId.name}
                      </h6>
                      <p
                        className="text-gray-600"
                        style={isDarkTheme ? { color: "#9ca3af" } : undefined} // Тёмная: gray-400
                      >
                        {blog.authorId.designation || "Author"}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default OtherBlogs;
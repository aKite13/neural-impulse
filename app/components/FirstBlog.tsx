
"use client"; // Добавляем директиву для клиентского рендеринга
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

interface FirstBlogProps {
  firstBlog: Blog | null;
}

const FirstBlog: React.FC<FirstBlogProps> = ({ firstBlog }) => {
  const { theme } = useTheme(); // Теперь работает на клиенте
  const isDarkTheme = theme === "dark";

  if (!firstBlog) {
    return (
      <p
        className="text-center text-gray-500"
        style={isDarkTheme ? { color: "#9ca3af" } : undefined} // Тёмная тема: gray-400
      >
        No blog available
      </p>
    );
  }

  const formattedTime = new Date(firstBlog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="py-6">
      <Link href={`/blog/${firstBlog._id}`} className="block">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full lg:w-2/5">
            <Image
              src={firstBlog.image?.url || demoImage}
              alt={firstBlog.title || "Blog image"}
              width={400}
              height={300}
              className="w-full h-auto rounded-lg object-cover"
              placeholder="blur"
              blurDataURL="/img/placeholder.png"
            />
          </div>

          <div className="w-full lg:w-3/5 space-y-5">
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <p
                className="text-primaryColor font-medium"
                style={isDarkTheme ? { color: "#818cf8" } : undefined} // Тёмная: indigo-400
              >
                {firstBlog.category}
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
                className="text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors dark:hover:text-indigo-300"
                style={isDarkTheme ? { color: "#e5e7eb" } : undefined} // Тёмная: gray-200
              >
                {firstBlog.title}
              </h2>
              <p
                className="text-sm text-gray-600 line-clamp-3"
                style={isDarkTheme ? { color: "#9ca3af" } : undefined} // Тёмная: gray-400
              >
                {firstBlog.excerpt}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Image
                src={firstBlog.authorId.avatar?.url || demoImage}
                alt={`${firstBlog.authorId.name}'s avatar`}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-xs">
                <h6
                  className="font-semibold text-gray-900"
                  style={isDarkTheme ? { color: "#e5e7eb" } : undefined} // Тёмная: gray-200
                >
                  {firstBlog.authorId.name}
                </h6>
                <p
                  className="text-gray-600"
                  style={isDarkTheme ? { color: "#9ca3af" } : undefined} // Тёмная: gray-400
                >
                  {firstBlog.authorId.designation || "Author"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
};

export default FirstBlog;
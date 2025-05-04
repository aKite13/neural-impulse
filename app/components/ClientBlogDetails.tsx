"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { IBlogClient } from "../../app/models/Blog";
import { BsTrash } from "react-icons/bs";
import { AiTwotoneCalendar, AiFillHeart, AiOutlineHeart, AiOutlineComment } from "react-icons/ai";
import { useTheme } from "next-themes";

interface ClientBlogDetailsProps {
  blogDetails: IBlogClient;
  blogId: string;
}

const ClientBlogDetails: React.FC<ClientBlogDetailsProps> = ({ blogDetails: initialBlog, blogId }) => {
  const [blogDetails, setBlogDetails] = useState<IBlogClient | null>(initialBlog);
  const [isLiked, setIsLiked] = useState(false);
  const [blogLikes, setBlogLikes] = useState(initialBlog.likes.length);
  const [blogComments, setBlogComments] = useState(initialBlog.comments.length);
  const [error, setError] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  const formattedTime = blogDetails?.createdAt
    ? new Date(blogDetails.createdAt).toLocaleDateString()
    : "";
  const demoImage = "/mern.png";

  const fetchBlog = useCallback(async () => {
    try {
      const response = await fetch(`/api/blog/${blogId}`);
      if (!response.ok) throw new Error(`Failed to fetch blog: ${response.status}`);
      const blog: IBlogClient = await response.json();
      setBlogDetails(blog);
      const userId = session?.user?._id ?? "";
      setIsLiked(blog.likes.includes(userId));
      setBlogLikes(blog.likes.length);
      setBlogComments(blog.comments.length);
    } catch (error) {
      console.error("Error fetching blog:", error);
      setError("Failed to load blog details.");
    }
  }, [blogId, session]);

  useEffect(() => {
    if (status === "authenticated") fetchBlog();
    if (status === "unauthenticated") router.push("/login");
  }, [status, fetchBlog, router]);

  const handleLike = async () => {
    if (!session?.user) return alert("Please login to like.");
    try {
      const response = await fetch(`/api/blog/${blogId}/like`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });
      if (response.ok) {
        setIsLiked(!isLiked);
        setBlogLikes(isLiked ? blogLikes - 1 : blogLikes + 1);
      } else {
        setError("Failed to update like.");
      }
    } catch (error) {
      console.error("Error liking blog:", error);
      setError("Error liking blog.");
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText) return;
    setIsCommenting(true);
    try {
      const response = await fetch(`/api/blog/${blogId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: commentText }),
      });
      if (response.ok) {
        const blog = await response.json();
        setBlogDetails(blog);
        setBlogComments(blog.comments.length);
        setCommentText("");
      } else {
        setError("Failed to add comment.");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      setError("Error submitting comment.");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId?: string) => {
    if (!commentId) {
      setError("Comment ID is missing");
      return;
    }
    try {
      const response = await fetch(`/api/blog/${blogId}/comment/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
      });
      if (response.ok) {
        const { blog } = await response.json();
        setBlogDetails(blog);
        setBlogComments(blog.comments.length);
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Network error while deleting comment");
    }
  };

  const handleBlogDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/blog/${blogId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
      });
      if (response.ok) {
        router.push("/blog");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      setError("Network error while deleting blog");
    } finally {
      setIsDeleting(false);
    }
  };

  const splitParagraph = (text: string) => text.split("\n").filter(Boolean);

  if (status === "loading" || !blogDetails) {
    return (
      <p
        className="text-center text-gray-500 py-10"
        style={isDarkTheme ? { color: "#9ca3af" } : undefined} // Тёмная: gray-400
      >
        Loading...
      </p>
    );
  }

  return (
    <>
      {session?.user?._id === blogDetails?.authorId._id && (
        <div className="flex items-center justify-end gap-4 mb-6">
          <button
            onClick={handleBlogDelete}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors duration-200 dark:hover:text-red-400"
            disabled={isDeleting}
            style={isDarkTheme ? { color: "#ef4444" } : undefined} // Тёмная: red-500
          >
            <BsTrash className="text-lg cursor-pointer" />{" "}
            <span className="font-medium cursor-pointer">{isDeleting ? "Deleting..." : "Delete"}</span>
          </button>
        </div>
      )}

      <div
        className="bg-white shadow-lg rounded-lg overflow-hidden"
        style={isDarkTheme ? { backgroundColor: "#1f2937" } : undefined} // Тёмная: gray-800
      >
        <Link
          href="/blog"
          className="block transition-colors duration-200 dark:hover:bg-gray-700"
        >
          <div className="flex flex-col items-center py-8">
            <Image
              src={blogDetails?.authorId?.avatar?.url || demoImage}
              alt="Author avatar"
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
            />
            <div className="text-center mt-4">
              <p
                className="text-xl font-semibold text-gray-800"
                style={isDarkTheme ? { color: "#e5e7eb" } : undefined} // Тёмная: gray-200
              >
                {blogDetails?.authorId?.name}
              </p>
              <p
                className="text-sm text-gray-500"
                style={isDarkTheme ? { color: "#9ca3af" } : undefined} // Тёмная: gray-400
              >
                {blogDetails?.authorId?.designation}
              </p>
            </div>
          </div>
        </Link>

        <div className="px-6 py-8">
          <h1
            className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4"
            style={isDarkTheme ? { color: "#e5e7eb" } : undefined} // Тёмная: gray-200
          >
            {blogDetails?.title}
          </h1>
          <p
            className="text-lg text-gray-600 text-center mb-6"
            style={isDarkTheme ? { color: "#9ca3af" } : undefined} // Тёмная: gray-400
          >
            {blogDetails?.excerpt}...
          </p>
          <div
            className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-8"
            style={isDarkTheme ? { color: "#9ca3af" } : undefined} // Тёмная: gray-400
          >
            <span
              className="text-blue-600 font-medium"
              style={isDarkTheme ? { color: "#818cf8" } : undefined} // Тёмная: indigo-400
            >
              {blogDetails?.category}
            </span>
            <span className="flex items-center gap-1">
              <AiTwotoneCalendar
                style={isDarkTheme ? { color: "#d1d5db" } : undefined} // Тёмная: gray-300
              />{" "}
              {formattedTime}
            </span>
          </div>

          {/* <div className="mb-8">
            <Image
              src={blogDetails?.image?.url || demoImage}
              alt="Blog image"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div> */}

<div className="relative w-full h-64 md:h-96 mb-8">
  <Image
    src={blogDetails?.image?.url || demoImage}
    alt="Blog image"
    fill
    sizes="100vw"
    className="object-contain rounded-lg "
    priority
  />
</div>


          <div
            className="prose prose-lg max-w-none text-gray-700"
            style={isDarkTheme ? { color: "#d1d5db" } : undefined} // Тёмная: gray-300
          >
            {blogDetails?.description &&
              splitParagraph(blogDetails.description).map((paragraph, pIndex) => (
                <div key={pIndex} className="mb-6">
                  {pIndex === Math.floor(splitParagraph(blogDetails.description).length / 2) && (
                    <blockquote
                      className="border-l-4 border-blue-500 bg-gray-100 p-4 my-6 italic text-gray-600 rounded-r-lg dark:border-indigo-400 dark:bg-gray-800"
                      style={isDarkTheme ? { color: "#9ca3af" } : undefined} // Тёмная: gray-400
                    >
                      <p>{blogDetails?.quote}</p>
                    </blockquote>
                  )}
                  <p>{paragraph}</p>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div
        className="flex justify-center gap-12 py-10 text-gray-700"
        style={isDarkTheme ? { color: "#d1d5db" } : undefined} // Тёмная: gray-300
      >
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium">{blogLikes}</span>
          {isLiked ? (
            <AiFillHeart
              onClick={handleLike}
              size={24}
              className="text-red-500 cursor-pointer hover:text-red-600 transition-colors duration-200 dark:hover:text-red-400"
            />
          ) : (
            <AiOutlineHeart
              onClick={handleLike}
              size={24}
              className="cursor-pointer hover:text-red-500 transition-colors duration-200 dark:hover:text-red-400"
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium">{blogComments}</span>
          <AiOutlineComment
            size={24}
            className="text-gray-500"
            style={isDarkTheme ? { color: "#9ca3af" } : undefined} // Тёмная: gray-400
          />
        </div>
      </div>

      <div
        className="bg-white shadow-lg rounded-lg p-6 mt-8"
        style={isDarkTheme ? { backgroundColor: "#1f2937" } : undefined} // Тёмная: gray-800
      >
        {error && (
          <p
            className="text-red-600 mb-4 font-medium"
            style={isDarkTheme ? { color: "#f87171" } : undefined} // Тёмная: red-400
          >
            {error}
          </p>
        )}
        {!session?.user && (
          <h3
            className="text-red-600 text-center font-medium mb-4"
            style={isDarkTheme ? { color: "#f87171" } : undefined} // Тёмная: red-400
          >
            Please login to leave a comment.
          </h3>
        )}
        {session?.user && (
          <form onSubmit={handleCommentSubmit} className="space-y-4 mb-6">
            <input
              onChange={(e) => setCommentText(e.target.value)}
              value={commentText}
              name="comment"
              type="text"
              placeholder="Write your comment..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-indigo-400"
              style={isDarkTheme ? { color: "#e5e7eb" } : undefined} // Тёмная: gray-200
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 dark:bg-indigo-600 dark:hover:bg-indigo-500"
              disabled={isCommenting}
            >
              {isCommenting ? "Posting..." : "Comment"}
            </button>
          </form>
        )}

        {blogDetails?.comments?.length === 0 && (
          <p
            className="text-gray-500 text-center"
            style={isDarkTheme ? { color: "#9ca3af" } : undefined} // Тёмная: gray-400
          >
            No comments yet.
          </p>
        )}
        {blogDetails?.comments?.length > 0 && (
          <div className="space-y-6">
            {blogDetails.comments.map((comment) => (
              <div
                key={comment._id || Math.random().toString()}
                className="flex gap-4 items-start border-b border-gray-200 pb-4 dark:border-gray-600"
              >
                <Image
                  src={comment?.user?.avatar?.url || demoImage}
                  alt="User avatar"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                />
                <div className="flex-1">
                  <p
                    className="text-gray-800 font-semibold"
                    style={isDarkTheme ? { color: "#e5e7eb" } : undefined} // Тёмная: gray-200
                  >
                    {comment?.user?.name}
                  </p>
                  <p
                    className="text-gray-600"
                    style={isDarkTheme ? { color: "#9ca3af" } : undefined} // Тёмная: gray-400
                  >
                    {comment.text}
                  </p>
                </div>
                {session?.user?._id === comment?.user?._id && (
                  <BsTrash
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer transition-colors duration-200 dark:hover:text-red-400"
                    size={20}
                    style={isDarkTheme ? { color: "#ef4444" } : undefined} // Тёмная: red-500
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ClientBlogDetails;
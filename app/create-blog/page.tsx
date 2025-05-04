"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import Image from "next/image";
import { useTheme } from "next-themes";

interface BlogFormState {
  title: string;
  description: string;
  excerpt: string;
  quote: string;
  category: "AI and life" | "AI and the future" | "AI in action" | "AI and the brain" | "AI and algorithms";
  photo: File | null;
}

const initialState: BlogFormState = {
  title: "",
  description: "",
  excerpt: "",
  quote: "",
  category: "AI and life",
  photo: null,
};

const CreateBlog = () => {
  const [state, setState] = useState<BlogFormState>(initialState);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const { data: session, status } = useSession();
	const { theme} = useTheme();

  if (status === "loading") {
    return <p className="text-center text-[rgb(var(--foreground))]">Loading...</p>;
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setError("");
    const { name, value, type } = event.target;

    if (type === "file") {
      const files = (event.target as HTMLInputElement).files;
      setState({ ...state, photo: files ? files[0] : null });
    } else {
      setState({ ...state, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { photo, title, category, description, excerpt, quote } = state;

    if (!title || !description || !category || !excerpt || !quote) {
      setError("Please fill out all required fields.");
      return;
    }

    if (photo) {
      const maxSize = 5 * 1024 * 1024;
      if (photo.size > maxSize) {
        setError("File size is too large. Please select a file under 5MB.");
        return;
      }
    }

    if (title.length < 4) {
      setError("Title must be at least 4 characters long.");
      return;
    }
    if (description.length < 20) {
      setError("Description must be at least 20 characters long.");
      return;
    }
    if (excerpt.length < 10) {
      setError("Excerpt must be at least 10 characters long.");
      return;
    }
    if (quote.length < 6) {
      setError("Quote must be at least 6 characters long.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("excerpt", excerpt);
      formData.append("quote", quote);
      formData.append("category", category);
      if (photo) formData.append("photo", photo);

      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken ?? ""}`,
        },
        body: formData,
      });

      if (response.ok) {
        setSuccess("Blog created successfully.");
        setState(initialState);
        setTimeout(() => router.push("/blog"), 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error occurred while creating blog.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setError("Error occurred while creating blog.");
    } finally {
      setIsLoading(false);
    }
  };


	const isDarkTheme = theme === "dark"; // Определяем, тёмная ли тема

  return (
    <section className="max-w-4xl mx-auto p-6 bg-[rgb(var(--background))]">
      <h2 className="mb-5 text-3xl font-bold">
        <span className="special-word">Create</span>{" "}
        <span className="special-word-1">Blog</span>
      </h2>
      <form onSubmit={handleSubmit} className="border-2 border-indigo-700 dark:border-gray-600 rounded-lg px-8 py-6 space-y-5 bg-teal-100 dark:bg-gray-700">
        <Input
          label="Title"
          type="text"
          name="title"
          placeholder="Write your title here..."
          onChange={handleChange}
          value={state.title}
          className="form-input"
					isDark={isDarkTheme}
        />
        <TextArea
          label="Description"
          rows={4}
          name="description"
          placeholder="Write your description here..."
          onChange={handleChange}
          value={state.description}
          className="form-input"
					isDark={isDarkTheme}
        />
        <TextArea
          label="Excerpt"
          rows={2}
          name="excerpt"
          placeholder="Write your excerpt here..."
          onChange={handleChange}
          value={state.excerpt}
          className="form-input"
					isDark={isDarkTheme}
        />
        <TextArea
          label="Quote"
          rows={2}
          name="quote"
          placeholder="Write your quote here..."
          onChange={handleChange}
          value={state.quote}
          className="form-input"
					isDark={isDarkTheme}
        />
        <div>
          <label className="block mb-1 font-medium text-[rgb(var(--foreground))]"  style={isDarkTheme ? { color: "rgb(var(--primary))" } : undefined} >Select a category</label>
          <select
            name="category"
            onChange={handleChange}
            value={state.category}
            className="form-select"
						
          >
            <option value="AI and life">AI and life</option>
            <option value="AI and the future">AI and the future</option>
            <option value="AI in action">AI in action</option>
            <option value="AI and the brain">AI and the brain</option>
            <option value="AI and algorithms">AI and algorithms</option>
          </select>
        </div>
        <div>


          <label className="block mb-2 text-sm font-medium text-[rgb(var(--foreground))]" style={isDarkTheme ? { color: "rgb(var(--primary))" } : undefined}>Upload Image</label>

					
          <input
            onChange={handleChange}
            type="file"
            name="photo"
            accept="image/*"
           className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50  "
          />
          {state.photo && (
            <div className="mt-4 ">
              <Image src={URL.createObjectURL(state.photo)} alt="Preview" width={128} height={128} className="object-cover rounded-md " />
            </div>
          )}
        </div>
        {error && <div className="text-red-700 dark:text-red-400 font-medium ">{error}</div>}
        {success && <div className="text-green-700 dark:text-green-400 font-medium">{success}</div>}
        <button
          type="submit"
          disabled={isLoading}
          className="form-button cursor-pointer"
        >
          {isLoading ? "Loading..." : "Create"}
        </button>
      </form>
    </section>
  );
};

export default CreateBlog;




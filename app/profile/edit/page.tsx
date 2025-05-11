"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

const ProfileEdit: React.FC = () => {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const { theme } = useTheme()
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [designation, setDesignation] = useState("")
  const [deleteAvatar, setDeleteAvatar] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFormReset, setIsFormReset] = useState(false)
  const demoImage = "/mern.png"

  // Перенаправление при отсутствии авторизации
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/profile/edit")
    }
  }, [status, router])

  // Инициализация формы при загрузке сессии
  useEffect(() => {
    console.log(
      "useEffect triggered, status:",
      status,
      "isFormReset:",
      isFormReset
    )
    if (session?.user && !isFormReset) {
      console.log("Session loaded:", session)
      setName(session.user.name || "")
      setDesignation(session.user.designation || "")
      setPreviewUrl(session.user.avatar?.url || null)
      setDeleteAvatar(false)
    }
  }, [session, status, isFormReset])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB.")
        return
      }
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file.")
        return
      }
      setAvatarFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setDeleteAvatar(false)
      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("handleSubmit called")
    if (!name.trim()) {
      setError("Name is required.")
      return
    }
    if (!session?.user?._id) {
      setError("User ID is missing. Please log in again.")
      router.push("/login")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    const formData = new FormData()
    if (avatarFile) formData.append("avatar", avatarFile)
    formData.append("name", name.trim())
    formData.append("designation", designation.trim())
    formData.append("deleteAvatar", deleteAvatar.toString())

    console.log("Sending form data:", {
      name,
      designation,
      deleteAvatar,
      avatarFile: avatarFile ? avatarFile.name : null,
    })

    try {
      const response = await fetch(`/api/user/${session.user._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: formData,
      })

      console.log("Response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Response data:", data)
        const updatedUser = data.user
        console.log("Updated user fields:", {
          name: updatedUser.name,
          designation: updatedUser.designation,
          avatar: updatedUser.avatar,
        })

        await update({
          name: updatedUser.name,
          designation: updatedUser.designation,
          avatar: updatedUser.avatar,
        })

        setName("")
        setDesignation("")
        setPreviewUrl(updatedUser.avatar?.url || null)
        setAvatarFile(null)
        setDeleteAvatar(false)
        setSuccess("Profile updated successfully.")
        setIsFormReset(true)

        setTimeout(() => {
          setSuccess("")
        }, 1000)
      } else {
        const errorData = await response.json()
        console.error("Error data:", errorData)
        setError(errorData.error || "Failed to update profile.")
      }
    } catch (err) {
      console.error("Fetch error:", err)
      setError("Network error while updating profile.")
    } finally {
      setIsLoading(false)
    }
  }

  const isDarkTheme = theme === "dark"

  // Состояние загрузки
  if (status === "loading") {
    console.log("Rendering loading state")
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--background))]">
        <div className="w-16 h-16 border-4 border-indigo-700 dark:border-gray-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Если не авторизован, ничего не рендерим (редирект в useEffect)
  if (status === "unauthenticated") {
    console.log("Rendering null for unauthenticated user")
    return null
  }

  console.log("Rendering form, current state:", {
    name,
    designation,
    previewUrl,
    deleteAvatar,
  })
  return (
    <section className="max-w-lg mx-auto p-6 min-h-screen flex items-center justify-center bg-[rgb(var(--background))]">
      <div className="w-full border-2 border-indigo-700 dark:border-gray-600 rounded-lg px-8 py-6 space-y-5 bg-teal-100 dark:bg-gray-700 shadow-lg">
        <h1 className="mb-5 text-3xl font-bold text-center">
          <span className="special-word">Edit</span>{" "}
          <span className="special-word-1">Profile</span>
        </h1>
        {error && (
          <div className="text-red-700 dark:text-red-400 font-medium p-2 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-700 dark:text-green-400 font-medium p-2 rounded">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col items-center space-y-3">
            <div className="relative w-32 h-32">
              {isLoading ? (
                <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
              ) : (
                <Image
                  src={previewUrl || demoImage}
                  alt="Avatar preview"
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full object-cover border-2 border-indigo-700 dark:border-gray-600"
                />
              )}
            </div>
            <div className="flex flex-col gap-3 w-full justify-center">
              <label
                className="block w-full text-sm font-medium dark:font-semibold"
                style={
                  isDarkTheme ? { color: "rgb(var(--primary))" } : undefined
                }
              >
                <span className="block mb-2 text-center">Upload Avatar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900 dark:file:text-indigo-200 dark:hover:file:bg-indigo-800 disabled:opacity-50"
                  disabled={isLoading}
                />
              </label>
              {previewUrl && (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={deleteAvatar}
                    onChange={(e) => setDeleteAvatar(e.target.checked)}
                    disabled={isLoading}
                    style={
                      isDarkTheme
                        ? { accentColor: "rgb(var(--primary))" }
                        : undefined
                    }
                  />
                  <span
                    className="text-[rgb(var(--foreground))] dark:font-semibold"
                    style={
                      isDarkTheme ? { color: "rgb(var(--primary))" } : undefined
                    }
                  >
                    Remove Avatar
                  </span>
                </label>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="name"
              className="block mb-1 font-medium dark:font-semibold"
              style={isDarkTheme ? { color: "rgb(var(--primary))" } : undefined}
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full p-3 border border-indigo-700 dark:border-gray-600 dark:bg-gray-700 dark:text-[rgb(var(--foreground))] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[rgb(var(--primary))] disabled:opacity-50"
              style={isDarkTheme ? { color: "rgb(var(--primary))" } : undefined}
              disabled={isLoading}
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label
              htmlFor="designation"
              className="block mb-1 font-medium dark:font-semibold"
              style={isDarkTheme ? { color: "rgb(var(--primary))" } : undefined}
            >
              Designation
            </label>
            <input
              type="text"
              id="designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="block w-full p-3 border border-indigo-700 dark:border-gray-600 dark:bg-gray-700 dark:text-[rgb(var(--foreground))] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[rgb(var(--primary))] disabled:opacity-50"
              style={isDarkTheme ? { color: "rgb(var(--primary))" } : undefined}
              disabled={isLoading}
              placeholder="Enter your designation"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[rgb(var(--primary))] text-white p-3 rounded-lg hover:bg-[rgb(var(--primary)/0.8)] dark:hover:bg-[rgb(188,165,252)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </section>
  )
}

export default ProfileEdit

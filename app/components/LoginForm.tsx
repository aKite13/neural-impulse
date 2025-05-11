"use client"

import Input from "../components/Input"
import Link from "next/link"
import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter, usePathname, useSearchParams } from "next/navigation" // Добавляем useSearchParams
import { useTheme } from "next-themes"

const LoginForm = () => {
  const router = useRouter()
  const pathname = usePathname() // Текущий путь
  const searchParams = useSearchParams() // Параметры URL
  const { theme } = useTheme()
  const { status } = useSession()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === "authenticated" && pathname === "/login") {
      const callbackUrl = searchParams.get("callbackUrl") || "/blog" // Используем callbackUrl или /blog
      router.replace(callbackUrl)
    }
  }, [status, router, pathname, searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        const callbackUrl = searchParams.get("callbackUrl") || "/blog" // Используем callbackUrl после входа
        router.replace(callbackUrl)
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "authenticated") {
    return null
  }

  const isDarkTheme = theme === "dark"

  return (
    <section className="flex items-center justify-center mt-30">
      <form
        onSubmit={handleSubmit}
        className="border-2 border-indigo-700 rounded-lg max-w-sm mx-auto px-8 py-6 space-y-5 bg-teal-100"
      >
        <h2 className="special-word-1 text-center">Login</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="form-input"
          isDark={isDarkTheme}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className="form-input"
          isDark={isDarkTheme}
        />
        <button
          type="submit"
          className="bg-indigo-700 text-white px-4 py-2 rounded-md w-full disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-center dark:font-semibold" style={isDarkTheme ? { color: "rgb(var(--primary))" } : undefined}>
          Don&apos;t have an account?{" "}
          <Link className="text-red-700" href="/signup">
            Sign up
          </Link>
        </p>
      </form>
    </section>
  )
}

export default LoginForm
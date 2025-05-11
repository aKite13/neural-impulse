"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

// Определяем тип User, соответствующий вашему next-auth конфигу
interface User {
  id: string // Обязательное поле, ожидаемое next-auth
  _id: string // Добавляем ваше кастомное поле
  name?: string | null
  email?: string | null
  designation?: string | null
  avatar?: { url: string; public_id: string } | null
  accessToken?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  setAuthError: (error: string | null) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  setAuthError: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const setAuthError = (error: string | null) => setError(error)


	useEffect(() => {
		console.log("AuthProvider: Status:", status, "Pathname:", window.location.pathname, "Session:", session)
		if (status === "loading") {
			setLoading(true)
		} else if (status === "authenticated") {
			const sessionUser = session?.user as User | undefined
			console.log("AuthProvider: Authenticated, user:", sessionUser, "path:", window.location.pathname)
			if (sessionUser) {
				setUser({
					id: sessionUser._id,
					_id: sessionUser._id,
					name: sessionUser.name || null,
					email: sessionUser.email || null,
					designation: sessionUser.designation || null,
					avatar: sessionUser.avatar || null,
					accessToken: sessionUser.accessToken || undefined,
				})
			} else {
				setUser(null)
			}
			setLoading(false)
		} else if (status === "unauthenticated") {
			setUser(null)
			setLoading(false)
			console.log("AuthProvider: Unauthenticated, path:", window.location.pathname)
			if (
				window.location.pathname !== "/login" &&
				window.location.pathname !== "/signup" &&
				window.location.pathname !== "/"
			) {
				console.log("AuthProvider: Redirecting to /login from:", window.location.pathname)
				router.push("/login")
			}
		}
	}, [status, session, router])

 





  return (
    <AuthContext.Provider value={{ user, loading, error, setAuthError }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

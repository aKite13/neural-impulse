"use client"

import React, { useState, useEffect, useRef } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { FaSun, FaMoon } from "react-icons/fa"

const Navbar: React.FC = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [showMenu, setShowMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const menuRef = useRef<HTMLLIElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileButtonRef = useRef<HTMLButtonElement>(null) // Новый реф для кнопки
  const demoImage = "/mern.png"

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      // Не закрываем, если клик был по кнопке открытия/закрытия
      if (mobileButtonRef.current && mobileButtonRef.current.contains(target)) {
        return
      }
      // Закрываем только если меню открыто и клик вне его
      if (
        showMobileMenu &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target)
      ) {
        setShowMobileMenu(false)
        console.log("Closed by click outside")
      }
      if (menuRef.current && !menuRef.current.contains(target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showMobileMenu]) // Зависимость от состояния меню

  useEffect(() => {
    console.log("showMobileMenu updated to:", showMobileMenu)
  }, [showMobileMenu])

  const handleMobileMenuClick = () => {
    console.log("Mobile menu clicked, current state:", showMobileMenu)
    if (showMobileMenu) {
      setShowMobileMenu(false)
      console.log("Closing mobile menu, new state:", false)
    } else {
      setShowMobileMenu(true)
      console.log("Opening mobile menu, new state:", true)
    }
  }

  const closeMobileMenu = () => {
    setShowMobileMenu(false)
    console.log("CloseMobileMenu called, new state:", false)
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    setShowMenu(false)
    setShowMobileMenu(false)
    router.push("/")
  }

  const renderAvatar = () => {
    if (status === "loading") {
      return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
    }
    if (status === "authenticated" && session?.user) {
      return (
        <Image
          src={session.user.avatar?.url || demoImage}
          alt="User avatar"
          width={30}
          height={30}
          priority
          className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
        />
      )
    }
    return null
  }

  const renderThemeToggle = () => {
    if (!isMounted) {
      return <div className="w-8 h-8" />
    }
    const isDarkTheme = theme === "dark"
    return (
      <button
        onClick={() => {
          setTheme(isDarkTheme ? "light" : "dark")
          closeMobileMenu()
        }}
        className="p-2 rounded-full transition-colors cursor-pointer"
        style={
          isDarkTheme
            ? { backgroundColor: "#4b5563", color: "#a78bfa" }
            : { backgroundColor: "#e0e7ff", color: "#facc15" }
        }
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = isDarkTheme
            ? "#6b7280"
            : "#c7d2fe")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = isDarkTheme
            ? "#4b5563"
            : "#e0e7ff")
        }
        aria-label="Toggle theme"
      >
        {isDarkTheme ? <FaSun /> : <FaMoon />}
      </button>
    )
  }

  const isDarkTheme = isMounted ? theme === "dark" : false

  return (
    <nav
      className="bg-white dark:bg-gray-900 shadow-md py-4 px-4 md:px-30 relative"
      style={isDarkTheme ? { backgroundColor: "#1f2937" } : undefined}
    >
      <div className="flex justify-between items-center">
        <Link href="/">
          <h2>
            <span className="special-word">Neural</span>
            <span className="special-word-1">Impulse</span>
          </h2>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-6">
          <li>{renderThemeToggle()}</li>
          <li>
            <Link
              href="/blog"
              className={
                pathname === "/blog"
                  ? "text-fuchsia-600 dark:text-fuchsia-500 font-bold"
                  : "hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
              }
            >
              Blog
            </Link>
          </li>
          {status === "authenticated" && session?.user ? (
            <>
              <li>
                <Link
                  href="/create-blog"
                  className={
                    pathname === "/create-blog"
                      ? "text-fuchsia-600 dark:text-fuchsia-500 font-bold"
                      : "hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                  }
                >
                  Create
                </Link>
              </li>
              <li className="relative" ref={menuRef}>
                <div
                  className="cursor-pointer"
                  onClick={() => setShowMenu(!showMenu)}
                  aria-haspopup="true"
                  aria-expanded={showMenu}
                >
                  {renderAvatar()}
                </div>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/profile/edit"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700
                        hover:text-blue-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      // onClick={() => setShowMenu(false)}
											onClick={() => {
												console.log("Desktop menu: Navigating to /profile/edit");
												setShowMenu(false);
											}}
                    >
                      Profile
                    </Link>
                    <button
                      type="button"
                      className="block w-full text-left px-4 py-2 text-sm
                        hover:text-red-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
            </>
          ) : status === "unauthenticated" ? (
            <>
              <li>
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    pathname === "/login"
                      ? "bg-rose-700 text-white font-bold"
                      : "bg-indigo-700 dark:bg-indigo-500 text-white hover:bg-indigo-600 dark:hover:bg-indigo-400"
                  }`}
                >
                  Log In
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => router.push("/signup")}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    pathname === "/signup"
                      ? "bg-rose-700 text-white font-bold"
                      : "bg-indigo-700 dark:bg-indigo-500 text-white hover:bg-indigo-600 dark:hover:bg-indigo-400"
                  }`}
                >
                  Sign Up
                </button>
              </li>
            </>
          ) : null}
        </ul>

        {/* Mobile Menu Button */}
        <button
          ref={mobileButtonRef} // Привязываем реф к кнопке
          className="md:hidden p-2"
          onClick={handleMobileMenuClick}
          aria-label="Toggle menu"
          style={isDarkTheme ? { color: "#a78bfa" } : { color: "#00ffcc" }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {showMobileMenu ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-50"
          style={isDarkTheme ? { backgroundColor: "#1f2937" } : undefined}
        >
          <div className="px-4 py-2 space-y-2">
            <button
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark")
                closeMobileMenu()
              }}
              className="w-full flex justify-start px-4 py-2 rounded-md transition-colors "
              style={
                isDarkTheme
                  ? { backgroundColor: "#4b5563", color: "#a78bfa" }
                  : { backgroundColor: "#e0e7ff", color: "#facc15" }
              }
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = isDarkTheme
                  ? "#6b7280"
                  : "#c7d2fe")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = isDarkTheme
                  ? "#4b5563"
                  : "#e0e7ff")
              }
              aria-label="Toggle theme"
            >
              {isMounted && theme !== undefined ? (
                theme === "dark" ? (
                  <FaSun />
                ) : (
                  <FaMoon />
                )
              ) : (
                <div className="w-5 h-5" />
              )}
              <span className="ml-2">Toggle Theme</span>
            </button>
            <Link
              href="/blog"
              className="block px-4 py-2 rounded-md"
              style={
                isDarkTheme
                  ? { color: "#a78bfa", backgroundColor: "transparent" }
                  : { color: "#8b5cf6", backgroundColor: "transparent" }
              }
              onClick={closeMobileMenu}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = isDarkTheme
                  ? "#4b5563"
                  : "#e0e7ff")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Blog
            </Link>
            {status === "authenticated" && session?.user ? (
              <>
                <Link
                  href="/create-blog"
                  className="block px-4 py-2 rounded-md"
                  style={
                    isDarkTheme
                      ? { color: "#a78bfa", backgroundColor: "transparent" }
                      : { color: "#8b5cf6", backgroundColor: "transparent" }
                  }
                  onClick={closeMobileMenu}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = isDarkTheme
                      ? "#4b5563"
                      : "#e0e7ff")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  Create
                </Link>
                <Link
                  href="/profile/edit"
                  className="block w-full text-left px-4 py-2 rounded-md"
                  style={
                    isDarkTheme
                      ? { color: "#a78bfa", backgroundColor: "transparent" }
                      : { color: "#8b5cf6", backgroundColor: "transparent" }
                  }
                  onClick={closeMobileMenu}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = isDarkTheme
                      ? "#4b5563"
                      : "#e0e7ff")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  Profile
                </Link>
                <button
                  type="button"
                  className="block w-full text-left px-4 py-2 rounded-md "
                  style={
                    isDarkTheme
                      ? { color: "#a78bfa", backgroundColor: "transparent" }
                      : { color: "#8b5cf6", backgroundColor: "transparent" }
                  }
                  onClick={handleLogout}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = isDarkTheme
                      ? "#4b5563"
                      : "#e0e7ff")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  Logout
                </button>
              </>
            ) : status === "unauthenticated" ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    router.push("/login")
                    closeMobileMenu()
                  }}
                  className="w-full px-4 py-2 rounded-md transition-colors"
                  style={
                    isDarkTheme
                      ? { backgroundColor: "#60a5fa", color: "#ffffff" }
                      : { backgroundColor: "#3b82f6", color: "#ffffff" }
                  }
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = isDarkTheme
                      ? "#3b82f6"
                      : "#2563eb")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = isDarkTheme
                      ? "#60a5fa"
                      : "#3b82f6")
                  }
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    router.push("/signup")
                    closeMobileMenu()
                  }}
                  className="w-full px-4 py-2 rounded-md transition-colors"
                  style={
                    isDarkTheme
                      ? { backgroundColor: "#60a5fa", color: "#ffffff" }
                      : { backgroundColor: "#3b82f6", color: "#ffffff" }
                  }
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = isDarkTheme
                      ? "#3b82f6"
                      : "#2563eb")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = isDarkTheme
                      ? "#60a5fa"
                      : "#3b82f6")
                  }
                >
                  Sign Up
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

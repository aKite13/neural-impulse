
"use client";

import Input from "../components/Input";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../../app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { useTheme } from "next-themes";

const SignupForm = () => {
  const { setAuthError } = useAuth();
  const router = useRouter();
	const { theme } = useTheme()
  const { status } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/blog");
    }
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Автоматический вход после регистрации или обновления
        await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });
        router.replace("/"); // Перенаправление на главную страницу
      } else {
        setError(data.error || "Registration failed");
        setAuthError(data.error || "Registration failed");
      }
    } catch {
      setError("Network error. Please try again.");
      setAuthError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "authenticated") {
    return null;
  }
	const isDarkTheme = theme === "dark"; // Определяем, тёмная ли тема
  return (
    <section className="flex items-center justify-center mt-30">
      <form
        onSubmit={handleSubmit}
        className="border-2 border-indigo-700 rounded-lg max-w-sm mx-auto px-8 py-6 space-y-5 bg-teal-100"
      >
        <h2 className="text-center special-word" style={{ color: "var(--brightPurple)" }}>
          Sign up
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <Input
          label="Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
					className="form-input"
					isDark={isDarkTheme}
        />
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
          {loading ? "Signing up..." : "Sign up"}
        </button>
        <p className="text-center dark:font-semibold" style={isDarkTheme ? { color: "rgb(var(--primary))" } : undefined}>
          Already have an account?{" "}
          <Link className="text-red-700" href="/login">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
};

export default SignupForm;

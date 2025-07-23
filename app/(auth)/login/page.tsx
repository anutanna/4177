"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/auth-client";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setError(error.message || "Login failed");
      } else {
        // Login successful, redirect to home
        router.push("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col">
      <main className="flex-1 flex items-center justify-center bg-gray-50 py-20 px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg mx-4"
        >
          <h1 className="text-2xl font-bold text-center">Log In</h1>
          {error && <p className="text-red-600 text-center">{error}</p>}

          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={loading}
              className="w-full py-2 px-3 border border-gray-300 mb-4 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              disabled={loading}
              className="w-full py-2 px-3 border border-gray-300 mb-4 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 hover:bg-blue-700"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="text-center mt-4">
            <a
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <div className="text-center mt-2">
            <a href="/signup" className="text-sm text-gray-700 hover:underline">
              New user? Sign up here
            </a>
          </div>
        </form>
      </main>
    </div>
  );
}

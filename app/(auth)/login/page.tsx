"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/auth-client";
import styles from "./LoginPage.module.css";

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
    <div className={styles.container}>
      <main className={styles.main}>
        <form onSubmit={handleSubmit} className={styles.formWrapper}>
          <h1 className={styles.title}>Log In</h1>
          {error && <p className={styles.errorMsg}>{error}</p>}

          <div>
            <label htmlFor="email" className={styles.fieldLabel}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={loading}
              className={styles.fieldInput}
            />
          </div>

          <div>
            <label htmlFor="password" className={styles.fieldLabel}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              disabled={loading}
              className={styles.fieldInput}
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
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

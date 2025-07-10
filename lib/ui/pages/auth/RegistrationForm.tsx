"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUserAction } from "@/lib/actions/register_action";
import { UserRole } from "@prisma/client";

export default function RegisterPageFormAction() {
  const [mode, setMode] = useState<UserRole>(UserRole.CUSTOMER);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setError("");

    try {
      await registerUserAction(formData);
      // If successful, redirect to home page
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-8">
      <h1 className="text-2xl font-semibold text-center mb-6">Register</h1>

      <div className="flex justify-center mb-6">
        <button
          type="button"
          onClick={() => setMode(UserRole.CUSTOMER)}
          className={`px-4 py-2 border rounded-l-md ${
            mode === UserRole.CUSTOMER
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Customer
        </button>
        <button
          type="button"
          onClick={() => setMode(UserRole.VENDOR)}
          className={`px-4 py-2 border-t border-b border-r rounded-r-md ${
            mode === UserRole.VENDOR
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Vendor
        </button>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <input type="hidden" name="role" value={mode} />

        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        {mode === UserRole.VENDOR && (
          <>
            <div className="pt-4 border-t">
              <h2 className="text-lg font-semibold mb-2">Business Info</h2>
            </div>
            <div>
              <label className="block mb-1 font-medium">Business Name</label>
              <input
                type="text"
                name="businessName"
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Business Email</label>
              <input
                type="email"
                name="businessEmail"
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Phone</label>
              <input
                type="text"
                name="businessPhone"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Address</label>
              <input
                type="text"
                name="businessAddress"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Website</label>
              <input
                type="url"
                name="businessWebsite"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                name="businessDescription"
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
              ></textarea>
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {mode === UserRole.CUSTOMER ? "Register as Customer" : "Register as Vendor"}
        </button>
        <div className="text-center mt-4">
  <a href="/login" className="text-sm text-gray-700 hover:underline">
    Already have an account? Sign in here
  </a>
</div>

      </form>

      {error && <p className="mt-4 text-center text-red-600">{error}</p>}
    </div>
  );
}

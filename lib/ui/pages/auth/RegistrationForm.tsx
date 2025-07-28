"use client";
import { useActionState, useEffect } from "react";
import { UserRole } from "@prisma/client";
import { registerUser } from "@/lib/actions/auth_actions";

export default function RegisterPageFormAction() {
  const [state, action, isPending] = useActionState(registerUser, null);

  useEffect(() => {
    // If registration was successful
    if (state?.success && !isPending) {
      // Force refresh the auth session to get updated user data
      window.location.reload();
    }
  }, [state, isPending]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-8">
      <h1 className="text-2xl font-semibold text-center mb-6">Register</h1>

      <form action={action} className="space-y-4">
        <input type="hidden" name="role" value={UserRole.CUSTOMER} />

        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            className="w-full px-3 py-2 border rounded-md"
            required
            disabled={isPending}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            className="w-full px-3 py-2 border rounded-md"
            required
            disabled={isPending}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            className="w-full px-3 py-2 border rounded-md"
            required
            disabled={isPending}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            className="w-full px-3 py-2 border rounded-md"
            required
            disabled={isPending}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Processing..." : "Register"}
        </button>
        <div className="text-center mt-4">
          <a href="/login" className="text-sm text-gray-700 hover:underline">
            Already have an account? Sign in here
          </a>
          <p className="text-sm text-gray-700">Check your profile page to become a vendor!</p>
        </div>
      </form>

      {state?.error && (
        <p className="mt-4 text-center text-red-600">{state.error}</p>
      )}
    </div>
  );
}

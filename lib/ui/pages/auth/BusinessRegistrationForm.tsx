"use client";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/auth-client";
import { upgradeToVendor } from "@/lib/actions/auth_actions";

export default function BusinessRegistrationForm() {
  const [state, action, isPending] = useActionState(upgradeToVendor, null);
  const { data: session } = authClient.useSession();
  const { signOut } = authClient;
  const router = useRouter();

  useEffect(() => {
    // Redirect if already a vendor
    if (
      session?.user &&
      "role" in session.user &&
      session.user.role === "VENDOR"
    ) {
      router.push("/dashboard");
      return;
    }

    // If registration was successful, redirect to business registration success page
    if (state?.success && !isPending) {
      // Sign out to force session refresh, then redirect to login
      const handleSignOutAndRedirect = async () => {
        await signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push(
                "/login?message=Business registered successfully! Please sign in again to access your vendor dashboard."
              );
            },
          },
        });
      };
      handleSignOutAndRedirect();
    }
  }, [state, isPending, session, router, signOut]);

  // Don't render if already a vendor
  if (
    session?.user &&
    "role" in session.user &&
    session.user.role === "VENDOR"
  ) {
    return null;
  }

  // Show loading if session is still loading
  if (!session?.user) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-8">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-8">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Upgrade to Vendor Account
      </h1>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-blue-800 text-sm">
          <strong>Hi {session?.user?.name}!</strong> Complete the form below to
          upgrade your account to a vendor account. This will allow you to sell
          products on our platform.
        </p>
      </div>

      <form action={action} className="space-y-4">
        <input type="hidden" name="userId" value={session?.user?.id || ""} />
        <div>
          <label className="block mb-1 font-medium">Business Name</label>
          <input
            type="text"
            name="businessName"
            className="w-full px-3 py-2 border rounded-md"
            required
            disabled={isPending}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Business Email</label>
          <input
            type="email"
            name="businessEmail"
            className="w-full px-3 py-2 border rounded-md"
            required
            disabled={isPending}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input
            type="text"
            name="businessPhone"
            className="w-full px-3 py-2 border rounded-md"
            disabled={isPending}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Address</label>
          <input
            type="text"
            name="businessAddress"
            className="w-full px-3 py-2 border rounded-md"
            disabled={isPending}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Website</label>
          <input
            type="url"
            name="businessWebsite"
            className="w-full px-3 py-2 border rounded-md"
            disabled={isPending}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="businessDescription"
            className="w-full px-3 py-2 border rounded-md"
            rows={3}
            disabled={isPending}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Processing..." : "Upgrade to Vendor Account"}
        </button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-gray-700 hover:underline"
          >
            Cancel and go back
          </button>
        </div>
      </form>

      {state?.error && (
        <p className="mt-4 text-center text-red-600">{state.error}</p>
      )}
    </div>
  );
}

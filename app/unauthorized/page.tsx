"use client";

import Link from "next/link";
import { authClient } from "@/auth-client";
import { useRouter } from "next/navigation";
import { UserRole } from "@prisma/client";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleVendorRegistration = async () => {
    try {
      // If user is logged in as a customer, redirect to business registration
      if (
        session?.user &&
        "role" in session.user &&
        session.user.role === UserRole.CUSTOMER
      ) {
        router.push("/business-registration");
        return;
      }

      // If not logged in, sign out and redirect to signup
      await authClient.signOut();
      router.push("/signup");
    } catch (error) {
      console.error("Error during vendor registration redirect:", error);
      // If logout fails, redirect to signup
      router.push("/signup");
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-error mb-4">403</h1>
          <h2 className="text-3xl font-bold text-base-content mb-4">
            Access Denied
          </h2>
          <p className="text-lg text-base-content/70 mb-8 max-w-md mx-auto">
            You don&apos;t have permission to access this page.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/" className="btn btn-primary">
            Go Home
          </Link>
          <div className="text-sm text-base-content/60">
            Need vendor access?{" "}
            <button
              onClick={handleVendorRegistration}
              className="link link-primary cursor-pointer"
            >
              {session?.user &&
              "role" in session.user &&
              session.user.role === UserRole.CUSTOMER
                ? "Upgrade to vendor account"
                : "Register as a vendor"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

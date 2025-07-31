import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import VendorNewProductForm from "@/lib/ui/vendor/VendorNewProductForm";
import { getBusinessByUserId } from "@/lib/actions/db_order_actions";

export default async function NewProductPage() {
  // Authentication is handled by middleware
  // Here we only check authorization (vendor role)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Check if user has vendor role (user should exist due to middleware auth check)
  const user = session?.user as {
    role?: UserRole;
    id?: string;
    email?: string;
  };
  if (!user?.role || user.role !== UserRole.VENDOR) {
    redirect("/unauthorized");
  }

  try {
    // Get business
    const business = await getBusinessByUserId(user.id!);

    if (!business) {
      // If no business exists, redirect to business registration
      redirect("/business-registration");
    }

    return <VendorNewProductForm business={business} />;
  } catch (error) {
    console.error("Error fetching business data:", error);
    redirect("/unauthorized");
  }
}

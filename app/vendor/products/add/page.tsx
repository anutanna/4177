import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import VendorPageLayout from "@/lib/ui/dashboard/VendorPageLayout";
import { getBusinessByUserId } from "@/lib/actions/db_order_actions";
import AddProductForm from "@/lib/ui/vendor/AddProductForm";

export default async function AddProductPage() {
  // authorization (vendor role)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  
  const user = session?.user as {
    role?: UserRole;
    id?: string;
    email?: string;
  };
  if (!user?.role || user.role !== UserRole.VENDOR) {
    redirect("/unauthorized");
  }

  // Get business
  let business;

  try {
    business = await getBusinessByUserId(user.id!);

    if (!business) {
      // If no business exists, redirect to business registration
      redirect("/business-registration");
    }
  } catch (error) {
    console.error("Error fetching business data:", error);
    redirect("/unauthorized");
  }

  return (
    <VendorPageLayout
      pageTitle="Product Management"
      backgroundImage="/hero-bg.jpg"
      vendorName={business?.name || "Shopizon"}
      vendorLogo={business?.logo || "/placeholder-logo.svg"}
      activeTab="Product Management"
      sectionTitle="Add New Product"
    >
      <AddProductForm businessId={business.id} />
    </VendorPageLayout>
  );
} 
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { notFound } from "next/navigation";
import VendorProductDetails from "@/lib/ui/vendor/VendorProductDetails";
import { getBusinessByUserId } from "@/lib/actions/db_order_actions";
import { getProductById } from "@/lib/actions/db_product_actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function VendorProductPage({ params }: Props) {
  const { id } = await params;

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

    // Get product
    const product = await getProductById(id);

    if (!product) {
      notFound();
    }

    // Check if the product belongs to this vendor's business
    if (product.businessId !== business.id) {
      redirect("/unauthorized");
    }

    return <VendorProductDetails product={product} business={business} />;
  } catch (error) {
    console.error("Error fetching product data:", error);
    notFound();
  }
}

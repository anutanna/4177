import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";
import VendorPageLayout from "@/lib/ui/dashboard/VendorPageLayout";
import { getBusinessByUserId } from "@/lib/actions/db_order_actions";
import { getProductsByBusiness } from "@/lib/actions/db_product_actions";
import ProductManagementTable from "@/lib/ui/vendor/ProductManagementTable";

// Types for the product management
interface ProductManagementItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  status: "Visible" | "Not Visible";
}

export default async function VendorProductsPage() {
  // authorization (vendor role)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Checking if user has vendor role (user should exist due to middleware auth check)
  const user = session?.user as {
    role?: UserRole;
    id?: string;
    email?: string;
  };
  if (!user?.role || user.role !== UserRole.VENDOR) {
    redirect("/unauthorized");
  }

  // business and products
  let business;
  let products: ProductManagementItem[] = [];

  try {
    business = await getBusinessByUserId(user.id!);

    if (!business) {
      // If no business exists, redirect to business registration
      redirect("/business-registration");
    }

    // Fetch products for this business
    const businessProducts = await getProductsByBusiness(business.id);

    // Transform products for the component
    products = businessProducts.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description || "No description provided",
      image: product.images?.[0]?.url || "/no-image.svg",
      price: product.price,
      quantity: product.stock,
      status: product.stock > 0 ? "Visible" : "Not Visible", // Simple logic for now
    }));
  } catch (error) {
    console.error("Error fetching product management data:", error);
    redirect("/unauthorized");
  }

  return (
    <VendorPageLayout
      pageTitle="Product Management"
      backgroundImage="/hero-bg.jpg"
      vendorName={business?.name || "Shopizon"}
      vendorLogo={business?.logo || "/placeholder-logo.svg"}
      activeTab="Product Management"
      sectionTitle="Listed Products"
      actionButton={
        <Link href="/vendor/products/add" className="btn btn-primary gap-2">
          <FaPlus className="text-sm" />
          Add Product(s)
        </Link>
      }
    >
      {/* Product Management Card */}
      <div className="card bg-base-100 shadow-sm border border-gray-300">
        <div className="card-body">


          {/* Product Management Table */}
          <ProductManagementTable products={products} />

          {/* Total Products Count */}
          <div className="text-left text-sm text-gray-500 mt-4">
            Total: {products.length} product{products.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </VendorPageLayout>
  );
} 
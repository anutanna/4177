import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { FaPlus } from "react-icons/fa";
import VendorPageLayout from "@/lib/ui/dashboard/VendorPageLayout";
import InventoryTable from "@/lib/ui/inventory/InventoryTable";
import { getBusinessByUserId } from "@/lib/actions/db_order_actions";
import { getProductsByBusiness } from "@/lib/actions/db_product_actions";

// Types for the inventory
interface InventoryProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  status: "Visible" | "Not Visible";
}

export default async function Inventory() {
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

  // Get business and products
  let business;
  let products: InventoryProduct[] = [];

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
    console.error("Error fetching inventory data:", error);
    redirect("/unauthorized");
  }

  return (
    <VendorPageLayout
      pageTitle="Inventory Management"
      backgroundImage="/hero-bg.jpg"
      vendorName={business?.name || "Shopizon"}
      vendorLogo={business?.logo || "/placeholder-logo.svg"}
      activeTab="Inventory"
      sectionTitle="Product Inventory"
      actionButton={
        <button className="btn btn-primary gap-2">
          <FaPlus className="text-sm" />
          Add Product(s)
        </button>
      }
    >
      {/* DaisyUI: card component for inventory section */}
      <div className="card bg-base-100 shadow-sm border border-gray-300">
        <div className="card-body">
          {/* Filters Section */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-base-content mb-2">
                Search for Product
              </label>
              <input
                type="text"
                placeholder="Search"
                className="input input-bordered w-full"
              />
            </div>

            {/* Category Dropdown */}
            <div className="w-full lg:w-auto lg:min-w-48">
              <label className="block text-sm font-medium text-base-content mb-2">
                Category
              </label>
              <select className="select select-bordered w-full">
                <option>All</option>
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Home & Garden</option>
                <option>Sports & Outdoors</option>
                <option>Books & Media</option>
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="w-full lg:w-auto lg:min-w-48">
              <label className="block text-sm font-medium text-base-content mb-2">
                Status
              </label>
              <select className="select select-bordered w-full">
                <option>All</option>
                <option>Visible</option>
                <option>Not Visible</option>
              </select>
            </div>
          </div>

          {/* Inventory Table */}
          <InventoryTable products={products} />

          {/* Total Products Count */}
          <div className="text-left text-sm text-gray-500 mt-4">
            Total: {products.length} product{products.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </VendorPageLayout>
  );
}

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { UserRole, OrderStatus } from "@prisma/client";
import {
  FaDollarSign,
  FaUndo,
  FaShoppingCart,
  FaShoppingBasket,
} from "react-icons/fa";
import VendorPageLayout from "@/lib/ui/dashboard/VendorPageLayout";
import PerformanceCard from "@/lib/ui/dashboard/PerformanceCard";
import OrdersTable from "@/lib/ui/dashboard/OrdersTable";
import {
  getBusinessByUserId,
  getOrdersByBusiness,
  getBusinessPerformanceData,
} from "@/lib/actions/db_order_actions";

// Types for the dashboard
interface DashboardOrder {
  id: string;
  orderNumber: string;
  deliveryDate: string;
  customer: {
    name: string;
    avatar: string;
  };
  amount: number;
  status: "Complete" | "Pending" | "In Progress" | "Cancelled";
}

export default async function Dashboard() {
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

  // If no business exists for the user, use dummy data for mat@dal.ca
  let business;
  let orders: DashboardOrder[] = [];
  let performanceData;

  try {
    business = await getBusinessByUserId(user.id!);

    if (!business) {
      redirect("/unauthorized");
    }

    // Fetch real data for existing business
    const [businessOrders, businessPerformance] = await Promise.all([
      getOrdersByBusiness(business.id),
      getBusinessPerformanceData(business.id),
    ]);

    // Map order status from database to component format
    const mapOrderStatus = (
      status: OrderStatus
    ): "Complete" | "Pending" | "In Progress" | "Cancelled" => {
      switch (status) {
        case OrderStatus.COMPLETED:
          return "Complete";
        case OrderStatus.PENDING:
          return "Pending";
        case OrderStatus.IN_PROGRESS:
          return "In Progress";
        case OrderStatus.CANCELLED:
          return "Cancelled";
        default:
          return "Pending";
      }
    };

    // Transform orders for the component
    orders = businessOrders.map((order) => ({
      id: order.id,
      orderNumber: `#${order.id.slice(-6).toUpperCase()}`,
      deliveryDate: order.createdAt.toLocaleDateString("en-US", {
        weekday: "short",
        hour: "numeric",
        minute: "2-digit",
      }),
      customer: {
        name: order.user.name,
        avatar:
          order.user.image ||
          `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
      },
      amount: order.total,
      status: mapOrderStatus(order.status),
    }));

    // Create performance data from real business data
    performanceData = [
      {
        title: "Revenue",
        value: `$${businessPerformance.revenue.toLocaleString()}`,
        change: 3.5, // TODO: Calculate real change percentage
        icon: <FaDollarSign size={20} />,
      },
      {
        title: "Refunds",
        value: `$${businessPerformance.refunds.toLocaleString()}`,
        change: -1.2, // TODO: Calculate real change percentage
        icon: <FaUndo size={20} />,
        inverted: true,
      },
      {
        title: "Orders",
        value: businessPerformance.totalOrders.toLocaleString(),
        change: 8.3, // TODO: Calculate real change percentage
        icon: <FaShoppingCart size={20} />,
      },
      {
        title: "Basket Size",
        value: `$${businessPerformance.avgBasketSize.toFixed(2)}`,
        change: 2.1, // TODO: Calculate real change percentage
        icon: <FaShoppingBasket size={20} />,
      },
    ];
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    redirect("/unauthorized");
  }

  return (
    <VendorPageLayout
      pageTitle="Vendor Dashboard"
      vendorName={business?.name || "Shopizon"}
      vendorLogo={
        business?.logo ||
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop"
      }
      activeTab="Dashboard"
      sectionTitle="Performance Summary"
    >
      {/* Performance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {performanceData.map((data, index) => (
          <PerformanceCard
            key={index}
            title={data.title}
            value={data.value}
            change={data.change}
            icon={data.icon}
            inverted={data.inverted}
          />
        ))}
      </div>

      {/* Orders Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-base-content mb-4">Orders</h2>
          {/* DaisyUI: divider */}
          <div className="divider"></div>
        </div>

        {/* DaisyUI: card component for orders section */}
        <div className="card bg-base-100 shadow-sm border border-gray-300">
          <div className="card-body">
            {/* Filters Section */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Search Bar - DaisyUI: input component */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-base-content mb-2">
                  Search Orders
                </label>
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="input input-bordered w-full"
                />
              </div>

              {/* Status Dropdown - DaisyUI: select component */}
              <div className="w-full sm:w-auto sm:min-w-48">
                <label className="block text-sm font-medium text-base-content mb-2">
                  Status
                </label>
                <select className="select select-bordered w-full">
                  <option>All Status</option>
                  <option>Complete</option>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <OrdersTable orders={orders} />
          </div>
        </div>
      </div>
    </VendorPageLayout>
  );
}

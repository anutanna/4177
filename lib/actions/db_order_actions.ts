"use server";

import { prisma as db } from "@/lib/db/prisma";
import { OrderStatus, RefundStatus } from "@prisma/client";

export async function getOrdersByBusiness(businessId: string) {
  try {
    const orders = await db.order.findMany({
      where: { businessId },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return orders;
  } catch (error) {
    console.error("Error fetching orders by business:", error);
    throw new Error("Failed to fetch orders by business");
  }
}

export async function getBusinessPerformanceData(businessId: string) {
  try {
    // Get total revenue
    const totalRevenue = await db.order.aggregate({
      where: {
        businessId,
        status: OrderStatus.COMPLETED,
      },
      _sum: {
        total: true,
      },
    });

    // Get total orders count
    const totalOrders = await db.order.count({
      where: { businessId },
    });

    // Get completed orders count
    const completedOrders = await db.order.count({
      where: {
        businessId,
        status: OrderStatus.COMPLETED,
      },
    });

    // Calculate average basket size
    const avgBasketSize =
      totalRevenue._sum.total && completedOrders > 0
        ? totalRevenue._sum.total / completedOrders
        : 0;

    // Get actual refunds from the refunds table
    const totalRefunds = await db.refund.aggregate({
      where: {
        businessId,
        status: {
          in: [RefundStatus.APPROVED, RefundStatus.PROCESSED],
        },
      },
      _sum: {
        amount: true,
      },
    });

    return {
      revenue: totalRevenue._sum.total || 0,
      refunds: totalRefunds._sum.amount || 0,
      totalOrders,
      completedOrders,
      avgBasketSize,
    };
  } catch (error) {
    console.error("Error fetching business performance data:", error);
    throw new Error("Failed to fetch business performance data");
  }
}

export async function getBusinessByUserId(userId: string) {
  try {
    const business = await db.business.findFirst({
      where: { userOwnerId: userId },
      include: {
        products: true,
        orders: true,
        user: true,
      },
    });
    return business;
  } catch (error) {
    console.error("Error fetching business by user ID:", error);
    throw new Error("Failed to fetch business by user ID");
  }
}

export async function getRefundsByBusiness(businessId: string) {
  try {
    const refunds = await db.refund.findMany({
      where: { businessId },
      include: {
        user: true,
        order: {
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return refunds;
  } catch (error) {
    console.error("Error fetching refunds by business:", error);
    throw new Error("Failed to fetch refunds by business");
  }
}

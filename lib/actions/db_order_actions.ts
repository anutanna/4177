"use server";

import { prisma as db } from "@/lib/db/prisma";
import { OrderStatus } from "@prisma/client";

export async function getOrders() {
  try {
    const orders = await db.order.findMany({
      include: {
        user: true,
        vendor: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
}

export async function createOrder(
  userId: string,
  vendorId: string,
  total: number,
  orderItems: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>
) {
  try {
    const order = await db.order.create({
      data: {
        userId,
        vendorId,
        total,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        user: true,
        vendor: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order");
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  try {
    const order = await db.order.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        vendor: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    return order;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
}

export async function deleteOrder(id: string) {
  try {
    // Delete order items first (cascade delete)
    await db.orderItem.deleteMany({
      where: { orderId: id },
    });

    const order = await db.order.delete({
      where: { id },
    });
    return order;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw new Error("Failed to delete order");
  }
}

export async function getOrderById(id: string) {
  try {
    const order = await db.order.findUnique({
      where: { id },
      include: {
        user: true,
        vendor: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    throw new Error("Failed to fetch order by ID");
  }
}

export async function getOrdersByUser(userId: string) {
  try {
    const orders = await db.order.findMany({
      where: { userId },
      include: {
        vendor: true,
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
    console.error("Error fetching orders by user:", error);
    throw new Error("Failed to fetch orders by user");
  }
}

export async function getOrdersByVendor(vendorId: string) {
  try {
    const orders = await db.order.findMany({
      where: { vendorId },
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
    console.error("Error fetching orders by vendor:", error);
    throw new Error("Failed to fetch orders by vendor");
  }
}

export async function getOrdersByStatus(status: OrderStatus) {
  try {
    const orders = await db.order.findMany({
      where: { status },
      include: {
        user: true,
        vendor: true,
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
    console.error("Error fetching orders by status:", error);
    throw new Error("Failed to fetch orders by status");
  }
}

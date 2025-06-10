"use server";

import { prisma as db } from "@/lib/db/prisma";

export async function createOrderItem(
  orderId: string,
  productId: string,
  quantity: number,
  price: number
) {
  try {
    const orderItem = await db.orderItem.create({
      data: {
        orderId,
        productId,
        quantity,
        price,
      },
      include: {
        order: true,
        product: true,
      },
    });
    return orderItem;
  } catch (error) {
    console.error("Error creating order item:", error);
    throw new Error("Failed to create order item");
  }
}

export async function updateOrderItem(
  id: string,
  quantity?: number,
  price?: number
) {
  try {
    const updateData: {
      quantity?: number;
      price?: number;
    } = {};

    if (quantity !== undefined) updateData.quantity = quantity;
    if (price !== undefined) updateData.price = price;

    const orderItem = await db.orderItem.update({
      where: { id },
      data: updateData,
      include: {
        order: true,
        product: true,
      },
    });
    return orderItem;
  } catch (error) {
    console.error("Error updating order item:", error);
    throw new Error("Failed to update order item");
  }
}

export async function deleteOrderItem(id: string) {
  try {
    const orderItem = await db.orderItem.delete({
      where: { id },
    });
    return orderItem;
  } catch (error) {
    console.error("Error deleting order item:", error);
    throw new Error("Failed to delete order item");
  }
}

export async function getOrderItemsByOrder(orderId: string) {
  try {
    const orderItems = await db.orderItem.findMany({
      where: { orderId },
      include: {
        product: {
          include: {
            vendor: true,
          },
        },
      },
    });
    return orderItems;
  } catch (error) {
    console.error("Error fetching order items by order:", error);
    throw new Error("Failed to fetch order items by order");
  }
}

export async function getOrderItemsByProduct(productId: string) {
  try {
    const orderItems = await db.orderItem.findMany({
      where: { productId },
      include: {
        order: {
          include: {
            user: true,
            vendor: true,
          },
        },
      },
    });
    return orderItems;
  } catch (error) {
    console.error("Error fetching order items by product:", error);
    throw new Error("Failed to fetch order items by product");
  }
}

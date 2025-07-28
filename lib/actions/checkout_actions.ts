"use server";

import { prisma as db } from "@/lib/db/prisma";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { OrderStatus } from "@prisma/client";

export async function createOrderFromCart() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Get cart items
    const cartItems = await db.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            business: true,
            brand: true,
            images: true,
          },
        },
      },
    });

    if (cartItems.length === 0) {
      return { success: false, error: "Cart is empty" };
    }

    // Group items by business to create separate orders
    const itemsByBusiness = cartItems.reduce((acc, item) => {
      const businessId = item.product.business.id;
      if (!acc[businessId]) {
        acc[businessId] = [];
      }
      acc[businessId].push(item);
      return acc;
    }, {} as Record<string, typeof cartItems>);

    const createdOrders = [];

    // Create an order for each business
    for (const [businessId, items] of Object.entries(itemsByBusiness)) {
      // Calculate order total
      const subtotal = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      const shipping = 9.99;
      const tax = subtotal * 0.08;
      const total = subtotal + shipping + tax;

      // Create the order
      const order = await db.order.create({
        data: {
          userId: session.user.id,
          businessId: businessId,
          total: total,
          status: OrderStatus.PENDING,
        },
      });

      // Create order items
      for (const cartItem of items) {
        await db.orderItem.create({
          data: {
            orderId: order.id,
            productId: cartItem.product.id,
            quantity: cartItem.quantity,
            price: cartItem.product.price,
          },
        });
      }

      createdOrders.push(order);
    }

    // Clear the cart
    await db.cartItem.deleteMany({
      where: { userId: session.user.id },
    });

    return { success: true, orders: createdOrders };
  } catch (error) {
    console.error("Error creating order from cart:", error);
    return { success: false, error: "Failed to create order" };
  }
}

export async function getOrderById(orderId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return null;
    }

    const order = await db.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id, // Only get user's own orders
      },
      include: {
        business: true,
        orderItems: {
          include: {
            product: {
              include: {
                business: true,
                brand: true,
                images: true,
              },
            },
          },
        },
      },
    });

    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

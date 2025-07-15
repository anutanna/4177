"use server";

import { prisma as db } from "@/lib/db/prisma";
import { auth } from "@/auth";
import { headers } from "next/headers";

export async function addToCart(productId: string, quantity: number = 1) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Please log in first" };
    }

    // Check if item already exists in cart
    const existingItem = await db.cartItem.findFirst({
      where: {
        userId: session.user.id,
        productId: productId,
      },
    });

    if (existingItem) {
      // Update quantity if item exists
      await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Create new cart item
      await db.cartItem.create({
        data: {
          userId: session.user.id,
          productId: productId,
          quantity: quantity,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, error: "Failed to add item to cart" };
  }
}

export async function getCartItems() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return [];
    }

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

    return cartItems;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return [];
  }
}

export async function getCartCount() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return 0;
    }

    const result = await db.cartItem.aggregate({
      where: { userId: session.user.id },
      _sum: { quantity: true },
    });

    return result._sum.quantity || 0;
  } catch (error) {
    console.error("Error getting cart count:", error);
    return 0;
  }
}

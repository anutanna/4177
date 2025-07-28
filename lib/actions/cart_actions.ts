"use server";

import { prisma as db } from "@/lib/db/prisma";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { cacheInvalidation } from "@/lib/cache";

export async function addToCart(productId: string, quantity: number = 1) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    // Check if item already exists in cart
    const existingItem = await db.cartItem.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    });

    if (existingItem) {
      // Update quantity
      await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Add new item
      await db.cartItem.create({
        data: {
          userId: session.user.id,
          productId,
          quantity,
        },
      });
    }

    // Invalidate product cache since cart changed
    cacheInvalidation.invalidateProducts();

    return { success: true };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, error: "Failed to add to cart" };
  }
}

export async function removeFromCart(cartItemId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    await db.cartItem.delete({
      where: {
        id: cartItemId,
        userId: session.user.id,
      },
    });

    // Invalidate product cache since cart changed
    cacheInvalidation.invalidateProducts();

    return { success: true };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return { success: false, error: "Failed to remove from cart" };
  }
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await db.cartItem.delete({
        where: {
          id: cartItemId,
          userId: session.user.id,
        },
      });
    } else {
      // Update quantity
      await db.cartItem.update({
        where: {
          id: cartItemId,
          userId: session.user.id,
        },
        data: { quantity },
      });
    }

    // Invalidate product cache since cart changed
    cacheInvalidation.invalidateProducts();

    return { success: true };
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return { success: false, error: "Failed to update cart item quantity" };
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

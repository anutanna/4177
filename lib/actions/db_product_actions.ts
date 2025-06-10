"use server";

import { prisma as db } from "@/lib/db/prisma";

export async function getProducts() {
  try {
    const products = await db.product.findMany();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function createProduct(
  name: string,
  description: string | null,
  price: number,
  stock: number,
  vendorId: string
) {
  try {
    const product = await db.product.create({
      data: {
        name,
        description,
        price,
        stock,
        vendorId,
      },
    });
    return product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
}

export async function updateProduct(
  id: string,
  name?: string,
  description?: string | null,
  price?: number,
  stock?: number
) {
  try {
    const updateData: {
      name?: string;
      description?: string | null;
      price?: number;
      stock?: number;
    } = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;

    const product = await db.product.update({
      where: { id },
      data: updateData,
    });
    return product;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
}

export async function deleteProduct(id: string) {
  try {
    const product = await db.product.delete({
      where: { id },
    });
    return product;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
}

export async function getProductById(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw new Error("Failed to fetch product by ID");
  }
}

export async function getProductsByName(name: string) {
  try {
    const products = await db.product.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive", // Case-insensitive search
        },
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products by name:", error);
    throw new Error("Failed to fetch products by name");
  }
}

export async function getProductsWithVendor() {
  try {
    const products = await db.product.findMany({
      include: {
        vendor: true,
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products with vendor:", error);
    throw new Error("Failed to fetch products with vendor");
  }
}

export async function getProductsByVendor(vendorId: string) {
  try {
    const products = await db.product.findMany({
      where: {
        vendorId: vendorId,
      },
      include: {
        vendor: true,
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products by vendor:", error);
    throw new Error("Failed to fetch products by vendor");
  }
}

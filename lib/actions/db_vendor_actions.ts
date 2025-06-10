"use server";

import { prisma as db } from "@/lib/db/prisma";

export async function getVendors() {
  try {
    const vendors = await db.vendor.findMany();
    return vendors;
  } catch (error) {
    console.error("Error fetching vendors:", error);
    throw new Error("Failed to fetch vendors");
  }
}

export async function createVendor(
  name: string,
  email: string,
  phone?: string,
  address?: string,
  website?: string
) {
  try {
    const vendor = await db.vendor.create({
      data: {
        name,
        email,
        phone,
        address,
        website,
      },
    });
    return vendor;
  } catch (error) {
    console.error("Error creating vendor:", error);
    throw new Error("Failed to create vendor");
  }
}

export async function updateVendor(
  id: string,
  name?: string,
  email?: string,
  phone?: string | null,
  address?: string | null,
  website?: string | null
) {
  try {
    const updateData: {
      name?: string;
      email?: string;
      phone?: string | null;
      address?: string | null;
      website?: string | null;
    } = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (website !== undefined) updateData.website = website;

    const vendor = await db.vendor.update({
      where: { id },
      data: updateData,
    });
    return vendor;
  } catch (error) {
    console.error("Error updating vendor:", error);
    throw new Error("Failed to update vendor");
  }
}

export async function deleteVendor(id: string) {
  try {
    const vendor = await db.vendor.delete({
      where: { id },
    });
    return vendor;
  } catch (error) {
    console.error("Error deleting vendor:", error);
    throw new Error("Failed to delete vendor");
  }
}

export async function getVendorById(id: string) {
  try {
    const vendor = await db.vendor.findUnique({
      where: { id },
      include: {
        products: true,
        orders: true,
      },
    });
    if (!vendor) {
      throw new Error("Vendor not found");
    }
    return vendor;
  } catch (error) {
    console.error("Error fetching vendor by ID:", error);
    throw new Error("Failed to fetch vendor by ID");
  }
}

export async function getVendorByEmail(email: string) {
  try {
    const vendor = await db.vendor.findUnique({
      where: { email },
      include: {
        products: true,
        orders: true,
      },
    });
    if (!vendor) {
      throw new Error("Vendor not found");
    }
    return vendor;
  } catch (error) {
    console.error("Error fetching vendor by email:", error);
    throw new Error("Failed to fetch vendor by email");
  }
}

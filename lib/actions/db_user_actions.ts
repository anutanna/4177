"use server";

import { prisma as db } from "@/lib/db/prisma";
import { UserRole } from "@prisma/client";

export async function getUsers() {
  try {
    const users = await db.user.findMany({
      include: {
        orders: true,
        business: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

export async function createUser(
  name: string,
  email: string,
  role?: UserRole,
  address?: string,
  phone?: string,
  image?: string,
  emailVerified?: boolean
) {
  try {
    const user = await db.user.create({
      data: {
        name,
        email,
        role: role || UserRole.CUSTOMER,
        address,
        phone,
        image,
        emailVerified: emailVerified || false,
      },
    });
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

export async function updateUser(
  id: string,
  name?: string,
  email?: string,
  role?: UserRole,
  address?: string | null,
  phone?: string | null,
  image?: string | null
) {
  try {
    const updateData: {
      name?: string;
      email?: string;
      role?: UserRole;
      address?: string | null;
      phone?: string | null;
      image?: string | null;
    } = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;
    if (address !== undefined) updateData.address = address;
    if (phone !== undefined) updateData.phone = phone;
    if (image !== undefined) updateData.image = image;

    const user = await db.user.update({
      where: { id },
      data: updateData,
    });
    return user;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
}

export async function deleteUser(id: string) {
  try {
    const user = await db.user.delete({
      where: { id },
    });
    return user;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db.user.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            business: true,
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        },
        business: {
          include: {
            products: true,
          },
        },
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Failed to fetch user by ID");
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({
      where: { email },
      include: {
        orders: {
          include: {
            business: true,
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        },
        business: {
          include: {
            products: true,
          },
        },
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw new Error("Failed to fetch user by email");
  }
}

export async function getUsersByRole(role: UserRole) {
  try {
    const users = await db.user.findMany({
      where: { role },
      include: {
        orders: true,
        business: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Error fetching users by role:", error);
    throw new Error("Failed to fetch users by role");
  }
}

export async function getCustomers() {
  try {
    const customers = await db.user.findMany({
      where: { role: UserRole.CUSTOMER },
      include: {
        orders: {
          include: {
            business: true,
          },
        },
      },
    });
    return customers;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw new Error("Failed to fetch customers");
  }
}

export async function getVendors() {
  try {
    const vendors = await db.user.findMany({
      where: { role: UserRole.VENDOR },
      include: {
        business: {
          include: {
            products: true,
          },
        },
      },
    });
    return vendors;
  } catch (error) {
    console.error("Error fetching vendors:", error);
    throw new Error("Failed to fetch vendors");
  }
}

export async function getAdmins() {
  try {
    const admins = await db.user.findMany({
      where: { role: UserRole.ADMIN },
    });
    return admins;
  } catch (error) {
    console.error("Error fetching admins:", error);
    throw new Error("Failed to fetch admins");
  }
}

export async function searchUsersByName(searchTerm: string) {
  try {
    const users = await db.user.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      include: {
        orders: true,
        business: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Error searching users by name:", error);
    throw new Error("Failed to search users by name");
  }
}

export async function updateUserRole(userId: string, role: UserRole) {
  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { role },
    });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new Error("Failed to update user role");
  }
}

export async function createBusinessForUser(
  userId: string,
  businessData: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    website?: string;
    description?: string;
  }
) {
  try {
    const business = await db.business.create({
      data: {
        name: businessData.name,
        email: businessData.email,
        phone: businessData.phone,
        address: businessData.address,
        website: businessData.website,
        description: businessData.description,
        userOwnerId: userId,
      },
    });
    return business;
  } catch (error) {
    console.error("Error creating business:", error);
    throw new Error("Failed to create business");
  }
}

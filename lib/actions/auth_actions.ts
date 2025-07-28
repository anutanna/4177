"use server";

import { prisma as db } from "@/lib/db/prisma";
import { UserRole } from "@prisma/client";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function registerUser(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validate passwords match
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  try {
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "An account with this email already exists" };
    }

    // Create new user with Better Auth
    const signUpResult = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    if (!signUpResult?.user) {
      return { error: "Failed to create user" };
    }

    // Note: All new users are registered as CUSTOMER by default
    // They can upgrade to VENDOR later through the business registration flow

    // Note: Session refresh is handled client-side after successful registration
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Registration failed. Please try again." };
  }

  // Registration successful - let the client handle the redirect
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateUserRole(
  userId: string,
  role: UserRole,
  businessData?: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    website?: string;
    description?: string;
  }
) {
  try {
    // Update user role
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { role: role },
    });

    // If role is VENDOR and businessData is provided, create business record
    if (role === UserRole.VENDOR && businessData) {
      await db.business.create({
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
    }

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error: "Failed to update user" };
  }
}

export async function getUserWithSession(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        business: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function upgradeToVendor(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  try {
    // Get user ID from the form data (we'll add it from the client)
    const userId = formData.get("userId") as string;

    if (!userId) {
      return { error: "User not authenticated" };
    }

    const businessName = formData.get("businessName") as string;
    const businessEmail = formData.get("businessEmail") as string;
    const businessPhone = formData.get("businessPhone") as string;
    const businessAddress = formData.get("businessAddress") as string;
    const businessWebsite = formData.get("businessWebsite") as string;
    const businessDescription = formData.get("businessDescription") as string;

    // Update user role to vendor
    await db.user.update({
      where: { id: userId },
      data: { role: UserRole.VENDOR },
    });

    // Create business record for vendor
    if (businessName && businessEmail) {
      await db.business.create({
        data: {
          name: businessName,
          email: businessEmail,
          phone: businessPhone || null,
          address: businessAddress || null,
          website: businessWebsite || null,
          description: businessDescription || null,
          userOwnerId: userId,
        },
      });
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Vendor upgrade error:", error);
    return { error: "Failed to upgrade to vendor. Please try again." };
  }
}

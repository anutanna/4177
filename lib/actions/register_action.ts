"use server";

import { prisma as db } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";

export async function registerUserAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const role = formData.get("role") as "CUSTOMER" | "VENDOR";

  // Business details (only for vendors)
  const businessName = formData.get("businessName") as string;
  const businessEmail = formData.get("businessEmail") as string;
  const businessPhone = formData.get("businessPhone") as string;
  const businessAddress = formData.get("businessAddress") as string;
  const businessWebsite = formData.get("businessWebsite") as string;
  const businessDescription = formData.get("businessDescription") as string;

  // Validate required fields
  if (!name || !email || !password || !role) {
    throw new Error("Missing required fields");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // If registering as VENDOR, also create a Business
    if (role === "VENDOR" && businessName && businessEmail) {
      // Check if business email already exists
      const existingBusiness = await db.business.findUnique({
        where: { email: businessEmail },
      });

      if (existingBusiness) {
        throw new Error("Business already exists with this email");
      }

      await db.business.create({
        data: {
          userOwnerId: user.id,
          name: businessName,
          email: businessEmail,
          phone: businessPhone || null,
          address: businessAddress || null,
          website: businessWebsite || null,
          description: businessDescription || null,
        },
      });
    }

  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

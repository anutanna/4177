import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId, role, businessData } = await request.json();

    if (!userId || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: role as UserRole },
    });

    // If role is VENDOR and businessData is provided, create business record
    if (role === UserRole.VENDOR && businessData) {
      await prisma.business.create({
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

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

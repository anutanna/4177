import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };

    const { id } = params;

    // Confirm product exists and belongs to this vendor
    const product = await prisma.product.findUnique({
      where: { id },
      include: { business: true },
    });

    if (!product || product.business.userOwnerId !== payload.userId) {
      return NextResponse.json(
        { error: "Product not found or access denied" },
        { status: 404 }
      );
    }

    // Delete related records (in correct order)
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.productToCategory.deleteMany({ where: { productId: id } });
    await prisma.orderItem.deleteMany({ where: { productId: id } });

    // Finally delete the product
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

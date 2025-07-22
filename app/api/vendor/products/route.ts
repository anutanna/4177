import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };

    const business = await prisma.business.findFirst({
      where: { userOwnerId: payload.userId },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found for this vendor" }, { status: 404 });
    }

    const products = await prisma.product.findMany({
      where: { businessId: business.id },
      include: { images: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching vendor products:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

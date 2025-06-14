import {prisma as db} from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role, businessDetails } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // If registering as VENDOR, also create a Business
    if (role === "VENDOR" && businessDetails) {
      await db.business.create({
        data: {
          userOwnerId: user.id,
          name: businessDetails.name,
          email: businessDetails.email,
          phone: businessDetails.phone,
          address: businessDetails.address,
          website: businessDetails.website,
          description: businessDetails.description,
        },
      });
    }

    return NextResponse.json({ message: "User registered", userId: user.id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
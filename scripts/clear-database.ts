import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    console.log("Starting database cleanup...");

    // Delete all records in correct order to handle foreign key constraints
    console.log("Deleting product relations...");
    await prisma.productToCategory.deleteMany({});
    await prisma.productToSubCategory.deleteMany({});

    console.log("Deleting order items...");
    await prisma.orderItem.deleteMany({});

    console.log("Deleting cart items...");
    await prisma.cartItem.deleteMany({});

    console.log("Deleting refunds...");
    await prisma.refund.deleteMany({});

    console.log("Deleting orders...");
    await prisma.order.deleteMany({});

    console.log("Deleting product images...");
    await prisma.productImage.deleteMany({});

    console.log("Deleting products...");
    await prisma.product.deleteMany({});

    console.log("Deleting subcategories...");
    await prisma.productSubCategory.deleteMany({});

    console.log("Deleting categories...");
    await prisma.productCategory.deleteMany({});

    console.log("Deleting brands...");
    await prisma.brand.deleteMany({});

    console.log("Deleting businesses...");
    await prisma.business.deleteMany({});

    console.log("Deleting sessions...");
    await prisma.session.deleteMany({});

    console.log("Deleting accounts...");
    await prisma.account.deleteMany({});

    console.log("Deleting verifications...");
    await prisma.verification.deleteMany({});

    console.log("Deleting users...");
    await prisma.user.deleteMany({});

    console.log("Database cleared successfully!");
  } catch (error) {
    console.error("Error during database cleanup:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();

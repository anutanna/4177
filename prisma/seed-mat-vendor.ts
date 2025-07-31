import {
  PrismaClient,
  UserRole,
  OrderStatus,
  RefundStatus,
  RefundReason,
  ProductStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function seedMatVendor() {
  console.log("🌱 Seeding dummy data for mat@dal.ca vendor...");

  try {
    // Find or create mat@dal.ca user
    let matUser = await prisma.user.findUnique({
      where: { email: "mat@dal.ca" },
    });

    if (!matUser) {
      matUser = await prisma.user.create({
        data: {
          name: "Mat Professor",
          email: "mat@dal.ca",
          emailVerified: true,
          role: UserRole.VENDOR,
          address: "6299 South St, Halifax, NS",
          phone: "902-494-2500",
          image:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        },
      });
      console.log("✅ Created mat@dal.ca user");
    } else {
      console.log("✅ Found existing mat@dal.ca user");
    }

    // Check if business already exists
    let business = await prisma.business.findFirst({
      where: { userOwnerId: matUser.id },
    });

    if (!business) {
      // Create business for mat@dal.ca
      business = await prisma.business.create({
        data: {
          userOwnerId: matUser.id,
          name: "Mat's Academic Market",
          email: "business@matsmarket.dal.ca",
          phone: "902-494-2501",
          address: "Dalhousie University, Halifax, NS",
          website: "https://matsmarket.dal.ca",
          logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop",
          description:
            "Academic supplies and educational materials curated by Professor Mat",
          rating: 4.7,
        },
      });
      console.log("✅ Created business for mat@dal.ca");
    } else {
      console.log("✅ Found existing business for mat@dal.ca");
    }

    // Clear existing data for this business to avoid duplicates
    console.log("🧹 Clearing existing data for mat@dal.ca business...");

    // Delete in correct order due to foreign key constraints
    // First delete refunds that reference orders
    await prisma.refund.deleteMany({
      where: { businessId: business.id },
    });

    await prisma.orderItem.deleteMany({
      where: {
        order: {
          businessId: business.id,
        },
      },
    });

    await prisma.order.deleteMany({
      where: { businessId: business.id },
    });

    // Delete product associations before deleting products
    await prisma.productToSubCategory.deleteMany({
      where: {
        product: {
          businessId: business.id,
        },
      },
    });

    await prisma.productToCategory.deleteMany({
      where: {
        product: {
          businessId: business.id,
        },
      },
    });

    // Delete product images before deleting products
    await prisma.productImage.deleteMany({
      where: {
        product: {
          businessId: business.id,
        },
      },
    });

    await prisma.product.deleteMany({
      where: { businessId: business.id },
    });

    console.log("✅ Cleared existing business data");

    // Always create fresh data
    // Create or find a brand for Mat's business
    let matBrand = await prisma.brand.findFirst({
      where: { name: "Mat's Market" },
    });

    if (!matBrand) {
      matBrand = await prisma.brand.create({
        data: {
          name: "Mat's Market",
          description: "Quality products curated by Professor Mat",
          logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop",
          website: "https://matsmarket.dal.ca",
        },
      });
      console.log("✅ Created Mat's Market brand");
    }

    // Create product categories and subcategories
    const educationalCategory = await prisma.productCategory.upsert({
      where: { name: "Educational Materials" },
      update: {},
      create: {
        name: "Educational Materials",
        description: "Books, supplies, and learning materials",
      },
    });

    const officeCategory = await prisma.productCategory.upsert({
      where: { name: "Office Supplies" },
      update: {},
      create: {
        name: "Office Supplies",
        description: "Professional office and study materials",
      },
    });

    const academicBooksSubCategory = await prisma.productSubCategory.upsert({
      where: {
        categoryId_name: {
          categoryId: educationalCategory.id,
          name: "Academic Books",
        },
      },
      update: {},
      create: {
        name: "Academic Books",
        description: "Textbooks and reference materials",
        categoryId: educationalCategory.id,
      },
    });

    const writingToolsSubCategory = await prisma.productSubCategory.upsert({
      where: {
        categoryId_name: {
          categoryId: officeCategory.id,
          name: "Writing Tools",
        },
      },
      update: {},
      create: {
        name: "Writing Tools",
        description: "Pens, pencils, and writing accessories",
        categoryId: officeCategory.id,
      },
    });

    console.log("✅ Created categories and subcategories");

    // Create some products for the business
    const products = await Promise.all([
      prisma.product.create({
        data: {
          name: "Computer Science Fundamentals",
          description:
            "Essential textbook for computer science students covering algorithms, data structures, and programming fundamentals. Perfect for undergraduate computer science courses. Includes practical examples and exercises to enhance learning experience.",
          price: 89.99,
          stock: 15,
          status: ProductStatus.VISIBLE,
          businessId: business.id,
          brandId: matBrand.id,
          images: {
            create: [
              {
                url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop",
                altText: "Computer Science Fundamentals textbook",
              },
            ],
          },
        },
      }),
      prisma.product.create({
        data: {
          name: "Programming Notebook Set",
          description:
            "High-quality notebooks perfect for coding notes and algorithm sketches. Set includes 3 notebooks with grid paper ideal for drawing diagrams and writing clean code. Durable covers and premium paper quality.",
          price: 24.99,
          stock: 30,
          status: ProductStatus.VISIBLE,
          businessId: business.id,
          brandId: matBrand.id,
          images: {
            create: [
              {
                url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop",
                altText: "Programming notebook set with grid paper",
              },
            ],
          },
        },
      }),
      prisma.product.create({
        data: {
          name: "Academic Calculator Pro",
          description:
            "Advanced scientific calculator for mathematical computations and statistical analysis. Features programmable functions, graphing capabilities, and extensive mathematical operations. Essential for engineering and mathematics students.",
          price: 67.5,
          stock: 12,
          status: ProductStatus.VISIBLE,
          businessId: business.id,
          brandId: matBrand.id,
          images: {
            create: [
              {
                url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=600&fit=crop",
                altText: "Advanced scientific calculator",
              },
            ],
          },
        },
      }),
      prisma.product.create({
        data: {
          name: "Study Lamp LED",
          description:
            "Adjustable LED desk lamp for late-night studying sessions. Features multiple brightness levels, flexible positioning, and energy-efficient LED bulbs. Reduces eye strain during long study periods. Modern design fits any workspace.",
          price: 45.0,
          stock: 8,
          status: ProductStatus.VISIBLE,
          businessId: business.id,
          brandId: matBrand.id,
          images: {
            create: [
              {
                url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
                altText: "Modern LED desk lamp for studying",
              },
            ],
          },
        },
      }),
    ]);
    console.log(`✅ Created ${products.length} products`);

    // Create product-category associations
    const productCategoryAssociations = [
      { productId: products[0].id, categoryId: educationalCategory.id }, // Computer Science Fundamentals -> Educational Materials
      { productId: products[1].id, categoryId: officeCategory.id }, // Programming Notebook Set -> Office Supplies
      { productId: products[2].id, categoryId: educationalCategory.id }, // Academic Calculator Pro -> Educational Materials
      { productId: products[3].id, categoryId: officeCategory.id }, // Study Lamp LED -> Office Supplies
    ];

    for (const association of productCategoryAssociations) {
      await prisma.productToCategory.create({
        data: association,
      });
    }
    console.log(
      `✅ Created ${productCategoryAssociations.length} product-category associations`
    );

    // Create product-subcategory associations
    const productSubCategoryAssociations = [
      { productId: products[0].id, subCategoryId: academicBooksSubCategory.id }, // Computer Science Fundamentals -> Academic Books
      { productId: products[1].id, subCategoryId: writingToolsSubCategory.id }, // Programming Notebook Set -> Writing Tools
      { productId: products[2].id, subCategoryId: academicBooksSubCategory.id }, // Academic Calculator Pro -> Academic Books
      { productId: products[3].id, subCategoryId: writingToolsSubCategory.id }, // Study Lamp LED -> Writing Tools
    ];

    for (const association of productSubCategoryAssociations) {
      await prisma.productToSubCategory.create({
        data: association,
      });
    }
    console.log(
      `✅ Created ${productSubCategoryAssociations.length} product-subcategory associations`
    );

    // Create some customer users for orders
    const customers = await Promise.all([
      prisma.user.upsert({
        where: { email: "student1@dal.ca" },
        update: {},
        create: {
          name: "Alice Johnson",
          email: "student1@dal.ca",
          emailVerified: true,
          role: UserRole.CUSTOMER,
          address: "1234 Student Ave, Halifax, NS",
          phone: "902-555-0201",
          image:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        },
      }),
      prisma.user.upsert({
        where: { email: "student2@dal.ca" },
        update: {},
        create: {
          name: "Bob Smith",
          email: "student2@dal.ca",
          emailVerified: true,
          role: UserRole.CUSTOMER,
          address: "5678 Campus Rd, Halifax, NS",
          phone: "902-555-0202",
          image:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        },
      }),
      prisma.user.upsert({
        where: { email: "student3@dal.ca" },
        update: {},
        create: {
          name: "Carol Davis",
          email: "student3@dal.ca",
          emailVerified: true,
          role: UserRole.CUSTOMER,
          address: "9012 University St, Halifax, NS",
          phone: "902-555-0203",
          image:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        },
      }),
    ]);
    console.log(`✅ Created ${customers.length} customer users`);

    // Create some orders with different statuses
    const orders = [
      {
        userId: customers[0].id,
        status: OrderStatus.COMPLETED,
        items: [
          { productId: products[0].id, quantity: 1, price: products[0].price },
          { productId: products[1].id, quantity: 2, price: products[1].price },
        ],
      },
      {
        userId: customers[1].id,
        status: OrderStatus.COMPLETED,
        items: [
          { productId: products[2].id, quantity: 1, price: products[2].price },
        ],
      },
      {
        userId: customers[2].id,
        status: OrderStatus.PENDING,
        items: [
          { productId: products[3].id, quantity: 1, price: products[3].price },
          { productId: products[1].id, quantity: 1, price: products[1].price },
        ],
      },
      {
        userId: customers[0].id,
        status: OrderStatus.IN_PROGRESS,
        items: [
          { productId: products[0].id, quantity: 2, price: products[0].price },
        ],
      },
      {
        userId: customers[1].id,
        status: OrderStatus.CANCELLED,
        items: [
          { productId: products[2].id, quantity: 1, price: products[2].price },
          { productId: products[3].id, quantity: 1, price: products[3].price },
        ],
      },
    ];

    const createdOrders = [];
    for (const orderData of orders) {
      const total = orderData.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const order = await prisma.order.create({
        data: {
          userId: orderData.userId,
          businessId: business.id,
          status: orderData.status,
          total: total,
        },
      });

      // Create order items
      for (const item of orderData.items) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          },
        });
      }

      createdOrders.push(order);
    }
    console.log(`✅ Created ${orders.length} orders with items`);

    // Create refunds for some completed orders
    const completedOrders = createdOrders.filter(
      (order) => order.status === OrderStatus.COMPLETED
    );

    if (completedOrders.length > 0) {
      const refunds: Array<{
        orderId: string;
        userId: string;
        businessId: string;
        amount: number;
        reason: RefundReason;
        status: RefundStatus;
        notes: string;
        processedAt: Date;
      }> = [
        {
          orderId: completedOrders[0].id, // Alice's first order (CS Fundamentals + Notebooks)
          userId: completedOrders[0].userId,
          businessId: completedOrders[0].businessId,
          amount: 24.99, // Partial refund for one notebook set
          reason: RefundReason.QUALITY_ISSUE,
          status: RefundStatus.PROCESSED,
          notes: "Notebook pages were damaged during shipping",
          processedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        },
      ];

      // Add second refund if there's another completed order
      if (completedOrders.length > 1) {
        refunds.push({
          orderId: completedOrders[1].id, // Bob's order (Calculator)
          userId: completedOrders[1].userId,
          businessId: completedOrders[1].businessId,
          amount: 67.5, // Full refund for calculator
          reason: RefundReason.CUSTOMER_REQUEST,
          status: RefundStatus.PROCESSED,
          notes: "Customer found a better price elsewhere, courtesy refund",
          processedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        });
      }

      const createdRefunds = [];
      for (const refund of refunds) {
        const createdRefund = await prisma.refund.create({
          data: refund,
        });
        createdRefunds.push(createdRefund);
      }
      console.log(`✅ Created ${createdRefunds.length} refunds`);
    }

    console.log("🎉 Successfully seeded dummy data for mat@dal.ca vendor!");
  } catch (error) {
    console.error("❌ Error seeding mat@dal.ca vendor data:", error);
    throw error;
  }
}

// Run the seeder
seedMatVendor()
  .then(() => {
    console.log("✅ Seeding completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

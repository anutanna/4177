import { PrismaClient, UserRole, OrderStatus, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data in the correct order (due to foreign key constraints)
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productToCategory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.business.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Cleared existing data");

  // Create Users (mix of customers, vendors, and admin)
  const users = [
    {
      name: "John Doe",
      email: "admin@localmarket.com",
      password: "password123",
      address: "123 Admin Ave, Halifax, NS",
      phone: "902-123-4567",
      role: UserRole.ADMIN,
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Sarah Miller",
      email: "sarah.miller@gmail.com",
      password: "password123",
      address: "456 Spring Garden Rd, Halifax, NS",
      phone: "902-555-0101",
      role: UserRole.VENDOR,
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Mike Thompson",
      email: "mike.thompson@outlook.com",
      password: "password123",
      address: "789 Barrington St, Halifax, NS",
      phone: "902-555-0102",
      role: UserRole.VENDOR,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "James Rodriguez",
      email: "james.rodriguez@vendor.com",
      password: "password123",
      address: "147 Gottingen St, Halifax, NS",
      phone: "902-555-0106",
      role: UserRole.VENDOR,
      image:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Emily Chen",
      email: "emily.chen@hotmail.com",
      password: "password123",
      address: "321 Quinpool Rd, Halifax, NS",
      phone: "902-555-0103",
      role: UserRole.CUSTOMER,
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "David Wilson",
      email: "david.wilson@yahoo.com",
      password: "password123",
      address: "654 North St, Halifax, NS",
      phone: "902-555-0104",
      role: UserRole.CUSTOMER,
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Lisa Anderson",
      email: "lisa.anderson@gmail.com",
      password: "password123",
      address: "987 South St, Halifax, NS",
      phone: "902-555-0105",
      role: UserRole.CUSTOMER,
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    },
  ];

  const createdUsers = [];

  for (const user of users) {
    try {
      const createdUser = await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          name: user.name,
          email: user.email,
          address: user.address,
          phone: user.phone,
          role: user.role,
          emailVerified: true,
          image: user.image,
        },
      });

      // Create account record for authentication with hashed password
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await prisma.account.create({
        data: {
          accountId: createdUser.id,
          providerId: "credential",
          userId: createdUser.id,
          password: hashedPassword, // Store hashed password for Better Auth
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      createdUsers.push(createdUser);
    } catch (error) {
      console.error(`❌ Failed to create user ${user.email}:`, error);
    }
  }

  console.log(`✅ Created ${createdUsers.length} users`);

  // Create Brands
  const brands: Prisma.BrandCreateInput[] = [
    {
      name: "FreshFarms",
      description: "Premium organic produce and dairy products",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop",
      website: "https://freshfarms.ca",
    },
    {
      name: "Maritime Crafts",
      description: "Handcrafted items from local Nova Scotia artisans",
      logo: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=200&h=200&fit=crop",
      website: "https://maritimecrafts.ca",
    },
    {
      name: "Atlantic Bakery",
      description: "Traditional baked goods and specialty breads",
      logo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop",
      website: "https://atlanticbakery.ca",
    },
    {
      name: "Coastal Coffee",
      description: "Locally roasted coffee beans and specialty blends",
      logo: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=200&h=200&fit=crop",
      website: "https://coastalcoffee.ca",
    },
    {
      name: "Ocean Bounty",
      description: "Fresh seafood from the Atlantic waters",
      logo: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop",
      website: "https://oceanbounty.ca",
    },
  ];

  const createdBrands = [];
  for (const brand of brands) {
    const createdBrand = await prisma.brand.upsert({
      where: { name: brand.name },
      update: {},
      create: brand,
    });
    createdBrands.push(createdBrand);
  }
  console.log(`✅ Created ${createdBrands.length} brands`);

  // Create Product Categories
  const categories: Prisma.ProductCategoryCreateInput[] = [
    {
      categoryName: "Fresh Organic Produce",
      categoryDescription: "Fresh fruits and vegetables",
      subCategoryName: "Organic",
      subCategoryDescription: "Certified organic produce",
    },
    {
      categoryName: "Fresh Local Produce",
      categoryDescription: "Fresh fruits and vegetables",
      subCategoryName: "Local",
      subCategoryDescription: "Locally grown produce",
    },
    {
      categoryName: "Dairy & Eggs",
      categoryDescription: "Fresh dairy products and farm eggs",
      subCategoryName: "Organic Dairy",
      subCategoryDescription: "Organic milk, cheese, and yogurt",
    },
    {
      categoryName: "Baked Goods",
      categoryDescription: "Fresh breads, pastries, and desserts",
      subCategoryName: "Artisan Breads",
      subCategoryDescription: "Handcrafted artisan breads",
    },
    {
      categoryName: "Beverages",
      categoryDescription: "Coffee, tea, and specialty drinks",
      subCategoryName: "Coffee",
      subCategoryDescription: "Roasted coffee beans and ground coffee",
    },
    {
      categoryName: "Seafood",
      categoryDescription: "Fresh and frozen seafood",
      subCategoryName: "Fresh Fish",
      subCategoryDescription: "Daily fresh catch from local waters",
    },
    {
      categoryName: "Handcrafted Items",
      categoryDescription: "Locally made crafts and artisan goods",
      subCategoryName: "Home Decor",
      subCategoryDescription: "Handmade decorative items",
    },
  ];

  const createdCategories = [];
  for (const category of categories) {
    const createdCategory = await prisma.productCategory.create({
      data: category,
    });
    createdCategories.push(createdCategory);
  }
  console.log(`✅ Created ${createdCategories.length} product categories`);

  // Create Businesses (only for vendor users)
  const vendorUsers = createdUsers.filter(
    (user) => user.role === UserRole.VENDOR
  );

  if (vendorUsers.length < 3) {
    console.error(
      `❌ Expected at least 3 vendor users, but only found ${vendorUsers.length}`
    );
    throw new Error("Insufficient vendor users for business creation");
  }

  const businesses = [
    {
      userOwnerId: vendorUsers[0].id, // Sarah Miller
      name: "Halifax Organic Market",
      email: "info@halifaxorganic.com",
      phone: "902-444-0001",
      address: "1234 Organic Way, Halifax, NS",
      website: "https://halifaxorganic.com",
      logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop",
      description:
        "Your local source for fresh, organic produce and sustainable goods.",
      rating: 4.8,
    },
    {
      userOwnerId: vendorUsers[1].id, // Mike Thompson
      name: "Maritime Artisan Co.",
      email: "hello@maritimeartisan.com",
      phone: "902-444-0002",
      address: "5678 Craft Lane, Halifax, NS",
      website: "https://maritimeartisan.com",
      logo: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=200&fit=crop",
      description:
        "Showcasing the finest handcrafted goods from Nova Scotia artisans.",
      rating: 4.6,
    },
    {
      userOwnerId: vendorUsers[2].id, // James Rodriguez
      name: "Seaside Specialty Foods",
      email: "orders@seasidefoods.com",
      phone: "902-444-0003",
      address: "9012 Harbor View, Halifax, NS",
      website: "https://seasidefoods.com",
      logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop",
      description:
        "Premium seafood, baked goods, and gourmet specialties from the Atlantic.",
      rating: 4.9,
    },
  ];

  const createdBusinesses = [];
  for (const business of businesses) {
    const createdBusiness = await prisma.business.create({
      data: business,
    });
    createdBusinesses.push(createdBusiness);
  }
  console.log(`✅ Created ${createdBusinesses.length} businesses`);

  // Create Products
  const products = [
    // Halifax Organic Market products
    {
      name: "Organic Kale Bundle",
      description: "Fresh organic kale, perfect for smoothies and salads",
      price: 4.99,
      stock: 25,
      businessId: createdBusinesses[0].id,
      brandId: createdBrands[0].id, // FreshFarms
    },
    {
      name: "Farm Fresh Eggs (Dozen)",
      description: "Free-range eggs from local organic farms",
      price: 6.99,
      stock: 40,
      businessId: createdBusinesses[0].id,
      brandId: createdBrands[0].id,
    },
    {
      name: "Organic Honey (500ml)",
      description: "Pure wildflower honey from Nova Scotia beekeepers",
      price: 12.99,
      stock: 15,
      businessId: createdBusinesses[0].id,
      brandId: createdBrands[0].id,
    },
    {
      name: "Heirloom Tomatoes (1lb)",
      description: "Colorful heirloom tomatoes, grown without pesticides",
      price: 7.99,
      stock: 20,
      businessId: createdBusinesses[0].id,
      brandId: createdBrands[0].id,
    },
    // Maritime Artisan Co. products
    {
      name: "Hand-carved Wooden Bowl",
      description:
        "Beautiful maple wood serving bowl, handcrafted by local artisans",
      price: 45.0,
      stock: 8,
      businessId: createdBusinesses[1].id,
      brandId: createdBrands[1].id, // Maritime Crafts
    },
    {
      name: "Lighthouse Ceramic Mug",
      description: "Handpainted ceramic mug featuring Nova Scotia lighthouses",
      price: 24.99,
      stock: 12,
      businessId: createdBusinesses[1].id,
      brandId: createdBrands[1].id,
    },
    {
      name: "Knitted Wool Scarf",
      description: "Warm, cozy scarf made from local sheep wool",
      price: 35.0,
      stock: 6,
      businessId: createdBusinesses[1].id,
      brandId: createdBrands[1].id,
    },
    // Seaside Specialty Foods products
    {
      name: "Atlantic Salmon Fillet (1lb)",
      description: "Fresh Atlantic salmon, caught daily by local fishermen",
      price: 18.99,
      stock: 10,
      businessId: createdBusinesses[2].id,
      brandId: createdBrands[4].id, // Ocean Bounty
    },
    {
      name: "Sourdough Bread Loaf",
      description: "Traditional sourdough bread, baked fresh daily",
      price: 5.99,
      stock: 30,
      businessId: createdBusinesses[2].id,
      brandId: createdBrands[2].id, // Atlantic Bakery
    },
    {
      name: "Maritime Dark Roast Coffee (454g)",
      description: "Rich, bold coffee blend roasted locally",
      price: 16.99,
      stock: 22,
      businessId: createdBusinesses[2].id,
      brandId: createdBrands[3].id, // Coastal Coffee
    },
    {
      name: "Lobster Roll Kit",
      description: "Everything you need for authentic Maritime lobster rolls",
      price: 29.99,
      stock: 5,
      businessId: createdBusinesses[2].id,
      brandId: createdBrands[4].id, // Ocean Bounty
    },
    {
      name: "Blueberry Scones (6-pack)",
      description: "Fresh baked scones with wild Nova Scotia blueberries",
      price: 8.99,
      stock: 18,
      businessId: createdBusinesses[2].id,
      brandId: createdBrands[2].id, // Atlantic Bakery
    },
    // Additional Halifax Organic Market products
    {
      name: "Organic Spinach (Bunch)",
      description: "Fresh organic baby spinach, perfect for salads",
      price: 3.99,
      stock: 35,
      businessId: createdBusinesses[0].id,
      brandId: createdBrands[0].id, // FreshFarms
    },
    {
      name: "Organic Carrots (2lbs)",
      description: "Sweet organic carrots, locally grown",
      price: 4.49,
      stock: 28,
      businessId: createdBusinesses[0].id,
      brandId: createdBrands[0].id, // FreshFarms
    },
    {
      name: "Fresh Organic Milk (1L)",
      description: "Creamy organic milk from grass-fed cows",
      price: 5.99,
      stock: 20,
      businessId: createdBusinesses[0].id,
      brandId: createdBrands[0].id, // FreshFarms
    },
    {
      name: "Artisan Goat Cheese (200g)",
      description: "Creamy goat cheese made by local dairy farmers",
      price: 14.99,
      stock: 12,
      businessId: createdBusinesses[0].id,
      brandId: createdBrands[0].id, // FreshFarms
    },
    {
      name: "Organic Red Apples (3lbs)",
      description: "Crisp organic red apples from Nova Scotia orchards",
      price: 6.99,
      stock: 25,
      businessId: createdBusinesses[0].id,
      brandId: createdBrands[0].id, // FreshFarms
    },
    // Additional Maritime Artisan Co. products
    {
      name: "Handwoven Basket",
      description: "Traditional woven basket made from local willow",
      price: 32.99,
      stock: 7,
      businessId: createdBusinesses[1].id,
      brandId: createdBrands[1].id, // Maritime Crafts
    },
    {
      name: "Sea Glass Jewelry Set",
      description:
        "Beautiful jewelry made from authentic Nova Scotia sea glass",
      price: 58.99,
      stock: 4,
      businessId: createdBusinesses[1].id,
      brandId: createdBrands[1].id, // Maritime Crafts
    },
    {
      name: "Driftwood Wall Art",
      description: "Unique wall art crafted from Atlantic driftwood",
      price: 75.0,
      stock: 3,
      businessId: createdBusinesses[1].id,
      brandId: createdBrands[1].id, // Maritime Crafts
    },
    {
      name: "Hand-knitted Mittens",
      description: "Warm wool mittens with traditional Maritime patterns",
      price: 28.99,
      stock: 10,
      businessId: createdBusinesses[1].id,
      brandId: createdBrands[1].id, // Maritime Crafts
    },
    {
      name: "Pottery Dinner Set (4-piece)",
      description: "Handcrafted ceramic dinner set fired in local kilns",
      price: 89.99,
      stock: 5,
      businessId: createdBusinesses[1].id,
      brandId: createdBrands[1].id, // Maritime Crafts
    },
    // Additional Seaside Specialty Foods products
    {
      name: "Fresh Haddock Fillet (1lb)",
      description: "Premium haddock caught in the Bay of Fundy",
      price: 15.99,
      stock: 8,
      businessId: createdBusinesses[2].id,
      brandId: createdBrands[4].id, // Ocean Bounty
    },
    {
      name: "Maple Walnut Bread",
      description: "Sweet bread with local maple syrup and walnuts",
      price: 7.99,
      stock: 15,
      businessId: createdBusinesses[2].id,
      brandId: createdBrands[2].id, // Atlantic Bakery
    },
    {
      name: "Earl Grey Tea Blend (100g)",
      description: "Premium Earl Grey tea with bergamot oil",
      price: 12.99,
      stock: 20,
      businessId: createdBusinesses[2].id,
      brandId: createdBrands[3].id, // Coastal Coffee
    },
    {
      name: "Smoked Mackerel (Whole)",
      description: "Traditional cold-smoked Atlantic mackerel",
      price: 22.99,
      stock: 6,
      businessId: createdBusinesses[2].id,
      brandId: createdBrands[4].id, // Ocean Bounty
    },
    {
      name: "Cinnamon Raisin Bagels (6-pack)",
      description: "Fresh baked bagels with cinnamon and raisins",
      price: 9.99,
      stock: 25,
      businessId: createdBusinesses[2].id,
      brandId: createdBrands[2].id, // Atlantic Bakery
    },
  ];

  const createdProducts = [];
  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: product,
    });
    createdProducts.push(createdProduct);
  }
  console.log(`✅ Created ${createdProducts.length} products`);

  // Create Product Images
  const productImages = [
    // Kale Bundle
    {
      productId: createdProducts[0].id,
      url: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400&h=400&fit=crop",
      altText: "Fresh organic kale bundle",
    },
    {
      productId: createdProducts[0].id,
      url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop",
      altText: "Kale leaves close-up",
    },

    // Farm Eggs
    {
      productId: createdProducts[1].id,
      url: "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=400&h=400&fit=crop",
      altText: "Fresh farm eggs in carton",
    },
    {
      productId: createdProducts[1].id,
      url: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400&h=400&fit=crop",
      altText: "Free-range chickens",
    },

    // Organic Honey
    {
      productId: createdProducts[2].id,
      url: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop",
      altText: "Glass jar of golden honey",
    },

    // Heirloom Tomatoes
    {
      productId: createdProducts[3].id,
      url: "https://images.unsplash.com/photo-1566383444833-43afb88e5dc9?w=400&h=400&fit=crop",
      altText: "Colorful heirloom tomatoes",
    },

    // Wooden Bowl
    {
      productId: createdProducts[4].id,
      url: "https://images.unsplash.com/photo-1658280388403-09f61d0eb311?w=400&h=400&fit=crop",
      altText: "Hand-carved wooden bowl",
    },

    // Ceramic Mug
    {
      productId: createdProducts[5].id,
      url: "https://images.unsplash.com/photo-1646434048431-e8659a6946ee?w=400&h=400&fit=crop",
      altText: "Lighthouse ceramic mug",
    },

    // Wool Scarf
    {
      productId: createdProducts[6].id,
      url: "https://images.unsplash.com/photo-1502550145-cd245e2ec6eb?w=400&h=400&fit=crop",
      altText: "Knitted wool scarf",
    },

    // Salmon
    {
      productId: createdProducts[7].id,
      url: "https://images.unsplash.com/photo-1559058789-672da06263d8?w=400&h=400&fit=crop",
      altText: "Fresh Atlantic salmon fillet",
    },

    // Sourdough
    {
      productId: createdProducts[8].id,
      url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
      altText: "Fresh sourdough bread loaf",
    },

    // Coffee
    {
      productId: createdProducts[9].id,
      url: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop",
      altText: "Dark roast coffee beans",
    },

    // Lobster Kit
    {
      productId: createdProducts[10].id,
      url: "https://images.unsplash.com/photo-1707995546402-5057206e5161?w=400&h=400&fit=crop",
      altText: "Lobster roll ingredients",
    },

    // Blueberry Scones
    {
      productId: createdProducts[11].id,
      url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
      altText: "Fresh blueberry scones",
    },

    // New product images for the 15 additional products
    // Organic Spinach (product index 12)
    {
      productId: createdProducts[12].id,
      url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop",
      altText: "Fresh organic spinach bunch",
    },

    // Organic Carrots (product index 13)
    {
      productId: createdProducts[13].id,
      url: "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400&h=400&fit=crop",
      altText: "Fresh organic carrots",
    },

    // Fresh Organic Milk (product index 14)
    {
      productId: createdProducts[14].id,
      url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop",
      altText: "Glass bottle of fresh organic milk",
    },

    // Artisan Goat Cheese (product index 15)
    {
      productId: createdProducts[15].id,
      url: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop",
      altText: "Artisan goat cheese wheel",
    },

    // Organic Red Apples (product index 16)
    {
      productId: createdProducts[16].id,
      url: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=400&h=400&fit=crop",
      altText: "Fresh red apples",
    },

    // Handwoven Basket (product index 17)
    {
      productId: createdProducts[17].id,
      url: "https://images.unsplash.com/photo-1462726337252-4773ebc370ae?w=400&h=400&fit=crop",
      altText: "Handwoven wicker basket",
    },

    // Sea Glass Jewelry Set (product index 18)
    {
      productId: createdProducts[18].id,
      url: "https://images.unsplash.com/photo-1667320436052-1abd29003021?w=400&h=400&fit=crop",
      altText: "Sea glass jewelry pieces",
    },

    // Driftwood Wall Art (product index 19)
    {
      productId: createdProducts[19].id,
      url: "https://images.unsplash.com/photo-1641406755423-968570743031?w=400&h=400&fit=crop",
      altText: "Driftwood wall art piece",
    },

    // Hand-knitted Mittens (product index 20)
    {
      productId: createdProducts[20].id,
      url: "https://images.unsplash.com/photo-1598871955497-27e7814b405d?w=400&h=400&fit=crop",
      altText: "Hand-knitted wool mittens",
    },

    // Pottery Dinner Set (product index 21)
    {
      productId: createdProducts[21].id,
      url: "https://images.unsplash.com/photo-1607449145583-cd5df720994e?w=400&h=400&fit=crop",
      altText: "Handcrafted pottery dinner set",
    },

    // Fresh Haddock Fillet (product index 22)
    {
      productId: createdProducts[22].id,
      url: "https://images.unsplash.com/photo-1517115358639-5720b8e02219?w=400&h=400&fit=crop",
      altText: "Fresh haddock fillet",
    },

    // Maple Walnut Bread (product index 23)
    {
      productId: createdProducts[23].id,
      url: "https://images.unsplash.com/photo-1642333328966-f248191ff0da?w=400&h=400&fit=crop",
      altText: "Maple walnut bread loaf",
    },

    // Earl Grey Tea Blend (product index 24)
    {
      productId: createdProducts[24].id,
      url: "https://images.unsplash.com/photo-1491720731493-223f97d92c21?w=400&h=400&fit=crop",
      altText: "Earl Grey tea leaves and cup",
    },

    // Smoked Mackerel (product index 25)
    {
      productId: createdProducts[25].id,
      url: "https://images.unsplash.com/photo-1535424921017-85119f91e5a1?w=400&h=400&fit=crop",
      altText: "Smoked mackerel fish",
    },

    // Cinnamon Raisin Bagels (product index 26)
    {
      productId: createdProducts[26].id,
      url: "https://images.unsplash.com/photo-1572279990716-4f8343703ed6?w=400&h=400&fit=crop",
      altText: "Cinnamon raisin bagels",
    },
  ];

  for (const image of productImages) {
    await prisma.productImage.create({
      data: image,
    });
  }
  console.log(`✅ Created ${productImages.length} product images`);

  // Create Product-Category relationships
  const productCategoryMappings = [
    // Produce
    { productId: createdProducts[0].id, categoryId: createdCategories[0].id }, // Kale -> Fresh Organic Produce
    { productId: createdProducts[3].id, categoryId: createdCategories[1].id }, // Tomatoes -> Fresh Local Produce

    // Dairy
    { productId: createdProducts[1].id, categoryId: createdCategories[2].id }, // Eggs -> Dairy & Eggs/Organic
    { productId: createdProducts[2].id, categoryId: createdCategories[2].id }, // Honey -> Dairy & Eggs/Organic

    // Baked Goods
    { productId: createdProducts[8].id, categoryId: createdCategories[3].id }, // Sourdough -> Baked Goods/Artisan
    { productId: createdProducts[11].id, categoryId: createdCategories[3].id }, // Scones -> Baked Goods/Artisan

    // Beverages
    { productId: createdProducts[9].id, categoryId: createdCategories[4].id }, // Coffee -> Beverages/Coffee

    // Seafood
    { productId: createdProducts[7].id, categoryId: createdCategories[5].id }, // Salmon -> Seafood/Fresh Fish
    { productId: createdProducts[10].id, categoryId: createdCategories[5].id }, // Lobster Kit -> Seafood/Fresh Fish

    // Handcrafted
    { productId: createdProducts[4].id, categoryId: createdCategories[6].id }, // Wooden Bowl -> Handcrafted/Home Decor
    { productId: createdProducts[5].id, categoryId: createdCategories[6].id }, // Ceramic Mug -> Handcrafted/Home Decor
    { productId: createdProducts[6].id, categoryId: createdCategories[6].id }, // Wool Scarf -> Handcrafted/Home Decor

    // New product-category mappings for the 15 additional products
    // Fresh Produce
    { productId: createdProducts[12].id, categoryId: createdCategories[0].id }, // Spinach -> Fresh Organic Produce
    { productId: createdProducts[13].id, categoryId: createdCategories[0].id }, // Carrots -> Fresh Organic Produce
    { productId: createdProducts[16].id, categoryId: createdCategories[1].id }, // Apples -> Fresh Local Produce

    // Dairy & Eggs
    { productId: createdProducts[14].id, categoryId: createdCategories[2].id }, // Milk -> Dairy & Eggs/Organic
    { productId: createdProducts[15].id, categoryId: createdCategories[2].id }, // Goat Cheese -> Dairy & Eggs/Organic

    // Baked Goods
    { productId: createdProducts[23].id, categoryId: createdCategories[3].id }, // Maple Walnut Bread -> Baked Goods/Artisan
    { productId: createdProducts[26].id, categoryId: createdCategories[3].id }, // Cinnamon Raisin Bagels -> Baked Goods/Artisan

    // Beverages
    { productId: createdProducts[24].id, categoryId: createdCategories[4].id }, // Earl Grey Tea -> Beverages/Coffee

    // Seafood
    { productId: createdProducts[22].id, categoryId: createdCategories[5].id }, // Haddock -> Seafood/Fresh Fish
    { productId: createdProducts[25].id, categoryId: createdCategories[5].id }, // Smoked Mackerel -> Seafood/Fresh Fish

    // Handcrafted Items
    { productId: createdProducts[17].id, categoryId: createdCategories[6].id }, // Handwoven Basket -> Handcrafted/Home Decor
    { productId: createdProducts[18].id, categoryId: createdCategories[6].id }, // Sea Glass Jewelry -> Handcrafted/Home Decor
    { productId: createdProducts[19].id, categoryId: createdCategories[6].id }, // Driftwood Wall Art -> Handcrafted/Home Decor
    { productId: createdProducts[20].id, categoryId: createdCategories[6].id }, // Hand-knitted Mittens -> Handcrafted/Home Decor
    { productId: createdProducts[21].id, categoryId: createdCategories[6].id }, // Pottery Dinner Set -> Handcrafted/Home Decor
  ];

  for (const mapping of productCategoryMappings) {
    await prisma.productToCategory.create({
      data: mapping,
    });
  }
  console.log(
    `✅ Created ${productCategoryMappings.length} product-category relationships`
  );

  // Create Orders
  const customerUsers = createdUsers.filter(
    (user) => user.role === UserRole.CUSTOMER
  );
  const orders = [
    {
      userId: customerUsers[0].id, // Emily Chen
      businessId: createdBusinesses[0].id, // Halifax Organic Market
      total: 23.97, // Will be calculated properly with order items
      status: OrderStatus.COMPLETED,
    },
    {
      userId: customerUsers[1].id, // David Wilson
      businessId: createdBusinesses[1].id, // Maritime Artisan Co.
      total: 69.99,
      status: OrderStatus.COMPLETED,
    },
    {
      userId: customerUsers[2].id, // Lisa Anderson
      businessId: createdBusinesses[2].id, // Seaside Specialty Foods
      total: 54.97,
      status: OrderStatus.IN_PROGRESS,
    },
    {
      userId: customerUsers[0].id, // Emily Chen (repeat customer)
      businessId: createdBusinesses[2].id, // Seaside Specialty Foods
      total: 25.98,
      status: OrderStatus.PENDING,
    },
    {
      userId: customerUsers[1].id, // David Wilson (repeat customer)
      businessId: createdBusinesses[0].id, // Halifax Organic Market
      total: 19.98,
      status: OrderStatus.COMPLETED,
    },
  ];

  const createdOrders = [];
  for (const order of orders) {
    const createdOrder = await prisma.order.create({
      data: order,
    });
    createdOrders.push(createdOrder);
  }
  console.log(`✅ Created ${createdOrders.length} orders`);

  // Create Order Items
  const orderItems = [
    // Order 1 (Emily -> Halifax Organic)
    {
      orderId: createdOrders[0].id,
      productId: createdProducts[0].id,
      quantity: 2,
      price: 4.99,
    }, // Kale x2
    {
      orderId: createdOrders[0].id,
      productId: createdProducts[1].id,
      quantity: 1,
      price: 6.99,
    }, // Eggs x1
    {
      orderId: createdOrders[0].id,
      productId: createdProducts[3].id,
      quantity: 1,
      price: 7.99,
    }, // Tomatoes x1

    // Order 2 (David -> Maritime Artisan)
    {
      orderId: createdOrders[1].id,
      productId: createdProducts[4].id,
      quantity: 1,
      price: 45.0,
    }, // Wooden Bowl x1
    {
      orderId: createdOrders[1].id,
      productId: createdProducts[5].id,
      quantity: 1,
      price: 24.99,
    }, // Ceramic Mug x1

    // Order 3 (Lisa -> Seaside Foods)
    {
      orderId: createdOrders[2].id,
      productId: createdProducts[7].id,
      quantity: 1,
      price: 18.99,
    }, // Salmon x1
    {
      orderId: createdOrders[2].id,
      productId: createdProducts[8].id,
      quantity: 2,
      price: 5.99,
    }, // Sourdough x2
    {
      orderId: createdOrders[2].id,
      productId: createdProducts[9].id,
      quantity: 1,
      price: 16.99,
    }, // Coffee x1
    {
      orderId: createdOrders[2].id,
      productId: createdProducts[11].id,
      quantity: 1,
      price: 8.99,
    }, // Scones x1

    // Order 4 (Emily -> Seaside Foods)
    {
      orderId: createdOrders[3].id,
      productId: createdProducts[8].id,
      quantity: 1,
      price: 5.99,
    }, // Sourdough x1
    {
      orderId: createdOrders[3].id,
      productId: createdProducts[9].id,
      quantity: 1,
      price: 16.99,
    }, // Coffee x1
    {
      orderId: createdOrders[3].id,
      productId: createdProducts[11].id,
      quantity: 1,
      price: 8.99,
    }, // Scones x1 (different from calculated total - this is intentional for demo)

    // Order 5 (David -> Halifax Organic)
    {
      orderId: createdOrders[4].id,
      productId: createdProducts[2].id,
      quantity: 1,
      price: 12.99,
    }, // Honey x1
    {
      orderId: createdOrders[4].id,
      productId: createdProducts[1].id,
      quantity: 1,
      price: 6.99,
    }, // Eggs x1
  ];

  for (const orderItem of orderItems) {
    await prisma.orderItem.create({
      data: orderItem,
    });
  }
  console.log(`✅ Created ${orderItems.length} order items`);

  // Update order totals based on actual order items
  for (const order of createdOrders) {
    const items = await prisma.orderItem.findMany({
      where: { orderId: order.id },
    });
    const total = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    await prisma.order.update({
      where: { id: order.id },
      data: { total },
    });
  }
  console.log("✅ Updated order totals");

  console.log("🎉 Database seeding completed successfully!");
  console.log(`
  📊 Summary:
  - ${createdUsers.length} users (including ${vendorUsers.length} vendors and ${customerUsers.length} customers)
  - ${createdBrands.length} brands
  - ${createdCategories.length} product categories
  - ${createdBusinesses.length} businesses
  - ${createdProducts.length} products
  - ${productImages.length} product images
  - ${productCategoryMappings.length} product-category relationships
  - ${createdOrders.length} orders
  - ${orderItems.length} order items
  `);
}

main()
  .then(() => {
    console.log("Seeding successful");
    process.exit(0);
  })
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

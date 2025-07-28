"use server";

import { prisma as db } from "@/lib/db/prisma";
import { cache, Cache } from "@/lib/cache";

// Cache TTL constants
const CACHE_TTL = {
  PRODUCTS: 300000, // 5 minutes
  PRODUCT_DETAIL: 600000, // 10 minutes
  SEARCH: 180000, // 3 minutes
};

export async function getProducts() {
  const cacheKey = Cache.generateKey('getProducts');
  
  // Try cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log('Cache HIT: getProducts');
    return cached;
  }

  console.log('Cache MISS: getProducts');
  try {
    const products = await db.product.findMany({
      include: {
        business: true,
        brand: true,
        images: true,
      },
      orderBy: { createdAt: "desc" },
      take: 15, // Limit to 15 latest products for the "Latest Products" section
    });
    
    // Cache the result
    cache.set(cacheKey, products, CACHE_TTL.PRODUCTS);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function getProductsPaginated(
  page: number = 1,
  limit: number = 15
) {
  const cacheKey = Cache.generateKey('getProductsPaginated', { page, limit });
  
  // Try cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log('Cache HIT: getProductsPaginated');
    return cached;
  }

  console.log('Cache MISS: getProductsPaginated');
  await new Promise((resolve) => setTimeout(resolve, 3000));
  try {
    const skip = (page - 1) * limit; // zero-based index for pagination

    const [products, totalCount] = await Promise.all([
      db.product.findMany({
        include: {
          business: true,
          brand: true,
          images: true,
        },
        orderBy: { createdAt: "asc" },
        skip,
        take: limit,
      }),
      db.product.count(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;

    const result = {
      data: products,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        limit,
      },
    };

    // Cache the result
    cache.set(cacheKey, result, CACHE_TTL.PRODUCTS);
    return result;
  } catch (error) {
    console.error("Error fetching paginated products:", error);
    throw new Error("Failed to fetch paginated products");
  }
}

export async function getLatestProducts(limit: number = 10) {
  await new Promise(resolve => setTimeout(resolve, 3000));
  try {
    const products = await db.product.findMany({
      include: {
        business: true,
        brand: true,
        images: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return products;
  } catch (error) {
    console.error("Error fetching latest products:", error);
    throw new Error("Failed to fetch latest products");
  }
}

export async function createProduct(
  name: string,
  description: string | null,
  price: number,
  stock: number,
  businessId: string,
  brandId: string
) {
  try {
    const product = await db.product.create({
      data: {
        name,
        description,
        price,
        stock,
        businessId,
        brandId,
      },
      include: {
        business: true,
        brand: true,
      },
    });
    return product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
}

export async function updateProduct(
  id: string,
  name?: string,
  description?: string | null,
  price?: number,
  stock?: number,
  businessId?: string,
  brandId?: string
) {
  try {
    const updateData: {
      name?: string;
      description?: string | null;
      price?: number;
      stock?: number;
      businessId?: string;
      brandId?: string;
    } = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (businessId !== undefined) updateData.businessId = businessId;
    if (brandId !== undefined) updateData.brandId = brandId;

    const product = await db.product.update({
      where: { id },
      data: updateData,
      include: {
        business: true,
        brand: true,
      },
    });
    return product;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
}

export async function deleteProduct(id: string) {
  try {
    const product = await db.product.delete({
      where: { id },
    });
    return product;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
}

export async function getProductById(id: string) {
  const cacheKey = Cache.generateKey('getProductById', { id });
  
  // Try cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log('Cache HIT: getProductById');
    return cached;
  }

  console.log('Cache MISS: getProductById');
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        business: true,
        brand: true,
        images: true,
        categories: {
          include: {
            category: true,
          },
        },
        orderItems: true,
      },
    });
    if (!product) {
      throw new Error("Product not found");
    }
    
    // Cache the result
    cache.set(cacheKey, product, CACHE_TTL.PRODUCT_DETAIL);
    return product;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw new Error("Failed to fetch product by ID");
  }
}

export async function getProductsByName(name: string) {
  const cacheKey = Cache.generateKey('getProductsByName', { name });
  
  // Try cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log('Cache HIT: getProductsByName');
    return cached;
  }

  console.log('Cache MISS: getProductsByName');
  try {
    const products = await db.product.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      include: {
        business: true,
        brand: true,
      },
    });
    
    // Cache the result
    cache.set(cacheKey, products, CACHE_TTL.SEARCH);
    return products;
  } catch (error) {
    console.error("Error fetching products by name:", error);
    throw new Error("Failed to fetch products by name");
  }
}

export async function searchProducts(query: string) {
  const cacheKey = Cache.generateKey('searchProducts', { query });
  
  // Try cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log('Cache HIT: searchProducts');
    return cached;
  }

  console.log('Cache MISS: searchProducts');
  try {
    if (!query) {
      return [];
    }

    const results = await db.product.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
      },
      take: 10,
    });

    // Cache the result
    cache.set(cacheKey, results, CACHE_TTL.SEARCH);
    return results;
  } catch (error) {
    console.error("Error searching products:", error);
    throw new Error("Failed to search products");
  }
}

export async function getProductsWithBusiness() {
  try {
    const products = await db.product.findMany({
      include: {
        business: true,
        brand: true,
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products with business:", error);
    throw new Error("Failed to fetch products with business");
  }
}

export async function getProductsByBusiness(businessId: string) {
  try {
    const products = await db.product.findMany({
      where: {
        businessId,
      },
      include: {
        business: true,
        brand: true,
        images: true,
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products by business:", error);
    throw new Error("Failed to fetch products by business");
  }
}

export async function getProductsByBrand(brandId: string) {
  try {
    const products = await db.product.findMany({
      where: {
        brandId,
      },
      include: {
        business: true,
        brand: true,
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products by brand:", error);
    throw new Error("Failed to fetch products by brand");
  }
}

export async function getProductsByPriceRange(
  minPrice: number,
  maxPrice: number
) {
  try {
    const products = await db.product.findMany({
      where: {
        price: {
          gte: minPrice,
          lte: maxPrice,
        },
      },
      include: {
        business: true,
        brand: true,
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products by price range:", error);
    throw new Error("Failed to fetch products by price range");
  }
}

export async function getLowStockProducts(threshold: number = 10) {
  try {
    const products = await db.product.findMany({
      where: {
        stock: {
          lte: threshold,
        },
      },
      include: {
        business: true,
        brand: true,
      },
      orderBy: {
        stock: "asc",
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    throw new Error("Failed to fetch low stock products");
  }
}

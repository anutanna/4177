"use server";

import { prisma as db } from "@/lib/db/prisma";
import { ProductStatus, Prisma } from "@prisma/client";

export async function getProducts() {
  try {
    const products = await db.product.findMany({
      where: {
        status: ProductStatus.VISIBLE,
      },
      include: {
        business: true,
        brand: true,
        images: true,
      },
      orderBy: { createdAt: "desc" },
      take: 15, // Limit to 15 latest products for the "Latest Products" section
    });
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
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const skip = (page - 1) * limit; // zero-based index for pagination

    const [products, totalCount] = await Promise.all([
      db.product.findMany({
        where: {
          status: ProductStatus.VISIBLE,
        },
        include: {
          business: true,
          brand: true,
          images: true,
        },
        orderBy: { createdAt: "asc" },
        skip,
        take: limit,
      }),
      db.product.count({
        where: {
          status: ProductStatus.VISIBLE,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;

    return {
      data: products,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        limit,
      },
    };
  } catch (error) {
    console.error("Error fetching paginated products:", error);
    throw new Error("Failed to fetch paginated products");
  }
}

export async function getLatestProducts(limit: number = 10) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const products = await db.product.findMany({
      where: {
        status: ProductStatus.VISIBLE,
      },
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
  brandId: string,
  status: ProductStatus = ProductStatus.VISIBLE
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
        status,
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
  brandId?: string,
  status?: ProductStatus
) {
  try {
    const updateData: {
      name?: string;
      description?: string | null;
      price?: number;
      stock?: number;
      businessId?: string;
      brandId?: string;
      status?: ProductStatus;
    } = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (businessId !== undefined) updateData.businessId = businessId;
    if (brandId !== undefined) updateData.brandId = brandId;
    if (status !== undefined) updateData.status = status;

    const product = await db.product.update({
      where: { id },
      data: updateData,
      include: {
        business: true,
        brand: true,
        categories: {
          include: {
            category: true,
          },
        },
        images: true,
      },
    });
    return product;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
}

export async function createProductWithCategories(
  name: string,
  description: string | null,
  price: number,
  stock: number,
  businessId: string,
  brandId: string,
  categoryIds?: string[],
  subCategoryIds?: string[],
  imageUrl?: string,
  status: ProductStatus = ProductStatus.VISIBLE
) {
  try {
    // Create product and handle categories in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create the product
      const product = await tx.product.create({
        data: {
          name,
          description,
          price,
          stock,
          businessId,
          brandId,
          status,
        },
      });

      // Handle category associations if provided
      if (categoryIds && categoryIds.length > 0) {
        await tx.productToCategory.createMany({
          data: categoryIds.map((categoryId) => ({
            productId: product.id,
            categoryId,
          })),
        });
      }

      // Handle subcategory associations if provided
      if (subCategoryIds && subCategoryIds.length > 0) {
        await tx.productToSubCategory.createMany({
          data: subCategoryIds.map((subCategoryId) => ({
            productId: product.id,
            subCategoryId,
          })),
        });
      }

      // Handle image if provided
      if (imageUrl && imageUrl.trim()) {
        await tx.productImage.create({
          data: {
            productId: product.id,
            url: imageUrl.trim(),
            altText: name || "Product image",
          },
        });
      }

      // Return the created product with all relations
      return await tx.product.findUnique({
        where: { id: product.id },
        include: {
          business: true,
          brand: true,
          categories: {
            include: {
              category: true,
            },
          },
          subCategories: {
            include: {
              subCategory: {
                include: {
                  category: true,
                },
              },
            },
          },
          images: true,
        },
      });
    });

    return result;
  } catch (error) {
    console.error("Error creating product with categories:", error);
    throw new Error("Failed to create product with categories");
  }
}

export async function updateProductWithCategories(
  id: string,
  name?: string,
  description?: string | null,
  price?: number,
  stock?: number,
  brandId?: string,
  categoryIds?: string[],
  subCategoryIds?: string[],
  imageUrl?: string,
  status?: ProductStatus
) {
  try {
    const updateData: {
      name?: string;
      description?: string | null;
      price?: number;
      stock?: number;
      brandId?: string;
      status?: ProductStatus;
    } = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (brandId !== undefined) updateData.brandId = brandId;
    if (status !== undefined) updateData.status = status;

    // Update product and handle categories in a transaction
    const result = await db.$transaction(async (tx) => {
      // Update the product
      await tx.product.update({
        where: { id },
        data: updateData,
      });

      // Handle category updates if provided
      if (categoryIds !== undefined) {
        // Remove all existing category associations
        await tx.productToCategory.deleteMany({
          where: { productId: id },
        });

        // Add new category associations
        if (categoryIds.length > 0) {
          await tx.productToCategory.createMany({
            data: categoryIds.map((categoryId) => ({
              productId: id,
              categoryId,
            })),
          });
        }
      }

      // Handle subcategory updates if provided
      if (subCategoryIds !== undefined) {
        // Remove all existing subcategory associations
        await tx.productToSubCategory.deleteMany({
          where: { productId: id },
        });

        // Add new subcategory associations
        if (subCategoryIds.length > 0) {
          await tx.productToSubCategory.createMany({
            data: subCategoryIds.map((subCategoryId) => ({
              productId: id,
              subCategoryId,
            })),
          });
        }
      }

      // Handle image URL update if provided
      if (imageUrl !== undefined) {
        // Remove existing product images
        await tx.productImage.deleteMany({
          where: { productId: id },
        });

        // Add new image if URL is provided
        if (imageUrl.trim()) {
          await tx.productImage.create({
            data: {
              productId: id,
              url: imageUrl.trim(),
              altText: name || "Product image",
            },
          });
        }
      }

      // Return the updated product with all relations
      // Return the updated product with all relations
      return await tx.product.findUnique({
        where: { id },
        include: {
          business: true,
          brand: true,
          categories: {
            include: {
              category: true,
            },
          },
          subCategories: {
            include: {
              subCategory: {
                include: {
                  category: true,
                },
              },
            },
          },
          images: true,
        },
      });
    });

    return result;
  } catch (error) {
    console.error("Error updating product with categories:", error);
    throw new Error("Failed to update product with categories");
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
        subCategories: {
          include: {
            subCategory: {
              include: {
                category: true,
              },
            },
          },
        },
        orderItems: true,
      },
    });
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw new Error("Failed to fetch product by ID");
  }
}

export async function getVisibleProductById(id: string) {
  try {
    const product = await db.product.findUnique({
      where: {
        id,
        status: ProductStatus.VISIBLE,
      },
      include: {
        business: true,
        brand: true,
        images: true,
        categories: {
          include: {
            category: true,
          },
        },
        subCategories: {
          include: {
            subCategory: {
              include: {
                category: true,
              },
            },
          },
        },
        orderItems: true,
      },
    });
    if (!product) {
      throw new Error("Product not found or not visible");
    }
    return product;
  } catch (error) {
    console.error("Error fetching visible product by ID:", error);
    throw new Error("Failed to fetch visible product by ID");
  }
}

export async function getProductsByName(name: string) {
  try {
    const products = await db.product.findMany({
      where: {
        AND: [
          {
            status: ProductStatus.VISIBLE,
          },
          {
            name: {
              contains: name,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        business: true,
        brand: true,
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products by name:", error);
    throw new Error("Failed to fetch products by name");
  }
}

export async function searchProducts(query: string) {
  try {
    if (!query) {
      return [];
    }

    const results = await db.product.findMany({
      where: {
        AND: [
          {
            status: ProductStatus.VISIBLE,
          },
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
      },
      take: 10,
    });

    return results;
  } catch (error) {
    console.error("Error searching products:", error);
    throw new Error("Failed to search products");
  }
}

export async function getProductsWithBusiness() {
  try {
    const products = await db.product.findMany({
      where: {
        status: ProductStatus.VISIBLE,
      },
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
        AND: [
          {
            status: ProductStatus.VISIBLE,
          },
          {
            brandId,
          },
        ],
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
        AND: [
          {
            status: ProductStatus.VISIBLE,
          },
          {
            price: {
              gte: minPrice,
              lte: maxPrice,
            },
          },
        ],
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

export async function getProductsWithFilters(
  page: number = 1,
  limit: number = 15,
  categoryId?: string,
  subCategoryId?: string,
  searchQuery?: string
) {
  try {
    const skip = (page - 1) * limit;

    // Build the where clause
    const whereClause: Prisma.ProductWhereInput = {
      status: ProductStatus.VISIBLE,
    };

    // Add search condition
    if (searchQuery) {
      whereClause.OR = [
        {
          name: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
      ];
    }

    // Add category filter
    if (categoryId && !subCategoryId) {
      whereClause.categories = {
        some: {
          categoryId: categoryId,
        },
      };
    }

    // Add subcategory filter
    if (subCategoryId) {
      whereClause.subCategories = {
        some: {
          subCategoryId: subCategoryId,
        },
      };
    }

    const [products, totalCount] = await Promise.all([
      db.product.findMany({
        where: whereClause,
        include: {
          business: true,
          brand: true,
          images: true,
          categories: {
            include: {
              category: true,
            },
          },
          subCategories: {
            include: {
              subCategory: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.product.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;

    return {
      data: products,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        limit,
      },
    };
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    throw new Error("Failed to fetch filtered products");
  }
}

export async function getFullSearchResults(searchQuery: string) {
  try {
    if (!searchQuery) {
      return [];
    }

    const results = await db.product.findMany({
      where: {
        AND: [
          {
            status: ProductStatus.VISIBLE,
          },
          {
            OR: [
              {
                name: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              },
            ],
          },
        ],
      },
      include: {
        business: true,
        brand: true,
        images: true,
        categories: {
          include: {
            category: true,
          },
        },
        subCategories: {
          include: {
            subCategory: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return results;
  } catch (error) {
    console.error("Error searching products:", error);
    throw new Error("Failed to search products");
  }
}

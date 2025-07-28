"use server";

import { prisma as db } from "@/lib/db/prisma";

// Category functions
export async function getCategories() {
  try {
    const categories = await db.productCategory.findMany({
      include: {
        subCategories: true,
        products: {
          include: {
            product: {
              include: {
                business: true,
                brand: true,
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

export async function getCategoryById(id: string) {
  try {
    const category = await db.productCategory.findUnique({
      where: { id },
      include: {
        subCategories: true,
        products: {
          include: {
            product: {
              include: {
                business: true,
                brand: true,
              },
            },
          },
        },
      },
    });
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    throw new Error("Failed to fetch category by ID");
  }
}

export async function createCategory(name: string, description?: string) {
  try {
    const category = await db.productCategory.create({
      data: {
        name,
        description,
      },
    });
    return category;
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }
}

export async function updateCategory(
  id: string,
  name?: string,
  description?: string | null
) {
  try {
    const updateData: {
      name?: string;
      description?: string | null;
    } = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    const category = await db.productCategory.update({
      where: { id },
      data: updateData,
    });
    return category;
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }
}

export async function deleteCategory(id: string) {
  try {
    // First check if category has any products or subcategories
    const categoryWithRelations = await db.productCategory.findUnique({
      where: { id },
      include: {
        products: true,
        subCategories: true,
      },
    });

    if (
      categoryWithRelations?.products &&
      categoryWithRelations.products.length > 0
    ) {
      throw new Error(
        "Cannot delete category that has products associated with it"
      );
    }

    if (
      categoryWithRelations?.subCategories &&
      categoryWithRelations.subCategories.length > 0
    ) {
      throw new Error(
        "Cannot delete category that has subcategories associated with it"
      );
    }

    const category = await db.productCategory.delete({
      where: { id },
    });
    return category;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }
}

// Subcategory functions
export async function getSubCategories(categoryId?: string) {
  try {
    const where = categoryId ? { categoryId } : {};
    const subCategories = await db.productSubCategory.findMany({
      where,
      include: {
        category: true,
        products: {
          include: {
            product: {
              include: {
                business: true,
                brand: true,
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });
    return subCategories;
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw new Error("Failed to fetch subcategories");
  }
}

export async function getSubCategoryById(id: string) {
  try {
    const subCategory = await db.productSubCategory.findUnique({
      where: { id },
      include: {
        category: true,
        products: {
          include: {
            product: {
              include: {
                business: true,
                brand: true,
              },
            },
          },
        },
      },
    });
    if (!subCategory) {
      throw new Error("Subcategory not found");
    }
    return subCategory;
  } catch (error) {
    console.error("Error fetching subcategory by ID:", error);
    throw new Error("Failed to fetch subcategory by ID");
  }
}

export async function createSubCategory(
  name: string,
  categoryId: string,
  description?: string
) {
  try {
    const subCategory = await db.productSubCategory.create({
      data: {
        name,
        categoryId,
        description,
      },
      include: {
        category: true,
      },
    });
    return subCategory;
  } catch (error) {
    console.error("Error creating subcategory:", error);
    throw new Error("Failed to create subcategory");
  }
}

export async function updateSubCategory(
  id: string,
  name?: string,
  description?: string | null,
  categoryId?: string
) {
  try {
    const updateData: {
      name?: string;
      description?: string | null;
      categoryId?: string;
    } = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (categoryId !== undefined) updateData.categoryId = categoryId;

    const subCategory = await db.productSubCategory.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });
    return subCategory;
  } catch (error) {
    console.error("Error updating subcategory:", error);
    throw new Error("Failed to update subcategory");
  }
}

export async function deleteSubCategory(id: string) {
  try {
    // First check if subcategory has any products
    const subCategoryWithProducts = await db.productSubCategory.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (
      subCategoryWithProducts?.products &&
      subCategoryWithProducts.products.length > 0
    ) {
      throw new Error(
        "Cannot delete subcategory that has products associated with it"
      );
    }

    const subCategory = await db.productSubCategory.delete({
      where: { id },
    });
    return subCategory;
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    throw new Error("Failed to delete subcategory");
  }
}

// Product to category/subcategory relationship functions
export async function addProductToCategory(
  productId: string,
  categoryId: string
) {
  try {
    const productToCategory = await db.productToCategory.create({
      data: {
        productId,
        categoryId,
      },
    });
    return productToCategory;
  } catch (error) {
    console.error("Error adding product to category:", error);
    throw new Error("Failed to add product to category");
  }
}

export async function removeProductFromCategory(
  productId: string,
  categoryId: string
) {
  try {
    const productToCategory = await db.productToCategory.deleteMany({
      where: {
        productId,
        categoryId,
      },
    });
    return productToCategory;
  } catch (error) {
    console.error("Error removing product from category:", error);
    throw new Error("Failed to remove product from category");
  }
}

export async function addProductToSubCategory(
  productId: string,
  subCategoryId: string
) {
  try {
    const productToSubCategory = await db.productToSubCategory.create({
      data: {
        productId,
        subCategoryId,
      },
    });
    return productToSubCategory;
  } catch (error) {
    console.error("Error adding product to subcategory:", error);
    throw new Error("Failed to add product to subcategory");
  }
}

export async function removeProductFromSubCategory(
  productId: string,
  subCategoryId: string
) {
  try {
    const productToSubCategory = await db.productToSubCategory.deleteMany({
      where: {
        productId,
        subCategoryId,
      },
    });
    return productToSubCategory;
  } catch (error) {
    console.error("Error removing product from subcategory:", error);
    throw new Error("Failed to remove product from subcategory");
  }
}

export async function getProductCategories(productId: string) {
  try {
    const categories = await db.productToCategory.findMany({
      where: { productId },
      include: {
        category: true,
      },
    });
    return categories.map((pc) => pc.category);
  } catch (error) {
    console.error("Error fetching product categories:", error);
    throw new Error("Failed to fetch product categories");
  }
}

export async function getProductSubCategories(productId: string) {
  try {
    const subCategories = await db.productToSubCategory.findMany({
      where: { productId },
      include: {
        subCategory: {
          include: {
            category: true,
          },
        },
      },
    });
    return subCategories.map((psc) => psc.subCategory);
  } catch (error) {
    console.error("Error fetching product subcategories:", error);
    throw new Error("Failed to fetch product subcategories");
  }
}

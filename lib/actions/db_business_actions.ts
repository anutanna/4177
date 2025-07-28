"use server";

import { prisma as db } from "@/lib/db/prisma";
import { cache, Cache } from "@/lib/cache";

// Cache TTL constants
const CACHE_TTL = {
  BUSINESSES: 600000, // 10 minutes
  BUSINESS_DETAIL: 900000, // 15 minutes
};

  export async function getBusinesses() {
  const cacheKey = Cache.generateKey('getBusinesses');
  
  // Try cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log('Cache HIT: getBusinesses');
    return cached;
  }

  console.log('Cache MISS: getBusinesses');
    try {
      const vendors = await db.business.findMany();
    
    // Cache the result
    cache.set(cacheKey, vendors, CACHE_TTL.BUSINESSES);
      return vendors;
    } catch (error) {
      console.error("Error fetching vendors:", error);
      throw new Error("Failed to fetch vendors");
    }
  }


  export async function createBusiness(
    userOwnerId: string,
    name: string,
    email: string,
    phone?: string,
    address?: string,
    website?: string,
    logo?: string,
    description?: string
  ) {
    try {
      const vendor = await db.business.create({
        data: {
          userOwnerId,
          name,
          email,
          phone,
          address,
          website,
          logo,
          description,
        },
      });
      return vendor;
    } catch (error) {
      console.error("Error creating vendor:", error);
      throw new Error("Failed to create vendor");
    }
  }


  export async function updateBusiness(
    id: string,
    name?: string,
    email?: string,
    phone?: string | null,
    address?: string | null,
    website?: string | null,
    logo?: string | null,
    description?: string | null,
    rating?: number | null
  ) {
    try {
      const updateData: {
        name?: string;
        email?: string;
        phone?: string | null;
        address?: string | null;
        website?: string | null;
        logo?: string | null;
        description?: string | null;
        rating?: number | null;
      } = {};

      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (phone !== undefined) updateData.phone = phone;
      if (address !== undefined) updateData.address = address;
      if (website !== undefined) updateData.website = website;
      if (logo !== undefined) updateData.logo = logo;
      if (description !== undefined) updateData.description = description;
      if (rating !== undefined) updateData.rating = rating;

      const vendor = await db.business.update({
        where: { id },
        data: updateData,
      });
      return vendor;
    } catch (error) {
      console.error("Error updating vendor:", error);
      throw new Error("Failed to update vendor");
    }
  }


  export async function deleteBusiness(id: string) {
    try {
      const vendor = await db.business.delete({
        where: { id },
      });
      return vendor;
    } catch (error) {
      console.error("Error deleting vendor:", error);
      throw new Error("Failed to delete vendor");
    }
  }


  export async function getBusinessById(id: string) {
    const cacheKey = Cache.generateKey('getBusinessById', { id });
    
    // Try cache first
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('Cache HIT: getBusinessById');
      return cached;
    }

    console.log('Cache MISS: getBusinessById');
    try {
      const vendor = await db.business.findUnique({
        where: { id },
        include: {
          products: true,
          orders: true,
          user: true,
        },
      });
      if (!vendor) {
        throw new Error("Business not found");
      }
      
      // Cache the result
      cache.set(cacheKey, vendor, CACHE_TTL.BUSINESS_DETAIL);
      return vendor;
    } catch (error) {
      console.error("Error fetching vendor by ID:", error);
      throw new Error("Failed to fetch vendor by ID");
    }
  }


  export async function getBusinessByEmail(email: string) {
    try {
      const vendor = await db.business.findUnique({
        where: { email },
        include: {
          products: true,
          orders: true,
          user: true,
        },
      });
      if (!vendor) {
        throw new Error("Business not found");
      }
      return vendor;
    } catch (error) {
      console.error("Error fetching vendor by email:", error);
      throw new Error("Failed to fetch vendor by email");
    }
  }

// Simple in-memory cache implementation
export class Cache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private maxSize = 1000; // Maximum cache entries

  set(key: string, data: any, ttl: number = 300000): void {
    // Clean up expired entries
    this.cleanup();

    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Generate cache key from function name and parameters
  static generateKey(functionName: string, params: any = {}): string {
    const paramString = JSON.stringify(params);
    return `${functionName}:${paramString}`;
  }
}

// Global cache instance
export const cache = new Cache();

// Cache decorator for database functions
export function withCache(ttl: number = 300000) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = Cache.generateKey(propertyName, args);
      
      // Try to get from cache first
      const cached = cache.get(cacheKey);
      if (cached) {
        console.log(`Cache HIT: ${propertyName}`);
        return cached;
      }

      // If not in cache, execute the method
      console.log(`Cache MISS: ${propertyName}`);
      const result = await method.apply(this, args);
      
      // Cache the result
      cache.set(cacheKey, result, ttl);
      
      return result;
    };
  };
}

// Cache invalidation helpers
export const cacheInvalidation = {
  // Invalidate all product-related caches
  invalidateProducts: () => {
    const keys = Array.from(cache['cache'].keys());
    keys.forEach(key => {
      if (key.includes('getProducts') || key.includes('getProductById') || key.includes('searchProducts')) {
        cache.delete(key);
      }
    });
  },

  // Invalidate all user-related caches
  invalidateUsers: () => {
    const keys = Array.from(cache['cache'].keys());
    keys.forEach(key => {
      if (key.includes('getUsers') || key.includes('getUserById') || key.includes('getUserByEmail')) {
        cache.delete(key);
      }
    });
  },

  // Invalidate all brand-related caches
  invalidateBrands: () => {
    const keys = Array.from(cache['cache'].keys());
    keys.forEach(key => {
      if (key.includes('getBrands') || key.includes('getRandomBrands')) {
        cache.delete(key);
      }
    });
  },

  // Invalidate all business-related caches
  invalidateBusinesses: () => {
    const keys = Array.from(cache['cache'].keys());
    keys.forEach(key => {
      if (key.includes('getBusinesses') || key.includes('getBusinessById')) {
        cache.delete(key);
      }
    });
  },

  // Invalidate all caches
  invalidateAll: () => {
    cache.clear();
  }
}; 
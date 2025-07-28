import { NextRequest, NextResponse } from "next/server";
import { cacheInvalidation } from "@/lib/cache";

export async function POST(request: NextRequest) {
  try {
    const { action, type } = await request.json();

    switch (action) {
      case 'clear':
        switch (type) {
          case 'products':
            cacheInvalidation.invalidateProducts();
            return NextResponse.json({ message: 'Product cache cleared' });
          case 'users':
            cacheInvalidation.invalidateUsers();
            return NextResponse.json({ message: 'User cache cleared' });
          case 'brands':
            cacheInvalidation.invalidateBrands();
            return NextResponse.json({ message: 'Brand cache cleared' });
          case 'businesses':
            cacheInvalidation.invalidateBusinesses();
            return NextResponse.json({ message: 'Business cache cleared' });
          case 'all':
            cacheInvalidation.invalidateAll();
            return NextResponse.json({ message: 'All caches cleared' });
          default:
            return NextResponse.json({ error: 'Invalid cache type' }, { status: 400 });
        }
      case 'status':
        // Return cache status (for monitoring)
        return NextResponse.json({ 
          message: 'Cache system active',
          timestamp: new Date().toISOString()
        });
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Cache management error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Cache management API',
    endpoints: {
      'POST /api/cache': 'Clear caches',
      'GET /api/cache': 'Get cache status'
    },
    actions: {
      clear: 'Clear specific or all caches',
      status: 'Get cache system status'
    },
    types: {
      products: 'Clear product-related caches',
      users: 'Clear user-related caches', 
      brands: 'Clear brand-related caches',
      businesses: 'Clear business-related caches',
      all: 'Clear all caches'
    }
  });
} 
// app/api/cart/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ;

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const decoded: any = verify(token, JWT_SECRET);
    const userId = decoded.userId;
    const { quantity } = await req.json();

    const updated = await prisma.cartItem.updateMany({
      where: { id: params.id, userId },
      data: { quantity },
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: 'Item not found or not authorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid token or request' }, { status: 401 });
  }
}


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
    try {
      const decoded: any = verify(token, JWT_SECRET);
      const userId = decoded.userId;
  
      const deleted = await prisma.cartItem.deleteMany({
        where: { id: params.id, userId },
      });
  
      if (deleted.count === 0) {
        return NextResponse.json({ error: 'Item not found or not authorized' }, { status: 404 });
      }
  
      return NextResponse.json({ success: true });
    } catch {
      return NextResponse.json({ error: 'Invalid token or request' }, { status: 401 });
    }
  }
  
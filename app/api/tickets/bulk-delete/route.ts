import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ids } = body ?? {};

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'ids must be a non-empty array' },
        { status: 400 }
      );
    }

    const result = await prisma.ticket.deleteMany({
      where: { id: { in: ids } },
    });

    return NextResponse.json({ success: true, deletedCount: result.count });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: 'Failed to delete tickets' },
      { status: 500 }
    );
  }
}

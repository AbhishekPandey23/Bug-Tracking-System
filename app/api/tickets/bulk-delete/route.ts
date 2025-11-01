import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// ✅ POST — Bulk delete tickets by IDs
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ids } = body ?? {};

    // Validate input
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'ids must be a non-empty array' },
        { status: 400 }
      );
    }

    // Delete tickets by ID
    const result = await prisma.ticket.deleteMany({
      where: { id: { in: ids } },
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
      message: `${result.count} ticket(s) deleted successfully.`,
    });
  } catch (err: unknown) {
    console.error('❌ Bulk delete failed:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to delete tickets' },
      { status: 500 }
    );
  }
}

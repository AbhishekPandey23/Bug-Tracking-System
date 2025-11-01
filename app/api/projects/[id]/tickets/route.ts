/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// ✅ Correct Next.js 15+ handler format
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params promise
    const { id } = await context.params;

    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const priority = url.searchParams.get('priority');

    const where: any = { projectId: id };
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        assignee: { select: { id: true, name: true } },
        project: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: tickets });
  } catch (err) {
    console.error('GET /api/projects/[id]/tickets error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project tickets' },
      { status: 500 }
    );
  }
}

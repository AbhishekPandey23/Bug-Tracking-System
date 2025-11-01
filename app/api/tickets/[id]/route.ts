/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

// ✅ Next.js 15 compatible handler with params Promise
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, title: true } },
        assignee: { select: { id: true, name: true } },
      },
    });

    if (!ticket)
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: ticket });
  } catch (err) {
    console.error('❌ Error fetching ticket:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ticket' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { title, description, status, priority, projectId, assigneeId } =
      body ?? {};

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        title,
        description,
        status: status ? status.toUpperCase() : undefined,
        priority: priority ? priority.toUpperCase() : undefined,
        project: projectId ? { connect: { id: projectId } } : undefined,
        assignee: assigneeId ? { connect: { id: assigneeId } } : undefined,
      },
      include: {
        project: { select: { id: true, title: true } },
        assignee: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, data: updatedTicket });
  } catch (error) {
    console.error('❌ Ticket update failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await currentUser();

    if (!user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await prisma.ticket.delete({ where: { id } });

    return NextResponse.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('🔥 DELETE ticket error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

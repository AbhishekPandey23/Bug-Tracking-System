/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/tickets/[id]/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

interface Params {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = params;
  try {
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
    console.error(err);
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
      body;

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        title,
        description,
        status: status?.toUpperCase(), // ✅ convert to enum
        priority: priority?.toUpperCase(),
        project: projectId ? { connect: { id: projectId } } : undefined,
        assignee: assigneeId ? { connect: { id: assigneeId } } : undefined,
      },
      include: {
        project: { select: { id: true, title: true } },
        assignee: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error('❌ Ticket update failed:', error);
    return NextResponse.json(
      { error: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ Fix: await params

  try {
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

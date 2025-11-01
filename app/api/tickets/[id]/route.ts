/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        assignee: { select: { id: true, name: true } },
        project: { select: { id: true, title: true } },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: ticket });
  } catch (error) {
    console.error('GET /api/tickets/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ticket' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await prisma.ticket.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/tickets/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete ticket' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const body = await req.json();

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, data: updatedTicket });
  } catch (error) {
    console.error('PATCH /api/tickets/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}

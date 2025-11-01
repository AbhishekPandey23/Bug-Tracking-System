/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/tickets/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

// ✅ GET — Fetch all tickets or tickets by projectId
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    const tickets = await prisma.ticket.findMany({
      where: projectId ? { projectId } : undefined,
      include: {
        project: { select: { id: true, title: true } },
        assignee: { select: { clerkId: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: tickets });
  } catch (error: any) {
    console.error('❌ Error fetching tickets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

// ✅ POST — Create a new ticket
export async function POST(req: NextRequest) {
  try {
    const { userId }: any = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, projectId, status, priority } = body ?? {};

    console.log('📩 Incoming Ticket Data:', body);

    if (!title || !projectId) {
      return NextResponse.json(
        { success: false, error: 'Title and projectId are required' },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description: description || '',
        status: status?.toUpperCase() || 'OPEN',
        priority: priority?.toUpperCase() || 'MEDIUM',
        project: { connect: { id: projectId } },
        assignee: { connect: { clerkId: userId } }, // ✅ Always link to current user
      },
      include: {
        project: { select: { id: true, title: true } },
        assignee: { select: { clerkId: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ success: true, data: ticket }, { status: 201 });
  } catch (err: any) {
    console.error('❌ Ticket creation failed:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}

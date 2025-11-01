/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/tickets/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    let tickets;

    if (projectId) {
      // Fetch tickets belonging to a specific project
      tickets = await prisma.ticket.findMany({
        where: { projectId },
        include: {
          project: { select: { id: true, title: true } },
          assignee: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // Fetch all tickets
      tickets = await prisma.ticket.findMany({
        include: {
          project: { select: { id: true, title: true } },
          assignee: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { title, description, projectId, status, priority, clerkId } =
      body ?? {};

    console.log('📩 Incoming Ticket Data:', body);

    if (!title || !projectId) {
      return NextResponse.json(
        { success: false, error: 'title and projectId are required' },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project)
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        status: status ? status.toUpperCase() : 'OPEN',
        priority: priority ? priority.toUpperCase() : 'MEDIUM',
        project: { connect: { id: projectId } },
        assignee: { connect: { clerkId: userId! } }, // ✅ Always link to current user
      },
      include: {
        project: { select: { id: true, title: true } },
        assignee: { select: { clerkId: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ success: true, data: ticket }, { status: 201 });
  } catch (err) {
    console.error('❌ Ticket creation failed:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

// ✅ GET /api/tickets?projectId=xxx
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const projectId = url.searchParams.get('projectId');

    const tickets = await prisma.ticket.findMany({
      where: projectId ? { projectId } : {},
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: tickets });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

// ✅ POST /api/tickets
export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      console.log('No user found in POST /api/tickets');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, description, priority, status, projectId } =
      await req.json();

    // Basic validation
    if (!title || !projectId) {
      return NextResponse.json(
        { success: false, error: 'Missing title or projectId' },
        { status: 400 }
      );
    }

    // Ensure user exists in DB (sync Clerk -> Prisma)
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId: user.id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.emailAddresses[0]?.emailAddress || '',
        },
      });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description: description || '',
        priority: priority?.toUpperCase() || 'MEDIUM',
        status: status?.toUpperCase() || 'OPEN',
        project: { connect: { id: projectId } },
        assignee: { connect: { clerkId: dbUser.clerkId } }, // ✅ correct relation
      },
    });

    return NextResponse.json({ success: true, data: ticket });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}

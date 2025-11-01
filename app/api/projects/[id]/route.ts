import { currentUser } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// ✅ Correct params interface
interface Params {
  params: { id: string };
}

// 🟢 GET a single project by ID
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        owner: true,
        tickets: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('GET /api/projects/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// 🟢 PUT update a project
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { title, description, ownerId } = await req.json();

    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: { title, description, ownerId },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('PUT /api/projects/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// 🗑️ DELETE specific project by ID
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    const user = await currentUser();
    if (!user) {
      console.log('❌ Unauthorized - no user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      console.log('❌ Project not found');
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (project.ownerId !== user.id) {
      console.log('❌ Forbidden - user not owner');
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete all tickets first
    await prisma.ticket.deleteMany({ where: { projectId: id } });

    // Then delete the project
    await prisma.project.delete({ where: { id } });

    console.log('✅ Project deleted successfully');
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('🔥 DELETE /api/projects/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500 }
    );
  }
}

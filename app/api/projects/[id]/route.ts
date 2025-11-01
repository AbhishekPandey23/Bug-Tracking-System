import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ✅ GET handler
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const project = await prisma.project.findUnique({
      where: { id },
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
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// ✅ PUT handler (update project)
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const body = await req.json();
    const { title, description } = body;

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// ✅ DELETE handler (optional)
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}

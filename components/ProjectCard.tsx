'use client';

import { useState } from 'react';
import { useProjectStore } from '@/stores/projectStore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface ProjectCardProps {
  id: string;
  title: string;
  description?: string | null;
}

export default function ProjectCard({
  id,
  title,
  description,
}: ProjectCardProps) {
  const { deleteProject } = useProjectStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteProject(id);
    setIsDeleting(false);
  };

  return (
    <Card className="hover:shadow-lg transition">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <Link href={`/dashboard/projects/${id}`} className="hover:underline">
            {title}
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the project and all associated
                  tickets.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          {description || 'No description'}
        </p>
      </CardContent>
    </Card>
  );
}

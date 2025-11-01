'use client';

import { useEffect, useState } from 'react';
import { useProjectStore } from '@/stores/projectStore';
import NewProjectForm from '@/components/NewProjectForm';
import ProjectCard from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ProjectsPage() {
  const { projects, fetchProjects, loading } = useProjectStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // ✅ Debug: Check what data is being returned
  console.log('Projects:', projects);

  return (
    <div className="p-6 space-y-6">
      {/* ---------- Header Section ---------- */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* ---------- Loading State ---------- */}
      {loading && <p>Loading projects...</p>}

      {/* ---------- Projects Grid ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.map((project, index) => (
          // ✅ Fallback to index if project.id is undefined
          <ProjectCard key={project.id ?? index} {...project} />
        ))}
      </div>

      {/* ---------- Empty State ---------- */}
      {!loading && projects.length === 0 && (
        <p className="text-gray-500">No projects found. Create one!</p>
      )}

      {/* ---------- New Project Dialog ---------- */}
      <NewProjectForm open={open} setOpen={setOpen} />
    </div>
  );
}

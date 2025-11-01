import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Ticket } from '@prisma/client';

interface Project {
  id: string;
  title: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ProjectStore {
  projects: Project[];
  tickets: Ticket[];
  loading: boolean;
  fetchProjects: () => Promise<void>;
  fetchProject: (projectId: string) => Promise<void>;
  createProject: (data: {
    title: string;
    description?: string;
  }) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      tickets: [],
      loading: false,

      fetchProjects: async () => {
        set({ loading: true });
        try {
          const res = await fetch('/api/projects');
          if (!res.ok) throw new Error('Failed to fetch projects');
          const data = await res.json();
          if (Array.isArray(data)) set({ projects: data });
        } catch (err) {
          console.error('Error fetching projects:', err);
        } finally {
          set({ loading: false });
        }
      },

      fetchProject: async (projectId) => {
        set({ loading: true });
        try {
          const res = await fetch(`/api/projects/${projectId}`);
          if (!res.ok) throw new Error('Failed to fetch project');
          const data = await res.json();
          set({ tickets: data.tickets || [] });
        } catch (error) {
          console.error('Error fetching project:', error);
        } finally {
          set({ loading: false });
        }
      },

      createProject: async ({ title, description }) => {
        try {
          const res = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description }),
          });
          if (!res.ok) throw new Error('Failed to create project');
          const newProject = await res.json();
          set({ projects: [newProject, ...get().projects] });
        } catch (err) {
          console.error('Error creating project:', err);
        }
      },

      deleteProject: async (id: string) => {
        const res = await fetch(`/api/projects/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          set({
            projects: get().projects.filter((project) => project.id !== id),
          });
        } else {
          const error = await res.json();
          console.error('Failed to delete project:', error);
        }
      },
    }),
    {
      name: 'project-storage', // localStorage key
    }
  )
);

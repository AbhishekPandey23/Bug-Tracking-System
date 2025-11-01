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
          const data = await res.json();

          if (data.success && Array.isArray(data.data)) {
            set({ projects: data.data });
          } else {
            console.error('Unexpected response:', data);
          }
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

          const result = await res.json();
          if (result.success && result.data) {
            set({ projects: [result.data, ...get().projects] });
          } else {
            console.error('Failed to create project:', result);
          }
        } catch (err) {
          console.error('Error creating project:', err);
        }
      },

      deleteProject: async (id: string) => {
        try {
          const res = await fetch(`/api/projects/${id}`, {
            method: 'DELETE',
          });
          const data = await res.json();

          if (data.success) {
            set((state) => ({
              projects: state.projects.filter((p) => p.id !== id),
            }));
          } else {
            console.error('Failed to delete project:', data);
          }
        } catch (err) {
          console.error('Error deleting project:', err);
        }
      },
    }),
    {
      name: 'project-storage',
    }
  )
);

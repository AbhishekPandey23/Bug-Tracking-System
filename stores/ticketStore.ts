/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Ticket {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  projectId: string;
  project?: { id: string; name: string };
  assignee?: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

interface TicketStore {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;

  // CRUD actions
  fetchTickets: (filters?: {
    status?: string;
    priority?: string;
  }) => Promise<void>;
  fetchProjectTickets: (
    projectId: string,
    filters?: { status?: string; priority?: string }
  ) => Promise<void>;
  createTicket: (
    ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
  bulkDeleteTickets: (ids: string[]) => Promise<void>;
}

export const useTicketStore = create<TicketStore>()(
  persist(
    (set, get) => ({
      tickets: [],
      loading: false,
      error: null,

      // Fetch all tickets
      fetchTickets: async (filters) => {
        set({ loading: true, error: null });
        try {
          const params = new URLSearchParams(filters as Record<string, string>);
          const res = await fetch(`/api/tickets?${params.toString()}`);
          const data = await res.json();
          if (!data.success) throw new Error(data.error);
          set({ tickets: data.data, loading: false });
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },

      // Fetch tickets for a specific project
      fetchProjectTickets: async (projectId, filters) => {
        set({ loading: true, error: null });
        try {
          const params = new URLSearchParams(filters as Record<string, string>);
          const res = await fetch(
            `/api/projects/${projectId}/tickets?${params.toString()}`
          );
          const data = await res.json();
          if (!data.success) throw new Error(data.error);
          set({ tickets: data.data, loading: false });
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },

      // Create new ticket
      createTicket: async (ticket) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch('/api/tickets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ticket),
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.error);
          set({ tickets: [data.data, ...get().tickets], loading: false });
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },

      // Update a single ticket
      updateTicket: async (id, updatedData) => {
        try {
          const res = await fetch(`/api/tickets/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
          });

          if (!res.ok) {
            const error = await res.json();
            console.error('Failed to update ticket:', error);
            return;
          }

          const updatedTicket = await res.json();

          // Option 2️⃣: Just re-fetch everything
          await get().fetchTickets();

          console.log('✅ Ticket updated successfully:', updatedTicket);
        } catch (error) {
          console.error('Error updating ticket:', error);
        }
      },

      // Delete single ticket
      deleteTicket: async (id: string) => {
        try {
          // Optimistic update — remove immediately from UI
          set((state) => ({
            tickets: state.tickets.filter((t) => t.id !== id),
          }));

          const res = await fetch(`/api/tickets/${id}`, { method: 'DELETE' });
          if (!res.ok) {
            // Rollback if delete failed
            const error = await res.json();
            console.error('Failed to delete ticket:', error);
            // Optionally refetch tickets if something failed
            get().fetchTickets?.();
            return;
          }

          console.log('✅ Ticket deleted successfully');
        } catch (err) {
          console.error('Error deleting ticket:', err);
          // Rollback if network error
          get().fetchTickets?.();
        }
      },

      // Bulk delete tickets
      bulkDeleteTickets: async (ids) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch('/api/tickets/bulk-delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids }),
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.error);

          set({
            tickets: get().tickets.filter((t) => !ids.includes(t.id)),
            loading: false,
          });
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },

      // fetch ticket based on projects
      fetchTicketsByProject: async (id: any) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(`/api/tickets?projectId=${id}`);
          const data = await res.json();
          set({ tickets: data, loading: false });
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },
    }),
    {
      name: 'ticket-storage', // localStorage persistence key
    }
  )
);

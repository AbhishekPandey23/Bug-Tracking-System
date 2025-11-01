'use client';

import { useEffect, useState } from 'react';
import { useTicketStore } from '@/stores/ticketStore';
import { useProjectStore } from '@/stores/projectStore';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import TicketCard from '@/components/TicketCard';
import TicketForm from '@/components/TicketForm';

export default function TicketsPage() {
  const { tickets, fetchTickets, loading } = useTicketStore();
  const { projects, fetchProjects } = useProjectStore();
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    projectId: '',
  });

  useEffect(() => {
    fetchTickets();
    fetchProjects();
  }, [fetchTickets, fetchProjects]);

  // ✅ Ensure tickets is always an array (to avoid .filter crash)
  const ticketList = Array.isArray(tickets) ? tickets : [];

  // Filter tickets safely
  const filteredTickets = ticketList.filter((ticket) => {
    const matchStatus = filters.status
      ? ticket.status === filters.status.toUpperCase()
      : true;
    const matchPriority = filters.priority
      ? ticket.priority === filters.priority.toUpperCase()
      : true;
    const matchProject = filters.projectId
      ? ticket.projectId === filters.projectId
      : true;
    return matchStatus && matchPriority && matchProject;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Filters & Create Button */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          {/* Filter: Priority */}
          <Select
            onValueChange={(v) =>
              setFilters({ ...filters, priority: v === 'all' ? '' : v })
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter: Status */}
          <Select
            onValueChange={(v) =>
              setFilters({ ...filters, status: v === 'all' ? '' : v })
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter: Project */}
          <Select
            onValueChange={(v) =>
              setFilters({ ...filters, projectId: v === 'all' ? '' : v })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {Array.isArray(projects) &&
                projects.map((proj) => (
                  <SelectItem key={proj.id} value={proj.id}>
                    {proj.title}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => setShowForm(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> New Ticket
        </Button>
      </div>

      {/* Tickets Grid */}
      {loading && <p>Loading tickets...</p>}
      {!loading && filteredTickets.length === 0 && (
        <p className="text-gray-500">No tickets found.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>

      {/* Ticket Creation Form */}
      {showForm && <TicketForm onClose={() => setShowForm(false)} />}
    </div>
  );
}

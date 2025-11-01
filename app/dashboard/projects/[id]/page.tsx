/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useProjectStore } from '@/stores/projectStore';
import { useTicketStore } from '@/stores/ticketStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import TicketForm from '@/components/TicketForm';

export default function ProjectDetailPage() {
  const [showForm, setShowForm] = useState(false);
  const { id } = useParams();
  const { projects } = useProjectStore();
  const { tickets, fetchTicketsByProject, loading }: any = useTicketStore();

  const project = projects.find((p) => p.id === id);

  useEffect(() => {
    if (id) fetchTicketsByProject(id as string);
  }, [id, fetchTicketsByProject]);

  // ✅ Make sure tickets is always an array
  const ticketList = Array.isArray(tickets) ? tickets : [];

  if (!project) return <p className="p-6 text-gray-500">Project not found.</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Project Details */}
      <Card className="shadow-md border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{project.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-2">{project.description}</p>
          <p className="text-sm text-gray-500">
            Created: {new Date(project.createdAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tickets</h2>
          <Button onClick={() => setShowForm(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> New Ticket
          </Button>
        </div>

        {loading && <p>Loading tickets...</p>}
        {!loading && ticketList.length === 0 && (
          <p className="text-gray-500">No tickets found for this project.</p>
        )}

        <div className="grid gap-4">
          {ticketList.map((ticket: any) => (
            <Card key={ticket.id} className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {ticket.title}
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      ticket.status === 'OPEN'
                        ? 'bg-blue-100 text-blue-700'
                        : ticket.status === 'IN_PROGRESS'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{ticket.description}</p>
                <p className="text-sm mt-2 text-gray-600">
                  Priority: <strong>{ticket.priority}</strong>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Ticket Form Modal */}
      {showForm && (
        <TicketForm
          projectId={id as string}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useProjectStore } from '@/stores/projectStore';
import { useTicketStore } from '@/stores/ticketStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import TicketForm from '@/components/TicketForm';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function ProjectDetailPage() {
  const [showForm, setShowForm] = useState(false);
  const { id } = useParams();
  const { projects } = useProjectStore();
  const { tickets, fetchTicketsByProject, loading }: any = useTicketStore();

  const project = projects.find((p) => p.id === id);

  useEffect(() => {
    if (id) fetchTicketsByProject(id as string);
  }, [id, fetchTicketsByProject]);

  if (!project) return <p>Project not found.</p>;

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-md">
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
        <h2 className="text-xl font-semibold mb-4">Tickets</h2>
        {loading && <p>Loading tickets...</p>}
        {!loading && tickets.length === 0 && (
          <p className="text-gray-500">No tickets found for this project.</p>
        )}

        <div className="grid gap-4">
          {tickets.map((ticket: any) => (
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
      <Button onClick={() => setShowForm(true)}>
        <PlusCircle className="mr-2 h-4 w-4" /> New Ticket
      </Button>

      {/* Add New Ticket Button */}
      {showForm && <TicketForm onClose={() => setShowForm(false)} />}
    </div>
  );
}

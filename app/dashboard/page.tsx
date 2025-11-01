'use client';

import { useEffect } from 'react';
import { useProjectStore } from '@/stores/projectStore';
import { useTicketStore } from '@/stores/ticketStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  const { projects, fetchProjects } = useProjectStore();
  const { tickets, fetchTickets } = useTicketStore();

  useEffect(() => {
    fetchProjects();
    fetchTickets(); // Fetch all tickets
  }, [fetchProjects, fetchTickets]);

  // Calculate stats
  const totalProjects = projects.length;
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === 'OPEN').length;
  const inProgressTickets = tickets.filter(
    (t) => t.status === 'IN_PROGRESS'
  ).length;
  const resolvedTickets = tickets.filter((t) => t.status === 'RESOLVED').length;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{totalProjects}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{totalTickets}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Open Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{openTickets}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Resolved Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {resolvedTickets}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Optional: mini recent activity */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Recent Projects</h2>
        {projects.slice(0, 5).map((p) => (
          <Card key={p.id} className="mb-3">
            <CardContent className="p-4">
              <p className="font-semibold">{p.title}</p>
              <p className="text-sm text-gray-500">
                {new Date(p.createdAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useTicketStore } from '@/stores/ticketStore';
import TicketForm from './TicketForm';
import { useState } from 'react';

export default function TicketCard({ ticket }: any) {
  const { deleteTicket } = useTicketStore();
  const [editMode, setEditMode] = useState(false);

  return (
    <Card className="shadow-md">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>{ticket.title}</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setEditMode(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => deleteTicket(ticket.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p>
          Status: <b>{ticket.status.replace('_', ' ')}</b>
        </p>
        <p>
          Priority: <b>{ticket.priority}</b>
        </p>
        <p>
          Project: <b>{ticket.project?.title}</b>
        </p>
      </CardContent>

      {editMode && (
        <TicketForm ticket={ticket} onClose={() => setEditMode(false)} />
      )}
    </Card>
  );
}

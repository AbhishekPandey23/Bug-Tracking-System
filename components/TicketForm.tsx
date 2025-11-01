/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useTicketStore } from '@/stores/ticketStore';
import { useProjectStore } from '@/stores/projectStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function TicketForm({ ticket, onClose }: any) {
  const { createTicket, updateTicket } = useTicketStore();
  const { projects, fetchProjects } = useProjectStore();

  const [form, setForm] = useState({
    title: ticket?.title || '',
    description: ticket?.description || '',
    status: ticket?.status?.toUpperCase() || 'open',
    priority: ticket?.priority?.toUpperCase() || 'medium',
    projectId: ticket?.projectId || '',
  });

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (ticket) {
      await updateTicket(ticket.id, form);
    } else {
      await createTicket(form);
    }
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{ticket ? 'Edit Ticket' : 'Create Ticket'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <Input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          {/* Status dropdown */}
          <Select
            value={form.status}
            onValueChange={(v) => setForm({ ...form, status: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          {/* Priority dropdown */}
          <Select
            value={form.priority}
            onValueChange={(v) => setForm({ ...form, priority: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={form.projectId}
            onValueChange={(v) => setForm({ ...form, projectId: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((proj) => (
                <SelectItem key={proj.id} value={proj.id}>
                  {proj.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="submit" className="w-full">
            {ticket ? 'Update Ticket' : 'Create Ticket'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

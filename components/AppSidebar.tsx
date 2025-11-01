'use client';

import { Home, Ticket, Plus, FolderDot } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import Link from 'next/link';
import { useProjectStore } from '@/stores/projectStore';
import NewProjectForm from '@/components/NewProjectForm';
import { useState } from 'react';

export function AppSidebar() {
  const { projects } = useProjectStore();
  const [open, setOpen] = useState(false);

  const workspaceItems = [
    {
      title: 'Home',
      url: '/dashboard',
      icon: Home,
    },
    {
      title: 'All Tickets',
      url: '/dashboard/tickets',
      icon: Ticket,
    },
    {
      title: 'All Projects',
      url: '/dashboard/projects',
      icon: FolderDot,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      {/* ---------- Logo ---------- */}
      <SidebarHeader className="flex items-center justify-center py-4">
        <Image src="/next.svg" alt="App Logo" width={140} height={40} />
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {/* ---------- Workspace Section ---------- */}
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workspaceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* ---------- Projects Section ---------- */}
        <SidebarGroup>
          <div className="flex items-center justify-between px-3 mb-2">
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <button
              onClick={() => setOpen(true)}
              className="p-1 rounded-md hover:bg-muted"
              aria-label="Create Project"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <SidebarGroupContent>
            {projects && projects.length > 0 ? (
              <SidebarMenu>
                {projects.map((project) => (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton asChild>
                      <Link href={`/dashboard/projects/${project.id}`}>
                        <span className="truncate">{project.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            ) : (
              <p className="text-sm text-muted-foreground px-3">
                No projects yet
              </p>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* The dialog is rendered here */}
      <NewProjectForm open={open} setOpen={setOpen} />
    </Sidebar>
  );
}

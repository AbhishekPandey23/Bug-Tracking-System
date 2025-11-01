'use client';

import { ReactNode } from 'react';
import { Bell, Menu } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { UserButton } from '@clerk/nextjs';
import Breadcrumb from '@/components/Breadcrumb';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-950">
        <AppSidebar />

        <div className="flex flex-col flex-1 w-full overflow-hidden">
          {/* Sticky Navbar */}
          <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
            {/* Left: Sidebar Trigger + Breadcrumbs */}
            <div className="flex items-center gap-3">
              <SidebarTrigger>
                <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </SidebarTrigger>
              <Breadcrumb />
            </div>

            {/* Right: Notifications + User */}
            <div className="flex items-center gap-4">
              <button
                aria-label="Notifications"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 w-full overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

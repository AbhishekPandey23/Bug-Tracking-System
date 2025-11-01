'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import { useEffect, useState } from 'react';

export default function Breadcrumb() {
  const pathname = usePathname();
  const { projects, fetchProjects, loading } = useProjectStore();
  const [ready, setReady] = useState(false);

  const segments = pathname?.split('/').filter(Boolean) || [];

  // ✅ Ensure projects are fetched (important for refresh)
  useEffect(() => {
    if (projects.length === 0 && !loading) {
      fetchProjects().finally(() => setReady(true));
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReady(true);
    }
  }, [projects.length, loading, fetchProjects]);

  // Helper to format readable breadcrumb text
  const formatSegment = (segment: string, prev?: string) => {
    // Replace projectId with actual project title if found
    if (prev === 'projects') {
      const project = projects.find((p) => p.id === segment);
      if (project) return project.title;
      return null;
    }

    // Skip numeric or UUID-like IDs
    if (/^[0-9a-fA-F-]{6,}$/.test(segment)) return null;

    return segment.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Hide breadcrumb while loading or before projects are ready
  if (!ready) {
    return (
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
    );
  }

  if (segments.length <= 1) return null;

  return (
    <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400">
      <Link
        href="/dashboard"
        className="hover:text-gray-900 dark:hover:text-gray-200 font-medium"
      >
        Dashboard
      </Link>

      {segments.slice(1).map((segment, idx) => {
        const label = formatSegment(segment, segments[idx]);
        if (!label) return null;

        const href = '/' + segments.slice(0, idx + 2).join('/');
        const isLast = idx === segments.length - 2;

        return (
          <span key={href} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            {isLast ? (
              <span className="text-gray-900 dark:text-gray-100 font-semibold">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-gray-900 dark:hover:text-gray-200"
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

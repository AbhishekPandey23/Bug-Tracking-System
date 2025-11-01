'use client';

import { cn } from '@/lib/utils';
import { GridPattern } from '@/components/ui/grid-pattern';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background/80 to-background/40">
      {/* Decorative background grid pattern */}
      <GridPattern
        width={20}
        height={20}
        x={-1}
        y={-1}
        className={cn(
          `mask-[linear-gradient(to_bottom_right,white,transparent,transparent)] opacity-30`
        )}
      />

      {/* Floating gradient orb */}
      <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Badge className="mb-6 px-4 py-1 text-sm font-semibold shadow-sm">
            🐞 Mini Jira
          </Badge>
        </motion.div>

        <motion.h1
          className="max-w-3xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Manage Your Projects & Fix Bugs Effortlessly
        </motion.h1>

        <motion.p
          className="mt-4 max-w-2xl text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          A modern, fast, and secure <strong>Bug Tracking System</strong> built
          with Next.js, Clerk, and Zustand — empowering teams to work smarter
          and faster.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-8"
        >
          <Button
            size="lg"
            className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-lg font-semibold shadow-lg hover:opacity-90 transition-all duration-300"
          >
            Get Started
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}

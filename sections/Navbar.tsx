'use client';
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur `supports-[backdrop-filter]:bg-background/60`">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 font-bold text-lg">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <Image src={'vercel.svg'} alt="Logo" width={40} height={100} />
            </div>
          </Link>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <SignedIn>
              <Link href={'/dashboard'}>
                <Button size={'sm'}>Go To Dashboard</Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant={'outline'}
                  className="cursor-pointer"
                  size={'sm'}
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="cursor-pointer" size={'sm'}>
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
          </div>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {isOpen && (
          <div className="flex flex-col gap-2 pt-4 border-t border-border">
            <SignedIn>
              <Link href={'/dashboard'}>
                <Button size={'sm'} className="w-full">
                  Go To Dashboard
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                >
                  Log in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="w-full">
                  Signup
                </Button>
              </SignUpButton>
            </SignedOut>
          </div>
        )}
      </div>
    </nav>
  );
}

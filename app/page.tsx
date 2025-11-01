import { Button } from '@/components/ui/button';
import LandingPage from '@/sections/LandingPage';
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <LandingPage />
      <div className="flex min-h-screen flex-col justify-center items-center gap-2">
        <SignedIn>
          <Link href={'/dashboard'}>
            <Button className="cursor-pointer">Go To Dashboard</Button>
          </Link>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button className="btn">Login</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button className="btn">Signup</Button>
          </SignUpButton>
        </SignedOut>
      </div>
    </>
  );
}

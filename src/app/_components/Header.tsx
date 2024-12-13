"use client";
import { Button } from '@/components/ui/button';
import { useUser, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function Header() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/Dashboard');
    }
  }, [isSignedIn, router]);

  return (
    <div className='p-5 flex justify-between items-center border shadow-md'>
      <Image src={'./logo.svg'} alt='logo' width={160} height={100} />
      {isSignedIn ? <UserButton /> : 
      <Link href={'/sign-in'}>
        <Button>Get Started</Button>
      </Link> }
    </div>
  );
}

export default Header;

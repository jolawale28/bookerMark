'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';

export default function SignOutPage() {

    const router = useRouter();

    useEffect(() => {
        (
            async () => {
                try {
                    await signOut(auth);
                    router.push('/signin');
                } catch (error) {
                    console.error('Sign-out failed:', error);
                }
            }
        )()
    }, [router]);

    return null;
}
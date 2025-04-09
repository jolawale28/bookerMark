// components/ProtectedRoute.tsx
'use client';

import { useAuth } from '@/app/context/AppContext';
import { usePathname, useRouter } from 'next/navigation';
import { CircularProgress, Box } from '@mui/material';
import { useEffect } from 'react';

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Skip protection for auth-related routes
    const isAuthRoute = ['/signin', '/signup', '/reset-password'].includes(pathname);

    useEffect(() => {
        if (!loading && !user && !isAuthRoute) {
            router.replace('/signin');
        }
    }, [user, loading, pathname, isAuthRoute, router]);

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (!user && !isAuthRoute) {
        return null; // Redirect will trigger momentarily
    }

    return <>{children}</>;
}
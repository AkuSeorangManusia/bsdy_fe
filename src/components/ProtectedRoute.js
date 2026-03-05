'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({
    children,
    requireVerified = true,
    requireOnboarding = true,
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.push('/');
            return;
        }

        if (requireVerified && !user.email_verified) {
            router.push('/auth/verify-email');
            return;
        }

        if (requireOnboarding && !user.onboarding_completed) {
            router.push('/onboarding');
            return;
        }
    }, [user, loading, router, requireVerified, requireOnboarding]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FD7979] border-t-transparent" />
            </div>
        );
    }

    if (!user) return null;
    if (requireVerified && !user.email_verified) return null;
    if (requireOnboarding && !user.onboarding_completed) return null;

    return children;
}

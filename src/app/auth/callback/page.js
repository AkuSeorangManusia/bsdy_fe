"use client";

import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function CallbackInner() {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState(null);

    useEffect(() => {
        const code = searchParams.get("code");
        if (!code) {
            setError("No authorization code found");
            return;
        }

        authApi
            .googleCallback(code)
            .then((data) => {
                login(data.data.token, data.data.user);

                if (!data.data.user.email_verified) {
                    router.push("/auth/verify-email");
                } else if (!data.data.user.onboarding_completed) {
                    router.push("/onboarding");
                } else {
                    router.push("/dashboard");
                }
            })
            .catch((err) => {
                setError(err.message || "Authentication failed");
            });
    }, [searchParams, login, router]);

    if (error) {
        return (
            <div className="app-section flex min-h-[calc(100vh-82px)] flex-col items-center justify-center py-10">
                <div className="glass-card-strong w-full max-w-md p-8 text-center">
                    <p className="text-red-500">{error}</p>
                    <a
                        href="/"
                        className="mt-2 inline-block text-[#d46161] underline"
                    >
                        Back to Home
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="app-section flex min-h-[calc(100vh-82px)] items-center justify-center py-10">
            <div className="glass-card-strong flex w-full max-w-md flex-col items-center gap-4 p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FD7979] border-t-transparent" />
                <p className="text-soft">Signing you in...</p>
            </div>
        </div>
    );
}

export default function CallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="app-section flex min-h-[calc(100vh-82px)] items-center justify-center py-10">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FD7979] border-t-transparent" />
                </div>
            }
        >
            <CallbackInner />
        </Suspense>
    );
}

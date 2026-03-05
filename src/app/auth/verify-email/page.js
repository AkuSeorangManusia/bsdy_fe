"use client";

import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function VerifyEmailInner() {
    const { user, refreshUser } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState("idle"); // idle | verifying | success | error | waiting
    const [message, setMessage] = useState("");
    const [resending, setResending] = useState(false);

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            setStatus("verifying");
            authApi
                .verifyEmail(token)
                .then(() => {
                    setStatus("success");
                    setMessage("Email verified successfully! Redirecting...");
                    refreshUser();
                    setTimeout(() => router.push("/onboarding"), 2000);
                })
                .catch((err) => {
                    setStatus("error");
                    const errorMsg = err?.message || err?.error || "Verification failed";
                    setMessage(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
                });
        } else {
            setStatus("waiting");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const handleResend = async () => {
        setResending(true);
        try {
            await authApi.resendVerification();
            setMessage("Verification email sent! Check your inbox.");
        } catch (err) {
            const errorMsg = err?.message || err?.error || "Failed to resend";
            setMessage(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
        } finally {
            setResending(false);
        }
    };

    useEffect(() => {
        if (user?.email_verified) {
            router.push(user.onboarding_completed ? "/dashboard" : "/onboarding");
        }
    }, [user, router]);

    if (user?.email_verified) {
        return null;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#FEEAC9]/20 px-4">
            <div className="w-full max-w-md rounded-2xl border border-[#FFCDC9] bg-white p-8 text-center shadow-lg">
                <div className="mb-4 text-5xl">📧</div>
                <h1 className="mb-4 text-2xl font-bold text-gray-900">Verify Your Email</h1>

                {status === "verifying" && (
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FD7979] border-t-transparent" />
                        <p className="text-gray-600">Verifying...</p>
                    </div>
                )}

                {status === "success" && (
                    <p className="text-green-600">{message}</p>
                )}

                {status === "error" && (
                    <div>
                        <p className="mb-4 text-red-500">{message}</p>
                        <button onClick={handleResend} disabled={resending} className="rounded-full bg-[#FD7979] px-6 py-2 text-white hover:bg-[#FDACAC] disabled:opacity-50">
                            {resending ? "Sending..." : "Resend Verification Email"}
                        </button>
                    </div>
                )}

                {status === "waiting" && (
                    <div>
                        <p className="mb-2 text-gray-600">
                            We&apos;ve sent a verification link to <strong>{user?.email}</strong>.
                        </p>
                        <p className="mb-6 text-sm text-gray-500">
                            Click the link in your email to verify your account.
                        </p>
                        {message && <p className="mb-4 text-sm text-green-600">{message}</p>}
                        <button onClick={handleResend} disabled={resending} className="rounded-full bg-[#FD7979] px-6 py-2 text-white hover:bg-[#FDACAC] disabled:opacity-50">
                            {resending ? "Sending..." : "Resend Email"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FD7979] border-t-transparent" />
                </div>
            }
        >
            <VerifyEmailInner />
        </Suspense>
    );
}

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
                    const errorMsg =
                        err?.message || err?.error || "Verification failed";
                    setMessage(
                        typeof errorMsg === "string"
                            ? errorMsg
                            : JSON.stringify(errorMsg),
                    );
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
            setMessage(
                typeof errorMsg === "string"
                    ? errorMsg
                    : JSON.stringify(errorMsg),
            );
        } finally {
            setResending(false);
        }
    };

    useEffect(() => {
        if (user?.email_verified) {
            router.push(
                user.onboarding_completed ? "/dashboard" : "/onboarding",
            );
        }
    }, [user, router]);

    if (user?.email_verified) {
        return null;
    }

    return (
        <div className="app-section flex min-h-[calc(100vh-82px)] items-center justify-center py-10">
            <div className="glass-card-strong w-full max-w-md p-8 text-center">
                <div className="mb-4 text-5xl">📧</div>
                <h1 className="mb-4 text-2xl font-bold text-[#2f1f1f]">
                    Verify Your Email
                </h1>

                {status === "verifying" && (
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FD7979] border-t-transparent" />
                        <p className="text-soft">Verifying...</p>
                    </div>
                )}

                {status === "success" && (
                    <p className="text-green-600">{message}</p>
                )}

                {status === "error" && (
                    <div>
                        <p className="mb-4 text-red-500">{message}</p>
                        <button
                            onClick={handleResend}
                            disabled={resending}
                            className="btn-primary px-6 py-2 disabled:opacity-50"
                        >
                            {resending
                                ? "Sending..."
                                : "Resend Verification Email"}
                        </button>
                    </div>
                )}

                {status === "waiting" && (
                    <div>
                        <p className="mb-2 text-soft">
                            We&apos;ve sent a verification link to{" "}
                            <strong>{user?.email}</strong>.
                        </p>
                        <p className="mb-6 text-sm text-[#9a7f7f]">
                            Click the link in your email to verify your account.
                        </p>
                        {message && (
                            <p className="mb-4 text-sm text-green-600">
                                {message}
                            </p>
                        )}
                        <button
                            onClick={handleResend}
                            disabled={resending}
                            className="btn-primary px-6 py-2 disabled:opacity-50"
                        >
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
                <div className="app-section flex min-h-[calc(100vh-82px)] items-center justify-center py-10">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FD7979] border-t-transparent" />
                </div>
            }
        >
            <VerifyEmailInner />
        </Suspense>
    );
}

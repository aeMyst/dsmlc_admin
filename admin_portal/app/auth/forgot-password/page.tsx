"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import type React from "react";
import { ArrowLeft, Mail } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { AuthField } from "@/components/features/auth/auth-field";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();

    if (!email) {
      setError("Enter your email address.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/auth/reset-password` },
    );

    setIsSubmitting(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSubmitted(true);
  }

  return (
    <main className="relative z-20 flex min-h-screen items-center justify-center px-6 py-16">
      <div className="relative w-full max-w-md rounded-3xl border border-[#1e1e1e] bg-[#0d0d0d]/95 p-10 backdrop-blur-2xl">
        <div
          aria-hidden="true"
          className="absolute left-1 right-1 top-0 h-px rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, #ff5a2e, transparent)",
          }}
        />

        {submitted ? (
          <div>
            <h1 className="mb-2 text-3xl font-bold text-[#f2f2f2]">
              Check your email
            </h1>
            <p className="mb-8 text-sm font-light text-[#9a9a9a]">
              If an account exists for that address, we&apos;ve sent a link to
              reset your password.
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
              Back to sign in
            </Button>
          </div>
        ) : (
          <>
            <h1 className="mb-2 text-3xl font-bold text-[#f2f2f2]">
              Reset your password
            </h1>
            <p className="mb-8 text-sm font-light text-[#9a9a9a]">
              Enter the email on your account and we&apos;ll send you a link to
              reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AuthField
                label="Email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                icon={<Mail className="h-4 w-4" strokeWidth={1.75} />}
              />

              {error && (
                <p className="text-sm font-light text-red-400">{error}</p>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Sending…" : "Send reset link"}
              </Button>
            </form>

            <p className="mt-8 text-center text-xs font-light text-[#8a8a8a]">
              <Link
                href="/"
                className="text-brand transition-colors hover:text-[#ffb08e]"
              >
                Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}

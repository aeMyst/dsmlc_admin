"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import type React from "react";
import { Lock } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { AuthField } from "@/components/features/auth/auth-field";
import { PasswordStrength } from "@/components/features/auth/password-stregth";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setSessionReady(true);
      } else {
        setSessionError(true);
      }
    });
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const newPassword = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    const { error: passwordError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (passwordError) {
      setError(passwordError.message);
      setIsSubmitting(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (sessionError) {
    return (
      <main className="relative z-20 flex min-h-screen items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <p className="mb-4 text-sm font-light text-[#9a9a9a]">
            This reset link is invalid or has expired.
          </p>
          <Link
            href="/auth/forgot-password"
            className="text-xs font-medium text-brand transition-colors hover:text-[#ffb08e]"
          >
            Request a new link
          </Link>
        </div>
      </main>
    );
  }

  if (!sessionReady) {
    return (
      <main className="relative z-20 flex min-h-screen items-center justify-center px-6">
        <p className="text-sm font-light text-[#9a9a9a]">
          Verifying your reset link…
        </p>
      </main>
    );
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

        <h1 className="mb-2 text-3xl font-bold text-[#f2f2f2]">
          Set a new password
        </h1>
        <p className="mb-8 text-sm font-light text-[#9a9a9a]">
          Choose a new password for your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <AuthField
              label="New password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              icon={<Lock className="h-4 w-4" strokeWidth={1.75} />}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordStrength value={password} />
          </div>

          <AuthField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            icon={<Lock className="h-4 w-4" strokeWidth={1.75} />}
          />

          {error && <p className="text-sm font-light text-red-400">{error}</p>}

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Saving…" : "Update password"}
          </Button>
        </form>
      </div>
    </main>
  );
}

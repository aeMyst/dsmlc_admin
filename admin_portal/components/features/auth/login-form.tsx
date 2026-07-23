"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { Lock, Mail } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { AuthField } from "@/components/features/auth/auth-field";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setIsSubmitting(true);
    const supabase = createClient();

    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email,
        password,
      },
    );

    if (signInError || !data.user) {
      setError("Invalid email or password.");
      setIsSubmitting(false);
      return;
    }

    const { data: admin } = await supabase
      .from("ADMINS")
      .select("admin_id, is_active")
      .eq("admin_id", data.user.id)
      .single();

    if (!admin || !admin.is_active) {
      await supabase.auth.signOut();
      setError("This account doesn't have dashboard access.");
      setIsSubmitting(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div id="login" className="w-full">
      <h2 className="mb-2 text-3xl font-bold text-[#f2f2f2]">Sign in</h2>
      <p className="mb-8 text-sm font-light text-[#9a9a9a]">
        Welcome back. Enter your details to continue.
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

        <AuthField
          label="Password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" strokeWidth={1.75} />}
          labelAction={
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-brand transition-colors hover:text-[#ffb08e]"
            >
              Forgot password?
            </Link>
          }
        />

        {error && <p className="text-sm font-light text-red-400">{error}</p>}

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-8 text-center text-xs font-light text-[#8a8a8a]">
        Need access?{" "}
        <Link
          href="mailto:dsmlcoperations@gmail.ca"
          className="text-brand transition-colors hover:text-[#ffb08e]"
        >
          Contact DSMLC Operations
        </Link>
      </p>
    </div>
  );
}

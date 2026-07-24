"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type React from "react";
import { Lock, User } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { ShaderBackground } from "@/components/ui/hero/hero-section";
import { AuthField } from "@/components/features/auth/auth-field";
import { PasswordStrength } from "@/components/features/auth/password-stregth";
import { Button } from "@/components/ui/button";

export default function SetPasswordPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setSessionReady(!!data.user);
    });
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const newPassword = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (!firstName || !lastName) {
      setError("Please enter your first and last name.");
      return;
    }
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

    const { error: profileError } = await supabase.rpc(
      "complete_admin_profile",
      {
        p_first_name: firstName,
        p_last_name: lastName,
      },
    );

    if (profileError) {
      setError(
        "Password saved, but your name couldn't be saved. You can update it later.",
      );
      setIsSubmitting(false);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (!sessionReady) {
    return (
      <ShaderBackground>
        <main className="relative z-20 flex min-h-screen items-center justify-center px-6">
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm font-light text-[#9a9a9a]"
          >
            Verifying your invite link…
          </motion.p>
        </main>
      </ShaderBackground>
    );
  }

  return (
    <ShaderBackground>
      <main className="relative z-20 flex min-h-screen items-center justify-center px-6 py-16">
        <motion.div
          initial={
            shouldReduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl rounded-3xl border border-[#1e1e1e] bg-[#0d0d0d]/95 p-10 backdrop-blur-2xl md:p-12"
        >
          <motion.div
            aria-hidden="true"
            className="absolute left-1 right-1 top-0 h-px origin-center rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, #ff5a2e, transparent)",
            }}
            initial={shouldReduceMotion ? false : { scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          />

          <h1 className="mb-2 text-3xl font-bold text-[#f2f2f2] md:text-4xl">
            Complete your account
          </h1>
          <p className="mb-8 text-sm font-light text-[#9a9a9a]">
            Set a password and confirm your name to finish setting up dashboard
            access.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <AuthField
                label="First name"
                name="firstName"
                required
                autoComplete="given-name"
                icon={<User className="h-4 w-4" strokeWidth={1.75} />}
                index={0}
              />
              <AuthField
                label="Last name"
                name="lastName"
                required
                autoComplete="family-name"
                icon={<User className="h-4 w-4" strokeWidth={1.75} />}
                index={1}
              />
            </div>

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
                index={2}
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
              index={3}
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
              {isSubmitting ? "Saving…" : "Complete setup"}
            </Button>
          </form>
        </motion.div>
      </main>
    </ShaderBackground>
  );
}

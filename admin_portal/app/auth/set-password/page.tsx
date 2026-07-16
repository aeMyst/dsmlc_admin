"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type React from "react";

import { createClient } from "@/lib/supabase/client";
import { ShaderBackground } from "@/components/ui/hero/hero_section";

export default function SetPasswordPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    const { error: passwordError } = await supabase.auth.updateUser({
      password,
    });
    if (passwordError) {
      setError(passwordError.message);
      setIsSubmitting(false);
      return;
    }

    const { error: profileError } = await supabase.rpc(
      "complete_admin_profile",
      {
        p_first_name: firstName.trim(),
        p_last_name: lastName.trim(),
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
          <p className="text-base font-light text-white/50">
            Verifying your invite link…
          </p>
        </main>
      </ShaderBackground>
    );
  }

  return (
    <ShaderBackground>
      <main className="relative z-20 flex min-h-screen items-center justify-center px-6 py-16">
        <div className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-black/80 p-10 backdrop-blur-2xl md:p-12">
          <div className="absolute left-1 right-1 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <h1 className="mb-2 text-3xl font-light text-white md:text-4xl">
            Complete your account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-sm font-light text-white/70 md:text-base"
                >
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-3 text-base text-white outline-none transition-colors focus:border-white/40 focus:ring-2 focus:ring-white/20 md:text-lg"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-sm font-light text-white/70 md:text-base"
                >
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-3 text-base text-white outline-none transition-colors focus:border-white/40 focus:ring-2 focus:ring-white/20 md:text-lg"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-light text-white/70 md:text-base"
              >
                New password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-3 text-base text-white outline-none transition-colors focus:border-white/40 focus:ring-2 focus:ring-white/20 md:text-lg"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-light text-white/70 md:text-base"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-3 text-base text-white outline-none transition-colors focus:border-white/40 focus:ring-2 focus:ring-white/20 md:text-lg"
              />
            </div>

            {error && (
              <p className="text-sm font-light text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer rounded-full bg-white py-3.5 text-base font-normal text-black transition-all duration-200 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60 md:text-lg"
            >
              {isSubmitting ? "Saving…" : "Complete setup"}
            </button>
          </form>
        </div>
      </main>
    </ShaderBackground>
  );
}

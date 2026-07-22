"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { Lock, Mail } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import type { LoginFormValues } from "@/types/auth";

const INITIAL_VALUES: LoginFormValues = { email: "", password: "" };

export function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState<LoginFormValues>(INITIAL_VALUES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(field: keyof LoginFormValues) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const supabase = createClient();

    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email: values.email,
        password: values.password,
      },
    );

    if (signInError || !data.user) {
      setError("Invalid email or password.");
      setIsSubmitting(false);
      return;
    }

    const { data: admin, error: adminError } = await supabase
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
      <h2 className="mb-2 text-3xl font-light text-white md:text-4xl">
        Sign in
      </h2>
      <p className="mb-8 text-base font-light text-white/60 md:text-lg">
        Welcome back. Enter your details to continue.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-light text-white/70 md:text-base"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={handleChange("email")}
              className="w-full rounded-full border border-white/15 bg-white/5 py-3 pl-12 pr-4 text-base text-white placeholder:text-white/30 outline-none transition-colors focus:border-white/40 focus:ring-2 focus:ring-white/20 md:text-lg"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-light text-white/70 md:text-base"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange("password")}
              className="w-full rounded-full border border-white/15 bg-white/5 py-3 pl-12 pr-4 text-base text-white placeholder:text-white/30 outline-none transition-colors focus:border-white/40 focus:ring-2 focus:ring-white/20 md:text-lg"
            />
          </div>
        </div>

        {error && <p className="text-sm font-light text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer rounded-full bg-white py-3.5 text-base font-normal text-black transition-all duration-200 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60 md:text-lg"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

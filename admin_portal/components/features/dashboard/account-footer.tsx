"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

interface AccountFooterProps {
  firstName: string | null;
  lastName: string | null;
  email: string;
}

export function AccountFooter({
  firstName,
  lastName,
  email,
}: AccountFooterProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const displayName = [firstName, lastName].filter(Boolean).join(" ").trim();
  const initials = displayName
    ? displayName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]!.toUpperCase())
        .join("")
    : email
      ? email.slice(0, 2).toUpperCase()
      : "AD";

  async function handleSignOut() {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex items-center justify-between gap-2 border-t border-white/10 pt-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-white">
          {initials}
        </span>
        <p className="truncate text-sm font-light text-white">
          {displayName || email || "Admin"}
        </p>
      </div>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="shrink-0 rounded-full border border-white/15 px-4 py-2 text-xs font-light text-white/70 transition-colors hover:border-white/30 hover:text-white disabled:opacity-50"
      >
        {isSigningOut ? "…" : "Log out"}
      </button>
    </div>
  );
}

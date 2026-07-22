"use client";

import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";

import type { MemberRow } from "@/lib/queries/members";
import { downloadCsv } from "@/lib/csv";
import { Button } from "@/components/ui/button";

interface MailingListActionsProps {
  members: MemberRow[];
}

const HEADERS = ["First name", "Last name", "Email"];

export function MailingListActions({ members }: MailingListActionsProps) {
  const [copied, setCopied] = useState(false);
  const subscribed = members.filter((m) => m.mailing);

  async function handleCopy() {
    const emails = subscribed.map((m) => m.email).join(", ");
    await navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    downloadCsv(
      `mailing-list-${new Date().toISOString().slice(0, 10)}.csv`,
      HEADERS,
      subscribed.map((m) => [m.first_name, m.last_name, m.email]),
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        onClick={handleCopy}
        disabled={subscribed.length === 0}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-400" strokeWidth={1.75} />
        ) : (
          <Copy className="h-4 w-4" strokeWidth={1.75} />
        )}
        {copied ? "Copied" : "Copy emails"} ({subscribed.length})
      </Button>

      <Button
        variant="outline"
        onClick={handleDownload}
        disabled={subscribed.length === 0}
      >
        <Download className="h-4 w-4" strokeWidth={1.75} />
        Export CSV
      </Button>
    </div>
  );
}

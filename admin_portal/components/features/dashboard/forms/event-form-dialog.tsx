"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import type React from "react";

import { createEvent, type EventActionState } from "@/lib/actions/events";
import { FormDialogShell } from "@/components/features/dashboard/forms/form-dialog-shell";

interface EventFormDialogProps {
  trigger: React.ReactNode;
}

const initialState: EventActionState = {};

const inputClass =
  "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/40";

const optionClass = "bg-white text-black";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-white px-5 py-2.5 text-sm font-normal text-black transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Creating…" : "Create event"}
    </button>
  );
}

export function EventFormDialog({ trigger }: EventFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(createEvent, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success && state.eventId) {
      setOpen(false);
      formRef.current?.reset();
      router.push(`/dashboard/events/${state.eventId}`);
    }
  }, [state, router]);

  return (
    <FormDialogShell
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      title="Add event"
    >
      <form ref={formRef} action={formAction} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-light text-white/60">
            Event name
          </label>
          <input name="event_name" required className={inputClass} />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-light text-white/60">
            Date
          </label>
          <input
            name="event_date"
            type="date"
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-light text-white/60">
            Category
          </label>
          <select
            name="event_type"
            required
            defaultValue=""
            className={inputClass}
          >
            <option value="" disabled className={optionClass}>
              Select a category
            </option>
            <option value="Social" className={optionClass}>
              Social
            </option>
            <option value="Workshop" className={optionClass}>
              Workshop
            </option>
            <option value="Competition" className={optionClass}>
              Competition
            </option>
          </select>
        </div>

        {state.error && (
          <p className="text-sm font-light text-red-400">{state.error}</p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-light text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            Cancel
          </button>
          <SubmitButton />
        </div>
      </form>
    </FormDialogShell>
  );
}

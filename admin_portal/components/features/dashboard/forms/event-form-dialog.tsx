"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import type React from "react";

import { createEvent } from "@/lib/actions/events";
import type { EventActionState } from "@/lib/actions/types";
import { FormDialogShell } from "@/components/features/dashboard/forms/form-dialog-shell";
import { Button, SubmitButton } from "@/components/ui/button";
import { TextField, SelectField } from "@/components/ui/form-field";

interface EventFormDialogProps {
  trigger: React.ReactNode;
}

const initialState: EventActionState = {};

const CATEGORY_OPTIONS = [
  { value: "Social", label: "Social" },
  { value: "Workshop", label: "Workshop" },
  { value: "Competition", label: "Competition" },
];

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
        <TextField label="Event name" name="event_name" required />

        <TextField label="Date" name="event_date" type="date" required />

        <SelectField
          label="Category"
          name="event_type"
          required
          defaultValue=""
          placeholder="Select a category"
          options={CATEGORY_OPTIONS}
        />

        {state.error && (
          <p className="text-sm font-light text-red-400">{state.error}</p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <SubmitButton pendingLabel="Creating…">Create event</SubmitButton>
        </div>
      </form>
    </FormDialogShell>
  );
}

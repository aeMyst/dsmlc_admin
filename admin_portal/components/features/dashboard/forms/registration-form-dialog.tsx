"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import type React from "react";

import {
  createRegistration,
  updateRegistration,
  type ActionState,
} from "@/lib/actions/registrations";
import type { RegistrationRow } from "@/lib/queries/registrations";
import { FormDialogShell } from "@/components/features/dashboard/forms/form-dialog-shell";

interface RegistrationFormDialogProps {
  mode: "create" | "edit";
  eventId: string;
  registration?: RegistrationRow;
  trigger: React.ReactNode;
}

const initialState: ActionState = {};

const inputClass =
  "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/40";

const optionClass = "bg-white text-black";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-white px-5 py-2.5 text-sm font-normal text-black transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

export function RegistrationFormDialog({
  mode,
  eventId,
  registration,
  trigger,
}: RegistrationFormDialogProps) {
  const [open, setOpen] = useState(false);
  const action = mode === "edit" ? updateRegistration : createRegistration;
  const [state, formAction] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <FormDialogShell
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      title={mode === "edit" ? "Edit registration" : "Add registration"}
    >
      <form ref={formRef} action={formAction} className="space-y-4">
        <input type="hidden" name="event_id" value={eventId} />
        {mode === "edit" && registration && (
          <input
            type="hidden"
            name="registration_id"
            value={registration.registration_id}
          />
        )}

        {mode === "create" ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-light text-white/60">
                  First name *
                </label>
                <input name="first_name" required className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-light text-white/60">
                  Last name *
                </label>
                <input name="last_name" required className={inputClass} />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-light text-white/60">
                Email *
              </label>
              <input
                name="email"
                type="email"
                required
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-light text-white/60">
                  Student ID *
                </label>
                <input name="student_id" className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-light text-white/60">
                  Major
                </label>
                <input name="major" className={inputClass} />
              </div>
            </div>
          </>
        ) : (
          registration && (
            <div>
              <p className="mb-1.5 text-xs font-light text-white/60">Person</p>
              <p className="text-sm text-white">
                {registration.first_name} {registration.last_name} (
                {registration.email})
              </p>
            </div>
          )
        )}

        <div>
          <label className="mb-1.5 block text-xs font-light text-white/60">
            Status *
          </label>
          <select
            name="status"
            defaultValue={registration?.status ?? "registered"}
            className={inputClass}
          >
            <option value="registered" className={optionClass}>
              Registered
            </option>
            <option value="attended" className={optionClass}>
              Attended
            </option>
            <option value="at-door" className={optionClass}>
              At-door (walk-in)
            </option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-light text-white/60">
            Course credit
          </label>
          <input
            name="course_name"
            defaultValue={registration?.course_name ?? ""}
            placeholder="e.g. STAT 301"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-light text-white/60">
            Sign-up Source
          </label>
          <select
            name="coming_from"
            defaultValue={registration?.coming_from ?? ""}
            className={inputClass}
          >
            <option value="" disabled className={optionClass}>
              none
            </option>
            <option value="Mailman" className={optionClass}>
              Mailman
            </option>
            <option value="Instagram" className={optionClass}>
              Instagram
            </option>
            <option value="LinkedIn" className={optionClass}>
              LinkedIn
            </option>
            <option value="Website" className={optionClass}>
              Website
            </option>
            <option value="Website" className={optionClass}>
              Word-of-Mouth
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
          <SubmitButton
            label={mode === "edit" ? "Save changes" : "Add registration"}
          />
        </div>
      </form>
    </FormDialogShell>
  );
}

"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type React from "react";

import {
  createMember,
  updateMember,
  type ActionState,
} from "@/lib/actions/members";
import type { MemberRow } from "@/lib/queries/members";
import { FormDialogShell } from "@/components/features/dashboard/forms/form-dialog-shell";
import { Button, SubmitButton } from "@/components/ui/button";
import { TextField, SelectField } from "@/components/ui/form-field";

interface MemberFormDialogProps {
  mode: "create" | "edit";
  member?: MemberRow;
  trigger: React.ReactNode;
}

const initialState: ActionState = {};

const MAJOR_OPTIONS = [
  { value: "Computer Science", label: "Computer Science" },
  { value: "Data Science", label: "Data Science" },
  { value: "Engineering", label: "Engineering" },
  { value: "Mathematics", label: "Mathematics" },
  { value: "Business", label: "Business" },
  { value: "Arts", label: "Arts" },
  { value: "Other", label: "Other" },
];

const MEMBERSHIP_TYPE_OPTIONS = [
  { value: "Standard", label: "Standard" },
  { value: "Executive", label: "Executive" },
];

export function MemberFormDialog({
  mode,
  member,
  trigger,
}: MemberFormDialogProps) {
  const [open, setOpen] = useState(false);
  const action = mode === "edit" ? updateMember : createMember;
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
      title={mode === "edit" ? "Edit member" : "Add member"}
    >
      <form ref={formRef} action={formAction} className="space-y-4">
        {mode === "edit" && member && (
          <>
            <input type="hidden" name="people_id" value={member.people_id} />
            <input
              type="hidden"
              name="membership_id"
              value={member.membership_id}
            />
          </>
        )}

        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="First name"
            name="first_name"
            required
            defaultValue={member?.first_name}
          />
          <TextField
            label="Last name"
            name="last_name"
            required
            defaultValue={member?.last_name}
          />
        </div>

        <TextField
          label="Email"
          name="email"
          type="email"
          required
          defaultValue={member?.email}
        />

        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Student ID"
            name="student_id"
            defaultValue={member?.student_id ?? ""}
          />
          <SelectField
            label="Department"
            name="major"
            defaultValue={member?.major ?? ""}
            placeholder="none"
            options={MAJOR_OPTIONS}
          />
        </div>

        <SelectField
          label="Membership type"
          name="membership_type"
          required
          defaultValue={member?.membership_type ?? "Standard"}
          options={MEMBERSHIP_TYPE_OPTIONS}
        />

        <label className="flex items-center gap-2 text-sm font-light text-white/70">
          <input
            type="checkbox"
            name="mailing"
            defaultChecked={member?.mailing ?? false}
            className="h-4 w-4 rounded border-white/30 bg-black/40 accent-brand"
          />
          Subscribed to mailing list
        </label>

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
          <SubmitButton pendingLabel="Saving…">
            {mode === "edit" ? "Save changes" : "Add member"}
          </SubmitButton>
        </div>
      </form>
    </FormDialogShell>
  );
}

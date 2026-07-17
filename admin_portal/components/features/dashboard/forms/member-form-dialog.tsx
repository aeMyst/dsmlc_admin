"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import type React from "react";

import {
  createMember,
  updateMember,
  type ActionState,
} from "@/lib/actions/members";
import type { MemberRow } from "@/lib/queries/members";
import { FormDialogShell } from "@/components/features/dashboard/forms/form-dialog-shell";

interface MemberFormDialogProps {
  mode: "create" | "edit";
  member?: MemberRow;
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
          <div>
            <label className="mb-1.5 block text-xs font-light text-white/60">
              First name
            </label>
            <input
              name="first_name"
              required
              defaultValue={member?.first_name}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-light text-white/60">
              Last name
            </label>
            <input
              name="last_name"
              required
              defaultValue={member?.last_name}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-light text-white/60">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            defaultValue={member?.email}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-light text-white/60">
              Student ID
            </label>
            <input
              name="student_id"
              defaultValue={member?.student_id ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-light text-white/60">
              Department
            </label>
            <select
              name="major"
              defaultValue={member?.major ?? ""}
              className={inputClass}
            >
              <option value="" disabled className={optionClass}>
                none
              </option>
              <option value="Computer Science" className={optionClass}>
                Computer Science
              </option>
              <option value="Data Science" className={optionClass}>
                Data Science
              </option>
              <option value="Engineering" className={optionClass}>
                Engineering
              </option>
              <option value="Mathematics" className={optionClass}>
                Mathematics
              </option>
              <option value="Business" className={optionClass}>
                Business
              </option>
              <option value="Arts" className={optionClass}>
                Arts
              </option>
              <option value="Other" className={optionClass}>
                Other
              </option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-light text-white/60">
            Membership type
          </label>
          <select
            name="membership_type"
            required
            defaultValue={member?.membership_type ?? "Standard"}
            className={inputClass}
          >
            <option value="Standard" className={optionClass}>
              Standard
            </option>
            <option value="Executive" className={optionClass}>
              Executive
            </option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm font-light text-white/70">
          <input
            type="checkbox"
            name="mailing"
            defaultChecked={member?.mailing ?? false}
            className="h-4 w-4 rounded border-white/30 bg-black/40 accent-[#F86306]"
          />
          Subscribed to mailing list
        </label>

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
            label={mode === "edit" ? "Save changes" : "Add member"}
          />
        </div>
      </form>
    </FormDialogShell>
  );
}

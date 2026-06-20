"use client";

import { useTransition } from "react";
import { updateProfile } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfileFormProps {
  fullName: string;
  saveLabel: string;
  nameLabel: string;
}

export function ProfileForm({ fullName, saveLabel, nameLabel }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await updateProfile(formData);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-3 max-w-md">
      <Input name="fullName" defaultValue={fullName} placeholder={nameLabel} required />
      <input type="hidden" name="locale" value="vi" />
      <Button type="submit" size="sm" disabled={isPending}>
        {saveLabel}
      </Button>
    </form>
  );
}

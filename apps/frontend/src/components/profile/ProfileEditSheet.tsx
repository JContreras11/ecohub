"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ProfileUser } from "./types";
import { BACKEND_URL } from "./helpers";

interface ProfileEditSheetProps {
  open: boolean;
  walletAddress: string;
  profile: ProfileUser | null;
  onOpenChange: (open: boolean) => void;
  onSaved: (profile: ProfileUser) => void;
}

interface ProfileFormState {
  displayName: string;
  avatarUrl: string;
  bio: string;
}

function getInitialForm(profile: ProfileUser | null): ProfileFormState {
  return {
    displayName: profile?.displayName || "",
    avatarUrl: profile?.avatarUrl || "",
    bio: profile?.bio || "",
  };
}

export default function ProfileEditSheet({
  open,
  walletAddress,
  profile,
  onOpenChange,
  onSaved,
}: ProfileEditSheetProps) {
  const t = useTranslations("Profile");
  const [form, setForm] = useState<ProfileFormState>(getInitialForm(profile));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(getInitialForm(profile));
    }
  }, [open, profile]);

  const initialForm = useMemo(() => getInitialForm(profile), [profile]);
  const isDirty = JSON.stringify(form) !== JSON.stringify(initialForm);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isDirty) {
      const shouldDiscard = window.confirm(t("discard_confirm"));
      if (!shouldDiscard) return;
    }

    onOpenChange(nextOpen);
  };

  const handleChange = (field: keyof ProfileFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/users/${walletAddress}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || t("save_error"));
      }

      onSaved(payload as ProfileUser);
      toast.success(t("save_success"));
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || t("save_error"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-l border-verdant-900/20 bg-[var(--bg)] p-0 sm:max-w-xl"
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-line-strong px-6 py-6 dark:border-earth-800">
            <SheetTitle className="display text-3xl text-earth-900 dark:text-bone-50">
              {t("edit_profile")}
            </SheetTitle>
            <SheetDescription className="text-sm leading-relaxed text-earth-600 dark:text-bone-400">
              {t("edit_description")}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-6 px-6 py-6">
            <div className="space-y-2">
              <label className="font-mono text-[11px] uppercase tracking-[0.18em] text-earth-500 dark:text-verdant-300">
                {t("fields.display_name")}
              </label>
              <Input
                value={form.displayName}
                onChange={(event) => handleChange("displayName", event.target.value)}
                placeholder={t("placeholders.display_name")}
                className="h-11 rounded-2xl border-line-strong bg-bone-50 text-earth-900 dark:border-earth-800 dark:bg-earth-900/50 dark:text-bone-50"
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-[11px] uppercase tracking-[0.18em] text-earth-500 dark:text-verdant-300">
                {t("fields.avatar_url")}
              </label>
              <Input
                value={form.avatarUrl}
                onChange={(event) => handleChange("avatarUrl", event.target.value)}
                placeholder={t("placeholders.avatar_url")}
                className="h-11 rounded-2xl border-line-strong bg-bone-50 text-earth-900 dark:border-earth-800 dark:bg-earth-900/50 dark:text-bone-50"
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-[11px] uppercase tracking-[0.18em] text-earth-500 dark:text-verdant-300">
                {t("fields.bio")}
              </label>
              <textarea
                value={form.bio}
                onChange={(event) => handleChange("bio", event.target.value)}
                placeholder={t("placeholders.bio")}
                rows={6}
                className="w-full rounded-[1.5rem] border border-line-strong bg-bone-50 px-4 py-3 text-sm leading-7 text-earth-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:border-earth-800 dark:bg-earth-900/50 dark:text-bone-50"
              />
              <p className="text-xs text-earth-500 dark:text-bone-500">{t("bio_hint")}</p>
            </div>
          </div>

          <SheetFooter className="border-t border-line-strong px-6 py-5 dark:border-earth-800">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" className="rounded-2xl" onClick={() => handleOpenChange(false)}>
                {t("cancel")}
              </Button>
              <Button className="rounded-2xl bg-verdant-600 text-white hover:bg-verdant-500" onClick={handleSubmit} disabled={isSaving}>
                {isSaving ? t("saving") : t("save")}
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}

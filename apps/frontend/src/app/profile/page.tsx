import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ProfilePageClient from "@/components/profile/ProfilePageClient";
import { brandTitle } from "@/lib/brand";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Profile");
  return {
    title: brandTitle(t("meta_title")),
    description: t("meta_description"),
  };
}

export default function ProfilePage() {
  return <ProfilePageClient />;
}

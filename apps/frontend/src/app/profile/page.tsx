import type { Metadata } from "next";
import ProfilePageClient from "@/components/profile/ProfilePageClient";
import { brandTitle } from "@/lib/brand";

export const metadata: Metadata = {
  title: brandTitle("Profile"),
  description: "View your connected wallet profile, created projects, and live contribution history.",
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}

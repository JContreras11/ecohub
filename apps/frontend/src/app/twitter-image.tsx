import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand";
import { BrandSocialCard } from "@/lib/brand-graphics";

export const alt = BRAND.socialCardAlt;

export const size = {
  width: 1200,
  height: 600,
};

export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(<BrandSocialCard width={1200} height={600} />, size);
}

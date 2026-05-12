"use client";

import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Language");

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "es" : "en";
    
    // Set the cookie (valid for 1 year)
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    
    // Refresh to re-fetch Server Components with the new locale
    router.refresh();
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full
                 bg-verdant-900/40 border border-verdant-600/30 hover:bg-verdant-800/60
                 text-verdant-300 hover:text-verdant-100 transition-colors text-sm font-medium"
      title={t("switch_title")}
    >
      <Globe className="w-4 h-4" />
      {locale.toUpperCase()}
    </button>
  );
}

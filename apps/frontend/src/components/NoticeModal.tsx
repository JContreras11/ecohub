"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { BRAND } from "@/lib/brand";

export default function NoticeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("NoticeModal");

  useEffect(() => {
    const hasAccepted = localStorage.getItem(BRAND.noticeStorageKey);
    if (!hasAccepted) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isOpen) return null;

  const handleAccept = () => {
    localStorage.setItem(BRAND.noticeStorageKey, "true");
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-earth-900/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-earth-800 border border-verdant-700/50 rounded-3xl shadow-2xl overflow-hidden shadow-glow-verdant">
        {/* Header */}
        <div className="px-6 py-5 border-b border-verdant-700/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-verdant-500/20 border border-verdant-500/30 flex items-center justify-center text-verdant-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-verdant-50">{t("title")}</h2>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-5 text-verdant-300 text-sm md:text-base leading-relaxed">
          <p className="text-verdant-100 font-medium">
            {t("p1", { brand: BRAND.name })}
          </p>
          <p>
            {t("p2")}
          </p>
          <p>
            {t("p3")}
          </p>
          <p>
            {t("p4")}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-verdant-700/50 bg-earth-800/50 flex justify-end">
          <button
            onClick={handleAccept}
            className="px-6 py-3 bg-verdant-600 hover:bg-verdant-500 text-white rounded-xl font-medium shadow-md shadow-verdant-900/50 transition-all active:scale-95"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}

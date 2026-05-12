"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Leaf, Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import ConnectWalletButton from "./ConnectWalletButton";
import { BRAND } from "@/lib/brand";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("Navigation");

  const navItems = [
    { label: t("projects"), href: "/" },
    { label: t("create"), href: "/create" },
    { label: t("profile"), href: "/profile" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full glass-leaf border-b border-line-strong dark:border-[oklch(0.99_0.005_90/0.12)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Wordmark */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-verdant-500/20 border border-verdant-500/30
                            flex items-center justify-center shadow-glow-verdant
                            group-hover:shadow-lg transition-shadow duration-200">
              <Leaf className="w-4 h-4 text-verdant-400 group-hover:text-verdant-300
                               group-hover:rotate-12 transition-all duration-200" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl text-earth-900 dark:text-verdant-100 tracking-tight">
                {BRAND.wordmark.leading}<span className="text-verdant-400">{BRAND.wordmark.accent}</span>
              </span>
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase font-medium px-1.5 py-0.5 rounded
                               bg-verdant-100 dark:bg-[oklch(0.99_0.005_90/0.1)]
                               text-verdant-700 dark:text-bio-300">
                BETA
              </span>
            </div>
          </Link>

          {/* Center: Nav links (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150
                  ${isActive(item.href)
                    ? "bg-earth-900 dark:bg-[oklch(0.99_0.005_90/0.12)] text-bone-50"
                    : "text-earth-700 dark:text-[oklch(0.99_0.005_90/0.7)] hover:bg-bone-200 dark:hover:bg-[oklch(0.99_0.005_90/0.06)]"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right: Controls */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <ConnectWalletButton />
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-earth-700 dark:text-verdant-300 hover:bg-bone-200 dark:hover:bg-earth-800 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {isMenuOpen && (
        <div className="md:hidden bg-bone-50/95 dark:bg-earth-900/95 backdrop-blur-xl border-t border-line-strong dark:border-earth-800 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-colors
                    ${isActive(item.href)
                      ? "bg-earth-900 dark:bg-verdant-500/20 text-white dark:text-verdant-100"
                      : "text-earth-700 dark:text-verdant-400 hover:bg-bone-200 dark:hover:bg-earth-800"
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="pt-4 border-t border-line-strong dark:border-earth-800 flex flex-col gap-4">
              <div className="flex items-center justify-between px-4">
                <span className="text-sm text-earth-500 dark:text-verdant-500">{t("language")}</span>
                <LanguageSwitcher />
              </div>
              <div className="px-2">
                <ConnectWalletButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

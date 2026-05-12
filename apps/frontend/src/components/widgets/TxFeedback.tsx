"use client";

import { useEffect } from "react";
import { Loader2, CheckCircle2, XCircle, ExternalLink, X } from "lucide-react";
import { useTranslations } from "next-intl";

export type TxState = 'idle' | 'pending' | 'confirming' | 'success' | 'error';

interface TxFeedbackProps {
  /** Current transaction state */
  state: TxState;
  /** Transaction hash (shown as monospace chip when available) */
  txHash?: string;
  /** Error message */
  errorMessage?: string;
  /** Custom success message */
  successMessage?: string;
  /** Action label (e.g. "Fund Project", "Approve USDC") */
  actionLabel?: string;
  /** Display mode */
  mode?: 'toast' | 'inline';
  /** Block explorer base URL (defaults to Optimism Sepolia Blockscout) */
  explorerUrl?: string;
  /** Callback when dismissed */
  onDismiss?: () => void;
}

function shortenHash(hash: string): string {
  if (!hash) return "";
  return `${hash.slice(0, 6)}…${hash.slice(-4)}`;
}

export default function TxFeedback({
  state,
  txHash,
  errorMessage,
  successMessage,
  actionLabel,
  mode = 'toast',
  explorerUrl = 'https://optimism-sepolia.blockscout.com',
  onDismiss,
}: TxFeedbackProps) {
  const t = useTranslations("Tx");
  useEffect(() => {
    if (state === 'success' && mode === 'toast' && onDismiss) {
      const timer = setTimeout(() => onDismiss(), 5000);
      return () => clearTimeout(timer);
    }
  }, [state, mode, onDismiss]);

  if (state === 'idle') return null;

  let styles = "";
  let icon = null;
  let label = "";

  switch (state) {
    case 'pending':
      styles = "bg-solar-100 dark:bg-solar-900/30 border-solar-400/30 text-solar-800 dark:text-solar-300";
      icon = <Loader2 className="w-5 h-5 animate-spin" />;
      label = t("waiting_signature", { action: actionLabel ?? t("transaction") });
      break;
    case 'confirming':
      styles = "bg-solar-100 dark:bg-solar-900/30 border-solar-400/30 text-solar-800 dark:text-solar-300";
      icon = <Loader2 className="w-5 h-5 animate-spin" />;
      label = t("confirming");
      break;
    case 'success':
      styles = "bg-verdant-100 dark:bg-verdant-900/30 border-verdant-400/30 text-verdant-800 dark:text-verdant-300";
      icon = <CheckCircle2 className="w-5 h-5" />;
      label = successMessage ?? t("confirmed");
      break;
    case 'error':
      styles = "bg-[oklch(0.95_0.04_35)] dark:bg-coral-700/20 border-coral-300/30 dark:border-coral-500/30 text-coral-700 dark:text-coral-300";
      icon = <XCircle className="w-5 h-5" />;
      label = errorMessage ?? t("failed");
      break;
  }

  const containerClasses = `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border backdrop-blur-md ${styles} ${
    mode === 'toast' ? 'fixed bottom-6 right-6 z-50 shadow-bloom animate-in slide-in-from-bottom-4 duration-300 max-w-sm' : 'relative w-full'
  }`;

  return (
    <div className={containerClasses}>
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex flex-col gap-1 min-w-0">
        <p className="truncate">{label}</p>
        {(state === 'confirming' || state === 'success') && txHash && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 opacity-70">
              {shortenHash(txHash)}
            </span>
            <a 
              href={`${explorerUrl}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] underline opacity-50 hover:opacity-100"
            >
              {t("view_explorer")}
            </a>
          </div>
        )}
      </div>
      {mode === 'toast' && onDismiss && (
        <button 
          onClick={onDismiss}
          className="ml-auto p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

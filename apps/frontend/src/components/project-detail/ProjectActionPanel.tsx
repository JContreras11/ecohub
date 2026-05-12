"use client";

import { useMemo, useState } from "react";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "wagmi/actions";
import type { Address } from "viem";
import { parseUnits } from "viem";
import { useTranslations } from "next-intl";
import { ArrowRight, Coins, LockKeyhole, Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProgressArc, TxFeedback, type TxState } from "@/components/widgets";
import {
  ECOSPONSOR_ABI,
  ERC20_ABI,
  PROJECT_DETAIL_STAGE_LABELS,
  ZERO_ADDRESS,
  getContractAddress,
} from "@/lib/contracts";
import { BRAND } from "@/lib/brand";
import { wagmiConfig } from "@/lib/wagmi";
import { formatUsdcFromBaseUnits, getFundingRatio, shortenAddress } from "./helpers";
import type { BackendProject, LiveProject } from "./types";

interface ProjectActionPanelProps {
  project: BackendProject;
  liveProject?: LiveProject;
  acceptedToken?: Address;
  currentWithdrawable?: bigint;
  contributorCount: number;
  onRefresh: () => Promise<void>;
  stageLabels?: string[];
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message.split("\n")[0] || fallback;
  }
  return fallback;
}

export default function ProjectActionPanel({
  project,
  liveProject,
  acceptedToken,
  currentWithdrawable,
  contributorCount,
  onRefresh,
  stageLabels,
}: ProjectActionPanelProps) {
  const t = useTranslations("ProjectDetail");
  const labels = stageLabels ?? [t("stage_label_01"), t("stage_label_02"), t("stage_label_03")];
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { writeContractAsync } = useWriteContract();

  const [customAmount, setCustomAmount] = useState("100");
  const [isFundOpen, setIsFundOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [txState, setTxState] = useState<TxState>("idle");
  const [txHash, setTxHash] = useState<string | undefined>();
  const [actionLabel, setActionLabel] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const contractAddress = getContractAddress(chainId || 11155111);
  const onChainId = project.onChainId != null ? BigInt(project.onChainId) : undefined;
  const currentStage = liveProject ? Number(liveProject.currentStage) : project.currentStage;
  const fundingGoal = liveProject?.fundingGoal ?? BigInt(project.fundingGoal || "0");
  const totalFunded = liveProject?.totalFunded ?? BigInt(project.totalFunded || "0");
  const fundingRatio = getFundingRatio(totalFunded, fundingGoal);
  const normalizedAddress = address?.toLowerCase();
  const isOwner =
    isConnected &&
    normalizedAddress !== undefined &&
    normalizedAddress === project.ownerAddress.toLowerCase();
  const hasContractRoute =
    onChainId !== undefined &&
    contractAddress !== ZERO_ADDRESS &&
    acceptedToken !== undefined &&
    acceptedToken !== ZERO_ADDRESS;
  const allStagesClaimed = currentStage >= PROJECT_DETAIL_STAGE_LABELS.length;
  const withdrawLabel = labels[Math.min(currentStage, labels.length - 1)];

  const amountOptions = ["50", "250", "1000"];

  const statusCopy = useMemo(() => {
    if (project.onChainId == null) {
      return {
        title: t("status_pending_title"),
        body: t("status_pending_body"),
      };
    }

    if (!hasContractRoute) {
      return {
        title: t("status_network_title"),
        body: t("status_network_body", { brand: BRAND.name }),
      };
    }

    if (!liveProject?.active) {
      return {
        title: t("status_closed_title"),
        body: t("status_closed_body"),
      };
    }

    if (allStagesClaimed) {
      return {
        title: t("status_claimed_title"),
        body: t("status_claimed_body"),
      };
    }

    return {
      title: t("status_live_title"),
      body: t("status_live_body"),
    };
  }, [allStagesClaimed, hasContractRoute, liveProject?.active, project.onChainId, t]);

  async function syncProjectCache(latestHash: `0x${string}`) {
    if (onChainId === undefined || contractAddress === ZERO_ADDRESS) return;

    const freshProject = (await readContract(wagmiConfig, {
      address: contractAddress,
      abi: ECOSPONSOR_ABI,
      functionName: "getProject",
      args: [onChainId],
    })) as LiveProject;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

    try {
      await fetch(`${backendUrl}/api/projects/${project.id}/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          onChainId: Number(onChainId),
          totalFunded: freshProject.totalFunded.toString(),
          currentStage: Number(freshProject.currentStage),
          txHash: latestHash,
        }),
      });
    } catch (error) {
      console.error("[project-detail/sync] Failed to refresh backend cache", error);
    }
  }

  async function runTransaction(action: string, write: () => Promise<`0x${string}`>) {
    setActionLabel(action);
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
    setTxState("pending");

    const hash = await write();
    setTxHash(hash);
    setTxState("confirming");
    await waitForTransactionReceipt(wagmiConfig, { hash });
    return hash;
  }

  async function handleFund() {
    if (!address) {
      setTxState("error");
      setErrorMessage(t("err_connect"));
      return;
    }

    if (!acceptedToken || onChainId === undefined || !hasContractRoute || !liveProject?.active) {
      setTxState("error");
      setErrorMessage(t("err_unavailable"));
      return;
    }

    const numericAmount = Number.parseFloat(customAmount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setTxState("error");
      setErrorMessage(t("err_amount"));
      return;
    }

    try {
      setIsWorking(true);
      const connectedAddress = address;
      const amountBaseUnits = parseUnits(customAmount, 6);
      const allowance = (await readContract(wagmiConfig, {
        address: acceptedToken,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: [connectedAddress, contractAddress],
      })) as bigint;

      if (allowance < amountBaseUnits) {
        await runTransaction(t("approve_action"), () =>
          writeContractAsync({
            address: acceptedToken,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [contractAddress, amountBaseUnits],
          }),
        );
      }

      const fundHash = await runTransaction(t("fund_action"), () =>
        writeContractAsync({
          address: contractAddress,
          abi: ECOSPONSOR_ABI,
          functionName: "fundProject",
          args: [onChainId, amountBaseUnits],
        }),
      );

      await syncProjectCache(fundHash);
      await onRefresh();

      setTxState("success");
      setSuccessMessage(t("fund_success"));
      setIsFundOpen(false);
    } catch (error) {
      setTxState("error");
      setErrorMessage(getErrorMessage(error, t("err_tx_failed")));
    } finally {
      setIsWorking(false);
    }
  }

  async function handleWithdraw() {
    if (
      !isOwner ||
      onChainId === undefined ||
      !hasContractRoute ||
      currentStage >= PROJECT_DETAIL_STAGE_LABELS.length
    ) {
      setTxState("error");
      setErrorMessage(t("err_owner_only"));
      return;
    }

    try {
      setIsWorking(true);
      const withdrawHash = await runTransaction(t("withdraw_action"), () =>
        writeContractAsync({
          address: contractAddress,
          abi: ECOSPONSOR_ABI,
          functionName: "withdrawFunds",
          args: [onChainId, BigInt(currentStage)],
        }),
      );

      await syncProjectCache(withdrawHash);
      await onRefresh();

      setTxState("success");
      setSuccessMessage(t("withdraw_success"));
      setIsWithdrawOpen(false);
    } catch (error) {
      setTxState("error");
      setErrorMessage(getErrorMessage(error, t("err_tx_failed")));
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <aside className="flex flex-col gap-5 lg:sticky lg:top-24">
      <section className="glass-leaf rounded-[2rem] border border-line-strong p-6 shadow-bloom">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-verdant-700 dark:text-verdant-300">
              {t("funding_panel")}
            </div>
            <h2 className="display mt-3 text-3xl text-earth-900 dark:text-bone-50">{t("escrow_overview")}</h2>
          </div>
          <ProgressArc value={fundingRatio} size={76} stroke={5} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[1.35rem] border border-line-strong bg-bone-50/80 p-4 dark:bg-earth-900/40">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-earth-500 dark:text-verdant-300">
              {t("funded")}
            </div>
            <div className="mt-2 font-display text-2xl text-earth-900 dark:text-bone-50">
              {formatUsdcFromBaseUnits(totalFunded)}
            </div>
            <div className="mt-1 text-xs text-earth-500 dark:text-verdant-300">
              {t("of_goal", { goal: formatUsdcFromBaseUnits(fundingGoal) })}
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-line-strong bg-bone-50/80 p-4 dark:bg-earth-900/40">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-earth-500 dark:text-verdant-300">
              {t("backers")}
            </div>
            <div className="mt-2 font-display text-2xl text-earth-900 dark:text-bone-50">{contributorCount}</div>
            <div className="mt-1 text-xs text-earth-500 dark:text-verdant-300">
              {t("distinct_wallets")}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[1.5rem] border border-line-strong bg-earth-900 px-4 py-4 text-bone-50 dark:border-verdant-700/30">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-solar-300">{statusCopy.title}</div>
          <p className="mt-2 text-sm leading-relaxed text-bone-200/85">{statusCopy.body}</p>
          <div className="mt-3 text-xs text-bone-400">
            {t("owner_label")} <span className="font-mono text-bone-100">{shortenAddress(project.ownerAddress)}</span>
          </div>
        </div>

        {!isConnected ? (
          <div className="mt-5 rounded-[1.35rem] border border-dashed border-line-strong bg-bone-50/70 p-4 dark:bg-earth-900/30">
            <div className="flex items-center gap-2 text-earth-900 dark:text-bone-50">
              <Wallet className="h-4 w-4 text-verdant-500" />
              <span className="font-medium">{t("connect_to_fund")}</span>
            </div>
            <p className="mt-2 text-sm text-earth-500 dark:text-verdant-300">
              {t("no_wallet_hint")}
            </p>
          </div>
        ) : isOwner ? (
          <div className="mt-5 flex flex-col gap-3">
            <Button
              onClick={() => setIsWithdrawOpen(true)}
              disabled={!hasContractRoute || allStagesClaimed || isWorking}
              className="h-12 rounded-2xl bg-earth-900 text-bone-50 hover:bg-earth-800"
            >
              <LockKeyhole className="h-4 w-4" />
              {t("withdraw_stage_label", { label: withdrawLabel })}
            </Button>
            <p className="text-sm text-earth-500 dark:text-verdant-300">
              {t("claimable_now", {
                amount: formatUsdcFromBaseUnits(currentWithdrawable ?? BigInt(0)),
                stage: currentStage + 1,
              })}
            </p>
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-3">
            <Button
              onClick={() => setIsFundOpen(true)}
              disabled={!hasContractRoute || !liveProject?.active || isWorking}
              className="h-12 rounded-2xl bg-verdant-600 text-bone-50 hover:bg-verdant-500"
            >
              <Coins className="h-4 w-4" />
              {t("fund_project_btn")}
            </Button>
            <p className="text-sm text-earth-500 dark:text-verdant-300">
              {t("fund_help")}
            </p>
          </div>
        )}

        {txState !== "idle" && (
          <div className="mt-5">
            <TxFeedback
              state={txState}
              txHash={txHash}
              actionLabel={actionLabel}
              successMessage={successMessage}
              errorMessage={errorMessage}
              mode="inline"
            />
          </div>
        )}
      </section>

      <Dialog open={isFundOpen} onOpenChange={setIsFundOpen}>
        <DialogContent className="max-w-xl rounded-[2rem] border border-line-strong bg-bone-50 text-earth-900 shadow-bloom dark:bg-earth-900 dark:text-bone-50">
          <DialogHeader>
            <DialogTitle className="display text-3xl">{t("fund_dialog_title")}</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-earth-500 dark:text-verdant-300">
              {t("fund_dialog_desc", { contract: BRAND.contractName, id: project.id })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {amountOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCustomAmount(option)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                    customAmount === option
                      ? "border-verdant-500 bg-verdant-100 text-verdant-800 dark:bg-verdant-900/30 dark:text-verdant-200"
                      : "border-line-strong bg-bone-50/80 hover:border-verdant-400 dark:bg-earth-800/60"
                  }`}
                >
                  ${option}
                </button>
              ))}
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase tracking-[0.18em] text-earth-500 dark:text-verdant-300">
                {t("custom_amount")}
              </label>
              <Input
                value={customAmount}
                onChange={(event) => setCustomAmount(event.target.value)}
                className="mt-2 h-12 rounded-2xl border-line-strong bg-bone-50 dark:bg-earth-800/70"
                inputMode="decimal"
                placeholder="100"
              />
            </div>

            <div className="rounded-[1.35rem] border border-line-strong bg-earth-900 px-4 py-4 text-bone-50 dark:border-verdant-700/20">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-solar-300">
                {t("approve_flow_title")}
              </div>
              <p className="mt-2 text-sm text-bone-200/80">
                {t("approve_flow_body", { token: shortenAddress(acceptedToken ?? "") })}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFundOpen(false)} disabled={isWorking} className="rounded-2xl border-line-strong">
              {t("cancel")}
            </Button>
            <Button onClick={() => void handleFund()} disabled={isWorking || !hasContractRoute} className="rounded-2xl bg-verdant-600 text-bone-50 hover:bg-verdant-500">
              {t("continue_fund")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="max-w-xl rounded-[2rem] border border-line-strong bg-bone-50 text-earth-900 shadow-bloom dark:bg-earth-900 dark:text-bone-50">
          <DialogHeader>
            <DialogTitle className="display text-3xl">{t("withdraw_dialog_title")}</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-earth-500 dark:text-verdant-300">
              {t("withdraw_dialog_desc")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-[1.35rem] border border-line-strong bg-bone-50/80 p-4 dark:bg-earth-800/60">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-earth-500 dark:text-verdant-300">
                {t("claiming_now")}
              </div>
              <div className="mt-2 font-display text-3xl text-earth-900 dark:text-bone-50">
                {formatUsdcFromBaseUnits(currentWithdrawable ?? BigInt(0))}
              </div>
              <div className="mt-2 text-sm text-earth-500 dark:text-verdant-300">
                {t("stage_index", { label: withdrawLabel, index: currentStage })}
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-line-strong bg-earth-900 px-4 py-4 text-bone-50 dark:border-verdant-700/20">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-solar-300">
                {t("release_guard")}
              </div>
              <p className="mt-2 text-sm text-bone-200/80">
                {t("release_guard_body")}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWithdrawOpen(false)} disabled={isWorking} className="rounded-2xl border-line-strong">
              {t("cancel")}
            </Button>
            <Button onClick={() => void handleWithdraw()} disabled={isWorking || !hasContractRoute || allStagesClaimed} className="rounded-2xl bg-earth-900 text-bone-50 hover:bg-earth-800">
              {t("withdraw_tranche")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}

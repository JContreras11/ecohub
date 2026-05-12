"use client";

import { useState, useRef, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import {
  Upload, FileText, CheckCircle2, Loader2, ImageIcon,
  ArrowRight, Plus, Trash2, Globe, Scale, Zap
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ECOSPONSOR_ABI, getContractAddress } from "@/lib/contracts";
import { BRAND } from "@/lib/brand";
import { ProgressArc, TxFeedback } from "@/components/widgets";
import { Button } from "@/components/ui/button";

interface Stage {
  name: string;
  amount: number;
  days: number;
  desc: string;
}

interface FormData {
  title: string;
  tagline: string;
  description: string;
  readme: string;
  tags: string;
  bioregion: string;
  license: string;
  chain: string;
  stages: Stage[];
}

type StepNumber = 1 | 2 | 3 | 4;

const FIELD_STYLE = "w-full border border-line rounded-[14px] px-4 py-3.5 font-body text-[15px] bg-bone-50 dark:bg-earth-900/40 text-earth-900 dark:text-bone-50 outline-none focus:ring-2 focus:ring-verdant-500/50 transition-all resize-vertical";

const Field = ({ label, register, name, errors = {}, placeholder, big = false, hint, type = "text", value, readOnly }: any) => (
  <div className="flex flex-col gap-2">
    <label className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft dark:text-verdant-300/80">
      {label}
    </label>
    {big ? (
      <textarea
        {...(register && name ? register(name) : {})}
        placeholder={placeholder}
        rows={3}
        value={value}
        readOnly={readOnly}
        className={`${FIELD_STYLE} ${name && errors[name] ? "border-coral-500" : ""}`}
      />
    ) : (
      <input
        {...(register && name ? register(name) : {})}
        type={type}
        placeholder={placeholder}
        value={value}
        readOnly={readOnly}
        className={`${FIELD_STYLE} ${name && errors[name] ? "border-coral-500" : ""}`}
      />
    )}
    {name && errors[name] && <span className="text-coral-500 text-xs font-medium">{errors[name].message}</span>}
    {hint && <div className="text-[12px] text-ink-soft dark:text-verdant-300/70 mt-1">{hint}</div>}
  </div>
);

const Stepper = ({ currentStep, setStep }: { currentStep: number; setStep: (n: StepNumber) => void }) => {
  const t = useTranslations("Create");
  const steps = [
    { n: 1, l: t("step_identity") },
    { n: 2, l: t("step_stages") },
    { n: 3, l: t("step_onchain") },
    { n: 4, l: t("step_publish") },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {steps.map((s) => {
        const state = s.n === currentStep ? "active" : s.n < currentStep ? "done" : "future";
        return (
          <button
            key={s.n}
            type="button"
            onClick={() => setStep(s.n as StepNumber)}
            className={`flex-1 min-w-[140px] p-3.5 rounded-2xl border transition-all text-left flex items-center gap-3.5
              ${state === "active" ? "border-verdant-700 bg-bone-50 dark:bg-earth-800" : "border-line bg-oklch(0.99_0.01_90/0.8) dark:bg-earth-900/40"}
              ${state === "done" ? "bg-verdant-100 dark:bg-verdant-900/20" : ""}
            `}
          >
            <div className={`w-8 h-8 rounded-full grid place-items-center font-mono text-[13px] font-semibold
              ${state === "future" ? "bg-bone-300 dark:bg-earth-700 text-earth-700 dark:text-bone-400" : "bg-verdant-600 text-bone-50"}
            `}>
              {state === "done" ? <CheckCircle2 className="w-3.5 h-3.5" /> : String(s.n).padStart(2, "0")}
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-soft dark:text-verdant-300/60">{t("step_label")}</div>
              <div className="font-semibold text-[15px] text-earth-900 dark:text-bone-50">{s.l}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

const LivePreview = ({ control, totalGoal }: { control: any; totalGoal: number }) => {
  const t = useTranslations("Create");
  const values = useWatch({ control });

  return (
    <div className="flex flex-col gap-5 sticky top-24 self-start">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solar-100 dark:bg-solar-900/30 text-solar-700 dark:text-solar-400 text-xs font-semibold w-fit">
        <span className="w-1.5 h-1.5 rounded-full bg-solar-500 animate-pulse" />
        {t("live_preview")}
      </div>

      <div className="rounded-[28px] overflow-hidden bg-bone-50 dark:bg-earth-900 border border-line shadow-bloom">
        <div className="h-[200px] bg-earth-800 overflow-hidden">
          <div className="w-full h-full bg-[url('/images/create-preview.jpg')] bg-cover bg-center opacity-80" />
        </div>

        <div className="p-5 flex flex-col gap-3">
          <div className="font-mono text-[11px] tracking-[0.18em] text-ink-soft dark:text-verdant-300 uppercase">
            {values.bioregion || t("preview_bioregion")}
          </div>
          <h3 className="display text-2xl text-earth-900 dark:text-bone-50">
            {values.title || t("preview_title")}
          </h3>
          <p className="text-[13px] text-ink-soft dark:text-bone-400/70 leading-relaxed line-clamp-2">
            {values.tagline || t("preview_tagline")}
          </p>

          <div className="mt-2 pt-4 border-t border-line flex flex-col gap-2">
            {values.stages?.slice(0, 3).map((s: any, i: number) => (
              <div key={i} className="flex justify-between items-center text-[13px]">
                <span className="text-earth-900 dark:text-bone-100 flex items-center gap-2">
                  <span className="font-mono text-ink-soft dark:text-verdant-400">{String(i+1).padStart(2, "0")}</span>
                  <span className="truncate max-w-[140px]">{s.name || t("preview_new_stage")}</span>
                </span>
                <span className="font-mono text-verdant-700 dark:text-verdant-400">${Number(s.amount || 0).toLocaleString()}</span>
              </div>
            ))}
            {values.stages?.length > 3 && (
              <div className="text-[11px] text-ink-soft italic">{t("preview_more_stages", { count: values.stages.length - 3 })}</div>
            )}
          </div>

          <div className="mt-3 p-3 bg-verdant-100 dark:bg-verdant-900/40 rounded-xl flex justify-between items-center">
            <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-verdant-800 dark:text-verdant-300">{t("preview_goal")}</span>
            <span className="display text-xl text-verdant-800 dark:text-verdant-300">${totalGoal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-earth-900 dark:bg-earth-800 border border-line text-bone-100 shadow-xl">
        <div className="font-mono text-[11px] tracking-[0.18em] text-solar-300 mb-2 uppercase">{t("network_label")}</div>
        <div className="font-semibold text-sm mb-2">{t("network_validators", { chain: values.chain || "Base" })}</div>
        <div className="font-mono text-[11px] text-bone-500/60 leading-relaxed">
          {t("network_gas")}<br />
          {t("network_time")}
        </div>
      </div>
    </div>
  );
};

function CreateProjectFormInner() {
  const t = useTranslations("Create");
  const { address, chainId, isConnected } = useAccount();
  const [step, setStep] = useState<StepNumber>(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [metadataCid, setMetadataCid] = useState<string>("");
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { writeContractAsync, isPending: isTxLoading } = useWriteContract();
  const { isLoading: isWaitingTx, isSuccess: isTxSuccess, error: txError } =
    useWaitForTransactionReceipt({ hash: txHash });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      tagline: "",
      bioregion: "",
      license: "CERN-OHL-S",
      chain: "Base",
      stages: [
        { name: t("default_stage1_name"), amount: 8000, days: 30, desc: t("default_stage1_desc") },
        { name: t("default_stage2_name"), amount: 18000, days: 45, desc: t("default_stage2_desc") },
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "stages"
  });

  const stagesValues = useWatch({ control, name: "stages" });
  const chainValue = useWatch({ control, name: "chain" });
  const totalGoal = stagesValues?.reduce((s, x) => s + Number(x.amount || 0), 0) || 0;


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: FormData) => {
    if (!isConnected || !address) {
      toast.error(t("wallet_required"));
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("title",         data.title);
      formData.append("description",   data.description || data.tagline);
      formData.append("readme",        data.readme || data.tagline);
      formData.append("tags",          JSON.stringify(
        data.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      ));
      formData.append("authorAddress", address);

      const fundingGoalBaseUnits = parseUnits(totalGoal.toString(), 6).toString();
      formData.append("fundingGoal",   fundingGoalBaseUnits);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000").replace(/\/+$/, "");
      const uploadRes = await fetch(`${backendUrl}/api/projects/upload`, {
        method: "POST",
        body:   formData,
      });

      if (!uploadRes.ok) throw new Error(t("upload_failed"));

      const uploadData = await uploadRes.json();
      const cid = uploadData.metadataCid as string;
      setMetadataCid(cid);
      setIsUploading(false);

      const contractAddress = getContractAddress(chainId || 11155111);
      const fundingGoalUint = parseUnits(totalGoal.toString(), 6);

      const hash = await writeContractAsync({
        abi:          ECOSPONSOR_ABI,
        address:      contractAddress,
        functionName: "createProject",
        args:         [cid, fundingGoalUint],
      });

      setTxHash(hash);

      if (uploadData.slug) {
        fetch(`${backendUrl}/api/projects/${uploadData.slug}/sync`, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ txHash: hash }),
        }).catch(console.error);
      }

    } catch (err: any) {
      setIsUploading(false);
      toast.error(err.message || t("generic_error"));
    }
  };

  if (isTxSuccess) {
    return (
      <div className="max-w-2xl mx-auto glass-leaf p-12 rounded-[32px] text-center flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 rounded-full bg-verdant-500/20 border border-verdant-400/30 flex items-center justify-center shadow-glow-verdant animate-glow-pulse">
          <CheckCircle2 className="w-12 h-12 text-verdant-400" />
        </div>
        <h2 className="display text-4xl text-earth-900 dark:text-bone-50">{t("success_title")}</h2>
        <p className="text-ink-soft dark:text-bone-400 max-w-md">
          {t("success_body")}
        </p>

        <div className="flex flex-col gap-3 w-full max-w-sm mt-4">
          {metadataCid && (
            <a href={`https://gateway.pinata.cloud/ipfs/${metadataCid}`} target="_blank" className="flex items-center justify-between p-4 rounded-xl bg-bone-50 dark:bg-earth-800 border border-line hover:border-verdant-500 transition-all">
              <span className="flex items-center gap-3 font-medium text-earth-900 dark:text-bone-50">
                <FileText className="w-4 h-4 text-bio-500" />
                {t("ipfs_metadata")}
              </span>
              <ArrowRight className="w-4 h-4 text-ink-soft" />
            </a>
          )}
          {txHash && (
            <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" className="flex items-center justify-between p-4 rounded-xl bg-bone-50 dark:bg-earth-800 border border-line hover:border-solar-500 transition-all">
              <span className="flex items-center gap-3 font-medium text-earth-900 dark:text-bone-50">
                <Globe className="w-4 h-4 text-solar-500" />
                {t("onchain_record")}
              </span>
              <ArrowRight className="w-4 h-4 text-ink-soft" />
            </a>
          )}
        </div>

        <Button onClick={() => window.location.href = "/"} className="mt-6 px-8 py-6 rounded-2xl bg-earth-900 text-bone-50">
          {t("go_to_dashboard")}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 items-start">
      <div className="flex flex-col gap-6">
        <Stepper currentStep={step} setStep={setStep} />

        <div className="glass-leaf rounded-[32px] p-8 md:p-10 relative overflow-hidden min-h-[500px]">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
            {step === 1 && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="display text-4xl text-earth-900 dark:text-bone-50">{t("section_identity")}</h2>
                <Field label={t("field_title")} name="title" register={register} errors={errors} placeholder={t("placeholder_title")} />
                <Field label={t("field_tagline")} name="tagline" register={register} errors={errors} placeholder={t("placeholder_tagline")} big />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label={t("field_bioregion")} name="bioregion" register={register} errors={errors} placeholder={t("placeholder_bioregion")} />
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft dark:text-verdant-300/80">{t("field_license")}</label>
                    <select {...register("license")} className={`${FIELD_STYLE} appearance-none`}>
                      <option>CERN-OHL-S</option>
                      <option>MIT</option>
                      <option>CC-BY-SA 4.0</option>
                      <option>Apache-2.0</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft dark:text-verdant-300/80">{t("field_cover")}</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-verdant-300 dark:border-verdant-800 rounded-2xl p-6 flex items-center gap-5 bg-verdant-50 dark:bg-earth-900/40 cursor-pointer hover:bg-verdant-100/50 transition-all"
                  >
                    <div className="w-24 h-16 rounded-lg bg-earth-800 overflow-hidden shadow-sm flex-shrink-0">
                      {imagePreview ? (
                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="text-verdant-500/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-earth-900 dark:text-bone-100">
                        {imageFile ? imageFile.name : t("choose_cover")}
                      </div>
                      <div className="text-[12px] text-ink-soft dark:text-bone-400/50">{t("cover_hint")}</div>
                    </div>
                    <Button type="button" variant="outline" size="sm" className="rounded-xl border-line">
                      {imageFile ? t("replace") : t("select")}
                    </Button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft dark:text-verdant-300/80">{t("field_tags")}</label>
                  <Field name="tags" register={register} errors={errors} placeholder={t("placeholder_tags")} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center">
                  <h2 className="display text-4xl text-earth-900 dark:text-bone-50">{t("section_stages")}</h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: "", amount: 0, days: 30, desc: "" })}
                    className="rounded-xl border-line gap-2"
                  >
                    <Plus className="w-3.5 h-3.5" /> {t("add_stage")}
                  </Button>
                </div>

                <div className="flex flex-col gap-4">
                  {fields.map((field, i) => (
                    <div key={field.id} className="p-5 rounded-2xl bg-bone-50 dark:bg-earth-900/40 border border-line grid grid-cols-[auto_1fr_auto] gap-5 items-start">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-verdant-500 to-verdant-700 text-bone-50 grid place-items-center font-mono font-bold">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="flex flex-col gap-3">
                        <input
                          {...register(`stages.${i}.name` as const)}
                          placeholder={t("placeholder_stage_name")}
                          className={`${FIELD_STYLE} font-medium text-base !py-2.5`}
                        />
                        <textarea
                          {...register(`stages.${i}.desc` as const)}
                          placeholder={t("placeholder_stage_desc")}
                          rows={2}
                          className={`${FIELD_STYLE} text-[13px] !py-2.5`}
                        />
                        <div className="flex gap-4">
                          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-verdant-50 dark:bg-earth-800 rounded-xl">
                            <span className="font-mono text-[10px] text-ink-soft uppercase">{t("usdc")}</span>
                            <input
                              type="number"
                              {...register(`stages.${i}.amount` as const)}
                              className="w-full bg-transparent border-none outline-none font-mono text-sm text-earth-900 dark:text-bone-50"
                            />
                          </div>
                          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-solar-100 dark:bg-solar-900/30 rounded-xl">
                            <span className="font-mono text-[10px] text-ink-soft uppercase">{t("days")}</span>
                            <input
                              type="number"
                              {...register(`stages.${i}.days` as const)}
                              className="w-full bg-transparent border-none outline-none font-mono text-sm text-earth-900 dark:text-bone-50"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(i)}
                        className="w-8 h-8 rounded-lg border border-line hover:border-coral-500 hover:text-coral-500 transition-colors grid place-items-center text-ink-soft"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-5 rounded-2xl bg-verdant-100 dark:bg-verdant-900/40 flex justify-between items-center border border-verdant-200 dark:border-verdant-800">
                  <span className="font-mono text-xs tracking-widest uppercase text-verdant-800 dark:text-verdant-300">{t("total_funding_goal")}</span>
                  <span className="display text-3xl text-verdant-800 dark:text-verdant-300">${totalGoal.toLocaleString()} USDC</span>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="display text-4xl text-earth-900 dark:text-bone-50">{t("section_onchain")}</h2>

                <div className="flex flex-col gap-3">
                  <label className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft dark:text-verdant-300/80">{t("network_label")}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {["Base", "Optimism", "Polygon"].map((c) => {
                      const active = chainValue === c;
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setValue("chain", c)}
                          className={`p-5 rounded-2xl border text-left transition-all
                            ${active ? "border-verdant-700 bg-verdant-100 dark:bg-verdant-900/30" : "border-line bg-bone-50 dark:bg-earth-900/40"}
                          `}
                        >
                          <div className="font-bold text-earth-900 dark:text-bone-50">{c}</div>
                          <div className="text-[11px] text-ink-soft mt-1">{t("tx_per", { cost: c === "Base" ? "0.002" : "0.001" })}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label={t("field_validators")} value={t("validators_value")} readOnly hint={t("validators_hint")} />
                  <Field label={t("field_voting")} value={t("voting_value")} readOnly hint={t("voting_hint")} />
                </div>

                <div className="p-5 rounded-2xl bg-earth-900 dark:bg-earth-800 text-bone-50 font-mono text-[12px] leading-relaxed relative group">
                  <div className="text-solar-300 mb-2">// {BRAND.contractName}.sol — generated code snippet</div>
                  <code className="block opacity-80">
                    StageEscrow(chain="{chainValue || "Base"}")<br />
                    &nbsp;.stages([{fields.length}])<br />
                    &nbsp;.totalGoal({totalGoal})<br />
                    &nbsp;.validators(3, [Δ-04, Σ-19, Ω-71])<br />
                    &nbsp;.metadata("ipfs://bafy…")
                  </code>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Scale className="w-4 h-4 text-solar-500" />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="display text-4xl text-earth-900 dark:text-bone-50">{t("section_publish")}</h2>

                {isUploading || txHash ? (
                  <div className="flex flex-col items-center py-12 gap-8">
                    {isUploading ? (
                      <>
                        <div className="relative">
                          <ProgressArc value={0.75} size={160} stroke={12} label="PINNING" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            <Upload className="w-12 h-12 text-verdant-500 animate-bounce" />
                          </div>
                        </div>
                        <div className="text-center">
                          <h3 className="font-semibold text-xl text-earth-900 dark:text-bone-50">{t("uploading_title")}</h3>
                          <p className="text-ink-soft dark:text-bone-400 mt-2">{t("uploading_body")}</p>
                        </div>
                      </>
                    ) : (
                      <div className="w-full">
                        <TxFeedback
                          state={isTxLoading ? "confirming" : isTxSuccess ? "success" : txError ? "error" : "pending"}
                          txHash={txHash}
                          mode="inline"
                          actionLabel={t("deploying")}
                          errorMessage={txError?.message}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <p className="text-ink-soft dark:text-bone-400">{t("publish_intro", { brand: BRAND.name })}</p>
                    <div className="flex flex-col gap-3">
                      {[
                        { l: t("tx_pin"), s: t("tx_pin_cost") },
                        { l: t("tx_deploy"), s: t("tx_deploy_cost") },
                        { l: t("tx_register", { brand: BRAND.name }), s: t("tx_register_cost") },
                      ].map((row, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-bone-50 dark:bg-earth-900/40 border border-line">
                          <div className="w-10 h-10 rounded-full bg-bone-300 dark:bg-earth-700 text-earth-700 grid place-items-center opacity-50">
                            ·
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-earth-900 dark:text-bone-50">{row.l}</div>
                            <div className="text-xs text-ink-soft">{row.s}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={handleSubmit(onSubmit)}
                      disabled={isUploading || isTxLoading}
                      className="w-full py-8 rounded-2xl bg-verdant-600 hover:bg-verdant-700 text-white font-bold text-lg shadow-xl shadow-verdant-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isUploading || isTxLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {t("publishing")}
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 fill-current" />
                          {t("sign_publish")}
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            )}

            <div className="flex justify-between items-center mt-8 pt-8 border-t border-line">
              <Button
                type="button"
                variant="ghost"
                disabled={step === 1 || isUploading || isTxLoading}
                onClick={() => setStep(Math.max(1, step - 1) as StepNumber)}
                className="gap-2 text-ink-soft"
              >
                <ArrowRight className="w-4 h-4 rotate-180" /> {t("back")}
              </Button>

              {step < 4 && (
                <Button
                  type="button"
                  variant="default"
                  onClick={() => setStep(Math.min(4, step + 1) as StepNumber)}
                  className="gap-2 bg-earth-900 text-bone-50 px-8 hover:bg-earth-800"
                >
                  {t("continue")} <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="hidden lg:block">
        <LivePreview control={control} totalGoal={totalGoal} />
      </div>
    </div>
  );
}

export default function CreateProjectForm() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 animate-pulse opacity-50">
        <div className="flex flex-col gap-6">
          <div className="h-20 bg-bone-200 dark:bg-earth-800 rounded-2xl" />
          <div className="h-[600px] bg-bone-200 dark:bg-earth-800 rounded-[32px]" />
        </div>
        <div className="h-[400px] bg-bone-200 dark:bg-earth-800 rounded-[32px]" />
      </div>
    );
  }

  return <CreateProjectFormInner />;
}

import { useEffect, useRef, useState } from "react";
import type { ResumeVariant } from "../data/resume-variants";

const variants = [
  { id: "corporate", label: "With photo", description: "Includes your profile photo" },
  { id: "software-farm", label: "Without photo", description: "Resume without a profile photo" },
] as const;

type ResumeDataResponse = {
  data?: string;
  error?: string;
};

export default function ResumeDownloadButton({ onVariantChange }: {
  onVariantChange?: (variant: ResumeVariant) => void;
}) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstOptionRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    firstOptionRef.current?.focus();
    function handlePointer(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  async function downloadResume(variant: (typeof variants)[number]) {
    if (downloading) return;
    onVariantChange?.(variant.id);
    setOpen(false);
    setDownloading(true);
    setError("");

    try {
      const response = await fetch(`/api/resume-data?variant=${variant.id}`);
      const payload = (await response.json()) as ResumeDataResponse;

      if (!response.ok || !payload.data) {
        throw new Error(payload.error || "Unable to download the resume.");
      }

      const binary = window.atob(payload.data);
      const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
      const fileUrl = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
      const link = document.createElement("a");

      link.href = fileUrl;
      link.download = "Resume-Raffiul Islam.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : "Unable to download the resume.",
      );
    } finally {
      setDownloading(false);
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative text-right"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        disabled={downloading}
        aria-busy={downloading}
        aria-expanded={open}
        aria-controls="resume-download-options"
        className="cursor-pointer rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-70"
      >
        {downloading ? "Downloading…" : "Download PDF"}
        <span aria-hidden="true" className="ml-2">▾</span>
      </button>
      {open ? (
        <div id="resume-download-options" aria-label="Resume download options" className="absolute right-0 top-full z-30 mt-2 w-60 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white p-1.5 text-left shadow-xl dark:border-white/10 dark:bg-slate-900">
          {variants.map((variant, index) => (
            <button
              key={variant.id}
              ref={index === 0 ? firstOptionRef : undefined}
              type="button"
              onClick={() => downloadResume(variant)}
              className="block w-full cursor-pointer rounded-lg px-4 py-3 text-left transition hover:bg-indigo-50 focus-visible:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-indigo-500 dark:hover:bg-white/10 dark:focus-visible:bg-white/10"
            >
              <span className="block text-sm font-bold text-slate-900 dark:text-white">{variant.label}</span>
              <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{variant.description}</span>
            </button>
          ))}
        </div>
      ) : null}
      {error ? <p role="alert" className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

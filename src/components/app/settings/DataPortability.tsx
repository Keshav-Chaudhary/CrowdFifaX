"use client";

import { Database, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui";

interface DataPortabilityProps {
  onExport: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DataPortability({ onExport, onFileChange }: DataPortabilityProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-5 sm:p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)] flex flex-col h-fit">
      <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-[var(--accent-subtle)] blur-[40px] opacity-0 transition-all group-hover:scale-150 group-hover:opacity-100" />
      <div className="relative z-10">
        <div className="mb-6 flex items-center gap-3 border-b border-[var(--border-faint)] pb-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border-strong)] transition-colors group-hover:border-[var(--accent)]">
            <Database aria-hidden="true" className="size-5 text-[var(--accent)] group-hover:scale-110 transition-transform" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-fg">Data Portability</h2>
            <p className="text-sm text-fg-muted">Backup your ledger or upload an existing backup.</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Button variant="outline" className="w-full justify-center whitespace-nowrap rounded-xl h-10 border-[var(--border-strong)] hover:border-[var(--accent)] hover:text-[var(--accent)]" onClick={onExport}>
            <Download className="size-4 mr-2" />
            Export JSON
          </Button>
          <label className="group relative overflow-hidden rounded-xl border border-[var(--border-faint)] bg-surface-2 p-6 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)] flex flex-col h-fit cursor-pointer">
            <span className="mb-2 flex items-center gap-2 font-semibold text-fg">
              <Upload className="size-4 text-[var(--accent)]" />
              Import Data
            </span>
            <span className="text-sm text-fg-muted">
              Restore activities from a JSON file.
            </span>
            <span className="mt-4 inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-xl border border-[var(--border-strong)] bg-transparent px-4 text-sm font-semibold text-fg transition-all hover:border-[var(--fg-subtle)] hover:bg-surface-2">
              Choose File
            </span>
            <input
              type="file"
              accept=".json"
              onChange={onFileChange}
              className="sr-only"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

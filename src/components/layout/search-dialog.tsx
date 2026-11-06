"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  FolderKanban,
  Route,
  Search,
  SquareTerminal,
  type LucideIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { SearchItem } from "@/lib/types";

const typeConfig: Record<SearchItem["type"], { label: string; icon: LucideIcon }> = {
  module: { label: "Module", icon: Route },
  lecon: { label: "Leçon", icon: BookOpen },
  mission: { label: "Mission", icon: SquareTerminal },
  projet: { label: "Projet", icon: FolderKanban },
};

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: SearchItem[];
}

export function SearchDialog({ open, onOpenChange, items }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return items.filter((item) => item.type !== "lecon").slice(0, 7);
    }
    return items
      .filter(
        (item) =>
          item.title.toLowerCase().includes(normalized) ||
          item.subtitle.toLowerCase().includes(normalized),
      )
      .slice(0, 10);
  }, [items, query]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, [open]);

  function handleOpenChange(next: boolean) {
    if (!next) {
      setQuery("");
      setActiveIndex(0);
    }
    onOpenChange(next);
  }

  function navigate(item: SearchItem) {
    handleOpenChange(false);
    router.push(item.href);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (results.length === 0 ? 0 : (index + 1) % results.length));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) =>
        results.length === 0 ? 0 : (index - 1 + results.length) % results.length,
      );
    }
    if (event.key === "Enter") {
      const item = results[activeIndex];
      if (item) {
        event.preventDefault();
        navigate(item);
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="top-[12%] max-w-xl translate-y-0 p-0">
        <DialogTitle className="sr-only">Rechercher dans DEVFORGE</DialogTitle>
        <DialogDescription className="sr-only">
          Recherchez un module, une leçon, une mission ou un projet.
        </DialogDescription>
        <div className="flex items-center gap-2 border-b border-line px-4">
          <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher un module, une leçon, une mission…"
            aria-label="Rechercher"
            className="h-14 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="df-scroll max-h-[min(52vh,420px)] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted">
              Aucun résultat pour « {query.trim()} ».
            </p>
          ) : (
            <ul className="space-y-0.5">
              {results.map((item, index) => {
                const config = typeConfig[item.type];
                const Icon = config.icon;
                return (
                  <li key={`${item.type}-${item.href}-${item.title}`}>
                    <button
                      type="button"
                      onClick={() => navigate(item)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                        index === activeIndex ? "bg-accent-soft" : "hover:bg-tint",
                      )}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-muted">
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium text-ink">
                          {item.title}
                        </span>
                        <span className="block truncate text-[11px] text-muted">
                          {item.subtitle}
                        </span>
                      </span>
                      <span className="df-eyebrow shrink-0">{config.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-[11px] text-muted">
          <span className="flex items-center gap-2">
            <kbd className="rounded border border-line bg-tint px-1.5 py-0.5 font-mono text-[10px]">
              ↑↓
            </kbd>
            naviguer
            <kbd className="rounded border border-line bg-tint px-1.5 py-0.5 font-mono text-[10px]">
              ↵
            </kbd>
            ouvrir
          </span>
          <span>{items.length} ressources indexées</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

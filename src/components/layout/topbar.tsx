"use client";

import Link from "next/link";
import { Flame, Menu, Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/types";

interface TopbarProps {
  profile: Profile;
  streak: number;
  demoMode: boolean;
  onOpenSearch: () => void;
  onOpenMobileNav: () => void;
}

export function Topbar({
  profile,
  streak,
  demoMode,
  onOpenSearch,
  onOpenMobileNav,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-canvas/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onOpenMobileNav}
        className="lg:hidden"
        aria-label="Ouvrir la navigation"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <button
        type="button"
        onClick={onOpenSearch}
        className="group flex h-9 w-full max-w-xs items-center gap-2 rounded-lg border border-line bg-surface px-3 text-left text-[13px] text-muted shadow-[0_1px_2px_rgba(23,32,51,0.02)] transition-colors hover:border-line-strong sm:max-w-sm"
      >
        <Search className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">Recherche rapide…</span>
        <kbd className="hidden shrink-0 rounded border border-line bg-tint px-1.5 py-0.5 font-mono text-[10px] text-muted sm:inline">
          Ctrl K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {demoMode ? (
          <span
            className="hidden items-center gap-1.5 rounded-full border border-amber-600/20 bg-warning-soft px-2.5 py-1 text-[11px] font-semibold text-warning sm:inline-flex"
            title="Mode démonstration local : les données sont enregistrées dans data/demo-db.json"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-warning" aria-hidden="true" />
            Mode démo
          </span>
        ) : null}

        <Link
          href="/profil"
          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/15 bg-success-soft px-2.5 py-1 text-[11px] font-semibold text-success transition-colors hover:bg-emerald-100"
          title="Jours d'activité consécutifs"
        >
          <Flame className="h-3.5 w-3.5" aria-hidden="true" />
          {streak} {streak > 1 ? "jours" : "jour"} d&apos;affilée
        </Link>

        <Link
          href="/profil"
          className="rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-accent/40"
          aria-label="Ouvrir mon profil"
        >
          <Avatar name={profile.fullName} src={profile.avatarUrl} size="md" />
        </Link>
      </div>
    </header>
  );
}

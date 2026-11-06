"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Settings } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/types";
import { signOutAction } from "@/lib/actions/session";
import { isNavActive, portfolioNav, workspaceNav } from "./nav";

interface SidebarProps {
  profile: Profile;
  onNavigate?: () => void;
}

export function Sidebar({ profile, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="flex h-16 shrink-0 items-center px-5">
        <Logo onClick={onNavigate} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pb-4">
        <p className="df-label px-2 pb-2 pt-4">Workspace</p>
        <nav aria-label="Navigation principale" className="space-y-0.5">
          {workspaceNav.map((item) => {
            const active = isNavActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-accent text-white shadow-[0_1px_2px_rgba(23,32,51,0.12)]"
                    : "text-[#55607a] hover:bg-tint hover:text-ink",
                )}
              >
                <Icon
                  className={cn(
                    "h-[17px] w-[17px] shrink-0",
                    active ? "text-white" : "text-muted group-hover:text-ink",
                  )}
                  aria-hidden="true"
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="my-3 df-divider" />

        <Link
          href={portfolioNav.href}
          onClick={onNavigate}
          aria-current={isNavActive(pathname, portfolioNav.href) ? "page" : undefined}
          className={cn(
            "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
            isNavActive(pathname, portfolioNav.href)
              ? "bg-accent text-white"
              : "text-[#55607a] hover:bg-tint hover:text-ink",
          )}
        >
          <portfolioNav.icon
            className={cn(
              "h-[17px] w-[17px] shrink-0",
              isNavActive(pathname, portfolioNav.href)
                ? "text-white"
                : "text-muted group-hover:text-ink",
            )}
            aria-hidden="true"
          />
          {portfolioNav.label}
        </Link>

        <div className="mt-auto pt-6">
          <div className="rounded-xl border border-line bg-canvas/60 p-2.5">
            <Link
              href="/profil"
              onClick={onNavigate}
              className="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-surface"
            >
              <Avatar name={profile.fullName} src={profile.avatarUrl} size="lg" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] font-semibold text-ink">
                  {profile.fullName}
                </span>
                <span className="block truncate text-[11px] text-muted">
                  Niveau {profile.level} · Ingénierie
                </span>
              </span>
            </Link>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              <Button asChild variant="ghost" size="sm" className="justify-start px-2 text-[12px]">
                <Link href="/parametres" onClick={onNavigate}>
                  <Settings aria-hidden="true" />
                  Paramètres
                </Link>
              </Button>
              <form action={signOutAction}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start px-2 text-[12px] text-muted hover:text-danger"
                >
                  <LogOut aria-hidden="true" />
                  Déconnexion
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

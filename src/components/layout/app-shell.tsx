"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Profile, SearchItem } from "@/lib/types";
import { SearchDialog } from "./search-dialog";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

interface AppShellProps {
  profile: Profile;
  streak: number;
  searchItems: SearchItem[];
  localMode: boolean;
  children: ReactNode;
}

export function AppShell({
  profile,
  streak,
  searchItems,
  localMode,
  children,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="min-h-dvh bg-canvas">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-line lg:block">
        <Sidebar profile={profile} />
      </aside>

      <div className="lg:pl-[260px]">
        <Topbar
          profile={profile}
          streak={streak}
          localMode={localMode}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenMobileNav={() => setMobileOpen(true)}
        />
        <main className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>

      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent className="left-0 top-0 h-dvh w-[280px] max-w-[86vw] translate-x-0 translate-y-0 rounded-none border-y-0 border-l-0 p-0">
          <DialogTitle className="sr-only">Navigation</DialogTitle>
          <Sidebar profile={profile} onNavigate={() => setMobileOpen(false)} />
        </DialogContent>
      </Dialog>

      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        items={searchItems}
      />
    </div>
  );
}

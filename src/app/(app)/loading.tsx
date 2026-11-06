import { Card } from "@/components/ui/card";

export default function AppLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <div className="space-y-3 border-b border-line pb-6">
        <div className="h-2.5 w-44 animate-pulse rounded bg-line" />
        <div className="h-8 w-2/3 max-w-md animate-pulse rounded bg-line" />
        <div className="h-3 w-1/2 max-w-sm animate-pulse rounded bg-line" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card className="h-72 skeleton-shimmer" />
        <Card className="h-72 skeleton-shimmer" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="h-32 skeleton-shimmer" />
        <Card className="h-32 skeleton-shimmer" />
        <Card className="h-32 skeleton-shimmer" />
      </div>
      <span className="sr-only">Chargement de la page…</span>
    </div>
  );
}

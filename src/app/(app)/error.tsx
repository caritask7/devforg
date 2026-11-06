"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card className="mx-auto my-12 max-w-lg p-8 text-center">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-red-600/20 bg-danger-soft text-danger">
        <AlertTriangle className="h-5 w-5" aria-hidden="true" />
      </span>
      <h1 className="mt-4 text-[20px] font-semibold tracking-tight text-ink">
        Une erreur est survenue
      </h1>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">
        Le chargement de cette page a échoué. Vos données enregistrées ne sont pas
        affectées. Vous pouvez réessayer.
      </p>
      {error.digest ? (
        <p className="mt-3 font-mono text-[10px] text-muted">Référence : {error.digest}</p>
      ) : null}
      <Button type="button" onClick={reset} className="mt-5">
        <RotateCcw aria-hidden="true" />
        Réessayer
      </Button>
    </Card>
  );
}

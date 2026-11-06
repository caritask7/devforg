"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintPortfolioButton() {
  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={() => window.print()}
    >
      <Printer aria-hidden="true" />
      Imprimer / PDF
    </Button>
  );
}

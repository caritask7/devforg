import type { Metadata } from "next";
import { isDemoMode } from "@/lib/config";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = { title: "Réinitialiser le mot de passe" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <ResetPasswordForm token={token ?? ""} demoMode={isDemoMode} />;
}

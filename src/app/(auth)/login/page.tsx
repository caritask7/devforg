import type { Metadata } from "next";
import { Alert } from "@/components/ui/alert";
import { DEMO_EMAIL, DEMO_PASSWORD, isDemoMode } from "@/lib/config";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ motdepasse?: string }>;
}) {
  const { motdepasse } = await searchParams;

  return (
    <div className="space-y-5">
      {motdepasse === "reinitialise" ? (
        <Alert tone="success" title="Mot de passe mis à jour">
          Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
        </Alert>
      ) : null}
      <LoginForm
        demo={
          isDemoMode
            ? { email: DEMO_EMAIL, password: DEMO_PASSWORD }
            : null
        }
      />
    </div>
  );
}

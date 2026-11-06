"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { isLocalMode, siteUrl } from "@/lib/config";
import { repository } from "@/lib/data";
import { readDatabase, updateDatabase } from "@/lib/local/database";
import { hashPassword, verifyPassword } from "@/lib/local/password";
import { createLocalResetToken, resetLocalPassword } from "@/lib/local/reset";
import { createLocalSession, getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  fieldErrorsFromZod,
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  type FormState,
} from "@/lib/validation";

function formValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") values[key] = value;
  }
  return values;
}

export async function signInAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = signInSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return {
      error: "Vérifiez les champs du formulaire.",
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  const { email, password } = parsed.data;

  if (isLocalMode) {
    const db = await readDatabase();
    const user = db.users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase(),
    );
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return { error: "E-mail ou mot de passe incorrect." };
    }
    await createLocalSession(user.id);
    redirect("/dashboard");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "E-mail ou mot de passe incorrect." };
  }
  redirect("/dashboard");
}

export async function signUpAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = signUpSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return {
      error: "Vérifiez les champs du formulaire.",
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  const { fullName, email, password } = parsed.data;

  if (isLocalMode) {
    const db = await readDatabase();
    const existing = db.users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase(),
    );
    if (existing) {
      return { error: "Un compte existe déjà avec cette adresse e-mail." };
    }

    const userId = randomUUID();
    await updateDatabase((current) => {
      current.users.push({
        id: userId,
        email,
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString(),
      });
    });

    const profile = await repository.ensureProfile({ id: userId, email });
    await repository.updateProfile(userId, {
      fullName,
      headline: "Développeur en formation",
      bio: "",
      githubUrl: "",
      linkedinUrl: "",
      websiteUrl: "",
      avatarUrl: "",
      dailyGoalMinutes: profile.dailyGoalMinutes,
    });

    await createLocalSession(userId);
    redirect("/dashboard");
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=/dashboard`,
      data: { full_name: fullName },
    },
  });

  if (error) {
    if (/already|registered|exists/i.test(error.message)) {
      return { error: "Un compte existe déjà avec cette adresse e-mail." };
    }
    return { error: "La création du compte a échoué. Réessayez dans un instant." };
  }

  if (data.session) {
    redirect("/dashboard");
  }

  return {
    success:
      "Compte créé. Vérifiez votre boîte e-mail pour confirmer votre adresse, puis connectez-vous.",
  };
}

export async function requestPasswordResetAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = forgotPasswordSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return {
      error: "Vérifiez l'adresse e-mail.",
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  if (isLocalMode) {
    const token = await createLocalResetToken(parsed.data.email);
    return {
      success:
        "Si un compte correspond à cette adresse, un lien de réinitialisation a été généré.",
      resetUrl: token ? `/reinitialiser-mot-de-passe?token=${token}` : undefined,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/auth/callback?next=/reinitialiser-mot-de-passe`,
  });

  if (error) {
    return { error: "Impossible d'envoyer l'e-mail de réinitialisation pour le moment." };
  }

  return {
    success:
      "Si un compte correspond à cette adresse, un e-mail de réinitialisation vient d'être envoyé.",
  };
}

export async function resetPasswordAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = resetPasswordSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return {
      error: "Vérifiez les champs du formulaire.",
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  if (isLocalMode) {
    const token = parsed.data.token ?? "";
    const ok = await resetLocalPassword(token, parsed.data.password);
    if (!ok) {
      return { error: "Ce lien de réinitialisation est invalide ou expiré." };
    }
    redirect("/login?motdepasse=reinitialise");
  }

  const user = await getCurrentUser();
  if (!user) {
    return {
      error: "Votre session de réinitialisation a expiré. Recommencez la procédure.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return { error: "La mise à jour du mot de passe a échoué. Réessayez." };
  }
  redirect("/dashboard?motdepasse=modifie");
}

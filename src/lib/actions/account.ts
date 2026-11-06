"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { repository } from "@/lib/data";
import { readDatabase, updateDatabase } from "@/lib/local/database";
import { hashPassword, verifyPassword } from "@/lib/local/password";
import { isLocalMode } from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  changePasswordSchema,
  fieldErrorsFromZod,
  profileSchema,
  type FormState,
} from "@/lib/validation";

function formValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") values[key] = value;
  }
  return values;
}

export async function updateProfileAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = profileSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return {
      error: "Vérifiez les champs du formulaire.",
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  const user = await getCurrentUser();
  if (!user) return { error: "Session expirée. Reconnectez-vous." };

  try {
    await repository.updateProfile(user.id, parsed.data);
  } catch {
    return { error: "La mise à jour du profil a échoué." };
  }

  revalidatePath("/parametres");
  revalidatePath("/profil");
  revalidatePath("/portfolio");
  revalidatePath("/dashboard");
  return { success: "Profil mis à jour." };
}

export async function changePasswordAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = changePasswordSchema.safeParse(formValues(formData));
  if (!parsed.success) {
    return {
      error: "Vérifiez les champs du formulaire.",
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  const user = await getCurrentUser();
  if (!user) return { error: "Session expirée. Reconnectez-vous." };

  if (isLocalMode) {
    const db = await readDatabase();
    const localUser = db.users.find((item) => item.id === user.id);
    if (!localUser || !verifyPassword(parsed.data.currentPassword, localUser.passwordHash)) {
      return { error: "Le mot de passe actuel est incorrect." };
    }
    const passwordHash = hashPassword(parsed.data.password);
    await updateDatabase((current) => {
      const record = current.users.find((item) => item.id === user.id);
      if (record) record.passwordHash = passwordHash;
    });
    revalidatePath("/parametres");
    return { success: "Mot de passe mis à jour." };
  }

  const supabase = await createSupabaseServerClient();
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: parsed.data.currentPassword,
  });
  if (authError) {
    return { error: "Le mot de passe actuel est incorrect." };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return { error: "La mise à jour du mot de passe a échoué. Réessayez." };
  }
  return { success: "Mot de passe mis à jour." };
}

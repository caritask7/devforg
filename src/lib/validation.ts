import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "L'adresse e-mail est requise.")
  .max(254, "Adresse e-mail trop longue.")
  .email("Adresse e-mail invalide.");

export const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
  .max(128, "Le mot de passe ne peut pas dépasser 128 caractères.");

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Le mot de passe est requis."),
});

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Le nom doit contenir au moins 2 caractères.")
      .max(80, "Le nom est trop long."),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirmez votre mot de passe."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().optional(),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirmez votre mot de passe."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Saisissez votre mot de passe actuel."),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirmez le nouveau mot de passe."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(80, "Le nom est trop long."),
  headline: z.string().trim().max(120, "Le titre est trop long.").default(""),
  bio: z.string().trim().max(2000, "La bio est trop longue.").default(""),
  githubUrl: z
    .string()
    .trim()
    .max(300)
    .refine((value) => value === "" || /^https?:\/\//.test(value), {
      message: "L'URL doit commencer par http:// ou https://",
    }),
  linkedinUrl: z
    .string()
    .trim()
    .max(300)
    .refine((value) => value === "" || /^https?:\/\//.test(value), {
      message: "L'URL doit commencer par http:// ou https://",
    }),
  websiteUrl: z
    .string()
    .trim()
    .max(300)
    .refine((value) => value === "" || /^https?:\/\//.test(value), {
      message: "L'URL doit commencer par http:// ou https://",
    }),
  avatarUrl: z
    .string()
    .trim()
    .max(500)
    .refine((value) => value === "" || /^https?:\/\//.test(value), {
      message: "L'URL doit commencer par http:// ou https://",
    }),
  dailyGoalMinutes: z.coerce
    .number()
    .int()
    .min(10, "L'objectif doit être d'au moins 10 minutes.")
    .max(480, "L'objectif ne peut pas dépasser 480 minutes."),
});

export const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Le titre doit contenir au moins 3 caractères.")
    .max(120, "Le titre est trop long."),
  summary: z.string().trim().max(300, "Le résumé est trop long.").default(""),
  description: z.string().trim().max(5000, "La description est trop longue.").default(""),
  status: z.enum(["idea", "todo", "in_progress", "done"]),
  technologies: z
    .array(z.string().trim().min(1).max(40))
    .max(20, "20 technologies maximum.")
    .default([]),
  githubUrl: z
    .string()
    .trim()
    .max(300)
    .refine((value) => value === "" || /^https?:\/\//.test(value), {
      message: "Le lien GitHub doit commencer par http:// ou https://",
    }),
  demoUrl: z
    .string()
    .trim()
    .max(300)
    .refine((value) => value === "" || /^https?:\/\//.test(value), {
      message: "Le lien du projet doit commencer par http:// ou https://",
    }),
  results: z.string().trim().max(2000, "Les résultats sont trop longs.").default(""),
  milestones: z
    .array(
      z.object({
        title: z
          .string()
          .trim()
          .min(2, "Le titre du jalon est trop court.")
          .max(120, "Le titre du jalon est trop long."),
        description: z.string().trim().max(400).default(""),
      }),
    )
    .max(20, "20 jalons maximum.")
    .default([]),
});

export const missionUpdateSchema = z.object({
  status: z.enum(["todo", "in_progress", "submitted", "completed"]).optional(),
  notes: z.string().max(8000, "Les notes sont trop longues.").optional(),
  submissionUrl: z
    .string()
    .trim()
    .max(500)
    .refine((value) => value === "" || /^https?:\/\//.test(value), {
      message: "Le lien doit commencer par http:// ou https://",
    })
    .optional(),
  score: z.coerce.number().int().min(0).max(100).nullable().optional(),
});

export const missionSubmissionSchema = z.object({
  missionSlug: z.string().min(1),
  notes: z.string().max(8000, "Les notes sont trop longues.").default(""),
  submissionUrl: z
    .string()
    .trim()
    .max(500, "Le lien est trop long.")
    .refine((value) => value === "" || /^https?:\/\//.test(value), {
      message: "Le lien doit commencer par http:// ou https://",
    })
    .default(""),
});

export type FormState = {
  error?: string;
  success?: string;
  resetUrl?: string;
  fieldErrors?: Record<string, string[]>;
};

export function fieldErrorsFromZod(error: z.ZodError): Record<string, string[]> {
  const flattened = error.flatten();
  return flattened.fieldErrors as Record<string, string[]>;
}

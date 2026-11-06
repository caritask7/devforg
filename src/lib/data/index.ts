import { isDemoMode } from "@/lib/config";
import { demoRepository } from "./demo-repository";
import type { DataRepository } from "./repository";
import { supabaseRepository } from "./supabase-repository";

export const repository: DataRepository = isDemoMode
  ? demoRepository
  : supabaseRepository;

export type { DataRepository, MissionProgressPatch, ProfileInput } from "./repository";

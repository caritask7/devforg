import { isLocalMode } from "@/lib/config";
import { localRepository } from "./local-repository";
import type { DataRepository } from "./repository";
import { supabaseRepository } from "./supabase-repository";

export const repository: DataRepository = isLocalMode
  ? localRepository
  : supabaseRepository;

export type { DataRepository, MissionProgressPatch, ProfileInput } from "./repository";

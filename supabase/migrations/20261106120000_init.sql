-- =============================================================================
-- DEVFORGE — Schéma initial (PostgreSQL / Supabase)
-- -----------------------------------------------------------------------------
-- À exécuter une seule fois dans le SQL Editor de votre projet Supabase
-- (ou via `supabase db push` si vous utilisez le CLI Supabase).
--
-- Contient :
--   1. les tables de contenu pédagogique (lecture seule pour les apprenants) ;
--   2. les tables de données utilisateur (profil, progression, projets) ;
--   3. les politiques Row Level Security (RLS) ;
--   4. les triggers de profil et de mise à jour automatique.
--
-- Ce fichier est idempotent : il peut être ré-exécuté sans erreur.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Contenu pédagogique (écriture réservée au service role / seed)
-- -----------------------------------------------------------------------------

create table if not exists public.skill_categories (
  slug        text primary key,
  position    integer not null,
  title       text not null,
  description text not null default ''
);

create table if not exists public.skills (
  slug         text primary key,
  category_slug text not null references public.skill_categories (slug) on delete cascade,
  position     integer not null,
  title        text not null,
  description  text not null default '',
  technique    text not null default ''
);

create table if not exists public.learning_phases (
  slug           text primary key,
  position       integer not null,
  title          text not null,
  tagline        text not null default '',
  description    text not null default '',
  status         text not null default 'available'
                 check (status in ('available', 'coming_soon')),
  estimated_hours integer not null default 0
);

create table if not exists public.modules (
  slug              text primary key,
  phase_slug        text not null references public.learning_phases (slug) on delete cascade,
  position          integer not null,
  title             text not null,
  description       text not null default '',
  level             text not null default 'debutant'
                    check (level in ('debutant', 'intermediaire', 'avance')),
  estimated_minutes integer not null default 0,
  status            text not null default 'available'
                    check (status in ('available', 'coming_soon')),
  objectives        text[] not null default '{}'
);

create table if not exists public.lessons (
  slug              text primary key,
  module_slug       text not null references public.modules (slug) on delete cascade,
  position          integer not null,
  title             text not null,
  summary           text not null default '',
  content_md        text not null default '',
  estimated_minutes integer not null default 0,
  code_language     text not null default 'python',
  key_points        text[] not null default '{}'
);

create table if not exists public.missions (
  slug              text primary key,
  title             text not null,
  description       text not null default '',
  category          text not null default 'exercice'
                    check (category in ('exercice', 'defi', 'evaluation')),
  difficulty        text not null default 'debutant'
                    check (difficulty in ('debutant', 'intermediaire', 'avance')),
  estimated_minutes integer not null default 0,
  context           text not null default '',
  objective         text not null default '',
  instructions_md   text not null default '',
  requirements      text[] not null default '{}',
  success_criteria  text[] not null default '{}',
  module_slug       text references public.modules (slug) on delete set null,
  tags              text[] not null default '{}'
);

create table if not exists public.mission_skills (
  mission_slug text not null references public.missions (slug) on delete cascade,
  skill_slug   text not null references public.skills (slug) on delete cascade,
  primary key (mission_slug, skill_slug)
);

-- -----------------------------------------------------------------------------
-- 2. Données utilisateur (une ligne par compte apprenant)
-- -----------------------------------------------------------------------------

create table if not exists public.profiles (
  id                 uuid primary key references auth.users (id) on delete cascade,
  email              text not null default '',
  full_name          text not null default 'Apprenant DEVFORGE',
  headline           text not null default '',
  bio                text not null default '',
  github_url         text not null default '',
  linkedin_url       text not null default '',
  website_url        text not null default '',
  avatar_url         text not null default '',
  level              integer not null default 1,
  daily_goal_minutes integer not null default 45,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  user_id        uuid not null references auth.users (id) on delete cascade,
  lesson_slug    text not null references public.lessons (slug) on delete cascade,
  status         text not null default 'not_started'
                 check (status in ('not_started', 'in_progress', 'completed')),
  started_at     timestamptz,
  completed_at   timestamptz,
  last_viewed_at timestamptz,
  primary key (user_id, lesson_slug)
);

create table if not exists public.mission_progress (
  user_id        uuid not null references auth.users (id) on delete cascade,
  mission_slug   text not null references public.missions (slug) on delete cascade,
  status         text not null default 'todo'
                 check (status in ('todo', 'in_progress', 'submitted', 'completed')),
  notes          text not null default '',
  submission_url text not null default '',
  score          integer check (score between 0 and 100),
  started_at     timestamptz,
  submitted_at   timestamptz,
  completed_at   timestamptz,
  primary key (user_id, mission_slug)
);

create table if not exists public.user_skill_progress (
  user_id      uuid not null references auth.users (id) on delete cascade,
  skill_slug   text not null references public.skills (slug) on delete cascade,
  level        text not null default 'not_started'
               check (level in ('not_started', 'beginner', 'intermediate', 'advanced')),
  progress     integer not null default 0 check (progress between 0 and 100),
  validated_by text not null default '',
  updated_at   timestamptz not null default now(),
  primary key (user_id, skill_slug)
);

create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  title        text not null,
  slug         text not null,
  summary      text not null default '',
  description  text not null default '',
  status       text not null default 'idea'
               check (status in ('idea', 'todo', 'in_progress', 'done')),
  technologies text[] not null default '{}',
  github_url   text not null default '',
  demo_url     text not null default '',
  results      text not null default '',
  started_at   timestamptz,
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.project_milestones (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.projects (id) on delete cascade,
  position     integer not null,
  title        text not null,
  description  text not null default '',
  status       text not null default 'todo'
               check (status in ('todo', 'in_progress', 'done')),
  completed_at timestamptz,
  unique (project_id, position)
);

-- -----------------------------------------------------------------------------
-- 3. Index (performances des lectures fréquentes)
-- -----------------------------------------------------------------------------

create index if not exists idx_modules_phase           on public.modules (phase_slug, position);
create index if not exists idx_lessons_module          on public.lessons (module_slug, position);
create index if not exists idx_skills_category         on public.skills (category_slug, position);
create index if not exists idx_missions_module         on public.missions (module_slug);
create index if not exists idx_mission_skills_skill    on public.mission_skills (skill_slug);
create index if not exists idx_lesson_progress_user    on public.lesson_progress (user_id);
create index if not exists idx_mission_progress_user   on public.mission_progress (user_id);
create index if not exists idx_skill_progress_user     on public.user_skill_progress (user_id);
create index if not exists idx_projects_user           on public.projects (user_id, updated_at desc);
create index if not exists idx_project_milestones      on public.project_milestones (project_id, position);

-- -----------------------------------------------------------------------------
-- 4. Triggers
-- -----------------------------------------------------------------------------

-- Mise à jour automatique de la colonne updated_at.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- Création automatique du profil à l'inscription (Supabase Auth).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      split_part(coalesce(new.email, ''), '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 5. Row Level Security
-- -----------------------------------------------------------------------------

alter table public.skill_categories     enable row level security;
alter table public.skills               enable row level security;
alter table public.learning_phases      enable row level security;
alter table public.modules              enable row level security;
alter table public.lessons              enable row level security;
alter table public.missions             enable row level security;
alter table public.mission_skills       enable row level security;
alter table public.profiles             enable row level security;
alter table public.lesson_progress      enable row level security;
alter table public.mission_progress     enable row level security;
alter table public.user_skill_progress  enable row level security;
alter table public.projects             enable row level security;
alter table public.project_milestones   enable row level security;

-- Contenu pédagogique : lecture pour les apprenants authentifiés.
-- Aucune policy d'écriture : seuls le service role (seed) modifient ces tables.
drop policy if exists content_read on public.skill_categories;
create policy content_read on public.skill_categories
  for select to authenticated using (true);

drop policy if exists content_read on public.skills;
create policy content_read on public.skills
  for select to authenticated using (true);

drop policy if exists content_read on public.learning_phases;
create policy content_read on public.learning_phases
  for select to authenticated using (true);

drop policy if exists content_read on public.modules;
create policy content_read on public.modules
  for select to authenticated using (true);

drop policy if exists content_read on public.lessons;
create policy content_read on public.lessons
  for select to authenticated using (true);

drop policy if exists content_read on public.missions;
create policy content_read on public.missions
  for select to authenticated using (true);

drop policy if exists content_read on public.mission_skills;
create policy content_read on public.mission_skills
  for select to authenticated using (true);

-- Profil : chaque apprenant ne voit et ne modifie que le sien.
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select to authenticated using (id = (select auth.uid()));

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
  for insert to authenticated with check (id = (select auth.uid()));

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Progression et projets : strictement propre à l'utilisateur connecté.
drop policy if exists lesson_progress_own on public.lesson_progress;
create policy lesson_progress_own on public.lesson_progress
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists mission_progress_own on public.mission_progress;
create policy mission_progress_own on public.mission_progress
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists user_skill_progress_own on public.user_skill_progress;
create policy user_skill_progress_own on public.user_skill_progress
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists projects_own on public.projects;
create policy projects_own on public.projects
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Jalons de projet : accessibles si et seulement si le projet appartient
-- à l'utilisateur connecté.
drop policy if exists project_milestones_own on public.project_milestones;
create policy project_milestones_own on public.project_milestones
  for all to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.user_id = (select auth.uid())
    )
  );

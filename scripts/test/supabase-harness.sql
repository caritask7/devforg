-- Harnais de test local : reproduit le minimum du schéma Supabase
-- (schema auth, table auth.users, fonction auth.uid()) afin de pouvoir
-- valider supabase/migrations/*_init.sql et supabase/seed.sql hors Supabase.

create schema if not exists auth;

create table if not exists auth.users (
  id uuid primary key default gen_random_uuid(),
  email text,
  raw_user_meta_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Remplace la fonction Supabase : renvoie l'id du "user connecté",
-- piloté par une variable de session dans les tests.
create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

-- Rôle fictif utilisé par les policies "to authenticated".
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated login;
  end if;
end $$;

grant usage on schema public to authenticated;
grant usage on schema auth to authenticated;
alter default privileges in schema public grant all on tables to authenticated;
alter default privileges in schema public grant all on sequences to authenticated;

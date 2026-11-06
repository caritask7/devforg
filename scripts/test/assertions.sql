-- Suite de tests d'intégration SQL (à exécuter après le harnais, la
-- migration et le seed). Échoue (ON_ERROR_STOP) si une assertion est fausse.

\set ON_ERROR_STOP on

-- ---------------------------------------------------------------------------
-- 1. Le seed a bien inséré le contenu attendu.
-- ---------------------------------------------------------------------------
do $$
begin
  if (select count(*) from public.skill_categories) <> 6 then
    raise exception 'skill_categories: % au lieu de 6', (select count(*) from public.skill_categories);
  end if;
  if (select count(*) from public.skills) <> 16 then
    raise exception 'skills: % au lieu de 16', (select count(*) from public.skills);
  end if;
  if (select count(*) from public.learning_phases) <> 4 then
    raise exception 'learning_phases: % au lieu de 4', (select count(*) from public.learning_phases);
  end if;
  if (select count(*) from public.modules) <> 27 then
    raise exception 'modules: % au lieu de 27', (select count(*) from public.modules);
  end if;
  if (select count(*) from public.lessons) <> 40 then
    raise exception 'lessons: % au lieu de 40', (select count(*) from public.lessons);
  end if;
  if (select count(*) from public.missions) <> 12 then
    raise exception 'missions: % au lieu de 12', (select count(*) from public.missions);
  end if;
  if (select count(*) from public.mission_skills) <> 22 then
    raise exception 'mission_skills: % au lieu de 22', (select count(*) from public.mission_skills);
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 2. Intégrité référentielle : aucune leçon orpheline, contenu cohérent.
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from public.lessons l left join public.modules m on m.slug = l.module_slug
    where m.slug is null
  ) then
    raise exception 'leçon orpheline detectee';
  end if;
  if exists (
    select 1 from public.modules mo left join public.learning_phases p on p.slug = mo.phase_slug
    where p.slug is null
  ) then
    raise exception 'module orphelin detecte';
  end if;
  if exists (
    select 1 from public.missions mi left join public.modules m on m.slug = mi.module_slug
    where mi.module_slug is not null and m.slug is null
  ) then
    raise exception 'mission avec module inconnu';
  end if;
  if exists (
    select 1 from public.mission_skills ms left join public.missions mi on mi.slug = ms.mission_slug
    where mi.slug is null
  ) then
    raise exception 'lien mission_skills orphelin';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 3. Le contenu pédagogique est en lecture seule pour un apprenant,
--    et chaque utilisateur ne voit que ses propres données.
-- ---------------------------------------------------------------------------
insert into auth.users (id, email, raw_user_meta_data)
values ('11111111-1111-1111-1111-111111111111', 'apprenant@example.fr',
        '{"full_name":"Apprenant Test"}'::jsonb);

insert into auth.users (id, email)
values ('22222222-2222-2222-2222-222222222222', 'autre@example.fr');

set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
set role authenticated;

do $$
begin
  if (select count(*) from public.lessons) <> 40 then
    raise exception 'un apprenant ne peut pas lire les lecons';
  end if;

  -- L'écriture sur le contenu doit être refusée (pas de policy d'insert).
  begin
    insert into public.lessons (slug, module_slug, position, title)
    values ('evil', 'python-fondamentaux', 99, 'Hacker');
    raise exception 'ECHEC: un apprenant a pu inserer dans le contenu';
  exception when insufficient_privilege then
    null; -- attendu
  end;
end $$;

-- L'utilisateur 1 ne voit aucune progression (l'utilisateur 2 en créera une).
do $$
begin
  if (select count(*) from public.lesson_progress) <> 0 then
    raise exception 'FUITES: un apprenant voit la progression d un autre (% lignes)',
      (select count(*) from public.lesson_progress);
  end if;
end $$;

-- L'utilisateur 1 crée sa propre progression : autorisé.
insert into public.lesson_progress (user_id, lesson_slug, status)
values ('11111111-1111-1111-1111-111111111111', 'python-environnement', 'completed');

-- Mise à jour de son propre profil : autorisée.
update public.profiles set full_name = 'Apprenant Renomme'
where id = '11111111-1111-1111-1111-111111111111';

do $$
begin
  if (select full_name from public.profiles where id = '11111111-1111-1111-1111-111111111111')
     <> 'Apprenant Renomme' then
    raise exception 'mise a jour du profil KO';
  end if;
end $$;

-- Tentative de modification du profil d'un autre utilisateur : refusée.
update public.profiles set full_name = 'Pirate'
where id = '22222222-2222-2222-2222-222222222222';

do $$
begin
  if (select full_name from public.profiles where id = '22222222-2222-2222-2222-222222222222')
     = 'Pirate' then
    raise exception 'FUITES: un apprenant a modifie le profil d un autre';
  end if;
end $$;

-- Projets : création personnelle OK, isolation OK.
insert into public.projects (user_id, title, slug, status)
values ('11111111-1111-1111-1111-111111111111', 'Mon projet', 'mon-projet-abc123', 'idea');

do $$
begin
  if (select count(*) from public.projects) <> 1 then
    raise exception 'projets: isolation KO (% lignes)', (select count(*) from public.projects);
  end if;
end $$;

-- Jalon rattaché au propre projet : autorisé.
insert into public.project_milestones (project_id, position, title)
select id, 1, 'Premier jalon' from public.projects limit 1;

reset request.jwt.claim.sub;
reset role;

-- L'utilisateur 2 ne voit ni le projet ni la progression de l'utilisateur 1.
set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
set role authenticated;

do $$
begin
  if (select count(*) from public.projects) <> 0 then
    raise exception 'FUITES: un apprenant voit les projets d un autre';
  end if;
  if (select count(*) from public.lesson_progress) <> 0 then
    raise exception 'FUITES: un apprenant voit la progression d un autre (v2)';
  end if;
end $$;

-- L'utilisateur 2 tente d'écrire dans le projet de l'utilisateur 1 : refusé.
do $$
begin
  begin
    insert into public.project_milestones (project_id, position, title)
    select id, 2, 'Jalon pirate' from public.projects limit 1;
    -- Aucun projet visible : aucune ligne insérée, c'est déjà l'isolation.
  exception when insufficient_privilege then
    null;
  end;
  if exists (
    select 1 from public.project_milestones where title = 'Jalon pirate'
  ) then
    raise exception 'FUITES: jalon insere dans le projet d un autre';
  end if;
end $$;

reset request.jwt.claim.sub;
reset role;

-- ---------------------------------------------------------------------------
-- 4. Le trigger handle_new_user crée automatiquement le profil.
-- ---------------------------------------------------------------------------
insert into auth.users (id, email, raw_user_meta_data)
values ('33333333-3333-3333-3333-333333333333', 'nouveau@example.fr',
        '{"full_name":"Nouveau Inscrit"}'::jsonb);

do $$
begin
  if not exists (
    select 1 from public.profiles
    where id = '33333333-3333-3333-3333-333333333333'
  ) then
    raise exception 'trigger handle_new_user: profil non cree';
  end if;
  if (select full_name from public.profiles
      where id = '33333333-3333-3333-3333-333333333333') <> 'Nouveau Inscrit' then
    raise exception 'trigger handle_new_user: full_name incorrect (%)',
      (select full_name from public.profiles
       where id = '33333333-3333-3333-3333-333333333333');
  end if;
end $$;

select 'TOUS LES TESTS SQL PASSENT' as resultat;

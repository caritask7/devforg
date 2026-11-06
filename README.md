# DEVFORGE

> La régularité forge l'expertise technique. Un problème résolu par jour.

DEVFORGE est une plateforme d'apprentissage du développement logiciel : un
parcours structuré en phases, des modules et des leçons, des missions
quotidiennes, un portfolio de projets et un suivi de compétences.

- **Frontend** : Next.js 16 (App Router, Server Actions, Turbopack), React 19,
  Tailwind CSS 4, Radix UI, Zod.
- **Backend** : Supabase (PostgreSQL, Supabase Auth, Row Level Security) —
  **ou** un mode local sans aucune dépendance externe.

---

## Démarrage rapide (mode local)

Aucune configuration requise : sans variables Supabase, l'application démarre
en **mode local**. Les données sont persistées dans `data/local-db.json`
(fichier ignoré par git, créé automatiquement).

```bash
npm install
npm run dev
```

Ouvrez <http://localhost:3000>, créez un compte et commencez à utiliser la
plateforme. La base locale est vide : chaque compte et chaque progression
proviennent d'une vraie utilisation.

Pour repartir de zéro, supprimez `data/local-db.json`.

> **Mode local vs Supabase** : le mode est choisi automatiquement dans
> `src/lib/config.ts`. Si `NEXT_PUBLIC_SUPABASE_URL` et
> `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont absentes → mode local (fichier JSON).
> Sinon → PostgreSQL + Supabase Auth. Aucun changement de code n'est nécessaire
> pour basculer de l'un à l'autre.

---

## Configuration Supabase (production)

### 1. Créer le projet

Créez un projet sur <https://supabase.com>, puis notez dans
**Project Settings > API** :

- `Project URL`
- `anon public` key
- `service_role` key (optionnelle, uniquement pour l'administration SQL)

### 2. Exécuter le schéma

Dans le **SQL Editor** de Supabase, exécutez le fichier :

```
supabase/migrations/20261106120000_init.sql
```

Ce script est **idempotent** (vérifie l'existence de chaque objet) et crée :

- 13 tables (`profiles`, `learning_phases`, `modules`, `lessons`,
  `lesson_progress`, `missions`, `mission_progress`, `skills`,
  `skill_categories`, `mission_skills`, `user_skill_progress`, `projects`,
  `project_milestones`) ;
- les index, les triggers (`set_updated_at`, `handle_new_user`) ;
- les politiques **Row Level Security** : le contenu pédagogique est en
  lecture seule pour les utilisateurs authentifiés, chaque utilisateur ne voit
  et ne modifie que ses propres données (isolation via `auth.uid()`).

### 3. Insérer le contenu pédagogique

Toujours dans le SQL Editor, exécutez :

```
supabase/seed.sql
```

Ce seed est **généré automatiquement** depuis le contenu TypeScript de
`src/lib/content/` et est également idempotent. Il insère :

| Table                  | Contenu                  |
| ---------------------- | ------------------------ |
| `skill_categories`     | 6 catégories             |
| `skills`               | 16 compétences           |
| `learning_phases`      | 4 phases du parcours     |
| `modules`              | 27 modules               |
| `lessons`              | 40 leçons                |
| `missions`             | 12 missions              |
| `mission_skills`       | 22 liens mission-compétence |

Si le contenu de `src/lib/content/` évolue, régénérez le seed :

```bash
npm run db:seed-sql
```

### 4. Configurer l'application

```bash
cp .env.example .env.local
```

Renseignez :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Puis relancez `npm run dev` : l'application bascule automatiquement en mode
Supabase.

### 5. Authentification

L'inscription, la connexion, la réinitialisation et la réinitialisation du mot
de passe utilisent Supabase Auth. Pensez à configurer dans
**Authentication > URL Configuration** l'URL de redirection autorisée
(`http://localhost:3000/auth/callback` en développement).

---

## Scripts npm

| Commande             | Description                                              |
| -------------------- | -------------------------------------------------------- |
| `npm run dev`        | Serveur de développement (Turbopack)                     |
| `npm run build`      | Build de production                                      |
| `npm run start`      | Démarre le build de production                           |
| `npm run lint`       | ESLint                                                   |
| `npm run typecheck`  | Vérification TypeScript (`tsc --noEmit`)                 |
| `npm run db:seed-sql`| Régénère `supabase/seed.sql` depuis `src/lib/content/`   |

---

## Tests du schéma SQL

Le dépôt contient un harnais permettant de valider la migration, le seed et
les politiques RLS **sans Supabase**, en reproduisant le schéma `auth`
(`auth.users`, `auth.uid()`) dans un PostgreSQL standard :

```bash
# Lancer un PostgreSQL jetable (nécessite Docker)
docker run -d --name devforge-sql-test -p 55432:5432 \
  -e POSTGRES_PASSWORD=test postgres:17-alpine

# Appliquer le harnais (schéma auth simulé), la migration, le seed,
# puis les assertions (intégrité + RLS)
docker cp scripts/test/supabase-harness.sql devforge-sql-test:/tmp/
docker cp supabase/migrations/20261106120000_init.sql devforge-sql-test:/tmp/
docker cp supabase/seed.sql devforge-sql-test:/tmp/
docker cp scripts/test/assertions.sql devforge-sql-test:/tmp/

docker exec devforge-sql-test psql -U postgres -p 55432 -d postgres \
  -v ON_ERROR_STOP=1 -f /tmp/supabase-harness.sql
docker exec devforge-sql-test psql -U postgres -p 55432 -d postgres \
  -v ON_ERROR_STOP=1 -f /tmp/20261106120000_init.sql
docker exec devforge-sql-test psql -U postgres -p 55432 -d postgres \
  -v ON_ERROR_STOP=1 -f /tmp/seed.sql
docker exec devforge-sql-test psql -U postgres -p 55432 -d postgres \
  -v ON_ERROR_STOP=1 -f /tmp/assertions.sql

# Nettoyage
docker rm -f devforge-sql-test
```

Dernier résultat : `TOUS LES TESTS SQL PASSENT`.

---

## Structure du projet

```
├── data/                        # Base locale (mode local, ignorée par git)
├── scripts/
│   ├── generate-seed.ts         # Générateur de supabase/seed.sql
│   └── test/                    # Harnais SQL + assertions RLS
├── supabase/
│   ├── migrations/              # Schéma complet (SQL Editor)
│   └── seed.sql                 # Contenu pédagogique (généré)
├── src/
│   ├── app/
│   │   ├── (app)/               # Pages authentifiées (dashboard, parcours,
│   │   │                        #   modules, leçons, missions, projets,
│   │   │                        #   compétences, portfolio, profil, paramètres)
│   │   ├── (auth)/              # login, register, mot de passe oublié
│   │   └── auth/callback/       # Callback Supabase Auth
│   ├── components/              # UI (ui/, layout/, lesson/, projects/, …)
│   └── lib/
│       ├── actions/             # Server Actions
│       ├── auth/                # Session et authentification
│       ├── content/             # Contenu pédagogique (TS) — source du seed
│       ├── data/                # Couche d'accès : local vs Supabase
│       ├── local/               # Base locale JSON (mode local)
│       └── supabase/            # Clients Supabase (serveur/navigateur)
└── stitch_devforge_ui_ux_design_system/  # Maquettes de conception
```

---

## Notes

- **Aucune donnée fictive** : le dépôt ne contient ni compte de démonstration
  ni progression simulée. Tout est créé par l'utilisation réelle.
- `.env.local` ne doit jamais être commité (déjà ignoré par `.gitignore`).
- `SUPABASE_SERVICE_ROLE_KEY` n'est pas nécessaire au fonctionnement de
  l'application ; elle sert uniquement aux opérations SQL d'administration et
  ne doit jamais atteindre le navigateur.

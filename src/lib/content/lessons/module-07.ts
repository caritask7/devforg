import type { Lesson } from "@/lib/types";

export const module07Lessons: Lesson[] = [
  {
    slug: "git-fondamentaux",
    moduleSlug: "git-github",
    position: 1,
    title: "Git : comprendre le modèle avant les commandes",
    summary:
      "Comprendre les trois espaces de Git et versionner un projet local proprement.",
    estimatedMinutes: 50,
    codeLanguage: "bash",
    keyPoints: [
      "Git enregistre des instantanés, pas des différences",
      "Trois zones : répertoire, index, historique",
      "Un commit doit être atomique",
    ],
    contentMd: `## Trois espaces

\`\`\`text
Répertoire de travail  →  Index (staging)  →  Dépôt local
        git add                git commit
\`\`\`

- **Répertoire de travail** : vos fichiers modifiés.
- **Index** : la sélection exacte qui sera commitée.
- **Dépôt local** : l'historique des commits.

## 1. Initialiser

\`\`\`bash
mkdir devforge-notes && cd devforge-notes
git init
git status
\`\`\`

\`git init\` crée un dossier \`.git\` qui contient tout l'historique.

## 2. Configurer son identité

\`\`\`bash
git config --global user.name "Votre Nom"
git config --global user.email "vous@example.com"
git config --global init.defaultBranch main
\`\`\`

Ces informations figurent dans chaque commit. Utilisez l'adresse associée à votre compte GitHub.

## 3. Le cycle de base

\`\`\`bash
# Créer un fichier
echo "# Mes notes DEVFORGE" > README.md

git add README.md
git commit -m "docs: ajoute le README du projet"

git log --oneline
\`\`\`

## 4. Un commit atomique

Un commit doit raconter **une** intention :

- \`feat: ajoute le calcul de moyenne\`
- \`fix: corrige la division par zéro\`
- \`docs: documente les paramètres\`
- \`test: couvre les cas limites\`

Évitez \`update\`, \`fix\`, \`modifs\`. Un historique lisible est un outil de diagnostic.

## 5. Le .gitignore

\`\`\`gitignore
.venv/
__pycache__/
*.pyc
.env
data/*.sqlite3
node_modules/
\`\`\`

Ne versionnez jamais de secrets ni d'environnements virtuels.

> **À retenir** — Git stocke des **instantanés** de l'arbre de fichiers, identifiés par un hash. Les commits forment un graphe orienté acyclique, pas une simple liste.

## Exercice rapide

Initialisez un dépôt, créez un fichier \`notes.md\`, ajoutez une ligne, commitez. Modifiez le fichier, puis utilisez \`git diff\` avant et après \`git add\` pour observer la différence entre répertoire de travail et index.`,
  },
  {
    slug: "git-commits-historique",
    moduleSlug: "git-github",
    position: 2,
    title: "Commits, diffs et historique",
    summary:
      "Inspecter ce qui a changé, revenir en arrière sans perdre de travail et préparer des commits propres.",
    estimatedMinutes: 50,
    codeLanguage: "bash",
    keyPoints: [
      "git diff compare travail et index",
      "git log --oneline pour l'essentiel",
      "git restore défait une modification non commitée",
    ],
    contentMd: `## Voir ce qui a changé

\`\`\`bash
git status              # état synthétique
git diff                # travail vs index
git diff --staged       # index vs dernier commit
git diff HEAD           # travail vs dernier commit
\`\`\`

## 1. Lire l'historique

\`\`\`bash
git log --oneline --graph --decorate
git log -p -- README.md      # historique d'un fichier
git show HEAD                # détail du dernier commit
\`\`\`

## 2. Corriger le dernier commit

\`\`\`bash
git add fichier_oublie.py
git commit --amend -m "feat: ajoute la validation des entrées"
\`\`\`

\`--amend\` réécrit le dernier commit. **Ne l'utilisez jamais** sur un commit déjà poussé et partagé sans coordination.

## 3. Annuler proprement

\`\`\`bash
# Défait les modifications d'un fichier non ajouté
git restore fichier.py

# Retire un fichier de l'index sans perdre les modifications
git restore --staged fichier.py

# Annule un commit local en gardant les modifications
git reset --soft HEAD~1

# Annule un commit local ET les modifications
git reset --hard HEAD~1
\`\`\`

\`reset --hard\` est destructif. Vérifiez deux fois avant d'exécuter.

## 4. Le stash

\`\`\`bash
git stash push -m "travail en cours sur le parser"
git stash list
git stash pop
\`\`\`

Le stash met de côté des modifications non commitées pour changer de branche sans commit intermédiaire.

## 5. Revenir à un commit sans réécrire

\`\`\`bash
git revert <hash>
\`\`\`

\`revert\` crée un nouveau commit qui inverse les changements. C'est la méthode sûre sur une branche partagée.

> **À retenir** — \`reset\` réécrit l'historique local ; \`revert\` ajoute un commit correctif. En équipe, préférez \`revert\`.

## Exercice rapide

Dans un dépôt de test : créez trois commits, inspectez-les avec \`git log -p\`, puis annulez le dernier avec \`git revert\`. Vérifiez que l'historique contient bien quatre commits.`,
  },
  {
    slug: "git-branches",
    moduleSlug: "git-github",
    position: 3,
    title: "Branches, fusion et conflits",
    summary:
      "Travailler en parallèle, fusionner proprement et résoudre un conflit sans panique.",
    estimatedMinutes: 55,
    codeLanguage: "bash",
    keyPoints: [
      "Une branche est un pointeur vers un commit",
      "Fusionner = intégrer un historique",
      "Un conflit se résout à la main puis se commit",
    ],
    contentMd: `## Une branche est un pointeur

\`\`\`bash
git branch                    # lister
git switch -c feat/validation # créer et basculer
git switch main               # revenir
git branch -d feat/validation # supprimer après fusion
\`\`\`

Créer une branche ne copie pas les fichiers : c'est un déplacement de pointeur.

## 1. Fusion

\`\`\`bash
git switch main
git merge feat/validation
\`\`\`

Si \`main\` n'a pas divergé, Git avance simplement le pointeur (**fast-forward**). Sinon, il crée un commit de fusion.

## 2. Résoudre un conflit

Git signale les fichiers concernés :

\`\`\`text
CONFLICT (content): Merge conflict in src/validation.py
\`\`\`

Le fichier contient des marqueurs :

\`\`\`python
<<<<<<< HEAD
if age < 18:
=======
if age <= 18:
>>>>>>> feat/validation
\`\`\`

Étapes :

1. ouvrir le fichier et choisir la version correcte ;
2. supprimer les marqueurs ;
3. tester ;
4. \`git add\` puis \`git commit\`.

\`\`\`bash
git add src/validation.py
git commit -m "merge: aligne la règle d'âge sur 18 ans"
\`\`\`

Pour abandonner la fusion :

\`\`\`bash
git merge --abort
\`\`\`

## 3. Rebaser, avec prudence

\`\`\`bash
git switch feat/validation
git rebase main
\`\`\`

Le rebase rejoue les commits de la branche au sommet de \`main\`. L'historique est linéaire, mais les commits sont réécrits. Ne rebasez pas une branche partagée.

## 4. Bonnes pratiques

- Une branche par intention, nommée \`feat/\`, \`fix/\`, \`docs/\`.
- Des commits petits et cohérents.
- Synchronisez \`main\` avant de démarrer.
- Supprimez les branches fusionnées.

> **À retenir** — Un conflit n'est pas une erreur : c'est Git qui vous demande de choisir entre deux intentions incompatibles. Lisez les deux versions avant de trancher.

## Exercice rapide

Créez une branche, modifiez la même ligne que sur \`main\` dans deux branches distinctes, puis fusionnez. Résolvez le conflit en conservant la règle la plus stricte et documentez votre choix dans le message de commit.`,
  },
  {
    slug: "github-collaboration",
    moduleSlug: "git-github",
    position: 4,
    title: "GitHub, pull requests et revue de code",
    summary:
      "Publier un dépôt, proposer une contribution et participer à une revue constructive.",
    estimatedMinutes: 50,
    codeLanguage: "bash",
    keyPoints: [
      "origin est le dépôt distant principal",
      "Une PR décrit un changement et son pourquoi",
      "La revue porte sur le code, pas sur la personne",
    ],
    contentMd: `## Relier un dépôt local

\`\`\`bash
git remote add origin git@github.com:utilisateur/devforge-notes.git
git branch -M main
git push -u origin main
\`\`\`

\`-u\` associe la branche locale à la branche distante : les prochains \`git push\` suffisent.

## 1. Récupérer les changements

\`\`\`bash
git fetch origin
git pull --rebase origin main
\`\`\`

\`pull --rebase\` rejoue vos commits locaux au-dessus de la version distante, pour un historique linéaire.

## 2. Pousser une branche

\`\`\`bash
git switch -c feat/export-markdown
# commits…
git push -u origin feat/export-markdown
\`\`\`

GitHub affiche alors un lien pour ouvrir une pull request.

## 3. Une bonne pull request

\`\`\`markdown
## Objectif
Permettre l'export du parcours en Markdown.

## Changements
- Ajout de \`export_markdown()\`
- Route \`/parcours/export\`
- Tests sur les modules vides

## Vérifications
- [x] pytest
- [x] mypy
- [x] test manuel de la route
\`\`\`

Une PR doit permettre à un relecteur de comprendre **quoi**, **pourquoi** et **comment vérifier**.

## 4. Revue de code

- Commentez des lignes précises, pas le fichier entier.
- Posez des questions plutôt que d'asséner : « Que se passe-t-il si la liste est vide ? »
- Distinguez bloquant et suggestion : « nit: », « suggestion: », « blocking: ».
- Approuvez explicitement quand tout est bon.

## 5. Protéger main

Sur GitHub : branch protection, revue obligatoire, statut CI vert avant fusion. Cela évite de pousser directement sur la branche principale.

> **À retenir** — Un dépôt public est un portfolio. Soignez le README, les tests et l'historique : un recruteur lira le README avant le code.

## Exercice rapide

Publiez votre calculateur de la phase 1 sur GitHub avec un README contenant : description, prérequis, installation, utilisation, exemple de sortie et tests. Ajoutez une licence MIT.`,
  },
  {
    slug: "git-bonnes-pratiques",
    moduleSlug: "git-github",
    position: 5,
    title: "Bonnes pratiques et automatisation",
    summary:
      "Adopter un flux de travail reproductible, des hooks utiles et une CI minimale.",
    estimatedMinutes: 45,
    codeLanguage: "bash",
    keyPoints: [
      "Un flux simple vaut mieux qu'un processus complexe",
      "Les hooks bloquent les erreurs avant le commit",
      "La CI vérifie ce que l'humain oublie",
    ],
    contentMd: `## Un flux de travail simple

1. synchroniser \`main\` ;
2. créer une branche descriptive ;
3. coder par petits commits ;
4. lancer les tests localement ;
5. ouvrir une pull request ;
6. faire relire ;
7. fusionner et supprimer la branche.

Ce flux suffit pour un projet personnel et pour la majorité des équipes.

## 1. Modèles de README

\`\`\`markdown
# Nom du projet

Une phrase qui explique le problème résolu.

## Fonctionnalités
- ...

## Installation
\`\`\`bash
git clone ...
python -m venv .venv
pip install -r requirements.txt
\`\`\`

## Utilisation
...
## Tests
\`\`\`bash
pytest
\`\`\`
\`\`\`

## 2. Hooks locaux

Un hook \`pre-commit\` peut exécuter le formateur et les tests rapides.

\`\`\`bash
# .git/hooks/pre-commit
#!/bin/sh
set -e
pytest -q
\`\`\`

\`\`\`bash
chmod +x .git/hooks/pre-commit
\`\`\`

Les hooks locaux ne sont pas versionnés. \`pre-commit\` (le package) ou \`husky\` permettent de les partager.

## 3. Intégration continue

\`\`\`yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: pytest -q
\`\`\`

## 4. Sécurité

- Aucun secret dans le code, même dans un dépôt privé.
- \`.env\` ignoré ; \`.env.example\` versionné.
- Si un secret fuite, révoquez-le immédiatement : supprimer le commit ne suffit pas.
- Activez l'alerte de secrets GitHub.

## 5. Revue de son propre diff

Avant de pousser :

\`\`\`bash
git diff --check
git diff main...HEAD
\`\`\`

Relisez comme si vous relisiez le code d'un autre : noms, cas limites, logs oubliés, code mort.

> **À retenir** — L'automatisation ne remplace pas la rigueur, elle la rend reproductible. Commencez par trois vérifications : tests, types, secrets.

## Exercice rapide

Ajoutez à votre dépôt un fichier \`CONTRIBUTING.md\`, un workflow CI et un \`.env.example\`. Vérifiez que la CI passe sur une pull request de démonstration.`,
  },
];

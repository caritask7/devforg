-- =============================================================================
-- DEVFORGE — Seed du contenu pédagogique
-- -----------------------------------------------------------------------------
-- FICHIER GÉNÉRÉ AUTOMATIQUEMENT — ne pas éditer à la main.
-- Régénérer avec : npm run db:seed-sql
--
-- À exécuter dans le SQL Editor Supabase APRÈS le schéma
-- (supabase/migrations/*_init.sql). Idempotent : ré-exécutable.
--
-- Contenu : 6 catégories, 16 compétences,
-- 4 phases, 27 modules, 40 leçons,
-- 12 missions, 22 liens mission-compétence.
-- =============================================================================

insert into public.skill_categories (slug, position, title, description) values
  ('programmation', 1, 'Programmation', 'Langages, mémoire et paradigmes.'),
  ('algorithmique', 2, 'Algorithmique & structures', 'Efficacité temporelle et spatiale, topologies.'),
  ('developpement-logiciel', 3, 'Architecture & qualité logicielle', 'Modélisation maintainable, tests et collaboration.'),
  ('bases-donnees', 4, 'Bases de données & persistance', 'Transactions ACID, intégrité et plans d''exécution.'),
  ('reseaux-systemes', 5, 'Réseaux et systèmes', 'Communication bas niveau, runtime et noyau.'),
  ('intelligence-artificielle', 6, 'Fondements de l''IA', 'Prérequis mathématiques — sans recours aux wrappers d''API.')
on conflict (slug) do update set
    position = excluded.position,
    title = excluded.title,
    description = excluded.description;

insert into public.skills (slug, category_slug, position, title, description, technique) values
  ('python', 'programmation', 1, 'Python moderne', 'Typage, structures, modules et bonnes pratiques.', 'Typage strict, compréhensions, gestion d''erreurs'),
  ('typescript', 'programmation', 2, 'TypeScript & systèmes de types', 'Types conditionnels, génériques et sûreté à la compilation.', 'Types génériques, narrowing, Zod'),
  ('c-cpp', 'programmation', 3, 'C / C++', 'Mémoire, pointeurs et gestion manuelle des ressources.', 'Allocation, RAII, Valgrind'),
  ('rust', 'programmation', 4, 'Rust', 'Borrow checker et concurrence sans data race.', 'Ownership, lifetimes, Send/Sync'),
  ('analyse-complexite', 'algorithmique', 1, 'Analyse de complexité', 'Big O, coût amorti et cas limites.', 'Time / space complexity, benchmark'),
  ('structures-avancees', 'algorithmique', 2, 'Arbres & graphes', 'Parcours, heaps, index et structures hiérarchiques.', 'BFS, DFS, AVL, tas binaire'),
  ('programmation-dynamique', 'algorithmique', 3, 'Programmation dynamique & récursion', 'Mémoïsation, tabulation et sous-structures optimales.', 'Memoization, DP bottom-up'),
  ('architecture-propre', 'developpement-logiciel', 1, 'Architecture propre', 'Découplage, lisibilité et injection de dépendances.', 'SOLID, ports & adapters, composition'),
  ('tests-tdd', 'developpement-logiciel', 2, 'Tests automatisés & TDD', 'Tests unitaires, d''intégration et couverture utile.', 'pytest, fixtures, cas limites'),
  ('git-collaboration', 'developpement-logiciel', 3, 'Git & collaboration', 'Historique lisible, branches et revue de code.', 'Branches, PR, CI, Conventional Commits'),
  ('modelisation-sql', 'bases-donnees', 1, 'Modélisation relationnelle & SQL', 'Normalisation, contraintes et requêtes composables.', 'PostgreSQL, 3NF, jointures'),
  ('indexation-optimisation', 'bases-donnees', 2, 'Indexation & optimisation', 'EXPLAIN ANALYZE, index composites et plans d''exécution.', 'B-tree, index partiels, cache de requêtes'),
  ('protocoles-reseau', 'reseaux-systemes', 1, 'Protocoles réseau', 'TCP/IP, HTTP, WebSockets et framing binaire.', 'Sockets, HTTP/1.1, keep-alive'),
  ('systemes-exploitation', 'reseaux-systemes', 2, 'Systèmes d''exploitation', 'Processus, threads, mémoire virtuelle et IPC.', 'Threads, locks, signaux, files'),
  ('algebre-lineaire', 'intelligence-artificielle', 1, 'Algèbre linéaire & calcul matriciel', 'Espaces vectoriels, produit tensoriel et décomposition SVD.', 'Vecteurs, matrices, numpy'),
  ('statistiques-probabilites', 'intelligence-artificielle', 2, 'Statistiques & probabilités', 'Théorème de Bayes, variables aléatoires et densités.', 'Distributions, estimation, tests')
on conflict (slug) do update set
    category_slug = excluded.category_slug,
    position = excluded.position,
    title = excluded.title,
    description = excluded.description,
    technique = excluded.technique;

insert into public.learning_phases (slug, position, title, tagline, description, status, estimated_hours) values
  ('fondamentaux', 1, 'Fondamentaux du développement', 'Phase 01 · Socle technique', 'Maîtriser la pensée algorithmique, la syntaxe Python, les structures de données et les outils de collaboration indispensables à tout développeur.', 'available', 84),
  ('ingenierie-logicielle', 2, 'Ingénierie logicielle', 'Phase 02 · Construction', 'Concevoir des applications robustes : architecture, bases de données, API, tests, sécurité et déploiement.', 'coming_soon', 120),
  ('mathematiques-ia', 3, 'Mathématiques & fondements de l''IA', 'Phase 03 · Modélisation', 'Algèbre linéaire, probabilités, statistiques et analyse de données : le langage mathématique du machine learning.', 'coming_soon', 96),
  ('intelligence-artificielle', 4, 'Intelligence artificielle avancée', 'Phase 04 · Spécialisation', 'Deep learning, réseaux de neurones, IA générative et mise en production de systèmes intelligents.', 'coming_soon', 140)
on conflict (slug) do update set
    position = excluded.position,
    title = excluded.title,
    tagline = excluded.tagline,
    description = excluded.description,
    status = excluded.status,
    estimated_hours = excluded.estimated_hours;

insert into public.modules (slug, phase_slug, position, title, description, level, estimated_minutes, status, objectives) values
  ('python-fondamentaux', 'fondamentaux', 1, 'Python : environnement, variables et types', 'Installer un environnement fiable, écrire ses premiers programmes et comprendre comment Python représente les données.', 'debutant', 600, 'available', array['Installer Python et un éditeur, exécuter un script', 'Déclarer et typer des variables', 'Manipuler nombres, chaînes et booléens', 'Formater des sorties lisibles']),
  ('conditions-boucles', 'fondamentaux', 2, 'Conditions, boucles et logique', 'Contrôler le déroulement d''un programme avec les structures conditionnelles et itératives, sans duplication de code.', 'debutant', 540, 'available', array['Écrire des conditions lisibles et exhaustives', 'Choisir entre for et while', 'Utiliser break, continue et else de boucle', 'Décomposer un problème en étapes logiques']),
  ('fonctions', 'fondamentaux', 3, 'Fonctions, portée et modularité', 'Transformer des scripts en programmes composables : fonctions pures, paramètres, valeurs de retour et organisation en modules.', 'debutant', 600, 'available', array['Définir des fonctions avec paramètres et valeurs de retour', 'Comprendre la portée des variables', 'Écrire des fonctions documentées et testables', 'Organiser son code en modules et packages']),
  ('structures-donnees', 'fondamentaux', 4, 'Structures de données essentielles', 'Choisir la bonne structure — liste, tuple, dictionnaire, ensemble — et automatiser le traitement de collections.', 'intermediaire', 660, 'available', array['Choisir une structure adaptée au problème', 'Parcourir et transformer des collections', 'Maîtriser les compréhensions et générateurs', 'Trier et indexer des données efficacement']),
  ('poo', 'fondamentaux', 5, 'Programmation orientée objet', 'Modéliser un domaine métier avec des classes claires, de l''héritage maîtrisé et les bonnes pratiques du Python moderne.', 'intermediaire', 720, 'available', array['Concevoir des classes cohérentes', 'Comprendre encapsulation et composition', 'Utiliser héritage et polymorphisme à bon escient', 'Exploiter dataclasses et méthodes spéciales']),
  ('algorithmique', 'fondamentaux', 6, 'Algorithmique et complexité', 'Mesurer le coût d''un algorithme, mettre en œuvre les grands classiques de recherche et de tri, et raisonner en complexité.', 'intermediaire', 780, 'available', array['Estimer une complexité temporelle et spatiale', 'Implémenter recherche linéaire et dichotomique', 'Comprendre les algorithmes de tri', 'Aborder la récursivité et les graphes']),
  ('git-github', 'fondamentaux', 7, 'Git, GitHub et collaboration', 'Versionner son code avec rigueur, travailler par branches et collaborer via des pull requests bien documentées.', 'debutant', 420, 'available', array['Comprendre le modèle de commits Git', 'Créer et fusionner des branches', 'Publier et collaborer sur GitHub', 'Écrire des messages de commit et des PR utiles']),
  ('projet-fondamentaux', 'fondamentaux', 8, 'Atelier de synthèse : CLI de suivi de tâches', 'Assembler tout le socle de la phase 1 dans une application en ligne de commande persistante, testée et versionnée.', 'intermediaire', 600, 'available', array['Structurer un projet Python complet', 'Lire et écrire des données persistantes', 'Écrire des tests unitaires utiles', 'Publier le projet sur GitHub avec un README clair']),
  ('structures-avancees', 'ingenierie-logicielle', 1, 'Structures de données avancées', 'Arbres, tas, graphes et tables de hachage appliqués à des problèmes réels.', 'avance', 600, 'coming_soon', '{}'),
  ('architecture-logicielle', 'ingenierie-logicielle', 2, 'Architecture logicielle', 'Couches, ports & adapters, principes SOLID et patrons de conception.', 'avance', 720, 'coming_soon', '{}'),
  ('bases-de-donnees-ingenierie', 'ingenierie-logicielle', 3, 'Bases de données', 'Modélisation relationnelle, normalisation, transactions et indexation.', 'intermediaire', 660, 'coming_soon', '{}'),
  ('api-rest', 'ingenierie-logicielle', 4, 'Conception d''API', 'REST, validation, pagination, versioning et documentation OpenAPI.', 'intermediaire', 540, 'coming_soon', '{}'),
  ('tests-logiciels', 'ingenierie-logicielle', 5, 'Tests logiciels', 'Tests unitaires, d''intégration, TDD et stratégie de couverture.', 'intermediaire', 480, 'coming_soon', '{}'),
  ('developpement-web', 'ingenierie-logicielle', 6, 'Développement web', 'HTTP, rendu serveur, composants, accessibilité et performance front.', 'intermediaire', 780, 'coming_soon', '{}'),
  ('securite-applicative', 'ingenierie-logicielle', 7, 'Sécurité applicative', 'OWASP, gestion des secrets, authentification et contrôle d''accès.', 'avance', 480, 'coming_soon', '{}'),
  ('deploiement', 'ingenierie-logicielle', 8, 'Déploiement & exploitation', 'CI/CD, conteneurs, observabilité et environnements de production.', 'avance', 540, 'coming_soon', '{}'),
  ('algebre-lineaire', 'mathematiques-ia', 1, 'Algèbre linéaire', 'Vecteurs, matrices, espaces vectoriels et décomposition SVD.', 'intermediaire', 600, 'coming_soon', '{}'),
  ('probabilites', 'mathematiques-ia', 2, 'Probabilités', 'Variables aléatoires, distributions, indépendance et théorème de Bayes.', 'intermediaire', 540, 'coming_soon', '{}'),
  ('statistiques', 'mathematiques-ia', 3, 'Statistiques', 'Estimation, tests d''hypothèses et analyse exploratoire.', 'intermediaire', 480, 'coming_soon', '{}'),
  ('analyse-donnees', 'mathematiques-ia', 4, 'Analyse de données', 'NumPy, pandas et visualisation pour préparer un jeu de données.', 'intermediaire', 540, 'coming_soon', '{}'),
  ('fondamentaux-ml', 'mathematiques-ia', 5, 'Fondamentaux du Machine Learning', 'Apprentissage supervisé, non supervisé, biais-variance et évaluation.', 'avance', 660, 'coming_soon', '{}'),
  ('ml-avance', 'intelligence-artificielle', 1, 'Machine Learning avancé', 'Ensembles, boosting, optimisation et sélection de modèles.', 'avance', 600, 'coming_soon', '{}'),
  ('deep-learning', 'intelligence-artificielle', 2, 'Deep Learning', 'Backpropagation, régularisation et entraînement de réseaux profonds.', 'avance', 720, 'coming_soon', '{}'),
  ('reseaux-neurones', 'intelligence-artificielle', 3, 'Réseaux de neurones', 'CNN, RNN, attention et architectures modernes.', 'avance', 720, 'coming_soon', '{}'),
  ('ia-generative', 'intelligence-artificielle', 4, 'IA générative', 'Modèles de diffusion, transformers et évaluation de sorties.', 'avance', 660, 'coming_soon', '{}'),
  ('systemes-intelligents', 'intelligence-artificielle', 5, 'Systèmes intelligents', 'Agents, orchestration, RAG et contraintes de production.', 'avance', 600, 'coming_soon', '{}'),
  ('deploiement-ia', 'intelligence-artificielle', 6, 'Déploiement de solutions IA', 'Servir un modèle, monitorer la dérive et industrialiser les inférences.', 'avance', 540, 'coming_soon', '{}')
on conflict (slug) do update set
    phase_slug = excluded.phase_slug,
    position = excluded.position,
    title = excluded.title,
    description = excluded.description,
    level = excluded.level,
    estimated_minutes = excluded.estimated_minutes,
    status = excluded.status,
    objectives = excluded.objectives;

insert into public.lessons (slug, module_slug, position, title, summary, content_md, estimated_minutes, code_language, key_points) values
  ('python-environnement', 'python-fondamentaux', 1, 'Installer Python et exécuter son premier script', 'Mettre en place un environnement de travail fiable et comprendre le cycle d''exécution d''un programme Python.', '## Pourquoi l''environnement compte

Un environnement reproductible évite la majorité des problèmes de débutant : version de Python inconnue, dépendances installées au mauvais endroit, script lancé depuis le mauvais dossier. Prenez l''habitude de vérifier ces trois éléments **avant** d''écrire du code.

## 1. Vérifier l''installation

Ouvrez un terminal et exécutez :

```bash
python --version
# Python 3.12.4

python -c "print(''Bonjour DEVFORGE'')"
```

Sur macOS et Linux, la commande est souvent `python3`. Sur Windows, `py` fonctionne également.

> **À retenir** — Si la commande affiche Python 2 ou une erreur, réinstallez Python depuis python.org en cochant « Add Python to PATH » sous Windows.

## 2. Structure d''un script

Créez un fichier `hello.py` :

```python
# hello.py
prenom = "Ada"
message = f"Bonjour {prenom}, bienvenue dans DEVFORGE."
print(message)
```

Exécutez-le avec :

```bash
python hello.py
```

Python lit le fichier **ligne par ligne**, de haut en bas. Chaque instruction est exécutée dès qu''elle est rencontrée.

## 3. Le REPL pour expérimenter

Le REPL (Read–Eval–Print Loop) est une console interactive. Lancez `python` sans argument :

```python
>>> 2 + 3
5
>>> nom = "DEVFORGE"
>>> nom.lower()
''devforge''
```

Le REPL est parfait pour tester une expression. Il ne remplace pas un fichier pour un programme complet.

## 4. Organiser son projet

```text
mon-projet/
├── .venv/            # environnement virtuel (ignoré par Git)
├── src/
│   └── main.py
├── README.md
└── .gitignore
```

Créez un environnement virtuel dès qu''un projet utilise des dépendances :

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate
```

## Erreurs fréquentes

- **`python: command not found`** : Python n''est pas dans le PATH.
- **Éditer un fichier puis oublier de le sauvegarder** : exécutez toujours la version enregistrée.
- **Lancer un script depuis un autre dossier** : utilisez le chemin complet ou déplacez-vous avec `cd`.

## Exercice rapide

Écrivez un script qui affiche votre prénom, la version de Python utilisée et le résultat de `17 * 23`. Exécutez-le depuis un terminal, sans copier le résultat à la main.', 45, 'python', array['Python 3.12+ est la version de référence', 'Un script s''exécute de haut en bas', 'Le terminal est l''outil de vérification principal']),
  ('python-variables-types', 'python-fondamentaux', 2, 'Variables, types et opérateurs', 'Comprendre comment Python stocke les valeurs, comment les nommer et comment les combiner sans erreur.', '## Une variable n''est pas une boîte

En Python, une variable est un **nom qui référence un objet** en mémoire. Affecter `a = 10` puis `b = a` ne copie pas la valeur : les deux noms pointent vers le même objet immuable.

```python
a = 10
b = a
a = 20
print(b)  # 10 : l''entier référencé par b n''a pas changé
```

## 1. Les types fondamentaux

| Type | Exemple | Usage |
| --- | --- | --- |
| `int` | `42` | entiers, compteurs |
| `float` | `3.14` | mesures, calculs décimaux |
| `str` | `"DEVFORGE"` | texte |
| `bool` | `True` | conditions |
| `NoneType` | `None` | absence de valeur |

```python
age: int = 28
moyenne: float = 14.75
langage: str = "Python"
est_actif: bool = True
objectif = None
```

Les annotations `:` sont facultatives à l''exécution, mais elles documentent le contrat et permettent aux outils comme **mypy** de détecter des erreurs.

## 2. Nommer proprement

- `snake_case` pour les variables et fonctions.
- Un nom décrit l''intention, pas le type : `total_heures` plutôt que `mon_int`.
- Évitez les noms d''une lettre sauf dans un contexte mathématique court.

```python
# Mauvais
t = 720

# Bon
duree_module_minutes = 720
```

## 3. Opérateurs essentiels

```python
print(7 / 2)    # 3.5  division flottante
print(7 // 2)   # 3    division entière
print(7 % 2)    # 1    modulo
print(2 ** 10)  # 1024 exponentiation

total = 0
total += 5      # équivaut à total = total + 5
```

La concaténation de chaînes et de nombres échoue volontairement :

```python
# TypeError
# "Score : " + 98

# Solution explicite
print("Score : " + str(98))
print(f"Score : {98}")
```

## 4. Conversion de types

```python
int("42")        # 42
float("3.5")     # 3.5
str(3.5)         # "3.5"
bool("False")    # True : toute chaîne non vide est vraie !
```

> **Piège classique** — `bool("False")` vaut `True`. Pour convertir une chaîne en booléen, comparez explicitement : `valeur == "True"`.

## Exercice rapide

Écrivez un programme qui convertit une durée en minutes (`total = 725`) en heures et minutes, puis affiche `12 h 05`. Utilisez `//` et `%`.', 60, 'python', array['Une variable est une étiquette vers une valeur', 'Python est fortement typé mais dynamiquement typé', 'int, float, str, bool et None couvrent l''essentiel']),
  ('python-chaines', 'python-fondamentaux', 3, 'Manipuler les chaînes de caractères', 'Nettoyer, découper, assembler et rechercher du texte avec les méthodes essentielles de str.', '## Une chaîne est immuable

Aucune méthode de chaîne ne modifie l''original : elle renvoie une **nouvelle** chaîne. C''est une garantie importante pour éviter les effets de bord.

```python
langage = "Python"
langage.upper()
print(langage)  # Python
print(langage.upper())  # PYTHON
```

## 1. Nettoyer et normaliser

```python
saisie = "   DevForge  "
print(saisie.strip())          # "DevForge"
print(saisie.strip().lower())  # "devforge"
print("a,b,c".split(","))      # [''a'', ''b'', ''c'']
print(" | ".join(["a", "b"]))  # "a | b"
print("bonjour".replace("jour", "soir"))  # "bonsoir"
```

Cas fréquent : comparer des e-mails saisis avec des espaces ou une casse différente.

```python
def normaliser_email(email: str) -> str:
    return email.strip().lower()

assert normaliser_email("  Ada@Example.com ") == "ada@example.com"
```

## 2. Construire du texte avec f-strings

```python
nom = "Ada"
score = 98.456

print(f"{nom} a obtenu {score:.1f} points")  # Ada a obtenu 98.5 points
print(f"{nom:>10}")                          # alignement à droite
print(f"{12:02d}:{5:02d}")                   # 12:05
```

## 3. Découper proprement

Le **slicing** utilise `[début:fin:pas]` ; la borne de fin est exclue.

```python
code = "DEVFORGE-2026"
print(code[:8])     # DEVFORGE
print(code[-4:])    # 2026
print(code[::-1])   # 6202-EGROFVED
```

## 4. Rechercher et valider

```python
texte = "Le code doit être lisible."
print("code" in texte)          # True
print(texte.startswith("Le"))   # True
print(texte.find("lisible"))    # 20
print(texte.count("e"))         # 4
```

> **À retenir** — `find` renvoie `-1` quand l''élément est absent. En Python, préférez `in` pour un test booléen.

## Exercice rapide

Écrivez `initiales("ada lovelace")` qui renvoie `"A.L."`. Gérez les espaces multiples et les majuscules.', 55, 'python', array['Les chaînes sont immuables', 'f-strings pour construire du texte lisible', 'split, join, strip et replace couvrent la majorité des besoins']),
  ('python-entrees-sorties', 'python-fondamentaux', 4, 'Entrées, sorties et formatage', 'Interagir avec l''utilisateur, convertir les saisies et produire des sorties lisibles et fiables.', '## input() renvoie du texte

```python
prenom = input("Votre prénom : ")
print(f"Bonjour {prenom} !")
```

Même si l''utilisateur tape `42`, la valeur est la chaîne `"42"`. Il faut convertir explicitement.

```python
age = int(input("Votre âge : "))
```

Si l''utilisateur tape `vingt`, Python lève une `ValueError`. Un programme robuste anticipe ce cas :

```python
def demander_entier(message: str) -> int:
    while True:
        saisie = input(message).strip()
        try:
            return int(saisie)
        except ValueError:
            print("Entrée invalide : saisissez un nombre entier.")
```

## 1. Sorties lisibles

```python
print("Python", "SQL", "Git", sep=" | ")
print("Calcul terminé", end="\n\n")
print(f"{''Module'':<20}{''Durée'':>8}")
print(f"{''Python'':<20}{''10 h'':>8}")
```

## 2. Un mini programme complet

```python
def convertir_minutes(total: int) -> str:
    heures, minutes = divmod(total, 60)
    return f"{heures} h {minutes:02d}"

duree = int(input("Durée en minutes : "))
print(f"Durée formatée : {convertir_minutes(duree)}")
```

`divmod` renvoie le quotient **et** le reste en une seule opération.

## 3. Journaliser plutôt qu''imprimer

Dans un vrai programme, `print` sert à l''utilisateur, `logging` sert au développeur.

```python
import logging

logging.basicConfig(level=logging.INFO)
logging.info("Démarrage du calcul")
logging.warning("Donnée manquante, valeur par défaut utilisée")
```

> **Bonne pratique** — Une fonction métier ne devrait pas appeler `input()` ni `print()` : elle reçoit des paramètres et renvoie un résultat. L''interaction reste dans la couche CLI.

## Exercice rapide

Demandez deux nombres à l''utilisateur et affichez leur somme, leur différence et leur quotient. Refusez la division par zéro avec un message clair.', 50, 'python', array['input() renvoie toujours une chaîne', 'Toute saisie doit être validée', 'print() accepte plusieurs arguments et un séparateur']),
  ('python-atelier-calculateur', 'python-fondamentaux', 5, 'Atelier : un calculateur en ligne de commande', 'Assembler variables, conditions, boucles et fonctions dans un programme interactif complet.', '## Objectif de l''atelier

Construire un calculateur qui :

1. affiche un menu ;
2. lit un choix ;
3. demande les opérandes nécessaires ;
4. affiche le résultat ;
5. recommence jusqu''à `q`.

## 1. La logique métier

```python
def calculer(a: float, b: float, operation: str) -> float:
    if operation == "+":
        return a + b
    if operation == "-":
        return a - b
    if operation == "*":
        return a * b
    if operation == "/":
        if b == 0:
            raise ValueError("Division par zéro impossible")
        return a / b
    raise ValueError(f"Opération inconnue : {operation}")
```

Cette fonction ne fait aucune saisie. Elle est donc **simple à tester** :

```python
assert calculer(2, 3, "+") == 5
assert calculer(10, 4, "-") == 6
assert calculer(3, 4, "*") == 12
assert calculer(9, 3, "/") == 3
```

## 2. L''interface en ligne de commande

```python
MENU = """
1) Additionner
2) Soustraire
3) Multiplier
4) Diviser
q) Quitter
"""

def boucle_principale() -> None:
    while True:
        print(MENU)
        choix = input("Votre choix : ").strip().lower()
        if choix == "q":
            print("À bientôt.")
            return
        operations = {"1": "+", "2": "-", "3": "*", "4": "/"}
        if choix not in operations:
            print("Choix invalide.")
            continue
        try:
            a = float(input("Premier nombre : "))
            b = float(input("Second nombre : "))
            resultat = calculer(a, b, operations[choix])
        except ValueError as erreur:
            print(f"Erreur : {erreur}")
        else:
            print(f"Résultat : {resultat:g}")

if __name__ == "__main__":
    boucle_principale()
```

## 3. Améliorations attendues

- Ajouter une opération puissance `**`.
- Afficher un historique des cinq derniers calculs.
- Permettre de relancer le dernier calcul.
- Extraire `MENU` et `operations` dans un module `ui.py`.

> **À retenir** — Le bloc `if __name__ == "__main__"` empêche l''exécution automatique du programme lorsque le fichier est importé par un test.

## Livrable

Une version fonctionnelle, avec au moins quatre opérations, une gestion d''erreur claire et deux tests. C''est le premier projet que vous pouvez publier sur GitHub.', 75, 'python', array['Séparer logique métier et interface', 'Boucler jusqu''à une commande de sortie', 'Tester chaque fonction isolément']),
  ('conditions-logiques', 'conditions-boucles', 1, 'Conditions et opérateurs logiques', 'Exprimer des décisions claires avec if/elif/else, les comparaisons et les opérateurs booléens.', '## Prendre une décision

```python
temperature = 18

if temperature < 10:
    print("Manteau obligatoire")
elif temperature < 20:
    print("Veste recommandée")
else:
    print("Tenue légère")
```

Python teste les branches dans l''ordre et s''arrête à la première vraie. L''ordre des `elif` est donc important.

## 1. Comparer correctement

| Opérateur | Sens |
| --- | --- |
| `==` | égalité |
| `!=` | différence |
| `<`, `<=` | infériorité |
| `>`, `>=` | supériorité |
| `is` | identité (même objet) |

```python
note = 12
print(note >= 10)  # True
print(note == 12)  # True
print(note != 12)  # False
```

> **Piège** — `=` est une affectation. `if x = 5:` provoque une `SyntaxError`.

## 2. Combiner des conditions

```python
age = 22
avec_autorisation = True

if age >= 18 and avec_autorisation:
    print("Accès autorisé")

if age < 18 or not avec_autorisation:
    print("Accès refusé")
```

Python évalue de gauche à droite avec **court-circuit** :

```python
utilisateur = None
# Pas d''erreur : la seconde partie n''est pas évaluée
if utilisateur is not None and utilisateur.upper() == "ADA":
    print("Trouvé")
```

## 3. Conditions chaînées

```python
if 18 <= age < 65:
    print("Tarif actif")
```

Cette écriture est équivalente à `age >= 18 and age < 65`.

## 4. Valeurs « falsy »

Sont considérés faux : `False`, `None`, `0`, `0.0`, `""`, `[]`, `{}`, `()`.

```python
resultats = []
if not resultats:
    print("Aucun résultat")
```

## Erreurs fréquentes

- Enchaîner des `if` indépendants alors qu''un `elif` serait plus juste.
- Oublier les deux-points.
- Mélanger `and` et `or` sans parenthèses.

```python
# Ambigu
if role == "admin" or role == "editeur" and actif:

# Clair
if role == "admin" or (role == "editeur" and actif):
```

## Exercice rapide

Écrivez `categoriser_imc(imc)` qui renvoie `"insuffisance"`, `"normal"`, `"surpoids"` ou `"obésité"` selon les seuils 18.5, 25 et 30. Testez les bornes exactes.', 50, 'python', array['if / elif / else s''évalue de haut en bas', 'and, or et not composent des conditions', 'Comparer == et non =']),
  ('boucles-for', 'conditions-boucles', 2, 'Boucles for et itération', 'Parcourir des séquences, générer des nombres et utiliser range sans erreur d''indice.', '## Itérer sur une séquence

```python
langages = ["Python", "SQL", "Git"]

for langage in langages:
    print(langage)
```

La boucle `for` Python est un **for each** : elle parcourt les éléments, pas des indices.

## 1. range

```python
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

for i in range(2, 6):
    print(i)  # 2, 3, 4, 5

for i in range(10, 0, -2):
    print(i)  # 10, 8, 6, 4, 2
```

La borne de fin est toujours exclue. C''est la source d''erreur numéro un.

## 2. Indices et valeurs

```python
jours = ["lundi", "mardi", "mercredi"]

for index, jour in enumerate(jours, start=1):
    print(f"{index}. {jour}")
```

Évitez `for i in range(len(jours))` : c''est plus long et moins sûr.

## 3. Parcourir un dictionnaire

```python
scores = {"Python": 88, "SQL": 75}

for langue, score in scores.items():
    print(f"{langue}: {score}")
```

## 4. break, continue, else

```python
nombres = [4, 9, 16, 25]

for nombre in nombres:
    if nombre % 2 == 0:
        continue  # passe au suivant
    if nombre > 20:
        break  # quitte la boucle
    print(nombre)

# Le else s''exécute seulement si aucun break n''a eu lieu
for nombre in nombres:
    if nombre > 100:
        break
else:
    print("Aucun nombre supérieur à 100")
```

## 5. Accumuler un résultat

```python
total = 0
for note in [12, 15, 9, 18]:
    total += note

moyenne = total / 4
print(f"Moyenne : {moyenne:.2f}")
```

> **Bon réflexe** — Avant d''écrire une boucle, demandez-vous si `sum`, `min`, `max` ou `any` ne suffisent pas.

## Exercice rapide

Affichez les nombres de 1 à 50, mais remplacez les multiples de 3 par `"Fizz"` et les multiples de 5 par `"Buzz"`. (Indice : la prochaine leçon vous fera écrire FizzBuzz complet.)', 55, 'python', array['for parcourt un itérable', 'range(5) va de 0 à 4', 'enumerate donne index et valeur']),
  ('boucles-while', 'conditions-boucles', 3, 'Boucles while et contrôle de flux', 'Répéter une action tant qu''une condition est vraie, sans créer de boucle infinie.', '## Quand utiliser while

Utilisez `for` quand le nombre d''itérations est connu, `while` quand la sortie dépend d''un état.

```python
compteur = 3
while compteur > 0:
    print(compteur)
    compteur -= 1
print("Décollage !")
```

Si vous oubliez `compteur -= 1`, la boucle ne se termine jamais. Interrompez-la avec `Ctrl+C`.

## 1. Boucle d''attente d''une saisie valide

```python
mot_de_passe = ""
while len(mot_de_passe) < 8:
    mot_de_passe = input("Mot de passe (8 caractères min.) : ")
    if len(mot_de_passe) < 8:
        print("Trop court.")
print("Mot de passe accepté.")
```

## 2. Boucle avec sentinelle

```python
total = 0
while True:
    saisie = input("Nombre à ajouter (ou ''stop'') : ")
    if saisie == "stop":
        break
    total += float(saisie)
print(f"Total : {total}")
```

`while True` est acceptable si un `break` est **garanti** sur un chemin clair.

## 3. Éviter les boucles infinies

Trois garde-fous :

1. initialiser la variable de contrôle ;
2. la modifier dans la boucle ;
3. prévoir une limite de sécurité si la sortie dépend d''une source externe.

```python
tentatives = 0
while tentatives < 3:
    tentatives += 1
    print(f"Tentative {tentatives}/3")
```

## 4. Convergence numérique

```python
def racine_carree(valeur: float, epsilon: float = 1e-9) -> float:
    estimation = valeur / 2
    while abs(estimation * estimation - valeur) > epsilon:
        estimation = (estimation + valeur / estimation) / 2
    return estimation

print(racine_carree(2))  # ≈ 1.414213562
```

> **À retenir** — Une condition de boucle doit porter sur une valeur qui peut raisonnablement changer. Pour un compteur, initialisez avant et décrémentez dans le corps.

## Exercice rapide

Simulez un distributeur : le solde vaut 100. Tant que l''utilisateur retire une somme valide et inférieure au solde, décrémentez-le. Affichez « Fonds insuffisants » sans quitter la boucle, et « Terminé » après confirmation.', 50, 'python', array['while vérifie la condition avant chaque tour', 'La variable de contrôle doit évoluer', 'break et continue restent disponibles']),
  ('validation-saisie', 'conditions-boucles', 4, 'Valider une saisie utilisateur', 'Construire des boucles de validation robustes et séparer la validation de l''affichage.', '## Le contrat d''entrée

Toute donnée venant de l''extérieur — clavier, fichier, API — doit être considérée comme non fiable. Le rôle de la validation est d''**échouer tôt et clairement**.

## 1. Validation par exception

```python
def parse_entier(texte: str, minimum: int | None = None) -> int:
    valeur = int(texte.strip())
    if minimum is not None and valeur < minimum:
        raise ValueError(f"La valeur doit être ≥ {minimum}")
    return valeur
```

```python
try:
    age = parse_entier("17", minimum=18)
except ValueError as erreur:
    print(f"Saisie refusée : {erreur}")
```

## 2. Boucle de reprise

```python
def demander_age(max_tentatives: int = 3) -> int | None:
    for _ in range(max_tentatives):
        saisie = input("Votre âge : ")
        try:
            return parse_entier(saisie, minimum=0)
        except ValueError as erreur:
            print(f"Erreur : {erreur}")
    print("Nombre de tentatives dépassé.")
    return None
```

## 3. Validation de plusieurs champs

```python
def valider_inscription(email: str, mot_de_passe: str) -> list[str]:
    erreurs: list[str] = []
    if "@" not in email:
        erreurs.append("Adresse e-mail invalide.")
    if len(mot_de_passe) < 8:
        erreurs.append("Le mot de passe doit contenir au moins 8 caractères.")
    if not any(c.isdigit() for c in mot_de_passe):
        erreurs.append("Le mot de passe doit contenir un chiffre.")
    return erreurs

erreurs = valider_inscription("ada@example.com", "court")
for message in erreurs:
    print(f"- {message}")
```

Retourner **toutes** les erreurs est plus utile que s''arrêter à la première.

## 4. Un menu robuste

```python
OPTIONS = {"1": "consulter", "2": "ajouter", "q": "quitter"}

def lire_choix() -> str:
    while True:
        choix = input("Choix : ").strip().lower()
        if choix in OPTIONS:
            return choix
        print(f"Choix invalide. Options : {'', ''.join(OPTIONS)}")
```

> **Bonne pratique** — Une fonction de validation ne doit pas afficher de message. Elle renvoie un booléen, une liste d''erreurs ou lève une exception. La couche CLI se charge du rendu.

## Exercice rapide

Écrivez `valider_email` qui vérifie : présence d''un `@`, un seul `@`, une partie locale non vide et un domaine contenant un point. Retournez la liste des erreurs et testez trois cas invalides.', 45, 'python', array['Ne jamais faire confiance à une entrée', 'Une fonction de validation renvoie un résultat ou lève une erreur', 'Limiter le nombre de tentatives']),
  ('atelier-fizzbuzz', 'conditions-boucles', 5, 'Atelier : FizzBuzz et motifs', 'Consolider conditions et boucles avec deux exercices classiques, puis les tester.', '## FizzBuzz, sans piège

Règle : pour les nombres de 1 à n, afficher `Fizz` si le nombre est divisible par 3, `Buzz` si divisible par 5, `FizzBuzz` si divisible par les deux, sinon le nombre.

L''erreur classique est de tester `divisible par 3` avant `divisible par 3 et 5`.

```python
def fizzbuzz(n: int) -> list[str]:
    resultat: list[str] = []
    for nombre in range(1, n + 1):
        if nombre % 15 == 0:
            resultat.append("FizzBuzz")
        elif nombre % 3 == 0:
            resultat.append("Fizz")
        elif nombre % 5 == 0:
            resultat.append("Buzz")
        else:
            resultat.append(str(nombre))
    return resultat

print(fizzbuzz(15))
```

`% 15 == 0` est équivalent à `% 3 == 0 and % 5 == 0`, en une seule opération.

## 1. Version testable

```python
assert fizzbuzz(3) == ["1", "2", "Fizz"]
assert fizzbuzz(5)[-1] == "Buzz"
assert fizzbuzz(15)[-1] == "FizzBuzz"
assert fizzbuzz(0) == []
```

## 2. Motif en escalier

```python
def escalier(hauteur: int) -> None:
    for ligne in range(1, hauteur + 1):
        print(" " * (hauteur - ligne) + "*" * (2 * ligne - 1))

escalier(4)
```

```text
   *
  ***
 *****
*******
```

## 3. Table de multiplication formatée

```python
def table(n: int) -> None:
    for ligne in range(1, n + 1):
        colonnes = [f"{ligne * colonne:3d}" for colonne in range(1, n + 1)]
        print(" ".join(colonnes))

table(5)
```

## 4. Critique d''implémentation

Comparez :

```python
# A
if n % 3 == 0 and n % 5 == 0: ...

# B
if n % 15 == 0: ...
```

B est plus courte et plus rapide. Mais A est parfois plus lisible pour un lecteur qui ne connaît pas la propriété mathématique. Choisissez en fonction du contexte et documentez si nécessaire.

> **À retenir** — Un exercice réussi n''est pas seulement un programme qui « marche » : c''est un programme dont vous savez prouver le comportement sur les cas limites (0, 1, négatifs, très grands nombres).

## Livrable

Publiez `fizzbuzz.py` avec la fonction, quatre assertions et une description dans le README. Ajoutez une capture du résultat.', 60, 'python', array['Tester d''abord les cas limites', 'Une fonction par responsabilité', 'Comparer plusieurs implémentations']),
  ('fonctions-definir', 'fonctions', 1, 'Définir et appeler une fonction', 'Écrire des fonctions courtes, nommées clairement, avec une responsabilité unique.', '## Pourquoi extraire une fonction

Une fonction nomme une intention. Elle remplace un bloc de code par une phrase compréhensible et permet de tester ce bloc indépendamment.

```python
def moyenne(notes: list[float]) -> float:
    if not notes:
        raise ValueError("La liste de notes ne peut pas être vide")
    return sum(notes) / len(notes)

print(moyenne([12, 15, 9]))  # 12.0
```

## 1. Anatomie

```python
def appliquer_remise(prix: float, pourcentage: float) -> float:
    """Renvoie le prix après application d''une remise en pourcentage."""
    if not 0 <= pourcentage <= 100:
        raise ValueError("Le pourcentage doit être entre 0 et 100")
    return round(prix * (1 - pourcentage / 100), 2)
```

- `def` ouvre la définition ;
- `appliquer_remise` est le nom, en `snake_case` ;
- les paramètres sont typés ;
- la valeur de retour est annotée ;
- la docstring décrit le contrat.

## 2. Valeur de retour

Sans `return`, une fonction renvoie `None`.

```python
def afficher_total(total: float) -> None:
    print(f"Total : {total:.2f} €")
```

`return` interrompt la fonction :

```python
def statut(score: int) -> str:
    if score >= 90:
        return "excellent"
    if score >= 60:
        return "validé"
    return "à revoir"
```

Les conditions de sortie anticipée évitent les `else` imbriqués.

## 3. Responsabilité unique

```python
# Trop de responsabilités
def traiter(notes: list) -> None:
    total = sum(notes)
    moyenne_ = total / len(notes)
    print(f"Moyenne : {moyenne_}")
    if moyenne_ >= 10:
        print("Admis")

# Mieux
def calculer_moyenne(notes: list[float]) -> float:
    return sum(notes) / len(notes)

def est_admis(moyenne_: float) -> bool:
    return moyenne_ >= 10
```

> **Règle pratique** — Si vous devez utiliser « et » pour décrire ce que fait une fonction, découpez-la.

## 4. Nommer

| Mauvais | Bon |
| --- | --- |
| `calc` | `calculer_moyenne` |
| `process` | `normaliser_email` |
| `check` | `est_email_valide` |

Les fonctions booléennes commencent souvent par `est_`, `a_`, `peut_`.

## Exercice rapide

Écrivez `convertir_euros_en_dollars(montant, taux)` avec validation du taux (> 0) et arrondi à deux décimales. Ajoutez une docstring et deux assertions.', 55, 'python', array['def nom(paramètres) -> type de retour', 'Une fonction fait une seule chose', 'return termine immédiatement l''exécution']),
  ('fonctions-parametres', 'fonctions', 2, 'Paramètres, arguments et valeurs par défaut', 'Maîtriser les paramètres positionnels, nommés, par défaut et variadiques.', '## Trois façons de passer un argument

```python
def creer_utilisateur(nom: str, role: str = "membre", actif: bool = True) -> dict:
    return {"nom": nom, "role": role, "actif": actif}

# positionnel
creer_utilisateur("Ada", "admin", False)

# nommé : beaucoup plus lisible
creer_utilisateur("Ada", role="admin", actif=False)
```

Privilégiez les arguments nommés dès que l''appel comporte plus de deux valeurs.

## 1. Le piège de la valeur par défaut mutable

```python
# Bug classique
def ajouter(element, liste=[]):
    liste.append(element)
    return liste

print(ajouter(1))  # [1]
print(ajouter(2))  # [1, 2] — la même liste !
```

La valeur par défaut est créée **une seule fois**, à la définition. La correction :

```python
def ajouter(element, liste=None):
    if liste is None:
        liste = []
    liste.append(element)
    return liste
```

## 2. Paramètres positionnels uniquement

```python
def diviser(a: float, b: float, /) -> float:
    return a / b

diviser(10, 2)      # OK
# diviser(a=10, b=2)  # TypeError
```

Le `/` force le passage positionnel. Utile pour les API bas niveau.

## 3. Paramètres nommés uniquement

```python
def envoyer_email(destinataire: str, *, sujet: str, corps: str) -> None:
    ...

envoyer_email("ada@example.com", sujet="Bienvenue", corps="Bonjour")
```

Le `*` interdit les arguments positionnels après lui. Cela protège contre les inversions accidentelles.

## 4. Variadiques

```python
def somme(*nombres: float) -> float:
    return sum(nombres)

print(somme(1, 2, 3))  # 6.0

def journaliser(message: str, **contexte: object) -> None:
    details = " ".join(f"{cle}={valeur}" for cle, valeur in contexte.items())
    print(f"{message} {details}")

journaliser("Connexion", utilisateur="ada", ip="127.0.0.1")
```

## 5. Découpage d''une liste

```python
def moyenne(*notes: float) -> float:
    if not notes:
        raise ValueError("Aucune note")
    return sum(notes) / len(notes)

valeurs = [12, 15, 9]
print(moyenne(*valeurs))  # 12.0
```

> **À retenir** — Un paramètre par défaut décrit une politique stable, pas un état partagé. Pour les objets mutables, utilisez `None` et construisez la valeur dans le corps.

## Exercice rapide

Écrivez `formater_prix(montant, *, devise="EUR", decimales=2)` qui renvoie `"1 234,50 €"` pour `1234.5`. Forcez le passage nommé après le montant.', 55, 'python', array['Les arguments nommés rendent les appels lisibles', 'Les valeurs par défaut ne doivent pas être mutables', 'args et kwargs pour les interfaces flexibles']),
  ('fonctions-portee', 'fonctions', 3, 'Portée des variables et fermetures', 'Comprendre les espaces de noms, global, nonlocal et les fonctions qui capturent leur contexte.', '## Espaces de noms

Python cherche un nom dans l''ordre **LEGB** : Local, Enclosing, Global, Built-in.

```python
x = "global"

def externe() -> None:
    x = "enclosing"

    def interne() -> None:
        x = "local"
        print(x)  # local

    interne()
    print(x)  # enclosing

externe()
print(x)  # global
```

Chaque fonction possède son propre espace local.

## 1. Lire une variable globale, mais ne pas la modifier

```python
TAUX_TVA = 0.20

def prix_ttc(prix_ht: float) -> float:
    return prix_ht * (1 + TAUX_TVA)
```

Lire une constante globale est acceptable. La modifier depuis une fonction est une mauvaise pratique.

```python
compteur = 0

def incrementer() -> None:
    global compteur
    compteur += 1  # fonctionne, mais crée un couplage caché
```

Préférez :

```python
def incrementer(valeur: int) -> int:
    return valeur + 1
```

## 2. nonlocal et fermetures

```python
def creer_compteur():
    valeur = 0

    def suivant() -> int:
        nonlocal valeur
        valeur += 1
        return valeur

    return suivant

compteur = creer_compteur()
print(compteur())  # 1
print(compteur())  # 2
```

`suivant` conserve sa variable `valeur` après la fin de `creer_compteur`. C''est une **fermeture** (closure).

## 3. Le piège de la capture tardive

```python
fonctions = []
for i in range(3):
    fonctions.append(lambda: i)

print([f() for f in fonctions])  # [2, 2, 2]
```

Toutes les lambdas regardent le même `i`, qui vaut 2 à la fin. Correction :

```python
fonctions = [lambda i=i: i for i in range(3)]
print([f() for f in fonctions])  # [0, 1, 2]
```

## 4. Décorateurs, aperçu

Une fonction peut recevoir et renvoyer une fonction.

```python
def trace(fonction):
    def enveloppe(*args, **kwargs):
        print(f"→ {fonction.__name__}")
        return fonction(*args, **kwargs)
    return enveloppe

@trace
def doubler(x: int) -> int:
    return x * 2

doubler(21)
```

> **À retenir** — Une variable globale modifiable est un état partagé. Si vous avez besoin de mémoire entre appels, encapsulez-la dans un objet ou une closure explicite.

## Exercice rapide

Écrivez `creer_compteur_depuis(depart)` qui renvoie une fonction `ajouter(n)` retournant le total cumulé. Vérifiez que deux compteurs créés séparément ne partagent pas leur état.', 50, 'python', array['Chaque fonction crée un espace de noms local', 'Éviter global : préférer des paramètres', 'Une closure capture une variable, pas sa valeur']),
  ('fonctions-documentation-tests', 'fonctions', 4, 'Documenter et tester ses fonctions', 'Écrire des docstrings utiles et des tests unitaires qui protègent le comportement dans le temps.', '## La docstring comme contrat

```python
def retirer_stock(stock: dict[str, int], article: str, quantite: int) -> int:
    """Retire une quantité du stock d''un article.

    Args:
        stock: Inventaire {article: quantité disponible}.
        article: Identifiant de l''article.
        quantite: Nombre d''unités à retirer (> 0).

    Returns:
        La nouvelle quantité disponible.

    Raises:
        ValueError: Si la quantité est invalide.
        KeyError: Si l''article n''existe pas.
        RuntimeError: Si le stock est insuffisant.
    """
    if quantite <= 0:
        raise ValueError("La quantité doit être positive")
    disponible = stock[article]
    if disponible < quantite:
        raise RuntimeError(f"Stock insuffisant ({disponible} restants)")
    stock[article] = disponible - quantite
    return stock[article]
```

Une bonne docstring permet d''utiliser la fonction sans lire son corps.

## 1. Tests avec assert

```python
def test_retirer_stock():
    stock = {"clavier": 10}
    assert retirer_stock(stock, "clavier", 3) == 7
    assert stock["clavier"] == 7

def test_stock_insuffisant():
    stock = {"clavier": 1}
    try:
        retirer_stock(stock, "clavier", 5)
    except RuntimeError:
        pass
    else:
        raise AssertionError("RuntimeError attendu")
```

## 2. Structurer avec pytest

```python
import pytest

def test_quantite_negative():
    with pytest.raises(ValueError, match="positive"):
        retirer_stock({"clavier": 10}, "clavier", -1)

def test_article_inconnu():
    with pytest.raises(KeyError):
        retirer_stock({}, "écran", 1)
```

```bash
pip install pytest
pytest -q
```

## 3. Choisir les cas

Pour chaque fonction, couvrez :

- le cas nominal ;
- les bornes (0, 1, maximum) ;
- les entrées invalides ;
- les effets de bord (le dictionnaire est-il modifié ?).

> **Règle** — Un test ne doit pas dépendre de l''ordre des autres tests. Créez un état neuf à chaque test plutôt que de partager un objet global.

## 4. Nommer ses tests

```python
def test_retirer_stock_refuse_quantite_negative(): ...
def test_retirer_stock_leve_erreur_si_stock_insuffisant(): ...
```

Le nom du test doit décrire la règle vérifiée. En cas d''échec, le rapport est auto-explicatif.

## Exercice rapide

Ajoutez trois tests à `convertir_minutes` : 0 minute, 59 minutes, 60 minutes, 725 minutes. Vérifiez le format exact des chaînes.', 55, 'python', array['Une docstring décrit contrat, paramètres et exceptions', 'Un test vérifie un comportement observable', 'Tester les cas limites, pas seulement le cas nominal']),
  ('fonctions-modules', 'fonctions', 5, 'Modules, packages et organisation du code', 'Découper un programme en fichiers importables et éviter les dépendances circulaires.', '## Un fichier = un module

```text
calculs/
├── __init__.py
├── moyenne.py
└── validation.py
```

```python
# calculs/moyenne.py
def moyenne(notes: list[float]) -> float:
    if not notes:
        raise ValueError("Aucune note")
    return sum(notes) / len(notes)
```

```python
# main.py
from calculs.moyenne import moyenne

print(moyenne([12, 15, 9]))
```

## 1. Imports propres

```python
# Évitez
from calculs.moyenne import *

# Préférez
from calculs.moyenne import moyenne
```

Un import explicite rend les dépendances visibles et évite les collisions de noms.

```python
# Alias utile quand le nom est long ou ambigu
import calculs.moyenne as stats
```

## 2. Éviter les imports circulaires

```text
a.py importe b.py
b.py importe a.py   ← import circulaire
```

Symptômes : `ImportError`, attributs manquants au démarrage. Solutions :

1. déplacer la logique partagée dans un troisième module ;
2. importer localement dans la fonction si le cycle est inévitable ;
3. revoir la séparation des responsabilités — un cycle révèle souvent un couplage excessif.

## 3. Point d''entrée mince

```python
# app/main.py
from app.cli import executer

if __name__ == "__main__":
    executer()
```

Toute la logique testable vit dans des modules importables. Le point d''entrée ne fait que lancer.

## 4. Exposer une API de package

```python
# calculs/__init__.py
from .moyenne import moyenne

__all__ = ["moyenne"]
```

```python
from calculs import moyenne
```

> **À retenir** — Un package n''est pas décoratif : il matérialise une frontière. Si deux modules s''importent mutuellement, la frontière est mal placée.

## Exercice rapide

Transformez votre calculateur de la phase 1 en package : `calculs/operations.py`, `calculs/validation.py`, `main.py`. Ajoutez un test qui importe uniquement `operations` et vérifie qu''aucune saisie utilisateur n''est déclenchée.', 50, 'python', array['Un module est un fichier .py', 'Un package est un dossier avec __init__.py', 'Le point d''entrée reste mince']),
  ('listes-et-tuples', 'structures-donnees', 1, 'Listes et tuples', 'Choisir entre collection mutable et immuable, et maîtriser les opérations de séquence.', '## Liste ou tuple ?

```python
notes = [12, 15, 9]          # liste : évolutive
coordonnees = (48.85, 2.35)  # tuple : fixe
```

Une liste sert à accumuler ou modifier. Un tuple sert à représenter une valeur composée stable (coordonnées, RGB, entrée d''historique).

## 1. Opérations courantes

```python
notes.append(18)        # ajoute en fin
notes.insert(1, 14)     # insère à l''indice 1
notes.remove(9)         # retire la première occurrence
derniere = notes.pop()  # retire et renvoie le dernier
notes.sort()            # trie sur place
print(sorted(notes))    # renvoie une copie triée
```

`sort()` modifie la liste et renvoie `None`. Une erreur classique :

```python
# notes = notes.sort()  # notes vaut None !
notes.sort()
```

## 2. Tranches

```python
semaine = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"]
print(semaine[:5])     # jours ouvrés
print(semaine[-2:])    # week-end
print(semaine[::2])    # un jour sur deux
```

Une tranche `[:]` crée une **copie superficielle** : la liste est nouvelle, mais les objets qu''elle contient sont partagés pour les types mutables.

```python
matrice = [[0, 0], [0, 0]]
copie = matrice[:]
copie[0][0] = 1
print(matrice[0][0])  # 1 !
```

Pour une copie profonde : `copy.deepcopy(matrice)`.

## 3. Déballage

```python
premier, *milieu, dernier = [1, 2, 3, 4, 5]
print(premier, milieu, dernier)  # 1 [2, 3, 4] 5

def position() -> tuple[float, float]:
    return 48.85, 2.35

latitude, longitude = position()
```

## 4. Trier avec une clé

```python
etudiants = [
    {"nom": "Ada", "score": 98},
    {"nom": "Linus", "score": 91},
    {"nom": "Grace", "score": 99},
]
classement = sorted(etudiants, key=lambda e: e["score"], reverse=True)
```

Le tri est stable : à score égal, l''ordre d''origine est conservé.

> **À retenir** — Choisissez la structure selon l''intention : une collection qui évolue est une liste ; une valeur composée immuable est un tuple.

## Exercice rapide

Écrivez `top_n(notes, n)` qui renvoie les n plus grandes notes sans modifier la liste d''origine. Testez avec `n > len(notes)`.', 60, 'python', array['Une liste est mutable, un tuple ne l''est pas', 'Les tranches créent des copies', 'Attention aux copies superficielles']),
  ('dictionnaires', 'structures-donnees', 2, 'Dictionnaires : modéliser des données nommées', 'Utiliser les tables de hachage pour associer des clés à des valeurs et compter efficacement.', '## Le dictionnaire, structure centrale

```python
profil = {
    "nom": "Ada Lovelace",
    "niveau": "intermediaire",
    "competences": ["Python", "SQL"],
}

print(profil["nom"])
print(profil.get("age", "non renseigné"))
```

`profil["age"]` lèverait une `KeyError`. `get` renvoie une valeur par défaut.

## 1. Mettre à jour

```python
profil["niveau"] = "avance"
profil["email"] = "ada@example.com"
del profil["competences"]

for cle, valeur in profil.items():
    print(f"{cle} = {valeur}")
```

## 2. Compter avec un dictionnaire

```python
texte = "le code doit etre lisible et le code doit etre teste"
compteur: dict[str, int] = {}

for mot in texte.split():
    compteur[mot] = compteur.get(mot, 0) + 1

print(compteur["code"])  # 2
```

Depuis Python 3.10, `collections.Counter` fait cela directement :

```python
from collections import Counter

frequences = Counter(texte.split())
print(frequences.most_common(3))
```

## 3. setdefault et regroupement

```python
par_categorie: dict[str, list[str]] = {}

for langage, categorie in [("Python", "backend"), ("SQL", "data"), ("Django", "backend")]:
    par_categorie.setdefault(categorie, []).append(langage)

print(par_categorie)
# {''backend'': [''Python'', ''Django''], ''data'': [''SQL'']}
```

## 4. Fusionner des dictionnaires

```python
defaut = {"theme": "clair", "langue": "fr"}
preferences = {"theme": "sombre"}

reglages = defaut | preferences
print(reglages["theme"])  # sombre
```

L''opérateur `|` (Python 3.9+) crée un nouveau dictionnaire. `update` modifie sur place.

## 5. Clés hachables

Une clé doit être immuable : `str`, `int`, `tuple`. Une liste ne peut pas être une clé.

```python
# KeyError / TypeError
# cache[[1, 2]] = "valeur"

cache[(1, 2)] = "valeur"  # tuple : OK
```

> **Piège** — L''ordre d''insertion est conservé, mais ne vous en servez pas comme d''un contrat métier. Si l''ordre compte, triez explicitement.

## Exercice rapide

À partir d''une liste de transactions `{"categorie": "livres", "montant": 24.9}`, calculez le total dépensé par catégorie. Utilisez `setdefault` ou `Counter` et affichez les catégories triées par montant décroissant.', 60, 'python', array['Accès O(1) en moyenne', 'get et setdefault évitent les KeyError', 'Les clés doivent être hachables']),
  ('ensembles', 'structures-donnees', 3, 'Ensembles et opérations sur les collections', 'Dédupliquer, comparer et croiser des données avec set, sans écrire de boucles manuelles.', '## Dédupliquer

```python
technologies = ["Python", "SQL", "Python", "Git", "SQL"]
uniques = set(technologies)
print(uniques)  # {''Python'', ''SQL'', ''Git''}
```

Pour conserver l''ordre d''apparition :

```python
uniques = list(dict.fromkeys(technologies))
print(uniques)  # [''Python'', ''SQL'', ''Git'']
```

## 1. Appartenance rapide

```python
langages = {"Python", "Rust", "TypeScript"}
print("Rust" in langages)  # True
```

Sur un `set`, le test `in` est en moyenne O(1) ; sur une liste, il est O(n).

## 2. Opérations ensemblistes

```python
backend = {"Python", "SQL", "Docker"}
data = {"Python", "SQL", "pandas"}

print(backend | data)   # union
print(backend & data)   # intersection
print(backend - data)   # différence
print(backend ^ data)   # différence symétrique
```

```python
competences_requises = {"Python", "SQL", "Git"}
competences_acquises = {"Python", "Git", "Docker"}

manquantes = competences_requises - competences_acquises
print(manquantes)  # {''SQL''}
```

## 3. Modifier un ensemble

```python
vues = set()
vues.add("lecon-01")
vues.add("lecon-01")  # ignoré
vues.discard("lecon-02")  # aucune erreur si absent
vues.remove("lecon-01")   # KeyError si absent

vues.update(["lecon-03", "lecon-04"])
```

## 4. Ensembles figés

```python
tags = frozenset({"python", "debutant"})
# utilisable comme clé de dictionnaire
index = {tags: "lecon-01"}
```

> **À retenir** — Un `set` n''a pas d''ordre. Ne l''utilisez pas quand l''ordre d''affichage est un contrat. Convertissez en liste triée au moment du rendu.

## Exercice rapide

Deux listes d''e-mails (inscrits, désabonnés) contiennent des doublons. Calculez : les adresses actives, les adresses désabonnées, et les adresses présentes dans les deux listes. Affichez le tout trié.', 45, 'python', array['Un set élimine les doublons', 'Les opérations ensemblistes sont rapides', 'L''ordre n''est pas garanti']),
  ('comprehensions', 'structures-donnees', 4, 'Compréhensions et générateurs', 'Transformer et filtrer des collections en une expression lisible, sans surcharger la mémoire.', '## De la boucle à l''expression

```python
# Boucle classique
carres = []
for nombre in range(1, 6):
    carres.append(nombre ** 2)

# Compréhension
carres = [nombre ** 2 for nombre in range(1, 6)]
```

Les deux produisent `[1, 4, 9, 16, 25]`.

## 1. Filtrer

```python
notes = [12, 7, 15, 4, 18]
admis = [note for note in notes if note >= 10]
print(admis)  # [12, 15, 18]
```

L''ordre de lecture : « garde `note` **si** `note >= 10` ».

## 2. Transformer

```python
etudiants = [{"nom": "ada", "score": 98}, {"nom": "linus", "score": 76}]
noms = [e["nom"].capitalize() for e in etudiants]
```

## 3. Dictionnaires et ensembles

```python
scores = {"Ada": 98, "Linus": 76}
passe = {nom: score for nom, score in scores.items() if score >= 80}
print(passe)  # {''Ada'': 98}

lettres = {c.lower() for c in "DevForge"}
```

## 4. Conditions imbriquées

```python
resultats = [
    "FizzBuzz" if n % 15 == 0 else "Fizz" if n % 3 == 0 else "Buzz" if n % 5 == 0 else str(n)
    for n in range(1, 16)
]
```

Cette expression est correcte mais difficile à relire. Au-delà de deux conditions, revenez à une fonction nommée.

## 5. Générateurs

Utilisez des parenthèses pour produire les valeurs à la demande :

```python
carres = (n ** 2 for n in range(1_000_000))
print(sum(carres))  # calcul sans stocker un million d''entiers
```

```python
def lignes_utiles(fichier):
    for ligne in fichier:
        ligne = ligne.strip()
        if ligne and not ligne.startswith("#"):
            yield ligne
```

Un générateur ne peut être parcouru qu''une seule fois.

> **Règle de lisibilité** — Une compréhension doit tenir sur une ligne courte et rester compréhensible à la lecture. Sinon, extrayez une fonction.

## Exercice rapide

À partir d''une liste de modules `{"titre": ..., "minutes": ..., "termine": bool}`, produisez la liste des titres terminés en moins de 90 minutes, puis la durée totale restante avec un générateur.', 55, 'python', array['La compréhension remplace une boucle d''accumulation', 'La condition de filtre se place à droite', 'Un générateur produit à la demande']),
  ('tri-et-agregation', 'structures-donnees', 5, 'Trier, rechercher et agréger', 'Utiliser les outils standards pour ordonner, rechercher et résumer des jeux de données.', '## Trier par critères multiples

```python
modules = [
    {"titre": "Python", "phase": 1, "minutes": 600},
    {"titre": "SQL", "phase": 1, "minutes": 480},
    {"titre": "Tests", "phase": 2, "minutes": 360},
    {"titre": "Git", "phase": 1, "minutes": 420},
]

par_phase_puis_duree = sorted(
    modules,
    key=lambda m: (m["phase"], -m["minutes"]),
)
```

Le tuple de clé est comparé de gauche à droite. Le signe `-` inverse seulement la durée.

## 1. Rechercher

```python
titres = [m["titre"] for m in modules]
print("SQL" in titres)  # True

sql = next((m for m in modules if m["titre"] == "SQL"), None)
if sql is None:
    print("Module introuvable")
```

Pour des recherches répétées sur une grande collection, construisez un index :

```python
index = {m["titre"]: m for m in modules}
print(index["SQL"]["minutes"])
```

## 2. Agréger

```python
duree_totale = sum(m["minutes"] for m in modules)
plus_long = max(modules, key=lambda m: m["minutes"])
plus_court = min(modules, key=lambda m: m["minutes"])

tous_courts = all(m["minutes"] <= 600 for m in modules)
au_moins_un_long = any(m["minutes"] > 500 for m in modules)
```

## 3. Regrouper

```python
from collections import defaultdict

par_phase: dict[int, list[str]] = defaultdict(list)
for module in modules:
    par_phase[module["phase"]].append(module["titre"])

print(dict(par_phase))
```

`defaultdict` crée la valeur par défaut à la première consultation, sans `setdefault`.

## 4. Paginer

```python
def paginer(elements: list, page: int, taille: int = 10) -> list:
    debut = (page - 1) * taille
    return elements[debut:debut + taille]
```

## 5. Attention aux performances

```python
# O(n²) : reconstruire une liste pour chaque élément
resultats = [x for x in tres_grande_liste if x in autre_grande_liste]

# O(n) : convertir la seconde liste en set
reference = set(autre_grande_liste)
resultats = [x for x in tres_grande_liste if x in reference]
```

> **À retenir** — Le bon outil dépend de la question : `in` pour l''appartenance, `index` pour l''accès par clé, `sorted` pour l''ordre, `any/all` pour les prédicats.

## Exercice rapide

À partir d''une liste de leçons `{"module": ..., "minutes": ..., "terminee": bool}`, calculez la durée totale par module, le taux de complétion global, et la leçon la plus longue encore inachevée.', 55, 'python', array['sorted renvoie une copie, list.sort trie sur place', 'La clé de tri peut être multiple', 'min, max, sum et any évitent des boucles']),
  ('poo-classes', 'poo', 1, 'Classes et objets : modéliser un domaine', 'Créer des classes qui regroupent état et comportement autour d''une responsabilité claire.', '## Une classe décrit un concept

```python
class Lecon:
    def __init__(self, titre: str, minutes: int) -> None:
        self.titre = titre
        self.minutes = minutes
        self.terminee = False

    def marquer_terminee(self) -> None:
        self.terminee = True

    def duree_lisible(self) -> str:
        heures, minutes = divmod(self.minutes, 60)
        return f"{heures} h {minutes:02d}"
```

```python
lecon = Lecon("Variables et types", 60)
lecon.marquer_terminee()
print(lecon.duree_lisible())  # 1 h 00
print(lecon.terminee)         # True
```

## 1. État et comportement

Une classe utile regroupe des données **et** les opérations qui maintiennent leur cohérence.

```python
class CompteBancaire:
    def __init__(self, titulaire: str, solde: float = 0.0) -> None:
        self.titulaire = titulaire
        self._solde = solde

    def deposer(self, montant: float) -> None:
        if montant <= 0:
            raise ValueError("Le montant doit être positif")
        self._solde += montant

    def retirer(self, montant: float) -> None:
        if montant <= 0:
            raise ValueError("Le montant doit être positif")
        if montant > self._solde:
            raise ValueError("Solde insuffisant")
        self._solde -= montant

    @property
    def solde(self) -> float:
        return self._solde
```

L''extérieur ne peut pas écrire `compte.solde = 1_000_000` : la cohérence est protégée.

## 2. Classes vs dictionnaires

```python
# Dictionnaire : aucune garantie
utilisateur = {"nom": "Ada", "email": "ada@example.com"}

# Classe : contrat explicite
class Utilisateur:
    def __init__(self, nom: str, email: str) -> None:
        self.nom = nom
        self.email = email
```

Pour de la donnée brute, un dictionnaire suffit. Pour un objet avec des invariants et des comportements, une classe est plus sûre.

## 3. Attributs de classe

```python
class Lecon:
    plateforme = "DEVFORGE"  # partagé par toutes les instances

    def __init__(self, titre: str) -> None:
        self.titre = titre
```

Un attribut de classe est partagé. Ne l''utilisez pas pour stocker un état propre à une instance.

> **Erreur classique** — Définir une liste comme attribut de classe et la modifier via une instance : toutes les instances partagent la même liste.

## Exercice rapide

Créez `Mission` avec `titre`, `difficulte` et `statut`. Ajoutez `demarrer()` qui passe le statut à `"en_cours"` et refuse si la mission est déjà terminée. Testez les transitions.', 60, 'python', array['__init__ initialise l''instance', 'self est l''instance courante', 'Une classe doit représenter un concept, pas un sac de données']),
  ('poo-encapsulation', 'poo', 2, 'Encapsulation, propriétés et invariants', 'Protéger les invariants d''un objet et exposer une interface stable grâce aux propriétés.', '## L''encapsulation en Python

Python ne possède pas de `private` strict. Une convention suffit :

- `_attribut` : interne, ne pas utiliser depuis l''extérieur ;
- `__attribut` : nom mangling, à réserver aux cas très particuliers.

```python
class Projet:
    def __init__(self, titre: str) -> None:
        self.titre = titre
        self._jalons: list[str] = []
```

## 1. Propriétés en lecture

```python
class Projet:
    def __init__(self, titre: str, jalons: list[str]) -> None:
        self.titre = titre
        self._jalons = list(jalons)

    @property
    def progression(self) -> int:
        if not self._jalons:
            return 0
        return 100
```

Une propriété se lit comme un attribut, mais exécute du code :

```python
print(projet.progression)  # 100
# projet.progression = 50  # AttributeError
```

## 2. Setter avec validation

```python
class Lecon:
    def __init__(self, titre: str, minutes: int) -> None:
        self.titre = titre
        self.minutes = minutes

    @property
    def minutes(self) -> int:
        return self._minutes

    @minutes.setter
    def minutes(self, valeur: int) -> None:
        if valeur <= 0:
            raise ValueError("La durée doit être positive")
        self._minutes = valeur
```

```python
lecon = Lecon("Boucles", 45)
lecon.minutes = 60    # OK
# lecon.minutes = -5  # ValueError
```

## 3. Invariants

Un invariant est une propriété qui doit toujours rester vraie.

```python
class PlageHoraire:
    def __init__(self, debut: int, fin: int) -> None:
        if debut >= fin:
            raise ValueError("Le début doit précéder la fin")
        self.debut = debut
        self.fin = fin

    @property
    def duree(self) -> int:
        return self.fin - self.debut
```

En validant à la construction et dans les setters, l''objet ne peut jamais exister dans un état incohérent.

## 4. Ne pas exposer sa liste interne

```python
class Equipe:
    def __init__(self) -> None:
        self._membres: list[str] = []

    def ajouter(self, nom: str) -> None:
        if nom not in self._membres:
            self._membres.append(nom)

    @property
    def membres(self) -> tuple[str, ...]:
        return tuple(self._membres)
```

La copie empêche l''appelant de contourner `ajouter`.

> **À retenir** — En Python, l''encapsulation est une discipline, pas une barrière. Le contrat doit être évident dans le code et documenté.

## Exercice rapide

Créez `MotDePasse` qui accepte une chaîne à la construction, n''expose jamais la valeur en clair, et fournit `verifier(candidat)` et `est_fort()`. Ajoutez un invariant : au moins 8 caractères.', 55, 'python', array['Un underscore signale un usage interne', '@property expose un attribut calculé', 'Les setters valident avant de modifier']),
  ('poo-heritage', 'poo', 3, 'Héritage, composition et polymorphisme', 'Choisir entre hériter et composer, et utiliser le polymorphisme sans hiérarchies fragiles.', '## Héritage : une relation forte

```python
class Contenu:
    def __init__(self, titre: str) -> None:
        self.titre = titre

    def resumer(self) -> str:
        return self.titre

class Lecon(Contenu):
    def __init__(self, titre: str, minutes: int) -> None:
        super().__init__(titre)
        self.minutes = minutes

    def resumer(self) -> str:
        return f"{self.titre} — {self.minutes} min"
```

`Lecon` **est un** `Contenu`. Le `super().__init__` garantit l''initialisation de la classe parente.

## 1. Polymorphisme

```python
contenus: list[Contenu] = [
    Contenu("Bibliothèque"),
    Lecon("Fonctions", 45),
]

for contenu in contenus:
    print(contenu.resumer())
```

Le code appelant n''a pas besoin de connaître le type exact. C''est le polymorphisme.

## 2. Classes abstraites

```python
from abc import ABC, abstractmethod

class Evaluation(ABC):
    @abstractmethod
    def score(self) -> float:
        ...

    def est_reussie(self) -> bool:
        return self.score() >= 60

class QCM(Evaluation):
    def __init__(self, bonnes: int, total: int) -> None:
        self.bonnes = bonnes
        self.total = total

    def score(self) -> float:
        return self.bonnes / self.total * 100
```

`Evaluation()` lève une `TypeError`. Toute sous-classe doit fournir `score`.

## 3. Composition

```python
class MoteurRecherche:
    def __init__(self) -> None:
        self._index: dict[str, list[str]] = {}

    def indexer(self, mot: str, lecon: str) -> None:
        self._index.setdefault(mot, []).append(lecon)

class Application:
    def __init__(self, moteur: MoteurRecherche) -> None:
        self._moteur = moteur
```

`Application` **a un** moteur. On peut remplacer l''implémentation dans un test.

## 4. Quand éviter l''héritage

N''héritez pas pour réutiliser trois lignes. N''héritez pas si la relation « est un » n''est pas évidente. Une hiérarchie profonde rend les changements risqués.

```python
# Fragile
class LeconAvecPDF(Lecon, Exportable, Notifiable, Cacheable): ...

# Plus clair
class Lecon:
    def __init__(self, exporteur: Exporteur, notificateur: Notificateur): ...
```

> **Règle** — Commencez par la composition. Introduisez l''héritage seulement lorsqu''un contrat commun le justifie.

## Exercice rapide

Modélisez `Exercice` et `Evaluation` comme deux sous-classes de `Activite`, avec une méthode commune `duree_estimee()`. Puis refactorisez `Evaluation` pour composer un `Barème` au lieu d''hériter de `QCM`.', 60, 'python', array['hériter exprime un « est un »', 'composer exprime un « a un »', 'Préférer la composition dans la majorité des cas']),
  ('poo-methodes-speciales', 'poo', 4, 'Méthodes spéciales et protocoles Python', 'Rendre ses objets naturels à utiliser : affichage, comparaison, itération et contexte.', '## __repr__ et __str__

```python
class Lecon:
    def __init__(self, slug: str, titre: str) -> None:
        self.slug = slug
        self.titre = titre

    def __repr__(self) -> str:
        return f"Lecon(slug={self.slug!r}, titre={self.titre!r})"

    def __str__(self) -> str:
        return self.titre

lecon = Lecon("python-variables-types", "Variables et types")
print(lecon)      # Variables et types
print(repr(lecon))# Lecon(slug=''python-variables-types'', titre=''Variables et types'')
```

`__repr__` doit idéalement permettre de recréer l''objet.

## 1. Égalité et hachage

```python
class Competence:
    def __init__(self, nom: str) -> None:
        self.nom = nom

    def __eq__(self, autre: object) -> bool:
        if not isinstance(autre, Competence):
            return NotImplemented
        return self.nom == autre.nom

    def __hash__(self) -> int:
        return hash(self.nom)
```

Sans `__hash__`, l''objet devient non hachable quand `__eq__` est redéfini.

## 2. Itération

```python
class Programme:
    def __init__(self, modules: list[str]) -> None:
        self._modules = modules

    def __iter__(self):
        return iter(self._modules)

for module in Programme(["Python", "SQL"]):
    print(module)
```

## 3. Contexte

```python
class Session:
    def __init__(self, fichier: str) -> None:
        self.fichier = fichier
        self.handle = None

    def __enter__(self):
        self.handle = open(self.fichier, "a", encoding="utf-8")
        return self

    def __exit__(self, exc_type, exc, traceback) -> None:
        if self.handle:
            self.handle.close()

with Session("journal.log") as session:
    session.handle.write("Nouvelle session\n")
```

`__exit__` est appelé même en cas d''exception. C''est la garantie du `with`.

## 4. Longueur et opérateurs

```python
class Parcours:
    def __init__(self, lecons: list[str]) -> None:
        self.lecons = lecons

    def __len__(self) -> int:
        return len(self.lecons)

    def __getitem__(self, index: int) -> str:
        return self.lecons[index]

parcours = Parcours(["a", "b", "c"])
print(len(parcours))   # 3
print(parcours[1])     # b
```

> **À retenir** — Les méthodes spéciales ne s''appellent pas directement : elles sont déclenchées par la syntaxe Python. Respectez les protocoles plutôt que d''inventer des méthodes `afficher()` ou `egale()`.

## Exercice rapide

Implémentez `Historique` qui stocke des leçons, supporte `len()`, l''itération, et `__repr__`. Ajoutez `__contains__` pour tester si une leçon a déjà été vue.', 60, 'python', array['__repr__ sert au débogage, __str__ à l''utilisateur', '__eq__ définit l''égalité métier', '__enter__ / __exit__ gèrent les ressources']),
  ('poo-dataclasses', 'poo', 5, 'Dataclasses et typage', 'Écrire des objets de données concis, immuables si nécessaire, et correctement typés.', '## Moins de code répétitif

```python
from dataclasses import dataclass, field

@dataclass
class Lecon:
    slug: str
    titre: str
    minutes: int
    terminee: bool = False
    tags: list[str] = field(default_factory=list)
```

`Lecon("python", "Python", 60)` fonctionne immédiatement. `__init__`, `__repr__` et `__eq__` sont générés.

```python
a = Lecon("python", "Python", 60)
b = Lecon("python", "Python", 60)
print(a == b)  # True
```

## 1. Valeurs par défaut sûres

```python
@dataclass
class Projet:
    titre: str
    technologies: list[str] = field(default_factory=list)
```

`field(default_factory=list)` crée une nouvelle liste pour chaque instance. C''est la seule façon correcte de mettre une valeur mutable par défaut.

## 2. Immuabilité

```python
@dataclass(frozen=True)
class Point:
    x: float
    y: float
```

Un `frozen=True` interdit la modification après création. Ces objets sont hachables et peuvent servir de clés de dictionnaire.

## 3. Validation dans __post_init__

```python
@dataclass
class Note:
    matiere: str
    valeur: float

    def __post_init__(self) -> None:
        if not 0 <= self.valeur <= 20:
            raise ValueError("La note doit être entre 0 et 20")
```

## 4. Tri et comparaison

```python
@dataclass(order=True)
class Module:
    position: int
    titre: str

modules = sorted([
    Module(2, "SQL"),
    Module(1, "Python"),
])
```

`order=True` génère les comparaisons basées sur l''ordre des champs.

## 5. Typage statique

```python
from typing import Literal

Statut = Literal["todo", "en_cours", "termine"]

@dataclass
class Mission:
    titre: str
    statut: Statut = "todo"
```

`Literal` restreint les valeurs possibles. Un vérificateur comme mypy signalera `statut="fini"`.

> **À retenir** — Une dataclass est adaptée aux objets porteurs de données. Si l''objet a un cycle de vie complexe et des invariants forts, une classe explicite reste parfois plus claire.

## Exercice rapide

Modélisez `Progression` avec `lecon`, `statut` (Literal), `score` optionnel et une date. Ajoutez une validation : `score` obligatoire si `statut == "termine"`. Testez la construction invalide.', 50, 'python', array['@dataclass génère __init__, __repr__ et __eq__', 'field(default_factory=...) pour les valeurs mutables', 'frozen=True pour un objet immuable']),
  ('complexite', 'algorithmique', 1, 'Complexité algorithmique et notation Big O', 'Estimer le coût d''un algorithme et reconnaître les complexités qui posent problème à grande échelle.', '## Mesurer la croissance

La notation Big O décrit la façon dont le temps d''exécution croît quand la taille d''entrée `n` augmente. Un facteur constant est ignoré : `O(3n)` s''écrit `O(n)`.

| Complexité | n = 10 | n = 1 000 | n = 100 000 |
| --- | --- | --- | --- |
| O(1) | 1 | 1 | 1 |
| O(log n) | 3 | 10 | 17 |
| O(n) | 10 | 1 000 | 100 000 |
| O(n log n) | 33 | 10 000 | 1 700 000 |
| O(n²) | 100 | 1 000 000 | 10 milliards |

## 1. Lire une fonction

```python
def somme(liste: list[int]) -> int:
    total = 0                 # O(1)
    for valeur in liste:      # n itérations
        total += valeur       # O(1) par itération
    return total              # O(1)
```

Complexité temporelle : **O(n)**. Complexité spatiale : **O(1)** — une seule variable `total`.

```python
def contient_doublon(liste: list[int]) -> bool:
    for i in range(len(liste)):
        for j in range(i + 1, len(liste)):
            if liste[i] == liste[j]:
                return True
    return False
```

Une double boucle sur la même liste donne **O(n²)**.

## 2. Améliorer avec la bonne structure

```python
def contient_doublon(liste: list[int]) -> bool:
    vus = set()
    for valeur in liste:
        if valeur in vus:
            return True
        vus.add(valeur)
    return False
```

**O(n)** en temps, **O(n)** en espace. C''est le compromis classique : on paie de la mémoire pour gagner du temps.

## 3. Complexité spatiale

```python
def doubler(liste: list[int]) -> list[int]:
    return [x * 2 for x in liste]  # O(n) d''espace
```

Un générateur réduit l''empreinte :

```python
def doubler_paresseux(liste: list[int]):
    for x in liste:
        yield x * 2
```

## 4. Cas favorable, défavorable, moyen

```python
def chercher(liste: list[int], cible: int) -> int:
    for index, valeur in enumerate(liste):
        if valeur == cible:
            return index
    return -1
```

- meilleur cas : la cible est en première position → O(1) ;
- pire cas : absente → O(n) ;
- on annonce généralement le **pire cas**.

> **À retenir** — Big O décrit une tendance, pas une performance absolue. Pour `n = 20`, une boucle O(n²) peut être plus rapide qu''une structure complexe à cause des constantes.

## Exercice rapide

Analysez ces deux fonctions et donnez leur complexité temporelle et spatiale. Laquelle choisiriez-vous pour une liste de 10 000 éléments ? Pourquoi ?

```python
def a(liste):
    return len(set(liste)) == len(liste)

def b(liste):
    for i, x in enumerate(liste):
        if x in liste[i + 1:]:
            return False
    return True
```', 65, 'python', array['On mesure la croissance, pas les secondes', 'O(1) < O(log n) < O(n) < O(n log n) < O(n²)', 'La boucle imbriquée est souvent le signal d''alerte']),
  ('recherche', 'algorithmique', 2, 'Recherche linéaire et dichotomique', 'Retrouver une valeur dans une collection, puis exploiter un tri pour diviser le travail par deux.', '## Recherche linéaire

```python
def recherche_lineaire(liste: list[int], cible: int) -> int:
    for index, valeur in enumerate(liste):
        if valeur == cible:
            return index
    return -1
```

Simple, correcte sur une collection non triée. Coût : O(n).

## 1. Recherche dichotomique

Principe : comparer la cible au milieu, puis éliminer la moitié inutile.

```python
def recherche_dichotomique(liste: list[int], cible: int) -> int:
    debut, fin = 0, len(liste) - 1
    while debut <= fin:
        milieu = (debut + fin) // 2
        if liste[milieu] == cible:
            return milieu
        if liste[milieu] < cible:
            debut = milieu + 1
        else:
            fin = milieu - 1
    return -1
```

```python
nombres = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print(recherche_dichotomique(nombres, 23))  # 5
print(recherche_dichotomique(nombres, 7))   # -1
```

À chaque itération, l''espace de recherche est divisé par deux : **O(log n)**.

## 2. La condition indispensable

La dichotomie n''est valide que sur une collection **triée**. Sur une liste quelconque, elle renvoie un résultat faux sans erreur. C''est un piège fréquent.

```python
def rechercher(liste: list[int], cible: int) -> int:
    if liste != sorted(liste):
        raise ValueError("La liste doit être triée")
    return recherche_dichotomique(liste, cible)
```

La vérification coûte O(n log n) si on trie, ce qui annule le bénéfice pour une seule recherche. Elle est pertinente si la liste est réutilisée.

## 3. Recherche par borne

Pour trouver la première occurrence dans une liste triée avec doublons :

```python
def premiere_occurrence(liste: list[int], cible: int) -> int:
    debut, fin = 0, len(liste)
    while debut < fin:
        milieu = (debut + fin) // 2
        if liste[milieu] < cible:
            debut = milieu + 1
        else:
            fin = milieu
    if debut < len(liste) and liste[debut] == cible:
        return debut
    return -1
```

Cette variante est plus difficile à écrire mais évite les erreurs de bornes.

## 4. Le module bisect

```python
import bisect

liste = [1, 3, 3, 5, 8]
print(bisect.bisect_left(liste, 3))   # 1
print(bisect.bisect_right(liste, 3))  # 3
```

> **À retenir** — Choisissez la recherche linéaire pour une petite collection ou une seule requête. Utilisez la dichotomie quand la collection est triée et interrogée de nombreuses fois.

## Exercice rapide

Implémentez `recherche_dichotomique` sans utiliser de bibliothèque et vérifiez-la sur : liste vide, un élément présent, un élément absent, cible plus petite que tout, cible plus grande que tout.', 55, 'python', array['La recherche linéaire est O(n)', 'La dichotomie exige une collection triée', 'La dichotomie est O(log n)']),
  ('algorithmes-tri', 'algorithmique', 3, 'Algorithmes de tri', 'Comprendre le tri par insertion et le tri fusion, et savoir pourquoi Timsort domine en pratique.', '## Tri par insertion

Comme on trie des cartes dans la main : on insère chaque élément à sa place dans la partie déjà triée.

```python
def tri_insertion(liste: list[int]) -> list[int]:
    resultat = list(liste)
    for i in range(1, len(resultat)):
        valeur = resultat[i]
        j = i - 1
        while j >= 0 and resultat[j] > valeur:
            resultat[j + 1] = resultat[j]
            j -= 1
        resultat[j + 1] = valeur
    return resultat
```

Très efficace sur de petites listes ou des listes presque triées, O(n²) au pire.

## 1. Tri fusion

Diviser, trier chaque moitié, fusionner.

```python
def tri_fusion(liste: list[int]) -> list[int]:
    if len(liste) <= 1:
        return list(liste)
    milieu = len(liste) // 2
    gauche = tri_fusion(liste[:milieu])
    droite = tri_fusion(liste[milieu:])

    resultat: list[int] = []
    i = j = 0
    while i < len(gauche) and j < len(droite):
        if gauche[i] <= droite[j]:
            resultat.append(gauche[i])
            i += 1
        else:
            resultat.append(droite[j])
            j += 1
    resultat.extend(gauche[i:])
    resultat.extend(droite[j:])
    return resultat
```

Complexité : **O(n log n)** dans tous les cas. Espace : O(n).

## 2. Le tri natif de Python

```python
nombres = [5, 2, 9, 1]
print(sorted(nombres))  # [1, 2, 5, 9]

modules = [{"titre": "SQL", "minutes": 480}, {"titre": "Git", "minutes": 420}]
modules.sort(key=lambda m: m["minutes"], reverse=True)
```

Timsort exploite les séquences déjà ordonnées et garantit O(n log n) au pire. Il est **stable**.

## 3. Stabilité

Un tri est stable si deux éléments égaux conservent leur ordre relatif.

```python
personnes = [("Ada", 30), ("Grace", 30), ("Linus", 25)]
par_age = sorted(personnes, key=lambda p: p[1])
# [(''Linus'', 25), (''Ada'', 30), (''Grace'', 30)]
```

Ada reste avant Grace. Cela permet des tris multi-critères par passes successives.

## 4. Choisir

| Contexte | Choix |
| --- | --- |
| Usage général | `sorted` / `list.sort` |
| Petite liste presque triée | insertion |
| Besoin pédagogique de diviser | fusion |
| Mémoire très contrainte | tri en place |

> **À retenir** — En production, utilisez le tri natif. Comprendre les algorithmes sert à raisonner sur les coûts et à reconnaître les situations où un tri est inutile.

## Exercice rapide

Écrivez `tri_par_score(etudiants)` qui trie par score décroissant, puis par nom croissant à score égal, sans muter la liste d''origine. Vérifiez la stabilité.', 60, 'python', array['Le tri par insertion est simple mais O(n²)', 'Le tri fusion est O(n log n)', 'Python utilise Timsort, stable et adaptatif']),
  ('recursion', 'algorithmique', 4, 'Récursivité et diviser pour régner', 'Décomposer un problème en sous-problèmes identiques et maîtriser la condition d''arrêt.', '## Une fonction qui s''appelle elle-même

```python
def factorielle(n: int) -> int:
    if n <= 1:
        return 1
    return n * factorielle(n - 1)
```

Deux éléments obligatoires :

1. **cas de base** : `n <= 1` ;
2. **progression** : `n - 1` se rapproche du cas de base.

Sans réduction, la récursion est infinie et provoque `RecursionError`.

## 1. Vérifier une structure imbriquée

```python
def profondeur(structure: object) -> int:
    if isinstance(structure, list):
        if not structure:
            return 1
        return 1 + max(profondeur(element) for element in structure)
    return 0

print(profondeur([1, [2, [3, [4]]]]))  # 4
```

La récursivité est naturelle pour des arbres et des structures imbriquées.

## 2. Diviser pour régner

```python
def puissance_rapide(base: int, exposant: int) -> int:
    if exposant == 0:
        return 1
    if exposant % 2 == 0:
        moitie = puissance_rapide(base, exposant // 2)
        return moitie * moitie
    return base * puissance_rapide(base, exposant - 1)
```

Complexité : O(log n) au lieu de O(n).

## 3. Mémoïsation

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fibonacci(n: int) -> int:
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
```

Sans cache, `fibonacci(35)` effectue des millions d''appels redondants.

## 4. Limites

```python
import sys
print(sys.getrecursionlimit())  # 1000 par défaut
```

La pile est limitée. Pour traiter 100 000 éléments, préférez une boucle ou un algorithme itératif. On peut aussi transformer une récursion terminale en boucle.

> **À retenir** — La récursivité est un outil de clarté, pas de performance brute. Si la structure du problème est récursive (arbre, graphe, expression), elle est souvent le meilleur choix.

## Exercice rapide

Écrivez `somme_liste(liste)` de façon récursive, puis une version itérative. Ajoutez `flatten(structure)` qui renvoie une liste plate de tous les éléments imbriqués.', 55, 'python', array['Toute récursion a besoin d''un cas de base', 'Chaque appel consomme de la pile', 'La mémoïsation évite les calculs redondants']),
  ('graphes-introduction', 'algorithmique', 5, 'Graphes : parcours en largeur et en profondeur', 'Représenter un réseau de dépendances et le parcourir avec BFS et DFS.', '## Représenter un graphe

```python
graphe = {
    "python": ["algorithmique", "git"],
    "algorithmique": ["structures"],
    "git": ["github"],
    "structures": [],
    "github": [],
}
```

Chaque clé est un nœud ; la valeur liste ses voisins. C''est une **liste d''adjacence**.

## 1. Parcours en largeur (BFS)

```python
from collections import deque

def bfs(graphe: dict[str, list[str]], depart: str) -> list[str]:
    visites = {depart}
    file = deque([depart])
    ordre: list[str] = []

    while file:
        noeud = file.popleft()
        ordre.append(noeud)
        for voisin in graphe.get(noeud, []):
            if voisin not in visites:
                visites.add(voisin)
                file.append(voisin)
    return ordre
```

BFS trouve le **plus court chemin en nombre d''arêtes** dans un graphe non pondéré.

## 2. Parcours en profondeur (DFS)

```python
def dfs(graphe: dict[str, list[str]], depart: str) -> list[str]:
    visites: set[str] = set()
    ordre: list[str] = []

    def explorer(noeud: str) -> None:
        visites.add(noeud)
        ordre.append(noeud)
        for voisin in graphe.get(noeud, []):
            if voisin not in visites:
                explorer(voisin)

    explorer(depart)
    return ordre
```

DFS sert à détecter des cycles, trier topologiquement ou explorer toutes les branches.

## 3. Détecter un cycle

```python
def a_un_cycle(graphe: dict[str, list[str]]) -> bool:
    en_cours: set[str] = set()
    termines: set[str] = set()

    def visiter(noeud: str) -> bool:
        if noeud in en_cours:
            return True
        if noeud in termines:
            return False
        en_cours.add(noeud)
        for voisin in graphe.get(noeud, []):
            if visiter(voisin):
                return True
        en_cours.remove(noeud)
        termines.add(noeud)
        return False

    return any(visiter(noeud) for noeud in graphe)
```

`en_cours` contient le chemin actuel ; `termines` mémorise les nœuds déjà validés.

## 4. Complexité

Pour un graphe `V` sommets et `E` arêtes : **O(V + E)** en temps, O(V) en espace.

> **À retenir** — Le marquage des nœuds visités n''est pas une optimisation : sans lui, un cycle provoque une boucle infinie.

## Exercice rapide

Modélisez les prérequis entre modules DEVFORGE sous forme de graphe. Écrivez `ordre_valide(graphe)` qui renvoie un ordre de validation compatible avec les prérequis (tri topologique).', 65, 'python', array['BFS explore par niveaux, avec une file', 'DFS explore une branche, avec une pile', 'Toujours marquer les nœuds visités']),
  ('git-fondamentaux', 'git-github', 1, 'Git : comprendre le modèle avant les commandes', 'Comprendre les trois espaces de Git et versionner un projet local proprement.', '## Trois espaces

```text
Répertoire de travail  →  Index (staging)  →  Dépôt local
        git add                git commit
```

- **Répertoire de travail** : vos fichiers modifiés.
- **Index** : la sélection exacte qui sera commitée.
- **Dépôt local** : l''historique des commits.

## 1. Initialiser

```bash
mkdir devforge-notes && cd devforge-notes
git init
git status
```

`git init` crée un dossier `.git` qui contient tout l''historique.

## 2. Configurer son identité

```bash
git config --global user.name "Votre Nom"
git config --global user.email "vous@example.com"
git config --global init.defaultBranch main
```

Ces informations figurent dans chaque commit. Utilisez l''adresse associée à votre compte GitHub.

## 3. Le cycle de base

```bash
# Créer un fichier
echo "# Mes notes DEVFORGE" > README.md

git add README.md
git commit -m "docs: ajoute le README du projet"

git log --oneline
```

## 4. Un commit atomique

Un commit doit raconter **une** intention :

- `feat: ajoute le calcul de moyenne`
- `fix: corrige la division par zéro`
- `docs: documente les paramètres`
- `test: couvre les cas limites`

Évitez `update`, `fix`, `modifs`. Un historique lisible est un outil de diagnostic.

## 5. Le .gitignore

```gitignore
.venv/
__pycache__/
*.pyc
.env
data/*.sqlite3
node_modules/
```

Ne versionnez jamais de secrets ni d''environnements virtuels.

> **À retenir** — Git stocke des **instantanés** de l''arbre de fichiers, identifiés par un hash. Les commits forment un graphe orienté acyclique, pas une simple liste.

## Exercice rapide

Initialisez un dépôt, créez un fichier `notes.md`, ajoutez une ligne, commitez. Modifiez le fichier, puis utilisez `git diff` avant et après `git add` pour observer la différence entre répertoire de travail et index.', 50, 'bash', array['Git enregistre des instantanés, pas des différences', 'Trois zones : répertoire, index, historique', 'Un commit doit être atomique']),
  ('git-commits-historique', 'git-github', 2, 'Commits, diffs et historique', 'Inspecter ce qui a changé, revenir en arrière sans perdre de travail et préparer des commits propres.', '## Voir ce qui a changé

```bash
git status              # état synthétique
git diff                # travail vs index
git diff --staged       # index vs dernier commit
git diff HEAD           # travail vs dernier commit
```

## 1. Lire l''historique

```bash
git log --oneline --graph --decorate
git log -p -- README.md      # historique d''un fichier
git show HEAD                # détail du dernier commit
```

## 2. Corriger le dernier commit

```bash
git add fichier_oublie.py
git commit --amend -m "feat: ajoute la validation des entrées"
```

`--amend` réécrit le dernier commit. **Ne l''utilisez jamais** sur un commit déjà poussé et partagé sans coordination.

## 3. Annuler proprement

```bash
# Défait les modifications d''un fichier non ajouté
git restore fichier.py

# Retire un fichier de l''index sans perdre les modifications
git restore --staged fichier.py

# Annule un commit local en gardant les modifications
git reset --soft HEAD~1

# Annule un commit local ET les modifications
git reset --hard HEAD~1
```

`reset --hard` est destructif. Vérifiez deux fois avant d''exécuter.

## 4. Le stash

```bash
git stash push -m "travail en cours sur le parser"
git stash list
git stash pop
```

Le stash met de côté des modifications non commitées pour changer de branche sans commit intermédiaire.

## 5. Revenir à un commit sans réécrire

```bash
git revert <hash>
```

`revert` crée un nouveau commit qui inverse les changements. C''est la méthode sûre sur une branche partagée.

> **À retenir** — `reset` réécrit l''historique local ; `revert` ajoute un commit correctif. En équipe, préférez `revert`.

## Exercice rapide

Dans un dépôt de test : créez trois commits, inspectez-les avec `git log -p`, puis annulez le dernier avec `git revert`. Vérifiez que l''historique contient bien quatre commits.', 50, 'bash', array['git diff compare travail et index', 'git log --oneline pour l''essentiel', 'git restore défait une modification non commitée']),
  ('git-branches', 'git-github', 3, 'Branches, fusion et conflits', 'Travailler en parallèle, fusionner proprement et résoudre un conflit sans panique.', '## Une branche est un pointeur

```bash
git branch                    # lister
git switch -c feat/validation # créer et basculer
git switch main               # revenir
git branch -d feat/validation # supprimer après fusion
```

Créer une branche ne copie pas les fichiers : c''est un déplacement de pointeur.

## 1. Fusion

```bash
git switch main
git merge feat/validation
```

Si `main` n''a pas divergé, Git avance simplement le pointeur (**fast-forward**). Sinon, il crée un commit de fusion.

## 2. Résoudre un conflit

Git signale les fichiers concernés :

```text
CONFLICT (content): Merge conflict in src/validation.py
```

Le fichier contient des marqueurs :

```python
<<<<<<< HEAD
if age < 18:
=======
if age <= 18:
>>>>>>> feat/validation
```

Étapes :

1. ouvrir le fichier et choisir la version correcte ;
2. supprimer les marqueurs ;
3. tester ;
4. `git add` puis `git commit`.

```bash
git add src/validation.py
git commit -m "merge: aligne la règle d''âge sur 18 ans"
```

Pour abandonner la fusion :

```bash
git merge --abort
```

## 3. Rebaser, avec prudence

```bash
git switch feat/validation
git rebase main
```

Le rebase rejoue les commits de la branche au sommet de `main`. L''historique est linéaire, mais les commits sont réécrits. Ne rebasez pas une branche partagée.

## 4. Bonnes pratiques

- Une branche par intention, nommée `feat/`, `fix/`, `docs/`.
- Des commits petits et cohérents.
- Synchronisez `main` avant de démarrer.
- Supprimez les branches fusionnées.

> **À retenir** — Un conflit n''est pas une erreur : c''est Git qui vous demande de choisir entre deux intentions incompatibles. Lisez les deux versions avant de trancher.

## Exercice rapide

Créez une branche, modifiez la même ligne que sur `main` dans deux branches distinctes, puis fusionnez. Résolvez le conflit en conservant la règle la plus stricte et documentez votre choix dans le message de commit.', 55, 'bash', array['Une branche est un pointeur vers un commit', 'Fusionner = intégrer un historique', 'Un conflit se résout à la main puis se commit']),
  ('github-collaboration', 'git-github', 4, 'GitHub, pull requests et revue de code', 'Publier un dépôt, proposer une contribution et participer à une revue constructive.', '## Relier un dépôt local

```bash
git remote add origin git@github.com:utilisateur/devforge-notes.git
git branch -M main
git push -u origin main
```

`-u` associe la branche locale à la branche distante : les prochains `git push` suffisent.

## 1. Récupérer les changements

```bash
git fetch origin
git pull --rebase origin main
```

`pull --rebase` rejoue vos commits locaux au-dessus de la version distante, pour un historique linéaire.

## 2. Pousser une branche

```bash
git switch -c feat/export-markdown
# commits…
git push -u origin feat/export-markdown
```

GitHub affiche alors un lien pour ouvrir une pull request.

## 3. Une bonne pull request

```markdown
## Objectif
Permettre l''export du parcours en Markdown.

## Changements
- Ajout de `export_markdown()`
- Route `/parcours/export`
- Tests sur les modules vides

## Vérifications
- [x] pytest
- [x] mypy
- [x] test manuel de la route
```

Une PR doit permettre à un relecteur de comprendre **quoi**, **pourquoi** et **comment vérifier**.

## 4. Revue de code

- Commentez des lignes précises, pas le fichier entier.
- Posez des questions plutôt que d''asséner : « Que se passe-t-il si la liste est vide ? »
- Distinguez bloquant et suggestion : « nit: », « suggestion: », « blocking: ».
- Approuvez explicitement quand tout est bon.

## 5. Protéger main

Sur GitHub : branch protection, revue obligatoire, statut CI vert avant fusion. Cela évite de pousser directement sur la branche principale.

> **À retenir** — Un dépôt public est un portfolio. Soignez le README, les tests et l''historique : un recruteur lira le README avant le code.

## Exercice rapide

Publiez votre calculateur de la phase 1 sur GitHub avec un README contenant : description, prérequis, installation, utilisation, exemple de sortie et tests. Ajoutez une licence MIT.', 50, 'bash', array['origin est le dépôt distant principal', 'Une PR décrit un changement et son pourquoi', 'La revue porte sur le code, pas sur la personne']),
  ('git-bonnes-pratiques', 'git-github', 5, 'Bonnes pratiques et automatisation', 'Adopter un flux de travail reproductible, des hooks utiles et une CI minimale.', '## Un flux de travail simple

1. synchroniser `main` ;
2. créer une branche descriptive ;
3. coder par petits commits ;
4. lancer les tests localement ;
5. ouvrir une pull request ;
6. faire relire ;
7. fusionner et supprimer la branche.

Ce flux suffit pour un projet personnel et pour la majorité des équipes.

## 1. Modèles de README

```markdown
# Nom du projet

Une phrase qui explique le problème résolu.

## Fonctionnalités
- ...

## Installation
```bash
git clone ...
python -m venv .venv
pip install -r requirements.txt
```

## Utilisation
...
## Tests
```bash
pytest
```
```

## 2. Hooks locaux

Un hook `pre-commit` peut exécuter le formateur et les tests rapides.

```bash
# .git/hooks/pre-commit
#!/bin/sh
set -e
pytest -q
```

```bash
chmod +x .git/hooks/pre-commit
```

Les hooks locaux ne sont pas versionnés. `pre-commit` (le package) ou `husky` permettent de les partager.

## 3. Intégration continue

```yaml
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
```

## 4. Sécurité

- Aucun secret dans le code, même dans un dépôt privé.
- `.env` ignoré ; `.env.example` versionné.
- Si un secret fuite, révoquez-le immédiatement : supprimer le commit ne suffit pas.
- Activez l''alerte de secrets GitHub.

## 5. Revue de son propre diff

Avant de pousser :

```bash
git diff --check
git diff main...HEAD
```

Relisez comme si vous relisiez le code d''un autre : noms, cas limites, logs oubliés, code mort.

> **À retenir** — L''automatisation ne remplace pas la rigueur, elle la rend reproductible. Commencez par trois vérifications : tests, types, secrets.

## Exercice rapide

Ajoutez à votre dépôt un fichier `CONTRIBUTING.md`, un workflow CI et un `.env.example`. Vérifiez que la CI passe sur une pull request de démonstration.', 45, 'bash', array['Un flux simple vaut mieux qu''un processus complexe', 'Les hooks bloquent les erreurs avant le commit', 'La CI vérifie ce que l''humain oublie']),
  ('projet-cahier-des-charges', 'projet-fondamentaux', 1, 'Cadrer le projet : cahier des charges', 'Transformer une idée en périmètre livrable, avec des critères d''acceptation vérifiables.', '## Le problème avant la solution

Le projet de synthèse : une **application en ligne de commande de suivi de tâches**, persistante, testée et versionnée.

Écrivez d''abord le problème : « Je veux suivre mes tâches d''apprentissage sans dépendre d''un outil externe, et retrouver mon état après redémarrage. »

## 1. Périmètre du MVP

Fonctionnalités incluses :

- ajouter une tâche avec un titre ;
- lister les tâches triées par date ;
- marquer une tâche terminée ;
- supprimer une tâche ;
- persister dans un fichier JSON ;
- afficher des statistiques simples.

Hors périmètre :

- interface graphique web ;
- comptes utilisateurs ;
- synchronisation cloud ;
- notifications.

> **Décision documentée** — Ce qui est hors périmètre aujourd''hui n''est pas un oubli : c''est une décision de priorisation.

## 2. Critères d''acceptation

```markdown
### Ajouter une tâche
- [ ] Un titre vide est refusé avec un message clair.
- [ ] Un titre de 120 caractères est accepté.
- [ ] Un titre de 121 caractères est refusé.
- [ ] La tâche apparaît dans la liste après ajout.
- [ ] La tâche survit à un redémarrage.
```

Un critère d''acceptation est **observable**. « Bonne expérience » n''est pas testable ; « message d''erreur si le titre est vide » l''est.

## 3. Modèle de données

```python
from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class Tache:
    id: int
    titre: str
    terminee: bool = False
    creee_le: str = field(default_factory=lambda: datetime.now().isoformat(timespec="seconds"))
```

## 4. Architecture cible

```text
taches/
├── __init__.py
├── modele.py        # Tache
├── stockage.py      # lecture / écriture JSON
├── service.py       # règles métier
├── cli.py           # saisie / affichage
└── main.py          # point d''entrée
tests/
├── test_service.py
└── test_stockage.py
```

Chaque couche a une seule raison de changer.

## Exercice rapide

Rédigez le cahier des charges de votre propre variante (ajout de priorités, échéances ou catégories). Limitez-vous à trois fonctionnalités supplémentaires et écrivez leurs critères d''acceptation.', 45, 'markdown', array['Un périmètre limité est une force', 'Chaque fonctionnalité a un critère d''acceptation', 'Définir ce qui n''est pas dans le périmètre']),
  ('projet-architecture-cli', 'projet-fondamentaux', 2, 'Construire l''architecture et la CLI', 'Implémenter la couche métier indépendamment de l''interface, puis brancher une CLI simple.', '## La couche métier d''abord

```python
# taches/service.py
from taches.modele import Tache

class GestionnaireTaches:
    def __init__(self, taches: list[Tache] | None = None) -> None:
        self._taches = taches or []

    def ajouter(self, titre: str) -> Tache:
        titre = titre.strip()
        if not titre:
            raise ValueError("Le titre ne peut pas être vide")
        if len(titre) > 120:
            raise ValueError("Le titre ne peut pas dépasser 120 caractères")
        identifiant = max((t.id for t in self._taches), default=0) + 1
        tache = Tache(id=identifiant, titre=titre)
        self._taches.append(tache)
        return tache

    def lister(self) -> list[Tache]:
        return sorted(self._taches, key=lambda t: (t.terminee, t.creee_le))

    def terminer(self, identifiant: int) -> Tache:
        tache = self._trouver(identifiant)
        tache.terminee = True
        return tache

    def supprimer(self, identifiant: int) -> None:
        tache = self._trouver(identifiant)
        self._taches.remove(tache)

    def statistiques(self) -> dict[str, int]:
        terminees = sum(1 for t in self._taches if t.terminee)
        return {"total": len(self._taches), "terminees": terminees}

    def _trouver(self, identifiant: int) -> Tache:
        for tache in self._taches:
            if tache.id == identifiant:
                return tache
        raise LookupError(f"Tâche {identifiant} introuvable")
```

Cette classe ne connaît ni `input` ni `print`. Elle est testable sans simuler le terminal.

## 1. Un routeur de commandes

```python
# taches/cli.py
def executer_commande(service, commande: str, arguments: list[str]) -> None:
    match commande:
        case "add":
            titre = " ".join(arguments)
            service.ajouter(titre)
            print("Tâche ajoutée.")
        case "list":
            for tache in service.lister():
                statut = "x" if tache.terminee else " "
                print(f"[{statut}] {tache.id}. {tache.titre}")
        case "done":
            service.terminer(int(arguments[0]))
            print("Tâche terminée.")
        case "rm":
            service.supprimer(int(arguments[0]))
            print("Tâche supprimée.")
        case "stats":
            stats = service.statistiques()
            print(f"{stats[''terminees'']}/{stats[''total'']} terminées")
        case _:
            print(f"Commande inconnue : {commande}")
```

Le `match` (Python 3.10+) rend le routage lisible. Pour un menu interactif, gardez une boucle `while` avec validation.

## 2. Gestion des erreurs à la frontière

```python
def main() -> None:
    service = GestionnaireTaches()
    while True:
        saisie = input("taches > ").strip()
        if saisie in {"quit", "q"}:
            break
        if not saisie:
            continue
        commande, *arguments = saisie.split()
        try:
            executer_commande(service, commande, arguments)
        except (ValueError, LookupError, IndexError) as erreur:
            print(f"Erreur : {erreur}")
```

Les exceptions métier sont traduites en messages utilisateur au dernier moment.

## 3. Aide intégrée

```python
AIDE = """
add <titre>   Ajouter une tâche
list          Lister les tâches
done <id>     Marquer comme terminée
rm <id>       Supprimer
stats         Afficher les statistiques
quit          Quitter
"""
```

> **À retenir** — Une bonne CLI est une peau fine au-dessus d''un service testable. Si la logique fuit dans les `case`, c''est que le service manque d''une méthode.

## Exercice rapide

Implémentez la couche métier et écrivez cinq tests : ajout valide, ajout vide, titre trop long, terminaison, suppression d''un identifiant inexistant.', 70, 'python', array['Le service ne dépend pas de input/print', 'La CLI traduit les erreurs métier en messages', 'Un routeur de commandes évite un if géant']),
  ('projet-persistance-json', 'projet-fondamentaux', 3, 'Persistance JSON et écriture atomique', 'Sauvegarder l''état sur disque sans corrompre les données en cas d''interruption.', '## Sérialiser

```python
import json
from dataclasses import asdict

def serialiser(taches: list[Tache]) -> str:
    return json.dumps([asdict(t) for t in taches], ensure_ascii=False, indent=2)
```

`ensure_ascii=False` conserve les accents lisibles.

## 1. Lecture défensive

```python
from pathlib import Path

def charger(chemin: Path) -> list[Tache]:
    if not chemin.exists():
        return []
    try:
        contenu = chemin.read_text(encoding="utf-8")
        donnees = json.loads(contenu)
    except (OSError, json.JSONDecodeError) as erreur:
        raise RuntimeError(f"Impossible de lire {chemin} : {erreur}") from erreur

    if not isinstance(donnees, list):
        raise RuntimeError("Format de fichier invalide : liste attendue")
    return [Tache(**element) for element in donnees]
```

Un fichier corrompu ne doit pas être silencieusement remplacé.

## 2. Écriture atomique

Si le programme s''arrête en plein `write_text`, le fichier peut être tronqué.

```python
import os
import tempfile

def sauvegarder(chemin: Path, taches: list[Tache]) -> None:
    chemin.parent.mkdir(parents=True, exist_ok=True)
    contenu = serialiser(taches)
    with tempfile.NamedTemporaryFile(
        "w", encoding="utf-8", dir=chemin.parent,
        delete=False, suffix=".tmp",
    ) as fichier:
        fichier.write(contenu)
        fichier.flush()
        os.fsync(fichier.fileno())
    os.replace(fichier.name, chemin)
```

`os.replace` est atomique sur le même volume : soit l''ancien fichier reste intact, soit le nouveau est complet.

## 3. Brancher le stockage

```python
class StockageJSON:
    def __init__(self, chemin: Path) -> None:
        self.chemin = chemin

    def charger(self) -> list[Tache]:
        return charger(self.chemin)

    def sauvegarder(self, taches: list[Tache]) -> None:
        sauvegarder(self.chemin, taches)
```

Le service reçoit un stockage injecté :

```python
service = GestionnaireTaches(stockage.charger())
# après chaque mutation
stockage.sauvegarder(service.lister())
```

## 4. Tester sans toucher au vrai fichier

```python
def test_sauvegarde_et_rechargement(tmp_path):
    chemin = tmp_path / "taches.json"
    stockage = StockageJSON(chemin)
    stockage.sauvegarder([Tache(id=1, titre="Réviser Python")])
    rechargees = stockage.charger()
    assert rechargees[0].titre == "Réviser Python"
```

`tmp_path` est fourni par pytest et isolé pour chaque test.

> **À retenir** — Une sauvegarde qui n''est pas atomique finit toujours par corrompre des données, un jour. Le coût de `os.replace` est négligeable.

## Exercice rapide

Ajoutez une commande `export <fichier.md>` qui produit une checklist Markdown des tâches. Testez avec un chemin dans `tmp_path` et vérifiez le contenu généré.', 60, 'python', array['Toujours encoder en UTF-8', 'Écrire dans un fichier temporaire puis remplacer', 'Gérer un fichier absent ou corrompu']),
  ('projet-tests', 'projet-fondamentaux', 4, 'Tester et fiabiliser le projet', 'Écrire une suite de tests utile, mesurer la couverture et corriger les cas limites.', '## Organisation des tests

```text
tests/
├── conftest.py
├── test_service.py
└── test_stockage.py
```

```python
# tests/conftest.py
import pytest
from taches.service import GestionnaireTaches

@pytest.fixture
def service() -> GestionnaireTaches:
    return GestionnaireTaches()
```

## 1. Tests du service

```python
import pytest

def test_ajouter_genere_un_identifiant(service):
    premiere = service.ajouter("Lire la documentation")
    seconde = service.ajouter("Écrire les tests")
    assert (premiere.id, seconde.id) == (1, 2)

def test_ajouter_refuse_un_titre_vide(service):
    with pytest.raises(ValueError, match="vide"):
        service.ajouter("   ")

def test_terminer_une_tache_inconnue(service):
    with pytest.raises(LookupError):
        service.terminer(99)

def test_lister_place_les_terminees_en_dernier(service):
    a = service.ajouter("A")
    service.ajouter("B")
    service.terminer(a.id)
    assert [t.titre for t in service.lister()][-1] == "A"
```

## 2. Tests de persistance

```python
def test_fichier_corrompu(tmp_path):
    chemin = tmp_path / "taches.json"
    chemin.write_text("{pas du json", encoding="utf-8")
    with pytest.raises(RuntimeError, match="Impossible de lire"):
        StockageJSON(chemin).charger()

def test_rechargement_conserve_les_donnees(tmp_path):
    stockage = StockageJSON(tmp_path / "t.json")
    stockage.sauvegarder([Tache(id=1, titre="Test")])
    assert stockage.charger() == [Tache(id=1, titre="Test")]
```

## 3. Couverture

```bash
pip install pytest-cov
pytest --cov=taches --cov-report=term-missing
```

Objectif raisonnable : 80–90 % sur la logique métier. 100 % n''est pas un but en soi ; certains chemins défensifs sont difficiles à atteindre.

## 4. Ce qu''il ne faut pas tester

- les appels directs à `print` dans la CLI (testez la sortie avec `capsys` si nécessaire) ;
- le comportement interne de `json.dumps` ;
- les détails d''implémentation qui peuvent changer sans modifier le contrat.

> **Règle** — Un test doit échouer pour une raison métier compréhensible. S''il casse à chaque refactorisation sans changement de comportement, il est trop couplé.

## Exercice rapide

Atteignez 85 % de couverture sur `service.py`. Ajoutez un test pour un titre de 120 caractères exactement et un pour 121 caractères. Corrigez le code si l''un des deux échoue.', 55, 'python', array['Tester le comportement, pas l''implémentation', 'Une fixture crée un état neuf', 'La couverture indique ce qui n''est pas testé']),
  ('projet-finalisation', 'projet-fondamentaux', 5, 'Finaliser, documenter et publier', 'Préparer un dépôt présentable : README, licence, version et démonstration.', '## La checklist de livraison

- [ ] Le programme s''installe en trois commandes.
- [ ] Le README explique le problème et l''usage.
- [ ] Les tests passent sur une machine vierge.
- [ ] Aucun secret n''est versionné.
- [ ] La licence est présente.
- [ ] Une capture ou un GIF montre le résultat.

## 1. README efficace

```markdown
# Tâches CLI

Suivi de tâches minimaliste en ligne de commande, avec persistance JSON.

## Installation
```bash
git clone https://github.com/vous/taches-cli.git
cd taches-cli
python -m venv .venv
source .venv/bin/activate  # Windows : .venv\\Scripts\\activate
pip install -r requirements.txt
```

## Utilisation
```bash
python -m taches add "Réviser les fonctions"
python -m taches list
python -m taches done 1
```

## Exemple de sortie
```text
[ ] 2. Écrire les tests
[x] 1. Réviser les fonctions
2/2 terminées
```

## Tests
```bash
pytest --cov=taches
```

## Licence
MIT
```

## 2. Versionner

```python
__version__ = "1.0.0"
```

```bash
git tag -a v1.0.0 -m "Première version stable"
git push origin v1.0.0
```

Une release GitHub peut contenir une archive et des notes de version.

## 3. Publier sur son portfolio

Renseignez dans DEVFORGE :

- le lien du dépôt GitHub ;
- les technologies réellement utilisées ;
- une description du problème résolu ;
- les résultats obtenus (tests, couverture, nombre de fonctionnalités) ;
- les difficultés rencontrées et les décisions prises.

Un projet terminé et documenté vaut mieux que dix prototypes abandonnés.

## 4. Rétrospective

Répondez par écrit :

1. Qu''avez-vous appris que vous ne saviez pas il y a deux semaines ?
2. Quelle décision referiez-vous autrement ?
3. Quelle serait la prochaine fonctionnalité, et pourquoi ?

Cette rétrospective nourrit directement votre portfolio et vos futurs entretiens.

## Exercice rapide

Publiez la version 1.0.0 de votre projet. Ajoutez-la dans la section « Mes projets » de DEVFORGE avec le statut « Terminé », puis consultez votre portfolio : le projet doit y apparaître avec ses technologies et ses résultats.', 50, 'markdown', array['Le README est la porte d''entrée du projet', 'Une démo vaut mieux qu''une description', 'Un projet fini est un projet documenté'])
on conflict (slug) do update set
    module_slug = excluded.module_slug,
    position = excluded.position,
    title = excluded.title,
    summary = excluded.summary,
    content_md = excluded.content_md,
    estimated_minutes = excluded.estimated_minutes,
    code_language = excluded.code_language,
    key_points = excluded.key_points;

insert into public.missions (slug, title, description, category, difficulty, estimated_minutes, context, objective, instructions_md, requirements, success_criteria, module_slug, tags) values
  ('calculateur-robuste', 'Calculateur robuste en ligne de commande', 'Construire un calculateur qui refuse les entrées invalides et ne s''arrête jamais sur une erreur utilisateur.', 'exercice', 'debutant', 45, 'Un script de calcul utilisé par une équipe support doit rester utilisable même lorsque l''opérateur saisit n''importe quoi. Une exception non gérée interrompt le programme et fait perdre le contexte.', 'Écrire un calculateur interactif qui gère les quatre opérations, valide chaque saisie et permet plusieurs calculs successifs.', '## Contexte

Vous reprenez un script écrit à la va-vite qui plante dès qu''un utilisateur tape autre chose qu''un nombre. Votre mission : le rendre suffisamment robuste pour être utilisé sans supervision.

## Étape 1 — Isoler le calcul

```python
def calculer(a: float, b: float, operation: str) -> float:
    ...
```

Cette fonction ne doit contenir **aucun** appel à `input` ou `print`.

## Étape 2 — Construire l''interface

```text
1) Additionner
2) Soustraire
3) Multiplier
4) Diviser
q) Quitter
```

Répétez le menu jusqu''à `q`. Une erreur de saisie affiche un message et réaffiche le menu.

## Étape 3 — Vérifier

Testez au minimum :

- `2 + 3` → 5
- `10 / 0` → message d''erreur
- saisie `abc` → message d''erreur, programme actif
- choix `9` → message d''invalidité
- `q` → sortie propre

## Livrable

Un fichier `calculateur.py` exécutable, avec trois assertions en bas de fichier ou un fichier de tests séparé.', array['Le programme affiche un menu avec les opérations +, -, *, / et quitter.', 'Toute saisie non numérique est refusée avec un message explicite, sans quitter le programme.', 'La division par zéro affiche une erreur dédiée.', 'La logique de calcul est isolée dans une fonction testable.', 'Le programme boucle jusqu''à la commande de sortie.'], array['Les quatre opérations produisent un résultat correct.', 'Une saisie invalide ne produit ni traceback ni arrêt brutal.', 'La division par zéro est interceptée.', 'Au moins trois assertions couvrent la fonction de calcul.'], 'python-fondamentaux', array['Python', 'Validation', 'Gestion d''erreurs']),
  ('refactor-fizzbuzz', 'Refactoriser FizzBuzz en code testable', 'Transformer un script monolithique en fonction pure, couverte par des tests et documentée.', 'exercice', 'debutant', 30, 'Le FizzBuzz est un exercice connu, mais la majorité des implémentations mélangent calcul et affichage. Ce couplage rend le code impossible à tester proprement.', 'Séparer la génération de la séquence de son affichage, puis prouver le comportement avec des tests.', '## Point de départ

```python
for i in range(1, 101):
    if i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    elif i % 15 == 0:
        print("FizzBuzz")
    else:
        print(i)
```

Trois problèmes : l''ordre des conditions est faux, la logique est couplée à l''affichage, et rien n''est testable.

## Travail demandé

1. Corriger l''ordre des conditions.
2. Renvoyer une **liste** au lieu d''imprimer.
3. Écrire au moins quatre assertions.
4. Ajouter une docstring qui précise la règle pour les multiples de 15.

## Critère de qualité

Un relecteur doit pouvoir comprendre la règle métier en lisant uniquement la docstring et les tests.', array['Une fonction `fizzbuzz(n)` renvoie une liste de chaînes.', 'Aucun `print` dans la fonction de génération.', 'Les multiples de 15 produisent `FizzBuzz` avant les autres cas.', 'Un bloc d''affichage séparé appelle la fonction.', 'Des assertions couvrent 0, 3, 5 et 15.'], array['La fonction est pure : mêmes entrées, mêmes sorties.', 'Les cas 3, 5 et 15 sont corrects.', 'Le programme s''exécute sans erreur pour n = 0.'], 'conditions-boucles', array['Python', 'Refactoring', 'Tests']),
  ('analyse-algorithmes', 'Évaluation : analyse de complexité', 'Analyser quatre implémentations, identifier leurs complexités et justifier un choix technique.', 'evaluation', 'intermediaire', 60, 'Une revue de code révèle quatre fonctions qui semblent équivalentes. Sur un jeu de 200 000 enregistrements, une seule tient la charge. Il faut argumenter par la complexité, pas par l''intuition.', 'Produire une analyse écrite et chiffrée des quatre algorithmes, avec recommandation argumentée.', '## Fonctions à analyser

```python
def a(liste):
    return len(set(liste)) == len(liste)

def b(liste):
    for i, x in enumerate(liste):
        if x in liste[i + 1:]:
            return False
    return True

def c(liste):
    triee = sorted(liste)
    return all(triee[i] != triee[i + 1] for i in range(len(triee) - 1))

def d(liste):
    vus = set()
    for x in liste:
        if x in vus:
            return False
        vus.add(x)
    return True
```

## Attendu

Rédigez une note structurée :

1. **Tableau** : fonction, temps, espace, pire cas.
2. **Analyse** de `b` : pourquoi le slicing la rend quadratique.
3. **Comparaison** de `a`, `c` et `d` sur 200 000 éléments.
4. **Recommandation** unique, avec mesure si possible (`time.perf_counter`).

## Barème indicatif

- Exactitude des complexités : 40 %
- Justification : 30 %
- Mesure ou démonstration : 20 %
- Clarté de la recommandation : 10 %', array['Indiquer la complexité temporelle de chaque fonction.', 'Indiquer la complexité spatiale de chaque fonction.', 'Identifier le pire cas et le cas moyen.', 'Proposer une version améliorée pour la fonction la moins efficace.', 'Justifier le choix final avec un ordre de grandeur concret.'], array['Les complexités sont correctes et justifiées.', 'Le raisonnement distingue temps et espace.', 'La recommandation est reliée à la taille des données.', 'Au moins une amélioration est démontrée par du code.'], 'algorithmique', array['Complexité', 'Big O', 'Analyse']),
  ('file-priorite-heap', 'File de priorité avec un tas binaire', 'Implémenter une file de priorité from scratch et comparer ses performances à une liste triée.', 'defi', 'avance', 90, 'Un ordonnanceur de tâches doit toujours extraire l''élément le plus prioritaire en temps logarithmique. Une liste triée à chaque insertion devient trop lente dès que le volume augmente.', 'Écrire une classe `FilePriorite` basée sur un tas binaire min, avec insertion et extraction en O(log n).', '## Cahier des charges

```python
class FilePriorite:
    def ajouter(self, element: str, priorite: int) -> None: ...
    def extraire_min(self) -> tuple[str, int]: ...
    def est_vide(self) -> bool: ...
    def taille(self) -> int: ...
```

## Contraintes

- Aucun import de `heapq`.
- Le tas est stocké dans une liste interne.
- Pour un nœud d''indice `i` : enfants en `2i + 1` et `2i + 2`, parent en `(i - 1) // 2`.

## Étapes

1. écrire `_remonter` (sift-up) ;
2. écrire `_descendre` (sift-down) ;
3. brancher `ajouter` et `extraire_min` ;
4. tester avec des priorités dupliquées ;
5. comparer avec `sorted` sur 10 000 insertions.

## Vérification

```python
import random
file = FilePriorite()
valeurs = [random.randint(1, 100) for _ in range(50)]
for index, valeur in enumerate(valeurs):
    file.ajouter(f"t{index}", valeur)
sorties = [file.extraire_min()[1] for _ in range(50)]
assert sorties == sorted(valeurs)
```', array['Les opérations `ajouter(element, priorite)` et `extraire_min()` sont disponibles.', 'La structure interne est une liste, sans utiliser `heapq`.', 'Les opérations `est_vide()` et `taille()` sont fournies.', 'Un test vérifie l''ordre de sortie sur au moins 50 éléments aléatoires.', 'Un petit benchmark compare la structure à une liste triée.'], array['L''ordre de priorité est respecté, y compris avec des doublons.', 'Les cas vide et élément unique sont gérés.', 'La complexité annoncée est respectée par la conception.', 'Le benchmark produit des chiffres reproductibles.'], 'algorithmique', array['Structures de données', 'Tas binaire', 'Complexité']),
  ('cli-taches', 'Évaluation : CLI de suivi de tâches', 'Livrer une application en ligne de commande complète, persistante, testée et documentée.', 'evaluation', 'intermediaire', 150, 'C''est le projet de synthèse de la phase 1. Il doit démontrer que vous savez structurer un programme au-delà d''un seul fichier, persister des données et prouver le comportement par des tests.', 'Produire un dépôt GitHub contenant une CLI de tâches fonctionnelle, avec README et tests.', '## Livrable

Un dépôt public `taches-cli` avec :

```text
taches/
├── __init__.py
├── modele.py
├── stockage.py
├── service.py
├── cli.py
└── main.py
tests/
├── conftest.py
├── test_service.py
└── test_stockage.py
README.md
requirements.txt
.gitignore
```

## Commandes minimales

```bash
python -m taches add "Réviser les fonctions"
python -m taches list
python -m taches done 1
python -m taches rm 1
python -m taches stats
```

## Grille d''évaluation

| Critère | Points |
| --- | --- |
| Fonctionnalités complètes | 30 |
| Architecture et lisibilité | 20 |
| Tests et couverture | 20 |
| Persistance robuste | 15 |
| README et présentation | 15 |

## Conseil

Commencez par le service **sans interface**, testez-le, puis branchez la CLI. Une CLI construite sur un service testé est presque gratuite.', array['Ajouter, lister, terminer et supprimer une tâche.', 'Persister les données dans un fichier JSON.', 'Organiser le code en modules (modèle, stockage, service, CLI).', 'Écrire au moins huit tests et obtenir une couverture ≥ 80 %.', 'Publier le dépôt avec un README complet.'], array['Toutes les commandes fonctionnent après redémarrage.', 'Un fichier corrompu produit une erreur claire, sans écrasement silencieux.', 'La suite de tests passe sur une machine vierge.', 'Le README permet une installation en moins de cinq minutes.'], 'projet-fondamentaux', array['Projet', 'Persistance', 'Tests', 'CLI']),
  ('parser-expressions', 'Parser et évaluer des expressions arithmétiques', 'Construire un tokenizer et un parser récursif qui respectent les priorités d''opérateurs.', 'defi', 'avance', 100, 'Un éditeur de formules doit évaluer des expressions comme `3 + 4 * (2 - 1)` sans utiliser `eval`, pour des raisons de sécurité et de contrôle des erreurs.', 'Implémenter un évaluateur d''expressions respectant les priorités et les parenthèses, avec des erreurs explicites.', '## Architecture conseillée

```text
expression → terme (("+" | "-") terme)*
terme      → facteur (("*" | "/") facteur)*
facteur    → nombre | "(" expression ")" | "-" facteur
```

Cette grammaire encode naturellement les priorités.

## Étapes

1. **Tokenizer** : transformer la chaîne en jetons (`NOMBRE`, `PLUS`, `PAREN_GAUCHE`, …).
2. **Parser** : consommer les jetons selon la grammaire.
3. **Évaluer** au fil du parsing ou construire un AST.
4. **Tester** les cas nominaux et les erreurs.

## Jeu de tests minimal

```python
assert evaluer("3 + 4 * 2") == 11
assert evaluer("(3 + 4) * 2") == 14
assert evaluer("10 / 2 - 3") == 2
assert evaluer("-5 + 2") == -3
```

## Interdit

`eval`, `exec` et toute bibliothèque de parsing prête à l''emploi. L''objectif est de construire l''algorithme.', array['Supporter +, -, *, / et les parenthèses.', 'Refuser les caractères inconnus avec une erreur positionnée.', 'Refuser les parenthèses non équilibrées.', 'Gérer la division par zéro.', 'Couvrir au moins six expressions dans les tests.'], array['`3 + 4 * 2` vaut 11, pas 14.', '`(3 + 4) * 2` vaut 14.', 'Les espaces sont ignorés.', 'Les erreurs indiquent une position ou un contexte.'], 'algorithmique', array['Parsing', 'Récursivité', 'Algorithmique']),
  ('tests-service', 'Écrire la suite de tests d''un service métier', 'Couvrir un service existant avec pytest, fixtures et cas limites pertinents.', 'exercice', 'intermediaire', 60, 'Un service de gestion de notes fonctionne, mais aucune ligne de test n''a été écrite. Chaque modification fait peur à l''équipe.', 'Écrire une suite de tests rapide et lisible qui documente le comportement attendu du service.', '## Service à couvrir

```python
class CarnetNotes:
    def ajouter(self, matiere: str, note: float) -> None:
        if not 0 <= note <= 20:
            raise ValueError("La note doit être entre 0 et 20")
        ...

    def moyenne(self) -> float:
        if not self._notes:
            raise ValueError("Aucune note enregistrée")
        ...

    def meilleure(self) -> tuple[str, float]: ...
```

## Attendu

- `tests/conftest.py` avec une fixture `carnet`.
- `tests/test_carnet.py` avec au moins dix tests.
- Un test paramétré pour les notes invalides : `-1`, `20.1`, `float("nan")`.
- Une commande de couverture dans le README.

## Piège à éviter

Ne testez pas les détails internes (`carnet._notes`). Testez le comportement observable : `moyenne()`, `meilleure()`, les exceptions.', array['Utiliser pytest et une fixture qui crée un service neuf.', 'Tester le cas nominal de chaque méthode publique.', 'Tester au moins quatre cas d''erreur.', 'Tester les bornes numériques (0, 20, valeurs négatives).', 'Aucun test ne dépend de l''ordre d''exécution.'], array['La suite passe en isolation.', 'Chaque test a un nom descriptif.', 'Les cas d''erreur vérifient le type d''exception et le message.', 'La couverture du service dépasse 85 %.'], 'fonctions', array['Tests', 'pytest', 'Qualité']),
  ('git-workflow-audit', 'Auditer un historique Git', 'Analyser un dépôt réel, identifier les mauvaises pratiques et proposer un historique propre.', 'exercice', 'debutant', 40, 'Un dépôt contient 200 commits intitulés « update », un fichier `.env` versionné et une branche `main` cassée. Il faut établir un diagnostic avant de nettoyer.', 'Produire un rapport d''audit avec commandes utilisées, problèmes identifiés et plan de remédiation.', '## Dépôt d''entraînement

Créez un dépôt local avec :

```bash
git init audit-git && cd audit-git
echo "SECRET=abc123" > .env
git add . && git commit -m "update"
for i in 1 2 3; do echo "ligne $i" >> notes.txt; git add .; git commit -m "update"; done
```

## Questions

1. Combien de commits ? Quels fichiers sont suivis ?
2. Le secret est-il dans l''historique ? Depuis quel commit ?
3. Quelle commande permet de retirer `.env` de l''index sans supprimer le fichier local ?
4. Pourquoi changer le secret est-il indispensable, même après suppression du commit ?
5. Comment réécrire proprement l''historique sur une branche **non partagée** ?

## Livrable

`audit.md` avec sections : constats, preuves (commandes + sorties), risques, plan d''action ordonné.', array['Utiliser `git log`, `git diff`, `git status` et `git ls-files`.', 'Identifier au moins trois problèmes distincts.', 'Proposer une commande concrète pour chaque correction.', 'Expliquer pourquoi un `reset --hard` serait dangereux ici.', 'Rédiger le rapport en Markdown.'], array['Les commandes citées sont correctes.', 'Le plan distingue corrections locales et réécriture d''historique partagé.', 'La rotation du secret est mentionnée.', 'Le rapport est compréhensible par un débutant.'], 'git-github', array['Git', 'Revue', 'Bonnes pratiques']),
  ('revue-code-pr', 'Évaluation : revue d''une pull request', 'Analyser une PR, formuler des retours actionnables et décider de la fusion.', 'evaluation', 'intermediaire', 45, 'Une pull request de 400 lignes prétend corriger la validation des entrées. Elle contient du code fonctionnel, mais aussi des problèmes de sécurité et de lisibilité.', 'Rédiger une revue structurée avec commentaires bloquants, suggestions et décision finale.', '## Support de revue

La PR ajoute :

```python
def valider_email(email):
    if "@" in email:
        return True
    return False

def inscription(email, mot_de_passe):
    if valider_email(email):
        creer_utilisateur(email, mot_de_passe)
    else:
        print("Erreur")
```

Et un test :

```python
def test_email():
    assert valider_email("a@b") == True
```

## Pistes d''analyse

- La validation est-elle suffisante ?
- Le mot de passe est-il validé ?
- Que se passe-t-il si l''utilisateur existe déjà ?
- L''erreur est-elle exploitable par l''appelant ?
- Les tests couvrent-ils les cas invalides ?
- Le nommage et les annotations de type sont-ils cohérents avec le reste du dépôt ?

## Format attendu

```markdown
### Bloquant
- `fichier.py:12` — ...

### Important
- ...

### Suggestions
- ...

### Décision
Demande de changements — justification.
```', array['Lire le diff complet et identifier au moins cinq remarques.', 'Classer chaque remarque : bloquant, important, suggestion.', 'Proposer un correctif concret pour les points bloquants.', 'Vérifier la présence de tests.', 'Conclure par une décision motivée (approuver / demander des changements).'], array['Les remarques sont précises et référencent des lignes.', 'Le ton est constructif et non personnel.', 'Les problèmes de sécurité sont identifiés.', 'La décision est cohérente avec les remarques.'], 'git-github', array['Revue de code', 'Qualité', 'Collaboration']),
  ('inventaire-collections', 'Inventaire avec dictionnaires et ensembles', 'Agréger des données de stock hétérogènes avec les bonnes structures Python.', 'exercice', 'debutant', 45, 'Un fichier de mouvements de stock contient des doublons et des catégories manquantes. Le rapport doit être fiable et reproductible.', 'Calculer les quantités par article, les catégories uniques et les articles en rupture.', '## Données d''entrée

```python
mouvements = [
    {"article": "clavier", "categorie": "peripherique", "quantite": 5},
    {"article": "clavier", "categorie": "peripherique", "quantite": -2},
    {"article": "ecran", "categorie": "affichage", "quantite": 3},
    {"article": "cable", "quantite": 0},
]
```

## Sortie attendue

```python
{
    "stocks": {"cable": 0, "clavier": 3, "ecran": 3},
    "categories": ["affichage", "inconnue", "peripherique"],
    "ruptures": ["cable"],
}
```

## Aides

- `defaultdict(int)` pour additionner ;
- `set` pour les catégories ;
- `sorted` pour un ordre stable.

## Bonus

Ajoutez une fonction `fusionner_inventaires(a, b)` qui combine deux rapports sans écraser les quantités.', array['Lire une liste de dictionnaires `{article, categorie, quantite}`.', 'Additionner les quantités par article.', 'Lister les catégories uniques triées.', 'Identifier les articles dont le stock est nul.', 'Aucune boucle imbriquée sur les articles.'], array['Les doublons sont correctement additionnés.', 'Les catégories manquantes sont traitées (`inconnue`).', 'Le résultat est trié de façon déterministe.', 'Le code est testé avec une liste vide.'], 'structures-donnees', array['Dictionnaires', 'Ensembles', 'Agrégation']),
  ('mini-orm', 'Mini-ORM : mapping objet-relationnel', 'Concevoir une couche d''accès aux données typée, testable et indépendante du stockage.', 'evaluation', 'avance', 180, 'Une application grandit et les requêtes SQL sont dispersées dans les contrôleurs. Il faut introduire une couche de persistance claire, sans dépendre d''un ORM externe.', 'Construire un mini-ORM capable de mapper des classes à des tables, d''insérer, lire et mettre à jour des objets.', '## Architecture cible

```text
domaine/        # entités pures
persistance/
├── modele.py   # Model, métadonnées
├── depot.py    # Repository
└── connexion.py# interface de stockage
tests/
└── test_depot.py
```

## Interface de stockage

```python
class Stockage(Protocol):
    def executer(self, requete: str, parametres: tuple) -> list[dict]: ...
    def executer_ecriture(self, requete: str, parametres: tuple) -> int: ...
```

En test, remplacez-la par un faux qui enregistre les requêtes reçues.

## Exemple d''usage visé

```python
class Lecon(Model):
    __table__ = "lessons"
    id: int
    titre: str
    minutes: int

depot = Repository(Lecon, stockage)
lecon = depot.ajouter(Lecon(id=0, titre="SQL", minutes=60))
assert depot.trouver(lecon.id).titre == "SQL"
```

## Exigences de sécurité

Les valeurs doivent passer par des **paramètres liés** :

```python
# Correct
stockage.executer("SELECT * FROM lessons WHERE id = %s", (identifiant,))

# Interdit
stockage.executer(f"SELECT * FROM lessons WHERE id = {identifiant}")
```

## Grille

| Critère | Points |
| --- | --- |
| Conception et lisibilité | 30 |
| Correction des requêtes | 25 |
| Sécurité (paramètres liés) | 20 |
| Tests | 15 |
| Documentation | 10 |', array['Une classe de base `Model` avec `table`, `colonnes` et `cle_primaire`.', 'Un `Repository` générique avec `ajouter`, `trouver`, `lister`, `mettre_a_jour`.', 'Les requêtes utilisent des paramètres liés, jamais de concaténation de chaînes.', 'Le stockage est injecté derrière une interface, pour permettre un faux en test.', 'Au moins huit tests couvrent les cas nominaux et les erreurs.'], array['Aucune injection SQL possible dans les valeurs.', 'Le repository fonctionne avec un faux stockage en mémoire.', 'Les erreurs de schéma sont explicites.', 'La documentation explique comment ajouter un modèle.'], 'poo', array['POO', 'Architecture', 'SQL', 'Tests']),
  ('documenter-portfolio', 'Documenter un projet pour son portfolio', 'Rédiger une fiche projet professionnelle à partir d''un travail réellement réalisé.', 'exercice', 'debutant', 40, 'Un recruteur consacre moins de deux minutes à un dépôt. Sans README clair et résultats mesurés, un bon projet passe inaperçu.', 'Produire une fiche projet complète, sincère et vérifiable, prête à être publiée dans DEVFORGE.', '## Structure de la fiche

```markdown
# Nom du projet

**Problème** — Une phrase.

**Solution** — Deux phrases maximum.

**Technologies** — Python 3.12, pytest, JSON.

**Décisions techniques**
1. Persistance JSON atomique — évite la corruption en cas d''arrêt brutal.
2. Service isolé de la CLI — permet de tester sans simuler le terminal.

**Résultats** — 12 tests, 91 % de couverture, démarrage en 40 ms.

**Dépôt** — https://github.com/...
```

## Exercice de sincérité

Relisez chaque ligne et demandez-vous : « Puis-je le prouver ? » Si non, retirez ou reformulez.

- ❌ « Architecture microservices » pour un script unique.
- ✅ « Architecture en couches avec injection du stockage ».
- ❌ « Optimisé pour la production » sans mesure.
- ✅ « 10 000 insertions en 0,8 s sur une machine de bureau ».

## Livrable

Publiez la fiche dans la section « Mes projets » de DEVFORGE, avec le statut « Terminé » et le lien GitHub. Elle apparaîtra automatiquement dans votre portfolio.', array['Décrire le problème résolu en une phrase.', 'Lister les technologies réellement utilisées.', 'Décrire deux décisions techniques et leur justification.', 'Chiffrer un résultat (tests, couverture, performance).', 'Fournir le lien du dépôt et une commande d''installation.'], array['Aucune technologie n''est mentionnée sans usage réel.', 'Les résultats sont mesurables ou observables.', 'Le texte est relu, sans faute manifeste.', 'La fiche tient en moins de 300 mots.'], 'projet-fondamentaux', array['Documentation', 'Portfolio', 'Communication'])
on conflict (slug) do update set
    title = excluded.title,
    description = excluded.description,
    category = excluded.category,
    difficulty = excluded.difficulty,
    estimated_minutes = excluded.estimated_minutes,
    context = excluded.context,
    objective = excluded.objective,
    instructions_md = excluded.instructions_md,
    requirements = excluded.requirements,
    success_criteria = excluded.success_criteria,
    module_slug = excluded.module_slug,
    tags = excluded.tags;

insert into public.mission_skills (mission_slug, skill_slug) values
  ('calculateur-robuste', 'python'),
  ('refactor-fizzbuzz', 'python'),
  ('refactor-fizzbuzz', 'tests-tdd'),
  ('analyse-algorithmes', 'analyse-complexite'),
  ('file-priorite-heap', 'structures-avancees'),
  ('file-priorite-heap', 'analyse-complexite'),
  ('cli-taches', 'python'),
  ('cli-taches', 'architecture-propre'),
  ('cli-taches', 'tests-tdd'),
  ('parser-expressions', 'analyse-complexite'),
  ('parser-expressions', 'programmation-dynamique'),
  ('parser-expressions', 'python'),
  ('tests-service', 'tests-tdd'),
  ('tests-service', 'python'),
  ('git-workflow-audit', 'git-collaboration'),
  ('revue-code-pr', 'git-collaboration'),
  ('revue-code-pr', 'architecture-propre'),
  ('inventaire-collections', 'python'),
  ('mini-orm', 'architecture-propre'),
  ('mini-orm', 'modelisation-sql'),
  ('mini-orm', 'python'),
  ('documenter-portfolio', 'git-collaboration')
on conflict (mission_slug, skill_slug) do update set
    skill_slug = excluded.skill_slug;

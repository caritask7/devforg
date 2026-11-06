import type { Mission } from "@/lib/types";

export const missions: Mission[] = [
  {
    slug: "calculateur-robuste",
    title: "Calculateur robuste en ligne de commande",
    description:
      "Construire un calculateur qui refuse les entrées invalides et ne s'arrête jamais sur une erreur utilisateur.",
    category: "exercice",
    difficulty: "debutant",
    estimatedMinutes: 45,
    moduleSlug: "python-fondamentaux",
    tags: ["Python", "Validation", "Gestion d'erreurs"],
    skills: ["python"],
    context:
      "Un script de calcul utilisé par une équipe support doit rester utilisable même lorsque l'opérateur saisit n'importe quoi. Une exception non gérée interrompt le programme et fait perdre le contexte.",
    objective:
      "Écrire un calculateur interactif qui gère les quatre opérations, valide chaque saisie et permet plusieurs calculs successifs.",
    requirements: [
      "Le programme affiche un menu avec les opérations +, -, *, / et quitter.",
      "Toute saisie non numérique est refusée avec un message explicite, sans quitter le programme.",
      "La division par zéro affiche une erreur dédiée.",
      "La logique de calcul est isolée dans une fonction testable.",
      "Le programme boucle jusqu'à la commande de sortie.",
    ],
    successCriteria: [
      "Les quatre opérations produisent un résultat correct.",
      "Une saisie invalide ne produit ni traceback ni arrêt brutal.",
      "La division par zéro est interceptée.",
      "Au moins trois assertions couvrent la fonction de calcul.",
    ],
    instructionsMd: `## Contexte

Vous reprenez un script écrit à la va-vite qui plante dès qu'un utilisateur tape autre chose qu'un nombre. Votre mission : le rendre suffisamment robuste pour être utilisé sans supervision.

## Étape 1 — Isoler le calcul

\`\`\`python
def calculer(a: float, b: float, operation: str) -> float:
    ...
\`\`\`

Cette fonction ne doit contenir **aucun** appel à \`input\` ou \`print\`.

## Étape 2 — Construire l'interface

\`\`\`text
1) Additionner
2) Soustraire
3) Multiplier
4) Diviser
q) Quitter
\`\`\`

Répétez le menu jusqu'à \`q\`. Une erreur de saisie affiche un message et réaffiche le menu.

## Étape 3 — Vérifier

Testez au minimum :

- \`2 + 3\` → 5
- \`10 / 0\` → message d'erreur
- saisie \`abc\` → message d'erreur, programme actif
- choix \`9\` → message d'invalidité
- \`q\` → sortie propre

## Livrable

Un fichier \`calculateur.py\` exécutable, avec trois assertions en bas de fichier ou un fichier de tests séparé.`,
  },
  {
    slug: "refactor-fizzbuzz",
    title: "Refactoriser FizzBuzz en code testable",
    description:
      "Transformer un script monolithique en fonction pure, couverte par des tests et documentée.",
    category: "exercice",
    difficulty: "debutant",
    estimatedMinutes: 30,
    moduleSlug: "conditions-boucles",
    tags: ["Python", "Refactoring", "Tests"],
    skills: ["python", "tests-tdd"],
    context:
      "Le FizzBuzz est un exercice connu, mais la majorité des implémentations mélangent calcul et affichage. Ce couplage rend le code impossible à tester proprement.",
    objective:
      "Séparer la génération de la séquence de son affichage, puis prouver le comportement avec des tests.",
    requirements: [
      "Une fonction `fizzbuzz(n)` renvoie une liste de chaînes.",
      "Aucun `print` dans la fonction de génération.",
      "Les multiples de 15 produisent `FizzBuzz` avant les autres cas.",
      "Un bloc d'affichage séparé appelle la fonction.",
      "Des assertions couvrent 0, 3, 5 et 15.",
    ],
    successCriteria: [
      "La fonction est pure : mêmes entrées, mêmes sorties.",
      "Les cas 3, 5 et 15 sont corrects.",
      "Le programme s'exécute sans erreur pour n = 0.",
    ],
    instructionsMd: `## Point de départ

\`\`\`python
for i in range(1, 101):
    if i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    elif i % 15 == 0:
        print("FizzBuzz")
    else:
        print(i)
\`\`\`

Trois problèmes : l'ordre des conditions est faux, la logique est couplée à l'affichage, et rien n'est testable.

## Travail demandé

1. Corriger l'ordre des conditions.
2. Renvoyer une **liste** au lieu d'imprimer.
3. Écrire au moins quatre assertions.
4. Ajouter une docstring qui précise la règle pour les multiples de 15.

## Critère de qualité

Un relecteur doit pouvoir comprendre la règle métier en lisant uniquement la docstring et les tests.`,
  },
  {
    slug: "analyse-algorithmes",
    title: "Évaluation : analyse de complexité",
    description:
      "Analyser quatre implémentations, identifier leurs complexités et justifier un choix technique.",
    category: "evaluation",
    difficulty: "intermediaire",
    estimatedMinutes: 60,
    moduleSlug: "algorithmique",
    tags: ["Complexité", "Big O", "Analyse"],
    skills: ["analyse-complexite"],
    context:
      "Une revue de code révèle quatre fonctions qui semblent équivalentes. Sur un jeu de 200 000 enregistrements, une seule tient la charge. Il faut argumenter par la complexité, pas par l'intuition.",
    objective:
      "Produire une analyse écrite et chiffrée des quatre algorithmes, avec recommandation argumentée.",
    requirements: [
      "Indiquer la complexité temporelle de chaque fonction.",
      "Indiquer la complexité spatiale de chaque fonction.",
      "Identifier le pire cas et le cas moyen.",
      "Proposer une version améliorée pour la fonction la moins efficace.",
      "Justifier le choix final avec un ordre de grandeur concret.",
    ],
    successCriteria: [
      "Les complexités sont correctes et justifiées.",
      "Le raisonnement distingue temps et espace.",
      "La recommandation est reliée à la taille des données.",
      "Au moins une amélioration est démontrée par du code.",
    ],
    instructionsMd: `## Fonctions à analyser

\`\`\`python
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
\`\`\`

## Attendu

Rédigez une note structurée :

1. **Tableau** : fonction, temps, espace, pire cas.
2. **Analyse** de \`b\` : pourquoi le slicing la rend quadratique.
3. **Comparaison** de \`a\`, \`c\` et \`d\` sur 200 000 éléments.
4. **Recommandation** unique, avec mesure si possible (\`time.perf_counter\`).

## Barème indicatif

- Exactitude des complexités : 40 %
- Justification : 30 %
- Mesure ou démonstration : 20 %
- Clarté de la recommandation : 10 %`,
  },
  {
    slug: "file-priorite-heap",
    title: "File de priorité avec un tas binaire",
    description:
      "Implémenter une file de priorité from scratch et comparer ses performances à une liste triée.",
    category: "defi",
    difficulty: "avance",
    estimatedMinutes: 90,
    moduleSlug: "algorithmique",
    tags: ["Structures de données", "Tas binaire", "Complexité"],
    skills: ["structures-avancees", "analyse-complexite"],
    context:
      "Un ordonnanceur de tâches doit toujours extraire l'élément le plus prioritaire en temps logarithmique. Une liste triée à chaque insertion devient trop lente dès que le volume augmente.",
    objective:
      "Écrire une classe `FilePriorite` basée sur un tas binaire min, avec insertion et extraction en O(log n).",
    requirements: [
      "Les opérations `ajouter(element, priorite)` et `extraire_min()` sont disponibles.",
      "La structure interne est une liste, sans utiliser `heapq`.",
      "Les opérations `est_vide()` et `taille()` sont fournies.",
      "Un test vérifie l'ordre de sortie sur au moins 50 éléments aléatoires.",
      "Un petit benchmark compare la structure à une liste triée.",
    ],
    successCriteria: [
      "L'ordre de priorité est respecté, y compris avec des doublons.",
      "Les cas vide et élément unique sont gérés.",
      "La complexité annoncée est respectée par la conception.",
      "Le benchmark produit des chiffres reproductibles.",
    ],
    instructionsMd: `## Cahier des charges

\`\`\`python
class FilePriorite:
    def ajouter(self, element: str, priorite: int) -> None: ...
    def extraire_min(self) -> tuple[str, int]: ...
    def est_vide(self) -> bool: ...
    def taille(self) -> int: ...
\`\`\`

## Contraintes

- Aucun import de \`heapq\`.
- Le tas est stocké dans une liste interne.
- Pour un nœud d'indice \`i\` : enfants en \`2i + 1\` et \`2i + 2\`, parent en \`(i - 1) // 2\`.

## Étapes

1. écrire \`_remonter\` (sift-up) ;
2. écrire \`_descendre\` (sift-down) ;
3. brancher \`ajouter\` et \`extraire_min\` ;
4. tester avec des priorités dupliquées ;
5. comparer avec \`sorted\` sur 10 000 insertions.

## Vérification

\`\`\`python
import random
file = FilePriorite()
valeurs = [random.randint(1, 100) for _ in range(50)]
for index, valeur in enumerate(valeurs):
    file.ajouter(f"t{index}", valeur)
sorties = [file.extraire_min()[1] for _ in range(50)]
assert sorties == sorted(valeurs)
\`\`\``,
  },
  {
    slug: "cli-taches",
    title: "Évaluation : CLI de suivi de tâches",
    description:
      "Livrer une application en ligne de commande complète, persistante, testée et documentée.",
    category: "evaluation",
    difficulty: "intermediaire",
    estimatedMinutes: 150,
    moduleSlug: "projet-fondamentaux",
    tags: ["Projet", "Persistance", "Tests", "CLI"],
    skills: ["python", "architecture-propre", "tests-tdd"],
    context:
      "C'est le projet de synthèse de la phase 1. Il doit démontrer que vous savez structurer un programme au-delà d'un seul fichier, persister des données et prouver le comportement par des tests.",
    objective:
      "Produire un dépôt GitHub contenant une CLI de tâches fonctionnelle, avec README et tests.",
    requirements: [
      "Ajouter, lister, terminer et supprimer une tâche.",
      "Persister les données dans un fichier JSON.",
      "Organiser le code en modules (modèle, stockage, service, CLI).",
      "Écrire au moins huit tests et obtenir une couverture ≥ 80 %.",
      "Publier le dépôt avec un README complet.",
    ],
    successCriteria: [
      "Toutes les commandes fonctionnent après redémarrage.",
      "Un fichier corrompu produit une erreur claire, sans écrasement silencieux.",
      "La suite de tests passe sur une machine vierge.",
      "Le README permet une installation en moins de cinq minutes.",
    ],
    instructionsMd: `## Livrable

Un dépôt public \`taches-cli\` avec :

\`\`\`text
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
\`\`\`

## Commandes minimales

\`\`\`bash
python -m taches add "Réviser les fonctions"
python -m taches list
python -m taches done 1
python -m taches rm 1
python -m taches stats
\`\`\`

## Grille d'évaluation

| Critère | Points |
| --- | --- |
| Fonctionnalités complètes | 30 |
| Architecture et lisibilité | 20 |
| Tests et couverture | 20 |
| Persistance robuste | 15 |
| README et présentation | 15 |

## Conseil

Commencez par le service **sans interface**, testez-le, puis branchez la CLI. Une CLI construite sur un service testé est presque gratuite.`,
  },
  {
    slug: "parser-expressions",
    title: "Parser et évaluer des expressions arithmétiques",
    description:
      "Construire un tokenizer et un parser récursif qui respectent les priorités d'opérateurs.",
    category: "defi",
    difficulty: "avance",
    estimatedMinutes: 100,
    moduleSlug: "algorithmique",
    tags: ["Parsing", "Récursivité", "Algorithmique"],
    skills: ["analyse-complexite", "programmation-dynamique", "python"],
    context:
      "Un éditeur de formules doit évaluer des expressions comme `3 + 4 * (2 - 1)` sans utiliser `eval`, pour des raisons de sécurité et de contrôle des erreurs.",
    objective:
      "Implémenter un évaluateur d'expressions respectant les priorités et les parenthèses, avec des erreurs explicites.",
    requirements: [
      "Supporter +, -, *, / et les parenthèses.",
      "Refuser les caractères inconnus avec une erreur positionnée.",
      "Refuser les parenthèses non équilibrées.",
      "Gérer la division par zéro.",
      "Couvrir au moins six expressions dans les tests.",
    ],
    successCriteria: [
      "`3 + 4 * 2` vaut 11, pas 14.",
      "`(3 + 4) * 2` vaut 14.",
      "Les espaces sont ignorés.",
      "Les erreurs indiquent une position ou un contexte.",
    ],
    instructionsMd: `## Architecture conseillée

\`\`\`text
expression → terme (("+" | "-") terme)*
terme      → facteur (("*" | "/") facteur)*
facteur    → nombre | "(" expression ")" | "-" facteur
\`\`\`

Cette grammaire encode naturellement les priorités.

## Étapes

1. **Tokenizer** : transformer la chaîne en jetons (\`NOMBRE\`, \`PLUS\`, \`PAREN_GAUCHE\`, …).
2. **Parser** : consommer les jetons selon la grammaire.
3. **Évaluer** au fil du parsing ou construire un AST.
4. **Tester** les cas nominaux et les erreurs.

## Jeu de tests minimal

\`\`\`python
assert evaluer("3 + 4 * 2") == 11
assert evaluer("(3 + 4) * 2") == 14
assert evaluer("10 / 2 - 3") == 2
assert evaluer("-5 + 2") == -3
\`\`\`

## Interdit

\`eval\`, \`exec\` et toute bibliothèque de parsing prête à l'emploi. L'objectif est de construire l'algorithme.`,
  },
  {
    slug: "tests-service",
    title: "Écrire la suite de tests d'un service métier",
    description:
      "Couvrir un service existant avec pytest, fixtures et cas limites pertinents.",
    category: "exercice",
    difficulty: "intermediaire",
    estimatedMinutes: 60,
    moduleSlug: "fonctions",
    tags: ["Tests", "pytest", "Qualité"],
    skills: ["tests-tdd", "python"],
    context:
      "Un service de gestion de notes fonctionne, mais aucune ligne de test n'a été écrite. Chaque modification fait peur à l'équipe.",
    objective:
      "Écrire une suite de tests rapide et lisible qui documente le comportement attendu du service.",
    requirements: [
      "Utiliser pytest et une fixture qui crée un service neuf.",
      "Tester le cas nominal de chaque méthode publique.",
      "Tester au moins quatre cas d'erreur.",
      "Tester les bornes numériques (0, 20, valeurs négatives).",
      "Aucun test ne dépend de l'ordre d'exécution.",
    ],
    successCriteria: [
      "La suite passe en isolation.",
      "Chaque test a un nom descriptif.",
      "Les cas d'erreur vérifient le type d'exception et le message.",
      "La couverture du service dépasse 85 %.",
    ],
    instructionsMd: `## Service à couvrir

\`\`\`python
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
\`\`\`

## Attendu

- \`tests/conftest.py\` avec une fixture \`carnet\`.
- \`tests/test_carnet.py\` avec au moins dix tests.
- Un test paramétré pour les notes invalides : \`-1\`, \`20.1\`, \`float("nan")\`.
- Une commande de couverture dans le README.

## Piège à éviter

Ne testez pas les détails internes (\`carnet._notes\`). Testez le comportement observable : \`moyenne()\`, \`meilleure()\`, les exceptions.`,
  },
  {
    slug: "git-workflow-audit",
    title: "Auditer un historique Git",
    description:
      "Analyser un dépôt réel, identifier les mauvaises pratiques et proposer un historique propre.",
    category: "exercice",
    difficulty: "debutant",
    estimatedMinutes: 40,
    moduleSlug: "git-github",
    tags: ["Git", "Revue", "Bonnes pratiques"],
    skills: ["git-collaboration"],
    context:
      "Un dépôt contient 200 commits intitulés « update », un fichier `.env` versionné et une branche `main` cassée. Il faut établir un diagnostic avant de nettoyer.",
    objective:
      "Produire un rapport d'audit avec commandes utilisées, problèmes identifiés et plan de remédiation.",
    requirements: [
      "Utiliser `git log`, `git diff`, `git status` et `git ls-files`.",
      "Identifier au moins trois problèmes distincts.",
      "Proposer une commande concrète pour chaque correction.",
      "Expliquer pourquoi un `reset --hard` serait dangereux ici.",
      "Rédiger le rapport en Markdown.",
    ],
    successCriteria: [
      "Les commandes citées sont correctes.",
      "Le plan distingue corrections locales et réécriture d'historique partagé.",
      "La rotation du secret est mentionnée.",
      "Le rapport est compréhensible par un débutant.",
    ],
    instructionsMd: `## Dépôt d'entraînement

Créez un dépôt local avec :

\`\`\`bash
git init audit-git && cd audit-git
echo "SECRET=abc123" > .env
git add . && git commit -m "update"
for i in 1 2 3; do echo "ligne $i" >> notes.txt; git add .; git commit -m "update"; done
\`\`\`

## Questions

1. Combien de commits ? Quels fichiers sont suivis ?
2. Le secret est-il dans l'historique ? Depuis quel commit ?
3. Quelle commande permet de retirer \`.env\` de l'index sans supprimer le fichier local ?
4. Pourquoi changer le secret est-il indispensable, même après suppression du commit ?
5. Comment réécrire proprement l'historique sur une branche **non partagée** ?

## Livrable

\`audit.md\` avec sections : constats, preuves (commandes + sorties), risques, plan d'action ordonné.`,
  },
  {
    slug: "revue-code-pr",
    title: "Évaluation : revue d'une pull request",
    description:
      "Analyser une PR, formuler des retours actionnables et décider de la fusion.",
    category: "evaluation",
    difficulty: "intermediaire",
    estimatedMinutes: 45,
    moduleSlug: "git-github",
    tags: ["Revue de code", "Qualité", "Collaboration"],
    skills: ["git-collaboration", "architecture-propre"],
    context:
      "Une pull request de 400 lignes prétend corriger la validation des entrées. Elle contient du code fonctionnel, mais aussi des problèmes de sécurité et de lisibilité.",
    objective:
      "Rédiger une revue structurée avec commentaires bloquants, suggestions et décision finale.",
    requirements: [
      "Lire le diff complet et identifier au moins cinq remarques.",
      "Classer chaque remarque : bloquant, important, suggestion.",
      "Proposer un correctif concret pour les points bloquants.",
      "Vérifier la présence de tests.",
      "Conclure par une décision motivée (approuver / demander des changements).",
    ],
    successCriteria: [
      "Les remarques sont précises et référencent des lignes.",
      "Le ton est constructif et non personnel.",
      "Les problèmes de sécurité sont identifiés.",
      "La décision est cohérente avec les remarques.",
    ],
    instructionsMd: `## Support de revue

La PR ajoute :

\`\`\`python
def valider_email(email):
    if "@" in email:
        return True
    return False

def inscription(email, mot_de_passe):
    if valider_email(email):
        creer_utilisateur(email, mot_de_passe)
    else:
        print("Erreur")
\`\`\`

Et un test :

\`\`\`python
def test_email():
    assert valider_email("a@b") == True
\`\`\`

## Pistes d'analyse

- La validation est-elle suffisante ?
- Le mot de passe est-il validé ?
- Que se passe-t-il si l'utilisateur existe déjà ?
- L'erreur est-elle exploitable par l'appelant ?
- Les tests couvrent-ils les cas invalides ?
- Le nommage et les annotations de type sont-ils cohérents avec le reste du dépôt ?

## Format attendu

\`\`\`markdown
### Bloquant
- \`fichier.py:12\` — ...

### Important
- ...

### Suggestions
- ...

### Décision
Demande de changements — justification.
\`\`\``,
  },
  {
    slug: "inventaire-collections",
    title: "Inventaire avec dictionnaires et ensembles",
    description:
      "Agréger des données de stock hétérogènes avec les bonnes structures Python.",
    category: "exercice",
    difficulty: "debutant",
    estimatedMinutes: 45,
    moduleSlug: "structures-donnees",
    tags: ["Dictionnaires", "Ensembles", "Agrégation"],
    skills: ["python"],
    context:
      "Un fichier de mouvements de stock contient des doublons et des catégories manquantes. Le rapport doit être fiable et reproductible.",
    objective:
      "Calculer les quantités par article, les catégories uniques et les articles en rupture.",
    requirements: [
      "Lire une liste de dictionnaires `{article, categorie, quantite}`.",
      "Additionner les quantités par article.",
      "Lister les catégories uniques triées.",
      "Identifier les articles dont le stock est nul.",
      "Aucune boucle imbriquée sur les articles.",
    ],
    successCriteria: [
      "Les doublons sont correctement additionnés.",
      "Les catégories manquantes sont traitées (`inconnue`).",
      "Le résultat est trié de façon déterministe.",
      "Le code est testé avec une liste vide.",
    ],
    instructionsMd: `## Données d'entrée

\`\`\`python
mouvements = [
    {"article": "clavier", "categorie": "peripherique", "quantite": 5},
    {"article": "clavier", "categorie": "peripherique", "quantite": -2},
    {"article": "ecran", "categorie": "affichage", "quantite": 3},
    {"article": "cable", "quantite": 0},
]
\`\`\`

## Sortie attendue

\`\`\`python
{
    "stocks": {"cable": 0, "clavier": 3, "ecran": 3},
    "categories": ["affichage", "inconnue", "peripherique"],
    "ruptures": ["cable"],
}
\`\`\`

## Aides

- \`defaultdict(int)\` pour additionner ;
- \`set\` pour les catégories ;
- \`sorted\` pour un ordre stable.

## Bonus

Ajoutez une fonction \`fusionner_inventaires(a, b)\` qui combine deux rapports sans écraser les quantités.`,
  },
  {
    slug: "mini-orm",
    title: "Mini-ORM : mapping objet-relationnel",
    description:
      "Concevoir une couche d'accès aux données typée, testable et indépendante du stockage.",
    category: "evaluation",
    difficulty: "avance",
    estimatedMinutes: 180,
    moduleSlug: "poo",
    tags: ["POO", "Architecture", "SQL", "Tests"],
    skills: ["architecture-propre", "modelisation-sql", "python"],
    context:
      "Une application grandit et les requêtes SQL sont dispersées dans les contrôleurs. Il faut introduire une couche de persistance claire, sans dépendre d'un ORM externe.",
    objective:
      "Construire un mini-ORM capable de mapper des classes à des tables, d'insérer, lire et mettre à jour des objets.",
    requirements: [
      "Une classe de base `Model` avec `table`, `colonnes` et `cle_primaire`.",
      "Un `Repository` générique avec `ajouter`, `trouver`, `lister`, `mettre_a_jour`.",
      "Les requêtes utilisent des paramètres liés, jamais de concaténation de chaînes.",
      "Le stockage est injecté derrière une interface, pour permettre un faux en test.",
      "Au moins huit tests couvrent les cas nominaux et les erreurs.",
    ],
    successCriteria: [
      "Aucune injection SQL possible dans les valeurs.",
      "Le repository fonctionne avec un faux stockage en mémoire.",
      "Les erreurs de schéma sont explicites.",
      "La documentation explique comment ajouter un modèle.",
    ],
    instructionsMd: `## Architecture cible

\`\`\`text
domaine/        # entités pures
persistance/
├── modele.py   # Model, métadonnées
├── depot.py    # Repository
└── connexion.py# interface de stockage
tests/
└── test_depot.py
\`\`\`

## Interface de stockage

\`\`\`python
class Stockage(Protocol):
    def executer(self, requete: str, parametres: tuple) -> list[dict]: ...
    def executer_ecriture(self, requete: str, parametres: tuple) -> int: ...
\`\`\`

En test, remplacez-la par un faux qui enregistre les requêtes reçues.

## Exemple d'usage visé

\`\`\`python
class Lecon(Model):
    __table__ = "lessons"
    id: int
    titre: str
    minutes: int

depot = Repository(Lecon, stockage)
lecon = depot.ajouter(Lecon(id=0, titre="SQL", minutes=60))
assert depot.trouver(lecon.id).titre == "SQL"
\`\`\`

## Exigences de sécurité

Les valeurs doivent passer par des **paramètres liés** :

\`\`\`python
# Correct
stockage.executer("SELECT * FROM lessons WHERE id = %s", (identifiant,))

# Interdit
stockage.executer(f"SELECT * FROM lessons WHERE id = {identifiant}")
\`\`\`

## Grille

| Critère | Points |
| --- | --- |
| Conception et lisibilité | 30 |
| Correction des requêtes | 25 |
| Sécurité (paramètres liés) | 20 |
| Tests | 15 |
| Documentation | 10 |`,
  },
  {
    slug: "documenter-portfolio",
    title: "Documenter un projet pour son portfolio",
    description:
      "Rédiger une fiche projet professionnelle à partir d'un travail réellement réalisé.",
    category: "exercice",
    difficulty: "debutant",
    estimatedMinutes: 40,
    moduleSlug: "projet-fondamentaux",
    tags: ["Documentation", "Portfolio", "Communication"],
    skills: ["git-collaboration"],
    context:
      "Un recruteur consacre moins de deux minutes à un dépôt. Sans README clair et résultats mesurés, un bon projet passe inaperçu.",
    objective:
      "Produire une fiche projet complète, sincère et vérifiable, prête à être publiée dans DEVFORGE.",
    requirements: [
      "Décrire le problème résolu en une phrase.",
      "Lister les technologies réellement utilisées.",
      "Décrire deux décisions techniques et leur justification.",
      "Chiffrer un résultat (tests, couverture, performance).",
      "Fournir le lien du dépôt et une commande d'installation.",
    ],
    successCriteria: [
      "Aucune technologie n'est mentionnée sans usage réel.",
      "Les résultats sont mesurables ou observables.",
      "Le texte est relu, sans faute manifeste.",
      "La fiche tient en moins de 300 mots.",
    ],
    instructionsMd: `## Structure de la fiche

\`\`\`markdown
# Nom du projet

**Problème** — Une phrase.

**Solution** — Deux phrases maximum.

**Technologies** — Python 3.12, pytest, JSON.

**Décisions techniques**
1. Persistance JSON atomique — évite la corruption en cas d'arrêt brutal.
2. Service isolé de la CLI — permet de tester sans simuler le terminal.

**Résultats** — 12 tests, 91 % de couverture, démarrage en 40 ms.

**Dépôt** — https://github.com/...
\`\`\`

## Exercice de sincérité

Relisez chaque ligne et demandez-vous : « Puis-je le prouver ? » Si non, retirez ou reformulez.

- ❌ « Architecture microservices » pour un script unique.
- ✅ « Architecture en couches avec injection du stockage ».
- ❌ « Optimisé pour la production » sans mesure.
- ✅ « 10 000 insertions en 0,8 s sur une machine de bureau ».

## Livrable

Publiez la fiche dans la section « Mes projets » de DEVFORGE, avec le statut « Terminé » et le lien GitHub. Elle apparaîtra automatiquement dans votre portfolio.`,
  },
];

export function getMission(slug: string): Mission | undefined {
  return missions.find((mission) => mission.slug === slug);
}

export function missionsForModule(moduleSlug: string): Mission[] {
  return missions.filter((mission) => mission.moduleSlug === moduleSlug);
}

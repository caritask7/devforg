import type { Lesson } from "@/lib/types";

export const module01Lessons: Lesson[] = [
  {
    slug: "python-environnement",
    moduleSlug: "python-fondamentaux",
    position: 1,
    title: "Installer Python et exécuter son premier script",
    summary:
      "Mettre en place un environnement de travail fiable et comprendre le cycle d'exécution d'un programme Python.",
    estimatedMinutes: 45,
    codeLanguage: "python",
    keyPoints: [
      "Python 3.12+ est la version de référence",
      "Un script s'exécute de haut en bas",
      "Le terminal est l'outil de vérification principal",
    ],
    contentMd: `## Pourquoi l'environnement compte

Un environnement reproductible évite la majorité des problèmes de débutant : version de Python inconnue, dépendances installées au mauvais endroit, script lancé depuis le mauvais dossier. Prenez l'habitude de vérifier ces trois éléments **avant** d'écrire du code.

## 1. Vérifier l'installation

Ouvrez un terminal et exécutez :

\`\`\`bash
python --version
# Python 3.12.4

python -c "print('Bonjour DEVFORGE')"
\`\`\`

Sur macOS et Linux, la commande est souvent \`python3\`. Sur Windows, \`py\` fonctionne également.

> **À retenir** — Si la commande affiche Python 2 ou une erreur, réinstallez Python depuis python.org en cochant « Add Python to PATH » sous Windows.

## 2. Structure d'un script

Créez un fichier \`hello.py\` :

\`\`\`python
# hello.py
prenom = "Ada"
message = f"Bonjour {prenom}, bienvenue dans DEVFORGE."
print(message)
\`\`\`

Exécutez-le avec :

\`\`\`bash
python hello.py
\`\`\`

Python lit le fichier **ligne par ligne**, de haut en bas. Chaque instruction est exécutée dès qu'elle est rencontrée.

## 3. Le REPL pour expérimenter

Le REPL (Read–Eval–Print Loop) est une console interactive. Lancez \`python\` sans argument :

\`\`\`python
>>> 2 + 3
5
>>> nom = "DEVFORGE"
>>> nom.lower()
'devforge'
\`\`\`

Le REPL est parfait pour tester une expression. Il ne remplace pas un fichier pour un programme complet.

## 4. Organiser son projet

\`\`\`text
mon-projet/
├── .venv/            # environnement virtuel (ignoré par Git)
├── src/
│   └── main.py
├── README.md
└── .gitignore
\`\`\`

Créez un environnement virtuel dès qu'un projet utilise des dépendances :

\`\`\`bash
python -m venv .venv
# Windows
.venv\\Scripts\\activate
# macOS / Linux
source .venv/bin/activate
\`\`\`

## Erreurs fréquentes

- **\`python: command not found\`** : Python n'est pas dans le PATH.
- **Éditer un fichier puis oublier de le sauvegarder** : exécutez toujours la version enregistrée.
- **Lancer un script depuis un autre dossier** : utilisez le chemin complet ou déplacez-vous avec \`cd\`.

## Exercice rapide

Écrivez un script qui affiche votre prénom, la version de Python utilisée et le résultat de \`17 * 23\`. Exécutez-le depuis un terminal, sans copier le résultat à la main.`,
  },
  {
    slug: "python-variables-types",
    moduleSlug: "python-fondamentaux",
    position: 2,
    title: "Variables, types et opérateurs",
    summary:
      "Comprendre comment Python stocke les valeurs, comment les nommer et comment les combiner sans erreur.",
    estimatedMinutes: 60,
    codeLanguage: "python",
    keyPoints: [
      "Une variable est une étiquette vers une valeur",
      "Python est fortement typé mais dynamiquement typé",
      "int, float, str, bool et None couvrent l'essentiel",
    ],
    contentMd: `## Une variable n'est pas une boîte

En Python, une variable est un **nom qui référence un objet** en mémoire. Affecter \`a = 10\` puis \`b = a\` ne copie pas la valeur : les deux noms pointent vers le même objet immuable.

\`\`\`python
a = 10
b = a
a = 20
print(b)  # 10 : l'entier référencé par b n'a pas changé
\`\`\`

## 1. Les types fondamentaux

| Type | Exemple | Usage |
| --- | --- | --- |
| \`int\` | \`42\` | entiers, compteurs |
| \`float\` | \`3.14\` | mesures, calculs décimaux |
| \`str\` | \`"DEVFORGE"\` | texte |
| \`bool\` | \`True\` | conditions |
| \`NoneType\` | \`None\` | absence de valeur |

\`\`\`python
age: int = 28
moyenne: float = 14.75
langage: str = "Python"
est_actif: bool = True
objectif = None
\`\`\`

Les annotations \`:\` sont facultatives à l'exécution, mais elles documentent le contrat et permettent aux outils comme **mypy** de détecter des erreurs.

## 2. Nommer proprement

- \`snake_case\` pour les variables et fonctions.
- Un nom décrit l'intention, pas le type : \`total_heures\` plutôt que \`mon_int\`.
- Évitez les noms d'une lettre sauf dans un contexte mathématique court.

\`\`\`python
# Mauvais
t = 720

# Bon
duree_module_minutes = 720
\`\`\`

## 3. Opérateurs essentiels

\`\`\`python
print(7 / 2)    # 3.5  division flottante
print(7 // 2)   # 3    division entière
print(7 % 2)    # 1    modulo
print(2 ** 10)  # 1024 exponentiation

total = 0
total += 5      # équivaut à total = total + 5
\`\`\`

La concaténation de chaînes et de nombres échoue volontairement :

\`\`\`python
# TypeError
# "Score : " + 98

# Solution explicite
print("Score : " + str(98))
print(f"Score : {98}")
\`\`\`

## 4. Conversion de types

\`\`\`python
int("42")        # 42
float("3.5")     # 3.5
str(3.5)         # "3.5"
bool("False")    # True : toute chaîne non vide est vraie !
\`\`\`

> **Piège classique** — \`bool("False")\` vaut \`True\`. Pour convertir une chaîne en booléen, comparez explicitement : \`valeur == "True"\`.

## Exercice rapide

Écrivez un programme qui convertit une durée en minutes (\`total = 725\`) en heures et minutes, puis affiche \`12 h 05\`. Utilisez \`//\` et \`%\`.`,
  },
  {
    slug: "python-chaines",
    moduleSlug: "python-fondamentaux",
    position: 3,
    title: "Manipuler les chaînes de caractères",
    summary:
      "Nettoyer, découper, assembler et rechercher du texte avec les méthodes essentielles de str.",
    estimatedMinutes: 55,
    codeLanguage: "python",
    keyPoints: [
      "Les chaînes sont immuables",
      "f-strings pour construire du texte lisible",
      "split, join, strip et replace couvrent la majorité des besoins",
    ],
    contentMd: `## Une chaîne est immuable

Aucune méthode de chaîne ne modifie l'original : elle renvoie une **nouvelle** chaîne. C'est une garantie importante pour éviter les effets de bord.

\`\`\`python
langage = "Python"
langage.upper()
print(langage)  # Python
print(langage.upper())  # PYTHON
\`\`\`

## 1. Nettoyer et normaliser

\`\`\`python
saisie = "   DevForge  "
print(saisie.strip())          # "DevForge"
print(saisie.strip().lower())  # "devforge"
print("a,b,c".split(","))      # ['a', 'b', 'c']
print(" | ".join(["a", "b"]))  # "a | b"
print("bonjour".replace("jour", "soir"))  # "bonsoir"
\`\`\`

Cas fréquent : comparer des e-mails saisis avec des espaces ou une casse différente.

\`\`\`python
def normaliser_email(email: str) -> str:
    return email.strip().lower()

assert normaliser_email("  Ada@Example.com ") == "ada@example.com"
\`\`\`

## 2. Construire du texte avec f-strings

\`\`\`python
nom = "Ada"
score = 98.456

print(f"{nom} a obtenu {score:.1f} points")  # Ada a obtenu 98.5 points
print(f"{nom:>10}")                          # alignement à droite
print(f"{12:02d}:{5:02d}")                   # 12:05
\`\`\`

## 3. Découper proprement

Le **slicing** utilise \`[début:fin:pas]\` ; la borne de fin est exclue.

\`\`\`python
code = "DEVFORGE-2026"
print(code[:8])     # DEVFORGE
print(code[-4:])    # 2026
print(code[::-1])   # 6202-EGROFVED
\`\`\`

## 4. Rechercher et valider

\`\`\`python
texte = "Le code doit être lisible."
print("code" in texte)          # True
print(texte.startswith("Le"))   # True
print(texte.find("lisible"))    # 20
print(texte.count("e"))         # 4
\`\`\`

> **À retenir** — \`find\` renvoie \`-1\` quand l'élément est absent. En Python, préférez \`in\` pour un test booléen.

## Exercice rapide

Écrivez \`initiales("ada lovelace")\` qui renvoie \`"A.L."\`. Gérez les espaces multiples et les majuscules.`,
  },
  {
    slug: "python-entrees-sorties",
    moduleSlug: "python-fondamentaux",
    position: 4,
    title: "Entrées, sorties et formatage",
    summary:
      "Interagir avec l'utilisateur, convertir les saisies et produire des sorties lisibles et fiables.",
    estimatedMinutes: 50,
    codeLanguage: "python",
    keyPoints: [
      "input() renvoie toujours une chaîne",
      "Toute saisie doit être validée",
      "print() accepte plusieurs arguments et un séparateur",
    ],
    contentMd: `## input() renvoie du texte

\`\`\`python
prenom = input("Votre prénom : ")
print(f"Bonjour {prenom} !")
\`\`\`

Même si l'utilisateur tape \`42\`, la valeur est la chaîne \`"42"\`. Il faut convertir explicitement.

\`\`\`python
age = int(input("Votre âge : "))
\`\`\`

Si l'utilisateur tape \`vingt\`, Python lève une \`ValueError\`. Un programme robuste anticipe ce cas :

\`\`\`python
def demander_entier(message: str) -> int:
    while True:
        saisie = input(message).strip()
        try:
            return int(saisie)
        except ValueError:
            print("Entrée invalide : saisissez un nombre entier.")
\`\`\`

## 1. Sorties lisibles

\`\`\`python
print("Python", "SQL", "Git", sep=" | ")
print("Calcul terminé", end="\\n\\n")
print(f"{'Module':<20}{'Durée':>8}")
print(f"{'Python':<20}{'10 h':>8}")
\`\`\`

## 2. Un mini programme complet

\`\`\`python
def convertir_minutes(total: int) -> str:
    heures, minutes = divmod(total, 60)
    return f"{heures} h {minutes:02d}"

duree = int(input("Durée en minutes : "))
print(f"Durée formatée : {convertir_minutes(duree)}")
\`\`\`

\`divmod\` renvoie le quotient **et** le reste en une seule opération.

## 3. Journaliser plutôt qu'imprimer

Dans un vrai programme, \`print\` sert à l'utilisateur, \`logging\` sert au développeur.

\`\`\`python
import logging

logging.basicConfig(level=logging.INFO)
logging.info("Démarrage du calcul")
logging.warning("Donnée manquante, valeur par défaut utilisée")
\`\`\`

> **Bonne pratique** — Une fonction métier ne devrait pas appeler \`input()\` ni \`print()\` : elle reçoit des paramètres et renvoie un résultat. L'interaction reste dans la couche CLI.

## Exercice rapide

Demandez deux nombres à l'utilisateur et affichez leur somme, leur différence et leur quotient. Refusez la division par zéro avec un message clair.`,
  },
  {
    slug: "python-atelier-calculateur",
    moduleSlug: "python-fondamentaux",
    position: 5,
    title: "Atelier : un calculateur en ligne de commande",
    summary:
      "Assembler variables, conditions, boucles et fonctions dans un programme interactif complet.",
    estimatedMinutes: 75,
    codeLanguage: "python",
    keyPoints: [
      "Séparer logique métier et interface",
      "Boucler jusqu'à une commande de sortie",
      "Tester chaque fonction isolément",
    ],
    contentMd: `## Objectif de l'atelier

Construire un calculateur qui :

1. affiche un menu ;
2. lit un choix ;
3. demande les opérandes nécessaires ;
4. affiche le résultat ;
5. recommence jusqu'à \`q\`.

## 1. La logique métier

\`\`\`python
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
\`\`\`

Cette fonction ne fait aucune saisie. Elle est donc **simple à tester** :

\`\`\`python
assert calculer(2, 3, "+") == 5
assert calculer(10, 4, "-") == 6
assert calculer(3, 4, "*") == 12
assert calculer(9, 3, "/") == 3
\`\`\`

## 2. L'interface en ligne de commande

\`\`\`python
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
\`\`\`

## 3. Améliorations attendues

- Ajouter une opération puissance \`**\`.
- Afficher un historique des cinq derniers calculs.
- Permettre de relancer le dernier calcul.
- Extraire \`MENU\` et \`operations\` dans un module \`ui.py\`.

> **À retenir** — Le bloc \`if __name__ == "__main__"\` empêche l'exécution automatique du programme lorsque le fichier est importé par un test.

## Livrable

Une version fonctionnelle, avec au moins quatre opérations, une gestion d'erreur claire et deux tests. C'est le premier projet que vous pouvez publier sur GitHub.`,
  },
];

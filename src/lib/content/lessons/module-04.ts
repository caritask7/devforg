import type { Lesson } from "@/lib/types";

export const module04Lessons: Lesson[] = [
  {
    slug: "listes-et-tuples",
    moduleSlug: "structures-donnees",
    position: 1,
    title: "Listes et tuples",
    summary:
      "Choisir entre collection mutable et immuable, et maîtriser les opérations de séquence.",
    estimatedMinutes: 60,
    codeLanguage: "python",
    keyPoints: [
      "Une liste est mutable, un tuple ne l'est pas",
      "Les tranches créent des copies",
      "Attention aux copies superficielles",
    ],
    contentMd: `## Liste ou tuple ?

\`\`\`python
notes = [12, 15, 9]          # liste : évolutive
coordonnees = (48.85, 2.35)  # tuple : fixe
\`\`\`

Une liste sert à accumuler ou modifier. Un tuple sert à représenter une valeur composée stable (coordonnées, RGB, entrée d'historique).

## 1. Opérations courantes

\`\`\`python
notes.append(18)        # ajoute en fin
notes.insert(1, 14)     # insère à l'indice 1
notes.remove(9)         # retire la première occurrence
derniere = notes.pop()  # retire et renvoie le dernier
notes.sort()            # trie sur place
print(sorted(notes))    # renvoie une copie triée
\`\`\`

\`sort()\` modifie la liste et renvoie \`None\`. Une erreur classique :

\`\`\`python
# notes = notes.sort()  # notes vaut None !
notes.sort()
\`\`\`

## 2. Tranches

\`\`\`python
semaine = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"]
print(semaine[:5])     # jours ouvrés
print(semaine[-2:])    # week-end
print(semaine[::2])    # un jour sur deux
\`\`\`

Une tranche \`[:]\` crée une **copie superficielle** : la liste est nouvelle, mais les objets qu'elle contient sont partagés pour les types mutables.

\`\`\`python
matrice = [[0, 0], [0, 0]]
copie = matrice[:]
copie[0][0] = 1
print(matrice[0][0])  # 1 !
\`\`\`

Pour une copie profonde : \`copy.deepcopy(matrice)\`.

## 3. Déballage

\`\`\`python
premier, *milieu, dernier = [1, 2, 3, 4, 5]
print(premier, milieu, dernier)  # 1 [2, 3, 4] 5

def position() -> tuple[float, float]:
    return 48.85, 2.35

latitude, longitude = position()
\`\`\`

## 4. Trier avec une clé

\`\`\`python
etudiants = [
    {"nom": "Ada", "score": 98},
    {"nom": "Linus", "score": 91},
    {"nom": "Grace", "score": 99},
]
classement = sorted(etudiants, key=lambda e: e["score"], reverse=True)
\`\`\`

Le tri est stable : à score égal, l'ordre d'origine est conservé.

> **À retenir** — Choisissez la structure selon l'intention : une collection qui évolue est une liste ; une valeur composée immuable est un tuple.

## Exercice rapide

Écrivez \`top_n(notes, n)\` qui renvoie les n plus grandes notes sans modifier la liste d'origine. Testez avec \`n > len(notes)\`.`,
  },
  {
    slug: "dictionnaires",
    moduleSlug: "structures-donnees",
    position: 2,
    title: "Dictionnaires : modéliser des données nommées",
    summary:
      "Utiliser les tables de hachage pour associer des clés à des valeurs et compter efficacement.",
    estimatedMinutes: 60,
    codeLanguage: "python",
    keyPoints: [
      "Accès O(1) en moyenne",
      "get et setdefault évitent les KeyError",
      "Les clés doivent être hachables",
    ],
    contentMd: `## Le dictionnaire, structure centrale

\`\`\`python
profil = {
    "nom": "Ada Lovelace",
    "niveau": "intermediaire",
    "competences": ["Python", "SQL"],
}

print(profil["nom"])
print(profil.get("age", "non renseigné"))
\`\`\`

\`profil["age"]\` lèverait une \`KeyError\`. \`get\` renvoie une valeur par défaut.

## 1. Mettre à jour

\`\`\`python
profil["niveau"] = "avance"
profil["email"] = "ada@example.com"
del profil["competences"]

for cle, valeur in profil.items():
    print(f"{cle} = {valeur}")
\`\`\`

## 2. Compter avec un dictionnaire

\`\`\`python
texte = "le code doit etre lisible et le code doit etre teste"
compteur: dict[str, int] = {}

for mot in texte.split():
    compteur[mot] = compteur.get(mot, 0) + 1

print(compteur["code"])  # 2
\`\`\`

Depuis Python 3.10, \`collections.Counter\` fait cela directement :

\`\`\`python
from collections import Counter

frequences = Counter(texte.split())
print(frequences.most_common(3))
\`\`\`

## 3. setdefault et regroupement

\`\`\`python
par_categorie: dict[str, list[str]] = {}

for langage, categorie in [("Python", "backend"), ("SQL", "data"), ("Django", "backend")]:
    par_categorie.setdefault(categorie, []).append(langage)

print(par_categorie)
# {'backend': ['Python', 'Django'], 'data': ['SQL']}
\`\`\`

## 4. Fusionner des dictionnaires

\`\`\`python
defaut = {"theme": "clair", "langue": "fr"}
preferences = {"theme": "sombre"}

reglages = defaut | preferences
print(reglages["theme"])  # sombre
\`\`\`

L'opérateur \`|\` (Python 3.9+) crée un nouveau dictionnaire. \`update\` modifie sur place.

## 5. Clés hachables

Une clé doit être immuable : \`str\`, \`int\`, \`tuple\`. Une liste ne peut pas être une clé.

\`\`\`python
# KeyError / TypeError
# cache[[1, 2]] = "valeur"

cache[(1, 2)] = "valeur"  # tuple : OK
\`\`\`

> **Piège** — L'ordre d'insertion est conservé, mais ne vous en servez pas comme d'un contrat métier. Si l'ordre compte, triez explicitement.

## Exercice rapide

À partir d'une liste de transactions \`{"categorie": "livres", "montant": 24.9}\`, calculez le total dépensé par catégorie. Utilisez \`setdefault\` ou \`Counter\` et affichez les catégories triées par montant décroissant.`,
  },
  {
    slug: "ensembles",
    moduleSlug: "structures-donnees",
    position: 3,
    title: "Ensembles et opérations sur les collections",
    summary:
      "Dédupliquer, comparer et croiser des données avec set, sans écrire de boucles manuelles.",
    estimatedMinutes: 45,
    codeLanguage: "python",
    keyPoints: [
      "Un set élimine les doublons",
      "Les opérations ensemblistes sont rapides",
      "L'ordre n'est pas garanti",
    ],
    contentMd: `## Dédupliquer

\`\`\`python
technologies = ["Python", "SQL", "Python", "Git", "SQL"]
uniques = set(technologies)
print(uniques)  # {'Python', 'SQL', 'Git'}
\`\`\`

Pour conserver l'ordre d'apparition :

\`\`\`python
uniques = list(dict.fromkeys(technologies))
print(uniques)  # ['Python', 'SQL', 'Git']
\`\`\`

## 1. Appartenance rapide

\`\`\`python
langages = {"Python", "Rust", "TypeScript"}
print("Rust" in langages)  # True
\`\`\`

Sur un \`set\`, le test \`in\` est en moyenne O(1) ; sur une liste, il est O(n).

## 2. Opérations ensemblistes

\`\`\`python
backend = {"Python", "SQL", "Docker"}
data = {"Python", "SQL", "pandas"}

print(backend | data)   # union
print(backend & data)   # intersection
print(backend - data)   # différence
print(backend ^ data)   # différence symétrique
\`\`\`

\`\`\`python
competences_requises = {"Python", "SQL", "Git"}
competences_acquises = {"Python", "Git", "Docker"}

manquantes = competences_requises - competences_acquises
print(manquantes)  # {'SQL'}
\`\`\`

## 3. Modifier un ensemble

\`\`\`python
vues = set()
vues.add("lecon-01")
vues.add("lecon-01")  # ignoré
vues.discard("lecon-02")  # aucune erreur si absent
vues.remove("lecon-01")   # KeyError si absent

vues.update(["lecon-03", "lecon-04"])
\`\`\`

## 4. Ensembles figés

\`\`\`python
tags = frozenset({"python", "debutant"})
# utilisable comme clé de dictionnaire
index = {tags: "lecon-01"}
\`\`\`

> **À retenir** — Un \`set\` n'a pas d'ordre. Ne l'utilisez pas quand l'ordre d'affichage est un contrat. Convertissez en liste triée au moment du rendu.

## Exercice rapide

Deux listes d'e-mails (inscrits, désabonnés) contiennent des doublons. Calculez : les adresses actives, les adresses désabonnées, et les adresses présentes dans les deux listes. Affichez le tout trié.`,
  },
  {
    slug: "comprehensions",
    moduleSlug: "structures-donnees",
    position: 4,
    title: "Compréhensions et générateurs",
    summary:
      "Transformer et filtrer des collections en une expression lisible, sans surcharger la mémoire.",
    estimatedMinutes: 55,
    codeLanguage: "python",
    keyPoints: [
      "La compréhension remplace une boucle d'accumulation",
      "La condition de filtre se place à droite",
      "Un générateur produit à la demande",
    ],
    contentMd: `## De la boucle à l'expression

\`\`\`python
# Boucle classique
carres = []
for nombre in range(1, 6):
    carres.append(nombre ** 2)

# Compréhension
carres = [nombre ** 2 for nombre in range(1, 6)]
\`\`\`

Les deux produisent \`[1, 4, 9, 16, 25]\`.

## 1. Filtrer

\`\`\`python
notes = [12, 7, 15, 4, 18]
admis = [note for note in notes if note >= 10]
print(admis)  # [12, 15, 18]
\`\`\`

L'ordre de lecture : « garde \`note\` **si** \`note >= 10\` ».

## 2. Transformer

\`\`\`python
etudiants = [{"nom": "ada", "score": 98}, {"nom": "linus", "score": 76}]
noms = [e["nom"].capitalize() for e in etudiants]
\`\`\`

## 3. Dictionnaires et ensembles

\`\`\`python
scores = {"Ada": 98, "Linus": 76}
passe = {nom: score for nom, score in scores.items() if score >= 80}
print(passe)  # {'Ada': 98}

lettres = {c.lower() for c in "DevForge"}
\`\`\`

## 4. Conditions imbriquées

\`\`\`python
resultats = [
    "FizzBuzz" if n % 15 == 0 else "Fizz" if n % 3 == 0 else "Buzz" if n % 5 == 0 else str(n)
    for n in range(1, 16)
]
\`\`\`

Cette expression est correcte mais difficile à relire. Au-delà de deux conditions, revenez à une fonction nommée.

## 5. Générateurs

Utilisez des parenthèses pour produire les valeurs à la demande :

\`\`\`python
carres = (n ** 2 for n in range(1_000_000))
print(sum(carres))  # calcul sans stocker un million d'entiers
\`\`\`

\`\`\`python
def lignes_utiles(fichier):
    for ligne in fichier:
        ligne = ligne.strip()
        if ligne and not ligne.startswith("#"):
            yield ligne
\`\`\`

Un générateur ne peut être parcouru qu'une seule fois.

> **Règle de lisibilité** — Une compréhension doit tenir sur une ligne courte et rester compréhensible à la lecture. Sinon, extrayez une fonction.

## Exercice rapide

À partir d'une liste de modules \`{"titre": ..., "minutes": ..., "termine": bool}\`, produisez la liste des titres terminés en moins de 90 minutes, puis la durée totale restante avec un générateur.`,
  },
  {
    slug: "tri-et-agregation",
    moduleSlug: "structures-donnees",
    position: 5,
    title: "Trier, rechercher et agréger",
    summary:
      "Utiliser les outils standards pour ordonner, rechercher et résumer des jeux de données.",
    estimatedMinutes: 55,
    codeLanguage: "python",
    keyPoints: [
      "sorted renvoie une copie, list.sort trie sur place",
      "La clé de tri peut être multiple",
      "min, max, sum et any évitent des boucles",
    ],
    contentMd: `## Trier par critères multiples

\`\`\`python
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
\`\`\`

Le tuple de clé est comparé de gauche à droite. Le signe \`-\` inverse seulement la durée.

## 1. Rechercher

\`\`\`python
titres = [m["titre"] for m in modules]
print("SQL" in titres)  # True

sql = next((m for m in modules if m["titre"] == "SQL"), None)
if sql is None:
    print("Module introuvable")
\`\`\`

Pour des recherches répétées sur une grande collection, construisez un index :

\`\`\`python
index = {m["titre"]: m for m in modules}
print(index["SQL"]["minutes"])
\`\`\`

## 2. Agréger

\`\`\`python
duree_totale = sum(m["minutes"] for m in modules)
plus_long = max(modules, key=lambda m: m["minutes"])
plus_court = min(modules, key=lambda m: m["minutes"])

tous_courts = all(m["minutes"] <= 600 for m in modules)
au_moins_un_long = any(m["minutes"] > 500 for m in modules)
\`\`\`

## 3. Regrouper

\`\`\`python
from collections import defaultdict

par_phase: dict[int, list[str]] = defaultdict(list)
for module in modules:
    par_phase[module["phase"]].append(module["titre"])

print(dict(par_phase))
\`\`\`

\`defaultdict\` crée la valeur par défaut à la première consultation, sans \`setdefault\`.

## 4. Paginer

\`\`\`python
def paginer(elements: list, page: int, taille: int = 10) -> list:
    debut = (page - 1) * taille
    return elements[debut:debut + taille]
\`\`\`

## 5. Attention aux performances

\`\`\`python
# O(n²) : reconstruire une liste pour chaque élément
resultats = [x for x in tres_grande_liste if x in autre_grande_liste]

# O(n) : convertir la seconde liste en set
reference = set(autre_grande_liste)
resultats = [x for x in tres_grande_liste if x in reference]
\`\`\`

> **À retenir** — Le bon outil dépend de la question : \`in\` pour l'appartenance, \`index\` pour l'accès par clé, \`sorted\` pour l'ordre, \`any/all\` pour les prédicats.

## Exercice rapide

À partir d'une liste de leçons \`{"module": ..., "minutes": ..., "terminee": bool}\`, calculez la durée totale par module, le taux de complétion global, et la leçon la plus longue encore inachevée.`,
  },
];

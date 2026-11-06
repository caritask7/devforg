import type { Lesson } from "@/lib/types";

export const module02Lessons: Lesson[] = [
  {
    slug: "conditions-logiques",
    moduleSlug: "conditions-boucles",
    position: 1,
    title: "Conditions et opérateurs logiques",
    summary:
      "Exprimer des décisions claires avec if/elif/else, les comparaisons et les opérateurs booléens.",
    estimatedMinutes: 50,
    codeLanguage: "python",
    keyPoints: [
      "if / elif / else s'évalue de haut en bas",
      "and, or et not composent des conditions",
      "Comparer == et non =",
    ],
    contentMd: `## Prendre une décision

\`\`\`python
temperature = 18

if temperature < 10:
    print("Manteau obligatoire")
elif temperature < 20:
    print("Veste recommandée")
else:
    print("Tenue légère")
\`\`\`

Python teste les branches dans l'ordre et s'arrête à la première vraie. L'ordre des \`elif\` est donc important.

## 1. Comparer correctement

| Opérateur | Sens |
| --- | --- |
| \`==\` | égalité |
| \`!=\` | différence |
| \`<\`, \`<=\` | infériorité |
| \`>\`, \`>=\` | supériorité |
| \`is\` | identité (même objet) |

\`\`\`python
note = 12
print(note >= 10)  # True
print(note == 12)  # True
print(note != 12)  # False
\`\`\`

> **Piège** — \`=\` est une affectation. \`if x = 5:\` provoque une \`SyntaxError\`.

## 2. Combiner des conditions

\`\`\`python
age = 22
avec_autorisation = True

if age >= 18 and avec_autorisation:
    print("Accès autorisé")

if age < 18 or not avec_autorisation:
    print("Accès refusé")
\`\`\`

Python évalue de gauche à droite avec **court-circuit** :

\`\`\`python
utilisateur = None
# Pas d'erreur : la seconde partie n'est pas évaluée
if utilisateur is not None and utilisateur.upper() == "ADA":
    print("Trouvé")
\`\`\`

## 3. Conditions chaînées

\`\`\`python
if 18 <= age < 65:
    print("Tarif actif")
\`\`\`

Cette écriture est équivalente à \`age >= 18 and age < 65\`.

## 4. Valeurs « falsy »

Sont considérés faux : \`False\`, \`None\`, \`0\`, \`0.0\`, \`""\`, \`[]\`, \`{}\`, \`()\`.

\`\`\`python
resultats = []
if not resultats:
    print("Aucun résultat")
\`\`\`

## Erreurs fréquentes

- Enchaîner des \`if\` indépendants alors qu'un \`elif\` serait plus juste.
- Oublier les deux-points.
- Mélanger \`and\` et \`or\` sans parenthèses.

\`\`\`python
# Ambigu
if role == "admin" or role == "editeur" and actif:

# Clair
if role == "admin" or (role == "editeur" and actif):
\`\`\`

## Exercice rapide

Écrivez \`categoriser_imc(imc)\` qui renvoie \`"insuffisance"\`, \`"normal"\`, \`"surpoids"\` ou \`"obésité"\` selon les seuils 18.5, 25 et 30. Testez les bornes exactes.`,
  },
  {
    slug: "boucles-for",
    moduleSlug: "conditions-boucles",
    position: 2,
    title: "Boucles for et itération",
    summary:
      "Parcourir des séquences, générer des nombres et utiliser range sans erreur d'indice.",
    estimatedMinutes: 55,
    codeLanguage: "python",
    keyPoints: [
      "for parcourt un itérable",
      "range(5) va de 0 à 4",
      "enumerate donne index et valeur",
    ],
    contentMd: `## Itérer sur une séquence

\`\`\`python
langages = ["Python", "SQL", "Git"]

for langage in langages:
    print(langage)
\`\`\`

La boucle \`for\` Python est un **for each** : elle parcourt les éléments, pas des indices.

## 1. range

\`\`\`python
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

for i in range(2, 6):
    print(i)  # 2, 3, 4, 5

for i in range(10, 0, -2):
    print(i)  # 10, 8, 6, 4, 2
\`\`\`

La borne de fin est toujours exclue. C'est la source d'erreur numéro un.

## 2. Indices et valeurs

\`\`\`python
jours = ["lundi", "mardi", "mercredi"]

for index, jour in enumerate(jours, start=1):
    print(f"{index}. {jour}")
\`\`\`

Évitez \`for i in range(len(jours))\` : c'est plus long et moins sûr.

## 3. Parcourir un dictionnaire

\`\`\`python
scores = {"Python": 88, "SQL": 75}

for langue, score in scores.items():
    print(f"{langue}: {score}")
\`\`\`

## 4. break, continue, else

\`\`\`python
nombres = [4, 9, 16, 25]

for nombre in nombres:
    if nombre % 2 == 0:
        continue  # passe au suivant
    if nombre > 20:
        break  # quitte la boucle
    print(nombre)

# Le else s'exécute seulement si aucun break n'a eu lieu
for nombre in nombres:
    if nombre > 100:
        break
else:
    print("Aucun nombre supérieur à 100")
\`\`\`

## 5. Accumuler un résultat

\`\`\`python
total = 0
for note in [12, 15, 9, 18]:
    total += note

moyenne = total / 4
print(f"Moyenne : {moyenne:.2f}")
\`\`\`

> **Bon réflexe** — Avant d'écrire une boucle, demandez-vous si \`sum\`, \`min\`, \`max\` ou \`any\` ne suffisent pas.

## Exercice rapide

Affichez les nombres de 1 à 50, mais remplacez les multiples de 3 par \`"Fizz"\` et les multiples de 5 par \`"Buzz"\`. (Indice : la prochaine leçon vous fera écrire FizzBuzz complet.)`,
  },
  {
    slug: "boucles-while",
    moduleSlug: "conditions-boucles",
    position: 3,
    title: "Boucles while et contrôle de flux",
    summary:
      "Répéter une action tant qu'une condition est vraie, sans créer de boucle infinie.",
    estimatedMinutes: 50,
    codeLanguage: "python",
    keyPoints: [
      "while vérifie la condition avant chaque tour",
      "La variable de contrôle doit évoluer",
      "break et continue restent disponibles",
    ],
    contentMd: `## Quand utiliser while

Utilisez \`for\` quand le nombre d'itérations est connu, \`while\` quand la sortie dépend d'un état.

\`\`\`python
compteur = 3
while compteur > 0:
    print(compteur)
    compteur -= 1
print("Décollage !")
\`\`\`

Si vous oubliez \`compteur -= 1\`, la boucle ne se termine jamais. Interrompez-la avec \`Ctrl+C\`.

## 1. Boucle d'attente d'une saisie valide

\`\`\`python
mot_de_passe = ""
while len(mot_de_passe) < 8:
    mot_de_passe = input("Mot de passe (8 caractères min.) : ")
    if len(mot_de_passe) < 8:
        print("Trop court.")
print("Mot de passe accepté.")
\`\`\`

## 2. Boucle avec sentinelle

\`\`\`python
total = 0
while True:
    saisie = input("Nombre à ajouter (ou 'stop') : ")
    if saisie == "stop":
        break
    total += float(saisie)
print(f"Total : {total}")
\`\`\`

\`while True\` est acceptable si un \`break\` est **garanti** sur un chemin clair.

## 3. Éviter les boucles infinies

Trois garde-fous :

1. initialiser la variable de contrôle ;
2. la modifier dans la boucle ;
3. prévoir une limite de sécurité si la sortie dépend d'une source externe.

\`\`\`python
tentatives = 0
while tentatives < 3:
    tentatives += 1
    print(f"Tentative {tentatives}/3")
\`\`\`

## 4. Convergence numérique

\`\`\`python
def racine_carree(valeur: float, epsilon: float = 1e-9) -> float:
    estimation = valeur / 2
    while abs(estimation * estimation - valeur) > epsilon:
        estimation = (estimation + valeur / estimation) / 2
    return estimation

print(racine_carree(2))  # ≈ 1.414213562
\`\`\`

> **À retenir** — Une condition de boucle doit porter sur une valeur qui peut raisonnablement changer. Pour un compteur, initialisez avant et décrémentez dans le corps.

## Exercice rapide

Simulez un distributeur : le solde vaut 100. Tant que l'utilisateur retire une somme valide et inférieure au solde, décrémentez-le. Affichez « Fonds insuffisants » sans quitter la boucle, et « Terminé » après confirmation.`,
  },
  {
    slug: "validation-saisie",
    moduleSlug: "conditions-boucles",
    position: 4,
    title: "Valider une saisie utilisateur",
    summary:
      "Construire des boucles de validation robustes et séparer la validation de l'affichage.",
    estimatedMinutes: 45,
    codeLanguage: "python",
    keyPoints: [
      "Ne jamais faire confiance à une entrée",
      "Une fonction de validation renvoie un résultat ou lève une erreur",
      "Limiter le nombre de tentatives",
    ],
    contentMd: `## Le contrat d'entrée

Toute donnée venant de l'extérieur — clavier, fichier, API — doit être considérée comme non fiable. Le rôle de la validation est d'**échouer tôt et clairement**.

## 1. Validation par exception

\`\`\`python
def parse_entier(texte: str, minimum: int | None = None) -> int:
    valeur = int(texte.strip())
    if minimum is not None and valeur < minimum:
        raise ValueError(f"La valeur doit être ≥ {minimum}")
    return valeur
\`\`\`

\`\`\`python
try:
    age = parse_entier("17", minimum=18)
except ValueError as erreur:
    print(f"Saisie refusée : {erreur}")
\`\`\`

## 2. Boucle de reprise

\`\`\`python
def demander_age(max_tentatives: int = 3) -> int | None:
    for _ in range(max_tentatives):
        saisie = input("Votre âge : ")
        try:
            return parse_entier(saisie, minimum=0)
        except ValueError as erreur:
            print(f"Erreur : {erreur}")
    print("Nombre de tentatives dépassé.")
    return None
\`\`\`

## 3. Validation de plusieurs champs

\`\`\`python
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
\`\`\`

Retourner **toutes** les erreurs est plus utile que s'arrêter à la première.

## 4. Un menu robuste

\`\`\`python
OPTIONS = {"1": "consulter", "2": "ajouter", "q": "quitter"}

def lire_choix() -> str:
    while True:
        choix = input("Choix : ").strip().lower()
        if choix in OPTIONS:
            return choix
        print(f"Choix invalide. Options : {', '.join(OPTIONS)}")
\`\`\`

> **Bonne pratique** — Une fonction de validation ne doit pas afficher de message. Elle renvoie un booléen, une liste d'erreurs ou lève une exception. La couche CLI se charge du rendu.

## Exercice rapide

Écrivez \`valider_email\` qui vérifie : présence d'un \`@\`, un seul \`@\`, une partie locale non vide et un domaine contenant un point. Retournez la liste des erreurs et testez trois cas invalides.`,
  },
  {
    slug: "atelier-fizzbuzz",
    moduleSlug: "conditions-boucles",
    position: 5,
    title: "Atelier : FizzBuzz et motifs",
    summary:
      "Consolider conditions et boucles avec deux exercices classiques, puis les tester.",
    estimatedMinutes: 60,
    codeLanguage: "python",
    keyPoints: [
      "Tester d'abord les cas limites",
      "Une fonction par responsabilité",
      "Comparer plusieurs implémentations",
    ],
    contentMd: `## FizzBuzz, sans piège

Règle : pour les nombres de 1 à n, afficher \`Fizz\` si le nombre est divisible par 3, \`Buzz\` si divisible par 5, \`FizzBuzz\` si divisible par les deux, sinon le nombre.

L'erreur classique est de tester \`divisible par 3\` avant \`divisible par 3 et 5\`.

\`\`\`python
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
\`\`\`

\`% 15 == 0\` est équivalent à \`% 3 == 0 and % 5 == 0\`, en une seule opération.

## 1. Version testable

\`\`\`python
assert fizzbuzz(3) == ["1", "2", "Fizz"]
assert fizzbuzz(5)[-1] == "Buzz"
assert fizzbuzz(15)[-1] == "FizzBuzz"
assert fizzbuzz(0) == []
\`\`\`

## 2. Motif en escalier

\`\`\`python
def escalier(hauteur: int) -> None:
    for ligne in range(1, hauteur + 1):
        print(" " * (hauteur - ligne) + "*" * (2 * ligne - 1))

escalier(4)
\`\`\`

\`\`\`text
   *
  ***
 *****
*******
\`\`\`

## 3. Table de multiplication formatée

\`\`\`python
def table(n: int) -> None:
    for ligne in range(1, n + 1):
        colonnes = [f"{ligne * colonne:3d}" for colonne in range(1, n + 1)]
        print(" ".join(colonnes))

table(5)
\`\`\`

## 4. Critique d'implémentation

Comparez :

\`\`\`python
# A
if n % 3 == 0 and n % 5 == 0: ...

# B
if n % 15 == 0: ...
\`\`\`

B est plus courte et plus rapide. Mais A est parfois plus lisible pour un lecteur qui ne connaît pas la propriété mathématique. Choisissez en fonction du contexte et documentez si nécessaire.

> **À retenir** — Un exercice réussi n'est pas seulement un programme qui « marche » : c'est un programme dont vous savez prouver le comportement sur les cas limites (0, 1, négatifs, très grands nombres).

## Livrable

Publiez \`fizzbuzz.py\` avec la fonction, quatre assertions et une description dans le README. Ajoutez une capture du résultat.`,
  },
];

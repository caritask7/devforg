import type { Lesson } from "@/lib/types";

export const module06Lessons: Lesson[] = [
  {
    slug: "complexite",
    moduleSlug: "algorithmique",
    position: 1,
    title: "Complexité algorithmique et notation Big O",
    summary:
      "Estimer le coût d'un algorithme et reconnaître les complexités qui posent problème à grande échelle.",
    estimatedMinutes: 65,
    codeLanguage: "python",
    keyPoints: [
      "On mesure la croissance, pas les secondes",
      "O(1) < O(log n) < O(n) < O(n log n) < O(n²)",
      "La boucle imbriquée est souvent le signal d'alerte",
    ],
    contentMd: `## Mesurer la croissance

La notation Big O décrit la façon dont le temps d'exécution croît quand la taille d'entrée \`n\` augmente. Un facteur constant est ignoré : \`O(3n)\` s'écrit \`O(n)\`.

| Complexité | n = 10 | n = 1 000 | n = 100 000 |
| --- | --- | --- | --- |
| O(1) | 1 | 1 | 1 |
| O(log n) | 3 | 10 | 17 |
| O(n) | 10 | 1 000 | 100 000 |
| O(n log n) | 33 | 10 000 | 1 700 000 |
| O(n²) | 100 | 1 000 000 | 10 milliards |

## 1. Lire une fonction

\`\`\`python
def somme(liste: list[int]) -> int:
    total = 0                 # O(1)
    for valeur in liste:      # n itérations
        total += valeur       # O(1) par itération
    return total              # O(1)
\`\`\`

Complexité temporelle : **O(n)**. Complexité spatiale : **O(1)** — une seule variable \`total\`.

\`\`\`python
def contient_doublon(liste: list[int]) -> bool:
    for i in range(len(liste)):
        for j in range(i + 1, len(liste)):
            if liste[i] == liste[j]:
                return True
    return False
\`\`\`

Une double boucle sur la même liste donne **O(n²)**.

## 2. Améliorer avec la bonne structure

\`\`\`python
def contient_doublon(liste: list[int]) -> bool:
    vus = set()
    for valeur in liste:
        if valeur in vus:
            return True
        vus.add(valeur)
    return False
\`\`\`

**O(n)** en temps, **O(n)** en espace. C'est le compromis classique : on paie de la mémoire pour gagner du temps.

## 3. Complexité spatiale

\`\`\`python
def doubler(liste: list[int]) -> list[int]:
    return [x * 2 for x in liste]  # O(n) d'espace
\`\`\`

Un générateur réduit l'empreinte :

\`\`\`python
def doubler_paresseux(liste: list[int]):
    for x in liste:
        yield x * 2
\`\`\`

## 4. Cas favorable, défavorable, moyen

\`\`\`python
def chercher(liste: list[int], cible: int) -> int:
    for index, valeur in enumerate(liste):
        if valeur == cible:
            return index
    return -1
\`\`\`

- meilleur cas : la cible est en première position → O(1) ;
- pire cas : absente → O(n) ;
- on annonce généralement le **pire cas**.

> **À retenir** — Big O décrit une tendance, pas une performance absolue. Pour \`n = 20\`, une boucle O(n²) peut être plus rapide qu'une structure complexe à cause des constantes.

## Exercice rapide

Analysez ces deux fonctions et donnez leur complexité temporelle et spatiale. Laquelle choisiriez-vous pour une liste de 10 000 éléments ? Pourquoi ?

\`\`\`python
def a(liste):
    return len(set(liste)) == len(liste)

def b(liste):
    for i, x in enumerate(liste):
        if x in liste[i + 1:]:
            return False
    return True
\`\`\``,
  },
  {
    slug: "recherche",
    moduleSlug: "algorithmique",
    position: 2,
    title: "Recherche linéaire et dichotomique",
    summary:
      "Retrouver une valeur dans une collection, puis exploiter un tri pour diviser le travail par deux.",
    estimatedMinutes: 55,
    codeLanguage: "python",
    keyPoints: [
      "La recherche linéaire est O(n)",
      "La dichotomie exige une collection triée",
      "La dichotomie est O(log n)",
    ],
    contentMd: `## Recherche linéaire

\`\`\`python
def recherche_lineaire(liste: list[int], cible: int) -> int:
    for index, valeur in enumerate(liste):
        if valeur == cible:
            return index
    return -1
\`\`\`

Simple, correcte sur une collection non triée. Coût : O(n).

## 1. Recherche dichotomique

Principe : comparer la cible au milieu, puis éliminer la moitié inutile.

\`\`\`python
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
\`\`\`

\`\`\`python
nombres = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print(recherche_dichotomique(nombres, 23))  # 5
print(recherche_dichotomique(nombres, 7))   # -1
\`\`\`

À chaque itération, l'espace de recherche est divisé par deux : **O(log n)**.

## 2. La condition indispensable

La dichotomie n'est valide que sur une collection **triée**. Sur une liste quelconque, elle renvoie un résultat faux sans erreur. C'est un piège fréquent.

\`\`\`python
def rechercher(liste: list[int], cible: int) -> int:
    if liste != sorted(liste):
        raise ValueError("La liste doit être triée")
    return recherche_dichotomique(liste, cible)
\`\`\`

La vérification coûte O(n log n) si on trie, ce qui annule le bénéfice pour une seule recherche. Elle est pertinente si la liste est réutilisée.

## 3. Recherche par borne

Pour trouver la première occurrence dans une liste triée avec doublons :

\`\`\`python
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
\`\`\`

Cette variante est plus difficile à écrire mais évite les erreurs de bornes.

## 4. Le module bisect

\`\`\`python
import bisect

liste = [1, 3, 3, 5, 8]
print(bisect.bisect_left(liste, 3))   # 1
print(bisect.bisect_right(liste, 3))  # 3
\`\`\`

> **À retenir** — Choisissez la recherche linéaire pour une petite collection ou une seule requête. Utilisez la dichotomie quand la collection est triée et interrogée de nombreuses fois.

## Exercice rapide

Implémentez \`recherche_dichotomique\` sans utiliser de bibliothèque et vérifiez-la sur : liste vide, un élément présent, un élément absent, cible plus petite que tout, cible plus grande que tout.`,
  },
  {
    slug: "algorithmes-tri",
    moduleSlug: "algorithmique",
    position: 3,
    title: "Algorithmes de tri",
    summary:
      "Comprendre le tri par insertion et le tri fusion, et savoir pourquoi Timsort domine en pratique.",
    estimatedMinutes: 60,
    codeLanguage: "python",
    keyPoints: [
      "Le tri par insertion est simple mais O(n²)",
      "Le tri fusion est O(n log n)",
      "Python utilise Timsort, stable et adaptatif",
    ],
    contentMd: `## Tri par insertion

Comme on trie des cartes dans la main : on insère chaque élément à sa place dans la partie déjà triée.

\`\`\`python
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
\`\`\`

Très efficace sur de petites listes ou des listes presque triées, O(n²) au pire.

## 1. Tri fusion

Diviser, trier chaque moitié, fusionner.

\`\`\`python
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
\`\`\`

Complexité : **O(n log n)** dans tous les cas. Espace : O(n).

## 2. Le tri natif de Python

\`\`\`python
nombres = [5, 2, 9, 1]
print(sorted(nombres))  # [1, 2, 5, 9]

modules = [{"titre": "SQL", "minutes": 480}, {"titre": "Git", "minutes": 420}]
modules.sort(key=lambda m: m["minutes"], reverse=True)
\`\`\`

Timsort exploite les séquences déjà ordonnées et garantit O(n log n) au pire. Il est **stable**.

## 3. Stabilité

Un tri est stable si deux éléments égaux conservent leur ordre relatif.

\`\`\`python
personnes = [("Ada", 30), ("Grace", 30), ("Linus", 25)]
par_age = sorted(personnes, key=lambda p: p[1])
# [('Linus', 25), ('Ada', 30), ('Grace', 30)]
\`\`\`

Ada reste avant Grace. Cela permet des tris multi-critères par passes successives.

## 4. Choisir

| Contexte | Choix |
| --- | --- |
| Usage général | \`sorted\` / \`list.sort\` |
| Petite liste presque triée | insertion |
| Besoin pédagogique de diviser | fusion |
| Mémoire très contrainte | tri en place |

> **À retenir** — En production, utilisez le tri natif. Comprendre les algorithmes sert à raisonner sur les coûts et à reconnaître les situations où un tri est inutile.

## Exercice rapide

Écrivez \`tri_par_score(etudiants)\` qui trie par score décroissant, puis par nom croissant à score égal, sans muter la liste d'origine. Vérifiez la stabilité.`,
  },
  {
    slug: "recursion",
    moduleSlug: "algorithmique",
    position: 4,
    title: "Récursivité et diviser pour régner",
    summary:
      "Décomposer un problème en sous-problèmes identiques et maîtriser la condition d'arrêt.",
    estimatedMinutes: 55,
    codeLanguage: "python",
    keyPoints: [
      "Toute récursion a besoin d'un cas de base",
      "Chaque appel consomme de la pile",
      "La mémoïsation évite les calculs redondants",
    ],
    contentMd: `## Une fonction qui s'appelle elle-même

\`\`\`python
def factorielle(n: int) -> int:
    if n <= 1:
        return 1
    return n * factorielle(n - 1)
\`\`\`

Deux éléments obligatoires :

1. **cas de base** : \`n <= 1\` ;
2. **progression** : \`n - 1\` se rapproche du cas de base.

Sans réduction, la récursion est infinie et provoque \`RecursionError\`.

## 1. Vérifier une structure imbriquée

\`\`\`python
def profondeur(structure: object) -> int:
    if isinstance(structure, list):
        if not structure:
            return 1
        return 1 + max(profondeur(element) for element in structure)
    return 0

print(profondeur([1, [2, [3, [4]]]]))  # 4
\`\`\`

La récursivité est naturelle pour des arbres et des structures imbriquées.

## 2. Diviser pour régner

\`\`\`python
def puissance_rapide(base: int, exposant: int) -> int:
    if exposant == 0:
        return 1
    if exposant % 2 == 0:
        moitie = puissance_rapide(base, exposant // 2)
        return moitie * moitie
    return base * puissance_rapide(base, exposant - 1)
\`\`\`

Complexité : O(log n) au lieu de O(n).

## 3. Mémoïsation

\`\`\`python
from functools import lru_cache

@lru_cache(maxsize=None)
def fibonacci(n: int) -> int:
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
\`\`\`

Sans cache, \`fibonacci(35)\` effectue des millions d'appels redondants.

## 4. Limites

\`\`\`python
import sys
print(sys.getrecursionlimit())  # 1000 par défaut
\`\`\`

La pile est limitée. Pour traiter 100 000 éléments, préférez une boucle ou un algorithme itératif. On peut aussi transformer une récursion terminale en boucle.

> **À retenir** — La récursivité est un outil de clarté, pas de performance brute. Si la structure du problème est récursive (arbre, graphe, expression), elle est souvent le meilleur choix.

## Exercice rapide

Écrivez \`somme_liste(liste)\` de façon récursive, puis une version itérative. Ajoutez \`flatten(structure)\` qui renvoie une liste plate de tous les éléments imbriqués.`,
  },
  {
    slug: "graphes-introduction",
    moduleSlug: "algorithmique",
    position: 5,
    title: "Graphes : parcours en largeur et en profondeur",
    summary:
      "Représenter un réseau de dépendances et le parcourir avec BFS et DFS.",
    estimatedMinutes: 65,
    codeLanguage: "python",
    keyPoints: [
      "BFS explore par niveaux, avec une file",
      "DFS explore une branche, avec une pile",
      "Toujours marquer les nœuds visités",
    ],
    contentMd: `## Représenter un graphe

\`\`\`python
graphe = {
    "python": ["algorithmique", "git"],
    "algorithmique": ["structures"],
    "git": ["github"],
    "structures": [],
    "github": [],
}
\`\`\`

Chaque clé est un nœud ; la valeur liste ses voisins. C'est une **liste d'adjacence**.

## 1. Parcours en largeur (BFS)

\`\`\`python
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
\`\`\`

BFS trouve le **plus court chemin en nombre d'arêtes** dans un graphe non pondéré.

## 2. Parcours en profondeur (DFS)

\`\`\`python
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
\`\`\`

DFS sert à détecter des cycles, trier topologiquement ou explorer toutes les branches.

## 3. Détecter un cycle

\`\`\`python
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
\`\`\`

\`en_cours\` contient le chemin actuel ; \`termines\` mémorise les nœuds déjà validés.

## 4. Complexité

Pour un graphe \`V\` sommets et \`E\` arêtes : **O(V + E)** en temps, O(V) en espace.

> **À retenir** — Le marquage des nœuds visités n'est pas une optimisation : sans lui, un cycle provoque une boucle infinie.

## Exercice rapide

Modélisez les prérequis entre modules DEVFORGE sous forme de graphe. Écrivez \`ordre_valide(graphe)\` qui renvoie un ordre de validation compatible avec les prérequis (tri topologique).`,
  },
];

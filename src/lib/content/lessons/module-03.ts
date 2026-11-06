import type { Lesson } from "@/lib/types";

export const module03Lessons: Lesson[] = [
  {
    slug: "fonctions-definir",
    moduleSlug: "fonctions",
    position: 1,
    title: "Définir et appeler une fonction",
    summary:
      "Écrire des fonctions courtes, nommées clairement, avec une responsabilité unique.",
    estimatedMinutes: 55,
    codeLanguage: "python",
    keyPoints: [
      "def nom(paramètres) -> type de retour",
      "Une fonction fait une seule chose",
      "return termine immédiatement l'exécution",
    ],
    contentMd: `## Pourquoi extraire une fonction

Une fonction nomme une intention. Elle remplace un bloc de code par une phrase compréhensible et permet de tester ce bloc indépendamment.

\`\`\`python
def moyenne(notes: list[float]) -> float:
    if not notes:
        raise ValueError("La liste de notes ne peut pas être vide")
    return sum(notes) / len(notes)

print(moyenne([12, 15, 9]))  # 12.0
\`\`\`

## 1. Anatomie

\`\`\`python
def appliquer_remise(prix: float, pourcentage: float) -> float:
    """Renvoie le prix après application d'une remise en pourcentage."""
    if not 0 <= pourcentage <= 100:
        raise ValueError("Le pourcentage doit être entre 0 et 100")
    return round(prix * (1 - pourcentage / 100), 2)
\`\`\`

- \`def\` ouvre la définition ;
- \`appliquer_remise\` est le nom, en \`snake_case\` ;
- les paramètres sont typés ;
- la valeur de retour est annotée ;
- la docstring décrit le contrat.

## 2. Valeur de retour

Sans \`return\`, une fonction renvoie \`None\`.

\`\`\`python
def afficher_total(total: float) -> None:
    print(f"Total : {total:.2f} €")
\`\`\`

\`return\` interrompt la fonction :

\`\`\`python
def statut(score: int) -> str:
    if score >= 90:
        return "excellent"
    if score >= 60:
        return "validé"
    return "à revoir"
\`\`\`

Les conditions de sortie anticipée évitent les \`else\` imbriqués.

## 3. Responsabilité unique

\`\`\`python
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
\`\`\`

> **Règle pratique** — Si vous devez utiliser « et » pour décrire ce que fait une fonction, découpez-la.

## 4. Nommer

| Mauvais | Bon |
| --- | --- |
| \`calc\` | \`calculer_moyenne\` |
| \`process\` | \`normaliser_email\` |
| \`check\` | \`est_email_valide\` |

Les fonctions booléennes commencent souvent par \`est_\`, \`a_\`, \`peut_\`.

## Exercice rapide

Écrivez \`convertir_euros_en_dollars(montant, taux)\` avec validation du taux (> 0) et arrondi à deux décimales. Ajoutez une docstring et deux assertions.`,
  },
  {
    slug: "fonctions-parametres",
    moduleSlug: "fonctions",
    position: 2,
    title: "Paramètres, arguments et valeurs par défaut",
    summary:
      "Maîtriser les paramètres positionnels, nommés, par défaut et variadiques.",
    estimatedMinutes: 55,
    codeLanguage: "python",
    keyPoints: [
      "Les arguments nommés rendent les appels lisibles",
      "Les valeurs par défaut ne doivent pas être mutables",
      "args et kwargs pour les interfaces flexibles",
    ],
    contentMd: `## Trois façons de passer un argument

\`\`\`python
def creer_utilisateur(nom: str, role: str = "membre", actif: bool = True) -> dict:
    return {"nom": nom, "role": role, "actif": actif}

# positionnel
creer_utilisateur("Ada", "admin", False)

# nommé : beaucoup plus lisible
creer_utilisateur("Ada", role="admin", actif=False)
\`\`\`

Privilégiez les arguments nommés dès que l'appel comporte plus de deux valeurs.

## 1. Le piège de la valeur par défaut mutable

\`\`\`python
# Bug classique
def ajouter(element, liste=[]):
    liste.append(element)
    return liste

print(ajouter(1))  # [1]
print(ajouter(2))  # [1, 2] — la même liste !
\`\`\`

La valeur par défaut est créée **une seule fois**, à la définition. La correction :

\`\`\`python
def ajouter(element, liste=None):
    if liste is None:
        liste = []
    liste.append(element)
    return liste
\`\`\`

## 2. Paramètres positionnels uniquement

\`\`\`python
def diviser(a: float, b: float, /) -> float:
    return a / b

diviser(10, 2)      # OK
# diviser(a=10, b=2)  # TypeError
\`\`\`

Le \`/\` force le passage positionnel. Utile pour les API bas niveau.

## 3. Paramètres nommés uniquement

\`\`\`python
def envoyer_email(destinataire: str, *, sujet: str, corps: str) -> None:
    ...

envoyer_email("ada@example.com", sujet="Bienvenue", corps="Bonjour")
\`\`\`

Le \`*\` interdit les arguments positionnels après lui. Cela protège contre les inversions accidentelles.

## 4. Variadiques

\`\`\`python
def somme(*nombres: float) -> float:
    return sum(nombres)

print(somme(1, 2, 3))  # 6.0

def journaliser(message: str, **contexte: object) -> None:
    details = " ".join(f"{cle}={valeur}" for cle, valeur in contexte.items())
    print(f"{message} {details}")

journaliser("Connexion", utilisateur="ada", ip="127.0.0.1")
\`\`\`

## 5. Découpage d'une liste

\`\`\`python
def moyenne(*notes: float) -> float:
    if not notes:
        raise ValueError("Aucune note")
    return sum(notes) / len(notes)

valeurs = [12, 15, 9]
print(moyenne(*valeurs))  # 12.0
\`\`\`

> **À retenir** — Un paramètre par défaut décrit une politique stable, pas un état partagé. Pour les objets mutables, utilisez \`None\` et construisez la valeur dans le corps.

## Exercice rapide

Écrivez \`formater_prix(montant, *, devise="EUR", decimales=2)\` qui renvoie \`"1 234,50 €"\` pour \`1234.5\`. Forcez le passage nommé après le montant.`,
  },
  {
    slug: "fonctions-portee",
    moduleSlug: "fonctions",
    position: 3,
    title: "Portée des variables et fermetures",
    summary:
      "Comprendre les espaces de noms, global, nonlocal et les fonctions qui capturent leur contexte.",
    estimatedMinutes: 50,
    codeLanguage: "python",
    keyPoints: [
      "Chaque fonction crée un espace de noms local",
      "Éviter global : préférer des paramètres",
      "Une closure capture une variable, pas sa valeur",
    ],
    contentMd: `## Espaces de noms

Python cherche un nom dans l'ordre **LEGB** : Local, Enclosing, Global, Built-in.

\`\`\`python
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
\`\`\`

Chaque fonction possède son propre espace local.

## 1. Lire une variable globale, mais ne pas la modifier

\`\`\`python
TAUX_TVA = 0.20

def prix_ttc(prix_ht: float) -> float:
    return prix_ht * (1 + TAUX_TVA)
\`\`\`

Lire une constante globale est acceptable. La modifier depuis une fonction est une mauvaise pratique.

\`\`\`python
compteur = 0

def incrementer() -> None:
    global compteur
    compteur += 1  # fonctionne, mais crée un couplage caché
\`\`\`

Préférez :

\`\`\`python
def incrementer(valeur: int) -> int:
    return valeur + 1
\`\`\`

## 2. nonlocal et fermetures

\`\`\`python
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
\`\`\`

\`suivant\` conserve sa variable \`valeur\` après la fin de \`creer_compteur\`. C'est une **fermeture** (closure).

## 3. Le piège de la capture tardive

\`\`\`python
fonctions = []
for i in range(3):
    fonctions.append(lambda: i)

print([f() for f in fonctions])  # [2, 2, 2]
\`\`\`

Toutes les lambdas regardent le même \`i\`, qui vaut 2 à la fin. Correction :

\`\`\`python
fonctions = [lambda i=i: i for i in range(3)]
print([f() for f in fonctions])  # [0, 1, 2]
\`\`\`

## 4. Décorateurs, aperçu

Une fonction peut recevoir et renvoyer une fonction.

\`\`\`python
def trace(fonction):
    def enveloppe(*args, **kwargs):
        print(f"→ {fonction.__name__}")
        return fonction(*args, **kwargs)
    return enveloppe

@trace
def doubler(x: int) -> int:
    return x * 2

doubler(21)
\`\`\`

> **À retenir** — Une variable globale modifiable est un état partagé. Si vous avez besoin de mémoire entre appels, encapsulez-la dans un objet ou une closure explicite.

## Exercice rapide

Écrivez \`creer_compteur_depuis(depart)\` qui renvoie une fonction \`ajouter(n)\` retournant le total cumulé. Vérifiez que deux compteurs créés séparément ne partagent pas leur état.`,
  },
  {
    slug: "fonctions-documentation-tests",
    moduleSlug: "fonctions",
    position: 4,
    title: "Documenter et tester ses fonctions",
    summary:
      "Écrire des docstrings utiles et des tests unitaires qui protègent le comportement dans le temps.",
    estimatedMinutes: 55,
    codeLanguage: "python",
    keyPoints: [
      "Une docstring décrit contrat, paramètres et exceptions",
      "Un test vérifie un comportement observable",
      "Tester les cas limites, pas seulement le cas nominal",
    ],
    contentMd: `## La docstring comme contrat

\`\`\`python
def retirer_stock(stock: dict[str, int], article: str, quantite: int) -> int:
    """Retire une quantité du stock d'un article.

    Args:
        stock: Inventaire {article: quantité disponible}.
        article: Identifiant de l'article.
        quantite: Nombre d'unités à retirer (> 0).

    Returns:
        La nouvelle quantité disponible.

    Raises:
        ValueError: Si la quantité est invalide.
        KeyError: Si l'article n'existe pas.
        RuntimeError: Si le stock est insuffisant.
    """
    if quantite <= 0:
        raise ValueError("La quantité doit être positive")
    disponible = stock[article]
    if disponible < quantite:
        raise RuntimeError(f"Stock insuffisant ({disponible} restants)")
    stock[article] = disponible - quantite
    return stock[article]
\`\`\`

Une bonne docstring permet d'utiliser la fonction sans lire son corps.

## 1. Tests avec assert

\`\`\`python
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
\`\`\`

## 2. Structurer avec pytest

\`\`\`python
import pytest

def test_quantite_negative():
    with pytest.raises(ValueError, match="positive"):
        retirer_stock({"clavier": 10}, "clavier", -1)

def test_article_inconnu():
    with pytest.raises(KeyError):
        retirer_stock({}, "écran", 1)
\`\`\`

\`\`\`bash
pip install pytest
pytest -q
\`\`\`

## 3. Choisir les cas

Pour chaque fonction, couvrez :

- le cas nominal ;
- les bornes (0, 1, maximum) ;
- les entrées invalides ;
- les effets de bord (le dictionnaire est-il modifié ?).

> **Règle** — Un test ne doit pas dépendre de l'ordre des autres tests. Créez un état neuf à chaque test plutôt que de partager un objet global.

## 4. Nommer ses tests

\`\`\`python
def test_retirer_stock_refuse_quantite_negative(): ...
def test_retirer_stock_leve_erreur_si_stock_insuffisant(): ...
\`\`\`

Le nom du test doit décrire la règle vérifiée. En cas d'échec, le rapport est auto-explicatif.

## Exercice rapide

Ajoutez trois tests à \`convertir_minutes\` : 0 minute, 59 minutes, 60 minutes, 725 minutes. Vérifiez le format exact des chaînes.`,
  },
  {
    slug: "fonctions-modules",
    moduleSlug: "fonctions",
    position: 5,
    title: "Modules, packages et organisation du code",
    summary:
      "Découper un programme en fichiers importables et éviter les dépendances circulaires.",
    estimatedMinutes: 50,
    codeLanguage: "python",
    keyPoints: [
      "Un module est un fichier .py",
      "Un package est un dossier avec __init__.py",
      "Le point d'entrée reste mince",
    ],
    contentMd: `## Un fichier = un module

\`\`\`text
calculs/
├── __init__.py
├── moyenne.py
└── validation.py
\`\`\`

\`\`\`python
# calculs/moyenne.py
def moyenne(notes: list[float]) -> float:
    if not notes:
        raise ValueError("Aucune note")
    return sum(notes) / len(notes)
\`\`\`

\`\`\`python
# main.py
from calculs.moyenne import moyenne

print(moyenne([12, 15, 9]))
\`\`\`

## 1. Imports propres

\`\`\`python
# Évitez
from calculs.moyenne import *

# Préférez
from calculs.moyenne import moyenne
\`\`\`

Un import explicite rend les dépendances visibles et évite les collisions de noms.

\`\`\`python
# Alias utile quand le nom est long ou ambigu
import calculs.moyenne as stats
\`\`\`

## 2. Éviter les imports circulaires

\`\`\`text
a.py importe b.py
b.py importe a.py   ← import circulaire
\`\`\`

Symptômes : \`ImportError\`, attributs manquants au démarrage. Solutions :

1. déplacer la logique partagée dans un troisième module ;
2. importer localement dans la fonction si le cycle est inévitable ;
3. revoir la séparation des responsabilités — un cycle révèle souvent un couplage excessif.

## 3. Point d'entrée mince

\`\`\`python
# app/main.py
from app.cli import executer

if __name__ == "__main__":
    executer()
\`\`\`

Toute la logique testable vit dans des modules importables. Le point d'entrée ne fait que lancer.

## 4. Exposer une API de package

\`\`\`python
# calculs/__init__.py
from .moyenne import moyenne

__all__ = ["moyenne"]
\`\`\`

\`\`\`python
from calculs import moyenne
\`\`\`

> **À retenir** — Un package n'est pas décoratif : il matérialise une frontière. Si deux modules s'importent mutuellement, la frontière est mal placée.

## Exercice rapide

Transformez votre calculateur de la phase 1 en package : \`calculs/operations.py\`, \`calculs/validation.py\`, \`main.py\`. Ajoutez un test qui importe uniquement \`operations\` et vérifie qu'aucune saisie utilisateur n'est déclenchée.`,
  },
];

import type { Lesson } from "@/lib/types";

export const module05Lessons: Lesson[] = [
  {
    slug: "poo-classes",
    moduleSlug: "poo",
    position: 1,
    title: "Classes et objets : modéliser un domaine",
    summary:
      "Créer des classes qui regroupent état et comportement autour d'une responsabilité claire.",
    estimatedMinutes: 60,
    codeLanguage: "python",
    keyPoints: [
      "__init__ initialise l'instance",
      "self est l'instance courante",
      "Une classe doit représenter un concept, pas un sac de données",
    ],
    contentMd: `## Une classe décrit un concept

\`\`\`python
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
\`\`\`

\`\`\`python
lecon = Lecon("Variables et types", 60)
lecon.marquer_terminee()
print(lecon.duree_lisible())  # 1 h 00
print(lecon.terminee)         # True
\`\`\`

## 1. État et comportement

Une classe utile regroupe des données **et** les opérations qui maintiennent leur cohérence.

\`\`\`python
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
\`\`\`

L'extérieur ne peut pas écrire \`compte.solde = 1_000_000\` : la cohérence est protégée.

## 2. Classes vs dictionnaires

\`\`\`python
# Dictionnaire : aucune garantie
utilisateur = {"nom": "Ada", "email": "ada@example.com"}

# Classe : contrat explicite
class Utilisateur:
    def __init__(self, nom: str, email: str) -> None:
        self.nom = nom
        self.email = email
\`\`\`

Pour de la donnée brute, un dictionnaire suffit. Pour un objet avec des invariants et des comportements, une classe est plus sûre.

## 3. Attributs de classe

\`\`\`python
class Lecon:
    plateforme = "DEVFORGE"  # partagé par toutes les instances

    def __init__(self, titre: str) -> None:
        self.titre = titre
\`\`\`

Un attribut de classe est partagé. Ne l'utilisez pas pour stocker un état propre à une instance.

> **Erreur classique** — Définir une liste comme attribut de classe et la modifier via une instance : toutes les instances partagent la même liste.

## Exercice rapide

Créez \`Mission\` avec \`titre\`, \`difficulte\` et \`statut\`. Ajoutez \`demarrer()\` qui passe le statut à \`"en_cours"\` et refuse si la mission est déjà terminée. Testez les transitions.`,
  },
  {
    slug: "poo-encapsulation",
    moduleSlug: "poo",
    position: 2,
    title: "Encapsulation, propriétés et invariants",
    summary:
      "Protéger les invariants d'un objet et exposer une interface stable grâce aux propriétés.",
    estimatedMinutes: 55,
    codeLanguage: "python",
    keyPoints: [
      "Un underscore signale un usage interne",
      "@property expose un attribut calculé",
      "Les setters valident avant de modifier",
    ],
    contentMd: `## L'encapsulation en Python

Python ne possède pas de \`private\` strict. Une convention suffit :

- \`_attribut\` : interne, ne pas utiliser depuis l'extérieur ;
- \`__attribut\` : nom mangling, à réserver aux cas très particuliers.

\`\`\`python
class Projet:
    def __init__(self, titre: str) -> None:
        self.titre = titre
        self._jalons: list[str] = []
\`\`\`

## 1. Propriétés en lecture

\`\`\`python
class Projet:
    def __init__(self, titre: str, jalons: list[str]) -> None:
        self.titre = titre
        self._jalons = list(jalons)

    @property
    def progression(self) -> int:
        if not self._jalons:
            return 0
        return 100
\`\`\`

Une propriété se lit comme un attribut, mais exécute du code :

\`\`\`python
print(projet.progression)  # 100
# projet.progression = 50  # AttributeError
\`\`\`

## 2. Setter avec validation

\`\`\`python
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
\`\`\`

\`\`\`python
lecon = Lecon("Boucles", 45)
lecon.minutes = 60    # OK
# lecon.minutes = -5  # ValueError
\`\`\`

## 3. Invariants

Un invariant est une propriété qui doit toujours rester vraie.

\`\`\`python
class PlageHoraire:
    def __init__(self, debut: int, fin: int) -> None:
        if debut >= fin:
            raise ValueError("Le début doit précéder la fin")
        self.debut = debut
        self.fin = fin

    @property
    def duree(self) -> int:
        return self.fin - self.debut
\`\`\`

En validant à la construction et dans les setters, l'objet ne peut jamais exister dans un état incohérent.

## 4. Ne pas exposer sa liste interne

\`\`\`python
class Equipe:
    def __init__(self) -> None:
        self._membres: list[str] = []

    def ajouter(self, nom: str) -> None:
        if nom not in self._membres:
            self._membres.append(nom)

    @property
    def membres(self) -> tuple[str, ...]:
        return tuple(self._membres)
\`\`\`

La copie empêche l'appelant de contourner \`ajouter\`.

> **À retenir** — En Python, l'encapsulation est une discipline, pas une barrière. Le contrat doit être évident dans le code et documenté.

## Exercice rapide

Créez \`MotDePasse\` qui accepte une chaîne à la construction, n'expose jamais la valeur en clair, et fournit \`verifier(candidat)\` et \`est_fort()\`. Ajoutez un invariant : au moins 8 caractères.`,
  },
  {
    slug: "poo-heritage",
    moduleSlug: "poo",
    position: 3,
    title: "Héritage, composition et polymorphisme",
    summary:
      "Choisir entre hériter et composer, et utiliser le polymorphisme sans hiérarchies fragiles.",
    estimatedMinutes: 60,
    codeLanguage: "python",
    keyPoints: [
      "hériter exprime un « est un »",
      "composer exprime un « a un »",
      "Préférer la composition dans la majorité des cas",
    ],
    contentMd: `## Héritage : une relation forte

\`\`\`python
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
\`\`\`

\`Lecon\` **est un** \`Contenu\`. Le \`super().__init__\` garantit l'initialisation de la classe parente.

## 1. Polymorphisme

\`\`\`python
contenus: list[Contenu] = [
    Contenu("Bibliothèque"),
    Lecon("Fonctions", 45),
]

for contenu in contenus:
    print(contenu.resumer())
\`\`\`

Le code appelant n'a pas besoin de connaître le type exact. C'est le polymorphisme.

## 2. Classes abstraites

\`\`\`python
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
\`\`\`

\`Evaluation()\` lève une \`TypeError\`. Toute sous-classe doit fournir \`score\`.

## 3. Composition

\`\`\`python
class MoteurRecherche:
    def __init__(self) -> None:
        self._index: dict[str, list[str]] = {}

    def indexer(self, mot: str, lecon: str) -> None:
        self._index.setdefault(mot, []).append(lecon)

class Application:
    def __init__(self, moteur: MoteurRecherche) -> None:
        self._moteur = moteur
\`\`\`

\`Application\` **a un** moteur. On peut remplacer l'implémentation dans un test.

## 4. Quand éviter l'héritage

N'héritez pas pour réutiliser trois lignes. N'héritez pas si la relation « est un » n'est pas évidente. Une hiérarchie profonde rend les changements risqués.

\`\`\`python
# Fragile
class LeconAvecPDF(Lecon, Exportable, Notifiable, Cacheable): ...

# Plus clair
class Lecon:
    def __init__(self, exporteur: Exporteur, notificateur: Notificateur): ...
\`\`\`

> **Règle** — Commencez par la composition. Introduisez l'héritage seulement lorsqu'un contrat commun le justifie.

## Exercice rapide

Modélisez \`Exercice\` et \`Evaluation\` comme deux sous-classes de \`Activite\`, avec une méthode commune \`duree_estimee()\`. Puis refactorisez \`Evaluation\` pour composer un \`Barème\` au lieu d'hériter de \`QCM\`.`,
  },
  {
    slug: "poo-methodes-speciales",
    moduleSlug: "poo",
    position: 4,
    title: "Méthodes spéciales et protocoles Python",
    summary:
      "Rendre ses objets naturels à utiliser : affichage, comparaison, itération et contexte.",
    estimatedMinutes: 60,
    codeLanguage: "python",
    keyPoints: [
      "__repr__ sert au débogage, __str__ à l'utilisateur",
      "__eq__ définit l'égalité métier",
      "__enter__ / __exit__ gèrent les ressources",
    ],
    contentMd: `## __repr__ et __str__

\`\`\`python
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
print(repr(lecon))# Lecon(slug='python-variables-types', titre='Variables et types')
\`\`\`

\`__repr__\` doit idéalement permettre de recréer l'objet.

## 1. Égalité et hachage

\`\`\`python
class Competence:
    def __init__(self, nom: str) -> None:
        self.nom = nom

    def __eq__(self, autre: object) -> bool:
        if not isinstance(autre, Competence):
            return NotImplemented
        return self.nom == autre.nom

    def __hash__(self) -> int:
        return hash(self.nom)
\`\`\`

Sans \`__hash__\`, l'objet devient non hachable quand \`__eq__\` est redéfini.

## 2. Itération

\`\`\`python
class Programme:
    def __init__(self, modules: list[str]) -> None:
        self._modules = modules

    def __iter__(self):
        return iter(self._modules)

for module in Programme(["Python", "SQL"]):
    print(module)
\`\`\`

## 3. Contexte

\`\`\`python
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
    session.handle.write("Nouvelle session\\n")
\`\`\`

\`__exit__\` est appelé même en cas d'exception. C'est la garantie du \`with\`.

## 4. Longueur et opérateurs

\`\`\`python
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
\`\`\`

> **À retenir** — Les méthodes spéciales ne s'appellent pas directement : elles sont déclenchées par la syntaxe Python. Respectez les protocoles plutôt que d'inventer des méthodes \`afficher()\` ou \`egale()\`.

## Exercice rapide

Implémentez \`Historique\` qui stocke des leçons, supporte \`len()\`, l'itération, et \`__repr__\`. Ajoutez \`__contains__\` pour tester si une leçon a déjà été vue.`,
  },
  {
    slug: "poo-dataclasses",
    moduleSlug: "poo",
    position: 5,
    title: "Dataclasses et typage",
    summary:
      "Écrire des objets de données concis, immuables si nécessaire, et correctement typés.",
    estimatedMinutes: 50,
    codeLanguage: "python",
    keyPoints: [
      "@dataclass génère __init__, __repr__ et __eq__",
      "field(default_factory=...) pour les valeurs mutables",
      "frozen=True pour un objet immuable",
    ],
    contentMd: `## Moins de code répétitif

\`\`\`python
from dataclasses import dataclass, field

@dataclass
class Lecon:
    slug: str
    titre: str
    minutes: int
    terminee: bool = False
    tags: list[str] = field(default_factory=list)
\`\`\`

\`Lecon("python", "Python", 60)\` fonctionne immédiatement. \`__init__\`, \`__repr__\` et \`__eq__\` sont générés.

\`\`\`python
a = Lecon("python", "Python", 60)
b = Lecon("python", "Python", 60)
print(a == b)  # True
\`\`\`

## 1. Valeurs par défaut sûres

\`\`\`python
@dataclass
class Projet:
    titre: str
    technologies: list[str] = field(default_factory=list)
\`\`\`

\`field(default_factory=list)\` crée une nouvelle liste pour chaque instance. C'est la seule façon correcte de mettre une valeur mutable par défaut.

## 2. Immuabilité

\`\`\`python
@dataclass(frozen=True)
class Point:
    x: float
    y: float
\`\`\`

Un \`frozen=True\` interdit la modification après création. Ces objets sont hachables et peuvent servir de clés de dictionnaire.

## 3. Validation dans __post_init__

\`\`\`python
@dataclass
class Note:
    matiere: str
    valeur: float

    def __post_init__(self) -> None:
        if not 0 <= self.valeur <= 20:
            raise ValueError("La note doit être entre 0 et 20")
\`\`\`

## 4. Tri et comparaison

\`\`\`python
@dataclass(order=True)
class Module:
    position: int
    titre: str

modules = sorted([
    Module(2, "SQL"),
    Module(1, "Python"),
])
\`\`\`

\`order=True\` génère les comparaisons basées sur l'ordre des champs.

## 5. Typage statique

\`\`\`python
from typing import Literal

Statut = Literal["todo", "en_cours", "termine"]

@dataclass
class Mission:
    titre: str
    statut: Statut = "todo"
\`\`\`

\`Literal\` restreint les valeurs possibles. Un vérificateur comme mypy signalera \`statut="fini"\`.

> **À retenir** — Une dataclass est adaptée aux objets porteurs de données. Si l'objet a un cycle de vie complexe et des invariants forts, une classe explicite reste parfois plus claire.

## Exercice rapide

Modélisez \`Progression\` avec \`lecon\`, \`statut\` (Literal), \`score\` optionnel et une date. Ajoutez une validation : \`score\` obligatoire si \`statut == "termine"\`. Testez la construction invalide.`,
  },
];

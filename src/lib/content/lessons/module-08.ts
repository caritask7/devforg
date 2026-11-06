import type { Lesson } from "@/lib/types";

export const module08Lessons: Lesson[] = [
  {
    slug: "projet-cahier-des-charges",
    moduleSlug: "projet-fondamentaux",
    position: 1,
    title: "Cadrer le projet : cahier des charges",
    summary:
      "Transformer une idée en périmètre livrable, avec des critères d'acceptation vérifiables.",
    estimatedMinutes: 45,
    codeLanguage: "markdown",
    keyPoints: [
      "Un périmètre limité est une force",
      "Chaque fonctionnalité a un critère d'acceptation",
      "Définir ce qui n'est pas dans le périmètre",
    ],
    contentMd: `## Le problème avant la solution

Le projet de synthèse : une **application en ligne de commande de suivi de tâches**, persistante, testée et versionnée.

Écrivez d'abord le problème : « Je veux suivre mes tâches d'apprentissage sans dépendre d'un outil externe, et retrouver mon état après redémarrage. »

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

> **Décision documentée** — Ce qui est hors périmètre aujourd'hui n'est pas un oubli : c'est une décision de priorisation.

## 2. Critères d'acceptation

\`\`\`markdown
### Ajouter une tâche
- [ ] Un titre vide est refusé avec un message clair.
- [ ] Un titre de 120 caractères est accepté.
- [ ] Un titre de 121 caractères est refusé.
- [ ] La tâche apparaît dans la liste après ajout.
- [ ] La tâche survit à un redémarrage.
\`\`\`

Un critère d'acceptation est **observable**. « Bonne expérience » n'est pas testable ; « message d'erreur si le titre est vide » l'est.

## 3. Modèle de données

\`\`\`python
from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class Tache:
    id: int
    titre: str
    terminee: bool = False
    creee_le: str = field(default_factory=lambda: datetime.now().isoformat(timespec="seconds"))
\`\`\`

## 4. Architecture cible

\`\`\`text
taches/
├── __init__.py
├── modele.py        # Tache
├── stockage.py      # lecture / écriture JSON
├── service.py       # règles métier
├── cli.py           # saisie / affichage
└── main.py          # point d'entrée
tests/
├── test_service.py
└── test_stockage.py
\`\`\`

Chaque couche a une seule raison de changer.

## Exercice rapide

Rédigez le cahier des charges de votre propre variante (ajout de priorités, échéances ou catégories). Limitez-vous à trois fonctionnalités supplémentaires et écrivez leurs critères d'acceptation.`,
  },
  {
    slug: "projet-architecture-cli",
    moduleSlug: "projet-fondamentaux",
    position: 2,
    title: "Construire l'architecture et la CLI",
    summary:
      "Implémenter la couche métier indépendamment de l'interface, puis brancher une CLI simple.",
    estimatedMinutes: 70,
    codeLanguage: "python",
    keyPoints: [
      "Le service ne dépend pas de input/print",
      "La CLI traduit les erreurs métier en messages",
      "Un routeur de commandes évite un if géant",
    ],
    contentMd: `## La couche métier d'abord

\`\`\`python
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
\`\`\`

Cette classe ne connaît ni \`input\` ni \`print\`. Elle est testable sans simuler le terminal.

## 1. Un routeur de commandes

\`\`\`python
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
            print(f"{stats['terminees']}/{stats['total']} terminées")
        case _:
            print(f"Commande inconnue : {commande}")
\`\`\`

Le \`match\` (Python 3.10+) rend le routage lisible. Pour un menu interactif, gardez une boucle \`while\` avec validation.

## 2. Gestion des erreurs à la frontière

\`\`\`python
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
\`\`\`

Les exceptions métier sont traduites en messages utilisateur au dernier moment.

## 3. Aide intégrée

\`\`\`python
AIDE = """
add <titre>   Ajouter une tâche
list          Lister les tâches
done <id>     Marquer comme terminée
rm <id>       Supprimer
stats         Afficher les statistiques
quit          Quitter
"""
\`\`\`

> **À retenir** — Une bonne CLI est une peau fine au-dessus d'un service testable. Si la logique fuit dans les \`case\`, c'est que le service manque d'une méthode.

## Exercice rapide

Implémentez la couche métier et écrivez cinq tests : ajout valide, ajout vide, titre trop long, terminaison, suppression d'un identifiant inexistant.`,
  },
  {
    slug: "projet-persistance-json",
    moduleSlug: "projet-fondamentaux",
    position: 3,
    title: "Persistance JSON et écriture atomique",
    summary:
      "Sauvegarder l'état sur disque sans corrompre les données en cas d'interruption.",
    estimatedMinutes: 60,
    codeLanguage: "python",
    keyPoints: [
      "Toujours encoder en UTF-8",
      "Écrire dans un fichier temporaire puis remplacer",
      "Gérer un fichier absent ou corrompu",
    ],
    contentMd: `## Sérialiser

\`\`\`python
import json
from dataclasses import asdict

def serialiser(taches: list[Tache]) -> str:
    return json.dumps([asdict(t) for t in taches], ensure_ascii=False, indent=2)
\`\`\`

\`ensure_ascii=False\` conserve les accents lisibles.

## 1. Lecture défensive

\`\`\`python
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
\`\`\`

Un fichier corrompu ne doit pas être silencieusement remplacé.

## 2. Écriture atomique

Si le programme s'arrête en plein \`write_text\`, le fichier peut être tronqué.

\`\`\`python
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
\`\`\`

\`os.replace\` est atomique sur le même volume : soit l'ancien fichier reste intact, soit le nouveau est complet.

## 3. Brancher le stockage

\`\`\`python
class StockageJSON:
    def __init__(self, chemin: Path) -> None:
        self.chemin = chemin

    def charger(self) -> list[Tache]:
        return charger(self.chemin)

    def sauvegarder(self, taches: list[Tache]) -> None:
        sauvegarder(self.chemin, taches)
\`\`\`

Le service reçoit un stockage injecté :

\`\`\`python
service = GestionnaireTaches(stockage.charger())
# après chaque mutation
stockage.sauvegarder(service.lister())
\`\`\`

## 4. Tester sans toucher au vrai fichier

\`\`\`python
def test_sauvegarde_et_rechargement(tmp_path):
    chemin = tmp_path / "taches.json"
    stockage = StockageJSON(chemin)
    stockage.sauvegarder([Tache(id=1, titre="Réviser Python")])
    rechargees = stockage.charger()
    assert rechargees[0].titre == "Réviser Python"
\`\`\`

\`tmp_path\` est fourni par pytest et isolé pour chaque test.

> **À retenir** — Une sauvegarde qui n'est pas atomique finit toujours par corrompre des données, un jour. Le coût de \`os.replace\` est négligeable.

## Exercice rapide

Ajoutez une commande \`export <fichier.md>\` qui produit une checklist Markdown des tâches. Testez avec un chemin dans \`tmp_path\` et vérifiez le contenu généré.`,
  },
  {
    slug: "projet-tests",
    moduleSlug: "projet-fondamentaux",
    position: 4,
    title: "Tester et fiabiliser le projet",
    summary:
      "Écrire une suite de tests utile, mesurer la couverture et corriger les cas limites.",
    estimatedMinutes: 55,
    codeLanguage: "python",
    keyPoints: [
      "Tester le comportement, pas l'implémentation",
      "Une fixture crée un état neuf",
      "La couverture indique ce qui n'est pas testé",
    ],
    contentMd: `## Organisation des tests

\`\`\`text
tests/
├── conftest.py
├── test_service.py
└── test_stockage.py
\`\`\`

\`\`\`python
# tests/conftest.py
import pytest
from taches.service import GestionnaireTaches

@pytest.fixture
def service() -> GestionnaireTaches:
    return GestionnaireTaches()
\`\`\`

## 1. Tests du service

\`\`\`python
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
\`\`\`

## 2. Tests de persistance

\`\`\`python
def test_fichier_corrompu(tmp_path):
    chemin = tmp_path / "taches.json"
    chemin.write_text("{pas du json", encoding="utf-8")
    with pytest.raises(RuntimeError, match="Impossible de lire"):
        StockageJSON(chemin).charger()

def test_rechargement_conserve_les_donnees(tmp_path):
    stockage = StockageJSON(tmp_path / "t.json")
    stockage.sauvegarder([Tache(id=1, titre="Test")])
    assert stockage.charger() == [Tache(id=1, titre="Test")]
\`\`\`

## 3. Couverture

\`\`\`bash
pip install pytest-cov
pytest --cov=taches --cov-report=term-missing
\`\`\`

Objectif raisonnable : 80–90 % sur la logique métier. 100 % n'est pas un but en soi ; certains chemins défensifs sont difficiles à atteindre.

## 4. Ce qu'il ne faut pas tester

- les appels directs à \`print\` dans la CLI (testez la sortie avec \`capsys\` si nécessaire) ;
- le comportement interne de \`json.dumps\` ;
- les détails d'implémentation qui peuvent changer sans modifier le contrat.

> **Règle** — Un test doit échouer pour une raison métier compréhensible. S'il casse à chaque refactorisation sans changement de comportement, il est trop couplé.

## Exercice rapide

Atteignez 85 % de couverture sur \`service.py\`. Ajoutez un test pour un titre de 120 caractères exactement et un pour 121 caractères. Corrigez le code si l'un des deux échoue.`,
  },
  {
    slug: "projet-finalisation",
    moduleSlug: "projet-fondamentaux",
    position: 5,
    title: "Finaliser, documenter et publier",
    summary:
      "Préparer un dépôt présentable : README, licence, version et démonstration.",
    estimatedMinutes: 50,
    codeLanguage: "markdown",
    keyPoints: [
      "Le README est la porte d'entrée du projet",
      "Une démo vaut mieux qu'une description",
      "Un projet fini est un projet documenté",
    ],
    contentMd: `## La checklist de livraison

- [ ] Le programme s'installe en trois commandes.
- [ ] Le README explique le problème et l'usage.
- [ ] Les tests passent sur une machine vierge.
- [ ] Aucun secret n'est versionné.
- [ ] La licence est présente.
- [ ] Une capture ou un GIF montre le résultat.

## 1. README efficace

\`\`\`markdown
# Tâches CLI

Suivi de tâches minimaliste en ligne de commande, avec persistance JSON.

## Installation
\`\`\`bash
git clone https://github.com/vous/taches-cli.git
cd taches-cli
python -m venv .venv
source .venv/bin/activate  # Windows : .venv\\\\Scripts\\\\activate
pip install -r requirements.txt
\`\`\`

## Utilisation
\`\`\`bash
python -m taches add "Réviser les fonctions"
python -m taches list
python -m taches done 1
\`\`\`

## Exemple de sortie
\`\`\`text
[ ] 2. Écrire les tests
[x] 1. Réviser les fonctions
2/2 terminées
\`\`\`

## Tests
\`\`\`bash
pytest --cov=taches
\`\`\`

## Licence
MIT
\`\`\`

## 2. Versionner

\`\`\`python
__version__ = "1.0.0"
\`\`\`

\`\`\`bash
git tag -a v1.0.0 -m "Première version stable"
git push origin v1.0.0
\`\`\`

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

1. Qu'avez-vous appris que vous ne saviez pas il y a deux semaines ?
2. Quelle décision referiez-vous autrement ?
3. Quelle serait la prochaine fonctionnalité, et pourquoi ?

Cette rétrospective nourrit directement votre portfolio et vos futurs entretiens.

## Exercice rapide

Publiez la version 1.0.0 de votre projet. Ajoutez-la dans la section « Mes projets » de DEVFORGE avec le statut « Terminé », puis consultez votre portfolio : le projet doit y apparaître avec ses technologies et ses résultats.`,
  },
];

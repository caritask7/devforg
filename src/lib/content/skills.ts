import type { Skill, SkillCategory } from "@/lib/types";

export const skillCategories: SkillCategory[] = [
  {
    slug: "programmation",
    position: 1,
    title: "Programmation",
    description: "Langages, mémoire et paradigmes.",
  },
  {
    slug: "algorithmique",
    position: 2,
    title: "Algorithmique & structures",
    description: "Efficacité temporelle et spatiale, topologies.",
  },
  {
    slug: "developpement-logiciel",
    position: 3,
    title: "Architecture & qualité logicielle",
    description: "Modélisation maintainable, tests et collaboration.",
  },
  {
    slug: "bases-donnees",
    position: 4,
    title: "Bases de données & persistance",
    description: "Transactions ACID, intégrité et plans d'exécution.",
  },
  {
    slug: "reseaux-systemes",
    position: 5,
    title: "Réseaux et systèmes",
    description: "Communication bas niveau, runtime et noyau.",
  },
  {
    slug: "intelligence-artificielle",
    position: 6,
    title: "Fondements de l'IA",
    description: "Prérequis mathématiques — sans recours aux wrappers d'API.",
  },
];

export const skills: Skill[] = [
  {
    slug: "python",
    categorySlug: "programmation",
    position: 1,
    title: "Python moderne",
    description: "Typage, structures, modules et bonnes pratiques.",
    technique: "Typage strict, compréhensions, gestion d'erreurs",
  },
  {
    slug: "typescript",
    categorySlug: "programmation",
    position: 2,
    title: "TypeScript & systèmes de types",
    description: "Types conditionnels, génériques et sûreté à la compilation.",
    technique: "Types génériques, narrowing, Zod",
  },
  {
    slug: "c-cpp",
    categorySlug: "programmation",
    position: 3,
    title: "C / C++",
    description: "Mémoire, pointeurs et gestion manuelle des ressources.",
    technique: "Allocation, RAII, Valgrind",
  },
  {
    slug: "rust",
    categorySlug: "programmation",
    position: 4,
    title: "Rust",
    description: "Borrow checker et concurrence sans data race.",
    technique: "Ownership, lifetimes, Send/Sync",
  },
  {
    slug: "analyse-complexite",
    categorySlug: "algorithmique",
    position: 1,
    title: "Analyse de complexité",
    description: "Big O, coût amorti et cas limites.",
    technique: "Time / space complexity, benchmark",
  },
  {
    slug: "structures-avancees",
    categorySlug: "algorithmique",
    position: 2,
    title: "Arbres & graphes",
    description: "Parcours, heaps, index et structures hiérarchiques.",
    technique: "BFS, DFS, AVL, tas binaire",
  },
  {
    slug: "programmation-dynamique",
    categorySlug: "algorithmique",
    position: 3,
    title: "Programmation dynamique & récursion",
    description: "Mémoïsation, tabulation et sous-structures optimales.",
    technique: "Memoization, DP bottom-up",
  },
  {
    slug: "architecture-propre",
    categorySlug: "developpement-logiciel",
    position: 1,
    title: "Architecture propre",
    description: "Découplage, lisibilité et injection de dépendances.",
    technique: "SOLID, ports & adapters, composition",
  },
  {
    slug: "tests-tdd",
    categorySlug: "developpement-logiciel",
    position: 2,
    title: "Tests automatisés & TDD",
    description: "Tests unitaires, d'intégration et couverture utile.",
    technique: "pytest, fixtures, cas limites",
  },
  {
    slug: "git-collaboration",
    categorySlug: "developpement-logiciel",
    position: 3,
    title: "Git & collaboration",
    description: "Historique lisible, branches et revue de code.",
    technique: "Branches, PR, CI, Conventional Commits",
  },
  {
    slug: "modelisation-sql",
    categorySlug: "bases-donnees",
    position: 1,
    title: "Modélisation relationnelle & SQL",
    description: "Normalisation, contraintes et requêtes composables.",
    technique: "PostgreSQL, 3NF, jointures",
  },
  {
    slug: "indexation-optimisation",
    categorySlug: "bases-donnees",
    position: 2,
    title: "Indexation & optimisation",
    description: "EXPLAIN ANALYZE, index composites et plans d'exécution.",
    technique: "B-tree, index partiels, cache de requêtes",
  },
  {
    slug: "protocoles-reseau",
    categorySlug: "reseaux-systemes",
    position: 1,
    title: "Protocoles réseau",
    description: "TCP/IP, HTTP, WebSockets et framing binaire.",
    technique: "Sockets, HTTP/1.1, keep-alive",
  },
  {
    slug: "systemes-exploitation",
    categorySlug: "reseaux-systemes",
    position: 2,
    title: "Systèmes d'exploitation",
    description: "Processus, threads, mémoire virtuelle et IPC.",
    technique: "Threads, locks, signaux, files",
  },
  {
    slug: "algebre-lineaire",
    categorySlug: "intelligence-artificielle",
    position: 1,
    title: "Algèbre linéaire & calcul matriciel",
    description: "Espaces vectoriels, produit tensoriel et décomposition SVD.",
    technique: "Vecteurs, matrices, numpy",
  },
  {
    slug: "statistiques-probabilites",
    categorySlug: "intelligence-artificielle",
    position: 2,
    title: "Statistiques & probabilités",
    description: "Théorème de Bayes, variables aléatoires et densités.",
    technique: "Distributions, estimation, tests",
  },
];

export function getSkill(slug: string): Skill | undefined {
  return skills.find((skill) => skill.slug === slug);
}

export function skillsForCategory(categorySlug: string): Skill[] {
  return skills
    .filter((skill) => skill.categorySlug === categorySlug)
    .sort((a, b) => a.position - b.position);
}

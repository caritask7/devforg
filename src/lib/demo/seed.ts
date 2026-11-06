import { randomUUID } from "node:crypto";
import { lessons } from "@/lib/content/lessons";
import { missions } from "@/lib/content/missions";
import { skills } from "@/lib/content/skills";
import { levelFromValidations, progressFromLevel } from "@/lib/labels";
import type {
  LessonProgress,
  MissionProgress,
  Profile,
  Project,
  UserSkillProgress,
} from "@/lib/types";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/config";
import { hashPassword } from "./password";

export interface DemoUser {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface DemoSession {
  token: string;
  userId: string;
  expiresAt: string;
}

export interface DemoResetToken {
  token: string;
  userId: string;
  expiresAt: string;
}

export type DemoLessonProgress = LessonProgress & { userId: string };
export type DemoMissionProgress = MissionProgress & { userId: string };
export type DemoProject = Project & { userId: string };
export type DemoSkillProgress = UserSkillProgress & { userId: string };

export interface DemoDatabase {
  version: 1;
  users: DemoUser[];
  sessions: DemoSession[];
  resetTokens: DemoResetToken[];
  profiles: Profile[];
  lessonProgress: DemoLessonProgress[];
  missionProgress: DemoMissionProgress[];
  projects: DemoProject[];
  skillProgress: DemoSkillProgress[];
}

function isoDaysAgo(days: number, hours = 0): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

const COMPLETED_MISSIONS = [
  { slug: "calculateur-robuste", days: 16, score: 92 },
  { slug: "refactor-fizzbuzz", days: 12, score: 88 },
  { slug: "inventaire-collections", days: 9, score: 90 },
  { slug: "git-workflow-audit", days: 7, score: 86 },
  { slug: "tests-service", days: 4, score: 91 },
  { slug: "cli-taches", days: 2, score: 95 },
];

export function createDemoSeed(): DemoDatabase {
  const userId = randomUUID();
  const now = new Date().toISOString();

  const profile: Profile = {
    id: userId,
    email: DEMO_EMAIL,
    fullName: "Alexandre V.",
    headline: "Développeur en formation · Phase 1",
    bio: "Je construis mes fondamentaux en développement logiciel avec DEVFORGE. Objectif : livrer des projets propres, testés et documentés.",
    githubUrl: "https://github.com/devforge-demo",
    linkedinUrl: "",
    websiteUrl: "",
    avatarUrl: "",
    level: 3,
    dailyGoalMinutes: 45,
    createdAt: isoDaysAgo(24),
    updatedAt: now,
  };

  // Progression des leçons : modules 1 à 3 terminés, module 4 entamé.
  const lessonProgress: DemoLessonProgress[] = [];
  const orderedLessons = [...lessons];

  const moduleOrder = [
    "python-fondamentaux",
    "conditions-boucles",
    "fonctions",
    "structures-donnees",
    "poo",
    "algorithmique",
    "git-github",
    "projet-fondamentaux",
  ];

  orderedLessons.forEach((lesson) => {
    const moduleIndex = moduleOrder.indexOf(lesson.moduleSlug);
    if (moduleIndex < 0) return;

    if (moduleIndex <= 2) {
      const days = 21 - moduleIndex * 5 - Math.min(lesson.position, 4);
      lessonProgress.push({
        userId,
        lessonSlug: lesson.slug,
        status: "completed",
        startedAt: isoDaysAgo(Math.max(days + 1, 1)),
        completedAt: isoDaysAgo(Math.max(days, 0)),
        lastViewedAt: isoDaysAgo(Math.max(days, 0)),
      });
    } else if (moduleIndex === 3 && lesson.position <= 2) {
      lessonProgress.push({
        userId,
        lessonSlug: lesson.slug,
        status: "completed",
        startedAt: isoDaysAgo(3, 5),
        completedAt: isoDaysAgo(3),
        lastViewedAt: isoDaysAgo(3),
      });
    }
  });

  const inProgressLesson = orderedLessons.find(
    (lesson) => lesson.moduleSlug === "structures-donnees" && lesson.position === 3,
  );
  if (inProgressLesson) {
    lessonProgress.push({
      userId,
      lessonSlug: inProgressLesson.slug,
      status: "in_progress",
      startedAt: isoDaysAgo(0, 4),
      completedAt: null,
      lastViewedAt: isoDaysAgo(0, 2),
    });
  }

  // Progression des missions.
  const missionProgress: DemoMissionProgress[] = [];
  for (const completed of COMPLETED_MISSIONS) {
    missionProgress.push({
      userId,
      missionSlug: completed.slug,
      status: "completed",
      notes:
        "Travail réalisé, tests exécutés localement et dépôt mis à jour. Relecture du diff effectuée avant soumission.",
      submissionUrl: `https://github.com/devforge-demo/${completed.slug}`,
      score: completed.score,
      startedAt: isoDaysAgo(completed.days + 3),
      submittedAt: isoDaysAgo(completed.days + 1),
      completedAt: isoDaysAgo(completed.days),
    });
  }

  missionProgress.push({
    userId,
    missionSlug: "parser-expressions",
    status: "in_progress",
    notes:
      "Le tokenizer fonctionne. Reste à gérer les parenthèses non équilibrées et à ajouter les tests de priorité.",
    submissionUrl: "",
    score: null,
    startedAt: isoDaysAgo(1),
    submittedAt: null,
    completedAt: null,
  });

  missionProgress.push({
    userId,
    missionSlug: "revue-code-pr",
    status: "submitted",
    notes:
      "Revue rédigée avec 6 remarques. En attente de la validation des critères de sécurité.",
    submissionUrl: "https://github.com/devforge-demo/revue-pr/pull/12",
    score: null,
    startedAt: isoDaysAgo(4),
    submittedAt: isoDaysAgo(3),
    completedAt: null,
  });

  // Projets.
  const projectCliId = randomUUID();
  const projectParserId = randomUUID();
  const projectIndexId = randomUUID();

  const projects: DemoProject[] = [
    {
      id: projectCliId,
      userId,
      title: "CLI de suivi de tâches",
      slug: "cli-suivi-taches",
      summary:
        "Application en ligne de commande persistante pour suivre mes tâches d'apprentissage, construite sans dépendance externe.",
      description:
        "Projet de synthèse de la phase 1. Le code est séparé en quatre modules : modèle, stockage JSON atomique, service métier et interface CLI. La suite de tests couvre les cas limites de validation, la persistance et les erreurs de fichier.",
      status: "done",
      technologies: ["Python 3.12", "pytest", "JSON", "GitHub Actions"],
      githubUrl: "https://github.com/devforge-demo/taches-cli",
      demoUrl: "",
      results:
        "12 tests, 91 % de couverture, installation en 3 commandes. Le README documente l'architecture et les choix de persistance.",
      startedAt: isoDaysAgo(14),
      completedAt: isoDaysAgo(2),
      createdAt: isoDaysAgo(14),
      updatedAt: isoDaysAgo(2),
      milestones: [
        {
          id: randomUUID(),
          projectId: projectCliId,
          position: 1,
          title: "Cahier des charges et modèle de données",
          description: "Périmètre, critères d'acceptation et dataclass Tache.",
          status: "done",
          completedAt: isoDaysAgo(13),
        },
        {
          id: randomUUID(),
          projectId: projectCliId,
          position: 2,
          title: "Service métier et tests unitaires",
          description: "Ajout, listage, terminaison, suppression et statistiques.",
          status: "done",
          completedAt: isoDaysAgo(9),
        },
        {
          id: randomUUID(),
          projectId: projectCliId,
          position: 3,
          title: "Persistance JSON atomique",
          description: "Écriture via fichier temporaire et os.replace.",
          status: "done",
          completedAt: isoDaysAgo(6),
        },
        {
          id: randomUUID(),
          projectId: projectCliId,
          position: 4,
          title: "CLI et gestion des erreurs",
          description: "Menu interactif, messages explicites, sortie propre.",
          status: "done",
          completedAt: isoDaysAgo(4),
        },
        {
          id: randomUUID(),
          projectId: projectCliId,
          position: 5,
          title: "README, CI et publication v1.0.0",
          description: "Workflow GitHub Actions, licence MIT et tag de version.",
          status: "done",
          completedAt: isoDaysAgo(2),
        },
      ],
    },
    {
      id: projectParserId,
      userId,
      title: "Analyseur d'expressions arithmétiques",
      slug: "analyseur-expressions",
      summary:
        "Tokenizer et parser récursif pour évaluer des expressions avec parenthèses, sans utiliser eval.",
      description:
        "Objectif : comprendre la construction d'un analyseur syntaxique. La grammaire est décrite dans le README et le parser produit un AST minimal avant évaluation.",
      status: "in_progress",
      technologies: ["Python 3.12", "pytest", "Parsing"],
      githubUrl: "https://github.com/devforge-demo/parser-expressions",
      demoUrl: "",
      results: "",
      startedAt: isoDaysAgo(6),
      completedAt: null,
      createdAt: isoDaysAgo(6),
      updatedAt: isoDaysAgo(1),
      milestones: [
        {
          id: randomUUID(),
          projectId: projectParserId,
          position: 1,
          title: "Spécifier la grammaire",
          description: "Expression, terme, facteur et priorités.",
          status: "done",
          completedAt: isoDaysAgo(5),
        },
        {
          id: randomUUID(),
          projectId: projectParserId,
          position: 2,
          title: "Implémenter le tokenizer",
          description: "Nombres, opérateurs, parenthèses et positions.",
          status: "done",
          completedAt: isoDaysAgo(3),
        },
        {
          id: randomUUID(),
          projectId: projectParserId,
          position: 3,
          title: "Parser récursif descendant",
          description: "Gérer les priorités et l'associativité à gauche.",
          status: "in_progress",
          completedAt: null,
        },
        {
          id: randomUUID(),
          projectId: projectParserId,
          position: 4,
          title: "Erreurs positionnées",
          description: "Caractère inconnu, parenthèse manquante, division par zéro.",
          status: "todo",
          completedAt: null,
        },
        {
          id: randomUUID(),
          projectId: projectParserId,
          position: 5,
          title: "Tests et documentation",
          description: "Jeu de tests complet et README.",
          status: "todo",
          completedAt: null,
        },
      ],
    },
    {
      id: projectIndexId,
      userId,
      title: "Index de notes personnel",
      slug: "index-notes-personnel",
      summary:
        "Moteur de recherche local pour retrouver rapidement mes notes techniques par mot-clé.",
      description:
        "Idée explorée après le module sur les structures de données. Le périmètre reste volontairement limité : index inversé en mémoire, persistance JSON et CLI.",
      status: "idea",
      technologies: ["Python", "JSON", "CLI"],
      githubUrl: "",
      demoUrl: "",
      results: "",
      startedAt: null,
      completedAt: null,
      createdAt: isoDaysAgo(10),
      updatedAt: isoDaysAgo(10),
      milestones: [
        {
          id: randomUUID(),
          projectId: projectIndexId,
          position: 1,
          title: "Définir le format des notes",
          description: "Markdown avec métadonnées.",
          status: "todo",
          completedAt: null,
        },
        {
          id: randomUUID(),
          projectId: projectIndexId,
          position: 2,
          title: "Construire l'index inversé",
          description: "Tokenisation, normalisation et dictionnaire de postings.",
          status: "todo",
          completedAt: null,
        },
        {
          id: randomUUID(),
          projectId: projectIndexId,
          position: 3,
          title: "CLI de recherche",
          description: "Requête, classement et affichage des extraits.",
          status: "todo",
          completedAt: null,
        },
      ],
    },
  ];

  // Progression des compétences calculée uniquement à partir des missions validées.
  const completedMissionSlugs = new Set(COMPLETED_MISSIONS.map((mission) => mission.slug));
  const counts = new Map<string, { count: number; titles: string[] }>();
  for (const mission of missions) {
    if (!completedMissionSlugs.has(mission.slug)) continue;
    for (const skillSlug of mission.skills) {
      const current = counts.get(skillSlug) ?? { count: 0, titles: [] };
      current.count += 1;
      current.titles.push(mission.title);
      counts.set(skillSlug, current);
    }
  }

  const skillProgress: DemoSkillProgress[] = skills.map((skill) => {
    const entry = counts.get(skill.slug);
    const level = levelFromValidations(entry?.count ?? 0);
    return {
      userId,
      skillSlug: skill.slug,
      level,
      progress: progressFromLevel(level),
      validatedBy: entry ? entry.titles.join(" · ") : "",
      updatedAt: now,
    };
  });

  return {
    version: 1,
    users: [
      {
        id: userId,
        email: DEMO_EMAIL,
        passwordHash: hashPassword(DEMO_PASSWORD),
        createdAt: isoDaysAgo(24),
      },
    ],
    sessions: [],
    resetTokens: [],
    profiles: [profile],
    lessonProgress,
    missionProgress,
    projects,
    skillProgress,
  };
}

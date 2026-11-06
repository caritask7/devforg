/**
 * Génère `supabase/seed.sql` à partir du contenu pédagogique TypeScript
 * (src/lib/content). Le fichier produit est idempotent : il peut être
 * ré-exécuté dans le SQL Editor Supabase pour mettre à jour le contenu.
 *
 * Usage : npm run db:seed-sql
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { phases, modules } from "../src/lib/content/curriculum";
import { lessons } from "../src/lib/content/lessons";
import { missions } from "../src/lib/content/missions";
import { skills, skillCategories } from "../src/lib/content/skills";

function sqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlTextArray(values: string[]): string {
  if (values.length === 0) return "'{}'";
  return `array[${values.map(sqlString).join(", ")}]`;
}

function sqlNullableString(value: string | null): string {
  return value === null ? "null" : sqlString(value);
}

function insertStatement(
  table: string,
  columns: string[],
  rows: string[][],
  conflictColumns: string[],
  updateColumns: string[],
): string {
  const values = rows.map((row) => `  (${row.join(", ")})`).join(",\n");
  const updates = updateColumns
    .map((column) => `    ${column} = excluded.${column}`)
    .join(",\n");
  return [
    `insert into public.${table} (${columns.join(", ")}) values`,
    values,
    `on conflict (${conflictColumns.join(", ")}) do update set`,
    updates + ";",
  ].join("\n");
}

function buildSeedSql(): string {
  const blocks: string[] = [];

  blocks.push(
    insertStatement(
      "skill_categories",
      ["slug", "position", "title", "description"],
      skillCategories.map((category) => [
        sqlString(category.slug),
        String(category.position),
        sqlString(category.title),
        sqlString(category.description),
      ]),
      ["slug"],
      ["position", "title", "description"],
    ),
  );

  blocks.push(
    insertStatement(
      "skills",
      ["slug", "category_slug", "position", "title", "description", "technique"],
      skills.map((skill) => [
        sqlString(skill.slug),
        sqlString(skill.categorySlug),
        String(skill.position),
        sqlString(skill.title),
        sqlString(skill.description),
        sqlString(skill.technique),
      ]),
      ["slug"],
      ["category_slug", "position", "title", "description", "technique"],
    ),
  );

  blocks.push(
    insertStatement(
      "learning_phases",
      [
        "slug",
        "position",
        "title",
        "tagline",
        "description",
        "status",
        "estimated_hours",
      ],
      phases.map((phase) => [
        sqlString(phase.slug),
        String(phase.position),
        sqlString(phase.title),
        sqlString(phase.tagline),
        sqlString(phase.description),
        sqlString(phase.status),
        String(phase.estimatedHours),
      ]),
      ["slug"],
      ["position", "title", "tagline", "description", "status", "estimated_hours"],
    ),
  );

  blocks.push(
    insertStatement(
      "modules",
      [
        "slug",
        "phase_slug",
        "position",
        "title",
        "description",
        "level",
        "estimated_minutes",
        "status",
        "objectives",
      ],
      modules.map((module) => [
        sqlString(module.slug),
        sqlString(module.phaseSlug),
        String(module.position),
        sqlString(module.title),
        sqlString(module.description),
        sqlString(module.level),
        String(module.estimatedMinutes),
        sqlString(module.status),
        sqlTextArray(module.objectives),
      ]),
      ["slug"],
      [
        "phase_slug",
        "position",
        "title",
        "description",
        "level",
        "estimated_minutes",
        "status",
        "objectives",
      ],
    ),
  );

  blocks.push(
    insertStatement(
      "lessons",
      [
        "slug",
        "module_slug",
        "position",
        "title",
        "summary",
        "content_md",
        "estimated_minutes",
        "code_language",
        "key_points",
      ],
      lessons.map((lesson) => [
        sqlString(lesson.slug),
        sqlString(lesson.moduleSlug),
        String(lesson.position),
        sqlString(lesson.title),
        sqlString(lesson.summary),
        sqlString(lesson.contentMd),
        String(lesson.estimatedMinutes),
        sqlString(lesson.codeLanguage),
        sqlTextArray(lesson.keyPoints),
      ]),
      ["slug"],
      [
        "module_slug",
        "position",
        "title",
        "summary",
        "content_md",
        "estimated_minutes",
        "code_language",
        "key_points",
      ],
    ),
  );

  blocks.push(
    insertStatement(
      "missions",
      [
        "slug",
        "title",
        "description",
        "category",
        "difficulty",
        "estimated_minutes",
        "context",
        "objective",
        "instructions_md",
        "requirements",
        "success_criteria",
        "module_slug",
        "tags",
      ],
      missions.map((mission) => [
        sqlString(mission.slug),
        sqlString(mission.title),
        sqlString(mission.description),
        sqlString(mission.category),
        sqlString(mission.difficulty),
        String(mission.estimatedMinutes),
        sqlString(mission.context),
        sqlString(mission.objective),
        sqlString(mission.instructionsMd),
        sqlTextArray(mission.requirements),
        sqlTextArray(mission.successCriteria),
        sqlNullableString(mission.moduleSlug),
        sqlTextArray(mission.tags),
      ]),
      ["slug"],
      [
        "title",
        "description",
        "category",
        "difficulty",
        "estimated_minutes",
        "context",
        "objective",
        "instructions_md",
        "requirements",
        "success_criteria",
        "module_slug",
        "tags",
      ],
    ),
  );

  const skillLinks: string[][] = [];
  for (const mission of missions) {
    for (const skillSlug of mission.skills) {
      skillLinks.push([sqlString(mission.slug), sqlString(skillSlug)]);
    }
  }
  blocks.push(
    insertStatement(
      "mission_skills",
      ["mission_slug", "skill_slug"],
      skillLinks,
      ["mission_slug", "skill_slug"],
      ["skill_slug"],
    ),
  );

  const header = `-- =============================================================================
-- DEVFORGE — Seed du contenu pédagogique
-- -----------------------------------------------------------------------------
-- FICHIER GÉNÉRÉ AUTOMATIQUEMENT — ne pas éditer à la main.
-- Régénérer avec : npm run db:seed-sql
--
-- À exécuter dans le SQL Editor Supabase APRÈS le schéma
-- (supabase/migrations/*_init.sql). Idempotent : ré-exécutable.
--
-- Contenu : ${skillCategories.length} catégories, ${skills.length} compétences,
-- ${phases.length} phases, ${modules.length} modules, ${lessons.length} leçons,
-- ${missions.length} missions, ${skillLinks.length} liens mission-compétence.
-- =============================================================================

`;

  return header + blocks.join("\n\n") + "\n";
}

async function main(): Promise<void> {
  const outputDir = path.join(process.cwd(), "supabase");
  const outputPath = path.join(outputDir, "seed.sql");
  const sql = buildSeedSql();

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, sql, "utf8");

  const sizeKb = (Buffer.byteLength(sql, "utf8") / 1024).toFixed(1);
  console.log(`Seed généré : ${outputPath} (${sizeKb} Ko)`);
  console.log(
    `Contenu : ${skillCategories.length} catégories, ${skills.length} compétences, ` +
      `${phases.length} phases, ${modules.length} modules, ${lessons.length} leçons, ` +
      `${missions.length} missions.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

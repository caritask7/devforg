import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { createEmptyDatabase, type LocalDatabase } from "./seed";

const DB_PATH = path.join(process.cwd(), "data", "local-db.json");

let queue: Promise<unknown> = Promise.resolve();

async function writeDatabase(db: LocalDatabase): Promise<void> {
  await mkdir(path.dirname(DB_PATH), { recursive: true });
  const tmp = `${DB_PATH}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
  try {
    await rename(tmp, DB_PATH);
  } catch {
    await rm(DB_PATH, { force: true });
    await rename(tmp, DB_PATH);
  }
}

export async function readDatabase(): Promise<LocalDatabase> {
  try {
    const raw = await readFile(DB_PATH, "utf8");
    const parsed = JSON.parse(raw) as LocalDatabase;
    if (!parsed || parsed.version !== 1) {
      throw new Error("Version de base locale inconnue");
    }
    return parsed;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT" || error instanceof SyntaxError) {
      const database = createEmptyDatabase();
      await writeDatabase(database);
      return database;
    }
    throw error;
  }
}

/**
 * Sérialise les écritures de la base locale. Le fichier reste la source
 * de vérité : aucune donnée n'est conservée en mémoire entre deux requêtes.
 */
export function updateDatabase<T>(
  mutator: (db: LocalDatabase) => T | Promise<T>,
): Promise<T> {
  const run = queue.then(async () => {
    const db = await readDatabase();
    const result = await mutator(db);
    await writeDatabase(db);
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}

import { randomBytes } from "node:crypto";
import { readDatabase, updateDatabase } from "./db";
import { hashPassword } from "./password";

const TOKEN_TTL_MS = 60 * 60 * 1000;

/** Crée un jeton de réinitialisation (mode démonstration uniquement). */
export async function createDemoResetToken(email: string): Promise<string | null> {
  const db = await readDatabase();
  const user = db.users.find(
    (item) => item.email.toLowerCase() === email.trim().toLowerCase(),
  );
  if (!user) return null;

  const token = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString();

  await updateDatabase((current) => {
    current.resetTokens = current.resetTokens.filter(
      (item) => new Date(item.expiresAt).getTime() > Date.now(),
    );
    current.resetTokens.push({ token, userId: user.id, expiresAt });
  });

  return token;
}

export async function isDemoResetTokenValid(token: string): Promise<boolean> {
  if (!token) return false;
  const db = await readDatabase();
  const entry = db.resetTokens.find((item) => item.token === token);
  return Boolean(entry && new Date(entry.expiresAt).getTime() > Date.now());
}

export async function resetDemoPassword(
  token: string,
  password: string,
): Promise<boolean> {
  const db = await readDatabase();
  const entry = db.resetTokens.find((item) => item.token === token);
  if (!entry || new Date(entry.expiresAt).getTime() <= Date.now()) return false;

  const passwordHash = hashPassword(password);
  await updateDatabase((current) => {
    const user = current.users.find((item) => item.id === entry.userId);
    if (user) user.passwordHash = passwordHash;
    current.resetTokens = current.resetTokens.filter((item) => item.token !== token);
    current.sessions = current.sessions.filter(
      (session) => session.userId !== entry.userId,
    );
  });
  return true;
}

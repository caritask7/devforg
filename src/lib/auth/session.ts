import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { isLocalMode } from "@/lib/config";
import { readDatabase, updateDatabase } from "@/lib/local/database";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AuthUser } from "@/lib/types";

const LOCAL_COOKIE = "devforge_local_session";
const SESSION_DAYS = 30;

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (isLocalMode) {
    const cookieStore = await cookies();
    const token = cookieStore.get(LOCAL_COOKIE)?.value;
    if (!token) return null;

    const db = await readDatabase();
    const session = db.sessions.find((item) => item.token === token);
    if (!session) return null;
    if (new Date(session.expiresAt).getTime() < Date.now()) return null;

    const user = db.users.find((item) => item.id === session.userId);
    if (!user) return null;
    return { id: user.id, email: user.email };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !user.email) return null;
  return { id: user.id, email: user.email };
}

export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function createLocalSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);

  await updateDatabase((db) => {
    db.sessions = db.sessions.filter(
      (session) => new Date(session.expiresAt).getTime() > Date.now(),
    );
    db.sessions.push({ token, userId, expiresAt: expiresAt.toISOString() });
  });

  const cookieStore = await cookies();
  cookieStore.set(LOCAL_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroyLocalSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(LOCAL_COOKIE)?.value;
  if (token) {
    await updateDatabase((db) => {
      db.sessions = db.sessions.filter((session) => session.token !== token);
    });
  }
  cookieStore.delete(LOCAL_COOKIE);
}

export async function signOut(): Promise<void> {
  if (isLocalMode) {
    await destroyLocalSession();
    return;
  }
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}

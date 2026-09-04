/**
 * Auth helpers — wire up Auth.js / OTP in a later iteration.
 */

export type SessionUser = {
  id: string;
  email?: string | null;
  phone?: string | null;
  name?: string | null;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  // TODO: integrate Auth.js session
  return null;
}

export async function requireSessionUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

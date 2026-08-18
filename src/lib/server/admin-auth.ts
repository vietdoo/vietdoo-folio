import { createHmac, timingSafeEqual } from "node:crypto";

const ADMIN_COOKIE = "vndo_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getAdminUsername() {
  return import.meta.env.ADMIN_USERNAME || process.env.ADMIN_USERNAME || "admin";
}

function getAdminPassword() {
  return import.meta.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "";
}

function getSessionSecret() {
  return (
    import.meta.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    getAdminPassword()
  );
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

export type AdminSession = {
  username: string;
  role: "admin";
};

function sessionToken(username: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `${encodeURIComponent(username)}:admin:${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

function validToken(token: string | undefined): AdminSession | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const [encodedUsername, role, expiresAtValue] = payload.split(":");
  const expiresAt = Number(expiresAtValue);
  if (
    !encodedUsername ||
    role !== "admin" ||
    !Number.isFinite(expiresAt) ||
    expiresAt < Math.floor(Date.now() / 1000)
  ) {
    return null;
  }

  const expected = sign(payload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    return { username: decodeURIComponent(encodedUsername), role: "admin" };
  } catch {
    return null;
  }
}

export function adminCookieName() {
  return ADMIN_COOKIE;
}

export function getConfiguredAdminUsername() {
  return getAdminUsername();
}

export function isAdminPasswordConfigured() {
  return Boolean(getAdminPassword());
}

export function verifyAdminCredentials(username: string, password: string) {
  const configuredUsername = getAdminUsername();
  const configuredPassword = getAdminPassword();
  if (!configuredUsername || !configuredPassword || !username || !password) {
    return false;
  }

  const providedUsername = Buffer.from(username);
  const expectedUsername = Buffer.from(configuredUsername);
  const providedPassword = Buffer.from(password);
  const expectedPassword = Buffer.from(configuredPassword);
  return (
    providedUsername.length === expectedUsername.length &&
    timingSafeEqual(providedUsername, expectedUsername) &&
    providedPassword.length === expectedPassword.length &&
    timingSafeEqual(providedPassword, expectedPassword)
  );
}

export function verifyAdminPassword(password: string) {
  return verifyAdminCredentials(getAdminUsername(), password);
}

export function createAdminSessionCookie(username = getAdminUsername()) {
  return `${ADMIN_COOKIE}=${sessionToken(username)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}; ${process.env.NODE_ENV === "production" ? "Secure; " : ""}`;
}

export function clearAdminSessionCookie() {
  return `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; ${process.env.NODE_ENV === "production" ? "Secure; " : ""}`;
}

export function getAdminSession(request: Request): AdminSession | null {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_COOKIE}=`))
    ?.slice(ADMIN_COOKIE.length + 1);
  return validToken(token);
}

export function hasAdminSession(request: Request) {
  return Boolean(getAdminSession(request));
}

export function unauthorizedResponse() {
  return new Response(
    JSON.stringify({ error: "Admin authentication required." }),
    {
      status: 401,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    },
  );
}

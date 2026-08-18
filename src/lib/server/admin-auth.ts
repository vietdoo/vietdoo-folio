import { createHmac, timingSafeEqual } from "node:crypto";

const ADMIN_COOKIE = "vndo_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

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

function sessionToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `admin:${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

function validToken(token: string | undefined) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expiresAt = Number(payload.split(":")[1]);
  if (
    !Number.isFinite(expiresAt) ||
    expiresAt < Math.floor(Date.now() / 1000)
  ) {
    return false;
  }

  const expected = sign(payload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

export function adminCookieName() {
  return ADMIN_COOKIE;
}

export function isAdminPasswordConfigured() {
  return Boolean(getAdminPassword());
}

export function verifyAdminPassword(password: string) {
  const configured = getAdminPassword();
  if (!configured || !password) return false;
  const providedBuffer = Buffer.from(password);
  const configuredBuffer = Buffer.from(configured);
  return (
    providedBuffer.length === configuredBuffer.length &&
    timingSafeEqual(providedBuffer, configuredBuffer)
  );
}

export function createAdminSessionCookie() {
  return `${ADMIN_COOKIE}=${sessionToken()}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}; ${process.env.NODE_ENV === "production" ? "Secure; " : ""}`;
}

export function clearAdminSessionCookie() {
  return `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; ${process.env.NODE_ENV === "production" ? "Secure; " : ""}`;
}

export function hasAdminSession(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_COOKIE}=`))
    ?.slice(ADMIN_COOKIE.length + 1);
  return validToken(token);
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

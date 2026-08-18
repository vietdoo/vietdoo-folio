import type { APIRoute } from "astro";
import {
  createAdminSessionCookie,
  getConfiguredAdminUsername,
  isAdminPasswordConfigured,
  verifyAdminCredentials,
} from "../../../lib/server/admin-auth";

export const POST: APIRoute = async ({ request }) => {
  if (!isAdminPasswordConfigured()) {
    return new Response(
      JSON.stringify({ error: "Admin credentials are not configured." }),
      {
        status: 503,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  }

  let body: { username?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  // A missing username falls back to the configured account for compatibility
  // with older private clients. The public admin form always sends both fields.
  const username =
    typeof body.username === "string" && body.username.trim()
      ? body.username.trim()
      : getConfiguredAdminUsername();

  if (
    typeof body.password !== "string" ||
    !verifyAdminCredentials(username, body.password)
  ) {
    return new Response(
      JSON.stringify({ error: "Invalid username or password." }),
      {
        status: 401,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  }

  return new Response(
    JSON.stringify({
      authenticated: true,
      user: { username, role: "admin" },
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Set-Cookie": createAdminSessionCookie(username),
      },
    },
  );
};

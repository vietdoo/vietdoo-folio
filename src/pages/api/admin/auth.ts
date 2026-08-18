import type { APIRoute } from "astro";
import {
  createAdminSessionCookie,
  isAdminPasswordConfigured,
  verifyAdminPassword,
} from "../../../lib/server/admin-auth";

export const POST: APIRoute = async ({ request }) => {
  if (!isAdminPasswordConfigured()) {
    return new Response(
      JSON.stringify({ error: "Admin password is not configured." }),
      {
        status: 503,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  }

  let body: { password?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  if (
    typeof body.password !== "string" ||
    !verifyAdminPassword(body.password)
  ) {
    return new Response(JSON.stringify({ error: "Invalid admin password." }), {
      status: 401,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  return new Response(JSON.stringify({ authenticated: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Set-Cookie": createAdminSessionCookie(),
    },
  });
};

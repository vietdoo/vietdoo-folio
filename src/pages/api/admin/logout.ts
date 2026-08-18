import type { APIRoute } from "astro";
import { clearAdminSessionCookie } from "../../../lib/server/admin-auth";

export const POST: APIRoute = async () =>
  new Response(JSON.stringify({ authenticated: false }), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Set-Cookie": clearAdminSessionCookie(),
    },
  });

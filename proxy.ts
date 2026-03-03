import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "ld-session-id";

/*
Generates and persists an anonymous session ID in a cookie.
This gives each browser session a unique key for LD's anonymous
user context.

This is necessary since we're running LD's server-side sdk.
A session ID needs to be established before flag evaluation
so each session can keep receiving the same flag.

Using a proxy to generate and persist a sessionID is perfect
for this.
*/

export function proxy(request: NextRequest): NextResponse {
  const response = NextResponse.next();
  const existing = request.cookies.get(SESSION_COOKIE)?.value;
  if (!existing) {
    const sessionId = crypto.randomUUID();
    response.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

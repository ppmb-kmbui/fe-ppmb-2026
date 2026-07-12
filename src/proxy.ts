import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "ppmb_access_token";

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return atob(padded);
}

/**
 * Best-effort, unverified check used only to decide whether to redirect an
 * already-logged-in visitor away from /login and /signup. The backend is the
 * sole source of truth for authorization; a forged or expired token here
 * only affects this UX shortcut, never actual access to protected data.
 */
function hasLikelyValidSession(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  try {
    const payload = JSON.parse(decodeBase64Url(parts[1])) as { exp?: number };
    return typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function proxy(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (token && hasLikelyValidSession(token)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup"],
};

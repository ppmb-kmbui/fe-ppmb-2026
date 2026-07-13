import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "ppmb_access_token";

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return atob(padded);
}

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
  const pathname = req.nextUrl.pathname;
  const hasSession = !!token && hasLikelyValidSession(token);

  if ((pathname === "/login" || pathname === "/signup") && hasSession) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const protectedPrefixes = [
    "/admin",
    "/kalyanamitta",
    "/materi",
    "/profil",
    "/tugas",
  ];
  const isProtectedRoute = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/admin/:path*",
    "/kalyanamitta/:path*",
    "/materi/:path*",
    "/profil/:path*",
    "/tugas/:path*",
  ],
};

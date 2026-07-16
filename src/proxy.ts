import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "ppmb_access_token";

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return atob(padded);
}

interface TokenPayload {
  exp?: number;
  is_admin?: boolean;
}

function getTokenPayload(token: string): TokenPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    return JSON.parse(decodeBase64Url(parts[1])) as TokenPayload;
  } catch {
    return null;
  }
}

export function proxy(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const pathname = req.nextUrl.pathname;
  const payload = token ? getTokenPayload(token) : null;
  const hasSession =
    !!payload && typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
  const isAdmin = payload?.is_admin === true;

  if ((pathname === "/login" || pathname === "/signup") && hasSession) {
    return NextResponse.redirect(new URL(isAdmin ? "/admin" : "/", req.url));
  }

  if (pathname === "/" && isAdmin) {
    return NextResponse.redirect(new URL("/admin", req.url));
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

  if (
    isAdmin &&
    isProtectedRoute &&
    pathname !== "/admin" &&
    !pathname.startsWith("/admin/")
  ) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if ((pathname === "/admin" || pathname.startsWith("/admin/")) && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/",
    "/admin/:path*",
    "/kalyanamitta/:path*",
    "/materi/:path*",
    "/profil/:path*",
    "/tugas/:path*",
  ],
};

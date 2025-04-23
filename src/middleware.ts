import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const publicPaths = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/unauthorize",
    "/consent-form",
  ];

  const { pathname } = req.nextUrl;
  const token = await getToken({ req });

  // Handle root path specially
  if (pathname === "/") {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // Check if current path is public
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Prevent authenticated users from accessing auth pages
  if (
    token &&
    (pathname.startsWith("/login") || pathname.startsWith("/signup"))
  ) {
    const destination =
      token.role === "dentist" ? "/dentist/dashboard" : "/patient/dashboard";
    return NextResponse.redirect(new URL(destination, req.url));
  }

  // If it's a public path, allow access regardless of token
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Protected path handling
  if (!token) {
    const callbackUrl = encodeURIComponent(
      req.nextUrl.pathname + req.nextUrl.search
    );
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
    );
  }

  // Role-based access control
  const role = token.role as string;
  const isDentistRoute = pathname.startsWith("/dentist");
  const isPatientRoute = pathname.startsWith("/patient");

  if (
    (role === "patient" && isDentistRoute) ||
    (role === "dentist" && isPatientRoute)
  ) {
    return NextResponse.redirect(new URL("/unauthorize", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|public/).*)"],
};

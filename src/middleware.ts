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

  // Prevent authenticated users from accessing public paths
  if (token && pathname.startsWith("/login")) {
    // Redirect to appropriate dashboard based on role
    const destination =
      token.role === "dentist" ? "/dentist/dashboard" : "/patient/dashboard";
    return NextResponse.redirect(new URL(destination, req.url));
  }

  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  const isProtectedPath = !isPublicPath;

  if (pathname.startsWith("/patient/consent-form")) {
    if (!token) {
      const callbackUrl = encodeURIComponent(
        req.nextUrl.pathname + req.nextUrl.search
      );
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
      );
    }
  }

  if (isProtectedPath && !token) {
    const callbackUrl = encodeURIComponent(
      req.nextUrl.pathname + req.nextUrl.search
    );
    if (req.nextUrl.pathname.startsWith("/patient/consent-form")) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
      );
    } else {
      return NextResponse.redirect(new URL(`/login`, req.url));
    }
  }

  if (token && isProtectedPath) {
    const role = token.role as string;
    const isDentistRoute = pathname.startsWith("/dentist");
    const isPatientRoute = pathname.startsWith("/patient");

    if (
      (role === "patient" && isDentistRoute) ||
      (role === "dentist" && isPatientRoute)
    ) {
      return NextResponse.redirect(new URL("/unauthorize", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|public/).*)"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const publicpath = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ];
  const { pathname } = request.nextUrl;

  // Check if the current path is protected
  const isProtectedPath = !publicpath.some((path) => pathname.startsWith(path));

  //   const isLoginPath = pathname === "/admin/login";

  const accessToken = request.cookies.get("next-auth.session-token")?.value;

  if (isProtectedPath && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!isProtectedPath && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};

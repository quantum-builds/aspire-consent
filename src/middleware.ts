import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const publicPaths = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ];
  const { pathname } = request.nextUrl;

  const isProtectedPath = !publicPaths.some((path) =>
    pathname.startsWith(path)
  );

  const sessionToken =
    request.cookies.get("__Secure-next-auth.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value;

  console.log(sessionToken);
  if (isProtectedPath && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!isProtectedPath && sessionToken) {
    return NextResponse.redirect(new URL("/dentist/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};

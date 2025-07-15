import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const session = getSessionCookie(request);
  const { pathname } = request.nextUrl;
  const authRoutes = ["/login", "/signup", "/forgot-password"];
  const protectedRoutes = ["/cart", "/dashboard"];

  // If user has session and tries to access auth routes, redirect to home
  if (session && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user has no session and tries to access protected routes, redirect to login page
  if (!session && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cart/:path*",
    "/dashboard/:path*",
    "/login",
    "/signup",
    "/forgot-password",
  ], // Apply middleware to specific routes
};

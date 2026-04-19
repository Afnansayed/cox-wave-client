import { NextRequest, NextResponse } from "next/server";
import { jwtUtils } from "./lib/jwt.utils";
import { Roles } from "./constants/role.type";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get("accessToken")?.value;
  const jwtSecret = process.env.JWT_ACCESS_SECRET;

  const redirectToLogin = () => {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "redirect",
      `${request.nextUrl.pathname}${request.nextUrl.search}`
    );
    return NextResponse.redirect(loginUrl);
  };

  if (!accessToken || !jwtSecret) {
    return redirectToLogin();
  }

  const tokenResult = jwtUtils.verifyToken(accessToken, jwtSecret);
  
  if (!tokenResult.success || !tokenResult.data) {
    return redirectToLogin();
  }

  const userRole = String(tokenResult.data.role || "").toUpperCase();

   // booking logic
  if (pathname.startsWith('/booking')) {
    if (userRole !== Roles.customer) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // for admin redirect
  if (userRole === Roles.admin) {
    if (
      pathname.startsWith('/customer-dashboard') ||
      pathname.startsWith('/owner-dashboard')
    ) {
      return NextResponse.redirect(new URL('/admin-dashboard', request.url));
    }
  }

  //for owner redirect
  if (userRole === Roles.owner) {
    if (
      pathname.startsWith('/customer-dashboard') ||
      pathname.startsWith('/admin-dashboard')
    ) {
      return NextResponse.redirect(new URL('/owner-dashboard', request.url));
    }
  }

  // for customer redirect
  if (userRole === Roles.customer) {
    if (
      pathname.startsWith('/owner-dashboard') ||
      pathname.startsWith('/admin-dashboard')
    ) {
      return NextResponse.redirect(new URL('/customer-dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin-dashboard',
    '/admin-dashboard/:path*',
    '/owner-dashboard',
    '/owner-dashboard/:path*',
    '/customer-dashboard',
    '/customer-dashboard/:path*',
    '/booking',
    '/booking/:path*',
  ],
};

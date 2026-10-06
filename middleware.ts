import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Публичные маршруты (доступны без авторизации)
  const publicRoutes = [
    "/",
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/verify-email",
    "/auth/error",
    "/api/auth",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    route === "/" ? nextUrl.pathname === "/" : nextUrl.pathname.startsWith(route)
  );

  // API маршруты (кроме auth) — не блокируем middleware, защита будет внутри
  const isApiRoute = nextUrl.pathname.startsWith("/api/");

  // Статические файлы
  const isStaticFile =
    nextUrl.pathname.startsWith("/_next") ||
    nextUrl.pathname.startsWith("/images") ||
    nextUrl.pathname.startsWith("/favicon") ||
    nextUrl.pathname.startsWith("/icon") ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|webmanifest)$/.test(nextUrl.pathname);

  if (isStaticFile) {
    return NextResponse.next();
  }

  // Если не авторизован и маршрут не публичный — редирект на логин
  if (!isLoggedIn && !isPublicRoute && !isApiRoute) {
    const loginUrl = new URL("/auth/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Защита админ-маршрутов по ролям
  if (nextUrl.pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/auth/login", nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!["super_admin", "admin", "moderator"].includes(userRole ?? "")) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
    }
  }

  // Защита дашборда
  if (nextUrl.pathname.startsWith("/dashboard") && !isLoggedIn) {
    const loginUrl = new URL("/auth/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|images|favicon.*|icon.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|webmanifest)$).*)",
  ],
};
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  const { pathname } = req.nextUrl;

  // Явно указываем защищённые маршруты
  const protectedPaths = [
    '/profile',
    '/profile/edit',
    '/create-blog'
  ];

  // Проверка защищённых маршрутов
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Перенаправление авторизованных пользователей
  if (['/login', '/signup'].includes(pathname) && token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/create-blog',
    '/login',
    '/signup'
  ]
};
// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// const secret = process.env.NEXTAUTH_SECRET;

// export async function middleware(req: NextRequest) {
//   const token = await getToken({ req, secret });
//   const { pathname } = req.nextUrl;

//   // Защищённые маршруты (только для авторизованных)
//   const protectedPaths = ["/blog", "/profile", "/dashboard"];

//   // Публичные маршруты, недоступные авторизованным
//   const authRestrictedPaths = ["/login", "/signup"];

//   // Проверка защищённых маршрутов
//   if (protectedPaths.some((path) => pathname.startsWith(path))) {
//     if (!token) {
//       const loginUrl = new URL("/login", req.url);
//       loginUrl.searchParams.set("callbackUrl", pathname);
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   // Перенаправление авторизованных с /login и /signup
//   if (authRestrictedPaths.includes(pathname)) {
//     if (token) {
//       return NextResponse.redirect(new URL("/", req.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/blog/:path*",
//     "/profile/:path*",
//     "/dashboard/:path*",
//     "/login",
//     "/signup",
//   ],
// };
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  const { pathname } = req.nextUrl;

  // Защищённые маршруты (только для авторизованных)
  const protectedPaths = ["/profile", "/dashboard"]; // /blog убран

  // Публичные маршруты, недоступные авторизованным
  const authRestrictedPaths = ["/login", "/signup"];

  // Проверка защищённых маршрутов
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Перенаправление авторизованных с /login и /signup
  if (authRestrictedPaths.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/dashboard/:path*",
    "/login",
    "/signup",
  ], // /blog/:path* убран
};
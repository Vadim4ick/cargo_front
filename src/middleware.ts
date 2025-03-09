import { NextRequest } from "next/server";
import { protectedRoutes } from "./services/server-actions/protected-routes.middleware";
import { protectedLogin } from "./services/server-actions/protected-login.middleware";

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  if (pathname.includes("/login")) {
    return protectedLogin(req);
  }

  return protectedRoutes(req);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

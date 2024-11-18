import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicPath = pathname === "/login" || pathname === "/register";
  // const token = request.cookies.get("accessToken")?.value || "";
  const token = await getToken({ req: request });

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/users", request.url));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/", "/login", "/users", "/posts", "/transactions"],
};

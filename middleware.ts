import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public routes
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/auth/") ||
    pathname === "/" ||
    pathname.startsWith("/public") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next()
  }

  // Check authentication for protected routes
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = "/auth/signin"
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api/auth|auth|_next/static|_next/image|favicon.ico|public|$).*)"],
}

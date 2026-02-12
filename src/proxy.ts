import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

const publicRoutes = [
  "/",
  "/sign-in",
  "/sign-up",
]

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  const normalized: Record<string, string> = {}

  req.headers.forEach((value, key) => {
    normalized[key] = value
  })

  const session = await auth.api.getSession({
    headers: normalized,
  })

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
}

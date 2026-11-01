import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Runs before every /admin and /account request (including client-side navigations).
// Pages and server actions check again against the database; this is the first gate.
export async function proxy(req: NextRequest) {
  const token = req.cookies.get("nc_session")?.value;
  let role: string | null = null;
  if (token && process.env.AUTH_SECRET) {
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET));
      role = String(payload.role);
    } catch {
      role = null;
    }
  }
  const { pathname } = req.nextUrl;
  if (!role) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/account/:path*"] };

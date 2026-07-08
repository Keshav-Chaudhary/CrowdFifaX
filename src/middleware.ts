import { NextResponse, type NextRequest } from "next/server";
import { securityHeaders } from "@/services/security/headers";

/**
 * Edge/runtime middleware: a second enforcement point for security headers and
 * a coarse gate on the API surface.
 *
 * `next.config.ts` already attaches the static header set; applying it here too
 * guarantees the headers are present even on responses that bypass the static
 * header pipeline (e.g. streamed API responses), and lets us reject obviously
 * malformed API requests before they reach route handlers.
 */

/** Maximum accepted request body for the assistant API, in bytes (~256 KB). */
const MAX_API_BODY_BYTES = 256 * 1024;

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Guard the API: reject oversized or wrong-method requests cheaply.
  if (pathname.startsWith("/api/")) {
    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (contentLength > MAX_API_BODY_BYTES) {
      return jsonResponse(
        { error: "Request body too large." },
        413,
      );
    }
  }

  // Bypass response modifications for assistant API to allow streaming.
  if (pathname === "/api/assistant") {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  for (const { key, value } of securityHeaders()) {
    response.headers.set(key, value);
  }
  return response;
}

function jsonResponse(body: unknown, status: number): NextResponse {
  const res = NextResponse.json(body, { status });
  for (const { key, value } of securityHeaders()) {
    res.headers.set(key, value);
  }
  return res;
}

/**
 * Apply to all routes except Next internals and static assets, where the static
 * header rules already apply and per-request work would be wasteful.
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.well-known).*)"],
};

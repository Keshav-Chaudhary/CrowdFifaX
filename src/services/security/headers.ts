/**
 * Centralized security-header policy.
 *
 * Used by both `next.config.ts` (static header rules) and `middleware.ts`
 * (per-request augmentation). Keeping a single source of truth means the policy
 * can be unit-tested and cannot drift between the two enforcement points.
 */

export interface SecurityHeader {
  key: string;
  value: string;
}

/**
 * Build the Content-Security-Policy string.
 *
 * @param nonce  Optional per-request nonce. When supplied, inline scripts are
 *               restricted to that nonce instead of `'unsafe-inline'`,
 *               tightening the policy considerably.
 */
export function buildCSP(nonce?: string): string {
  const isDev = process.env.NODE_ENV === "development";
  const scriptSrc = nonce
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ""}`
    : `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""}`;

  return [
    "default-src 'self'",
    scriptSrc,
    // Tailwind/Next inject inline styles; styles cannot execute, so this is low-risk.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    // The AI provider is called server-side; the browser only talks to us.
    "connect-src 'self' https://*.googleapis.com",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

/**
 * The full set of security headers applied to every response.
 *
 * @param nonce  Optional CSP nonce (see {@link buildCSP}).
 */
export function securityHeaders(nonce?: string): SecurityHeader[] {
  return [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-DNS-Prefetch-Control", value: "off" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
    {
      key: "Permissions-Policy",
      value:
        "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
    },
    {
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    },
    { key: "Content-Security-Policy", value: buildCSP(nonce) },
  ];
}

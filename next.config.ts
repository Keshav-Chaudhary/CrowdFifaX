import type { NextConfig } from "next";
import { securityHeaders } from "./src/services/security/headers";

/**
 * Security headers are applied to every response from a single source of truth
 * (`src/lib/security/headers.ts`), so the policy is unit-tested and identical
 * wherever it is enforced.
 *
 * The Content-Security-Policy is intentionally strict. `connect-src 'self'`
 * keeps the browser talking only to our own API route — the DigitalOcean
 * inference endpoint is called server-side, so the key and provider are never
 * exposed to the client.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
//   async headers() {
//     return [
//       {
//         source: "/:path*",
//         headers: securityHeaders().map((h) => ({
//           key: h.key,
//           value: h.value,
//         })),
//       },
//     ];
//   },
};

export default nextConfig;

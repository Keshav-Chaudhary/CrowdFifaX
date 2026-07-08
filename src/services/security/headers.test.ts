import { describe, expect, it } from "vitest";
import { buildCSP, securityHeaders } from "@/services/security/headers";

describe("buildCSP", () => {
  it("defaults to unsafe-inline scripts when no nonce is given", () => {
    const csp = buildCSP();
    expect(csp).toContain("script-src 'self' 'unsafe-inline'");
  });

  it("uses a nonce and strict-dynamic when a nonce is given", () => {
    const csp = buildCSP("abc123");
    expect(csp).toContain("'nonce-abc123'");
    expect(csp).toContain("'strict-dynamic'");
    expect(csp).not.toContain("script-src 'self' 'unsafe-inline'");
  });

  it("includes unsafe-eval in script-src when NODE_ENV is development", () => {
    const prev = process.env.NODE_ENV;
    (process as { env: Record<string, string | undefined> }).env.NODE_ENV = "development";
    const csp = buildCSP();
    expect(csp).toContain("'unsafe-eval'");
    (process as { env: Record<string, string | undefined> }).env.NODE_ENV = prev;
  });

  it("includes unsafe-eval in script-src when NODE_ENV is development and a nonce is given", () => {
    const prev = process.env.NODE_ENV;
    (process as { env: Record<string, string | undefined> }).env.NODE_ENV = "development";
    const csp = buildCSP("abc123");
    expect(csp).toContain("'nonce-abc123'");
    expect(csp).toContain("'unsafe-eval'");
    (process as { env: Record<string, string | undefined> }).env.NODE_ENV = prev;
  });

  it("restricts default-src to self", () => {
    expect(buildCSP()).toContain("default-src 'self'");
  });

  it("keeps connect-src locked to self so the AI key cannot leak client-side", () => {
    expect(buildCSP()).toContain("connect-src 'self'");
  });

  it("forbids framing", () => {
    expect(buildCSP()).toContain("frame-ancestors 'none'");
  });

  it("disallows object/embed", () => {
    expect(buildCSP()).toContain("object-src 'none'");
  });

  it("pins base-uri and form-action to self", () => {
    const csp = buildCSP();
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
  });

  it("requests upgrade of insecure requests", () => {
    expect(buildCSP()).toContain("upgrade-insecure-requests");
  });

  it("joins directives with semicolons", () => {
    expect(buildCSP().split("; ").length).toBeGreaterThan(5);
  });
});

describe("securityHeaders", () => {
  const headers = securityHeaders();
  const byKey = (k: string) => headers.find((h) => h.key === k)?.value;

  it("sets nosniff", () => {
    expect(byKey("X-Content-Type-Options")).toBe("nosniff");
  });

  it("denies framing", () => {
    expect(byKey("X-Frame-Options")).toBe("DENY");
  });

  it("sets a strict referrer policy", () => {
    expect(byKey("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
  });

  it("includes HSTS with a long max-age and preload", () => {
    const hsts = byKey("Strict-Transport-Security") ?? "";
    expect(hsts).toContain("max-age=63072000");
    expect(hsts).toContain("includeSubDomains");
    expect(hsts).toContain("preload");
  });

  it("locks down sensitive browser features via Permissions-Policy", () => {
    const pp = byKey("Permissions-Policy") ?? "";
    expect(pp).toContain("camera=()");
    expect(pp).toContain("microphone=()");
    expect(pp).toContain("geolocation=()");
  });

  it("sets cross-origin isolation headers", () => {
    expect(byKey("Cross-Origin-Opener-Policy")).toBe("same-origin");
    expect(byKey("Cross-Origin-Resource-Policy")).toBe("same-origin");
  });

  it("includes a Content-Security-Policy header", () => {
    expect(byKey("Content-Security-Policy")).toBeTruthy();
  });

  it("threads a nonce through to the CSP header", () => {
    const withNonce = securityHeaders("xyz789");
    const csp = withNonce.find(
      (h) => h.key === "Content-Security-Policy",
    )?.value;
    expect(csp).toContain("'nonce-xyz789'");
  });

  it("returns a stable, non-empty set of headers", () => {
    expect(headers.length).toBeGreaterThanOrEqual(8);
    for (const h of headers) {
      expect(h.key).toBeTruthy();
      expect(h.value).toBeTruthy();
    }
  });
});

/**
 * Worker entry — bridges Pages-style Functions with Workers + Static Assets.
 *
 * Cloudflare deployed this site as a Worker (verified via API: account
 * /workers/scripts has `verbara-website`; /pages/projects is empty).
 * The Pages-Functions auto-routing convention is therefore not active —
 * we route requests manually here and delegate to the existing handler
 * file in `functions/`.
 *
 * Static assets (everything in dist/) are served via env.ASSETS.fetch().
 */

import { onRequestPost as developerLicensePost } from '../functions/api/developer-license/index';

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  LICENSE_AUDIT_DB: unknown;
  RATE_LIMIT_KV: unknown;
  VERBARA_LICENSE_SIGNING_KEY: string;
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (
      (url.pathname === '/api/developer-license' || url.pathname === '/api/developer-license/') &&
      request.method === 'POST'
    ) {
      // Cast Env to the shape the function expects (it has its own ambient interface).
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return developerLicensePost({ request, env: env as any, waitUntil: ctx.waitUntil.bind(ctx) });
    }

    // Anything else -> static assets binding (built Astro site).
    return env.ASSETS.fetch(request);
  },
};

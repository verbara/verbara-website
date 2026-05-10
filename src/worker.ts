/**
 * Worker entry — bridges Pages-style Functions with Workers + Static Assets,
 * and hosts the daily drift-detection cron.
 *
 * Cloudflare deployed this site as a Worker (verified via API: account
 * /workers/scripts has `verbara-website`; /pages/projects is empty).
 * The Pages-Functions auto-routing convention is therefore not active —
 * we route requests manually here and delegate to the existing handler
 * file in `functions/`.
 *
 * Static assets (everything in dist/) are served via env.ASSETS.fetch().
 *
 * Scheduled (cron): `runDriftDetection` re-resolves each authorized image's
 * manifest-list digest against ghcr.io and emails security@verbara.io if
 * any digest no longer matches `data/authorized-digests.json`. Triggered
 * by the `[triggers] crons` entry in `wrangler.toml`. See
 * `src/drift-detection.ts` for the implementation contract.
 */

import { onRequestPost as developerLicensePost } from '../functions/api/developer-license/index';
import { runDriftDetection } from './drift-detection';

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

interface ScheduledEvent {
  cron: string;
  scheduledTime: number;
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

  /**
   * Daily cron — Phase 2.3 of Pro v2.3.x image-binding execution plan.
   * `ctx.waitUntil` keeps the Worker alive until the async work completes
   * (Cloudflare's documented pattern for scheduled handlers).
   */
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(
      (async () => {
        try {
          const report = await runDriftDetection(env);
          // `console.warn` instead of `log` to satisfy the project lint
          // policy (see eslint.config.mjs `no-console`); the cron's normal-
          // case output is still informational, not a warning per se, but
          // it's the only severity the linter allows alongside `error`.
          console.warn(
            `drift-detection cron=${event.cron} entries=${report.entries} drifts=${report.drifts.length} errors=${report.errors.length}`,
          );
        } catch (e) {
          console.error('drift-detection: unhandled error', e);
        }
      })(),
    );
  },
};

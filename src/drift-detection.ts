/**
 * Daily drift-detection cron — Phase 2.3 of Pro v2.3.x image-binding.
 *
 * For each entry in `data/authorized-digests.json` `current`, re-resolves the
 * `image_ref` against the source registry (HEAD on the OCI manifest endpoint
 * — bandwidth-light, no pull) and compares the live digest to the recorded
 * `manifest_list_digest`. Mismatch = the registry tag was mutated underneath
 * us (catastrophic — every license that authorised the OLD digest now points
 * at content the customer never agreed to). Sends a structured alert to
 * `security@verbara.io` via Resend; does NOT auto-fix.
 *
 * This cron is the early-warning system that protects the customer-side
 * Layer-C check (Pro `LicenseValidator.UnauthorizedImage`) from being defeated
 * by registry-side tag mutation. If ghcr.io ever lets an attacker push a new
 * image at the same tag, we hear about it within ~24 h and pull the tag (the
 * attacker still cannot match the recorded manifest-list digest at deploy
 * time, so existing customers stay safe; new pulls fail this check).
 *
 * Empty registry → cron logs "no entries to verify" and exits cleanly. The
 * cron is registered under the same trigger as a future cosign-public-key
 * fingerprint drift check (ADR-0001 §3) — that check is NOT shipped yet and
 * is tracked by a TODO below.
 *
 * References:
 *   - Pro ADR-0011 — `Verbara.Sdk.Pro/docs/decisions/0011-image-digest-binding-in-license-keys.md`
 *   - Phase 2.3 of `Verbara.Sdk.Pro/docs/plans/active/2026-05-09-pro-v23x-image-binding-execution.md`
 *   - OCI Distribution Spec — https://github.com/opencontainers/distribution-spec
 */

import {
  loadRegistry,
  type AuthorizedDigestEntry,
} from '../functions/api/developer-license/authorized-digests';

const SECURITY_ALERT_FROM = 'Verbara <licensing@verbara.io>';
const SECURITY_ALERT_TO = 'security@verbara.io';

/**
 * Accept headers the OCI distribution spec uses for manifest-list responses.
 * Order matters — registries pick the first matching one. ghcr.io serves
 * either OCI image-index v1 or Docker manifest-list v2 depending on how the
 * image was pushed, so we accept both.
 */
const MANIFEST_LIST_ACCEPT_HEADERS = [
  'application/vnd.oci.image.index.v1+json',
  'application/vnd.docker.distribution.manifest.list.v2+json',
].join(', ');

export interface DriftReport {
  checkedAt: string;
  entries: number;
  drifts: DriftAlert[];
  errors: DriftError[];
}

export interface DriftAlert {
  platform_version: string;
  image_ref: string;
  expected_digest: string;
  actual_digest: string;
}

export interface DriftError {
  platform_version: string;
  image_ref: string;
  expected_digest: string;
  message: string;
}

export interface DriftEnv {
  RESEND_API_KEY: string;
}

/**
 * Entry point invoked by the Worker `scheduled` handler. Returns a structured
 * report so an operator can also trigger it on demand and inspect the result.
 */
export async function runDriftDetection(env: DriftEnv): Promise<DriftReport> {
  const registry = loadRegistry();
  const entries = registry.current ?? [];
  const report: DriftReport = {
    checkedAt: new Date().toISOString(),
    entries: entries.length,
    drifts: [],
    errors: [],
  };

  if (entries.length === 0) {
    console.warn('drift-detection: registry empty — no entries to verify');
    return report;
  }

  for (const entry of entries) {
    const result = await verifyEntry(entry);
    if (result.kind === 'drift') {
      report.drifts.push(result.alert);
    } else if (result.kind === 'error') {
      report.errors.push(result.error);
    }
  }

  if (report.drifts.length > 0 || report.errors.length > 0) {
    await sendSecurityAlert(env.RESEND_API_KEY, report);
  }

  return report;
}

interface VerifyOk {
  kind: 'ok';
}
interface VerifyDrift {
  kind: 'drift';
  alert: DriftAlert;
}
interface VerifyError {
  kind: 'error';
  error: DriftError;
}

async function verifyEntry(
  entry: AuthorizedDigestEntry,
): Promise<VerifyOk | VerifyDrift | VerifyError> {
  try {
    const liveDigest = await fetchLiveManifestDigest(entry.image_ref);
    if (liveDigest === null) {
      return {
        kind: 'error',
        error: {
          platform_version: entry.platform_version,
          image_ref: entry.image_ref,
          expected_digest: entry.manifest_list_digest,
          message: 'registry returned no Docker-Content-Digest header',
        },
      };
    }
    if (liveDigest !== entry.manifest_list_digest) {
      return {
        kind: 'drift',
        alert: {
          platform_version: entry.platform_version,
          image_ref: entry.image_ref,
          expected_digest: entry.manifest_list_digest,
          actual_digest: liveDigest,
        },
      };
    }
    return { kind: 'ok' };
  } catch (e) {
    return {
      kind: 'error',
      error: {
        platform_version: entry.platform_version,
        image_ref: entry.image_ref,
        expected_digest: entry.manifest_list_digest,
        message: e instanceof Error ? e.message : String(e),
      },
    };
  }
}

/**
 * Resolves `image_ref` (e.g. `ghcr.io/verbara/platform:v3.0.0`) into the live
 * manifest-list digest by HEAD-ing the OCI distribution-spec endpoint. The
 * response's `Docker-Content-Digest` header is the SHA-256 of the manifest
 * list — the exact value `cosign sign` operates on and that
 * `manifest_list_digest` records.
 *
 * Returns `null` if the registry response is missing the expected header
 * (which itself is a drift signal worth reporting). Throws on non-2xx HTTP.
 */
async function fetchLiveManifestDigest(imageRef: string): Promise<string | null> {
  const parsed = parseImageRef(imageRef);

  // ghcr.io requires a bearer token even for public images. Anonymous token
  // request: GET https://ghcr.io/token?service=ghcr.io&scope=repository:<repo>:pull
  // Other OCI registries (Docker Hub, ECR public, GitHub-internal Quay) follow
  // the same pattern with their own authority — this code only handles ghcr.io
  // because that's the only registry the Verbara Platform image ships from
  // (per the active Pro plan). Extending to other authorities is a future
  // enhancement.
  if (parsed.authority !== 'ghcr.io') {
    throw new Error(
      `unsupported registry authority "${parsed.authority}" — drift-detection only handles ghcr.io currently`,
    );
  }

  const tokenResponse = await fetch(
    `https://ghcr.io/token?service=ghcr.io&scope=repository:${parsed.repository}:pull`,
    { method: 'GET' },
  );
  if (!tokenResponse.ok) {
    throw new Error(`ghcr.io token endpoint returned ${tokenResponse.status}`);
  }
  const tokenJson = (await tokenResponse.json()) as { token?: string };
  if (typeof tokenJson.token !== 'string' || tokenJson.token.length === 0) {
    throw new Error('ghcr.io token endpoint returned no token');
  }

  const manifestResponse = await fetch(
    `https://${parsed.authority}/v2/${parsed.repository}/manifests/${parsed.reference}`,
    {
      method: 'HEAD',
      headers: {
        Authorization: `Bearer ${tokenJson.token}`,
        Accept: MANIFEST_LIST_ACCEPT_HEADERS,
      },
    },
  );
  if (!manifestResponse.ok) {
    throw new Error(
      `${parsed.authority} manifest HEAD returned ${manifestResponse.status} for ${imageRef}`,
    );
  }
  return manifestResponse.headers.get('docker-content-digest');
}

interface ParsedImageRef {
  authority: string;
  repository: string;
  reference: string; // tag or digest
}

/**
 * Splits an OCI image reference like `ghcr.io/verbara/platform:v3.0.0` or
 * `ghcr.io/verbara/platform@sha256:abc...` into its three components. The
 * registry is conservative — only handles `authority/repo:tag` and
 * `authority/repo@digest` (the two shapes the Verbara registry uses).
 */
function parseImageRef(imageRef: string): ParsedImageRef {
  const slashIndex = imageRef.indexOf('/');
  if (slashIndex === -1) {
    throw new Error(`malformed image_ref "${imageRef}" — expected authority/repository`);
  }
  const authority = imageRef.slice(0, slashIndex);
  const rest = imageRef.slice(slashIndex + 1);

  const atIndex = rest.lastIndexOf('@');
  if (atIndex !== -1) {
    return {
      authority,
      repository: rest.slice(0, atIndex),
      reference: rest.slice(atIndex + 1),
    };
  }
  const colonIndex = rest.lastIndexOf(':');
  if (colonIndex === -1) {
    throw new Error(`malformed image_ref "${imageRef}" — expected :tag or @digest`);
  }
  return {
    authority,
    repository: rest.slice(0, colonIndex),
    reference: rest.slice(colonIndex + 1),
  };
}

/**
 * Sends the structured drift report to security@verbara.io via Resend (same
 * channel as the license-issuance email path so we do not introduce a second
 * mail provider). Body is a plain-text dump — small enough that an HTML
 * template would be overkill, and security on-call wants greppable text.
 */
async function sendSecurityAlert(apiKey: string, report: DriftReport): Promise<void> {
  const lines: string[] = [];
  lines.push('Verbara Platform image-digest drift detected.');
  lines.push('');
  lines.push(`Checked at: ${report.checkedAt}`);
  lines.push(`Entries inspected: ${report.entries}`);
  lines.push(`Drifts: ${report.drifts.length}`);
  lines.push(`Errors: ${report.errors.length}`);
  lines.push('');

  for (const drift of report.drifts) {
    lines.push(`DRIFT  platform_version=${drift.platform_version}`);
    lines.push(`       image_ref=${drift.image_ref}`);
    lines.push(`       expected_digest=${drift.expected_digest}`);
    lines.push(`       actual_digest=${drift.actual_digest}`);
    lines.push('');
  }
  for (const error of report.errors) {
    lines.push(`ERROR  platform_version=${error.platform_version}`);
    lines.push(`       image_ref=${error.image_ref}`);
    lines.push(`       expected_digest=${error.expected_digest}`);
    lines.push(`       message=${error.message}`);
    lines.push('');
  }
  lines.push(
    'Investigate registry-side tag mutation. Do NOT auto-fix —' +
      ' confirm the source-of-truth digest before any data/authorized-digests.json update.',
  );

  const subject =
    report.drifts.length > 0
      ? `[verbara-website] Image digest DRIFT detected (${report.drifts.length})`
      : `[verbara-website] Drift-detection errors (${report.errors.length})`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: SECURITY_ALERT_FROM,
        to: SECURITY_ALERT_TO,
        subject,
        text: lines.join('\n'),
      }),
    });
    if (!r.ok) {
      console.error(`drift-detection: security email failed (HTTP ${r.status})`);
    }
  } catch (e) {
    console.error('drift-detection: Resend fetch failed', e);
  }
}

// TODO(test-infra): when a test framework (Vitest) lands, add unit tests for
// drift-detection:
//   - RunDriftDetection_ShouldReturnEmptyReport_WhenRegistryEmpty
//   - RunDriftDetection_ShouldReportDrift_WhenLiveDigestDiffersFromRecorded
//     (mock fetch -> manifest HEAD returns Docker-Content-Digest = different sha)
//   - RunDriftDetection_ShouldReportError_WhenManifestFetchFails (HTTP 404 / 500)
//   - RunDriftDetection_ShouldEmailSecurity_WhenDriftsOrErrorsPresent
//     (assert Resend POST body shape)
//   - RunDriftDetection_ShouldNotEmailSecurity_WhenAllEntriesMatch
//     (assert no Resend POST)
//   - ParseImageRef_ShouldHandleTagAndDigestForms
//   - ParseImageRef_ShouldRejectMalformedRefs
//
// TODO(adr-0001-public-key-drift): the cosign-public-key fingerprint drift
// check described in ADR-0001 §3 is NOT yet shipped. When implemented, it
// should run alongside `runDriftDetection` in the same `scheduled` handler so
// both signals propagate through one daily cron + one alerting channel.

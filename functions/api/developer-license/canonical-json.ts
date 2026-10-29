/**
 * Canonical JSON for the signed licence payload, byte for byte what
 * System.Text.Json writes with its default options.
 *
 * STUB: the regression tests are written first against this module; the
 * implementation lands with the fix. Both functions throw until then.
 */

/** The signed payload, typed the way the validator's .NET record is. */
export interface CanonicalLicensePayload {
  LicenseId: string;
  Licensee: string;
  Tier: number;
  /** .NET `DateTimeOffset` form, `yyyy-MM-ddTHH:mm:ss+00:00`. */
  ExpiresAt: string;
  Features: number;
  MaxAgents: number;
  MaxNodes: number;
}

/** A JSON string literal (quotes included) escaped as the default STJ encoder escapes it. */
export function stjString(_s: string): string {
  throw new Error('not implemented');
}

/** The compact canonical payload, in declaration order, as STJ serializes it. */
export function stjCanonical(_payload: CanonicalLicensePayload): string {
  throw new Error('not implemented');
}

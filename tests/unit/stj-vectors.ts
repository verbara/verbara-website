import { readFileSync } from 'node:fs';
import type { CanonicalLicensePayload } from '../../functions/api/developer-license/canonical-json';

// Loader for tests/fixtures/stj-canonical-vectors.json, the System.Text.Json
// golden vectors written by scripts/licence-parity/StjVectors (see its README).
// Inputs are UTF-16 code-unit arrays so lone surrogates survive the file.

export interface StringVector {
  label: string;
  input: number[];
  stj: string;
}

export interface PayloadVector {
  label: string;
  fields: {
    LicenseId: string;
    Licensee: number[];
    Tier: number;
    ExpiresAt: string;
    Features: number;
    MaxAgents: number;
    MaxNodes: number;
  };
  stj: string;
}

export interface StjVectors {
  metadata: { runtime: string; systemTextJson: string; generatedOn: string };
  strings: StringVector[];
  payloads: PayloadVector[];
}

export const vectors = JSON.parse(
  readFileSync(new URL('../fixtures/stj-canonical-vectors.json', import.meta.url), 'utf8'),
) as StjVectors;

/** Rebuilds a string from UTF-16 code units, lone surrogates included. */
export function fromUnits(units: number[]): string {
  return String.fromCharCode(...units);
}

/** The payload a vector was serialized from, with `Licensee` decoded. */
export function payloadOf(v: PayloadVector): CanonicalLicensePayload {
  return { ...v.fields, Licensee: fromUnits(v.fields.Licensee) };
}

export function payloadVector(label: string): PayloadVector {
  const v = vectors.payloads.find((p) => p.label === label);
  if (v === undefined) throw new Error(`no payload vector labelled '${label}'`);
  return v;
}

export function stringVector(label: string): StringVector {
  const v = vectors.strings.find((s) => s.label === label);
  if (v === undefined) throw new Error(`no string vector labelled '${label}'`);
  return v;
}

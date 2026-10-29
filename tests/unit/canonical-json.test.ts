import { describe, expect, it } from 'vitest';
import {
  stjCanonical,
  stjString,
  type CanonicalLicensePayload,
} from '../../functions/api/developer-license/canonical-json';
import { fromUnits, payloadOf, stringVector, vectors } from './stj-vectors';

// The licence validator re-serializes the payload with System.Text.Json's
// default encoder and verifies the signature over those bytes. These tests pin
// the issuer's canonical serializer to STJ's own output (the golden vectors).

describe('STJ golden vectors - the oracle itself', () => {
  it('vectors_ShouldCoverEveryAsciiCodePoint', () => {
    const singles = vectors.strings.filter((v) => v.input.length === 1).map((v) => v.input[0]);
    for (let c = 0; c <= 0x7f; c++) expect(singles).toContain(c);
  });

  it('vectors_ShouldEscapePlusInStrings_WhenStjWritesAString', () => {
    expect(stringVector('licensee plus tag').stj).toBe('"dev\\u002Btrial@example.com"');
  });

  it('vectors_ShouldKeepLiteralPlusInExpiresAt_WhenStjWritesADateTimeOffset', () => {
    expect(vectors.payloads.length).toBeGreaterThanOrEqual(3);
    for (const v of vectors.payloads) {
      expect(v.fields.ExpiresAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+00:00$/);
      expect(v.stj).toContain(`"ExpiresAt":"${v.fields.ExpiresAt}"`);
    }
  });
});

describe('JSON.stringify - the bug (it is not STJ)', () => {
  it('JSONstringify_ShouldDifferFromStj_WhenLicenseeHasCharactersStjEscapes', () => {
    const differing = vectors.strings
      .filter((v) => JSON.stringify(fromUnits(v.input)) !== v.stj)
      .map((v) => v.label);
    expect(differing).toEqual(
      expect.arrayContaining([
        'U+002B',
        'U+0026',
        'U+003C',
        'U+003E',
        'U+0027',
        'U+0022',
        'U+0060',
        'latin1 e acute U+00E9',
        'emoji U+1F600 (surrogate pair)',
        'lone high surrogate U+D83D',
        'lone low surrogate U+DE00',
        'licensee plus tag',
        'licensee plus tag with company',
        'licensee quotes and backslash',
      ]),
    );
    expect(differing).not.toContain('licensee plain ascii');
  });

  it('JSONstringify_ShouldDifferFromStjPayload_ForEveryNonAsciiOrEscapedLicensee', () => {
    const differing = vectors.payloads
      .filter((v) => JSON.stringify(payloadOf(v)) !== v.stj)
      .map((v) => v.label);
    expect(differing.sort()).toEqual(
      [
        'plus tag',
        'plus tag with company',
        'quotes and backslash',
        'emoji company',
        'lone surrogates sanitized to U+FFFD',
        'lone surrogates unsanitized',
        'other integer values',
      ].sort(),
    );
  });
});

describe('stjString - every string vector (A2)', () => {
  it.each(vectors.strings.map((v) => [v.label, v] as const))(
    'stjString_ShouldEqualStjOutput_For %s',
    (_label, v) => {
      expect(stjString(fromUnits(v.input))).toBe(v.stj);
    },
  );
});

describe('stjCanonical - every complete payload vector (A4c)', () => {
  it.each(vectors.payloads.map((v) => [v.label, v] as const))(
    'stjCanonical_ShouldEqualStjBytes_For %s',
    (_label, v) => {
      const canonical = stjCanonical(payloadOf(v));
      expect(Buffer.from(canonical, 'utf8').equals(Buffer.from(v.stj, 'utf8'))).toBe(true);
      expect(canonical).toBe(v.stj);
      expect(canonical).toContain(`"ExpiresAt":"${v.fields.ExpiresAt}"`);
    },
  );
});

describe('stjCanonical - preservation for plain ASCII licensees (A5)', () => {
  // No + & < > ' " ` \ and no control characters: STJ and JSON.stringify agree,
  // so every licence that validated before the fix still validates after it.
  const asciiLicensees = [
    'dev@example.com',
    'dev@example.com (Analytical Engines)',
    'ada.lovelace@example.co.uk (Engines Ltd.)',
    'x_y-z.42@sub.example.io (Team #1, R/D; 100% {ok} [x] ~ ^ | $ * = ? ! @ :)',
  ];

  it('vectors_ShouldMatchJSONstringify_ForThePlainAsciiPayloads', () => {
    for (const label of ['ascii', 'ascii email only', 'company truncated before a surrogate pair']) {
      const v = vectors.payloads.find((p) => p.label === label)!;
      expect(JSON.stringify(payloadOf(v))).toBe(v.stj);
    }
  });

  it.each(asciiLicensees)('stjCanonical_ShouldEqualJSONstringify_ForAsciiLicensee %s', (licensee) => {
    const payload: CanonicalLicensePayload = {
      LicenseId: '00000000-0000-4000-8000-000000000001',
      Licensee: licensee,
      Tier: 1,
      ExpiresAt: '2026-11-27T23:59:59+00:00',
      Features: 4095,
      MaxAgents: 5,
      MaxNodes: 1,
    };
    expect(stjCanonical(payload)).toBe(JSON.stringify(payload));
  });
});

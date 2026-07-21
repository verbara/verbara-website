import { describe, expect, it } from 'vitest';
import {
  validateDigests,
  VERSION_RE,
  DIGEST_RE,
  IMAGE_REF_RE,
  REQUIRED_KEYS,
} from '../../scripts/validate-authorized-digests.mjs';

// A 64-hex-char digest body used across the fixtures.
const HEX64 = 'a'.repeat(64);
const HEX64_B = 'b'.repeat(64);

/** A well-formed `current`/`deprecated` entry; override any field per test. */
function entry(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    platform_version: 'v2.20.0',
    image_ref: 'ghcr.io/verbara/platform/api:v2.20.0',
    manifest_list_digest: `sha256:${HEX64}`,
    released_at: '2026-07-20T13:10:38Z',
    ...overrides,
  };
}

/** A minimal valid document with one current + one deprecated entry. */
function validDoc(): Record<string, unknown> {
  return {
    current: [entry()],
    deprecated: [
      entry({
        platform_version: 'v2.19.0',
        image_ref: 'ghcr.io/verbara/platform/api:v2.19.0',
        manifest_list_digest: `sha256:${HEX64_B}`,
        released_at: '2026-07-14T16:34:29Z',
      }),
    ],
  };
}

describe('validateDigests — happy path', () => {
  it('validateDigests_ShouldReturnNoErrors_WhenDocumentIsWellFormed', () => {
    const result = validateDigests(validDoc());
    expect(result.errors).toEqual([]);
    expect(result.current).toBe(1);
    expect(result.deprecated).toBe(1);
    expect(result.uniqueImageRefs).toBe(2);
  });

  it('validateDigests_ShouldAcceptEmptyGroups_WhenBothArraysEmpty', () => {
    const result = validateDigests({ current: [], deprecated: [] });
    expect(result.errors).toEqual([]);
    expect(result.current).toBe(0);
    expect(result.deprecated).toBe(0);
    expect(result.uniqueImageRefs).toBe(0);
  });

  it('validateDigests_ShouldAcceptRealtimeImageRef_WhenTagMatchesVersion', () => {
    const result = validateDigests({
      current: [
        entry({ image_ref: 'ghcr.io/verbara/platform/realtime:v2.20.0' }),
      ],
      deprecated: [],
    });
    expect(result.errors).toEqual([]);
  });
});

describe('validateDigests — top-level shape', () => {
  it('validateDigests_ShouldReportError_WhenCurrentNotArray', () => {
    const result = validateDigests({ current: {}, deprecated: [] });
    expect(result.errors).toContain('top-level "current" must be an array');
  });

  it('validateDigests_ShouldReportError_WhenDeprecatedMissing', () => {
    const result = validateDigests({ current: [] });
    expect(result.errors).toContain('top-level "deprecated" must be an array');
  });

  it('validateDigests_ShouldReportBothGroups_WhenNeitherIsArray', () => {
    const result = validateDigests({ current: 'x', deprecated: 3 });
    expect(result.errors).toContain('top-level "current" must be an array');
    expect(result.errors).toContain('top-level "deprecated" must be an array');
  });

  it('validateDigests_ShouldReportError_WhenEntryIsNotAnObject', () => {
    const result = validateDigests({ current: ['nope', null], deprecated: [] });
    expect(result.errors).toContain('current[0]: entry must be an object');
    expect(result.errors).toContain('current[1]: entry must be an object');
  });
});

describe('validateDigests — exact-4-keys invariant', () => {
  it('validateDigests_ShouldReportMissingKey_WhenRequiredKeyAbsent', () => {
    const e = entry();
    delete e.released_at;
    const result = validateDigests({ current: [e], deprecated: [] });
    expect(result.errors).toContain('current[0]: missing key "released_at"');
  });

  it('validateDigests_ShouldReportEveryMissingKey_WhenEntryIsEmptyObject', () => {
    const result = validateDigests({ current: [{}], deprecated: [] });
    for (const k of REQUIRED_KEYS) {
      expect(result.errors).toContain(`current[0]: missing key "${k}"`);
    }
  });

  it('validateDigests_ShouldReportUnexpectedKey_WhenExtraKeyPresent', () => {
    const result = validateDigests({
      current: [entry({ extra_field: 'x' })],
      deprecated: [],
    });
    expect(result.errors).toContain('current[0]: unexpected key "extra_field"');
  });

  it('validateDigests_ShouldRequireExactlyFourKeys', () => {
    expect(REQUIRED_KEYS).toHaveLength(4);
    expect(REQUIRED_KEYS).toEqual([
      'platform_version',
      'image_ref',
      'manifest_list_digest',
      'released_at',
    ]);
  });
});

describe('validateDigests — platform_version shape (vX.Y.Z)', () => {
  it('validateDigests_ShouldReportError_WhenVersionMissingVPrefix', () => {
    const result = validateDigests({
      current: [entry({ platform_version: '2.20.0', image_ref: 'ghcr.io/verbara/platform/api:2.20.0' })],
      deprecated: [],
    });
    expect(result.errors).toContain(
      'current[0]: platform_version "2.20.0" must match vX.Y.Z',
    );
  });

  it('validateDigests_ShouldReportError_WhenVersionHasTwoParts', () => {
    const result = validateDigests({
      current: [entry({ platform_version: 'v2.20', image_ref: 'ghcr.io/verbara/platform/api:v2.20' })],
      deprecated: [],
    });
    expect(result.errors).toContain(
      'current[0]: platform_version "v2.20" must match vX.Y.Z',
    );
  });

  it('VERSION_RE_ShouldMatchThreePartSemver_AndRejectOthers', () => {
    expect(VERSION_RE.test('v2.20.0')).toBe(true);
    expect(VERSION_RE.test('v10.4.11')).toBe(true);
    expect(VERSION_RE.test('2.20.0')).toBe(false);
    expect(VERSION_RE.test('v2.20')).toBe(false);
    expect(VERSION_RE.test('v2.20.0-rc1')).toBe(false);
  });
});

describe('validateDigests — image_ref tag must equal version', () => {
  it('validateDigests_ShouldReportError_WhenImageRefTagDiffersFromVersion', () => {
    const result = validateDigests({
      current: [
        entry({
          platform_version: 'v2.20.0',
          image_ref: 'ghcr.io/verbara/platform/api:v2.19.0',
        }),
      ],
      deprecated: [],
    });
    expect(result.errors).toContain(
      'current[0]: image_ref tag "v2.19.0" must equal platform_version "v2.20.0"',
    );
  });

  it('validateDigests_ShouldReportError_WhenImageRefHasWrongRegistry', () => {
    const result = validateDigests({
      current: [entry({ image_ref: 'docker.io/verbara/platform/api:v2.20.0' })],
      deprecated: [],
    });
    expect(result.errors).toContain(
      'current[0]: image_ref "docker.io/verbara/platform/api:v2.20.0" must be ghcr.io/verbara/platform/(api|realtime):<version>',
    );
  });

  it('validateDigests_ShouldReportError_WhenImageRefHasUnknownComponent', () => {
    const result = validateDigests({
      current: [entry({ image_ref: 'ghcr.io/verbara/platform/worker:v2.20.0' })],
      deprecated: [],
    });
    expect(result.errors).toContain(
      'current[0]: image_ref "ghcr.io/verbara/platform/worker:v2.20.0" must be ghcr.io/verbara/platform/(api|realtime):<version>',
    );
  });

  it('IMAGE_REF_RE_ShouldCaptureApiAndRealtimeComponentsAndTag', () => {
    const api = IMAGE_REF_RE.exec('ghcr.io/verbara/platform/api:v3.1.4');
    expect(api?.[1]).toBe('api');
    expect(api?.[2]).toBe('v3.1.4');
    const rt = IMAGE_REF_RE.exec('ghcr.io/verbara/platform/realtime:v3.1.4');
    expect(rt?.[1]).toBe('realtime');
    expect(IMAGE_REF_RE.exec('ghcr.io/other/api:v1.0.0')).toBeNull();
  });
});

describe('validateDigests — manifest_list_digest = sha256:<64 hex>', () => {
  it('validateDigests_ShouldReportError_WhenDigestNotSha256Prefixed', () => {
    const result = validateDigests({
      current: [entry({ manifest_list_digest: HEX64 })],
      deprecated: [],
    });
    expect(result.errors).toContain(
      `current[0]: manifest_list_digest "${HEX64}" must be sha256:<64 hex>`,
    );
  });

  it('validateDigests_ShouldReportError_WhenDigestTooShort', () => {
    const short = 'sha256:abc123';
    const result = validateDigests({
      current: [entry({ manifest_list_digest: short })],
      deprecated: [],
    });
    expect(result.errors).toContain(
      `current[0]: manifest_list_digest "${short}" must be sha256:<64 hex>`,
    );
  });

  it('validateDigests_ShouldReportError_WhenDigestHasUppercaseHex', () => {
    const upper = `sha256:${'A'.repeat(64)}`;
    const result = validateDigests({
      current: [entry({ manifest_list_digest: upper })],
      deprecated: [],
    });
    expect(result.errors).toContain(
      `current[0]: manifest_list_digest "${upper}" must be sha256:<64 hex>`,
    );
  });

  it('DIGEST_RE_ShouldMatchLowercase64Hex_AndRejectOthers', () => {
    expect(DIGEST_RE.test(`sha256:${HEX64}`)).toBe(true);
    expect(DIGEST_RE.test(`sha256:${'0'.repeat(63)}`)).toBe(false);
    expect(DIGEST_RE.test(`sha256:${'0'.repeat(65)}`)).toBe(false);
    expect(DIGEST_RE.test(`sha512:${HEX64}`)).toBe(false);
    expect(DIGEST_RE.test(`sha256:${'g'.repeat(64)}`)).toBe(false);
  });
});

describe('validateDigests — released_at ISO-8601 UTC', () => {
  it('validateDigests_ShouldReportError_WhenReleasedAtHasNoZSuffix', () => {
    const ts = '2026-07-20T13:10:38+00:00';
    const result = validateDigests({
      current: [entry({ released_at: ts })],
      deprecated: [],
    });
    expect(result.errors).toContain(
      `current[0]: released_at "${ts}" must be an ISO-8601 UTC timestamp (…Z)`,
    );
  });

  it('validateDigests_ShouldReportError_WhenReleasedAtIsGarbage', () => {
    const ts = 'not-a-date-Z';
    const result = validateDigests({
      current: [entry({ released_at: ts })],
      deprecated: [],
    });
    expect(result.errors).toContain(
      `current[0]: released_at "${ts}" must be an ISO-8601 UTC timestamp (…Z)`,
    );
  });

  it('validateDigests_ShouldAcceptReleasedAt_WhenValidZuluTimestamp', () => {
    const result = validateDigests({
      current: [entry({ released_at: '2026-01-02T03:04:05Z' })],
      deprecated: [],
    });
    expect(result.errors).toEqual([]);
  });
});

describe('validateDigests — cross-entry invariants', () => {
  it('validateDigests_ShouldReportError_WhenVersionInBothCurrentAndDeprecated', () => {
    const result = validateDigests({
      current: [entry({ platform_version: 'v2.20.0', image_ref: 'ghcr.io/verbara/platform/api:v2.20.0' })],
      deprecated: [entry({ platform_version: 'v2.20.0', image_ref: 'ghcr.io/verbara/platform/realtime:v2.20.0' })],
    });
    expect(result.errors).toContain(
      'version "v2.20.0" appears in BOTH current and deprecated',
    );
  });

  it('validateDigests_ShouldReportError_WhenDuplicateImageRefWithinGroup', () => {
    const ref = 'ghcr.io/verbara/platform/api:v2.20.0';
    const result = validateDigests({
      current: [entry({ image_ref: ref }), entry({ image_ref: ref })],
      deprecated: [],
    });
    expect(result.errors).toContain(
      `current[1]: duplicate image_ref "${ref}" (also at current[0])`,
    );
  });

  it('validateDigests_ShouldReportError_WhenDuplicateImageRefAcrossGroups', () => {
    const ref = 'ghcr.io/verbara/platform/api:v2.20.0';
    const result = validateDigests({
      current: [entry({ image_ref: ref })],
      deprecated: [
        entry({ platform_version: 'v2.20.0', image_ref: ref, manifest_list_digest: `sha256:${HEX64_B}` }),
      ],
    });
    // The image_ref duplicate is reported at deprecated[0], pointing back to current[0].
    expect(result.errors).toContain(
      `deprecated[0]: duplicate image_ref "${ref}" (also at current[0])`,
    );
  });

  it('validateDigests_ShouldNotFlagDistinctImageRefs_AsDuplicates', () => {
    const result = validateDigests({
      current: [
        entry({ image_ref: 'ghcr.io/verbara/platform/api:v2.20.0' }),
        entry({ image_ref: 'ghcr.io/verbara/platform/realtime:v2.20.0' }),
      ],
      deprecated: [],
    });
    const dupErrors = result.errors.filter((e) => e.includes('duplicate image_ref'));
    expect(dupErrors).toEqual([]);
  });
});

describe('validateDigests — accumulates multiple problems', () => {
  it('validateDigests_ShouldCollectAllErrors_WhenEntryViolatesEveryRule', () => {
    const result = validateDigests({
      current: [
        {
          platform_version: 'bad',
          image_ref: 'nope',
          manifest_list_digest: 'nope',
          released_at: 'nope',
        },
      ],
      deprecated: [],
    });
    expect(result.errors.length).toBeGreaterThanOrEqual(4);
    expect(result.errors.some((e) => e.includes('platform_version'))).toBe(true);
    expect(result.errors.some((e) => e.includes('image_ref'))).toBe(true);
    expect(result.errors.some((e) => e.includes('manifest_list_digest'))).toBe(true);
    expect(result.errors.some((e) => e.includes('released_at'))).toBe(true);
  });
});

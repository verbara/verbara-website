import { describe, expect, it } from 'vitest';
import {
  selectAuthorizedDigests,
  loadRegistry,
  MAX_EMBEDDED_DIGESTS,
  type AuthorizedDigestsRegistry,
  type AuthorizedDigestEntry,
} from '../../functions/api/developer-license/authorized-digests';

function mkEntry(version: string, released_at: string): AuthorizedDigestEntry {
  return {
    platform_version: version,
    image_ref: `ghcr.io/verbara/platform/api:${version}`,
    manifest_list_digest: `sha256:${version.replaceAll(/\D/g, '').padEnd(64, '0')}`,
    released_at,
  };
}

function registry(current: AuthorizedDigestEntry[]): AuthorizedDigestsRegistry {
  return { current, deprecated: [] };
}

describe('selectAuthorizedDigests', () => {
  it('selectAuthorizedDigests_ShouldReturnEmpty_WhenCurrentEmpty', () => {
    expect(selectAuthorizedDigests(registry([]))).toEqual([]);
  });

  it('selectAuthorizedDigests_ShouldReturnEmpty_WhenCurrentMissing', () => {
    expect(
      selectAuthorizedDigests({ deprecated: [] } as unknown as AuthorizedDigestsRegistry),
    ).toEqual([]);
  });

  it('selectAuthorizedDigests_ShouldReturnEmpty_WhenCurrentMalformed', () => {
    expect(
      selectAuthorizedDigests({
        current: 'not-an-array',
        deprecated: [],
      } as unknown as AuthorizedDigestsRegistry),
    ).toEqual([]);
  });

  it('selectAuthorizedDigests_ShouldReturnAllDigests_WhenFewerThanCap', () => {
    const reg = registry([
      mkEntry('v1.0.0', '2026-01-01T00:00:00Z'),
      mkEntry('v2.0.0', '2026-02-01T00:00:00Z'),
      mkEntry('v3.0.0', '2026-03-01T00:00:00Z'),
    ]);
    const result = selectAuthorizedDigests(reg);
    expect(result).toHaveLength(3);
    // Newest first.
    expect(result[0]).toBe(mkEntry('v3.0.0', '2026-03-01T00:00:00Z').manifest_list_digest);
    expect(result[2]).toBe(mkEntry('v1.0.0', '2026-01-01T00:00:00Z').manifest_list_digest);
  });

  it('selectAuthorizedDigests_ShouldSortByReleasedAtDesc', () => {
    const reg = registry([
      mkEntry('v1.0.0', '2026-01-01T00:00:00Z'),
      mkEntry('v3.0.0', '2026-03-01T00:00:00Z'),
      mkEntry('v2.0.0', '2026-02-01T00:00:00Z'),
    ]);
    const result = selectAuthorizedDigests(reg);
    expect(result).toEqual([
      mkEntry('v3.0.0', '2026-03-01T00:00:00Z').manifest_list_digest,
      mkEntry('v2.0.0', '2026-02-01T00:00:00Z').manifest_list_digest,
      mkEntry('v1.0.0', '2026-01-01T00:00:00Z').manifest_list_digest,
    ]);
  });

  it('selectAuthorizedDigests_ShouldCapAtMaxEmbedded_WhenMoreThanCap', () => {
    const entries: AuthorizedDigestEntry[] = [];
    for (let i = 1; i <= MAX_EMBEDDED_DIGESTS + 3; i++) {
      const day = String(i).padStart(2, '0');
      entries.push(mkEntry(`v1.0.${i}`, `2026-01-${day}T00:00:00Z`));
    }
    const result = selectAuthorizedDigests(registry(entries));
    expect(result).toHaveLength(MAX_EMBEDDED_DIGESTS);
    // The most-recent (highest day) entry is first.
    expect(result[0]).toBe(mkEntry('v1.0.9', '2026-01-09T00:00:00Z').manifest_list_digest);
  });

  it('selectAuthorizedDigests_ShouldNotMutateInputOrder', () => {
    const entries = [
      mkEntry('v1.0.0', '2026-01-01T00:00:00Z'),
      mkEntry('v2.0.0', '2026-02-01T00:00:00Z'),
    ];
    const before = entries.map((e) => e.platform_version);
    selectAuthorizedDigests(registry(entries));
    expect(entries.map((e) => e.platform_version)).toEqual(before);
  });

  it('MAX_EMBEDDED_DIGESTS_ShouldBeSix', () => {
    expect(MAX_EMBEDDED_DIGESTS).toBe(6);
  });
});

describe('loadRegistry', () => {
  it('loadRegistry_ShouldReturnBundledRegistry_WithCurrentAndDeprecatedArrays', () => {
    const reg = loadRegistry();
    expect(Array.isArray(reg.current)).toBe(true);
    expect(Array.isArray(reg.deprecated)).toBe(true);
  });

  it('loadRegistry_DefaultSelect_ShouldReturnAtMostCap', () => {
    // Using the default (bundled) registry path through selectAuthorizedDigests.
    const result = selectAuthorizedDigests();
    expect(result.length).toBeLessThanOrEqual(MAX_EMBEDDED_DIGESTS);
    for (const d of result) {
      expect(d).toMatch(/^sha256:[0-9a-f]{64}$/);
    }
  });
});

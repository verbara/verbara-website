import { describe, expect, it } from 'vitest';
import { loadRegistry } from '../../functions/api/developer-license/authorized-digests';

// The ledger is read through the production import path (the same module the
// drift-detection cron uses), so a malformed data/authorized-digests.json fails
// here as well as in `npm run validate:digests`.
describe('loadRegistry', () => {
  it('loadRegistry_ShouldReturnBundledRegistry_WithCurrentAndDeprecatedArrays', () => {
    const reg = loadRegistry();
    expect(Array.isArray(reg.current)).toBe(true);
    expect(Array.isArray(reg.deprecated)).toBe(true);
  });

  it('loadRegistry_ShouldExposeManifestListDigests_WhenCurrentHasEntries', () => {
    for (const entry of loadRegistry().current) {
      expect(entry.manifest_list_digest).toMatch(/^sha256:[0-9a-f]{64}$/);
      expect(Number.isNaN(Date.parse(entry.released_at))).toBe(false);
    }
  });
});

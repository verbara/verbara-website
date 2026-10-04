import { describe, expect, it } from 'vitest';
import {
  FEATURES_ALL,
  LICENSE_FEATURES,
} from '../../functions/api/developer-license/license-features';

// Pinned copy of Verbara.Sdk.Pro.Licensing `LicenseFeature` (names, values,
// declaration order). Pro's LicenseValidator returns Invalid unless a
// Developer licence's Features == LicenseFeature.All, so a bit missing here
// makes every free licence Invalid (the 511-vs-4095 defect). This test cannot
// read private Pro; the cross-repo comparison with LicenseFeature.cs is the
// verbara-meta drift check. Changing this table is a deliberate, reviewed act.
const PRO_LICENSE_FEATURE = [
  ['Cluster', 1],
  ['Dialer', 2],
  ['EventStore', 4],
  ['Analytics', 8],
  ['MultiTenant', 16],
  ['Routing', 32],
  ['AgentAssist', 64],
  ['CallAnalytics', 128],
  ['Realtime', 256],
  ['AdvancedTypification', 512],
  ['TypificationAi', 1024],
  ['CsatRunner', 2048],
] as const;

describe('LICENSE_FEATURES', () => {
  it('LICENSE_FEATURES_ShouldMatchProLicenseFeature_ByNameValueAndOrder', () => {
    expect(Object.entries(LICENSE_FEATURES)).toEqual(PRO_LICENSE_FEATURE.map(([n, v]) => [n, v]));
  });

  it('LICENSE_FEATURES_ShouldBeDistinctSingleBits', () => {
    const values = Object.values(LICENSE_FEATURES);
    expect(new Set(values).size).toBe(values.length);
    for (const v of values) expect(v > 0 && (v & (v - 1)) === 0).toBe(true);
  });

  it('FEATURES_ALL_ShouldEqualProLicenseFeatureAll_WhenAllTwelveBitsAreOred', () => {
    expect(FEATURES_ALL).toBe(4095);
    expect(FEATURES_ALL).toBe(PRO_LICENSE_FEATURE.reduce((all, [, v]) => all | v, 0));
  });
});

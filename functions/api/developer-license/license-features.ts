/**
 * Pro licence feature bits, mirrored BY NAME from Verbara.Sdk.Pro.Licensing's
 * `LicenseFeature` [Flags] enum.
 *
 * Why this exists: Pro's `LicenseValidator` rejects (returns Invalid) any
 * licence whose `Features` is not exactly
 * `FeatureRegistry.GetCanonicalFeaturesForTier(Tier)`, and for the Developer
 * tier (Tier 0.5) that is `LicenseFeature.All`. The issuer used to hard-code
 * `511` (the first 9 bits); Pro has since grown to 12 bits (`All` = 4095), so
 * every free licence came out Invalid. Listing each bit by name — and deriving
 * `FEATURES_ALL` from the list instead of typing a number — makes a missing or
 * renamed bit visible in review, in `tests/unit/license-features.test.ts`, and
 * to the cross-repo drift check that compares this table with Pro's enum.
 *
 * Keep the entries in the enum's declaration order, one `Name: 1 << n` per
 * line, so the table can be compared mechanically with `LicenseFeature.cs`.
 * When Pro adds a bit: add it here AND update the pinned test; the Developer
 * tier's canonical set is `All`, so the new bit must be signed too.
 */
export const LICENSE_FEATURES = {
  Cluster: 1 << 0,
  Dialer: 1 << 1,
  EventStore: 1 << 2,
  Analytics: 1 << 3,
  MultiTenant: 1 << 4,
  Routing: 1 << 5,
  AgentAssist: 1 << 6,
  CallAnalytics: 1 << 7,
  Realtime: 1 << 8,
  AdvancedTypification: 1 << 9,
  TypificationAi: 1 << 10,
  CsatRunner: 1 << 11,
} as const;

export type LicenseFeatureName = keyof typeof LICENSE_FEATURES;

/** Bitwise OR of every entry above — Pro's `LicenseFeature.All`. */
export const FEATURES_ALL: number = Object.values(LICENSE_FEATURES).reduce(
  (all, bit) => all | bit,
  0,
);

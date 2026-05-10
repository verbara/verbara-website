// Shared types for the pricing composites (TierCard, TierGroup, ComparisonMatrix).
// Centralized so adding a new tier requires one edit, not three.

export type TierId =
  | 'tier_0'
  | 'tier_05'
  | 'tier_1'
  | 'tier_2'
  | 'tier_3'
  | 'tier_4'
  | 'tier_5';

export type CtaKind = 'community' | 'developer' | 'buy' | 'sales';

export type BadgeKind = 'popular' | 'evaluators' | null;

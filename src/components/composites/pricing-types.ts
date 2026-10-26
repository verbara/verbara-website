// Shared types for the pricing composites (TierCard, TierGroup, ComparisonMatrix).
// Centralized so adding a new tier requires one edit, not three.

// Licence tiers (ADR-0010 numbering: Tier 3 and Tier 4 were hosted tiers and are
// retired — Verbara is self-hosted software only; Tier 5 keeps its number).
export type LicenceTierId =
  | 'tier_0'
  | 'tier_05'
  | 'tier_1'
  | 'tier_2'
  | 'tier_5';

// Support plans for the software: they promise response times, never uptime.
export type SupportPlanId = 'support_business' | 'support_enterprise';

// Anything a pricing card can render.
export type TierId = LicenceTierId | SupportPlanId;

export type CtaKind = 'community' | 'developer' | 'buy' | 'sales';

export type BadgeKind = 'popular' | 'evaluators' | null;

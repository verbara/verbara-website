-- Migration 0001: license_audit table.
--
-- Append-only ledger of every Tier 0.5 Pro Developer license issuance.
-- The Pages Function INSERTs one row per successful issuance; the table is
-- never UPDATEd. UNIQUE on email is the dedup key (1 license per email per
-- 30-day window — older rows beyond the window are tolerated).
--
-- Apply with:  npx wrangler d1 migrations apply verbara-license-audit --remote

CREATE TABLE IF NOT EXISTS license_audit (
  request_id  TEXT    PRIMARY KEY,
  issued_at   TEXT    NOT NULL,                  -- ISO 8601 UTC
  license_id  TEXT    NOT NULL UNIQUE,
  email       TEXT    NOT NULL,
  full_name   TEXT    NOT NULL,
  company     TEXT,
  use_case    TEXT,
  tier        INTEGER NOT NULL,                  -- 1 = LicenseTier.Developer
  features    INTEGER NOT NULL,                  -- 511 = LicenseFeature.All
  max_agents  INTEGER NOT NULL,                  -- 5 for Tier 0.5
  max_nodes   INTEGER NOT NULL,                  -- 1 for Tier 0.5
  expires_at  TEXT    NOT NULL,                  -- ISO 8601 UTC
  source_ip   TEXT,
  user_agent  TEXT
);

CREATE INDEX IF NOT EXISTS idx_license_audit_email      ON license_audit(email);
CREATE INDEX IF NOT EXISTS idx_license_audit_issued_at  ON license_audit(issued_at DESC);

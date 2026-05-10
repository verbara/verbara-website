-- Migration 0002: track which authorized image digests were embedded in each
-- issued license.
--
-- Phase 2.2 of the Pro v2.3.x image-binding execution plan
-- (Verbara.Sdk.Pro/docs/plans/active/2026-05-09-pro-v23x-image-binding-execution.md).
--
-- Stored as a JSON array string (TEXT) — SQLite has no native array type and
-- D1's JSON1 functions can query it later if needed. Empty registry → empty
-- JSON array '[]' is recorded so the audit trail is unambiguous (NOT NULL
-- with default keeps the column shape consistent across rows pre/post the
-- registry having entries).
--
-- The column is additive and back-compat: existing rows get the default '[]'
-- value automatically (SQLite does not require an UPDATE backfill for ADD
-- COLUMN with DEFAULT).
--
-- Apply with:  npx wrangler d1 migrations apply verbara-license-audit --remote

ALTER TABLE license_audit
  ADD COLUMN authorized_image_digests TEXT NOT NULL DEFAULT '[]';

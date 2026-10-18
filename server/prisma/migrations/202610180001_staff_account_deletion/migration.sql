-- Keep audit identity snapshots immutable when a staff account is removed.
-- The old SET NULL foreign key attempted to update audit rows on account deletion,
-- which conflicted with university_audit_immutable. Historical IDs and all audit
-- fields remain intact; the append-only trigger is deliberately unchanged.
ALTER TABLE "admin_security_events"
  DROP CONSTRAINT "admin_security_events_userId_fkey";

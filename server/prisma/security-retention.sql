-- Run with a separate database-owner connection, never through the application API.
-- Back up the database first. The retention policy has a 90-day minimum.
BEGIN;
ALTER TABLE admin_security_events DISABLE TRIGGER university_audit_immutable;
DELETE FROM admin_security_events
 WHERE "createdAt" < CURRENT_TIMESTAMP - make_interval(days => (
   SELECT greatest(90, "retentionDays") FROM admin_security_policy WHERE id = 1
 ));
ALTER TABLE admin_security_events ENABLE TRIGGER university_audit_immutable;
INSERT INTO admin_security_events (id, category, event, success, description)
 VALUES (gen_random_uuid()::text, 'security', 'audit_retention_maintenance', true, 'Database owner applied configured security audit retention policy');
DELETE FROM admin_auth_sessions WHERE "expiresAt" < CURRENT_TIMESTAMP - INTERVAL '7 days';
DELETE FROM admin_oauth_states WHERE "expiresAt" < CURRENT_TIMESTAMP - INTERVAL '1 day';
DELETE FROM admin_login_throttles WHERE "expiresAt" < CURRENT_TIMESTAMP;
DELETE FROM user_authenticators WHERE enabled = false AND "pendingUntil" < CURRENT_TIMESTAMP - INTERVAL '1 day';
COMMIT;

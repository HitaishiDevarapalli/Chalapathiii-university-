const fs = require('node:fs');
const cp = require('node:child_process');
const { PERMISSIONS } = require('../dist/security/core');
const directory = 'prisma/migrations/202610160001_admin_security';
fs.mkdirSync(directory, { recursive: true });
const sql = cp.execFileSync(process.execPath, ['node_modules/prisma/build/index.js', 'migrate', 'diff', '--from-schema-datamodel', 'work/security-old-schema.prisma', '--to-schema-datamodel', 'prisma/schema.prisma', '--script'], { encoding: 'utf8' });
const quote = text => "'" + text.replace(/'/g, "''") + "'";
let extra = [
 '-- Preserve previously trusted administrators during the tested credential transition.',
 'UPDATE "admin_users" SET "credentialMode" = \'legacy\', "mustChangePassword" = false, "requireGoogle" = false, "requireTotp" = false, "role" = \'superadmin\' WHERE "role" IN (\'admin\', \'superadmin\');',
 'INSERT INTO "admin_permissions" ("key", "module", "action") VALUES ' + PERMISSIONS.map(key => { const [module, action] = key.split('.'); return '(' + [key, module, action].map(quote).join(', ') + ')'; }).join(',\n') + ';',
 'INSERT INTO "admin_roles" ("id", "name", "description", "system", "updatedAt") VALUES',
 "('administrative-admin', 'Administrative Admin', 'Default-deny role; assign specific permissions.', true, CURRENT_TIMESTAMP),",
 "('admissions-staff', 'Admissions Staff', 'Admissions enquiries and applications.', true, CURRENT_TIMESTAMP),",
 "('content-manager', 'Content Manager', 'University content editing and publication.', true, CURRENT_TIMESTAMP);",
].join('\n');
const admissions = ['dashboard.view', 'admissions.view', ...['enquiries', 'applications'].flatMap(module => ['view', 'edit', 'export'].map(action => module + '.' + action))];
const content = ['dashboard.view', ...['pages', 'homepage', 'about', 'academics', 'certifications', 'research', 'directories', 'campus-life', 'placements', 'news', 'events', 'announcements', 'gallery', 'footer', 'links', 'popup'].flatMap(module => ['view', 'create', 'edit', 'delete', 'publish', 'manage'].map(action => module + '.' + action))];
for (const [roleId, keys] of [['admissions-staff', admissions], ['content-manager', content]]) extra += '\nINSERT INTO "admin_role_permissions" ("roleId", "permissionKey") VALUES ' + keys.map(key => '(' + quote(roleId) + ', ' + quote(key) + ')').join(', ') + ';\n';
extra += '\nCREATE UNIQUE INDEX admin_users_normalized_username_idx ON admin_users (lower(username));\n' +
  'CREATE UNIQUE INDEX admin_users_normalized_email_idx ON admin_users (lower(email));\n' +
  'CREATE UNIQUE INDEX admin_google_normalized_email_idx ON authorized_google_accounts (lower(email));\n' +
  '\nINSERT INTO "admin_security_policy" ("id", "updatedAt") VALUES (1, CURRENT_TIMESTAMP);\n' +
  '-- Audit records are append-only; retention requires a separate database-owner maintenance connection.\n' +
  "CREATE FUNCTION university_protect_audit_events() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Security audit records are append-only'; END; $$;\n" +
  'CREATE TRIGGER university_audit_immutable BEFORE UPDATE OR DELETE ON "admin_security_events" FOR EACH ROW EXECUTE FUNCTION university_protect_audit_events();\n';
fs.writeFileSync(directory + '/migration.sql', 'BEGIN;\n' + sql + extra + '\nCOMMIT;\n');
console.log('Created additive security migration and permission catalog.');

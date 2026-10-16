BEGIN;
-- AlterTable
ALTER TABLE "admin_users" ADD COLUMN     "credentialMode" TEXT NOT NULL DEFAULT 'secured',
ADD COLUMN     "email" TEXT,
ADD COLUMN     "lastLoginAt" TIMESTAMPTZ(3),
ADD COLUMN     "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "requireGoogle" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "requireTotp" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "roleId" TEXT,
ADD COLUMN     "securityVersion" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Active',
ADD COLUMN     "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "admin_roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "system" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "admin_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_permissions" (
    "key" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "action" TEXT NOT NULL,

    CONSTRAINT "admin_permissions_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "admin_role_permissions" (
    "roleId" TEXT NOT NULL,
    "permissionKey" TEXT NOT NULL,

    CONSTRAINT "admin_role_permissions_pkey" PRIMARY KEY ("roleId","permissionKey")
);

-- CreateTable
CREATE TABLE "admin_user_permissions" (
    "userId" INTEGER NOT NULL,
    "permissionKey" TEXT NOT NULL,
    "allowed" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "admin_user_permissions_pkey" PRIMARY KEY ("userId","permissionKey")
);

-- CreateTable
CREATE TABLE "authorized_google_accounts" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT,
    "userId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "requireTotp" BOOLEAN NOT NULL DEFAULT true,
    "verifiedAt" TIMESTAMPTZ(3),
    "lastLoginAt" TIMESTAMPTZ(3),
    "addedBy" INTEGER,
    "modifiedBy" INTEGER,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "authorized_google_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_authenticators" (
    "userId" INTEGER NOT NULL,
    "secretBox" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "enrolledAt" TIMESTAMPTZ(3),
    "pendingUntil" TIMESTAMPTZ(3),
    "lastCounter" BIGINT NOT NULL DEFAULT -1,

    CONSTRAINT "user_authenticators_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "admin_recovery_codes" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "codeHash" TEXT NOT NULL,
    "usedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_recovery_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_auth_sessions" (
    "id" TEXT NOT NULL,
    "userId" INTEGER,
    "dataJson" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "lastSeenAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMPTZ(3),

    CONSTRAINT "admin_auth_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_security_events" (
    "id" TEXT NOT NULL,
    "userId" INTEGER,
    "username" TEXT,
    "email" TEXT,
    "role" TEXT,
    "category" TEXT NOT NULL DEFAULT 'security',
    "event" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT,
    "userAgent" TEXT,
    "target" TEXT,
    "description" TEXT NOT NULL,
    "sessionId" TEXT,

    CONSTRAINT "admin_security_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_login_throttles" (
    "key" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "admin_login_throttles_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "admin_oauth_states" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "sessionHash" TEXT NOT NULL,
    "nonceHash" TEXT NOT NULL,
    "verifierBox" TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "consumedAt" TIMESTAMPTZ(3),

    CONSTRAINT "admin_oauth_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_security_policy" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "requireGoogle" BOOLEAN NOT NULL DEFAULT true,
    "requireTotp" BOOLEAN NOT NULL DEFAULT true,
    "idleMinutes" INTEGER NOT NULL DEFAULT 30,
    "sessionHours" INTEGER NOT NULL DEFAULT 12,
    "maxAttempts" INTEGER NOT NULL DEFAULT 8,
    "lockoutMinutes" INTEGER NOT NULL DEFAULT 15,
    "retentionDays" INTEGER NOT NULL DEFAULT 365,
    "transitionCompletedAt" TIMESTAMPTZ(3),
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "admin_security_policy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_roles_name_key" ON "admin_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "admin_permissions_module_action_key" ON "admin_permissions"("module", "action");

-- CreateIndex
CREATE UNIQUE INDEX "authorized_google_accounts_email_key" ON "authorized_google_accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "authorized_google_accounts_subject_key" ON "authorized_google_accounts"("subject");

-- CreateIndex
CREATE INDEX "authorized_google_accounts_userId_status_idx" ON "authorized_google_accounts"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "admin_recovery_codes_codeHash_key" ON "admin_recovery_codes"("codeHash");

-- CreateIndex
CREATE INDEX "admin_recovery_codes_userId_usedAt_idx" ON "admin_recovery_codes"("userId", "usedAt");

-- CreateIndex
CREATE INDEX "admin_auth_sessions_userId_revokedAt_idx" ON "admin_auth_sessions"("userId", "revokedAt");

-- CreateIndex
CREATE INDEX "admin_auth_sessions_expiresAt_idx" ON "admin_auth_sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "admin_security_events_createdAt_id_idx" ON "admin_security_events"("createdAt", "id");

-- CreateIndex
CREATE INDEX "admin_security_events_userId_createdAt_idx" ON "admin_security_events"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "admin_security_events_event_success_createdAt_idx" ON "admin_security_events"("event", "success", "createdAt");

-- CreateIndex
CREATE INDEX "admin_security_events_email_createdAt_idx" ON "admin_security_events"("email", "createdAt");

-- CreateIndex
CREATE INDEX "admin_login_throttles_expiresAt_idx" ON "admin_login_throttles"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- AddForeignKey
ALTER TABLE "admin_users" ADD CONSTRAINT "admin_users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "admin_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_role_permissions" ADD CONSTRAINT "admin_role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "admin_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_role_permissions" ADD CONSTRAINT "admin_role_permissions_permissionKey_fkey" FOREIGN KEY ("permissionKey") REFERENCES "admin_permissions"("key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_user_permissions" ADD CONSTRAINT "admin_user_permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "admin_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_user_permissions" ADD CONSTRAINT "admin_user_permissions_permissionKey_fkey" FOREIGN KEY ("permissionKey") REFERENCES "admin_permissions"("key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authorized_google_accounts" ADD CONSTRAINT "authorized_google_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_authenticators" ADD CONSTRAINT "user_authenticators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_recovery_codes" ADD CONSTRAINT "admin_recovery_codes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_auth_sessions" ADD CONSTRAINT "admin_auth_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_security_events" ADD CONSTRAINT "admin_security_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Preserve previously trusted administrators during the tested credential transition.
UPDATE "admin_users" SET "credentialMode" = 'legacy', "mustChangePassword" = false, "requireGoogle" = false, "requireTotp" = false, "role" = 'superadmin' WHERE "role" IN ('admin', 'superadmin');
INSERT INTO "admin_permissions" ("key", "module", "action") VALUES ('dashboard.view', 'dashboard', 'view'),
('dashboard.create', 'dashboard', 'create'),
('dashboard.edit', 'dashboard', 'edit'),
('dashboard.delete', 'dashboard', 'delete'),
('dashboard.publish', 'dashboard', 'publish'),
('dashboard.export', 'dashboard', 'export'),
('dashboard.manage', 'dashboard', 'manage'),
('pages.view', 'pages', 'view'),
('pages.create', 'pages', 'create'),
('pages.edit', 'pages', 'edit'),
('pages.delete', 'pages', 'delete'),
('pages.publish', 'pages', 'publish'),
('pages.export', 'pages', 'export'),
('pages.manage', 'pages', 'manage'),
('homepage.view', 'homepage', 'view'),
('homepage.create', 'homepage', 'create'),
('homepage.edit', 'homepage', 'edit'),
('homepage.delete', 'homepage', 'delete'),
('homepage.publish', 'homepage', 'publish'),
('homepage.export', 'homepage', 'export'),
('homepage.manage', 'homepage', 'manage'),
('about.view', 'about', 'view'),
('about.create', 'about', 'create'),
('about.edit', 'about', 'edit'),
('about.delete', 'about', 'delete'),
('about.publish', 'about', 'publish'),
('about.export', 'about', 'export'),
('about.manage', 'about', 'manage'),
('academics.view', 'academics', 'view'),
('academics.create', 'academics', 'create'),
('academics.edit', 'academics', 'edit'),
('academics.delete', 'academics', 'delete'),
('academics.publish', 'academics', 'publish'),
('academics.export', 'academics', 'export'),
('academics.manage', 'academics', 'manage'),
('certifications.view', 'certifications', 'view'),
('certifications.create', 'certifications', 'create'),
('certifications.edit', 'certifications', 'edit'),
('certifications.delete', 'certifications', 'delete'),
('certifications.publish', 'certifications', 'publish'),
('certifications.export', 'certifications', 'export'),
('certifications.manage', 'certifications', 'manage'),
('admissions.view', 'admissions', 'view'),
('admissions.create', 'admissions', 'create'),
('admissions.edit', 'admissions', 'edit'),
('admissions.delete', 'admissions', 'delete'),
('admissions.publish', 'admissions', 'publish'),
('admissions.export', 'admissions', 'export'),
('admissions.manage', 'admissions', 'manage'),
('enquiries.view', 'enquiries', 'view'),
('enquiries.create', 'enquiries', 'create'),
('enquiries.edit', 'enquiries', 'edit'),
('enquiries.delete', 'enquiries', 'delete'),
('enquiries.publish', 'enquiries', 'publish'),
('enquiries.export', 'enquiries', 'export'),
('enquiries.manage', 'enquiries', 'manage'),
('applications.view', 'applications', 'view'),
('applications.create', 'applications', 'create'),
('applications.edit', 'applications', 'edit'),
('applications.delete', 'applications', 'delete'),
('applications.publish', 'applications', 'publish'),
('applications.export', 'applications', 'export'),
('applications.manage', 'applications', 'manage'),
('research.view', 'research', 'view'),
('research.create', 'research', 'create'),
('research.edit', 'research', 'edit'),
('research.delete', 'research', 'delete'),
('research.publish', 'research', 'publish'),
('research.export', 'research', 'export'),
('research.manage', 'research', 'manage'),
('directories.view', 'directories', 'view'),
('directories.create', 'directories', 'create'),
('directories.edit', 'directories', 'edit'),
('directories.delete', 'directories', 'delete'),
('directories.publish', 'directories', 'publish'),
('directories.export', 'directories', 'export'),
('directories.manage', 'directories', 'manage'),
('campus-life.view', 'campus-life', 'view'),
('campus-life.create', 'campus-life', 'create'),
('campus-life.edit', 'campus-life', 'edit'),
('campus-life.delete', 'campus-life', 'delete'),
('campus-life.publish', 'campus-life', 'publish'),
('campus-life.export', 'campus-life', 'export'),
('campus-life.manage', 'campus-life', 'manage'),
('placements.view', 'placements', 'view'),
('placements.create', 'placements', 'create'),
('placements.edit', 'placements', 'edit'),
('placements.delete', 'placements', 'delete'),
('placements.publish', 'placements', 'publish'),
('placements.export', 'placements', 'export'),
('placements.manage', 'placements', 'manage'),
('news.view', 'news', 'view'),
('news.create', 'news', 'create'),
('news.edit', 'news', 'edit'),
('news.delete', 'news', 'delete'),
('news.publish', 'news', 'publish'),
('news.export', 'news', 'export'),
('news.manage', 'news', 'manage'),
('events.view', 'events', 'view'),
('events.create', 'events', 'create'),
('events.edit', 'events', 'edit'),
('events.delete', 'events', 'delete'),
('events.publish', 'events', 'publish'),
('events.export', 'events', 'export'),
('events.manage', 'events', 'manage'),
('announcements.view', 'announcements', 'view'),
('announcements.create', 'announcements', 'create'),
('announcements.edit', 'announcements', 'edit'),
('announcements.delete', 'announcements', 'delete'),
('announcements.publish', 'announcements', 'publish'),
('announcements.export', 'announcements', 'export'),
('announcements.manage', 'announcements', 'manage'),
('contact.view', 'contact', 'view'),
('contact.create', 'contact', 'create'),
('contact.edit', 'contact', 'edit'),
('contact.delete', 'contact', 'delete'),
('contact.publish', 'contact', 'publish'),
('contact.export', 'contact', 'export'),
('contact.manage', 'contact', 'manage'),
('contacts.view', 'contacts', 'view'),
('contacts.create', 'contacts', 'create'),
('contacts.edit', 'contacts', 'edit'),
('contacts.delete', 'contacts', 'delete'),
('contacts.publish', 'contacts', 'publish'),
('contacts.export', 'contacts', 'export'),
('contacts.manage', 'contacts', 'manage'),
('gallery.view', 'gallery', 'view'),
('gallery.create', 'gallery', 'create'),
('gallery.edit', 'gallery', 'edit'),
('gallery.delete', 'gallery', 'delete'),
('gallery.publish', 'gallery', 'publish'),
('gallery.export', 'gallery', 'export'),
('gallery.manage', 'gallery', 'manage'),
('footer.view', 'footer', 'view'),
('footer.create', 'footer', 'create'),
('footer.edit', 'footer', 'edit'),
('footer.delete', 'footer', 'delete'),
('footer.publish', 'footer', 'publish'),
('footer.export', 'footer', 'export'),
('footer.manage', 'footer', 'manage'),
('settings.view', 'settings', 'view'),
('settings.create', 'settings', 'create'),
('settings.edit', 'settings', 'edit'),
('settings.delete', 'settings', 'delete'),
('settings.publish', 'settings', 'publish'),
('settings.export', 'settings', 'export'),
('settings.manage', 'settings', 'manage'),
('links.view', 'links', 'view'),
('links.create', 'links', 'create'),
('links.edit', 'links', 'edit'),
('links.delete', 'links', 'delete'),
('links.publish', 'links', 'publish'),
('links.export', 'links', 'export'),
('links.manage', 'links', 'manage'),
('popup.view', 'popup', 'view'),
('popup.create', 'popup', 'create'),
('popup.edit', 'popup', 'edit'),
('popup.delete', 'popup', 'delete'),
('popup.publish', 'popup', 'publish'),
('popup.export', 'popup', 'export'),
('popup.manage', 'popup', 'manage'),
('backup.view', 'backup', 'view'),
('backup.create', 'backup', 'create'),
('backup.edit', 'backup', 'edit'),
('backup.delete', 'backup', 'delete'),
('backup.publish', 'backup', 'publish'),
('backup.export', 'backup', 'export'),
('backup.manage', 'backup', 'manage'),
('users.view', 'users', 'view'),
('users.create', 'users', 'create'),
('users.edit', 'users', 'edit'),
('users.delete', 'users', 'delete'),
('users.publish', 'users', 'publish'),
('users.export', 'users', 'export'),
('users.manage', 'users', 'manage'),
('roles.view', 'roles', 'view'),
('roles.create', 'roles', 'create'),
('roles.edit', 'roles', 'edit'),
('roles.delete', 'roles', 'delete'),
('roles.publish', 'roles', 'publish'),
('roles.export', 'roles', 'export'),
('roles.manage', 'roles', 'manage'),
('google.view', 'google', 'view'),
('google.create', 'google', 'create'),
('google.edit', 'google', 'edit'),
('google.delete', 'google', 'delete'),
('google.publish', 'google', 'publish'),
('google.export', 'google', 'export'),
('google.manage', 'google', 'manage'),
('audit.view', 'audit', 'view'),
('audit.create', 'audit', 'create'),
('audit.edit', 'audit', 'edit'),
('audit.delete', 'audit', 'delete'),
('audit.publish', 'audit', 'publish'),
('audit.export', 'audit', 'export'),
('audit.manage', 'audit', 'manage'),
('security.view', 'security', 'view'),
('security.create', 'security', 'create'),
('security.edit', 'security', 'edit'),
('security.delete', 'security', 'delete'),
('security.publish', 'security', 'publish'),
('security.export', 'security', 'export'),
('security.manage', 'security', 'manage'),
('sessions.view', 'sessions', 'view'),
('sessions.create', 'sessions', 'create'),
('sessions.edit', 'sessions', 'edit'),
('sessions.delete', 'sessions', 'delete'),
('sessions.publish', 'sessions', 'publish'),
('sessions.export', 'sessions', 'export'),
('sessions.manage', 'sessions', 'manage'),
('mfa.view', 'mfa', 'view'),
('mfa.create', 'mfa', 'create'),
('mfa.edit', 'mfa', 'edit'),
('mfa.delete', 'mfa', 'delete'),
('mfa.publish', 'mfa', 'publish'),
('mfa.export', 'mfa', 'export'),
('mfa.manage', 'mfa', 'manage');
INSERT INTO "admin_roles" ("id", "name", "description", "system", "updatedAt") VALUES
('administrative-admin', 'Administrative Admin', 'Default-deny role; assign specific permissions.', true, CURRENT_TIMESTAMP),
('admissions-staff', 'Admissions Staff', 'Admissions enquiries and applications.', true, CURRENT_TIMESTAMP),
('content-manager', 'Content Manager', 'University content editing and publication.', true, CURRENT_TIMESTAMP);
INSERT INTO "admin_role_permissions" ("roleId", "permissionKey") VALUES ('admissions-staff', 'dashboard.view'), ('admissions-staff', 'admissions.view'), ('admissions-staff', 'enquiries.view'), ('admissions-staff', 'enquiries.edit'), ('admissions-staff', 'enquiries.export'), ('admissions-staff', 'applications.view'), ('admissions-staff', 'applications.edit'), ('admissions-staff', 'applications.export');

INSERT INTO "admin_role_permissions" ("roleId", "permissionKey") VALUES ('content-manager', 'dashboard.view'), ('content-manager', 'pages.view'), ('content-manager', 'pages.create'), ('content-manager', 'pages.edit'), ('content-manager', 'pages.delete'), ('content-manager', 'pages.publish'), ('content-manager', 'pages.manage'), ('content-manager', 'homepage.view'), ('content-manager', 'homepage.create'), ('content-manager', 'homepage.edit'), ('content-manager', 'homepage.delete'), ('content-manager', 'homepage.publish'), ('content-manager', 'homepage.manage'), ('content-manager', 'about.view'), ('content-manager', 'about.create'), ('content-manager', 'about.edit'), ('content-manager', 'about.delete'), ('content-manager', 'about.publish'), ('content-manager', 'about.manage'), ('content-manager', 'academics.view'), ('content-manager', 'academics.create'), ('content-manager', 'academics.edit'), ('content-manager', 'academics.delete'), ('content-manager', 'academics.publish'), ('content-manager', 'academics.manage'), ('content-manager', 'certifications.view'), ('content-manager', 'certifications.create'), ('content-manager', 'certifications.edit'), ('content-manager', 'certifications.delete'), ('content-manager', 'certifications.publish'), ('content-manager', 'certifications.manage'), ('content-manager', 'research.view'), ('content-manager', 'research.create'), ('content-manager', 'research.edit'), ('content-manager', 'research.delete'), ('content-manager', 'research.publish'), ('content-manager', 'research.manage'), ('content-manager', 'directories.view'), ('content-manager', 'directories.create'), ('content-manager', 'directories.edit'), ('content-manager', 'directories.delete'), ('content-manager', 'directories.publish'), ('content-manager', 'directories.manage'), ('content-manager', 'campus-life.view'), ('content-manager', 'campus-life.create'), ('content-manager', 'campus-life.edit'), ('content-manager', 'campus-life.delete'), ('content-manager', 'campus-life.publish'), ('content-manager', 'campus-life.manage'), ('content-manager', 'placements.view'), ('content-manager', 'placements.create'), ('content-manager', 'placements.edit'), ('content-manager', 'placements.delete'), ('content-manager', 'placements.publish'), ('content-manager', 'placements.manage'), ('content-manager', 'news.view'), ('content-manager', 'news.create'), ('content-manager', 'news.edit'), ('content-manager', 'news.delete'), ('content-manager', 'news.publish'), ('content-manager', 'news.manage'), ('content-manager', 'events.view'), ('content-manager', 'events.create'), ('content-manager', 'events.edit'), ('content-manager', 'events.delete'), ('content-manager', 'events.publish'), ('content-manager', 'events.manage'), ('content-manager', 'announcements.view'), ('content-manager', 'announcements.create'), ('content-manager', 'announcements.edit'), ('content-manager', 'announcements.delete'), ('content-manager', 'announcements.publish'), ('content-manager', 'announcements.manage'), ('content-manager', 'gallery.view'), ('content-manager', 'gallery.create'), ('content-manager', 'gallery.edit'), ('content-manager', 'gallery.delete'), ('content-manager', 'gallery.publish'), ('content-manager', 'gallery.manage'), ('content-manager', 'footer.view'), ('content-manager', 'footer.create'), ('content-manager', 'footer.edit'), ('content-manager', 'footer.delete'), ('content-manager', 'footer.publish'), ('content-manager', 'footer.manage'), ('content-manager', 'links.view'), ('content-manager', 'links.create'), ('content-manager', 'links.edit'), ('content-manager', 'links.delete'), ('content-manager', 'links.publish'), ('content-manager', 'links.manage'), ('content-manager', 'popup.view'), ('content-manager', 'popup.create'), ('content-manager', 'popup.edit'), ('content-manager', 'popup.delete'), ('content-manager', 'popup.publish'), ('content-manager', 'popup.manage');

CREATE UNIQUE INDEX admin_users_normalized_username_idx ON admin_users (lower(username));
CREATE UNIQUE INDEX admin_users_normalized_email_idx ON admin_users (lower(email));
CREATE UNIQUE INDEX admin_google_normalized_email_idx ON authorized_google_accounts (lower(email));

INSERT INTO "admin_security_policy" ("id", "updatedAt") VALUES (1, CURRENT_TIMESTAMP);
-- Audit records are append-only; retention requires a separate database-owner maintenance connection.
CREATE FUNCTION university_protect_audit_events() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Security audit records are append-only'; END; $$;
CREATE TRIGGER university_audit_immutable BEFORE UPDATE OR DELETE ON "admin_security_events" FOR EACH ROW EXECUTE FUNCTION university_protect_audit_events();

COMMIT;

# Authorization & Security: implementation and operations

## Inspected architecture and existing authentication

The public site and admin portal use React 19, Vite 5, React Router, and the existing DataContext/CMS editors. The VPS serves `dist` from `/var/www/chalapathi` through Nginx and proxies `/api` and `/uploads` to the Express server on port 5004. The production PM2 configuration explicitly sets `PORT=5004`; local development defaults to port 5000. The production data model is `server/prisma/schema.prisma`, PostgreSQL with Prisma 5. The root SQLite/Prisma 7 schema and old serverless handlers are a separate historical deployment path; Vercel rewrites currently forward API calls to the VPS.

Before this implementation, `/api/auth/login` verified a bcrypt password, regenerated an express-session cookie, and stored `adminId`. Session JSON lived in reserved SiteConfig records. The `admin` and `superadmin` strings both implied full access. Some individual routes checked authentication; other CRM reads and content writes had no authorization checks. CMS/config endpoints are shared by public published-content readers and administrators, so public reads must remain available while writes and private records are protected.

## Endpoint inventory

The central API permission guard covers news, events, announcements, hero-slides, enquiries, applications, faculty, placements, event-registrations, contacts, programs, certifications, pages (including versions), homepage-sections, config (including backup/restore), upload, and CMS actions. Authentication and security routes implement their own staged authentication and permission checks. Public enquiries, applications, contact submissions, and event registration creation remain available. Private CRM reads require explicit view permissions. Public published-content reads remain available. Internal and private configuration keys are never returned as public site configuration.

New security tables are separate from CMS content and backups. The migration is additive. Existing full-access administrators are retained as explicitly trusted legacy Super Administrators during transition. New accounts use default-deny permissions and password plus Google Authenticator. Gmail identifies the staff account; Google account sign-in is a separate optional policy. The replacement administrator must complete a real login before old credentials can be retired. No production credentials are changed by building or applying the migration alone.

## Standards used

- Google server-side authorization code flow, state, nonce and ID-token checks: https://developers.google.com/identity/openid-connect/openid-connect
- Argon2id password storage: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- TOTP and prevention of successful-code replay: https://www.rfc-editor.org/rfc/rfc6238

## Setup and Environment Configuration

Configure the following variables in `server/.env` (refer to `server/security.env.example`):

- `NODE_ENV`: Set to `production` in live environments.
- `DATABASE_URL`: PostgreSQL connection string with SSL configuration as appropriate.
- `SESSION_SECRET`: Cryptographically strong random string (32+ bytes hex/base64).
- `ADMIN_TOTP_ENCRYPTION_KEY`: 32-byte base64 string for AES-256-GCM encryption of stored TOTP secrets. Generate via `npm run security key -- --output /path/to/key.json`.
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: OAuth 2.0 Web Client credentials, required only if Google account sign-in is explicitly enabled.
- `GOOGLE_REDIRECT_URI`: Registered OAuth callback URI (e.g., `https://chalapathiuniversity.edu.in/api/auth/google/callback`).
- `PUBLIC_ORIGINS`: Allowed origins for CORS and CSRF verification.

## Provisioning and Credential Transition Workflow

1. **Generate Encryption Key**:
   ```bash
   npm run security key -- --output /secure/path/totp-key.json
   ```
   Add the generated `ADMIN_TOTP_ENCRYPTION_KEY` to `server/.env`.

2. **Provision Replacement Super Administrator**:
   ```bash
   npm run security create-super -- --username <new_admin_username> --email <institutional_email> --output /secure/path/creds.json
   ```
   - Existing administrators remain completely active and operational during this period.
   - Temporary credentials are saved to the specified secure file (never printed to console).

3. **Verify and Complete Setup**:
   - The provisioned administrator logs into the portal.
   - Changes the temporary password (stored as Argon2id).
   - Proceeds directly to Authenticator enrollment under the default policy. Google OAuth verification runs only for accounts explicitly requiring Google account sign-in.
   - Sets up TOTP authenticator with verification code.
   - Completes a full end-to-end login.

4. **Activate Cutover**:
   ```bash
   npm run security activate -- --username <new_admin_username>
   ```
   - Retires legacy administrative credentials.
   - Terminates old sessions and invalidates legacy session tokens.
   - Enforces default-deny and role-based permissions across all administrative endpoints.

5. **Operator-Assisted Recovery (if needed)**:
   ```bash
   npm run security recover -- --username <username> --acknowledge-identity-verification yes --output /secure/path/recovery.json
   ```

## Testing and Verification

Run the full automated test suites to verify functionality:

- **Security Suite**:
  ```bash
  cd server && npm run test:security
  ```
  Validates 22 scenario groups including authentication stages, role-based authorization, per-module backup restoration, rate limiting, CSRF protection, and audit logging. Also checks encryption rejects missing/invalid keys and decryption with a different key.

- **Browser Security Suite** (build the frontend first):
  ```bash
  npm run build
  cd server
  npm run test:security:browser
  ```
  Uses the built frontend, headless Chrome, real Express sessions and an isolated temporary PostgreSQL-compatible database. Google token transport is mocked; the server's state, nonce, PKCE, identity matching and staged login checks still run. Covers staff creation through the UI, required password changes, Google redirects, QR enrollment, recovery-code display, subsequent authenticator challenges, restricted staff navigation/actions, direct API denial, tab switching, IST audit history and mobile overflow. Screenshots are written to `work/security-verification/` (ignored by Git). Set `CHROME_PATH` if Chrome is installed elsewhere. These tests never use production accounts or databases.

- **Persistence Suite**:
  ```bash
  cd server && npm run test
  ```
  Validates CRUD, public reads, photo uploads, draft revisions, and session management.

- **Frontend Client Build**:
  ```bash
  npm run build
  ```
  Ensures TypeScript compile and Vite production bundle generation succeed cleanly.

## Deployment Steps

Use Node 22 for the API (`server/.nvmrc`); Node 24 is also within the declared engine range. Argon2 0.45.1 documents Node 22+ support. A VPS running Node 20 was observed to crash with a segmentation fault in a standalone Argon2 hash test while Prisma connected successfully. On that host, move the API to Node 22 and rebuild Argon2 from source with `npm_config_build_from_source=true npm_config_napi_build_version=8 npm rebuild argon2 --foreground-scripts` after installing a C++ compiler, make and Python. Pin PM2's `interpreter` to the chosen Node executable. `node tests/native-password.cjs` must succeed before restarting the API. Reinstallation with `--ignore-scripts` does not rebuild the native binding. This repair preserves password hashes and does not require a database migration.

Production activation requires institution-owned Google OAuth credentials, a valid encryption key and a strong session secret. A production server refuses to start with a missing/short session secret. Google and authenticator operations reject a missing/invalid encryption key. Development uses an ephemeral random session secret if one is not configured. Keep the encryption key stable across backend restarts and releases; replacing it prevents existing authenticator secrets from being decrypted.

Before changing the VPS, back up PostgreSQL with `pg_dump --format=custom` using a protected operator connection, copy the current frontend/server release, and retain the existing process-manager configuration and server-only environment securely. Use a database role without schema-owner privileges for normal application operation; audit retention runs with a separate owner connection.

1. Apply the additive database migration:
   ```bash
   cd server && npx prisma migrate deploy
   ```
2. Build server artifacts:
   ```bash
   cd server && npm run build
   ```
3. Restart backend service via PM2 / systemd:
   ```bash
   pm2 restart chalapathi-backend
   ```
4. Build and deploy frontend client dist to `/var/www/chalapathi`:
   ```bash
   npm run build
   # Nginx serves dist/ directly and proxies /api to http://127.0.0.1:5004
   ```

Deploy the backend and additive migration before exposing the new frontend. Confirm the health endpoint over HTTPS, the public homepage, a published CMS page, legacy administrator login, and staff permission denials. Complete the real replacement administrator's required identity verification and Authenticator enrollment before running `security activate`. A Vercel frontend deployment alone does not apply the VPS migration or deploy the Express backend; its API rewrites point to the VPS.

### Rollback

Before credential cutover, restore the previous frontend/server release and restart its service while keeping the additive security tables. Retain the predeployment database backup for disaster recovery; restoring it discards newer content and audit events and must be a deliberate operator action.

After cutover, use a release with the new security enforcement and the trusted `security recover` procedure. Do not roll back to the old password-only authentication server: that server does not enforce the retired-account status. Never reactivate legacy passwords to recover access. Keep the same TOTP encryption key and session secret when restoring a compatible release.

### Staff administration

Open **Authorization & Security → User Management**, create the staff account, choose a role and individual allow/deny overrides, and share its one-time temporary password privately. The account stays restricted until all required sign-in stages finish.

In **Administrative Google Accounts**, authorize an address and associate it with the staff account. Additional addresses have no fixed application-level account limit. Each address must be verified through Google's sign-in flow; typing an address into the form does not verify ownership. Disabling or revoking an identity revokes the staff account's sessions while retaining its history.

At first sign-in, the staff member uses the assigned Gmail or username and one-time password, changes and confirms the password, creates a personal QR code, scans it with Google Authenticator and submits a current six-digit code. The default flow does not use Google account sign-in. Store the one-time recovery codes privately. Later logins show an authenticator challenge. Authorized administrators can reset enrollment after institutional identity checks; the trusted operator recovery command is available for account lockout.

Use **Login Activity & Audit Logs** to search identities and filter actual role names, event types, results and IST date ranges. **History** on an account opens its filtered events. Explicit logout events, expiry and revocation remain distinct; a missing logout event is not evidence of an explicit sign-out.

### Integration map

Frontend: `src/pages/AdminPortal.tsx`, `src/components/admin/SecurityCMS.tsx`, `src/components/admin/AdminLoginSteps.tsx`, `src/security/adminAccess.tsx`, and `src/styles/admin-security.css`. Existing CMS editors continue to use their existing handlers.

Backend: `/api/auth/login`, `/status`, `/me`, `/csrf`, `/password`, `/google/start`, `/google/callback`, `/totp/enroll`, `/totp/confirm`, `/totp`, `/reauth`, and `/logout`. `/api/security` provides `/summary`, `/users` (including password/factor resets, session history and revocation), `/roles`, `/google`, `/authenticators`, `/events`, `/events/export`, `/policy`, `/catalog` and `/options`. Permission middleware independently guards administrative writes and private reads.

Migration: `server/prisma/migrations/202610160001_admin_security/migration.sql`. Apply it with the server's Prisma 5 tools and PostgreSQL database, rather than the historical root SQLite schema.

### External configuration remaining at release time

Automated tests simulate Google's token transport. Real Google consent, institution-owned administrator identity, production database migration and credential cutover must be verified on the configured VPS. No test creates a production replacement account or changes live credentials. The frontend build currently emits the existing large-bundle advisory; it still produces a successful production build.

## Maintenance & Audit Retention

- Periodic maintenance (minimum 90-day retention) can be executed using `server/prisma/security-retention.sql` via a database-owner connection.
- Immutable audit events are protected via trigger `university_audit_immutable` and record all privileged actions with UTC timestamps and IST display formatting.


## Password and Authenticator login policy

The institution selected password plus Google Authenticator, without Google account sign-in. The staff Gmail remains the account address; it does not require OAuth credentials. First login uses the one-time password, requires a replacement password and confirmation, then shows the personal Authenticator QR code. Access is granted only after a valid code. Later logins ask for a password and current code or an unused recovery code.

New account editors load authentication defaults from `/api/security/options`. A Super Administrator can explicitly enable the separate Google account sign-in requirement if the institution later configures it. Super Administrators always require Authenticator. Password resets and operator recovery preserve the selected login flow.

For an existing installation, run from the server directory after deploying the updated code:

```bash
node scripts/configure-authenticator.cjs --all-accounts
```

This verifies the existing encryption key, sets the default to password plus mandatory Authenticator, updates existing account requirements and revokes sessions for changed accounts. It preserves passwords, Gmail addresses, roles, statuses, enrolled factors and recovery codes. A user who already changed their temporary password can sign in with that password and continue to QR enrollment. It neither generates nor rotates encryption keys. Reapplying the same profile does not revoke additional sessions.

`scripts/install-authenticator-update.sh` installs a prepared payload on the known Hostinger VPS, keeps file backups under `/root`, verifies Node 22 and native password hashing, preserves the API port 5004 and existing environment, configures the chosen policy and publishes frontend assets before its HTML entry point. It does not install dependencies or run database migrations. The built frontend and compiled backend must be packaged together with their matching sources.
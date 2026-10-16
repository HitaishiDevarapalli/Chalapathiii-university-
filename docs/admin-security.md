# Authorization & Security: implementation and operations

## Inspected architecture and existing authentication

The public site and admin portal use React 19, Vite 5, React Router, and the existing DataContext/CMS editors. The VPS serves `dist` from `/var/www/chalapathi` through Nginx and proxies `/api` to the Express server on port 5000. The production data model is `server/prisma/schema.prisma`, PostgreSQL with Prisma 5. The root SQLite/Prisma 7 schema and old serverless handlers are a separate historical deployment path; Vercel rewrites currently forward API calls to the VPS.

Before this implementation, `/api/auth/login` verified a bcrypt password, regenerated an express-session cookie, and stored `adminId`. Session JSON lived in reserved SiteConfig records. The `admin` and `superadmin` strings both implied full access. Some individual routes checked authentication; other CRM reads and content writes had no authorization checks. CMS/config endpoints are shared by public published-content readers and administrators, so public reads must remain available while writes and private records are protected.

## Endpoint inventory

The central API permission guard covers news, events, announcements, hero-slides, enquiries, applications, faculty, placements, event-registrations, contacts, programs, certifications, pages (including versions), homepage-sections, config (including backup/restore), upload, and CMS actions. Authentication and security routes implement their own staged authentication and permission checks. Public enquiries, applications, contact submissions, and event registration creation remain available. Private CRM reads require explicit view permissions. Public published-content reads remain available. Internal and private configuration keys are never returned as public site configuration.

New security tables are separate from CMS content and backups. The migration is additive. Existing full-access administrators are retained as explicitly trusted legacy Super Administrators during transition. New accounts use default-deny permissions and staged Google/TOTP authentication. The replacement administrator must complete a real login before old credentials can be retired. No production credentials are changed by building or applying the migration alone.

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
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: OAuth 2.0 Web Client credentials from Google Cloud Console.
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
   - Completes Google OAuth verification and links institution-owned identity.
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
  Validates 18 scenario groups including authentication stages, role-based authorization, rate limiting, CSRF protection, and audit logging.

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
   # Nginx serves dist/ directly and proxies /api to http://localhost:5000
   ```

## Maintenance & Audit Retention

- Periodic maintenance (minimum 90-day retention) can be executed using `server/prisma/security-retention.sql` via a database-owner connection.
- Immutable audit events are protected via trigger `university_audit_immutable` and record all privileged actions with UTC timestamps and IST display formatting.


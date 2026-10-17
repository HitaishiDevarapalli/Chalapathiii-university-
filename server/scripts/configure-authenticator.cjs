// Trusted operator command for the institution's password + Authenticator policy.
require('dotenv').config({ quiet: true });

async function configureAuthenticator(prisma) {
  const core = require('../dist/security/core');
  core.encryptionKey();
  // Verify the existing key before altering requirements; preserve enrolled factors.
  const factors = await prisma.userAuthenticator.findMany({ where: { enabled: true }, select: { secretBox: true } });
  for (const factor of factors) core.unseal(factor.secretBox);
  return prisma.$transaction(async tx => {
    await tx.$executeRawUnsafe('SELECT pg_advisory_xact_lock(724150)');
    await tx.adminSecurityPolicy.upsert({ where: { id: 1 },
      create: { id: 1, ...core.defaultPolicy, requireGoogle: false, requireTotp: true },
      update: { requireGoogle: false, requireTotp: true } });
    const users = await tx.adminUser.findMany({ where: { OR: [{ requireGoogle: true }, { requireTotp: false }] } });
    for (const user of users) {
      await tx.adminUser.update({ where: { id: user.id }, data: {
        requireGoogle: false, requireTotp: true, securityVersion: { increment: 1 } } });
      await core.revokeSessions(user.id, tx);
      await core.audit(null, 'authentication_requirements_changed', true,
        'Operator selected password and mandatory Authenticator; Google account sign-in disabled; sessions revoked',
        user, String(user.id), tx);
    }
    await core.audit(null, 'security_policy_changed', true,
      'New accounts require password and Authenticator; Gmail remains the staff account address', undefined, 'policy', tx);
    return users.length;
  }, { timeout: 30000 });
}

if (require.main === module) {
  if (process.argv.length !== 3 || process.argv[2] !== '--all-accounts') {
    console.error('Usage: node scripts/configure-authenticator.cjs --all-accounts');
    process.exitCode = 1;
  } else {
    const prisma = require('../dist/prisma').default;
    configureAuthenticator(prisma)
      .then(count => console.log('Password + Authenticator configured. Updated accounts: ' + count + '. Sign in again to enroll or verify your code.'))
      .catch(() => { console.error('Configuration failed. Check the existing encryption key and database; no credentials were logged.'); process.exitCode = 1; })
      .finally(() => prisma.$disconnect());
  }
}
module.exports = { configureAuthenticator };

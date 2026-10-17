const assert = require('node:assert/strict');
const argon2 = require('argon2');
(async () => {
  const password = 'native-preflight-fixture-only';
  const hash = await argon2.hash(password, { type: argon2.argon2id, memoryCost: 19456, timeCost: 3, parallelism: 1 });
  assert.ok(await argon2.verify(hash, password));
  assert.equal(await argon2.verify(hash, password + '-wrong'), false);
  console.log('ARGON2_OK: hashing and verification passed.');
})().catch(() => { console.error('ARGON2_FAILED: native password hashing is unavailable.'); process.exitCode = 1; });

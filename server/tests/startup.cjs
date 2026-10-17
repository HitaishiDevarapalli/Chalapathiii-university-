const assert = require('node:assert/strict');
const crypto = require('node:crypto');
process.env.NODE_ENV = 'test';
process.env.PORT = '0';
process.env.SESSION_SECRET = crypto.randomBytes(32).toString('hex');
const server = require('../start.cjs');
(async () => {
  try {
    if (!server.listening) await new Promise((resolve, reject) => { server.once('listening', resolve); server.once('error', reject); });
    const response = await fetch('http://127.0.0.1:' + server.address().port + '/api/health');
    assert.equal(response.status, 200);
    assert.equal((await response.json()).status, 'ok');
    console.log('PASS: requiring the process entry point opens a listener and serves the health API.');
  } finally { await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });

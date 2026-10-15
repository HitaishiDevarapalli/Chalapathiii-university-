const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync('../src/services/popupPublishing.ts', 'utf8');
const exportsObject = {};
let requests = [];
let responses = [];
let notices = 0;
const context = { exports: exportsObject, require: name => name === 'react' ? {} : { durableImage: async image => image.startsWith('data:') ? '/uploads/popup.jpg' : image },
  fetch: async (url, options) => { requests.push({ url, options }); return responses.shift(); },
  window: { dispatchEvent: () => notices++ }, Event: class {}, console };
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, context);
const { readPopupConfig, publishPopupConfig, selectActivePopup } = exportsObject;
const config = { masterEnabled: true, activePopupId: 'hidden', popups: [
  { id: 'hidden', title: 'Hidden', type: 'banner', enabled: false, image: '' },
  { id: 'visible', title: 'Published notice', type: 'banner', enabled: true, image: 'data:image/png;base64,x' }
] };
const reply = (status, body) => ({ status, ok: status >= 200 && status < 300, json: async () => body });
(async () => {
  assert.equal(selectActivePopup(config), null, 'hidden selection must not fall back to another popup');
  assert.equal(selectActivePopup({ ...config, masterEnabled: false, activePopupId: 'visible' }), null);
  assert.equal(selectActivePopup({ ...config, activePopupId: 'visible' }).title, 'Published notice');
  responses = [reply(404)];
  assert.equal(await readPopupConfig(), null, 'no saved config must not publish demo content');
  assert.equal(requests.at(-1).options.cache, 'no-store');
  responses = [reply(401, { error: 'Please sign in' })];
  await assert.rejects(publishPopupConfig(config), /Please sign in/);
  assert.equal(notices, 0, 'failed saves must not announce publication');
  responses = [reply(200, {}), reply(200, { ...config, activePopupId: 'wrong' })];
  await assert.rejects(publishPopupConfig(config), /did not confirm/);
  assert.equal(notices, 0);
  const durable = { ...config, popups: config.popups.map(p => ({ ...p, image: p.image.startsWith('data:') ? '/uploads/popup.jpg' : p.image })) };
  responses = [reply(200, {}), reply(200, durable)];
  assert.equal(JSON.stringify(await publishPopupConfig(config)), JSON.stringify(durable));
  assert.equal(notices, 1);
  assert.equal(JSON.parse(requests.at(-2).options.body).popups[1].image, '/uploads/popup.jpg');
  console.log('PASS: popup selection, no demo fallback, no-cache reads, rejected saves, readback verification, durable images and confirmed publication.');
})().catch(error => { console.error(error); process.exitCode = 1; });

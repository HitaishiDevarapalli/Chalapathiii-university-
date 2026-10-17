const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const Module = require("node:module");
const source = path.resolve("../src/pageBuilder/model.ts");
const code = ts.transpileModule(fs.readFileSync(source, "utf8"), {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;
const compiled = new Module(source, module);
compiled._compile(code, source);
const { documentsEqual } = compiled.exports;
const draft = {
  title: "Page",
  nodes: [
    {
      id: "a",
      props: { text: "Saved" },
      style: { width: "100%", padding: 16 },
    },
    { id: "b", props: {}, style: {} },
  ],
};
const serverOrdered = {
  nodes: [
    {
      style: { padding: 16, width: "100%" },
      props: { text: "Saved", caption: undefined },
      id: "a",
    },
    { style: {}, props: {}, id: "b" },
  ],
  title: "Page",
};
assert.equal(
  documentsEqual(draft, serverOrdered),
  true,
  "JSON object key order and omitted optional fields cannot create false unsaved edits",
);
assert.equal(
  documentsEqual(draft, { ...draft, title: "Changed" }),
  false,
  "Real metadata edits remain unsaved",
);
assert.equal(
  documentsEqual(draft, { ...draft, nodes: [...draft.nodes].reverse() }),
  false,
  "Component reordering remains an edit",
);
assert.equal(
  documentsEqual(draft, {
    ...draft,
    nodes: [{ ...draft.nodes[0], props: { text: "Changed" } }, draft.nodes[1]],
  }),
  false,
  "Text changes remain an edit",
);
assert.equal(
  documentsEqual(draft, JSON.parse(JSON.stringify(draft))),
  true,
  "A server save round trip establishes clean state",
);
console.log(
  "PASS: semantic saved-state comparisons preserve real edits and ignore JSON property order.",
);

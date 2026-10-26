import path from "path";
import fs from "fs/promises";
import { createHash } from "crypto";
import yauzl from "yauzl";
import { parse, serialize } from "parse5";
import { uploadsDirectory } from "../middleware/upload";
import { fail } from "../security/core";
import { NavigationContext, resolveNavigation } from "./navigation";

export const MAX_ZIP = 20 * 1024 * 1024;
export const MAX_EXPANDED = 50 * 1024 * 1024;
export const MAX_FILE = 8 * 1024 * 1024;
export const MAX_SOURCE = 2 * 1024 * 1024;
export const assetDirectory = path.resolve(
  process.env.CODE_PAGE_ASSETS_DIR ||
    path.join(uploadsDirectory, "..", "code-page-assets"),
);
if (
  assetDirectory === uploadsDirectory ||
  assetDirectory.startsWith(uploadsDirectory + path.sep)
)
  throw new Error("Code assets must be outside public uploads");
const types: Record<string, string> = {
  ".html": "text/html",
  ".htm": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".json": "application/json",
  ".txt": "text/plain",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
};
export type SourceFile = {
  path: string;
  mime: string;
  size: number;
  hash: string;
  source?: string;
};
export type Package = {
  entry: string;
  originalName: string;
  files: SourceFile[];
  totalBytes: number;
};
export type Validation = { errors: string[]; warnings: string[] };
export const hash = (bytes: Buffer | string) =>
  createHash("sha256").update(bytes).digest("hex");
const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(bytes: Buffer) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
export function safePath(value: string) {
  if (
    !value ||
    value.length > 240 ||
    /[\\\x00-\x1f:%?#]/.test(value) ||
    value.startsWith("/") ||
    !/^[a-zA-Z0-9_@. ()/\-]+$/.test(value) ||
    value.split("/").some((s) => !s || s.startsWith("."))
  )
    fail("Invalid archive path");
  return value;
}
export function textMime(mime: string) {
  return /^(text\/|application\/json|image\/svg\+xml)/.test(mime);
}
function validateBytes(name: string, bytes: Buffer) {
  const mime = types[path.posix.extname(name).toLowerCase()];
  if (!mime) fail(`Unsupported static file: ${name}`);
  if (textMime(mime)) {
    if (bytes.length > MAX_SOURCE)
      fail(`Source file exceeds 2 MB: ${name}`, 413);
    try {
      new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
      fail(`Source must be UTF-8: ${name}`);
    }
    if (bytes.includes(0)) fail(`Invalid text file: ${name}`);
    if (mime === "image/svg+xml" && !/<svg[\s>]/i.test(bytes.toString()))
      fail(`Invalid SVG: ${name}`);
  } else {
    const hex = bytes.subarray(0, 12).toString("hex");
    const ascii = bytes.subarray(0, 16).toString("latin1");
    const valid =
      mime === "image/png"
        ? hex.startsWith("89504e470d0a1a0a")
        : mime === "image/jpeg"
          ? hex.startsWith("ffd8ff")
          : mime === "image/gif"
            ? /^GIF8[79]a/.test(ascii)
            : mime === "image/webp"
              ? ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WEBP"
              : mime === "image/avif"
                ? ascii.slice(4, 8) === "ftyp" && /avif|avis/.test(ascii)
                : mime === "image/x-icon"
                  ? hex.startsWith("00000100")
                  : mime === "font/woff"
                    ? ascii.startsWith("wOFF")
                    : mime === "font/woff2"
                      ? ascii.startsWith("wOF2")
                      : mime === "font/ttf"
                        ? hex.startsWith("00010000") || ascii.startsWith("true")
                        : mime === "font/otf"
                          ? ascii.startsWith("OTTO")
                          : mime === "video/mp4"
                            ? ascii.slice(4, 8) === "ftyp"
                            : mime === "video/webm"
                              ? hex.startsWith("1a45dfa3")
                              : mime === "audio/ogg"
                                ? ascii.startsWith("OggS")
                                : mime === "audio/mpeg"
                                  ? ascii.startsWith("ID3") ||
                                    (bytes[0] === 0xff &&
                                      (bytes[1] & 0xe0) === 0xe0)
                                  : false;
    if (!valid) fail(`File contents do not match type: ${name}`);
  }
  return mime;
}
export async function storeFile(
  name: string,
  bytes: Buffer,
): Promise<SourceFile> {
  const mime = validateBytes(safePath(name), bytes);
  const digest = hash(bytes);
  if (!textMime(mime)) {
    await fs.mkdir(assetDirectory, { recursive: true });
    await fs
      .writeFile(path.join(assetDirectory, digest), bytes, {
        flag: "wx",
        mode: 0o600,
      })
      .catch((error) => {
        if (error.code !== "EEXIST") throw error;
      });
  }
  return {
    path: name,
    mime,
    size: bytes.length,
    hash: digest,
    ...(textMime(mime) ? { source: bytes.toString("utf8") } : {}),
  };
}
export async function readPackage(
  buffer: Buffer,
  originalName: string,
): Promise<Package> {
  if (buffer.length > MAX_ZIP) fail("ZIP exceeds 20 MB", 413);
  const extracted: { name: string; bytes: Buffer }[] = [];
  await new Promise<void>((resolve, reject) => {
    yauzl.fromBuffer(
      buffer,
      { lazyEntries: true, validateEntrySizes: true, strictFileNames: true },
      (error, zip) => {
        if (error || !zip)
          return reject(
            Object.assign(new Error("Malformed ZIP archive"), { status: 400 }),
          );
        let total = 0,
          count = 0;
        const names = new Set<string>();
        const abort = (error: unknown) => {
          zip.close();
          reject(error);
        };
        zip.on("error", () =>
          abort(
            Object.assign(new Error("Malformed ZIP archive"), { status: 400 }),
          ),
        );
        zip.on("end", resolve);
        zip.on("entry", (entry: yauzl.Entry) => {
          try {
            if (++count > 500) fail("Archive exceeds 500 entries", 413);
            const name = entry.fileName;
            const unixMode = (entry.externalFileAttributes >>> 16) & 0xf000;
            if (unixMode && ![0x8000, 0x4000].includes(unixMode))
              fail("Links and special files are forbidden");
            if (entry.generalPurposeBitFlag & 1)
              fail("Encrypted archives are unsupported");
            if (entry.compressionMethod !== 0 && entry.compressionMethod !== 8)
              fail("Unsupported ZIP compression");
            safePath(name.endsWith("/") ? name.slice(0, -1) : name);
            if (name.endsWith("/")) {
              zip.readEntry();
              return;
            }
            if (names.has(name.toLowerCase())) fail("Duplicate archive paths");
            names.add(name.toLowerCase());
            if (!types[path.posix.extname(name).toLowerCase()])
              fail(`Unsupported static file: ${name}`);
            if (
              entry.uncompressedSize > MAX_FILE ||
              (total += entry.uncompressedSize) > MAX_EXPANDED ||
              entry.uncompressedSize > Math.max(1, entry.compressedSize) * 200
            )
              fail("Archive expansion limit exceeded", 413);
            zip.openReadStream(entry, (error, stream) => {
              if (error || !stream)
                return abort(
                  Object.assign(new Error("Cannot read ZIP entry"), {
                    status: 400,
                  }),
                );
              const chunks: Buffer[] = [];
              let size = 0;
              stream.on("data", (chunk) => {
                size += chunk.length;
                if (size > entry.uncompressedSize || size > MAX_FILE) {
                  stream.destroy();
                  abort(
                    Object.assign(
                      new Error("Archive expansion limit exceeded"),
                      { status: 413 },
                    ),
                  );
                } else chunks.push(chunk);
              });
              stream.on("error", () =>
                abort(
                  Object.assign(new Error("Corrupt archive entry"), {
                    status: 400,
                  }),
                ),
              );
              stream.on("end", () => {
                try {
                  const bytes = Buffer.concat(chunks);
                  if (size !== entry.uncompressedSize)
                    fail("Corrupt archive size");
                  if (crc32(bytes) !== entry.crc32)
                    fail("Corrupt archive checksum");
                  validateBytes(name, bytes);
                  extracted.push({ name, bytes });
                  zip.readEntry();
                } catch (error) {
                  abort(error);
                }
              });
            });
          } catch (error) {
            abort(error);
          }
        });
        zip.readEntry();
      },
    );
  });
  if (!extracted.length) fail("The ZIP is empty");
  // Accept a single enclosing folder, as produced by desktop ZIP tools.
  const root = extracted[0].name.split("/")[0] + "/";
  if (extracted.every((f) => f.name.startsWith(root)))
    for (const f of extracted) f.name = f.name.slice(root.length);
  const html = extracted.filter((f) => /\.html?$/i.test(f.name));
  const entry =
    html.find((f) => /^index\.html?$/i.test(f.name)) ||
    (html.length === 1 ? html[0] : undefined);
  if (!entry)
    fail("Include index.html at the root, or exactly one HTML entry point");
  const files: SourceFile[] = [];
  for (const file of extracted)
    files.push(await storeFile(file.name, file.bytes));
  return {
    entry: entry!.name,
    originalName: path.basename(originalName).slice(0, 200),
    files,
    totalBytes: files.reduce((n, f) => n + f.size, 0),
  };
}

export function validatePackage(pkg: Package): Validation {
  const errors: string[] = [],
    warnings: string[] = [];
  const paths = new Set(pkg.files.map((f) => f.path));
  if (!paths.has(pkg.entry) || !/\.html?$/i.test(pkg.entry))
    errors.push("Select a valid HTML entry point");
  const check = (value: string, from: string, required = true) => {
    const ref = value.trim();
    if (!ref || ref.startsWith("#") || /^(data:|mailto:|tel:)/i.test(ref))
      return;
    if (/^(https?:|\/\/)/i.test(ref)) {
      warnings.push(
        `${from}: external resource ${ref.slice(0, 120)} is blocked by the isolation policy`,
      );
      return;
    }
    if (/^[a-z][a-z0-9+.-]*:/i.test(ref)) {
      errors.push(`${from}: unsupported URL scheme`);
      return;
    }
    let decoded: string;
    try {
      decoded = decodeURIComponent(ref.split(/[?#]/)[0]);
    } catch {
      errors.push(`${from}: malformed asset URL`);
      return;
    }
    const target = path.posix.normalize(
      decoded.startsWith("/")
        ? decoded.slice(1)
        : path.posix.join(path.posix.dirname(from), decoded),
    );
    if (!paths.has(target) && !paths.has(`${target}/index.html`))
      (required ? errors : warnings).push(`${from}: missing ${target}`);
  };
  for (const file of pkg.files) {
    const source = file.source;
    if (source === undefined) continue;
    if (file.mime === "text/html" || file.mime === "image/svg+xml") {
      const visit = (node: any) => {
        if (
          node.tagName === "base" ||
          (node.tagName === "meta" &&
            node.attrs?.some((a: any) => a.name === "http-equiv"))
        )
          warnings.push(
            `${file.path}: base and http-equiv directives are removed`,
          );
        if (node.tagName === "form") {
          const action = node.attrs?.find((a: any) => a.name === "action")?.value;
          if (!action?.trim())
            warnings.push(`${file.path}: form has no action URL; connect a submission endpoint to save registrations`);
          else if (/^http:/i.test(action))
            warnings.push(`${file.path}: form submissions require an HTTPS action URL`);
        }
        for (const attr of node.attrs || []) {
          if (["src", "poster", "href", "xlink:href"].includes(attr.name))
            // Links navigate to website routes or other sites, not just ZIP assets.
            if (!["a", "area"].includes(node.tagName)) check(attr.value, file.path);
          if (attr.name === "srcset")
            for (const item of attr.value.split(","))
              check(item.trim().split(/\s/)[0], file.path);
          if (attr.name === "style")
            for (const m of attr.value.matchAll(/url\(\s*['"]?([^'"\s)]+)/gi))
              check(m[1], file.path);
        }
        for (const child of node.childNodes || []) visit(child);
        if (node.tagName === "style")
          for (const child of node.childNodes || [])
            for (const m of (child.value || "").matchAll(
              /url\(\s*['"]?([^'"\s)]+)/gi,
            ))
              check(m[1], file.path);
      };
      visit(parse(source));
    }
    if (file.mime === "text/css")
      for (const m of source.matchAll(
        /url\(\s*['"]?([^'"\s)]+)|@import\s+['"]([^'"]+)/gi,
      ))
        check(m[1] || m[2], file.path);
    if (file.mime === "text/javascript") {
      warnings.push(
        `${file.path}: clicked links, new tabs and HTTPS form submissions are supported. Scripts remain isolated; portal storage, privileged APIs and external fetch/resources are blocked. Forms need a real submission endpoint`,
      );
      for (const match of source.matchAll(
        /(?:\b(?:import|export)\s+(?:[^'"\n]*?\sfrom\s*)?|\bimport\s*\(\s*|\bnew\s+URL\s*\(\s*)['"]([^'"]+)['"]/g,
      )) {
        const reference = match[1];
        if (
          reference.startsWith(".") ||
          reference.startsWith("/") ||
          /^https?:/i.test(reference)
        )
          check(reference, file.path);
        else
          errors.push(
            `${file.path}: bare module import ${reference} must be bundled into the uploaded folder`,
          );
      }
    }
  }
  return {
    errors: [...new Set(errors)].slice(0, 100),
    warnings: [...new Set(warnings)].slice(0, 100),
  };
}

export function rewriteCss(source: string, base: string) {
  return source
    .replace(/(url\(\s*['"]?)\/(?!\/)/gi, `$1${base}`)
    .replace(/(@import\s+['"])\/(?!\/)/gi, `$1${base}`);
}
export function renderHtml(
  source: string,
  base: string,
  metadata: Record<string, any>,
  channel = "",
  navigation?: NavigationContext,
) {
  const tree: any = parse(source);
  const walk = (node: any) => {
    if (node.childNodes)
      node.childNodes = node.childNodes.filter(
        (n: any) =>
          n.tagName !== "base" &&
          n.tagName !== "title" &&
          !(
            n.tagName === "link" &&
            n.attrs?.some(
              (a: any) => a.name === "rel" && a.value === "canonical",
            )
          ) &&
          !(
            n.tagName === "meta" &&
            n.attrs?.some(
              (a: any) =>
                a.name === "http-equiv" ||
                (["name", "property"].includes(a.name) &&
                  /^(description|robots|og:)/.test(a.value)),
            )
          ),
      );
    const navigationAttribute = ["a", "area"].includes(node.tagName)
      ? "href" : node.tagName === "form" ? "action" : "";
    if (navigation && navigationAttribute) {
      const attr = node.attrs?.find((a: any) => a.name === navigationAttribute);
      const resolved = attr && resolveNavigation(attr.value, navigation, node.tagName === "form");
      if (resolved) {
        attr.value = resolved.href;
        const set = (name: string, value: string) => {
          const existing = node.attrs.find((a: any) => a.name === name);
          if (existing) existing.value = value;
          else node.attrs.push({ name, value });
        };
        const target = node.attrs.find((a: any) => a.name === "target");
        set("target", target?.value === "_blank" ? "_blank" : resolved.target);
        set("rel", "noopener noreferrer");
      }
    }
    for (const attr of node.attrs || []) {
      if (
        ["src", "href", "poster", "xlink:href"].includes(attr.name) &&
        !(navigation && navigationAttribute === "href" && attr.name === "href") &&
        /^\/(?!\/)/.test(attr.value)
      )
        attr.value = base + attr.value.slice(1);
      if (attr.name === "srcset")
        attr.value = attr.value.replace(/(^|,)(\s*)\/(?!\/)/g, `$1$2${base}`);
      if (attr.name === "style") attr.value = rewriteCss(attr.value, base);
    }
    if (node.tagName === "style")
      for (const child of node.childNodes || [])
        child.value = rewriteCss(child.value || "", base);
    for (const child of node.childNodes || []) walk(child);
  };
  walk(tree);
  const escape = (s: unknown) =>
    String(s || "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c]!,
    );
  const head = tree.childNodes
    .find((n: any) => n.tagName === "html")
    .childNodes.find((n: any) => n.tagName === "head");
  const tags = `<meta charset="utf-8"><title>${escape(metadata.title)}</title><meta name="description" content="${escape(metadata.description)}"><meta name="robots" content="${metadata.noindex ? "noindex, nofollow" : "index, follow"}"><link rel="canonical" href="${escape(metadata.canonical)}"><meta property="og:title" content="${escape(metadata.ogTitle || metadata.title)}"><meta property="og:description" content="${escape(metadata.ogDescription || metadata.description)}"><meta property="og:image" content="${escape(metadata.image)}">`;
  const fragment: any = parse(tags);
  const nodes = fragment.childNodes
    .find((n: any) => n.tagName === "html")
    .childNodes.find((n: any) => n.tagName === "head").childNodes;
  head.childNodes.unshift(...nodes);
  if (navigation) {
    // Use the browser's native navigation, form validation/encoding and popup rules.
    // No messages from uploaded scripts can navigate the portal.
    const config = JSON.stringify(navigation).replace(/</g, "\\u003c");
    const bootstrap: any = parse(`<script>(()=>{
      const context=${config};
      const resolve=${resolveNavigation.toString()};
      const prepare=(el,attr,form,targetAttr='target')=>{
        const result=resolve(el.getAttribute(attr)||'',context,form);
        if(!result)return false;
        el.setAttribute(attr,result.href);
        if(el.getAttribute(targetAttr)!=='_blank')el.setAttribute(targetAttr,result.target);
        el.setAttribute('rel','noopener noreferrer');
        return true;
      };
      for(const type of ['click','auxclick'])addEventListener(type,e=>{
        const link=e.target.closest?.('a[href],area[href]');
        if(link)prepare(link,'href',false);
      },true);
      addEventListener('submit',e=>{
        const form=e.target,button=e.submitter;
        const override=button?.hasAttribute('formaction');
        if(button?.hasAttribute('formtarget'))button.setAttribute('formtarget','_blank');
        if(!prepare(override?button:form,override?'formaction':'action',true,override?'formtarget':'target')){
          e.preventDefault();
          console.error('Registration form needs a valid HTTPS action URL. No registration was submitted.');
        }
      },true);
      const submit=HTMLFormElement.prototype.submit;
      HTMLFormElement.prototype.submit=function(){
        if(prepare(this,'action',true))return submit.call(this);
        console.error('Registration form needs a valid HTTPS action URL. No registration was submitted.');
      };
      const open=window.open.bind(window);
      window.open=(url,target,features)=>{
        if(!url)return open(url,target,features);
        const result=resolve(String(url),context);
        if(!result)return null;
        return open(result.href,target==='_blank'||!target?'_blank':result.target,(features?features+',':'')+'noopener,noreferrer');
      };
      window.codePage={navigate:url=>{
        const result=resolve(String(url),context);
        if(result)window.open(result.href,result.target);
      }};
    })();</script>`);
    head.childNodes.unshift(...bootstrap.childNodes.find((n: any) => n.tagName === "html").childNodes.find((n: any) => n.tagName === "head").childNodes);
  }
  const script: any = parse(
    `<script>(()=>{
      const send=(kind,message)=>parent.postMessage({type:'code-page',channel:${JSON.stringify(channel)},kind,message},'*');
      addEventListener('error',e=>send('error',e.message||'Asset failed: '+(e.target.src||e.target.href||e.target.tagName)),true);
      addEventListener('unhandledrejection',e=>send('error',String(e.reason)));
      addEventListener('securitypolicyviolation',e=>send('error','Blocked '+e.violatedDirective+': '+e.blockedURI));
      const original=console.error.bind(console);
      console.error=(...args)=>{send('error',args.map(String).join(' ').slice(0,500));original(...args)};
      let anchorFrame=0;
      const reportAnchor=()=>{
        cancelAnimationFrame(anchorFrame);
        anchorFrame=requestAnimationFrame(()=>{
          let name;
          try{name=decodeURIComponent(location.hash.slice(1));}catch{return;}
          const target=name?(document.getElementById(name)||document.getElementsByName(name)[0]):document.body;
          if(target)send('anchor',{top:name?target.getBoundingClientRect().top:0});
        });
      };
      addEventListener('hashchange',reportAnchor);
      // Hash changes alone cannot scroll an expanded, opaque-origin iframe's
      // ancestors. Also handle repeated clicks on the current fragment.
      addEventListener('click',e=>{
        if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
        const link=e.target.closest?.('a[href],area[href]');
        if(!link||link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;
        const url=new URL(link.href,location.href);
        if(url.origin===location.origin&&url.pathname===location.pathname&&url.search===location.search&&link.href.includes('#'))reportAnchor();
      });
      addEventListener('load',()=>{
        send('loaded','Preview rendered');
        const report=()=>send('height',Math.max(document.body.scrollHeight,document.documentElement.scrollHeight));
        report();new ResizeObserver(report).observe(document.body);
        if(location.hash)reportAnchor();
      });
    })();</script>`,
  );
  head.childNodes.unshift(
    ...script.childNodes
      .find((n: any) => n.tagName === "html")
      .childNodes.find((n: any) => n.tagName === "head").childNodes,
  );
  return serialize(tree);
}

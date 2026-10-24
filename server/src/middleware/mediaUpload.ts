import multer from "multer";
import { createReadStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { uploadsDirectory } from "./upload";

const incomingDirectory = path.join(uploadsDirectory, ".media-incoming");

export const mediaUploadStorage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    void fs.mkdir(incomingDirectory, { recursive: true }).then(
      () => callback(null, incomingDirectory),
      error => callback(error, incomingDirectory),
    );
  },
  filename: (_req, _file, callback) => callback(null, randomUUID()),
});

export async function isPassivePdf(filename: string): Promise<boolean> {
  const handle = await fs.open(filename, "r");
  try {
    const { size } = await handle.stat();
    if (size < 10) return false;
    const header = Buffer.alloc(5);
    const tail = Buffer.alloc(Math.min(size, 1024));
    await handle.read(header, 0, header.length, 0);
    await handle.read(tail, 0, tail.length, size - tail.length);
    if (header.toString() !== "%PDF-" || !tail.includes(Buffer.from("%%EOF"))) return false;
  } finally {
    await handle.close();
  }

  const activePdfAction = /\/JavaScript\b|\/S\s*\/Launch\b|\/JS\s*(?:\(|<)|\/Type\s*\/EmbeddedFile\b|\/EmbeddedFiles\b/;
  const stream = createReadStream(filename, { encoding: "latin1" });
  let carry = "";
  for await (const chunk of stream) {
    const content = carry + chunk;
    if (activePdfAction.test(content)) return false;
    carry = content.slice(-64);
  }
  return true;
}

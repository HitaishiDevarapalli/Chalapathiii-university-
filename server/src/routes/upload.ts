import { Router } from "express";
import path from "path";
import { upload, uploadsDirectory } from "../middleware/upload";
import fs from "fs";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);
function validateImage(file: Express.Multer.File) {
  if (!file.mimetype.startsWith("image/")) return;
  const fd = fs.openSync(file.path, "r");
  const bytes = Buffer.alloc(16);
  try { fs.readSync(fd, bytes, 0, 16, 0); } finally { fs.closeSync(fd); }
  const valid = file.mimetype === "image/png" ? bytes.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"))
    : file.mimetype === "image/jpeg" ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
    : file.mimetype === "image/gif" ? /^GIF8[79]a/.test(bytes.toString("ascii"))
    : file.mimetype === "image/webp" && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  if (!valid) throw new Error("Invalid image content");
}


// POST /api/upload - Upload a single file
router.post("/", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    if (req.body?.slot === "homepageIntro") {
      if (req.file.mimetype !== "video/mp4" || path.extname(req.file.originalname).toLowerCase() !== ".mp4") {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: "The homepage intro video must be an MP4 file." });
      }
      const stablePath = path.join(uploadsDirectory, "chalapathi-campus-intro.mp4");
      fs.renameSync(req.file.path, stablePath);
      res.setHeader("Cache-Control", "no-store");
      return res.json({
        success: true,
        url: "/chalapathi-campus-intro.mp4",
        filename: "chalapathi-campus-intro.mp4",
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });
    }
    validateImage(req.file);
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error: any) {
    const files = req.file ? [req.file] : (req.files as Express.Multer.File[] || []);
    files.forEach(file => { try { fs.unlinkSync(file.path); } catch {} });
    res.status(400).json({ error: "File upload rejected" });
  }
});

// POST /api/upload/multiple - Upload multiple files (no practical limit)
router.post("/multiple", upload.array("files", 200), (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    files.forEach(validateImage);
    const urls = files.map((f) => ({
      url: `/uploads/${f.filename}`,
      filename: f.filename,
      originalName: f.originalname,
      size: f.size,
    }));
    res.json({ success: true, files: urls });
  } catch (error: any) {
    const files = req.file ? [req.file] : (req.files as Express.Multer.File[] || []);
    files.forEach(file => { try { fs.unlinkSync(file.path); } catch {} });
    res.status(400).json({ error: "File upload rejected" });
  }
});

export default router;

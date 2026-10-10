import { Router } from "express";
import { upload } from "../middleware/upload";
import path from "path";

const router = Router();

// POST /api/upload - Upload a single file
router.post("/", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
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
    res.status(500).json({ error: error.message });
  }
});

// POST /api/upload/multiple - Upload multiple files
router.post("/multiple", upload.array("files", 10), (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    const urls = files.map((f) => ({
      url: `/uploads/${f.filename}`,
      filename: f.filename,
      originalName: f.originalname,
      size: f.size,
    }));
    res.json({ success: true, files: urls });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

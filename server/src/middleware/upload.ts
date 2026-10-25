import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import fs from "fs";

export const uploadsDirectory = path.resolve(process.env.UPLOADS_DIR || path.join(__dirname, "../../uploads"));
fs.mkdirSync(uploadsDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDirectory);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

export const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const allowed = /^(\.jpe?g|\.png|\.gif|\.webp|\.pdf|\.xlsx?|\.mp4|\.webm|\.ogg|\.ogv)$/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = /^(image\/(jpeg|png|gif|webp)|application\/(pdf|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet)|video\/(mp4|webm|ogg))$/.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error("Only images, PDFs, Excel, and video files are allowed"));
  },
  limits: { files: 1, fileSize: 50 * 1024 * 1024 },
});

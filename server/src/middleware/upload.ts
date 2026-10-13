import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import fs from "fs";

const getUploadsDir = () => {
  const dir = path.resolve(__dirname, "../../uploads");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, getUploadsDir());
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB - allow unconstrained uploads
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg|pdf|xlsx|xls|mp4/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error("Only images, PDFs, Excel, and video files are allowed"));
  },
});

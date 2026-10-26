import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "server/.env") });

import express from "express";
import { randomBytes } from "crypto";
import { DatabaseSessionStore } from "./sessionStore";
import { sameOrigin } from "./middleware/auth";
import { adminApiGuard } from "./security/apiPermissions";
import securityRoutes from "./routes/security";
import { uploadsDirectory } from "./middleware/upload";
import session from "express-session";

import authRoutes from "./routes/adminAuth";
import newsRoutes from "./routes/news";
import eventsRoutes from "./routes/events";
import announcementsRoutes from "./routes/announcements";
import heroSlidesRoutes from "./routes/heroSlides";
import enquiriesRoutes from "./routes/enquiries";
import applicationsRoutes from "./routes/applications";
import facultyRoutes from "./routes/faculty";
import placementsRoutes from "./routes/placements";
import eventRegistrationsRoutes from "./routes/eventRegistrations";
import contactsRoutes from "./routes/contacts";
import programsRoutes from "./routes/programs";
import certificationsRoutes from "./routes/certifications";
import pagesRoutes from "./routes/pages";
import homepageSectionsRoutes from "./routes/homepageSections";
import configRoutes from "./routes/config";
import uploadRoutes from "./routes/upload";
import cmsRoutes from "./routes/cms";
import pageBuilderRoutes from "./routes/pageBuilder";
import codePagesRoutes from "./routes/codePages";
import mediaRoutes from "./routes/media";
import academicDocumentsRoutes from "./routes/academicDocuments";

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    if (!req.secure) return res.status(426).json({ error: "HTTPS is required" });
  }
  next();
});
app.use("/api", (_req, res, next) => { res.setHeader("Cache-Control", "no-store"); next(); });
app.use("/api", sameOrigin);
const configuredSessionSecret = process.env.SESSION_SECRET;
if (process.env.NODE_ENV === "production" && (!configuredSessionSecret || configuredSessionSecret.length < 32)) {
  throw new Error("Configure SESSION_SECRET with at least 32 characters before starting the production server");
}
const sessionSecret = configuredSessionSecret && configuredSessionSecret.length >= 32
  ? configuredSessionSecret : randomBytes(32).toString("hex");
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(
  session({
    secret: sessionSecret || randomBytes(32).toString("hex"),
    store: new DatabaseSessionStore(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use("/api", adminApiGuard);
app.get("/uploads/chalapathi-campus-intro.mp4", (req, res, next) => {
  const stablePath = path.join(uploadsDirectory, "chalapathi-campus-intro.mp4");
  const fallbackPath = path.resolve(__dirname, "../../public/chalapathi-campus-intro.mp4");
  const filePath = fs.existsSync(stablePath) ? stablePath : fallbackPath;
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.sendFile(filePath, { cacheControl: false }, error => { if (error) next(error); });
});

app.use("/uploads", express.static(uploadsDirectory, {
  maxAge: "30d", immutable: true, dotfiles: "ignore",
  setHeaders: res => { res.setHeader("X-Content-Type-Options", "nosniff"); }
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/security", securityRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/announcements", announcementsRoutes);
app.use("/api/hero-slides", heroSlidesRoutes);
app.use("/api/enquiries", enquiriesRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/placements", placementsRoutes);
app.use("/api/event-registrations", eventRegistrationsRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/programs", programsRoutes);
app.use("/api/certifications", certificationsRoutes);
app.use("/api/pages", pagesRoutes);
app.use("/api/homepage-sections", homepageSectionsRoutes);
app.use("/api/config", configRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/cms", cmsRoutes);
app.use("/api/page-builder", pageBuilderRoutes);
app.use("/api/code-pages", codePagesRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/academic-documents", academicDocumentsRoutes);

app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Request rejected");
  res.status(error.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({ error: "Upload or request rejected. Check the file type and size." });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;

if (require.main === module) app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

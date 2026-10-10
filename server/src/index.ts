import express from "express";
import cors from "cors";
import session from "express-session";
import path from "path";
import fs from "fs";

import authRoutes from "./routes/auth";
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

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(
  session({
    secret: "chalapathi-super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set to true in prod with https
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/auth", authRoutes);
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

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
